<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       09-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 09

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Ana María Charry Forero
- GITHUB_USER: AnaMariaCharry
- TEAM: Bysellens
- SPRINT_GOAL: Update and align the By_Sellens documentation for the second cut, including requirements, microservices, UML diagrams, stock concurrency, and product contracts. 
<!-- CONFIG-END -->

## 1. User stories worked this week
| **HU ID** | **Title** | **Status (todo/doing/done)** | **Evidence (PR or commit URL)** |
| ---------- | --------- | ---------------------------- | ------------------------------- |
| Documentation | Update second-cut requirements and user stories | done | [PR #38](https://github.com/code-corhuila/bysellens-docs/pull/38) - [Merge commit `aee5fc5`](https://github.com/code-corhuila/bysellens-docs/commit/aee5fc5d61fc150f585fba4ca642a92a5fd36128) |
| Documentation | Update second-cut microservices documentation | done | [PR #37](https://github.com/code-corhuila/bysellens-docs/pull/37) - [Merge commit `ac84524`](https://github.com/code-corhuila/bysellens-docs/commit/ac8452426cc327d68f53184243e3615293ecb552) |
| Documentation | Add query products sequence diagram | done | [PR #43](https://github.com/code-corhuila/bysellens-docs/pull/43) - [Merge commit `5ea7deb`](https://github.com/code-corhuila/bysellens-docs/commit/5ea7debe8f25b8fd4930e8b16575c4de4e826b06) |
| Documentation | Align stock concurrency and product contracts | done | [PR #47](https://github.com/code-corhuila/bysellens-docs/pull/47) - [Commit `716a58e`](https://github.com/code-corhuila/bysellens-docs/commit/716a58efa5c7fb9694a56d54c75614144a1c9258) |

## 2. My individual contribution
- Updated the second-cut requirements and user stories.
- Updated and aligned the microservices documentation with the responsibilities of the project domains.
- Added the UML sequence diagram for product queries.
- Updated the microservices documentation to align stock concurrency, initial stock initialization, and Product-to-Inventory API contracts.
- Completed and merged PR #37, PR #38, PR #43, and PR #47.

## 3. Blockers and risks
- Some architecture and implementation decisions still need to be aligned with the new repository and distributed-systems standards.
- The documentation must remain consistent across requirements, domain definitions, UML diagrams, API contracts, and microservices as implementation begins.

## 4. Plan for next week
- Review the current monolith to identify the components and responsibilities that belong to each domain.
- Start working with the new repository structure required for the microservices architecture.
- Begin the implementation of the first domain.
- Keep the requirements, domain, UML, API, and microservices documentation aligned with the implementation.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
### PR #37 — Microservices documentation

- PR: https://github.com/code-corhuila/bysellens-docs/pull/37
- Merge commit: https://github.com/code-corhuila/bysellens-docs/commit/ac8452426cc327d68f53184243e3615293ecb552
- Merge commit SHA: `ac8452426cc327d68f53184243e3615293ecb552`
- Status: Merged

### PR #38 — Requirements and user stories

- PR: https://github.com/code-corhuila/bysellens-docs/pull/38
- Merge commit: https://github.com/code-corhuila/bysellens-docs/commit/aee5fc5d61fc150f585fba4ca642a92a5fd36128
- Merge commit SHA: `aee5fc5d61fc150f585fba4ca642a92a5fd36128`
- Status: Merged

### PR #43 — UML query products sequence diagram

- PR: https://github.com/code-corhuila/bysellens-docs/pull/43
- Merge commit: https://github.com/code-corhuila/bysellens-docs/commit/5ea7debe8f25b8fd4930e8b16575c4de4e826b06
- Merge commit SHA: `5ea7debe8f25b8fd4930e8b16575c4de4e826b06`
- Status: Merged

### PR #47 — Stock concurrency and product contracts

- PR: https://github.com/code-corhuila/bysellens-docs/pull/47
- Commit: https://github.com/code-corhuila/bysellens-docs/commit/716a58efa5c7fb9694a56d54c75614144a1c9258
- Commit SHA: `716a58efa5c7fb9694a56d54c75614144a1c9258`
- Status: Merged
- Branch: `docs/09-microservices` → `main`
