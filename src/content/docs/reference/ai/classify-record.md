---
title: Classify record
description: Uses AI to assign one or more tags to a record based on its attributes.
sidebar:
  order: 1
page-type: block-reference
---

**Classify record** uses AI to tag a record from a list of options you provide.

| | |
| --- | --- |
| **Type** | AI step |
| **Credit cost** | Variable, token-based |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Record | Yes | Record to classify. |
| Tags | Yes | Allowed tag options. |
| Allow multiple tags | No | Lets AI return more than one tag. |

## Outputs

- Record classification

## Gotchas

- The output is not saved automatically.
- If saving to a select or multi-select attribute, create matching options first.
- Keep tag names mutually exclusive when you need a single answer.

## Example

Company created -> Classify record into ICP tiers -> Update record `ICP tier`.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
