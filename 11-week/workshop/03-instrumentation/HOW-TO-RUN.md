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
