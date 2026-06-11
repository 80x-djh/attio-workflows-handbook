---
title: Summarize record
description: Uses AI to generate a text summary from a record's attributes.
sidebar:
  order: 3
page-type: block-reference
---

**Summarize record** generates a text summary of a record.

| | |
| --- | --- |
| **Type** | AI step |
| **Credit cost** | Variable, token-based |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Record | Yes | Record to summarize. |
| Instructions | Yes | What to include, omit, and emphasize. |

## Outputs

- Record summary

## Gotchas

- It does not save the summary automatically.
- Create a text attribute and follow with Update record.
- Be explicit about length and sources, or summaries drift.

## Example

Record command on Company -> Summarize record for AE prep -> Update `Sales brief` attribute.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
