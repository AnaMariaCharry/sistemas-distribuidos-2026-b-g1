# Customer instrumentation laboratory

Standalone TypeScript code for the CP1 journey and CP2 contract. It does not modify the Customer Portal or provide a deployed Customer backend. No OpenTelemetry SDK/exporter is installed; this small laboratory implements explicit W3C v00 context and JSON logging directly.

Prerequisites: Node.js 20 or newer and TypeScript 5 or newer (`tsc` on PATH). No local dependencies or installation step are required when these tools are installed. Otherwise install TypeScript with `npm install --global typescript`.

From `11-week/workshop/03-instrumentation/`:

```powershell
npm run build
npm test
node build/demo.js
```

The generic `withTrace` filter reads or creates context and returns a response header. Pass spans explicitly to callbacks and children across awaits; no shared mutable current-span variable is used. Invalid/unsupported headers start a new trace. Only W3C version 00 is accepted. The logger emits CP2's fixed event catalog in MOCK/test mode with build identifier `cp3-local`; it accepts no customer payload or raw exception.

Source elements: `ClienteForm.guardar`, `Clientes.guardarCliente`, `clienteService.crearCliente`, and `mockClientes.guardar`, as verified in CP1. This laboratory has no React rendering integration. Personal reflection must be written separately by the student.

Verified on this Windows machine: Node.js `v20.20.2`, TypeScript `5.8.3`. The initial wildcard test command failed on Windows; automatic Node test discovery corrected it. Actual CP3-A test summary (timing lines omitted):

```text
1..3
# tests 3
# suites 0
# pass 3
# fail 0
# cancelled 0
# skipped 0
# todo 0
```

## CP3-B: simulated HTTP propagation and metrics

After `npm test`, run `node build/http-demo.js`. No dependencies were added. `customerHttp` builds a real Fetch `Request` for the existing `/api/clientes` client path with POST/create or GET/refresh and injects the new CLIENT span's `traceparent`. An injected asynchronous transport returns a synthetic `Response` or rejects; it never calls `fetch` or contacts a server. The reserved `customer.invalid` host is a fixture, not a deployed API. Requests intentionally have no customer body; this tests instrumentation, not backend registration validation or actual customer persistence.

The simulated flow retains CP1 parentage R -> G -> C -> CLIENT for creation and R -> L -> CLIENT for refresh. The demo's successful save response and subsequent failed refresh are synthetic transport outcomes. CP2 logs remain MOCK/test records; no localStorage write or REAL backend integration is claimed. Errors are replaced with a fixed message without retaining raw exception data.

`CustomerMetrics.prometheus()` is the metrics exposure equivalent: it returns Prometheus text, printed by the demo, without introducing a server or `/metrics` endpoint. The counter labels are bounded operation/create-or-refresh and outcome/success-or-failure. The seconds-based cumulative histogram has 0.005, 0.05, 0.5, 5 and +Inf buckets, sum and count; each attempted transport records one observation, including failures. It measures adapter duration, not full browser rendering latency. Separate instances isolate test runs; no trace IDs or customer fields become labels.

Actual CP3-B console excerpts from `npm test` and `node build/http-demo.js` (variable timings and trace IDs omitted):

```text
1..6
# tests 6
# suites 0
# pass 6
# fail 0
# cancelled 0
# skipped 0
# todo 0
customer_operations_total{operation="create",outcome="success"} 1
customer_operations_total{operation="refresh",outcome="failure"} 1
customer_operation_duration_seconds_bucket{le="+Inf"} 2
customer_operation_duration_seconds_count 2
```
