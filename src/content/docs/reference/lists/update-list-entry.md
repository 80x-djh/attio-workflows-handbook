---
title: Update list entry
description: Updates attributes on an existing list entry.
sidebar:
  order: 2
page-type: block-reference
---

**Update list entry** modifies a record's entry inside a selected list.

| | |
| --- | --- |
| **Type** | List step |
| **Credit cost** | 1 credit |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| List | Yes | List the entry belongs to. |
| Entry | Yes | List entry, not the parent record. |
| Attributes to set | Yes | List attributes to write. |
| Replace existing values | No | Controls multi-select replacement vs append behavior. |

## Outputs

- Updated list entry data

## Gotchas

- Passing a record where the block expects an entry fails.
- Use [Find list entries](/reference/lists/find-list-entries/) when starting from a record.
- Updating a watched list attribute can retrigger list workflows.

## Example

Round robin routing -> Update inbound list entry owner and SLA status.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
