---
title: Classify text
description: Uses AI to classify a text input into one or more tags.
sidebar:
  order: 2
page-type: block-reference
---

**Classify text** tags a text value, such as a form answer, email snippet, or webhook field.

| | |
| --- | --- |
| **Type** | AI step |
| **Credit cost** | Variable, token-based |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Input | Yes | Text to classify. |
| Tags | Yes | Allowed tag options. |
| Allow multiple tags | No | Lets AI return more than one tag. |

## Outputs

- Text classification

## Gotchas

- Save the output with an Update step if it should persist.
- Use deterministic filters first when keywords are enough.
- Avoid overlapping tag definitions.

## Example

Webhook lead intake -> Parse JSON `message` -> Classify text into pain categories -> Update list entry.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
