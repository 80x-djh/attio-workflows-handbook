---
title: Find list entries
description: Finds entries in a selected list that match filter conditions.
sidebar:
  order: 4
page-type: block-reference
---

**Find list entries** returns matching entries from a list.

| | |
| --- | --- |
| **Type** | List lookup step |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| List | Yes | List to search. |
| Limit | Yes | Maximum 100 entries. |
| Filter | Yes | Conditions entries must match. |

## Outputs

- Matching list entries
- Number of matches

## Gotchas

- Use this to bridge from a record to its list entry.
- Loop if you intend to process multiple matches.
- List-entry filters can use both list attributes and related record context depending on configuration.

## Example

Record command on Company -> Find list entries in Pipeline where company is current record -> Update list entry stage.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
