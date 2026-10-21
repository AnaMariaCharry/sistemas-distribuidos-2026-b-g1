# CP2 - Customer JSON log contract

## Purpose and scope

This proposed contract follows [CP1: customer registration and customer list refresh](01-journey.md). JSON records allow filtering one interaction across `ClienteForm`, `Clientes`, `clienteService` and `mockClientes`, distinguishing a successful save from a failed refresh.
This is a design for future instrumentation, not captured production telemetry or an implemented logger. Customer currently supports local MOCK operations; configured REAL HTTP client paths do not establish a working backend. No database or RabbitMQ integration is assumed.
Emit one JSON object per line. Use the same schema in development, test and production; never emit free-form payload dumps. Examples below are synthetic MOCK records only.

## Standard fields

Every field marked required must appear, including on failures. Types are JSON types; durations are milliseconds measured with a monotonic clock. Timestamps use the UTC wall clock.

| Field | Type | Required | Purpose and constraints | Example |
| --- | --- | --- | --- | --- |
| `timestamp` | string | Yes | Event time as ISO-8601 UTC with milliseconds and `Z`; supports chronological investigation. | `2026-10-20T23:45:00.000Z` |
| `level` | string | Yes | Severity: `ERROR`, `WARN`, `INFO`, `DEBUG` only. | `INFO` |
| `service` | string | Yes | Stable logical application name, not a claim of a separate deployed backend. | `bysellens-customer-portal` |
| `version` | string | Yes | Build identifier assigned by the release process; examples use an explicitly synthetic value. | `synthetic-cp2` |
| `environment` | string | Yes | Runtime environment: `development`, `test`, `production`. | `test` |
| `trace_id` | string | Yes | Nonzero 32-character lowercase hexadecimal ID shared by the complete CP1 interaction. | `4bf92f3577b34da6a3ce929d0e0e4736` |
| `span_id` | string | Yes | Nonzero 16-character lowercase hexadecimal ID of the active emitting span. | `1000000000000001` |
| `correlation_id` | string | Yes | Random opaque interaction ID created at submission, independent of customer identifiers. | `interaction-demo-01` |
| `event` | string | Yes | Stable event name from the seven-event catalog below; enables exact filtering. | `customer.registration.started` |
| `message` | string | Yes | Fixed English explanation chosen from an allowlist; never interpolate customer values or raw errors. | `Customer registration started` |
| `duration_ms` | number | Yes | Finite nonnegative elapsed time since the emitting span started; zero is valid at start. | `12` |

## By_Sellens journey fields

All six fields are required. They describe this Customer workflow without identifying a person.

| Field | Type | Allowed values | Purpose |
| --- | --- | --- | --- |
| `module` | string | `customer` | Identify the By_Sellens bounded context. |
| `operation` | string | `register_and_refresh`, `validate`, `create`, `refresh` | Separate the full journey from validation, customer creation and list refresh. |
| `data_mode` | string | `mock`, `real` | Distinguish local MOCK behavior from the configured HTTP branch; not proof of backend availability. |
| `outcome` | string | `started`, `success`, `failure`, `partial_failure`, `rejected` | Report operation progress and distinguish a saved customer from an unsuccessful full journey. |
| `component` | string | `ClienteForm`, `Clientes`, `clienteService`, `mockClientes`, `frontend-core` | Locate the real component emitting the event. |
| `list_state` | string | `not_refreshed`, `refreshing`, `updated`, `stale` | Expose whether the post-save customer list reflects the successful write. |

Optional `error_code` is a string from `validation_rejected`, `mock_save_failed`, `mock_refresh_failed`, `refresh_failed_after_save`, `http_request_failed`, `unknown_failure`. It is required when outcome is `failure`, `partial_failure` or `rejected`, and omitted otherwise. Codes classify sanitized errors; they do not assert that those failures have occurred.

## Severity policy

| Level | When to use | Customer example |
| --- | --- | --- |
| `ERROR` | An attempted operation or the full journey cannot complete as intended. | List refresh fails after the customer was saved; log the refresh failure and the root partial-failure summary. |
| `WARN` | Expected validation rejection or recoverable degraded behavior requiring attention. | `ClienteForm` rejects a missing required field; use `validation_rejected` without recording its value. |
| `INFO` | Meaningful interaction boundaries and successful business transitions. | Registration starts, MOCK save completes, or the list refresh starts. |
| `DEBUG` | Diagnostic control-flow detail without customer values; disable by default in production. | Form validation passes before calling `guardarCliente`. |

Two ERROR records for a failed refresh and its root summary describe one underlying incident. Count root terminal events when measuring failed journeys; do not sum both as two customer failures. A rejected validation attempt is not an infrastructure error.

## Privacy and safe error handling

| Never record | Required treatment |
| --- | --- |
| Customer names, email addresses, phone numbers and addresses | Drop these fields entirely; use a fixed validation outcome instead of values, fragments or hashes. |
| Customer IDs or other personal identifiers | Omit them; correlate with random interaction and trace IDs only. |
| Passwords, access/refresh tokens, cookies, authorization headers, API keys or credentials | Exclude them at source and redact them from any diagnostic output before emission. |
| Full request/response bodies or personal information stored in MOCK | Never serialize payloads, `localStorage`, shared catalogs or customer objects. |
| Raw exception messages, stacks, HTTP error objects or arbitrary user input | Map to the allowlisted `error_code` and fixed message; discard unknown properties. |

Use a positive field allowlist when constructing each record; do not spread application objects into logs. For example, replace an exception from `cargarClientes` with `mock_refresh_failed` and `Customer list refresh failed`. Do not forward the existing raw `console.error` object into the proposed logger. Unknown errors receive `unknown_failure` without exception text. Enforce log access and retention limits appropriate to the deployment.

## Exactly seven synthetic JSON records

Scenario: valid input is saved in MOCK, then a hypothetical local read failure rejects list refresh. These events have not been observed or injected. No HTTP status, timeout, business-rule failure or retry is claimed. The two failure events describe the same refresh failure at different scopes, rather than incompatible save outcomes.
Event catalog and span mapping: R=`1000000000000001` (records 1 and 7), V=`1000000000000002` (2), G=`1000000000000003` (4), M=`1000000000000005` (3), L=`1000000000000007` (5 and 6). CP1 also defines C=`1000000000000004`, W=`1000000000000006` and Q=`1000000000000008`; those spans need not emit a log in this seven-record sample.

```json
{"timestamp":"2026-10-20T23:45:00.000Z","level":"INFO","service":"bysellens-customer-portal","version":"synthetic-cp2","environment":"test","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"1000000000000001","correlation_id":"interaction-demo-01","event":"customer.registration.started","message":"Customer registration started","duration_ms":0,"module":"customer","operation":"register_and_refresh","data_mode":"mock","outcome":"started","component":"ClienteForm","list_state":"not_refreshed"}
```

```json
{"timestamp":"2026-10-20T23:45:00.002Z","level":"DEBUG","service":"bysellens-customer-portal","version":"synthetic-cp2","environment":"test","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"1000000000000002","correlation_id":"interaction-demo-01","event":"customer.validation.passed","message":"Customer form validation passed","duration_ms":1,"module":"customer","operation":"validate","data_mode":"mock","outcome":"success","component":"ClienteForm","list_state":"not_refreshed"}
```

```json
{"timestamp":"2026-10-20T23:45:00.010Z","level":"INFO","service":"bysellens-customer-portal","version":"synthetic-cp2","environment":"test","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"1000000000000005","correlation_id":"interaction-demo-01","event":"customer.mock_save.completed","message":"Customer saved in MOCK storage","duration_ms":5,"module":"customer","operation":"create","data_mode":"mock","outcome":"success","component":"mockClientes","list_state":"not_refreshed"}
```

```json
{"timestamp":"2026-10-20T23:45:00.012Z","level":"INFO","service":"bysellens-customer-portal","version":"synthetic-cp2","environment":"test","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"1000000000000003","correlation_id":"interaction-demo-01","event":"customer.registration.saved","message":"Customer save confirmed before list refresh","duration_ms":9,"module":"customer","operation":"create","data_mode":"mock","outcome":"success","component":"Clientes","list_state":"not_refreshed"}
```

```json
{"timestamp":"2026-10-20T23:45:00.020Z","level":"INFO","service":"bysellens-customer-portal","version":"synthetic-cp2","environment":"test","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"1000000000000007","correlation_id":"interaction-demo-01","event":"customer.list_refresh.started","message":"Customer list refresh started","duration_ms":0,"module":"customer","operation":"refresh","data_mode":"mock","outcome":"started","component":"clienteService","list_state":"refreshing"}
```

```json
{"timestamp":"2026-10-20T23:45:00.028Z","level":"ERROR","service":"bysellens-customer-portal","version":"synthetic-cp2","environment":"test","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"1000000000000007","correlation_id":"interaction-demo-01","event":"customer.list_refresh.failed","message":"Customer list refresh failed","duration_ms":8,"module":"customer","operation":"refresh","data_mode":"mock","outcome":"failure","component":"clienteService","list_state":"stale","error_code":"mock_refresh_failed"}
```

```json
{"timestamp":"2026-10-20T23:45:00.030Z","level":"ERROR","service":"bysellens-customer-portal","version":"synthetic-cp2","environment":"test","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"1000000000000001","correlation_id":"interaction-demo-01","event":"customer.journey.partially_failed","message":"Customer saved but list refresh failed","duration_ms":30,"module":"customer","operation":"register_and_refresh","data_mode":"mock","outcome":"partial_failure","component":"Clientes","list_state":"stale","error_code":"refresh_failed_after_save"}
```

## Correlation and CP1 consistency

Filter all records by the shared `trace_id`, sort by `timestamp`, then group by `span_id`. `correlation_id` provides a stable interaction lookup; it is never a customer key. Multiple events may share one span ID: L starts then fails, and R starts then ends with partial failure.
CP1 parentage remains R -> V, R -> G -> C -> M -> W, and R -> L -> Q. Span parent relationships come from tracing metadata, not timestamp order; these logs alone do not reconstruct unlogged spans. No new backend or broker spans are introduced.
Retain the root context across callbacks and Promise continuations, including detached `cargarClientes`. Proposed instrumentation must observe its caught refresh error and end R with partial failure; it cannot infer full success from the earlier save alert. This requires instrumentation changes later, not changes delivered in CP2.
Inside the browser, propagate active context in memory; MOCK calls and storage helpers have no HTTP `traceparent`. A future instrumented REAL client would inject `traceparent` on the already-declared POST/GET `/api/clientes`, preserving the trace ID and using each sending CLIENT span ID as parent ID. A future receiving backend would extract that context and create its own SERVER span; neither backend availability nor that instrumentation is established here. [W3C Trace Context](https://www.w3.org/TR/trace-context/) defines the header format.

## Verified project references

These elements were already inspected in CP1 at Customer snapshot `537742fa9b9329d22b5fd5bf59eb3141ac8d2dd6`; no new team-repository access is needed for this contract.

- [`ClienteForm.guardar` and `onGuardar`](https://github.com/code-corhuila/bysellens-customer-portal/blob/537742fa9b9329d22b5fd5bf59eb3141ac8d2dd6/src/components/ClienteForm.tsx): required-field validation precedes submission.
- [`Clientes.guardarCliente` and `cargarClientes`](https://github.com/code-corhuila/bysellens-customer-portal/blob/537742fa9b9329d22b5fd5bf59eb3141ac8d2dd6/src/pages/Clientes.tsx): save handling and separate refresh error handling justify the partial-failure scenario.
- [`clienteService.crearCliente` and `listarClientes`](https://github.com/code-corhuila/bysellens-customer-portal/blob/537742fa9b9329d22b5fd5bf59eb3141ac8d2dd6/src/services/clienteService.ts): local MOCK branch and declared REAL client paths.
- [`mockClientes.guardar` and `listar`](https://github.com/code-corhuila/bysellens-customer-portal/blob/537742fa9b9329d22b5fd5bf59eb3141ac8d2dd6/src/services/mock.ts): customer storage helpers and local list read, not distributed backend calls.
