---
title: Attribute value changed
description: Fires when a selected object or list attribute is set or changed, including values set during record or list-entry creation.
sidebar:
  order: 7
page-type: trigger-reference
---

**Attribute value changed** starts a workflow when a specific attribute gets a value or changes value.

| | |
| --- | --- |
| **Type** | Trigger (automatic) |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Object or List | Yes | Choose where the attribute lives |
| Attribute | Yes | The attribute to monitor |

## Outputs

- Parent record data for object attributes, or list entry data for list attributes
- Attribute new value
- Attribute previous value
- Actor
- Timestamp

## When to use it

Use this when the business rule is "this field became X." It catches both creation-time values and later edits, which makes it safer than Record updated or List entry updated for most stage/status workflows.

## Gotchas

- Point it at the list when the field is a list attribute.
- Use new and previous values to detect true transitions.
- Add an early Filter if only some values matter.

## Example

Deal stage changed to Won -> Filter previous value was not Won -> Slack alert -> Celebration.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
