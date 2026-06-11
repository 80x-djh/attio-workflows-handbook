---
title: Aggregate values
description: Aggregates a list of numeric or currency values with sum, average, minimum, or maximum.
sidebar:
  order: 3
page-type: block-reference
---

**Aggregate values** combines numeric values.

| | |
| --- | --- |
| **Type** | Calculation step |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Values | Yes | Number or currency values, usually from a variable. |
| Aggregation type | Yes | Sum, Average, Minimum, or Maximum. |

## Outputs

- Aggregated result

## Gotchas

- It works on numeric/currency values, not arbitrary text.
- Save the result with Update record or Update list entry if it should persist.

## Example

Find deals for company -> Aggregate deal values -> Update company total pipeline value.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
