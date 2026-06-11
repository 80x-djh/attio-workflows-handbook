---
title: Task created
description: Fires when a new Attio task is created.
sidebar:
  order: 8
page-type: trigger-reference
---

**Task created** starts a workflow whenever a task is created.

| | |
| --- | --- |
| **Type** | Trigger (automatic) |
| **Credit cost** | Free |

## Inputs

This trigger has no configurable inputs.

## Outputs

- Task data
- Actor
- Timestamp

## When to use it

Use it for task operations: notifying managers about urgent tasks, classifying task types, or syncing tasks to another system.

## Gotchas

- It is broad. If you only care about tasks from one process, add a Filter immediately after the trigger.
- Be careful creating tasks from a Task created workflow. Without a guard, it can create loops or noisy task chains.

## Example

Task created -> Filter task text contains "handoff" -> Broadcast message to the account owner.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
