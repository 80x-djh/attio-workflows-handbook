---
title: Exit from sequence
description: Removes a person record from future emails in an Attio sequence.
sidebar:
  order: 2
page-type: block-reference
---

**Exit from sequence** stops future sequence emails for a recipient.

| | |
| --- | --- |
| **Type** | Sequence step |
| **Credit cost** | 1 credit |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Sequence | Yes | Sequence to exit from. |
| Recipient | Yes | Person record to remove. |

## Outputs

This block does not expose a useful downstream output.

## Gotchas

- If the person is not in the sequence, the workflow run does not fail.
- Use it when a lead replies, books, becomes customer, or enters suppression.

## Example

Deal created with existing contact -> Exit contact from prospecting sequence.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
