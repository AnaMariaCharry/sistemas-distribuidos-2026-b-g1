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
- CP1: Documented the attack surface for the Administrator browser -> Customer API boundary.
- CP2: Created a STRIDE threat model with six threats, mitigations and risk ranking.
- CP3: Documented three security backlog stories with testable acceptance criteria and proposed automated tests.
- CP4: Created a proposed security CI pipeline with Gitleaks, OWASP Dependency-Check and a negative authorization test for PATCH /api/v1/customers/{id}.
- CP5: Reviewed teammate PR #50 and suggested an additional negative test for manipulated SaleItem prices.

## 3. Blockers and risks
- The Customer Java backend is not available in my personal fork, so the security pipeline and negative authorization test have not been executed.
- The security mitigations remain proposed and have not been verified in a running Customer service.

## 4. Plan for next week
- Review feedback on the STRIDE pull request.
- Coordinate the implementation of the security backlog stories.
- Integrate and execute the proposed security tests when the Customer backend becomes available.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Workshop folder: https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/tree/main/13-week/workshop
- STRIDE Pull Request: https://github.com/code-corhuila/bysellens-docs/pull/64
- Claim issue: https://github.com/code-corhuila/bysellens-docs/issues/52
- Security story #65: https://github.com/code-corhuila/bysellens-docs/issues/65
- Security story #59: https://github.com/code-corhuila/bysellens-docs/issues/59
- Security story #60: https://github.com/code-corhuila/bysellens-docs/issues/60
- CP3 README commit: https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/84b529d
- CP4 security CI commit: https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1/commit/e3a5aa8fee19f8c27ac88d5d0b13a96328b41759
- Peer review comment: https://github.com/code-corhuila/bysellens-docs/pull/50#issuecomment-6513939576
- Reflection document: https://docs.google.com/document/d/16MKlNozLuhqKAmXdUSSx1gE2P2cMP80OCty3JYISODw/edit?usp=sharing
