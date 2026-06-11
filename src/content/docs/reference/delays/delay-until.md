---
title: Delay until
description: Pauses a workflow run until a specific date and time.
sidebar:
  order: 2
page-type: block-reference
---

**Delay until** pauses a run until a timestamp.

| | |
| --- | --- |
| **Type** | Delay step |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Delay until | Yes | Fixed date/time or variable, often from Adjust time. |

## Gotchas

- Check workflow timezone.
- Delayed runs use the workflow version active when they started.
- If the referenced timestamp is empty or malformed, inspect variables in the run viewer.

## Example

Contract signed -> Delay until renewal reminder date -> Create renewal task.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
