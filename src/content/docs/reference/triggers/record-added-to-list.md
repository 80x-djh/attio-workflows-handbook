---
title: Record added to list
description: Fires when a record is added to a specific list — the trigger for pipeline-entry automation like intake checklists, owner assignment, and stage-zero hygiene.
sidebar:
  order: 5
page-type: trigger-reference
---

**Record added to list** fires whenever a record joins the selected list — added by a person, a workflow, or the API. It's the "something just entered this process" trigger.

| | |
| --- | --- |
| **Type** | Trigger (automatic) |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| List | Yes | The list to monitor |

## Outputs

- The list entry's data (list attributes + parent record)
- Which actor performed the trigger
- When the trigger happened

## Gotchas

- Fires for **workflow-added records too** — if another automation adds records to this list, the two workflows chain. Sometimes that's the design; when it isn't, filter on the actor (Updated by → Type → is not → Workflow). See [infinite loops](/explanation/infinite-loops-and-safety/).
- A record can only be in a list **once**, so this fires once per record per membership — but remove-and-re-add fires it again. Re-adding is a legitimate "recycle this lead" signal if you design for it; chaos if you don't.
- List attributes on the new entry are usually **empty at add time** (stage might default, the rest won't). If your logic depends on a list attribute getting its first value, trigger on [Attribute value changed](/reference/triggers/attribute-value-changed/) pointed at the list instead — it fires when the value is set during the add.

## Example

Deal intake: Record added to list "Investment pipeline" → [Update list entry](/reference/lists/update-list-entry/) sets stage "New" + source defaults → [Create task](/reference/tasks/create-task/) "Initial screen" for the analyst, due +2 days → Slack post to #dealflow with the parent company's name and domain.

## Related

[List entry updated](/reference/triggers/list-entry-updated/) · [Add record to list](/reference/lists/add-record-to-list/) (the step that often feeds this trigger) · [Trigger guide](/explanation/triggers/)
