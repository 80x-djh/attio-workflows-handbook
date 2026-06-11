---
title: Create or update record
description: Matches on a unique attribute, updates an existing record if found, or creates a new one.
sidebar:
  order: 2
page-type: block-reference
---

**Create or update record** is the idempotent upsert block for records.

| | |
| --- | --- |
| **Type** | Record step |
| **Credit cost** | 1 credit |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Object | Yes | Object to create or update. |
| Matching attribute | Yes | Unique attribute used to find an existing record. |
| Attributes to set | No | Values to write. |
| Replace existing values | No | Controls multi-select replacement vs append behavior. |

## Outputs

- Created or updated record data

## Gotchas

- Choose a truly unique matching attribute, such as email or domain.
- Be careful with Replace existing values on multi-selects.
- Use the block output downstream, not stale trigger data.

## Example

Webhook lead intake -> Create or update person by email -> Add person to inbound list.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
