---
title: Manual run
description: Starts a workflow on demand from the workflow editor, without selecting a record or list entry.
sidebar:
  order: 10
page-type: trigger-reference
---

**Manual run** lets a builder start the workflow from the editor.

| | |
| --- | --- |
| **Type** | Trigger (manual) |
| **Credit cost** | Free |

## Inputs

This trigger has no configurable inputs.

## Outputs

- Actor
- Timestamp

## When to use it

Use it for testing schedules, webhook-like flows, or workflows that begin with a Find records / Find list entries block.

## Gotchas

- Manual run does not pass a record or list entry into the workflow.
- If the workflow needs a specific record, use [Record command](/reference/triggers/record-command/) instead.
- If it needs a specific list entry, use [List entry command](/reference/triggers/list-entry-command/).

## Example

Manual run -> Find records where renewal date is within 30 days -> Loop -> Create task.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
