---
title: Record updated
description: Fires when a record's object attributes change after creation — optionally scoped to one attribute. Does not fire for creation-time values or list attributes.
sidebar:
  order: 3
page-type: trigger-reference
---

**Record updated** fires when a record in the selected object is updated. Optionally scope it to a single attribute — which you almost always should.

| | |
| --- | --- |
| **Type** | Trigger (automatic) |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Object | Yes | The object to monitor |
| Attribute | No | If set, fires only when *this* attribute updates. **If unset, fires on every change to any attribute on any record of the object.** |

## Outputs

- The record's data
- Which actor performed the trigger
- When the trigger happened
- **New and previous values** — only when an attribute is selected

## When it does NOT fire

The two documented blind spots:

1. **Values set during record creation.** A deal *created* as "Won" never "updated" — use [Attribute value changed](/reference/triggers/attribute-value-changed/) to catch both.
2. **List attribute changes.** Stage moved on a pipeline list? That's a list-entry change — use [List entry updated](/reference/triggers/list-entry-updated/). See [records vs list entries](/concepts/records-vs-list-entries/).

## Gotchas

- **Unscoped = run-volume firehose.** Every enrichment pass, every sync, every bulk edit fires it for every touched record. Unscoped Record updated workflows are the leading source of mystery credit burn and [trigger loops](/advanced/infinite-loops-and-safety/).
- **Self-triggering:** if the workflow (or any workflow) updates the same object, it re-fires this trigger. Guard with **Updated by → Type → is not → Workflow** in a Filter, or scope the trigger to an attribute your workflows never write.
- New/previous values exist only with a scoped attribute — your "true transition" filters (`New value is X and Previous value is not X`) depend on it.

## Example

Ownership-change hygiene: Record updated on Companies scoped to **Owner** → Filter: Updated by is not Workflow → [Create task](/reference/tasks/create-task/) "Intro handover call" assigned to the new owner, due +3 days via [Adjust time](/reference/calculations/adjust-time/).

## Related

[Attribute value changed](/reference/triggers/attribute-value-changed/) · [List entry updated](/reference/triggers/list-entry-updated/) · [Trigger guide](/concepts/triggers/)
