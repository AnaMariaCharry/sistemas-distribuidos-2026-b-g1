<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       07-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 07

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Ana María Charry Forero
- GITHUB_USER: AnaMariaCharry
- TEAM:  Bysellens
- SPRINT_GOAL: Make progress on the By_Sellens microservices documentation by reviewing and updating the Auth, Inventory, and Sales services according to the project requirements, domain boundaries, API contracts, and architecture.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-01 | Update Auth Service documentation | done | [Commit f78cb5c](https://github.com/code-corhuila/bysellens-docs/commit/f78cb5c91675ae6c2abc7ccc887187fa9735cbbc) |
| HU-02 | Update Inventory Service documentation | done | [Commit 3e23eeb](https://github.com/code-corhuila/bysellens-docs/commit/3e23eebfd31eef19b963c9508ee41e184ccf18cd) |
| HU-03 | Update Sales Service documentation | done | [Commit 9a9c3f8](https://github.com/code-corhuila/bysellens-docs/commit/9a9c3f8c424e4cc1308ee70d8f5b9d6b9d099b37) |

## 2. My individual contribution
- I reviewed and updated the documentation for `02-auth-service`.
- I reviewed and updated the documentation for `04-inventory-service`.
- I reviewed and updated the documentation for `06-sales-service`.
- I documented the responsibilities, data models, events, design decisions, and operational considerations of these services.
- I maintained the separation of responsibilities between the business domains, especially Product, Inventory, Customer, and Sales.
- I reviewed the documentation according to the existing project context, domain, requirements, architecture, data, API, and UML sections.
- My contributions are documented in commits `f78cb5c`, `3e23eeb`, and `9a9c3f8`.

## 3. Blockers and risks
- Some technical decisions are still pending and need to be reviewed by the team.
- The final database organization still needs to be reviewed before changing the current documentation.
- Distributed consistency between Sales and Product, especially during concurrent sales and stock updates, still requires an implementation decision.
- The documented microservices are still in the design/documentation stage; implementation and runtime verification are pending.

## 4. Plan for next week
- Continue reviewing and completing the `09-microservices` documentation.
- Review the cross-cutting microservices documentation and verify consistency between services.
- Review pending architectural and database decisions with the team.
- Continue aligning the microservices documentation with sections 01–08.
- Prepare the documentation for the next implementation stage.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- **Auth Service:** [Commit f78cb5c - Update Auth Service documentation](https://github.com/code-corhuila/bysellens-docs/commit/f78cb5c91675ae6c2abc7ccc887187fa9735cbbc)
- **Inventory Service:** [Commit 3e23eeb - Update Inventory Service documentation](https://github.com/code-corhuila/bysellens-docs/commit/3e23eebfd31eef19b963c9508ee41e184ccf18cd)
- **Sales Service:** [Commit 9a9c3f8 - Update Sales Service documentation](https://github.com/code-corhuila/bysellens-docs/commit/9a9c3f8c424e4cc1308ee70d8f5b9d6b9d099b37)
