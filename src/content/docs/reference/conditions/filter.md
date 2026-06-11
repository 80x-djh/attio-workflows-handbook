---
title: Filter
description: Continues the workflow only when configured conditions are true.
sidebar:
  order: 1
page-type: block-reference
---

**Filter** is the cheapest, most important safety block in Attio Workflows.

| | |
| --- | --- |
| **Type** | Condition step |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Conditions | Yes | Conditions or condition groups that must be true. |

## Outputs

Filter does not produce a downstream data output. It either continues or stops the run.

## Gotchas

- Put filters before AI, HTTP, sequence, Slack, and write blocks.
- Use filters to prevent self-triggering loops.
- A stopped run is not an error.

## Example

Attribute value changed -> Filter new value is Won -> Slack alert.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
