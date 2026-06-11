---
title: Infinite loops and safety
description: How to prevent Attio workflows from re-triggering themselves, duplicating writes, or burning credits.
page-type: guide
---

An infinite loop happens when a workflow writes data that triggers itself or another workflow, which writes data that triggers the first workflow again.

## Common loop shape

```text
Record updated on Company
-> Update record on the same Company
-> Record updated fires again
```

## Safety guards

- Scope update triggers to one attribute.
- Do not update the same attribute the trigger watches.
- Add an early Filter: Updated by -> Type -> is not -> Workflow.
- Use a dedicated `Last workflow run at` or `Workflow processed` field when idempotency matters.
- Prefer Record command for expensive or dangerous workflows until behavior is proven.
- Keep Loop limits low while testing.

## Duplicate write guard

For tasks, list entries, and sequence enrollments, ask "what happens if this runs twice?"

- Use filters to check whether the task/list entry/status already exists.
- Use Create or update record with a matching attribute for idempotent record writes.
- Stamp processed records with a timestamp.
- In recipes, design retries so they do not double-create downstream objects.

## Emergency response

1. Disable or archive the workflow.
2. Check the Runs tab for the trigger path and credit cost.
3. Identify the write that retriggered the workflow.
4. Add a guard filter.
5. Test on one record before republishing.
