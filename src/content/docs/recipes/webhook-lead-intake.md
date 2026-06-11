---
title: Webhook lead intake
description: Receive product or form events via webhook, parse JSON, create or update records, and route the lead.
page-type: recipe
---

## Outcome

An external event creates or updates a person/company in Attio, adds them to the right list, and alerts the team.

## Build

1. Trigger: [Webhook received](/reference/triggers/webhook-received/).
2. [Parse JSON](/reference/utilities/parse-json/) with a schema for email, name, company domain, source, and event.
3. [Create or update record](/reference/records/create-or-update-record/) for Person using email as the matching attribute.
4. Optional [Create or update record](/reference/records/create-or-update-record/) for Company using domain.
5. [Add record to list](/reference/lists/add-record-to-list/) for the inbound or product-signal list.
6. [Round robin](/reference/workspace/round-robin/) or owner rules.
7. [Update list entry](/reference/lists/update-list-entry/) with source, score, and owner.

## Credit model

Webhook and Parse JSON are free. Each create/update/add/update step costs 1 credit. Round robin is free.

Typical path: Person upsert (1) + Company upsert (1) + Add to list (1) + Update list entry (1) = 4 credits.

## Safety guard

Validate payloads. Parse JSON fails when a field type does not match the schema. Mark optional fields optional, and use filters to stop malformed payloads before writes.

## Payload minimum

```json
{
  "email": "jane@example.com",
  "name": "Jane Doe",
  "company_domain": "example.com",
  "source": "pricing_page",
  "event": "demo_requested"
}
```
