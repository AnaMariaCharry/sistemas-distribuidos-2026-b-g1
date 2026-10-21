# CP6 - SLIs, SLOs and Error Budget

## Scope and evidence status

By_Sellens Customer's critical journey is customer registration followed by customer list refresh. `ClienteForm` validates input; `Clientes.guardarCliente` calls `clienteService.crearCliente`, then starts `cargarClientes`; `mockClientes` provides the current local MOCK behavior. See [CP1](01-journey.md) and [CP2](02-log-contract.md).
All objectives and the budget policy below are proposals for a future integrated deployment, not achieved reliability or an approved team operating agreement. The student selected a hypothetical planning scenario of 40 registrations/day and 8 operating hours/day; it is not measured traffic. No personal reflection is authored here.

| Evidence layer | Current capability | SLO implication |
| --- | --- | --- |
| [CP3 `CustomerMetrics`](03-instrumentation/customer-http.ts) | Demonstrated in-memory `customer_operations_total{operation,outcome}` and classic `customer_operation_duration_seconds` histogram; simulated HTTP transport. | Supports local adapter demonstrations, not a production SLO assessment. |
| [CP4 catalog](04-metrics.md) | Proposed `customer_journeys_total{outcome}` and journey duration/rejection/concurrency metrics. | Journey-level SLI below requires instrumentation not yet implemented. |
| Future collection | No demonstrated Prometheus server, scrape endpoint, dashboard or verified backend. | Every PromQL expression is proposed, unexecuted against a server; no production results exist. |

## Measurement contract

Use a rolling 30-day window evaluated daily; a day is 24 hours, and the window therefore spans 43,200 calendar minutes. The planning scenario assumes 30 operating days, each with 8 active hours, giving 14,400 active minutes. Event-based SLIs evaluate actual eligible events in that window, not calendar uptime.
Scope collection to one comparable Customer deployment and one data mode. CP3 has no `data_mode`, `component` or `service` metric labels; do not add unsupported label selectors. An eventual collector must isolate synthetic traffic from real usage before any SLO is assessed.
For adapter SLIs, eligible events are completed `create`/`refresh` attempts for the already-declared POST/GET `/api/clientes` client paths. `success` means a successful HTTP response; `failure` means a non-2xx response or transport exception. This is operation availability, not durable database confirmation or full journey availability.
For journey metrics, emit one terminal root R outcome per submission: `success` = save confirmed and refreshed list rendered; `partial_failure` = save confirmed but refresh/render fails; `failure` = save fails; `rejected` = form validation rejects before save. Preserve root context through the detached refresh. No customer values or IDs become labels.
Missing collection, browser termination or indefinitely pending operations must not disappear as apparent successes. Coverage checks and an explicit terminal timeout/abandonment policy are prerequisites for credible deployment measurement; CP3 does not implement these. Zero eligible events or insufficient samples means unavailable assessment, not 100% compliance.

## Three proposed SLOs

| SLO | Good events / eligible events (SLI) | Objective | Window | Rationale and limitations |
| --- | --- | --- | --- | --- |
| A. Adapter operation availability | Successful create/refresh attempts / all completed create/refresh attempts. | At least 99% | Rolling 30 days | Initial learning-stage reliability target for the two Customer operations; requires stakeholder review and a real baseline. It does not certify that the new customer appears in the UI. |
| B. Adapter latency | Completed attempts taking at most 0.5 seconds / all completed attempts, including failures. | At least 95% within 0.5 seconds | Rolling 30 days | A proposed prompt-feedback goal for an operator workflow; 0.5 seconds is an exact existing bucket boundary. Not measured user tolerance; validate with store operators. Fast failures can pass latency, so A must also pass. |
| C. Post-save list freshness | Successful complete journeys / journeys with a confirmed save (`success` plus `partial_failure`). | At least 99.5% | Rolling 30 days | A saved customer should become visible in the refreshed list, avoiding operator uncertainty and repeated registration. Excludes failed saves and validation rejections; requires proposed root outcome instrumentation and render observation. |

The objectives are independent: passing adapter latency or availability does not imply freshness. The full CP1 root also includes validation and rendering, which the existing adapter histogram cannot measure.

### Exact proposed PromQL: A, operation availability

```promql
(sum(increase(customer_operations_total{outcome="success"}[30d])) or vector(0)) / sum(increase(customer_operations_total[30d]))
```

Compare the fraction with `0.99`. Both operations are included; use the same `operation` selector in numerator and denominator if inspecting them separately. `increase` is applied before aggregation to account for per-series counter resets.

### Exact proposed PromQL: B, latency compliance

```promql
sum(increase(customer_operation_duration_seconds_bucket{le="0.5"}[30d])) / sum(increase(customer_operation_duration_seconds_count[30d]))
```

Compare with `0.95`. Units are seconds; CP3 boundaries are `0.005`, `0.05`, `0.5`, `5`, `+Inf`, with `_sum` and `_count`. This histogram has no operation/outcome labels, so per-operation or success-only latency cannot be inferred. A bucket fraction directly measures the proposed objective; an interpolated p95 is not needed for this budget.

### Exact proposed PromQL: C, post-save freshness

```promql
(sum(increase(customer_journeys_total{outcome="success"}[30d])) or vector(0)) / sum(increase(customer_journeys_total{outcome=~"success|partial_failure"}[30d]))
```

Compare with `0.995`. This uses the proposed CP4 counter, not an implemented CP3 family. One successful save followed by failed refresh contributes one bad post-save journey, even if CP2 produces two ERROR logs. It is not a claim of a deployed freshness monitor.
The zero-numerator fallback is meaningful only with a positive, healthy denominator and complete collection. Never substitute a positive denominator or fabricate success during gaps. At low volume, `increase` may extrapolate fractional estimates; use audited event totals when exact integer compliance decisions matter.

## Traffic estimate and error-budget arithmetic

Planning assumptions approved for this exercise: 40 new-customer registrations/day, one create plus one refresh per successful journey, 8 active hours/day, 30 operating days/window, with no initial page loads, retries, unrelated refreshes or validation-rejected submissions counted in the forecast.
Thus N = 40 x 30 = 1,200 attempted registration journeys and an idealized failure-free N_ops = 2 x 1,200 = 2,400 adapter attempts. Baseline confirmed saves N_saved = 1,200. This is a small-store scenario, averaging 5 registrations and 10 adapter operations per active hour, not a statement about actual staffing or sales.
Actual adapter and confirmed-save denominators will differ when saves fail, refreshes are skipped or retries occur. Recompute budgets from measured eligible totals rather than treating this forecast as guaranteed volume.
For each SLO, allowed bad fraction b = 1 - target; event budget E = b x N_eligible; budget consumption = observed bad events / E. Keep each SLO's budget separate; they cannot be added or traded.

| SLO | Allowed bad fraction | Forecast eligible events | Allowed bad events | Equivalent active minutes at uniform forecast traffic | Calendar-normalized equivalent |
| --- | --- | --- | --- | --- | --- |
| A. Availability | 0.01 (1%) | 2,400 adapter attempts | 0.01 x 2,400 = 24 failed attempts | 0.01 x 14,400 = 144 minutes | 0.01 x 43,200 = 432 minutes |
| B. Latency | 0.05 (5%) | 2,400 adapter attempts | 0.05 x 2,400 = 120 attempts slower than 0.5 s | 0.05 x 14,400 = 720 minutes | 0.05 x 43,200 = 2,160 minutes |
| C. Freshness | 0.005 (0.5%) | 1,200 confirmed-save journeys | 0.005 x 1,200 = 6 failed post-save refresh journeys | 0.005 x 14,400 = 72 minutes | 0.005 x 43,200 = 216 minutes |

These are event budgets expressed as request/operation or journey counts. For A, the assumed active rate is 2,400 / 14,400 = 1/6 operation/minute; 24 / (1/6) = 144 equivalent active minutes. For C, 1,200 / 14,400 = 1/12 saved journey/minute; 6 / (1/12) = 72 equivalent active minutes.
Time equivalents assume every eligible event in those minutes is bad and traffic is uniform. They are not measured outage allowances or a conversion valid under bursty traffic. B's equivalent describes uniformly distributed slow events, not downtime. Off-hours have no forecast demand; calendar-normalized values are only a reference calculation.
With real totals, allowed whole bad events are at most floor(b x N_eligible). At this low volume one additional failure can materially change compliance. Exactly exhausting a budget reaches the target boundary; further bad events breach it unless the denominator grows.

## Proposed error-budget policy

Apply the strictest applicable state across A, B and C. The policy is a proposed By_Sellens working agreement, not evidence that releases or monitoring are already operated this way. Review rolling-window totals daily once dependable measurement exists.

| Consumed budget | A example (24) | B example (120) | C example (6) | Proposed action |
| --- | --- | --- | --- | --- |
| Below 50% | Fewer than 12 bad operations | Fewer than 60 slow operations | Fewer than 3 bad refresh journeys | Continue planned work while tracking reliability and coverage. |
| At least 50%, below 75% | 12 to below 18 | 60 to below 90 | 3 to below 4.5 | Review the relevant Customer traces/logs, identify repeat failures, and prioritize a reliability fix before expanding risky changes. |
| At least 75%, below 100% | 18 to below 24 | 90 to below 120 | 4.5 to below 6 | Defer nonessential risky Customer changes; focus on save/refresh correctness or latency and verify fixes. With integer events, C reaches this state at 5 failures. |
| At least 100% | 24 or more | 120 or more | 6 or more | Stop discretionary feature releases affecting the journey; permit recovery/security fixes and investigate the failure cause. |

Resume ordinary changes only after reviewed recovery evidence and the rolling budget return below the applicable restriction threshold; do not reset counters, erase incidents or rewrite objectives to hide consumption. If measurement coverage is untrustworthy, report unknown compliance and repair collection before claiming remaining budget. No alert rules or runbook are implemented by this document.

## Validation, limitations and references

Metric names, labels and units match CP4. Only A/B refer to families demonstrated by CP3; C depends on proposed instrumentation. CP3's six previously executed tests validate the laboratory, not these SLOs; CP6 is documentation only. None of the queries has been executed against a Prometheus server, and no real 30-day compliance results or budget consumption are available.
Current Customer uses MOCK. There is no verified deployed backend, database, RabbitMQ integration or production monitoring. The synthetic Request/Response adapter does not establish durable registration or visible list freshness. End-to-end measurement must observe `Clientes` render completion and include the detached refresh, while preventing duplicate root counting and keeping CP2 personal-data exclusions.
The official CP6 deliverable is `11-week/workshop/05-slo.md`: three SLIs/SLOs, exact queries, traffic assumptions, budgets in events and minutes, and policy at 50%, 75% and 100%. CP0-CP5 are preserved. Personal reflection is left to the student; CP7 and later deliverables are outside scope.
References: [CP4 metric catalog](04-metrics.md), [CP3 implementation and execution](03-instrumentation/HOW-TO-RUN.md), [Prometheus query functions](https://prometheus.io/docs/prometheus/latest/querying/functions/), and [Google SRE: implementing SLOs](https://sre.google/workbook/implementing-slos/).
