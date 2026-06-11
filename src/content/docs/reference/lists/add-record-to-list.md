---
title: Add record to list
description: Adds a record to a selected Attio list and optionally sets list-entry attributes.
sidebar:
  order: 1
page-type: block-reference
---

**Add record to list** creates a list entry for a record.

| | |
| --- | --- |
| **Type** | List step |
| **Credit cost** | 1 credit |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| List | Yes | List where the record should be added. |
| Record | Yes | Record to add. |
| Attributes to set | No | Initial list-entry attribute values. |

## Outputs

- Created list entry data

## Gotchas

- A list entry is not the same as a record.
- If the record may already be on the list, check existing entries first to avoid duplicates.
- Set list attributes here when possible instead of adding a separate Update list entry block.

## Example

New qualified company -> Add record to Sales pipeline with source and priority.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
