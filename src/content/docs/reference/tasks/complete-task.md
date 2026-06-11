---
title: Complete task
description: Marks an Attio task complete.
sidebar:
  order: 2
page-type: block-reference
---

**Complete task** marks a selected task as complete.

| | |
| --- | --- |
| **Type** | Task step |
| **Credit cost** | 1 credit |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Task | Yes | Usually a variable from an earlier Create task or Task created trigger. |

## Outputs

This block does not expose a useful downstream output.

## Gotchas

- The input must be a task, not a linked record.
- Use it sparingly. Automatically completing human tasks can hide operational problems.

## Example

Task created by workflow -> external confirmation received -> Complete task.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
