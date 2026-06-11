---
title: Formula
description: Calculates a numeric result from a mathematical expression using workflow variables.
sidebar:
  order: 4
page-type: block-reference
---

**Formula** evaluates a mathematical expression.

| | |
| --- | --- |
| **Type** | Calculation step |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Formula | Yes | Supports `+`, `-`, `/`, and `*` with number or currency variables. |

## Outputs

- Formula result

## Gotchas

- Empty variables can make formulas fail. Add fallbacks such as `0`.
- Save the result with an Update step if it should persist.
- Keep formulas simple enough for operators to understand.

## Example

Use MRR variable in `MRR * 12` -> Update ARR attribute.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
