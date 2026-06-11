---
title: Delete list entry
description: Removes an existing entry from a selected Attio list.
sidebar:
  order: 3
page-type: block-reference
---

**Delete list entry** removes a record from a list.

| | |
| --- | --- |
| **Type** | List step |
| **Credit cost** | 1 credit |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| List | Yes | List the entry belongs to. |
| Entry | Yes | List entry to delete. |

## Outputs

This block does not expose a useful downstream output.

## Gotchas

- This removes the list entry, not the underlying record.
- Deletion is a write. Use filters to prevent accidental removals.
- If the entry might not exist, find it first.

## Example

Deal marked Lost -> Find open onboarding list entry -> Delete list entry.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
