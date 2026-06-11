---
title: Switch
description: Routes a workflow into multiple case paths based on ordered conditions.
sidebar:
  order: 3
page-type: block-reference
---

**Switch** routes a workflow across multiple cases.

| | |
| --- | --- |
| **Type** | Condition step |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Case conditions | Yes | Conditions that must be true for each case path. |
| Default path | No | Runs when no case matches, if connected. |

## Outputs

Switch controls pathing and does not produce a data output.

## Gotchas

- Cases are evaluated in order. The first true case runs.
- Use Default deliberately: either catch everything or stop quietly.
- Rename cases for business meaning, not "Case 1".

## Example

Lead score -> Switch high/medium/low -> alert, nurture, or update score only.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
