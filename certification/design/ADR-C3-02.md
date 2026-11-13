# ADR-C3-02: Customer Database Protection and Recovery on Huawei Cloud

> Template. Replace every `<...>` and delete this note. Text left as `<...>` counts as missing.

## Status

Proposed

## Context

In By_Sellens, the customer-service microservice manages customer information using a PostgreSQL database called `customer_db`.
The sales-service depends on customer-service to verify that customers are active before registering sales. Therefore, a database failure could affect both customer management and the sales process.
According to Section 4 (Disaster Recovery) of the architecture design note, the system needs a strategy to protect customer data and recover the service after possible failures.
The current Customer documentation does not establish verified backup and recovery procedures.

## Decision

I propose using Huawei Cloud Relational Database Service (RDS) for PostgreSQL, with automatic backups and a high-availability configuration across different availability zones.
I also propose defining restoration procedures and performing periodic recovery tests to verify that customer information can be restored after a failure.
This solution aims to protect customer data, reduce the risk of information loss, and improve service recovery without changing the responsibilities of other microservices.

## Alternatives considered

- **PostgreSQL on a single ECS instance:** Rejected because backups, maintenance, and failure recovery would require more manual administration.
- **Database without automatic backups:** Rejected because it increases the risk of data loss and makes service recovery more difficult.

## Consequences

- Positive: This approach would improve customer data protection, facilitate database recovery, and reduce service interruptions caused by database failures.
- Negative: It would increase infrastructure costs and require regular configuration, monitoring, and testing of backup and recovery mechanisms.
