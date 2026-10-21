# CP7 - Burn-Rate Alerts

## Official scope and implementation status

The official checkpoint is CP7, "Burn-rate alerts" (Burn-rate alerts). Deliverables are [06-alerts.yml](06-alerts.yml) and this policy: a fast 14.4x alert with 1h/5m windows, a slow 6x alert with 6h/30m windows, severity/team labels, summary/runbook_url annotations, budget calculations, and two cause-based alerts deliberately omitted. Personal reflection remains the student's work.
These are proposed Prometheus rules, not deployed alerts or observed incidents. [CP3](03-instrumentation/HOW-TO-RUN.md) demonstrates TypeScript instrumentation with simulated HTTP and in-memory metrics; it does not supply continuous scraping, a real Customer backend, Prometheus, Alertmanager or notification routing.
The existing `ClienteForm`, `Clientes`, `clienteService` and `mockClientes` remain unchanged. The protected workflow is registration followed by list refresh; these rules measure CP6's adapter availability, not the full browser journey or durable customer persistence.

## SLO and expression semantics

Use [CP6 SLO A](05-slo.md): at least 99% successful completed create/refresh attempts over rolling 30 days. Allowed bad fraction = 1 - 0.99 = 0.01. Burn rate over window W = failure ratio(W) / 0.01.
Each failure ratio is `sum(rate(customer_operations_total{outcome="failure"}[W])) / sum(rate(customer_operations_total[W]))`. Both operations are included, matching CP6. The numerator counts failed adapter attempts, not ERROR log lines; CP2's two error records do not count as two failed journeys.
Apply `rate` per counter series before aggregation. No unsupported `service`, `component` or `data_mode` metric labels are assumed. Future collection must isolate one comparable Customer deployment/mode before enabling these aggregate expressions; mixing demonstrations and real traffic would invalidate them.

| Alert | Long window | Short confirmation window | Both burn rates must exceed | Equivalent failure ratio | Proposed severity |
| --- | --- | --- | --- | --- | --- |
| `CustomerAvailabilityFastBurn` | 1h | 5m | 14.4 | 14.4 x 0.01 = 0.144 (14.4%) | critical |
| `CustomerAvailabilitySlowBurn` | 6h | 30m | 6 | 6 x 0.01 = 0.06 (6%) | warning |

The `and` requires both windows to exceed the threshold at the same evaluation. Short windows check whether elevated burn is still recent; they are not an additional `for` delay. `for: 0m` adds no pending period, and the proposed evaluation interval is 30 seconds. Neither rule waits for a completely failing 1h/6h history before it can fire: detection depends on prior traffic and failures.
The comparisons are strict `>`: exact equality does not activate them. Missing failure series yields no alert element; zero total rate yields an undefined ratio and does not demonstrate health. Missing/insufficient samples or unobserved hanging requests require separate coverage handling before deployment. No fallback fabricates successful operations during gaps.

## Budget represented by the windows

At uniform calendar traffic, fraction of the 30-day budget spent at burn B for H hours is B x H / 720. These are threshold reference calculations, not actual budget consumed before a guaranteed firing time. Rates, short-window confirmation, sampling and event discreteness affect detection.

| Alert | Calendar-uniform long-window reference | Short-window reference | CP6 availability budget of 24 bad attempts: long / short equivalent |
| --- | --- | --- | --- |
| Fast | 14.4 x 1 / 720 = 0.02 = 2% | 14.4 x (5/60) / 720 = 1/600 = about 0.1667% | 0.48 / 0.04 bad attempts |
| Slow | 6 x 6 / 720 = 0.05 = 5% | 6 x 0.5 / 720 = 1/240 = about 0.4167% | 1.2 / 0.1 bad attempts |

CP6's student-approved hypothetical scenario is 40 registrations/day, one create plus one refresh per successful journey, 8 active hours/day for 30 days. Forecast traffic is 2,400 adapter attempts over 240 active hours, averaging 10/hour while active; the availability budget is 24 bad attempts. There are no measured production volumes.
For a window entirely inside active hours, the corresponding budget fraction is B x H / 240, not B x H / 720. Fast reference: 14.4 x 1 / 240 = 6%, or 1.44 failed attempts; its 5m reference is 0.5%, or 0.12 attempts. Slow reference: 6 x 6 / 240 = 15%, or 3.6 attempts; its 30m reference is 1.25%, or 0.3 attempts. Off-hours and partially active windows change these values.
Fractional attempts are mathematical equivalents, not possible individual failures or measured results. One failed operation already spends 1/24 = about 4.17% of the forecast monthly budget. At 10 operations/hour, five minutes contain only about 0.83 operations on average, so the fast short window can lack useful observations or react strongly to a single failure.
Do not add a silent minimum-volume gate or relax CP6 to hide this sensitivity. Before operational adoption, evaluate representative synthetic series, collector coverage, actual demand and human response needs. These workshop rules alone cannot guarantee timely detection at low traffic.
The 2%/5% calendar reference is not the CP6 release-policy threshold: the separate 50%/75%/100% monthly consumption actions still apply. An alert identifies recent spending velocity; it does not reset, enlarge or pool budgets across objectives.

## Two cause-based alerts deliberately not created

| Omitted alert | Why it is inappropriate for this checkpoint |
| --- | --- |
| Customer server CPU above 80% | No Customer server CPU exporter or deployed backend is evidenced. CPU pressure is a possible cause, not proof that registration/refresh outcomes violate the availability objective. |
| RabbitMQ queue depth above a fixed limit | CP1 provides no RabbitMQ integration, queue or broker metric for Customer. Adding this alert would invent infrastructure and would not measure the selected user-visible failure symptom. |

## Runbook status and rollout prerequisites

Both `runbook_url` annotations target `07-runbook.md` in the personal fork as the planned CP8 location. That document is not created by CP7, and the link is not claimed to resolve now. Complete and verify the runbook before operationally enabling these rules; no response procedure or CP8 content is authored here.
`severity` and `team: By_Sellens` are rule output labels, not existing counter labels or proof of notification routing. Alertmanager routing, inhibition and recipients require later operational decisions. Do not infer a deployed paging service from these labels.

## Validation and limits

The `.yml` file uses JSON flow syntax, a valid YAML 1.2 subset, so its serialization and rule structure can be checked with the installed JSON parser without adding dependencies. Local checks validate two rules, required labels/annotations, exact window/threshold pairs, balanced PromQL delimiters, budget arithmetic, and the combined 150-line limit.
PromQL has been reviewed against CP3/CP4/CP6 and official references. `promtool` is not installed; no Prometheus engine execution, rule test, live firing, alert delivery or production measurement is claimed. Before rollout, run `promtool check rules 06-alerts.yml` and test representative normal, failing, low-traffic and missing-data series with an available Prometheus toolchain.
Only CP7's two files are added. CP0-CP6 and the team repositories are unchanged; CP8 and later work remain outside scope.
References: [Google SRE: alerting on SLOs](https://sre.google/workbook/alerting-on-slos/), [Prometheus alerting rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/), [YAML 1.2.2 specification](https://yaml.org/spec/1.2.2/), [CP4 metrics](04-metrics.md), and [CP6 objectives/budgets](05-slo.md).
