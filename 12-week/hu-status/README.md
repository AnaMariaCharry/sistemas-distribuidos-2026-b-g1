<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       12-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 12

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Ana Maria Charry Forero
- GITHUB_USER: AnaMariaCharry
- TEAM: Bysellens 
- SPRINT_GOAL: Improve project documentation by updating infrastructure verification status, acceptance criteria, traceability, and microservices alignment. 
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| Documentation | Clarify infrastructure verification status | done | https://github.com/code-corhuila/bysellens-docs/pull/71 |
| Documentation | Clarify acceptance criteria and traceability | done | https://github.com/code-corhuila/bysellens-docs/pull/76 |
| Documentation | Update microservices alignment and catalog | done | https://github.com/code-corhuila/bysellens-docs/pull/82 |

## 2. My individual contribution
- Updated the infrastructure and technology verification status in `01-context/scope.md`.
- Improved acceptance criteria and traceability documentation in `04-requirements`.
- Updated service alignment and catalog documentation in `09-microservices`.
- Created three Pull Requests and merged the documentation changes into `main`.

## 3. Blockers and risks
- Infrastructure and technology functionality still need verification.
- Some referenced documentation files are missing from `main`.
- Microservices documentation updates still require validation against actual implementations.

## 4. Plan for next week
- Review the updated documentation.
- Verify infrastructure and technology functionality.
- Check missing documentation references.
- Continue improving microservices documentation and project traceability.

## 5. Compliance self-check
- [X] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [X] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [X] DDD / hexagonal boundaries respected (domain has no I/O)
- [X] No secrets; config via environment variables

## 6. Evidence links
### PR #71 — Infrastructure verification status

- PR: https://github.com/code-corhuila/bysellens-docs/pull/71
- Content commit: https://github.com/code-corhuila/bysellens-docs/commit/900222ba74eb6c0a888b5f97e5b12dafdb2f4c99
- Content commit SHA: `900222ba74eb6c0a888b5f97e5b12dafdb2f4c99`
- Merge commit: https://github.com/code-corhuila/bysellens-docs/commit/f1a676eeb914164c78c18bf8d61592e74bd4d7f5
- Merge commit SHA: `f1a676eeb914164c78c18bf8d61592e74bd4d7f5`
- Status: Merged
- Branch: `docs/01-context-update` → `main`

### PR #76 — Acceptance criteria and traceability

- PR: https://github.com/code-corhuila/bysellens-docs/pull/76
- Content commit: https://github.com/code-corhuila/bysellens-docs/commit/47e3ef7361bc687e0c3e7a36a42d3d5dd897eccb
- Content commit SHA: `47e3ef7361bc687e0c3e7a36a42d3d5dd897eccb`
- Merge commit: https://github.com/code-corhuila/bysellens-docs/commit/72c29c7474623f4aead79c2a2774ef2552196c77
- Merge commit SHA: `72c29c7474623f4aead79c2a2774ef2552196c77`
- Status: Merged
- Branch: `docs/04-requirements` → `main`

### PR #82 — Microservices alignment and catalog

- PR: https://github.com/code-corhuila/bysellens-docs/pull/82
- Content commit: https://github.com/code-corhuila/bysellens-docs/commit/782b1cbfade15065bda500f174ed832c0b17265f
- Content commit SHA: `782b1cbfade15065bda500f174ed832c0b17265f`
- Merge commit: https://github.com/code-corhuila/bysellens-docs/commit/afd5051dbf0165ac5aed17f5235be10d8efebd23
- Merge commit SHA: `afd5051dbf0165ac5aed17f5235be10d8efebd23`
- Status: Merged
- Branch: `docs/09-microservices` → `main`
