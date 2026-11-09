<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       14-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 14

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME:  Ana María Charry Forero
- GITHUB_USER: AnaMariaCharry
- TEAM: By_sellens
- SPRINT_GOAL: Implement and integrate the Customer Microservice, migrate customer persistence from PostgreSQL to MongoDB, and promote changes through development, QA, and release environments.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU-001 | Implement standalone Customer Microservice | done | [PR #1](https://github.com/code-corhuila/bysellens-customer-api/pull/1) |
| HU-002 | Promote Customer Microservice to QA | done | [PR #2](https://github.com/code-corhuila/bysellens-customer-api/pull/2) |
| HU-003 | Migrate Customer persistence to MongoDB | done | [PR #4](https://github.com/code-corhuila/bysellens-customer-api/pull/4) |
| HU-004 | Promote MongoDB integration to QA | done | [PR #5](https://github.com/code-corhuila/bysellens-customer-api/pull/5) |
| HU-005 | Prepare Customer MongoDB production release | doing | [PR #6](https://github.com/code-corhuila/bysellens-customer-api/pull/6) |

## 2. My individual contribution
- Implemented the standalone Customer Microservice using Java and Spring Boot.
- Created customer entities, DTOs, repositories, services, and REST controllers.
- Implemented customer management operations through REST endpoints.
- Configured Maven dependencies, application properties, and Docker support.
- Migrated Customer persistence from PostgreSQL to MongoDB.
- Integrated Spring Data MongoDB and adapted customer repositories.
- Preserved customer identifiers and existing business logic.
- Maintained compatibility with Product, Sales, and Inventory microservices.
- Promoted changes from development to QA through Pull Requests.
- Prepared the MongoDB integration for the final release.

## 3. Blockers and risks
- Docker unavailability prevented initial integration testing during the first implementation.
- MongoDB integration required changes to database configuration and repositories.
- Customer identifiers and existing REST functionality needed to remain compatible after migration.
- Final release validation and merging into main remain pending.
- Continued monitoring is required to ensure communication with the other microservices.

## 4. Plan for next week
- Complete final review and release of Customer with MongoDB.
- Validate Customer CRUD operations and logical deletion.
- Verify MongoDB connectivity and data persistence.
- Confirm integration with Product, Sales, and Inventory.
- Review environment variables and Docker configuration.
- Complete remaining integration tests and update technical documentation.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [x] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [ ] No secrets; config via environment variables

## 6. Evidence links
### Repository

https://github.com/code-corhuila/bysellens-customer-api

### Customer Microservice Pull Requests

- PR #1 - Standalone Customer Microservice (merged)  
  https://github.com/code-corhuila/bysellens-customer-api/pull/1

- PR #2 - Promote Customer Service to QA (merged)  
  https://github.com/code-corhuila/bysellens-customer-api/pull/2

- PR #3 - Customer Service Release (closed, not merged)  
  https://github.com/code-corhuila/bysellens-customer-api/pull/3

### MongoDB Migration Pull Requests

- PR #4 - Migrate Customer Persistence to MongoDB (merged)  
  https://github.com/code-corhuila/bysellens-customer-api/pull/4

- PR #5 - Promote Customer MongoDB to QA (merged)  
  https://github.com/code-corhuila/bysellens-customer-api/pull/5

- PR #6 - Release Customer with MongoDB (open)  
  https://github.com/code-corhuila/bysellens-customer-api/pull/6
