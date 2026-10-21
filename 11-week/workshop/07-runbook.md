# CP8 - Runbook

## Purpose, trigger and readiness

Runbook for `CustomerAvailabilityFastBurn`, protecting By_Sellens Customer registration followed by customer list refresh. The official CP8 deliverable requires symptoms, PromQL and trace-ID log confirmation, three mitigations ordered by risk, role-based escalation and recovery checks. This document does not execute incident actions or author a personal reflection.
Trigger: CP7's proposed critical alert for `team: By_Sellens`, with burn above 14.4x over both 1h and 5m. CP6 SLO A is 99% adapter operation success over rolling 30 days: error budget fraction 0.01, so the failure-ratio threshold is strictly above 14.4%. Evaluation interval is 30s; `for: 0m` adds no pending delay. The 5m window is confirmation, not a five-minute wait after activation.
Current state: Customer uses local MOCK; CP3 is a standalone TypeScript demonstration with an injected simulated HTTP transport. Prometheus, alert routing, backend deployment, automated rollback, feature flags and circuit breakers are not verified. Procedures involving operational telemetry apply only after those specific collection capabilities exist; they are not claims of a running incident-response system.
Before operational adoption, assign the proposed roles below to actual team contacts, establish a communication channel, isolate one deployment/data mode in collection, and verify metric/log coverage. Until then this is a documented response plan; local checks cannot establish production recovery.

## Symptoms and initial assessment

1. Record the alert name, UTC time, severity, team, deployment/build context and current failure ratios. A pasted synthetic alert or CP3 demo error is laboratory evidence only; label it accordingly.
2. Ask whether the operator sees save failure, a success alert followed by a stale list, or a validation rejection. `ClienteForm` rejects invalid fields before saving; `Clientes.guardarCliente` catches save errors and starts `cargarClientes` separately after a confirmed save.
3. Distinguish missing telemetry from failures. CP3 observes completed adapter attempts; missing samples, zero demand or indefinitely pending work do not establish healthy service. CP6's 40 registrations/day and 8 active hours/day are hypothetical, not observed workload.
4. Determine affected operation (`create`, `refresh` or both), sessions and build without collecting customer identities or bodies. Do not resubmit an uncertain registration merely because its list row is not visible.

## Confirm with metrics

These are proposed PromQL queries, not executed production queries. Run only against an authorized, correctly scoped Customer collector. Metrics have no existing `service`, `component` or `data_mode` application labels; do not invent selectors or aggregate synthetic and real deployments together.

The exact fast-alert expression from CP7 must be active to confirm that specific burn condition:

```promql
((sum(rate(customer_operations_total{outcome="failure"}[1h])) / sum(rate(customer_operations_total[1h]))) / 0.01 > 14.4) and ((sum(rate(customer_operations_total{outcome="failure"}[5m])) / sum(rate(customer_operations_total[5m]))) / 0.01 > 14.4)
```

Inspect short-window failures by operation, then compare them with completed traffic; counts are operations, not log lines or complete journeys:

```promql
sum by (operation) (rate(customer_operations_total{outcome="failure"}[5m]))
```

```promql
sum by (operation) (rate(customer_operations_total[5m]))
```

An absent failure series alone is not proof of zero errors. With CP6's hypothetical ten adapter operations per active hour, a 5m window may have too few events; verify samples and direct workflow behavior before drawing conclusions. Do not silently relax thresholds or add traffic gates to the existing rules.

## Confirm with logs and trace context

Select one affected interaction's `trace_id` from an authorized CP2-format log, not a customer identifier. CP1 parentage is R -> G -> C for saving and R -> L -> Q for MOCK refresh; CP3's simulated HTTP path instead adds a CLIENT span. Correlate spans within one trace; CP2's two ERROR events can describe one underlying refresh failure.
For an already available, authorized JSON-lines file, use this PowerShell query. Supply `$logPath` separately; replace the synthetic CP2 example ID with the observed interaction ID. This query only reads logs and projects approved fields, not payloads or raw exceptions:

```powershell
$traceId = '4bf92f3577b34da6a3ce929d0e0e4736'
Get-Content -LiteralPath $logPath |
  ForEach-Object { $_ | ConvertFrom-Json -ErrorAction Stop } |
  Where-Object { $_.trace_id -eq $traceId } |
  Sort-Object timestamp |
  Select-Object timestamp, level, event, operation, component, outcome, trace_id, span_id, error_code
```

Use a CP2-compliant source, not unfiltered demo stdout containing Prometheus text. A parse failure or no matching events requires checking source/coverage; neither confirms success. No central log platform or portal tracing integration is currently verified.
`customer.registration.saved` followed by `customer.list_refresh.failed` and `customer.journey.partially_failed` supports a saved-but-stale diagnosis in the proposed contract. Validate actual state before deciding to retry; absence of a save event does not prove that no write happened. Protect names, email addresses, phone numbers, addresses, credentials and all MOCK contents; do not copy personal data or raw console error objects into an incident record.

## First three mitigations, from lower to higher operational impact

| Order / risk | Action supported by the current workflow | Preconditions and verification |
| --- | --- | --- |
| 1. Low: prevent duplicate attempts in the affected session | Ask the affected operator to stop repeated submissions while save status is checked. Keep the form available after a reported save error; do not trigger repeated create requests. This is a manual workflow instruction, not an implemented feature flag. | Confirm whether saving was acknowledged; record only sanitized outcomes. Do not discard unsaved form input, clear localStorage or export customer data. |
| 2. Moderate: one read-only list reload | If the save was confirmed and there is no unsaved form input, perform one normal Customer page reload in the same browser/origin; CP1 documents that mounting `Clientes` calls `listarClientes`. Inspect the resulting list privately before considering any new registration. | Preserve existing browser storage and session; do not submit the form again. Stop if the read fails or the saved state remains uncertain. Reload is not a storage repair and must not be treated as proof of durable backend persistence. |
| 3. Higher impact: contain the affected Customer workflow | If uncertainty or failures persist or affect more operators, the responsible team role asks affected operators to suspend Customer registration and coordinates a tested frontend correction. Keep the restriction until save and refresh are verified. | Confirm scope and authority with the team lead; preserve existing MOCK data. Reproduce with synthetic inputs in an authorized disposable test session, then review the fix before any separately authorized change. No deployment command, rollback artifact or automatic circuit breaker is assumed. |

Do not switch `VITE_DATA_MODE` to REAL as a workaround: no backend is verified. Switching to a fresh MOCK store can hide existing records. Do not implement feature flags, reset data, scale nonexistent services, change the SLO or rewrite Git history as an incident response. These ordered actions rely on the evidenced UI/read workflow and manual containment rather than unverified infrastructure.

## Escalation by role

The supplied evidence identifies the Customer module assignment but no operational roster or on-call contacts. The following responsibilities are proposed assignments that By_Sellens must map to real people before adoption; no existing on-call rotation is claimed.

| Proposed role | When to engage | Responsibility / handoff |
| --- | --- | --- |
| Customer module maintainer | Immediately after confirming impact, or immediately if save status is uncertain. | Inspect `ClienteForm`, `Clientes`, `clienteService` and `mockClientes`; correlate one sanitized trace; distinguish validation, save and refresh outcomes. |
| By_Sellens team lead / incident coordinator | Engage alongside the maintainer when multiple operators are affected, containment is needed, the cause is unknown, or the maintainer is unavailable. | Assign an available owner, coordinate operator restrictions, approve any later corrective change and agree the next update time; no action is sent automatically by this runbook. |
| Store/workflow representative | Involve through the coordinator when registration is paused or saved-customer visibility is uncertain. | Confirm business impact and privately verify the intended workflow before resuming; do not ask them to share customer data in the incident channel. |

Handoff contains UTC times, affected operation, build/mode, metric coverage and ratios, sanitized trace IDs/events, actions taken and unresolved uncertainty. Check the separate CP6 budget states at 50%, 75% and 100%; the fast alert signals recent burn velocity, not automatic proof of a monthly budget-policy threshold. If no accountable contact is available, maintain manual containment and explicitly record the unresolved ownership gap.

## Verify recovery and decide whether to resume

1. With authorized synthetic data in an isolated test session, verify one save followed by a visible list refresh. Inspect both success and failure handling; a successful save alert alone is insufficient. Do not perform this write against real customer records as an automated probe.
2. Where telemetry is integrated, verify fresh collection and nonzero representative completed traffic. Both the 1h and 5m failure ratios should be at or below 0.144 for five consecutive minutes as a proposed human recovery check. This is stricter than CP7 clearing when either condition ceases to be true; do not edit the rule to match it.
3. Confirm no new correlated save/refresh failures and that the intended customer is visible to the authorized operator. A collector gap, empty window, lack of demand or missing logs is not recovery. Continued long-window failures may keep the alert active even after a fix; do not erase samples to force clearing.
4. Review CP6 separately: rolling 30-day operation success >=99%, at least 95% of adapter operations <=0.5 s, and proposed post-save freshness >=99.5%. Adapter counters/histograms do not establish rendered-list freshness; the root outcome metric remains proposed. Historic SLO failure may persist after operational recovery.
5. The coordinator and workflow representative decide whether to resume, subject to CP6's budget restrictions and observed workflow correctness. Record evidence and remaining limitations; if evidence is unavailable, report recovery unverified and keep the affected workflow contained. No recovery result is asserted by this document.

## Local evidence and validation limits

References: [CP1 journey/components](01-journey.md), [CP2 JSON contract](02-log-contract.md), [CP3 laboratory instructions](03-instrumentation/HOW-TO-RUN.md), [CP4 metrics](04-metrics.md), [CP6 objectives/budgets](05-slo.md), and [CP7 alert rule/policy](06-alert-policy.md).
The file location matches CP7's `runbook_url`. Document checks can compare the alert expression exactly, validate relative paths, parse the PowerShell log-query syntax and exercise its filtering against CP2's synthetic examples without writing customer data. These checks do not execute mitigations, simulate a CP9 incident or validate operational recovery.
`promtool` and a connected Prometheus/log service are unavailable; live PromQL, alert firing, notifications and recovery cannot be verified here. CP3's recorded tests remain laboratory evidence, not an executed incident drill. No new dependency, deployment, feature flag, backend, database or broker is introduced. CP0-CP7 remain intact; CP9 and CP10 are outside scope.
