<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       08-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 08

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Ana María Charry Forero
- GITHUB_USER: AnaMariaCharry
- TEAM: Bysellens
- SPRINT_GOAL: Update and review the second-cut requirements and microservices documentation, integrating the changes through Pull Requests and maintaining consistency with the current By_Sellens architecture.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-08-001 | Update second-cut requirements and user stories | done | https://github.com/code-corhuila/bysellens-docs/pull/38 |
| HU-08-002 | Update second-cut microservices documentation | done | https://github.com/code-corhuila/bysellens-docs/pull/37 |

## 2. My individual contribution
- I updated the `04-requirements` documentation for the second cut of the project.
- I reviewed and updated the user stories and project requirements according to the current scope of By_Sellens.
- I updated the `09-microservices` documentation to continue defining and improving the microservices architecture.
- I created Pull Request #38 for the changes in `docs/04-requirements`, which was reviewed and accepted.
- I created Pull Request #37 for the changes in `docs/09-microservices`, which was also reviewed and accepted.
- I reviewed the documentation to maintain consistency between the requirements and the microservices design.

## 3. Blockers and risks
- There are currently no pending Pull Requests related to this work.
- Some architectural and technical decisions still need to be defined by the team.
- The final database organization is still under review, so no definitive database architecture changes should be assumed yet.

## 4. Plan for next week
- Continue reviewing consistency between requirements, architecture, API contracts, and microservices documentation.
- Address any additional feedback or required adjustments to the documentation.
- Continue preparing the documentation for the implementation stage.
- Review and develop the architectural diagrams required for By_Sellens.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [x] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Pull Request #38 — `docs/04-requirements` → `main`:
  https://github.com/code-corhuila/bysellens-docs/pull/38
  
- Commit for requirements:
  https://github.com/code-corhuila/bysellens-docs/commit/41728a583411495074e14fccc4f8bf8812641a86

- Pull Request #37 — `docs/09-microservices` → `main`:
  https://github.com/code-corhuila/bysellens-docs/pull/37

- Commit for microservices:
  https://github.com/code-corhuila/bysellens-docs/commit/54bd26e85b6e25f3d5dc70863be7e2379bbc98fd
