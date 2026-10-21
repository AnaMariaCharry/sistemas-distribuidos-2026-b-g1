# CP9 - Incident Drill and Blameless Postmortem

## Scope, source contracts and minimal assumptions

This is an analytical, synthetic drill, not an observed incident or an executed fault injection. The official scenario is unchanged: a downstream dependency takes 3 seconds for 25% of its requests during 40 minutes. Only this document is created; no Customer code, MOCK data, earlier checkpoint, personal reflection or deployment is changed.
[CP1](01-journey.md) lists multiple hops without explicitly selecting one incident bottleneck. The minimal drill selection is its existing step 4: `clienteService.crearCliente` -> `mockClientes.guardar` (span M), which uses shared MOCK helpers. The affected population is requests to this create dependency, not all create-plus-refresh operations. This is a local asynchronous MOCK call, not an invented backend, HTTP error or RabbitMQ integration.
Model M as returning after exactly 3,000 ms for 25% of create calls throughout minutes [0,40). Assume the other 75% and all refresh calls finish within 0.5 s, with no additional failures, retries, validation rejections or lost writes. All saves and subsequent refresh/render completions eventually succeed. These isolate latency; the scenario supplies no timeout or failure probability. Attribute attempts to the incident cohort and allow in-flight completions after its end.
Use [CP6](05-slo.md)'s hypothetical uniform active-hour traffic: 40 registrations/day over 8 hours, one create and one refresh per journey. This drill falls entirely within active hours. CP3's separate simulated HTTP adapter is not wired to this MOCK call; comparisons with adapter SLIs below model how analogous future integrated observations would classify these operations. No metric increments or production time series were captured.

## One synthetic slow trace

All spans share trace ID `8a9b0c1d2e3f405162738495a6b7c8d9`. IDs map to CP1's R/V/G/C/M/W/L/Q tree; intervals are milliseconds relative to submission, with end exclusive. Duration = end - start; children are contained within parents, and sequential siblings do not imply summed overlapping durations.

```text
R customer.register_and_refresh  2000000000000001  [0,3030)     3030 ms
  V ClienteForm.validate        2000000000000002  [1,2)           1 ms
  G Clientes.guardarCliente     2000000000000003  [3,3014)     3011 ms
    C clienteService.crearCliente 2000000000000004 [8,3012)    3004 ms
      M mockClientes.guardar    2000000000000005  [10,3010)    3000 ms
        W frontend-core.mock.write 2000000000000006 [3008,3009) 1 ms
  L clienteService.listarClientes 2000000000000007 [3016,3026)  10 ms
    Q mockClientes.listar       2000000000000008  [3017,3024)     7 ms
```

The injected analytical wait is inside M before its short storage work W; it does not assert that real localStorage blocks for 3 seconds. R remains open through the detached refresh and render completion at 3030 ms. No child exceeds its parent. No HTTP span or `traceparent` header is invented for an in-process call; CP3's HTTP propagation demonstration remains separate.

## Exactly four synthetic CP2 JSON log lines

Each line uses the existing CP2 event/message catalog and required fields; no new event or error is fabricated. These are selected records, not an exhaustive span export. They end with save acknowledgement; unlogged refresh/render completion is represented by the synthetic trace, not inferred from the last log. Timestamps use an arbitrary synthetic UTC origin; durations are elapsed time within the emitting span.

```json
{"timestamp":"2026-10-21T15:00:00.000Z","level":"INFO","service":"bysellens-customer-portal","version":"synthetic-cp9","environment":"test","trace_id":"8a9b0c1d2e3f405162738495a6b7c8d9","span_id":"2000000000000001","correlation_id":"interaction-cp9-demo","event":"customer.registration.started","message":"Customer registration started","duration_ms":0,"module":"customer","operation":"register_and_refresh","data_mode":"mock","outcome":"started","component":"ClienteForm","list_state":"not_refreshed"}
{"timestamp":"2026-10-21T15:00:00.002Z","level":"DEBUG","service":"bysellens-customer-portal","version":"synthetic-cp9","environment":"test","trace_id":"8a9b0c1d2e3f405162738495a6b7c8d9","span_id":"2000000000000002","correlation_id":"interaction-cp9-demo","event":"customer.validation.passed","message":"Customer form validation passed","duration_ms":1,"module":"customer","operation":"validate","data_mode":"mock","outcome":"success","component":"ClienteForm","list_state":"not_refreshed"}
{"timestamp":"2026-10-21T15:00:03.010Z","level":"INFO","service":"bysellens-customer-portal","version":"synthetic-cp9","environment":"test","trace_id":"8a9b0c1d2e3f405162738495a6b7c8d9","span_id":"2000000000000005","correlation_id":"interaction-cp9-demo","event":"customer.mock_save.completed","message":"Customer saved in MOCK storage","duration_ms":3000,"module":"customer","operation":"create","data_mode":"mock","outcome":"success","component":"mockClientes","list_state":"not_refreshed"}
{"timestamp":"2026-10-21T15:00:03.014Z","level":"INFO","service":"bysellens-customer-portal","version":"synthetic-cp9","environment":"test","trace_id":"8a9b0c1d2e3f405162738495a6b7c8d9","span_id":"2000000000000003","correlation_id":"interaction-cp9-demo","event":"customer.registration.saved","message":"Customer save confirmed before list refresh","duration_ms":3011,"module":"customer","operation":"create","data_mode":"mock","outcome":"success","component":"Clientes","list_state":"not_refreshed"}
```

## Traffic, SLIs and impact calculations

Registration/create rate = 40 / 480 = 1/12 per active minute; refresh rate is also 1/12, so aggregate operation rate is 1/6 per minute. Over 40 minutes: expected creates = 40/12 = 10/3 (3.3333); expected refreshes = 10/3; total = 20/3 (6.6667). Slow dependency calls = 25% x 10/3 = 5/6 (0.8333); they are 12.5% of aggregate operations, not 25% of that larger denominator.
These fractional counts are expectations under CP6's planning rate, not realizable observed event counts. Exact integer arrivals, slow-call assignment and histogram samples are unknown; a small actual sample cannot be assigned these exact ratios automatically. Do not round 0.8333 into a fabricated observed incident count or change the 25% dependency scenario.

| CP6 SLI / SLO | Incident-cohort analytical value | Comparison and rolling-window limitation |
| --- | --- | --- |
| A: successful operations / completed operations; >=99% | 100%, since no failures are added. | No availability impact in this isolated model; a 40m cohort is not a measured 30d SLI. |
| B: operations <=0.5 s / all completed operations; >=95% | (20/3 - 5/6) / (20/3) = 7/8 = 87.5%. Create-only timely fraction is 75%; refresh is 100%. | Incident cohort misses the latency objective. CP4's histogram has no operation label; these per-operation fractions are analytical, not directly queryable from it. |
| C: complete successful journeys / confirmed-save journeys; >=99.5% | 100% eventual save-and-refresh success under the explicit assumptions. | CP6 defines no freshness deadline; delayed eventual success is not `partial_failure`. The journey counter remains proposed. |

If the rest of a forecast 30-day window is entirely timely and successful, B becomes (2400 - 5/6) / 2400 = 99.96528%, above 95%. This extra baseline assumption is illustrative only; without the remaining window's data, actual 30-day compliance is undetermined. A/C likewise have no measured rolling result. Do not mistake the cohort latency miss for proof of a monthly breach.
An analogous 3.004 s create-adapter observation would be outside CP3's `le="0.5"` bucket but inside `le="5"` and `+Inf`. The MOCK trace itself did not execute that adapter or generate these observations.

### Budget consumption and minute equivalents

CP6 forecast budgets are A: 24 failed operations, B: 120 slow operations and C: 6 bad post-save journeys. Incident contributions are A = 0 and C = 0, hence zero consumption and zero equivalent minutes for those budgets.
B contributes 5/6 slow operations: (5/6) / 120 = 1/144 = about 0.69444% of its forecast monthly latency budget. Equivalent active minutes = (5/6) / (1/6 operation per minute) = 5 minutes, also (1/144) x CP6's 720-minute latency budget. Calendar-normalized equivalent = (1/144) x 2160 = 15 minutes; neither is downtime or added user waiting time.
Equivalently, aggregate latency bad fraction 0.125 / allowed 0.05 = 2.5x latency-budget burn; 2.5 x 40 / 14400 = 1/144 of the active-time-normalized monthly budget. The full incident still lasts 40 minutes. Active/calendar equivalents use different uniform-traffic normalizations and must not be added. No previous consumption is known and the objectives' budgets remain separate.

## Exact CP7 alert assessment

[CP7](06-alerts.yml) evaluates `sum(rate(customer_operations_total{outcome="failure"}[W])) / sum(rate(customer_operations_total[W])) / 0.01`, not histogram latency or the fraction of slow requests. With a healthy sampled zero-failure baseline and this isolated successful-but-slow scenario, the numerator is zero in every relevant window and burn = 0. If a zero failure series is absent, the expression is absent rather than a fabricated positive burn.

| Rule | Required condition | Evaluation and confirmation | First firing minute caused by this scenario |
| --- | --- | --- | --- |
| Fast | Burn >14.4 in both 1h and 5m; failure fraction >14.4% | Evaluate every 30s; short-window confirmation; `for: 0m` adds no pending delay. | None: 0 >14.4 is false throughout and after [0,40). |
| Slow | Burn >6 in both 6h and 30m; failure fraction >6% | Same 30s evaluation; short-window confirmation; `for: 0m`. | None: 0 >6 is false throughout and after [0,40). |

There is no first CP7 alert and no firing minute for this latency-only scenario. Existing prior failures could change a real alert's state, but no such history is provided or invented. Missing data or no traffic is not healthy evidence. No new latency alert is introduced to force a desired result; monitoring coverage is an improvement below.

## Runbook application and blameless timeline

[CP8](07-runbook.md)'s first mitigation, "prevent duplicate attempts in the affected session", can reduce secondary duplicate submissions while a slow save completes. It does not shorten the 3-second response. Its second action permits one read-only reload only after confirmed save and no unsaved form input; reloading during a pending save is not a cure. Third-action manual containment can reduce new exposure if separately authorized, at the cost of registration availability, but cannot repair dependency latency.
Thus no existing runbook step is proven to stop the underlying delay. Preserve the mandatory 40-minute unmitigated analytical exposure for the calculations above; do not claim that containment was executed earlier and still count the same traffic. In this model the imposed delay ends at minute 40, not because of a verified rollback, circuit breaker or repair.

| Relative time | Analytical timeline / proposed response |
| --- | --- |
| Before 0 | Reference CP6 active-hour rate and an otherwise healthy baseline for illustration; no observed production state. |
| 0 | Begin the 40m scenario: 25% of calls to M take exactly 3 s; no error injection. |
| Between 0 and 40, exact arrival minute unknown | A slow trace could reveal increased save duration; CP7 error alerts do not detect it. No fabricated operator detection time is assigned. |
| Upon a reported slow save, time unspecified | Proposed response: apply CP8 mitigation 1, retain save context and confirm outcome; engage Customer maintainer and coordinator if impact persists. This is a decision path, not an executed intervention. |
| 40 | The imposed degradation interval ends; in-flight slow calls may still complete afterward. No CP7 alert has been triggered by the scenario. |
| After 40 | Proposed verification: check timing and visible refresh with authorized synthetic inputs, collection coverage and CP6 latency as well as availability; report recovery unverified until evidence exists. |

## Blameless postmortem and improvement stories

Root cause in the scenario is the imposed 3-second response time in `mockClientes.guardar` for one quarter of dependency calls. The physical cause of such a delay is unspecified; no real storage, network, database or person is blamed. The analytical impact is delayed registration feedback, not failed saves, data loss or proven duplicates.
Contributing conditions: CP3 is not integrated into the portal; CP7 only detects availability burn; CP8's alert-clear checks cannot rule out latency degradation; CP1's detached refresh requires explicit root tracking; low planning volume limits exact counts and short-window interpretation. CP6's eventual freshness SLI has no deadline, so it does not expose this wait by itself.

| Improvement story | Measurable acceptance criteria for a future authorized change |
| --- | --- |
| As a Customer module maintainer, I want an injectable asynchronous dependency-delay test, so that slow successful saves are distinguishable from failed saves. | In an isolated test, exactly one of four synthetic create-dependency calls completes after a controlled 3000 ms delay using a deterministic clock; all complete successfully. Each journey then refreshes once; trace IDs/parentage are preserved and no customer payload is logged. No real MOCK records are modified. |
| As a By_Sellens reliability maintainer, I want separate latency-budget detection, so that successful-but-slow operations are not invisible to monitoring. | In a future rule test using the CP4 histogram, a deterministic fixture with 4 creates (1 slow) and 4 timely refreshes gives 7/8 timely overall and 100% availability. Tests show the existing CP7 alerts stay inactive, and a separately reviewed latency proposal detects its configured condition without treating slow calls as HTTP errors. No CP7 rule is changed by CP9. |
| As a Customer operator, I want explicit pending-save guidance and latency recovery checks, so that I avoid duplicate submissions while waiting. | A future UI test shows repeat submission is prevented during a pending save without discarding input; after success it permits one refresh and shows the updated list. An authorized runbook revision must distinguish availability recovery from <=0.5 s latency compliance and identify the approved response owner; no unverified deployment mechanism is required. |

## Evidence and validation limits

References: [CP1 dependency/tree](01-journey.md), [CP2 event/schema catalog](02-log-contract.md), [CP3 trace/logger](03-instrumentation/trace.ts), [CP3 adapter/metrics](03-instrumentation/customer-http.ts), [CP4 histogram semantics](04-metrics.md), [CP6 SLOs/traffic/budgets](05-slo.md), [CP7 policy](06-alert-policy.md) and [CP8 mitigations](07-runbook.md).
Local checks parse the four JSON records, compare event fields with CP2, verify IDs/timestamps/span intervals, recompute expected traffic/SLIs/budgets, and evaluate the zero-failure alert inequalities. This is analytical validation, not Prometheus execution, live incident evidence or newly implemented test infrastructure. `promtool` and a connected monitoring service remain unavailable. No CP0-CP8 file, reflection or CP10 deliverable is modified. The required future commit message is exactly `docs(w11): run incident drill and postmortem`.
