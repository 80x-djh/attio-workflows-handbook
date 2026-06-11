---
title: Update record
description: Updates attribute values on an existing Attio record.
sidebar:
  order: 3
page-type: block-reference
---

**Update record** writes new values to an existing record.

| | |
| --- | --- |
| **Type** | Record step |
| **Credit cost** | 1 credit |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Object | Yes | Object the record belongs to. |
| Record | Yes | Specific record or variable from an earlier block. |
| Attributes to set | Yes | Values to write. |
| Replace existing values | No | Controls multi-select replacement vs append behavior. |

## Outputs

- Updated record data

## Gotchas

- Updating the same object that triggered the workflow can create loops.
- Use workflow write access before publishing.
- Reference the Update record output downstream.

## Example

Round robin -> Update lead owner -> Create task for picked owner.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
