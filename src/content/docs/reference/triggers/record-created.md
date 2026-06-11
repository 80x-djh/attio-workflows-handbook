---
title: Record created
description: Fires whenever a new record is created in an object — by a person, an import, the API, or email sync. The intake trigger.
sidebar:
  order: 2
page-type: trigger-reference
---

**Record created** fires every time a new record appears in the selected object — regardless of how: manual entry, CSV import, API call, form integration, or Attio's own email-sync auto-creation.

| | |
| --- | --- |
| **Type** | Trigger (automatic) |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Object | Yes | The object to monitor |

## Outputs

- The record's data
- Which actor performed the trigger
- When the trigger happened

## Gotchas

- **"Every time" includes imports.** A 5,000-row CSV import fires this trigger 5,000 times. If your workflow writes data or calls AI, that's a very expensive import — add a [Filter](/reference/conditions/filter/) immediately after the trigger, and think hard before pointing AI blocks at this trigger on a busy object.
- **Email sync creates records too.** On workspaces with auto-creation from email enabled, People (and Companies) records appear constantly with thin data. Filter on the fields you actually need before acting.
- The record's attributes may be **mostly empty at creation time** — data often lands one beat later via enrichment or a second API call. If you need a specific attribute to be present, trigger on [Attribute value changed](/reference/triggers/attribute-value-changed/) for that attribute instead; it fires even when the value is set at creation.

## Example

Webhook-free lead intake: Record created on People → Filter (email **not empty** and Updated by is not Workflow) → [Create or update record](/reference/records/create-or-update-record/) for the company by domain → [Add record to list](/reference/lists/add-record-to-list/) "Inbound" → [Round robin](/reference/workspace/round-robin/) owner → Slack ping. ([Routing recipe](/recipes/round-robin-routing/).)

## Related

[Attribute value changed](/reference/triggers/attribute-value-changed/) · [Record added to list](/reference/triggers/record-added-to-list/) · [Trigger guide](/concepts/triggers/)
