# CP1 - Register a customer and refresh the customer list

## Business goal and scope

Allow a By_Sellens store operator to register a customer and see the updated customer list, so the customer can be identified when managing beauty-product sales. Sales integration is outside this journey.
Start: submit the new-customer form. End: the refreshed list is displayed, or validation, saving, or refresh fails. Opening the page and its initial list load are outside the trace.

## Evidence and implementation status

Source snapshot: `bysellens-customer-portal`, `develop`, commit `537742fa9b9329d22b5fd5bf59eb3141ac8d2dd6`.
The team documentation repository returned 404 through the available connection; its product and architecture sections could not be verified. The portal README contains unrelated template references, so the implementation below is the source of truth for this map.

| Component | Evidence | Current status |
| --- | --- | --- |
| `ClienteForm` | `src/components/ClienteForm.tsx`: `guardar`, `onGuardar` | Implemented React form; validates required fields and an email containing `@`, then trims inputs. |
| `Clientes` | `src/pages/Clientes.tsx`: `guardarCliente`, `cargarClientes` | Implemented React page; selects create/update, handles save errors and refreshes the list. |
| `clienteService` | `src/services/clienteService.ts`: `crearCliente`, `listarClientes` | Implemented frontend adapter; selects MOCK or the configured HTTP client. |
| `mockClientes` | `src/services/mock.ts`: `guardar`, `listar` | Implemented local MOCK; uses shared `leer`, `guardar`, and `siguiente` helpers. Not a network service. |
| `@bysellens/frontend-core` | Imports in `mock.ts`, `clienteService.ts`, and `configurar.ts` | Existing shared dependency for configuration, API access and MOCK storage; service tests assert localStorage persistence. |
| Customer HTTP backend | Adapter declares `POST /api/clientes` and `GET /api/clientes` | No backend implementation in this inspected portal snapshot; a running backend is unverified. REAL tests stub HTTP responses. |
| Trace instrumentation | Proposed spans and propagation below | Design only; not implemented by CP1 or demonstrated in the inspected source files. |

These are real software components within one browser application, not three deployed microservices. Configuration defaults to MOCK unless `VITE_DATA_MODE` is `real`.

## Call table

Current calls contain no demonstrated trace context. The last column specifies proposed instrumentation only. Customer data refers to the application payload, never span attributes.

| Step | Caller | Receiver | Protocol / operation | Execution | Data touched | Proposed context |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Operator | `ClienteForm.guardar` | Browser click; validate fields | Synchronous | Form fields | Start root span R; child V. |
| 2 | `ClienteForm` | `Clientes.guardarCliente` | JS callback `onGuardar(datos)` | Sync callback starts async handler | Trimmed `ClienteRequest` | R remains active; child G. |
| 3 | `Clientes` | `clienteService.crearCliente` | JS function, awaited Promise | Asynchronous | Customer request | Child C under G; preserve context across await. |
| 4 | `clienteService` | `mockClientes.guardar` | Local async function in MOCK mode | Promise; internal storage work is synchronous | `datos.clientes`; generated ID | Child M under C; same trace ID. |
| 5 | `mockClientes` | Shared MOCK helpers | `leer`, `siguiente`, `guardar` | Synchronous | Shared localStorage-backed state | Child W under M; no HTTP header. |
| 6 | `Clientes` | `clienteService.listarClientes` | `cargarClientes` after success alert and closing form | Async refresh; currently not awaited by `guardarCliente` | Customer collection | Child L under R; explicitly retain R for detached refresh. |
| 7 | `clienteService` | `mockClientes.listar` | Local Promise and `leer().clientes` | Async result, local read | Customer collection | Child Q under L; same trace ID. |
| 8 | `cargarClientes` | React customer list | `setClientes(respuesta)` and render | State update / scheduled render | In-memory list | Finish R after refresh render; new render instrumentation required. |

REAL alternative to steps 4-5: `crearCliente` calls `api.post('/api/clientes', cliente)`; alternative to step 7: `obtenerClientes` calls `api.get('/api/clientes')`. `listarClientes` is its alias. These client paths exist; backend handlers and storage are not established by this evidence.

## Sequence diagram

The calls are implemented; annotations describe proposed context. `ctx` means an in-process active span context, not an existing function parameter or header. No broker is involved.

```mermaid
sequenceDiagram
    actor Operator
    participant Form as ClienteForm
    participant Page as Clientes
    participant Service as clienteService
    participant Mock as mockClientes
    participant Core as frontend-core MOCK helpers
    Operator->>Form: Submit form (start R; no incoming traceparent)
    Form->>Form: Validate (ctx R to V)
    alt Invalid form
        Form-->>Operator: Validation alert (ctx R; end trace)
    else Valid form
        Form->>Page: onGuardar (ctx R to G)
        Page->>Service: crearCliente (ctx G to C; await)
        Service->>Mock: guardar (ctx C to M; MOCK)
        Mock->>Core: leer, siguiente, guardar (ctx M to W)
        Core-->>Mock: Stored state (ctx W to M)
        Mock-->>Service: Customer result (ctx M to C)
        Service-->>Page: Promise resolves (ctx C to G)
        Page-->>Operator: Success alert (ctx G)
        Page->>Page: Close form; cargarClientes (ctx R retained)
        Page->>Service: listarClientes (ctx R to L; detached refresh)
        Service->>Mock: listar (ctx L to Q)
        Mock->>Core: leer (ctx Q)
        Core-->>Mock: Customer list (ctx Q)
        Mock-->>Service: List result (ctx Q to L)
        Service-->>Page: List result (ctx L to R)
        Page-->>Operator: Updated list rendered (ctx R; end trace)
    end
```

Save rejection follows the existing `guardarCliente` catch: show failure alert, retain the form, and skip refresh. Refresh rejection follows `cargarClientes` catch: write a console error; the success alert has already occurred. Neither branch implies a backend response in MOCK mode.

## Proposed span tree

All nodes share a newly generated trace ID T; each letter denotes a different span ID. These are planned spans, not captured telemetry.

- R `customer.register_and_refresh` (root; browser interaction through refresh render)
  - V `ClienteForm.validate` (ends before the callback; invalid input stops here)
  - G `Clientes.guardarCliente` (save handler)
    - C `clienteService.crearCliente` (crosses the awaited Promise boundary)
      - M `mockClientes.guardar` (MOCK branch)
        - W `frontend-core.mock.write` (local read, ID allocation and save)
  - L `clienteService.listarClientes` (refresh; may overlap completion of G)
    - Q `mockClientes.listar` (includes the shared local read)

Keep R open until refresh settles and, on success, the list render completes. Bind the detached `cargarClientes` task explicitly to R; otherwise it may become an unrelated trace. A Promise boundary is asynchronous execution inside the browser, not asynchronous messaging between services.

In REAL mode, replace M/W with a CLIENT span for the existing `POST /api/clientes`, and Q with a CLIENT span for `GET /api/clientes`. A future backend SERVER span would be a child of the corresponding CLIENT span only after a backend is implemented and instrumented. No backend internals or database spans are claimed.

## Trace identifiers and proposed HTTP propagation

`trace_id` identifies the entire operation (32 lowercase hexadecimal characters, nonzero). `span_id` identifies one operation inside that trace (16 lowercase hexadecimal characters, nonzero); children retain T and record their parent's span ID.
The W3C `traceparent` header has the form `version-trace-id-parent-id-trace-flags`. Its parent ID is the sending CLIENT span ID; a receiving server creates its own span ID. See the [W3C Trace Context specification](https://www.w3.org/TR/trace-context/).
For local React callbacks, storage calls and Promise continuations, propagate active context in memory; do not fabricate HTTP headers. Proposed REAL propagation: inject `traceparent` on the existing POST and GET calls, retaining T but using a different sending span ID per request. A future backend must validate/extract it; absent or invalid context starts a new trace. Cross-origin header permission must also be configured before this can work.
No RabbitMQ integration, domain event, message headers or backend persistence is evidenced in this journey. The workshop's asynchronous boundary is represented here by Promise execution; a broker span cannot honestly be supplied from this implementation.

## Success, errors and privacy

- Success: valid input reaches MOCK storage, a new ID is assigned, the success alert appears, the form closes and the refreshed list includes the customer. The service tests assert MOCK persistence without HTTP calls.
- Validation rejection: a missing required field or email without `@` triggers an alert; `onGuardar` is not called. Record a validation outcome on V without recording field values.
- Save failure: rejected creation is caught by the page; the form remains available and refresh is skipped. Record failure on the save span and root. The page tests cover rejected saves with a stubbed service.
- Refresh failure: saving may have succeeded while the list remains stale. `cargarClientes` catches the error separately; proposed R must report partial failure rather than treating the earlier alert as end-to-end success.
- REAL failure: service tests simulate a rejected HTTP 400 and preserve the error; this is test evidence, not proof of a deployed server or an implemented timeout policy.
- Keep names, phone numbers, email addresses, addresses, credentials, tokens and full request/response bodies out of telemetry. Use operation names, mode and bounded outcomes; trace IDs must not encode customer data.

## Concrete source references

All implementation references are pinned to the inspected snapshot; existing tests were reviewed as evidence, not executed for this documentation change.

- [ClienteForm validation and callback](https://github.com/code-corhuila/bysellens-customer-portal/blob/537742fa9b9329d22b5fd5bf59eb3141ac8d2dd6/src/components/ClienteForm.tsx)
- [Clientes save, refresh and error handling](https://github.com/code-corhuila/bysellens-customer-portal/blob/537742fa9b9329d22b5fd5bf59eb3141ac8d2dd6/src/pages/Clientes.tsx)
- [Customer service paths and mode selection](https://github.com/code-corhuila/bysellens-customer-portal/blob/537742fa9b9329d22b5fd5bf59eb3141ac8d2dd6/src/services/clienteService.ts)
- [Local MOCK implementation](https://github.com/code-corhuila/bysellens-customer-portal/blob/537742fa9b9329d22b5fd5bf59eb3141ac8d2dd6/src/services/mock.ts)
- [MOCK storage and stubbed REAL contract tests](https://github.com/code-corhuila/bysellens-customer-portal/blob/537742fa9b9329d22b5fd5bf59eb3141ac8d2dd6/src/services/clienteService.test.ts)
- [Customer page behavior tests](https://github.com/code-corhuila/bysellens-customer-portal/blob/537742fa9b9329d22b5fd5bf59eb3141ac8d2dd6/src/pages/Clientes.test.tsx)
- [Runtime configuration](https://github.com/code-corhuila/bysellens-customer-portal/blob/537742fa9b9329d22b5fd5bf59eb3141ac8d2dd6/src/configurar.ts)
