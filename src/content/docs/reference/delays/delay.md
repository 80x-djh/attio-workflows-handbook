---
title: Delay
description: Pauses a workflow run for a fixed duration.
sidebar:
  order: 1
page-type: block-reference
---

**Delay** pauses a run for a configured amount of time.

| | |
| --- | --- |
| **Type** | Delay step |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Delay | Yes | Number plus unit: seconds, minutes, hours, days, or weeks. |

## Gotchas

- In-flight runs continue on the workflow version they started on.
- Delays can hide operational problems. Use them when timing matters, not as a debugging patch.

## Example

Lead enters sequence -> Delay 3 days -> check if replied -> create follow-up task.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
