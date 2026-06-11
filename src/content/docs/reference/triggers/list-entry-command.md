---
title: List entry command
description: Adds a Run workflow button to a list's entries so operators can trigger the workflow manually on selected entries — the manual trigger for pipeline operations.
sidebar:
  order: 4
page-type: trigger-reference
---

**List entry command** is [Record command](/reference/triggers/record-command/)'s sibling for lists: a button that runs the workflow on one or more selected **list entries**, with the entry's list attributes available in the run.

| | |
| --- | --- |
| **Type** | Trigger (manual) |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| List | Yes | The button is available in this list |

## Outputs

- The list entry's data (list attributes + parent record)
- Which actor performed the trigger
- When the trigger happened

## Ways to run it

- **Record page** — Run workflow icon on the list entry in the left sidebar
- **The list view** — select entry checkboxes → **Run workflow** → pick the workflow
- **Chrome extension** — Run workflow icon in the bottom toolbar

## Gotchas

- The trigger outputs a **list entry**, not a record. Entry-typed blocks ([Update list entry](/reference/lists/update-list-entry/)) take it directly; record-typed blocks need the entry's **parent record** from the variable picker. The type rules live in [records vs list entries](/concepts/records-vs-list-entries/).
- Choose this over Record command when the workflow needs **list attributes** (stage, priority, next step) — Record command runs can't see them without a [Find list entries](/reference/lists/find-list-entries/) detour.
- Batch-select runs one workflow run per entry — same [credit multiplication](/start/credits-and-pricing/) as Record command.

## Example

Pipeline-review prep: List entry command on "Sales pipeline" → [Summarize record](/reference/ai/summarize-record/) on the parent deal → [Update list entry](/reference/lists/update-list-entry/) writes the summary into a "Review notes" list attribute. Run it on the entries due for Monday's pipeline review, and the notes column fills itself.

## Related

[Record command](/reference/triggers/record-command/) · [Record added to list](/reference/triggers/record-added-to-list/) · [Records vs list entries](/concepts/records-vs-list-entries/)
