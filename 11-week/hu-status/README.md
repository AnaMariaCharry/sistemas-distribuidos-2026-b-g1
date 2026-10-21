<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       11-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 11

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Ana Maria Charry Forero 
- GITHUB_USER: AnaMariaCharry
- TEAM: By_Sellens
- SPRINT_GOAL: Improve observability in the Customer module through distributed tracing, structured JSON logs, automated tests, and monitoring metrics.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
|  CP0 | Initialize Week 11 observability workshop | done | https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/e3bdf6d98d8eb42e5bdfe4180f269d38d9a589d0 |
|  CP1 | Map Customer critical journey | done | https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/9ef29317d524eed715b87492c2ed75ecb2878f63 |
|  CP2 | Define Customer structured JSON log contract | done | https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/847e0590e88ded436c960b18a85c74c6890abfc4 |
|  CP3-A | Implement Customer trace context and JSON logging | done | https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/2f67db39d0860a7a8c033a0a5bdf11a9c83cc4f6 |
|  CP3-B | Add Customer context propagation, metrics, and tests | done | https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/292631e219483638f517b9b645a3d14f1bfcf3ec |
|  CP4 | Define Customer golden signals and metrics catalog | done | https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/93955d05069b3928ae75266e96f4a2dc52198147 |

## 2. My individual contribution
- Documented the customer registration and list refresh journey using ClienteForm, Clientes, clienteService, and mockClientes.
- Defined a structured JSON logging contract with seven examples and privacy rules.
- Implemented a standalone TypeScript observability demonstration with distributed tracing, HTTP context propagation, counters, and latency histograms.
- Completed six automated tests successfully.
- Documented the four golden signals and proposed PromQL monitoring queries.

## 3. Blockers and risks
- The Customer module currently uses MOCK services instead of a verified backend.
- Observability instrumentation is implemented as a standalone demonstration.
- The team documentation repository was unavailable during verification.
- A temporary GitHub TLS connection issue delayed the first CP3 push but was resolved.


## 4. Plan for next week
- Continue the remaining observability checkpoints.
- Define service-level objectives and alerting rules.
- Prepare an incident response runbook and simulation.
- Evaluate future integration with the Customer Portal.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [ ] No secrets; config via environment variables

## 6. Evidence links
- CP0 - Initialize observability workshop:
  https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/e3bdf6d98d8eb42e5bdfe4180f269d38d9a589d0

- CP1 - Customer critical journey:
  https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/9ef29317d524eed715b87492c2ed75ecb2878f63

- CP2 - Structured JSON log contract:
  https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/847e0590e88ded436c960b18a85c74c6890abfc4

- CP3-A - Trace context and JSON logging:
  https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/2f67db39d0860a7a8c033a0a5bdf11a9c83cc4f6

- CP3-B - Context propagation, metrics, and tests:
  https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/292631e219483638f517b9b645a3d14f1bfcf3ec

- CP4 - Four golden signals and metrics catalog:
  https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/93955d05069b3928ae75266e96f4a2dc52198147

- Individual GitHub repository:
  https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1

- Week 11 workshop:
  https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/tree/main/11-week/workshop 
