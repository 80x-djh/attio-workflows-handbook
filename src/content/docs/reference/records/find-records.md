---
title: Find records
description: Finds records that match filter conditions so later workflow steps can use them.
sidebar:
  order: 4
page-type: block-reference
---

**Find records** returns matching records from an object.

| | |
| --- | --- |
| **Type** | Record lookup step |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Object | Yes | Object to search. |
| Limit | Yes | Maximum 100 records. |
| Filter | Yes | Conditions records must match. |

## Outputs

- Matching records
- Number of matches

## Gotchas

- Limit is required and maxes at 100.
- Passing a list of matches into a single-record input uses only the first match unless you loop.
- Use Loop for multi-record writes.

## Example

Recurring schedule -> Find records where open deal is stale -> Loop -> Create task.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
