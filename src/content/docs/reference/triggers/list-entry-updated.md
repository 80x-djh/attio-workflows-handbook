---
title: List entry updated
description: Fires when a list attribute changes on an entry in a specific list — the pipeline-stage trigger. Does not fire for object attributes or values set when the entry is created.
sidebar:
  order: 6
page-type: trigger-reference
---

**List entry updated** fires when a **list attribute** changes on an entry of the selected list. Because pipeline stages are usually list attributes, this is effectively the pipeline-movement trigger.

| | |
| --- | --- |
| **Type** | Trigger (automatic) |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| List | Yes | The list to monitor |
| Attribute | No | If set, fires only when this list attribute updates. **If unset, fires on any list-attribute change on any entry.** |

## Outputs

- The list entry's data
- Which actor performed the trigger
- When the trigger happened
- **New and previous values** — only when an attribute is selected

## When it does NOT fire

1. **Values set while adding the record to the list** — entry created with stage already set? Not an update. Use [Attribute value changed](/reference/triggers/attribute-value-changed/) pointed at the list.
2. **Object attribute changes** — ARR changing on the company is invisible here; that's [Record updated](/reference/triggers/record-updated/) territory. See [records vs list entries](/explanation/records-vs-list-entries/).

## Gotchas

- Scope to the attribute you care about — unscoped, every priority tweak and note edit on the list fires it.
- Stage-change logic should usually filter for **true transitions**: `New value is X` **and** `Previous value is not X` — without the second condition, a re-save of the same stage re-fires your downstream actions (duplicate Slack alerts are how you find this out).
- For different actions per stage, one workflow with a [Switch](/reference/conditions/switch/) on New value beats five single-stage workflows — one place to maintain, one run history to debug.

## Example

The stage router: List entry updated on "Sales pipeline" scoped to **Stage** → Switch on New value: *Demo booked* → create prep task; *Proposal* → notify #deals with [Aggregate values](/reference/calculations/aggregate-values/) total; *Won* → [Celebration](/reference/workspace/celebration/) + enroll champion in onboarding sequence; *Lost* → exit sequences + set nurture flag. ([Slack alert recipe](/guides/route-and-sequence/slack-deal-alerts/).)

## Related

[Attribute value changed](/reference/triggers/attribute-value-changed/) · [Record updated](/reference/triggers/record-updated/) · [Update list entry](/reference/lists/update-list-entry/)
