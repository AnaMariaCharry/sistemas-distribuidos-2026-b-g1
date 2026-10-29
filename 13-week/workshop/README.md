# Week 13 - Threat Modeling and Security Backlog

## CP0 - Preparation and Trust Boundary Claim

**Status: Partial draft. CP0 is not officially complete.** The complete official CONFIG template and the outstanding evidence below require verification.

<!-- CONFIG-START -->
- LIBRARY_BOOK: William Stallings; Fundamentos de seguridad en redes: aplicaciones y estándares; second edition; year: PENDING_VERIFICATION; library call number: PENDING_VERIFICATION; consulted pages or chapter: PENDING_VERIFICATION.
- LIBRARY_RECORD_TIME: PENDING_VERIFICATION
<!-- CONFIG-END -->

Only CONFIG keys explicitly confirmed in the Spanish workshop guide are included. The complete template from the original English guide is PENDING_VERIFICATION; this block is not claimed to satisfy the full official schema.

## Project and Authorized Repositories

- Project: By_Sellens; domain: Customer.
- Student: Ana Maria Charry Forero; GitHub user: `AnaMariaCharry`.
- Personal delivery repository: https://github.com/AnaMariaCharry/sistemas-distribuidos-2026-b-g1
- Team documentation repository: https://github.com/code-corhuila/bysellens-docs
- This draft belongs only to the personal fork. It does not modify team documentation or create an issue.

## Claimed Trust Boundary

- Boundary: `Administrator browser -> Customer API`.
- Claim issue title: `Threat model: Administrator browser -> Customer API — @AnaMariaCharry`.
- Claim status: the student reports that the issue was created manually in the team documentation repository; its URL and contents have not been independently verified.
- Claim issue URL: PENDING_VERIFICATION.
- Initiator: the administrator's browser calls the documented Customer API.
- Documented entry points: `/api/v1/customers` and `/api/v1/customers/{id}`.
- Documented security requirements: Bearer JWT validation and ADMIN authorization at Customer operations; business customers are distinct from administrator login identities.
- Boundary data: authenticated requests, customer registration or update fields such as name and optional phone, customer identifiers, and Customer responses.
- Runtime status: Customer backend implementation, deployment and enforcement of the documented controls remain unverified. Documentation is not proof of a functioning integration.

## Project Evidence

Reference snapshot: the supplied archive `bysellens-docs-main (1).zip`. Paths below are relative to its `bysellens-docs-main/` root; they describe documented design, not verified runtime behavior.

- `03-product/vision.md`: administrative Customer management and the second-cut authentication scope.
- `07-api/contracts/openapi/customer-service.yaml`: Customer routes and the Bearer/ADMIN contract.
- `07-api/authentication.md`: independent token validation by business services and separation of administrator and customer identities.
- `05-architecture/decisions/records/ADR-002-second-cut-authentication.md`: accepted authentication design with implementation verification pending.
- `04-requirements/non-functional.md`: NFR-003 security, input validation and protection of customer information.

## Physical Library Book and Personal Reflection

The student selected William Stallings, *Fundamentos de seguridad en redes: aplicaciones y estándares*, second edition. The original published title is retained for bibliographic accuracy. Publication year, library call number, consulted pages/chapter and library registration time are PENDING_VERIFICATION; no visit record or book passage is fabricated.

- Required personal document: `W13 Reflection - Ana Maria Charry Forero`.
- W13 reflection URL: PENDING_VERIFICATION. The Week 11 link is not reused.
- Sharing with `jesus.gonzalez@corhuila.edu.co` as Editor: PENDING_VERIFICATION.
- The student must write the CP0 reflection personally and confirm sharing. No reflection is authored or included here.

## Remaining CP0 Checks

Verify the original English CONFIG template, supply the actual claim issue URL, confirm the W13 reflection link and sharing, and complete the required physical-book and library-record details. Validate the resulting CONFIG against the official template before considering CP0 complete. No CP1 or later checkpoint work is included in this draft.
