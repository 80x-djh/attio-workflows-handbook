---
title: Webhook lead intake with safe upsert
description: Build a webhook front door that parses inbound JSON, dedupes on email or domain, and upserts a lead without ever creating a duplicate.
page-type: recipe
---

Build a webhook front door that parses inbound JSON, dedupes on email or domain, and upserts a lead without ever creating a duplicate. This is the universal intake every RevOps team eventually wants: form fills, product sign-ups, and partner feeds all POST to one endpoint, and the [Webhook received](/reference/triggers/webhook-received/) trigger fans them into a clean, idempotent path. You [Parse JSON](/reference/utilities/parse-json/) field by field, [Filter](/reference/conditions/filter/) out anything missing a usable identity, run [Find records](/reference/records/find-records/) on a dedup key, write with [Create or update record](/reference/records/create-or-update-record/), tag the source with [Add record to list](/reference/lists/add-record-to-list/), and confirm in [Slack](/reference/integrations/).

| Field | Value |
| --- | --- |
| Difficulty | Advanced |
| Time to build | ~20 minutes |
| Trigger | [Webhook received](/reference/triggers/webhook-received/) |
| Blocks used | [Parse JSON](/reference/utilities/parse-json/), [Filter](/reference/conditions/filter/), [Find records](/reference/records/find-records/), [Create or update record](/reference/records/create-or-update-record/), [Add record to list](/reference/lists/add-record-to-list/), [Slack](/reference/integrations/) |
| Credit cost per run | 3 credits — see [Credits and pricing](/reference/credits-and-pricing/) and the worked example below |
| Plan required | Plus and above |

## Prerequisites

- An Attio plan on the **Plus** tier or higher, which is where the new Workflows engine and the [Webhook received](/reference/triggers/webhook-received/) trigger are available.
- A connected Slack integration with a channel the team watches, such as `#new-leads`.
- A **Person** object with an `email_addresses` attribute, and a **Company** object with a `domains` attribute. These are your dedup keys.
- A list to tag intake against — this recipe uses one called **Inbound leads** with a single-select `source` attribute.
- Permission to read and write records in the workspace. No API key or external scope is needed on the Attio side; the source system only needs the webhook URL.

## How it works

The webhook accepts a single JSON payload, you validate it before any write, and the upsert matches on a stable key so a repeat submission updates the existing record instead of cloning it. Free logic blocks do all the qualifying, so credits are spent only on the writes at the end. See [Credits and pricing](/reference/credits-and-pricing/) for the canonical per-block costs.

1. [Webhook received](/reference/triggers/webhook-received/) — accept the inbound POST.
2. [Parse JSON](/reference/utilities/parse-json/) — extract `email`, `name`, `company_domain`, and `source` field by field.
3. [Filter](/reference/conditions/filter/) — require an email or a domain; stop the run otherwise.
4. [Find records](/reference/records/find-records/) — look up an existing Person by the dedup key.
5. [Create or update record](/reference/records/create-or-update-record/) — the safe upsert on `email_addresses`.
6. [Add record to list](/reference/lists/add-record-to-list/) — tag the lead with its source.
7. [Slack](/reference/integrations/) — confirm the intake to the team.

## Build steps

### Step 1 — Add the trigger

Create a new workflow and add the **Webhook received** trigger. Copy the generated endpoint URL into your source system. Set the source to send `Content-Type: application/json` — the trigger only parses the body when the content type is JSON.

| Field | Value |
| --- | --- |
| Trigger | Webhook received |
| Content-Type | `application/json` |
| Method | `POST` |
| Endpoint | (copy the generated URL into your form or product event) |

### Step 2 — Parse the payload field by field

Add the **Parse JSON** block and point it at the webhook body. Define each field you depend on and mark only the ones you truly require as required, so a thin payload fails loudly here rather than writing garbage downstream.

| Field | Value |
| --- | --- |
| Source | Webhook received → Body |
| `email` | `String`, required |
| `name` | `String`, optional |
| `company_domain` | `String`, optional |
| `source` | `String`, optional |

### Step 3 — Filter out unusable payloads

Add the **Filter** block. Require a usable identity — at minimum an email or a domain — so spam and empty pings stop here before any credit is spent. A condition that stops a run is free.

| Field | Value |
| --- | --- |
| Condition | `email` is not empty |
| And/Or | OR `company_domain` is not empty |
| On no match | Stop run |

### Step 4 — Find the existing record

Add the **Find records** block to look up a Person on the dedup key. This is what makes the upsert safe: you match on the same stable attribute every time.

| Field | Value |
| --- | --- |
| Object | Person |
| Match attribute | `email_addresses` |
| Match value | Parse JSON → `email` (e.g. `jane@acme.com`) |
| Limit | 1 |

### Step 5 — Upsert the lead

Add the **Create or update record** block. Set the matching attribute to the same key you searched on so a repeat submission updates the existing Person instead of cloning it.

| Field | Value |
| --- | --- |
| Object | Person |
| Match attribute | `email_addresses` |
| `email_addresses` | Parse JSON → `email` (e.g. `jane@acme.com`) |
| `name` | Parse JSON → `name` (e.g. Priya Sharma) |
| `company` | Parse JSON → `company_domain` (e.g. `acme.com`) |

### Step 6 — Tag the source list

Add the **Add record to list** block so each lead carries where it came from. Map the parsed source into the list's `source` attribute.

| Field | Value |
| --- | --- |
| List | Inbound leads |
| Record | Create or update record → Person |
| `source` | Parse JSON → `source` (e.g. `pricing_page`) |

### Step 7 — Confirm in Slack

Add the **Slack** block to post a one-line confirmation to the channel the team watches.

| Field | Value |
| --- | --- |
| Channel | `#new-leads` |
| Message | `New lead: {{name}} ({{email}}) via {{source}}` |

## Variable mapping

| Variable | Source block | Field | Example value |
| --- | --- | --- | --- |
| `email` | Parse JSON | `email` | `jane@acme.com` |
| `name` | Parse JSON | `name` | Priya Sharma |
| `company_domain` | Parse JSON | `company_domain` | `acme.com` |
| `source` | Parse JSON | `source` | `pricing_page` |
| `matched_person` | Find records | First result | Person record or empty |
| `person` | Create or update record | Record | Person `jane@acme.com` |

## Credit cost worked example

The trigger, **Parse JSON**, **Filter**, and **Find records** are all free logic and lookup blocks. The two writes cost 1 credit each: **Create or update record** = 1, and **Add record to list** = 1. The **Slack** confirmation is an integration block at 1 credit. So a fully successful run that reaches Slack is 3 credits; a run that upserts and tags but skips Slack is 2.

At a realistic 800 valid intakes per month, that's roughly 800 × 3 = 2,400 credits, plus 0 for any payloads the Filter rejects. Compare that against your plan's monthly allowance on [Credits and pricing](/reference/credits-and-pricing/) before you turn the workflow on. There are no AI blocks in this recipe, so there's no token-based cost to estimate.

## Test plan

1. POST a clean payload to the endpoint with `Content-Type: application/json`:

   ```json
   {
     "email": "jane@acme.com",
     "name": "Priya Sharma",
     "company_domain": "acme.com",
     "source": "pricing_page"
   }
   ```

2. Open the run in run history. **Parse JSON** should output the four fields, **Filter** should pass, **Find records** should return empty (first time), and **Create or update record** should report a created Person.
3. POST the exact same payload again. This is the duplicate test: **Find records** should now return the existing Person, and **Create or update record** should report an update — not a second record. Confirm in the Person list that there's still only one `jane@acme.com`.
4. Check `#new-leads` for two confirmation messages, one per run.
5. POST a deliberately failing payload with no identity:

   ```json
   { "name": "Anon", "source": "pricing_page" }
   ```

   **Filter** should stop the run, and run history should show zero writes and zero credits spent.

## Failure modes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Webhook fires but Parse JSON outputs nothing | Payload sent as form-encoded, not JSON | Set the source to send `Content-Type: application/json` |
| Source system reports a timeout or retries the POST | The outbound caller expects a response within ~5 seconds and retries on no/late ack | Keep the path lean; Attio acks fast, but a slow source treats a missed ack as a retry — make the upsert idempotent so retries are safe |
| Duplicate records appear on resubmission | Match attribute on the upsert differs from the Find key, or no match attribute set | Set Create or update record's match attribute to the same `email_addresses` key you searched on |
| Run stops at Filter on valid leads | Required field marked too strictly in Parse JSON | Require only `email` or `company_domain`; mark the rest optional |
| Lead created but no source on the list entry | `source` value not mapped, or the source string isn't a valid single-select option | Map Parse JSON → `source` into the list attribute and add the option if it's new |

## Variations

### Per-source list tagging

Route each source to its own list instead of one shared **Inbound leads** list. Add a [Switch](/reference/conditions/switch/) on the `source` field after the upsert, with one branch per source (`pricing_page`, `partner_feed`, `webinar`), and give each branch its own **Add record to list** block. The Switch is free, so this adds no credit cost beyond the writes you'd already make.

### Reject spam early

Tighten the [Filter](/reference/conditions/filter/) to drop obvious junk before any write. Add conditions that stop the run when `email` ends in a disposable domain or when `company_domain` is on a blocklist. Because the Filter is free and stops the run, rejected spam costs zero credits and never reaches the upsert.

## See also

- [Signal scoring](/guides/capture-and-qualify/signal-scoring/)
- [Records vs list entries](/explanation/records-vs-list-entries/)
- [Create or update record](/reference/records/create-or-update-record/)
- [Find records](/reference/records/find-records/)
- [Webhooks in Attio](https://attio.com/help/apps/other-apps/webhooks)
