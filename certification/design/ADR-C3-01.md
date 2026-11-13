# ADR-C3-01: High Availability for Customer Service on Huawei Cloud

> Template. Replace every `<...>` and delete this note. Text left as `<...>` counts as missing.

## Status

Proposed

## Context

In By_Sellens, customer-service manages customer registration, consultation, updates, and logical deletion. The sales-service depends on customer-service to validate active customers before registering sales.
According to the architecture design note, Section 3 (Scalability), the system needs a cloud architecture that improves service availability and supports future growth.
The current documented architecture uses Java, Spring Boot, PostgreSQL, and Docker. However, the Customer documentation does not establish a deployed high-availability configuration.

## Decision

I propose deploying customer-service as a containerized application on Huawei Cloud using Cloud Container Engine (CCE). The service will run with at least two replicas distributed across different availability zones, with load balancing to distribute requests.
Customer data will remain in a dedicated PostgreSQL database managed by the Customer domain. This design will help maintain service availability and allow customer-service to scale independently without changing its business responsibilities.

## Alternatives considered

- Single ECS instance: Rejected because a server failure could interrupt customer management and customer validation during sales.
- One container replica: Rejected because it does not provide sufficient redundancy if the application instance fails.

## Consequences

- Positive:  Customer-service can improve availability, distribute requests, and scale independently while preserving its existing responsibilities.
- Negative:  Using multiple replicas, load balancing, and cloud infrastructure increases operational complexity and costs.
