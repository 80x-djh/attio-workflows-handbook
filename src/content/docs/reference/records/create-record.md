---
title: Create record
description: Creates a new record in an Attio object.
sidebar:
  order: 1
page-type: block-reference
---

**Create record** creates a new record.

| | |
| --- | --- |
| **Type** | Record step |
| **Credit cost** | 1 credit |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Object | Yes | Object to create a record in. |
| Attributes to set | No | Values for the new record. |

## Outputs

- Created record data

## Gotchas

- If the record may already exist, use [Create or update record](/reference/records/create-or-update-record/).
- Required attributes still need values.
- Avoid duplicate creation in retry paths.

## Example

Webhook received -> Parse JSON -> Create company from submitted domain.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
