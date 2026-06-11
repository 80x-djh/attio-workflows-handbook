---
title: Workflow governance
description: Naming, ownership, documentation, access, and review practices for teams operating Attio Workflows in production.
page-type: guide
---

Workflows become infrastructure. Treat them like it.

## Naming convention

Use:

```text
[Object/List] - [Trigger] -> [Outcome]
```

Examples:

- `Deals - Stage won -> Slack alert`
- `Inbound list - New entry -> Route owner`
- `Companies - Domain added -> Enrichment`

## Required description

Every workflow description should include:

- owner
- business purpose
- trigger
- expected monthly volume
- credit model
- rollback instruction

## Access

Set workspace access to the lowest reasonable level. Grant edit/publish access only to builders who understand the data model and credit implications.

## Review cadence

Weekly for the first month after launch:

- failed runs
- credit usage
- duplicate records/tasks
- workflow volume vs expected volume

Monthly after stable:

- owner still valid
- fields still exist
- downstream app credentials still connected
- no stale paused runs
