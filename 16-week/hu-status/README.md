<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       16-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 16

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Ana Maria Charry Forero
- GITHUB_USER: AnaMariaCharry
- TEAM: Bysellens
- SPRINT_GOAL: Update and align BY_SELLENS technical documentation with the current microservices implementation, ensuring consistency in architecture, service responsibilities, communication, and data ownership.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-01 | Update project context documentation | done | https://github.com/code-corhuila/bysellens-docs/pull/84 |
| HU-02 | Update microservices communication and data ownership documentation | done | https://github.com/code-corhuila/bysellens-docs/pull/86 |
| HU-03 | Update Gateway, Auth, Product, and Inventory service documentation | done | https://github.com/code-corhuila/bysellens-docs/pull/89 |
| HU-04 | Update Customer and Sales service documentation | done | https://github.com/code-corhuila/bysellens-docs/pull/90 |

## 2. My individual contribution
- Updated the project context documentation, including the system overview and scope.
- Updated microservices communication patterns, service responsibilities, dependencies, and data ownership.
- Documented Product as the owner of the product catalog and Inventory as the owner of stock management.
- Updated the documentation for Gateway, Auth, Product, Inventory, Customer, and Sales services.
- Aligned the documentation with the current implementation using PostgreSQL, MongoDB, RabbitMQ, and JWT HS256.
- Contributed to the integration of technical documentation into the main repository through merged pull requests.

## 3. Blockers and risks
- Historical architecture decisions may differ from the current implementation and require team coordination.
- Documentation consistency must be maintained as the microservices evolve.
- Documentation updates do not replace runtime integration testing or deployment verification.

## 4. Plan for next week
- Prepare for the final BY_SELLENS project presentation.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [ ] No secrets; config via environment variables

## 6. Evidence links
- PR #84 - Project context documentation:
  https://github.com/code-corhuila/bysellens-docs/pull/84

- PR #86 - Microservices communication and ownership:
  https://github.com/code-corhuila/bysellens-docs/pull/86

- PR #89 - Gateway, Auth, Product, and Inventory documentation:
  https://github.com/code-corhuila/bysellens-docs/pull/89

- PR #90 - Customer and Sales documentation:
  https://github.com/code-corhuila/bysellens-docs/pull/90
