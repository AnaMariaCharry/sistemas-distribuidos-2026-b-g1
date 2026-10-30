<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       13-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 13

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Ana Maria Charry Forero
- GITHUB_USER: AnaMariaCharry
- TEAM: By_Sellens
- SPRINT_GOAL: Threat modeling and security backlog for Customer API.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| #65 | Enforce ADMIN authorization on Customer API operations | todo | https://github.com/code-corhuila/bysellens-docs/issues/65 |
| #59 | Prevent unauthorized disclosure of Customer API data | todo | https://github.com/code-corhuila/bysellens-docs/issues/59 |
| #60 | Validate Customer API input and reject unauthorized data changes | todo | https://github.com/code-corhuila/bysellens-docs/issues/60 |

## 2. My individual contribution
- CP1: Documented the attack surface and trust boundary between the Administrator browser and Customer API.
- CP2: Created a STRIDE threat model covering six categories, attack scenarios, mitigations, risk scores and residual risks.
- CP3: Created three security backlog stories (#65, #59 and #60) with priorities and testable acceptance criteria.
- CP4: Proposed a security CI workflow using Gitleaks, OWASP Dependency-Check and a negative authorization test for PATCH /api/v1/customers/{id}.
- CP5: Reviewed teammate PR #50 and suggested a negative test for manipulated SaleItem prices. Updated the weekly status and submitted the workshop progress evidence.
- CP6: Addressed peer feedback on PR #64, clarified the stolen-token response procedure, residual risk and proposed tests, and updated the STRIDE documentation.
- CP7: Refined the security backlog, verified acceptance criteria and priorities, and linked issue #65 to related authorization stories #53 and #61. Updated the workshop README.
- CP8: Executed the negative authorization test in an isolated Spring Security module. The test returned HTTP 401 for an unauthenticated PATCH request, with 1 test, 0 failures, 0 errors and BUILD SUCCESS. Validated security.yml syntax using SnakeYAML and recorded the real output in HOW-TO-RUN.md.
- CP9: Completed the reflection section "Implementation plan for my project", prioritizing ADMIN authorization, input validation and data protection, and prepared the final workshop evidence.


## 3. Blockers and risks
- The real Customer Java backend is not yet available in my personal fork. The CP8 test passed in a minimal Spring Security module, not in the complete Customer service.
- Authorization tests for HTTP 403, persistence side effects and full Customer integration remain pending.
- The security.yml file passed YAML syntax validation with SnakeYAML, but complete GitHub Actions workflow validation and execution remain pending.
- The security mitigations and backlog stories are proposed; runtime enforcement in the real Customer service has not been verified.
- Sensitive Customer operations must not be exposed without server-side ADMIN authorization.

## 4. Plan for next week
- Sprint 1: Implement JWT validation and ADMIN authorization for protected Customer API operations, prioritizing issue #65 (P0).
- Add automated negative tests for missing or invalid tokens (401), non-ADMIN users (403), forged identity headers and unchanged Customer records after rejected requests.
- Sprint 2: Implement server-side input validation (issue #60) and data protection controls (issue #59), both P1.
- Integrate the security tests into CI and validate the workflow when the real Customer backend is available.
- Reassess residual risks after implementation and integration testing.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Workshop folder: [https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/tree/main/13-week/workshop](https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/tree/main/13-week/workshop)
- STRIDE Pull Request: [https://github.com/code-corhuila/bysellens-docs/pull/64](https://github.com/code-corhuila/bysellens-docs/pull/64)
- Claim issue: [https://github.com/code-corhuila/bysellens-docs/issues/52](https://github.com/code-corhuila/bysellens-docs/issues/52)
- Security story #65: [https://github.com/code-corhuila/bysellens-docs/issues/65](https://github.com/code-corhuila/bysellens-docs/issues/65)
- Security story #59: [https://github.com/code-corhuila/bysellens-docs/issues/59](https://github.com/code-corhuila/bysellens-docs/issues/59)
- Security story #60: [https://github.com/code-corhuila/bysellens-docs/issues/60](https://github.com/code-corhuila/bysellens-docs/issues/60)
- Related Sales story #53: [https://github.com/code-corhuila/bysellens-docs/issues/53](https://github.com/code-corhuila/bysellens-docs/issues/53)
- Related Inventory story #61: [https://github.com/code-corhuila/bysellens-docs/issues/61](https://github.com/code-corhuila/bysellens-docs/issues/61)
- CP3 README commit: [https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/84b529d](https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/84b529d)
- CP4 security CI commit: [https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/e3a5aa8fee19f8c27ac88d5d0b13a96328b41759](https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/e3a5aa8fee19f8c27ac88d5d0b13a96328b41759)
- CP6 STRIDE revision commit: [https://github.com/code-corhuila/bysellens-docs/commit/0db641cb91305a1f9979ca3ca1c4f8360239001b](https://github.com/code-corhuila/bysellens-docs/commit/0db641cb91305a1f9979ca3ca1c4f8360239001b)
- CP8 negative authorization test commit: [https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/d6d2406e0a214b4d62719905664f46c4d3bd239a](https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/d6d2406e0a214b4d62719905664f46c4d3bd239a)
- Peer review comment: [https://github.com/code-corhuila/bysellens-docs/pull/50#issuecomment-6513939576](https://github.com/code-corhuila/bysellens-docs/pull/50#issuecomment-6513939576)
- Reflection document: [https://docs.google.com/document/d/16MKlNozLuhqKAmXdUSSx1gE2P2cMP80OCty3JYISODw/edit?usp=sharing](https://docs.google.com/document/d/16MKlNozLuhqKAmXdUSSx1gE2P2cMP80OCty3JYISODw/edit?usp=sharing)

