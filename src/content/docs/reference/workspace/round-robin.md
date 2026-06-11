---
title: Round robin
description: Selects a user from a configured set, cycling through the list across workflow runs.
sidebar:
  order: 1
page-type: block-reference
---

**Round robin** picks a user from a list and cycles over time.

| | |
| --- | --- |
| **Type** | Workspace/control step |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Users | Yes | Workspace members to include. |

## Outputs

- Picked user
- Picked user's email address

## Gotchas

- It picks; it does not write. Follow with Update record/list entry or Create task.
- Keep the user list current.
- Use filters before round-robin to avoid routing unqualified leads.

## Example

Inbound lead qualifies -> Round robin -> Update owner -> Create task.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
