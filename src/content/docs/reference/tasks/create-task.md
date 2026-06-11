---
title: Create task
description: Creates a new Attio task, optionally linked to records and assigned to users.
sidebar:
  order: 1
page-type: block-reference
---

**Create task** creates a task.

| | |
| --- | --- |
| **Type** | Task step |
| **Credit cost** | 1 credit |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Task | Yes | Task text. |
| Due | No | Fixed date or variable. |
| Linked records | No | Fixed record or variable. |
| Assignees | No | Fixed user or variable. |

## Outputs

- Created task data

## Gotchas

- Empty due, linked record, or assignee inputs are simply omitted.
- Assignees are notified.
- Guard against duplicate task creation on retries or repeated trigger events.

## Example

Stale deal found -> Create task for deal owner due tomorrow.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
