---
title: Loop
description: Repeats nested workflow blocks for each item in an iterable list.
sidebar:
  order: 1
page-type: block-reference
---

**Loop** repeats steps for each item in a list.

| | |
| --- | --- |
| **Type** | Utility/control step |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Iterable | Yes | A list of records, entries, linked records, multi-select values, or other iterable output. |
| Limit | No | Maximum number of iterations. |

## Outputs inside the loop

- Current item
- Item position
- Count
- Total count
- Limit

## Gotchas

- The Loop block is free; blocks inside it may cost credits per iteration.
- Set a low limit while testing.
- Place post-loop steps on the Complete path, not inside the loop container.

## Example

Find stale deals -> Loop over matching records -> Create task for each owner.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
