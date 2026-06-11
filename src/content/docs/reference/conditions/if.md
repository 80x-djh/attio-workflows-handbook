---
title: If
description: Creates true and false paths based on configured conditions.
sidebar:
  order: 2
page-type: block-reference
---

**If** routes a workflow down one of two paths.

| | |
| --- | --- |
| **Type** | Condition step |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Conditions | Yes | True path runs when conditions match; false path runs otherwise. |

## Outputs

If controls pathing and does not produce a data output.

## Gotchas

- Legacy workflows called this block If/else.
- Use Switch when you have more than two meaningful cases.
- Name downstream blocks clearly so the run viewer is readable.

## Example

Random number -> If greater than 0.5 -> assign to rep A; false path -> assign to rep B.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
