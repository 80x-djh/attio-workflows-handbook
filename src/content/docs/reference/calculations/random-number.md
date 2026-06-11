---
title: Random number
description: Generates a number between a minimum and maximum value.
sidebar:
  order: 5
page-type: block-reference
---

**Random number** returns a random number in a configured range.

| | |
| --- | --- |
| **Type** | Calculation/control step |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Minimum | Yes | Lower bound. |
| Maximum | Yes | Upper bound. |

## Outputs

- Random number

## When to use it

Use it for simple weighted routing or experimentation. Prefer [Round robin](/reference/workspace/round-robin/) when fairness over time matters.

## Example

Random number 0-1 -> If number greater than 0.5 -> assign to rep A, else rep B.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
