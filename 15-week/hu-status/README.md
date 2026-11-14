<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       15-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 15

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Ana Maria Charry Forero
- GITHUB_USER:  AnaMariaCharry
- TEAM: Bysellens
- SPRINT_GOAL: Complete the Customer MongoDB integration and promote the approved Customer API and Customer DB changes through develop, qa, and main.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-CUSTOMER-001 | Implement standalone Customer API | done | https://github.com/code-corhuila/bysellens-customer-api/pull/1 |
| HU-CUSTOMER-002 | Migrate Customer persistence to MongoDB | done | https://github.com/code-corhuila/bysellens-customer-api/pull/4 |
| HU-CUSTOMER-003 | Update Customer API dependency configuration | done | https://github.com/code-corhuila/bysellens-customer-api/pull/9 |
| HU-CUSTOMER-004 | Implement standalone Customer MongoDB configuration | done | https://github.com/code-corhuila/bysellens-customer-db/pull/1 |
| HU-CUSTOMER-005 | Translate Customer DB documentation into English | done | https://github.com/code-corhuila/bysellens-customer-db/pull/2 |
| HU-CUSTOMER-006 | Promote Customer DB configuration to main | done | https://github.com/code-corhuila/bysellens-customer-db/pull/4 |

## 2. My individual contribution

- Implemented the standalone Customer microservice for BY_SELLENS.
- Migrated Customer persistence from PostgreSQL to MongoDB.
- Updated Customer API dependency scopes to improve database configuration.
- Prepared an independent MongoDB configuration repository for Customer DB.
- Organized database configuration, collections, and Docker resources.
- Translated Customer MongoDB documentation into English.
- Created and managed pull requests following the develop → qa → main workflow.
- Promoted Customer API implementation and MongoDB integration to main.
- Promoted Customer DB configuration and documentation through develop and qa.
- Opened release pull requests for the remaining changes.
- Followed Conventional Commits and repository governance rules.

## 3. Blockers and risks

- Customer API PR #9 is awaiting professor approval before merging into main.
- Customer DB PR #4 is awaiting approval before merging into main.
- Customer API and Customer DB configurations must remain compatible.
- MongoDB connectivity and persistence require final integration verification.
- Protected branches require pull request approvals.
- Changes must not affect other BY_SELLENS microservices.

## 4. Plan for next week

- Verify the final integration of Customer API with MongoDB.
- Confirm the Customer DB changes are integrated into `main`.
- Validate database connectivity and persistence.
- Review integration tests and update technical documentation.
- Support Customer integration with other BY_SELLENS microservices.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [x] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links

### Customer API Repository

https://github.com/code-corhuila/bysellens-customer-api

#### Develop - Implementation and configuration

- Standalone Customer service:
  https://github.com/code-corhuila/bysellens-customer-api/commit/5885b9085eca89088c0336352c3e55e447d3a281

- Customer service merge:
  https://github.com/code-corhuila/bysellens-customer-api/commit/f19ec42beeaf4414ce191cb216c79732615237e2

- MongoDB persistence migration:
  https://github.com/code-corhuila/bysellens-customer-api/commit/6f842863ce00dbcc588407c84f3f9005d36fe4ca

- MongoDB integration merge:
  https://github.com/code-corhuila/bysellens-customer-api/commit/140f443fdd049edfcc196d3788977c072281438d

- Customer dependency update:
  https://github.com/code-corhuila/bysellens-customer-api/commit/0a3cccb13f0f9cce79a4bc22ac75424ca3227dd0

- Dependency update merge:
  https://github.com/code-corhuila/bysellens-customer-api/commit/932e52062bbc52b855004938f87853b4f703c2eb

#### QA - Integration and validation

- Customer service implementation:
  https://github.com/code-corhuila/bysellens-customer-api/commit/5885b9085eca89088c0336352c3e55e447d3a281

- Customer service merge:
  https://github.com/code-corhuila/bysellens-customer-api/commit/f19ec42beeaf4414ce191cb216c79732615237e2

- QA Customer service promotion:
  https://github.com/code-corhuila/bysellens-customer-api/commit/5fb3acadbecf1da3635d3811887ccc146e39e2c5

- MongoDB persistence migration:
  https://github.com/code-corhuila/bysellens-customer-api/commit/9d90c6012fee4c20fbe687840741eb92e31394b2

- MongoDB QA promotion:
  https://github.com/code-corhuila/bysellens-customer-api/commit/2953b14b0fc11554439910cefd196c990698d31b

- Dependency configuration:
  https://github.com/code-corhuila/bysellens-customer-api/commit/85b2e167bb1b644f415798445a6fc41a13ff8d48

- Dependency QA promotion:
  https://github.com/code-corhuila/bysellens-customer-api/commit/04934e7ad823c544f6d528409b576ce743c6056f

#### Main - Released implementation

- Standalone Customer service:
  https://github.com/code-corhuila/bysellens-customer-api/commit/2783758d7dd4b480c4113a34cad95405d2f19a83

- MongoDB persistence migration:
  https://github.com/code-corhuila/bysellens-customer-api/commit/88a634811a8e9f6d7705467df3ac8b2241c5d7a1

- MongoDB release merge:
  https://github.com/code-corhuila/bysellens-customer-api/commit/c2d7cfd84506af86971e8d50b29965aef37b8731

- Customer dependency scope update:
  https://github.com/code-corhuila/bysellens-customer-api/commit/ff7201c11e82aba3c765f6ccdc414b01d8d18d21

- Customer dependency release merge:
  https://github.com/code-corhuila/bysellens-customer-api/commit/bbdfe16e4f80ec128d8fc5d4eac6bc6c3ab8d52c

#### Customer API Release Pull Requests

- PR #6 - MongoDB release to main:
  https://github.com/code-corhuila/bysellens-customer-api/pull/6

- PR #9 - Dependency scope updates to main:
  https://github.com/code-corhuila/bysellens-customer-api/pull/9

- Status: MERGED
- Target branch: main
- Release completed: November 14, 2026

---

### Customer DB Repository

https://github.com/code-corhuila/bysellens-customer-db

#### Develop - MongoDB configuration and documentation

- Standalone MongoDB configuration:
  https://github.com/code-corhuila/bysellens-customer-db/commit/4c4ab1933df10a4edfc3b1dc93b0fbd19017ad8f

- MongoDB configuration merge:
  https://github.com/code-corhuila/bysellens-customer-db/commit/ba727fbff38fe18d0bf713c664e7e097aa1d8250

- English documentation:
  https://github.com/code-corhuila/bysellens-customer-db/commit/83008169b87c54da5e68ee9954fe2ad697b12de2

- Documentation merge:
  https://github.com/code-corhuila/bysellens-customer-db/commit/639913f2128574828583721fdd5d04300870bcea

#### QA - Database configuration promotion

- MongoDB configuration:
  https://github.com/code-corhuila/bysellens-customer-db/commit/2117e37fd5302c7ad5ba6067424e1e46a40ee047

- English documentation:
  https://github.com/code-corhuila/bysellens-customer-db/commit/6cc893f2493bbfbc651f6cd1cb9a53cf4666201b

- QA promotion merge:
  https://github.com/code-corhuila/bysellens-customer-db/commit/6333ef9bac64b70fa70b9fed091ecd9459234612

#### Main - Released MongoDB configuration

- Standalone MongoDB configuration:
  https://github.com/code-corhuila/bysellens-customer-db/commit/e680336a22e450ca9203fd62c072fbf36ac95a7e

- English MongoDB documentation:
  https://github.com/code-corhuila/bysellens-customer-db/commit/73f20c42ff0fe85fd948d1b838a3f87ec3c0a229

- Customer DB release merge:
  https://github.com/code-corhuila/bysellens-customer-db/commit/d22a2c53f03f1a6fa6d97da238b526e30d898e12

#### Customer DB Release Pull Request

- PR #4 - Release MongoDB configuration to main:
  https://github.com/code-corhuila/bysellens-customer-db/pull/4

- Status: MERGED
- Target branch: main
- Release completed: November 14, 2026

---
