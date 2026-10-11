<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       10-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 10

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Ana Maria Charry Forero 
- GITHUB_USER: AnaMariaCharry
- TEAM: BySellens
- SPRINT_GOAL: Complete the promotion of the Customer Portal from develop to qa in MOCK mode, validate its functionality through automated tests, and initiate the controlled release to main.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-001 | Customer Portal bootstrap and MOCK services promotion to QA | done | [PR #7](https://github.com/code-corhuila/bysellens-customer-portal/pull/7) · [Commit 1](https://github.com/code-corhuila/bysellens-customer-portal/commit/8c16bcec06dd98b942c8d1121fb4112a57a7ad2f) · [Commit 2](https://github.com/code-corhuila/bysellens-customer-portal/commit/28ad92013aa92c4ee67b9f7a90042c89ae922ab6) |
| HU-002 | Customer listing and search promotion to QA | done | [PR #8](https://github.com/code-corhuila/bysellens-customer-portal/pull/8) · [Commit 0908b7a](https://github.com/code-corhuila/bysellens-customer-portal/commit/0908b7a7c3956c1daf3514377ae2aee406c560b1) |
| HU-003 | Customer registration and editing form promotion to QA | done | [PR #9](https://github.com/code-corhuila/bysellens-customer-portal/pull/9) · [Commit 21fd876](https://github.com/code-corhuila/bysellens-customer-portal/commit/21fd876a735d049ce62647b805bd33bc7281b91e) |
| HU-004 | Customer deletion and final form integration promotion to QA | done | [PR #10](https://github.com/code-corhuila/bysellens-customer-portal/pull/10) · [Commit f36b5ad](https://github.com/code-corhuila/bysellens-customer-portal/commit/f36b5adf29d40a5b7538951191e89b9b9857c7b5) · [Commit 144c275](https://github.com/code-corhuila/bysellens-customer-portal/commit/144c27523a472c5b15c4fc2ee5b770400b3f0461) |
| HU-005 | Initial Customer Portal promotion from QA to main | done | [PR #11](https://github.com/code-corhuila/bysellens-customer-portal/pull/11) · [Commit ffaf8b8](https://github.com/code-corhuila/bysellens-customer-portal/commit/ffaf8b8988395599016f7df57d00b445cb3d9b38) · [Commit 46559aa](https://github.com/code-corhuila/bysellens-customer-portal/commit/46559aa2f7defec25eb87297c0d6f25cca3d746a) · [Merge 62d70a7](https://github.com/code-corhuila/bysellens-customer-portal/commit/62d70a77cac5b923d52add0780a2e4f88bd6d490) |

## 2. My individual contribution
- Promoted Customer Portal from `develop` to `qa` through four sequential pull requests (#7–#10), using `git cherry-pick -x` and respecting the 400-computable-line limit per PR.
- Promoted the Ionic React bootstrap, MOCK services, customer listing and search, registration/editing form, deletion, and final integration.
- Validated TypeScript, production build, ESLint, Docker, health checks, unit tests, and Cypress tests; the final QA promotion passed 40/40 unit tests and 10/10 Cypress tests.
- Confirmed that the final QA promotion's source tree matched `origin/develop`.
- Successfully promoted the Customer Portal bootstrap and MOCK services from qa to main through PR #11, which was approved and merged.
- Preserved commit traceability during the promotion process and documented the corresponding pull requests and commits as evidence.

## 3. Blockers and risks
- The remaining Customer Portal features still require sequential promotions to main, respecting the 400-computable-line limit per PR.
- Each remaining promotion to main requires the appropriate review and approval before merging.
- Real backend integration has not yet been validated; current functional validation covers MOCK mode.

## 4. Plan for next week
- Prepare the next controlled promotion from qa to main for customer listing and search.
- Continue the remaining promotions for the registration/editing form, customer deletion, and final integration.
- Execute the relevant automated tests, verify the changed-line limit, and preserve commit traceability for each promotion.
- Request the required reviews and approvals before merging each PR into main.
- Coordinate future integration and real-backend validation with the team. 

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [x] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...) — Environment-targeted promotion branches and PRs used; exact HU branch naming not verified.
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration) — Unit and Cypress end-to-end tests verified.
- [ ] DDD / hexagonal boundaries respected (domain has no I/O) — Not independently verified for this frontend report.
- [ ] No secrets; config via environment variables — No new secrets reported; environment-variable configuration not independently verified.

## 6. Evidence links
- QA PR #7 — Bootstrap and MOCK services: https://github.com/code-corhuila/bysellens-customer-portal/pull/7
- QA PR #8 — Customer listing and search: https://github.com/code-corhuila/bysellens-customer-portal/pull/8
- QA PR #9 — Registration/editing form: https://github.com/code-corhuila/bysellens-customer-portal/pull/9
- QA PR #10 — Deletion and final integration: https://github.com/code-corhuila/bysellens-customer-portal/pull/10
- Main PR #11 — Bootstrap and MOCK services, approved and merged: https://github.com/code-corhuila/bysellens-customer-portal/pull/11
