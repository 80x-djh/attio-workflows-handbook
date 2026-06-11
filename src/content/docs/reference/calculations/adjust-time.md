---
title: Adjust time
description: Moves a timestamp forward or backward by a configured amount.
sidebar:
  order: 2
page-type: block-reference
---

**Adjust time** shifts a timestamp.

| | |
| --- | --- |
| **Type** | Calculation step |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Timestamp | Yes | Fixed timestamp or variable. |
| Offset | Yes | Positive moves forward, negative moves backward. |
| Unit | Yes | Seconds, minutes, hours, days, weeks, months, or years. |

## Outputs

- Adjusted timestamp

## Example

Deal moves to In Progress -> Adjust updated timestamp by +5 days -> Create task due on adjusted timestamp.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
