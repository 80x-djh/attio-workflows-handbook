---
title: Record command
description: Adds a Run workflow button to records so humans can trigger the workflow manually on one or many records — the trigger for human-in-the-loop automation.
sidebar:
  order: 1
page-type: trigger-reference
---

**Record command** adds a button to an object's records so a person can run the workflow on demand — on one record or a batch. It's the trigger for human-in-the-loop automation: enrichment on request, "prep this account", "push to outreach".

| | |
| --- | --- |
| **Type** | Trigger (manual) |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Object | Yes | The button appears for all records of this object |

## Outputs

- The record's data
- Which actor performed the trigger
- When the trigger happened

## Ways to run it

- **Record page** — Run workflow icon, top-left
- **Any records view or list** — select checkboxes → **Run workflow** → pick the workflow (batch enrollment)
- **Workflow editor** — **Trigger workflow** → pick a record (your testing loop)
- **Chrome extension** — Run workflow icon in the bottom toolbar

## Gotchas

- Batch-running from a view enrolls each selected record as a **separate run** — 50 records × a 2-credit path = 100 credits. Eyeball the [credit math](/reference/credits-and-pricing/) before selecting-all.
- The button is visible to members who can see the workflow — name the workflow for operators, not builders ("Enrich + route this lead", not "WF-7 v2 final").
- Because runs only happen on click, this trigger is the **low-risk way to ship a new automation**: run it manually for a week before swapping in an automatic trigger like [Attribute value changed](/reference/triggers/attribute-value-changed/).

## Example

"Research on demand": Record command on Companies → [Web agent](/reference/agents/web-agent/) asks three qualification questions → [Update record](/reference/records/update-record/) saves answers → Slack DM to the runner. AE clicks the button only on accounts they're about to call — AI spend stays tied to human intent ([full recipe](/guides/signals-and-ai/inbound-lead-research/)).

## Related

[List entry command](/reference/triggers/list-entry-command/) (same idea for lists) · [Manual run](/reference/triggers/manual-run/) (no record context) · [Trigger guide](/explanation/triggers/)
