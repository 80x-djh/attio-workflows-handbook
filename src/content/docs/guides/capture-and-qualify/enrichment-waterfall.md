---
title: Cheapest-first enrichment waterfall
description: Enrich a new company through ordered providers, stop on the first hit, and write only into dedicated source fields so you never pay twice.
page-type: recipe
---

Enrich a new company through ordered providers, stop on the first hit, and write only into dedicated source fields so you never pay twice. This rebuilds Clay's stop-on-first-hit waterfall economics natively in Attio: a [Record created](/reference/triggers/record-created/) trigger fires on the Companies object, a free [Filter](/reference/conditions/filter/) skips records that already have good data, a [Send HTTP request](/reference/utilities/send-http-request/) calls your cheapest provider first, [Parse JSON](/reference/utilities/parse-json/) pulls out the fields you need, an [If](/reference/conditions/if/) condition stops the run when the cheap provider hits, and an [Update record](/reference/records/update-record/) writes the result into dedicated `Enriched ...` source attributes. Only when the first provider misses does the run fall through to a second, pricier provider — so you pay for the expensive lookup only on the records the cheap one couldn't fill.

| Field | Value |
| --- | --- |
| Difficulty | Advanced |
| Time to build | ~30 minutes |
| Trigger | [Record created](/reference/triggers/record-created/) on Companies (or a [Record command](/reference/triggers/record-command/)) |
| Blocks used | [Filter](/reference/conditions/filter/), [Send HTTP request](/reference/utilities/send-http-request/), [Parse JSON](/reference/utilities/parse-json/), [If](/reference/conditions/if/), [Update record](/reference/records/update-record/) |
| Credit cost per run | 1 to 3 credits, depending on how far down the waterfall you fall |
| Plan required | Pro recommended (see [Credits and pricing](/reference/credits-and-pricing/)) |

## Prerequisites

- A workspace plan that includes the new Workflows engine; Pro is recommended for the [Send HTTP request](/reference/utilities/send-http-request/) volume a waterfall generates. Allowances live on [Credits and pricing](/reference/credits-and-pricing/).
- Two enrichment providers with REST APIs, ordered cheapest first — for example a domain-cheap provider as provider A and a richer one as provider B. You need an API key for each, stored as a workspace secret.
- The Companies object with a populated `domain` attribute to use as the lookup key.
- Dedicated source attributes that no human edits directly: `Enriched industry`, `Enriched employee count`, and `Enriched source` (a text or select attribute recording which provider filled the row).
- An optional `Industry verified` checkbox (or any human-owned attribute) so the Filter can skip records a teammate has already confirmed.

## How it works

The workflow runs cheapest provider to priciest, stops the moment it has the data, and writes results only into fields humans never touch. The Filter is free, so gating costs nothing; you pay one credit per HTTP call you actually make and one credit for the single write at the end. A record that the cheap provider fills costs 2 credits and never touches provider B.

1. [Record created](/reference/triggers/record-created/) on Companies fires for each new company.
2. [Filter](/reference/conditions/filter/) continues only when `Enriched industry` is empty **and** `Industry verified` is unchecked.
3. [Send HTTP request](/reference/utilities/send-http-request/) calls provider A with the company `domain`.
4. [Parse JSON](/reference/utilities/parse-json/) extracts `industry` and `employee_count` from provider A's response.
5. [If](/reference/conditions/if/) checks whether provider A returned an industry; if yes, the run jumps straight to the write.
6. [Send HTTP request](/reference/utilities/send-http-request/) calls provider B with the same `domain` (only on the miss branch).
7. [Parse JSON](/reference/utilities/parse-json/) extracts the same fields from provider B's response.
8. [Update record](/reference/records/update-record/) writes the winning values into `Enriched industry`, `Enriched employee count`, and `Enriched source`.

## Build steps

### Step 1 — Add the trigger

Create a new workflow and add the [Record created](/reference/triggers/record-created/) trigger. Set its object to Companies so the workflow fires once per new company. If you'd rather enrich on demand from a record's actions menu, swap in a [Record command](/reference/triggers/record-command/) instead — the rest of the build is identical.

| Field | Value |
| --- | --- |
| Trigger | Record created |
| Object | Companies |
| Run as | A workspace member with edit access to Companies |

### Step 2 — Gate on the free Filter

Add a [Filter](/reference/conditions/filter/) block immediately after the trigger. Configure it to continue only for records worth enriching: the target field is empty **and** no human has verified it. The Filter is free, so this gate costs nothing and protects every paid step below it.

| Field | Value |
| --- | --- |
| Condition 1 | `Enriched industry` is empty |
| Condition 2 | `Industry verified` is unchecked |
| Logic | Match all conditions |
| When no match | Stop the run |

### Step 3 — Call provider A (cheapest)

Add a [Send HTTP request](/reference/utilities/send-http-request/) block. Point it at your cheapest provider and pass the company `domain` from the trigger. Keep within the 5-second HTTP timeout — pick a provider endpoint that responds fast, and respect that provider's rate limits so a burst of new companies doesn't trip a 429.

| Field | Value |
| --- | --- |
| Method | `GET` |
| URL | `https://provider-a.example.com/v1/enrich?domain={{trigger.record.domain}}` |
| Header `Authorization` | `Bearer {{secrets.PROVIDER_A_KEY}}` |
| Timeout | 5 s (engine maximum) |

### Step 4 — Parse provider A's response

Add a [Parse JSON](/reference/utilities/parse-json/) block and feed it the response body from Step 3. Define a schema for the two fields you care about so later blocks can reference them by name.

| Field | Value |
| --- | --- |
| Input | `{{step_3.response.body}}` |
| Schema field `industry` | string, optional |
| Schema field `employee_count` | number, optional |

### Step 5 — Stop on the first hit

Add an [If](/reference/conditions/if/) condition. When provider A returned an industry, route to the write step and skip provider B entirely. When it's empty, fall through to the next provider. The condition itself is free, and stopping early is what makes this a waterfall rather than two full lookups every time.

| Field | Value |
| --- | --- |
| Condition | `{{step_4.industry}}` is not empty |
| If true | Go to Step 8 (Update record) |
| If false | Continue to Step 6 |

### Step 6 — Call provider B (richer, on the miss branch)

On the false branch only, add a second [Send HTTP request](/reference/utilities/send-http-request/) to your richer, pricier provider, again passing `domain`. Because this sits behind the If, you only pay provider B — and only spend the credit — on records provider A couldn't fill.

| Field | Value |
| --- | --- |
| Method | `GET` |
| URL | `https://provider-b.example.com/lookup?domain={{trigger.record.domain}}` |
| Header `X-API-Key` | `{{secrets.PROVIDER_B_KEY}}` |
| Timeout | 5 s (engine maximum) |

### Step 7 — Parse provider B's response

Add a [Parse JSON](/reference/utilities/parse-json/) block for provider B's body, mapping its shape to the same two fields. Provider B may name them differently, so map `sector` to `industry` and `headcount` to `employee_count` in the schema.

| Field | Value |
| --- | --- |
| Input | `{{step_6.response.body}}` |
| Schema field `industry` | string, optional (from `sector`) |
| Schema field `employee_count` | number, optional (from `headcount`) |

### Step 8 — Write only to source fields

Add an [Update record](/reference/records/update-record/) block targeting the triggering company. Write the winning values into your dedicated `Enriched ...` attributes only — never into the human-owned `Industry` or `Employees` attributes. Set `Enriched source` to record which provider won so you can audit coverage later.

| Field | Value |
| --- | --- |
| Record | `{{trigger.record}}` |
| `Enriched industry` | `{{step_4.industry}}` or `{{step_7.industry}}` (the branch that ran) |
| `Enriched employee count` | `{{step_4.employee_count}}` or `{{step_7.employee_count}}` |
| `Enriched source` | `Provider A` or `Provider B` |

## Variable mapping

| Variable | Source block | Field | Example value |
| --- | --- | --- | --- |
| `{{trigger.record.domain}}` | Record created | `domain` | `acme.com` |
| `{{step_3.response.body}}` | Send HTTP request (provider A) | Response body | `{"industry":"Software","employee_count":240}` |
| `{{step_4.industry}}` | Parse JSON (provider A) | `industry` | `Software` |
| `{{step_4.employee_count}}` | Parse JSON (provider A) | `employee_count` | `240` |
| `{{step_6.response.body}}` | Send HTTP request (provider B) | Response body | `{"sector":"SaaS","headcount":255}` |
| `{{step_7.industry}}` | Parse JSON (provider B) | `industry` (from `sector`) | `SaaS` |
| `{{step_8.record}}` | Update record | Updated company | Acme Inc. |

## Credit cost worked example

The [Filter](/reference/conditions/filter/), Parse JSON, and [If](/reference/conditions/if/) blocks are free logic and lookups — they never consume credits. You pay 1 credit per [Send HTTP request](/reference/utilities/send-http-request/) you actually fire and 1 credit for the single [Update record](/reference/records/update-record/) write. The whole point of the waterfall is that most runs never reach provider B.

| Path | HTTP calls | Update | Credits per run |
| --- | --- | --- | --- |
| Cheap provider hits | 1 (provider A) | 1 | 2 |
| Cheap provider misses, B hits | 2 (A + B) | 1 | 3 |
| Filter stops the run | 0 | 0 | 0 (free) |

Assume 800 new companies a month, a 70% hit rate on provider A, and a 10% Filter skip rate. That's 80 skipped runs (0 credits), 504 runs that stop on provider A (504 × 2 = 1,008 credits), and 216 runs that fall through to provider B (216 × 3 = 648 credits) — roughly **1,656 Attio credits a month**, plus whatever each provider bills you per call. Compare that against your plan's monthly allowance on [Credits and pricing](/reference/credits-and-pricing/). If you later add an AI block such as [Classify record](/reference/ai/classify-record/) to tag enrichment quality, its cost is variable and token-based: gate it behind the same Filter, run a test batch of about 10 records, and read the per-run AI cost in the run viewer rather than assuming a fixed number.

## Test plan

1. In the workflow editor, open the test panel and pick a real Companies record that has a `domain` but an empty `Enriched industry` — for example `acme.com`. Fire a test run.
2. Confirm the [Filter](/reference/conditions/filter/) shows **continue** in run history; it should pass because both conditions are true.
3. Confirm the provider A [Send HTTP request](/reference/utilities/send-http-request/) returns a `200` and a body, and that [Parse JSON](/reference/utilities/parse-json/) populates `{{step_4.industry}}`.
4. Confirm the [If](/reference/conditions/if/) routed straight to [Update record](/reference/records/update-record/) and that provider B never ran. Open the company and verify `Enriched industry`, `Enriched employee count`, and `Enriched source` are set, while the human `Industry` field is untouched.
5. Now test the miss branch: pick a company whose domain provider A doesn't cover (a stealth or very new company). Confirm the run falls through to provider B and the write still lands.
6. **Deliberately failing input:** run the workflow on a company whose `Industry verified` checkbox is already ticked. Expected result — the Filter stops the run at the gate, no HTTP call fires, no credits are spent, and run history shows the run ending at the Filter. This proves you never overwrite verified data.
7. Read each block's output in the run viewer under run history to confirm credits were charged only for the steps that actually executed.

## Failure modes

| Symptom | Cause | Fix |
| --- | --- | --- |
| HTTP request times out | Provider endpoint slower than the 5-second engine limit | Switch to a faster endpoint, or move that provider lower in the waterfall so it runs less often. |
| `429 Too Many Requests` on a burst of new companies | You're exceeding the provider's rate limit | Add a [Delay](/reference/delays/delay/) before the call, or batch enrichment with a [Record command](/reference/triggers/record-command/) instead of firing per create. |
| Parse JSON fails on some responses | Provider returns a different shape on misses or errors | Mark schema fields optional and add an [If](/reference/conditions/if/) that checks for a non-`200` status before parsing. |
| Provider B runs on every record | The If condition references the wrong field or is inverted | Point the condition at the provider A `industry` output and confirm the true branch jumps to the write. |
| Human-entered industry gets clobbered | The Update record block writes to `Industry` instead of `Enriched industry` | Re-point every mapping to the dedicated `Enriched ...` source attributes; never write to human-owned fields. |
| Records re-enriched on every edit | You used [Attribute value changed](/reference/triggers/attribute-value-changed/) without a tight filter | Keep the trigger on Record created, or filter strictly so the run continues only when the source field is still empty. |

## Variations

### Three-tier waterfall

Add a third provider for the records the first two both miss. Duplicate the [If](/reference/conditions/if/), [Send HTTP request](/reference/utilities/send-http-request/), and [Parse JSON](/reference/utilities/parse-json/) trio on the second miss branch, ordered cheapest to priciest. The economics hold: each tier runs only on what the tier above couldn't fill, so a record that the first provider covers still costs 2 credits.

### Trigger on command instead of on create

Swap the [Record created](/reference/triggers/record-created/) trigger for a [Record command](/reference/triggers/record-command/) so a rep enriches a single company on demand from its actions menu. This avoids spending credits on bulk imports you don't care about and lets you re-run the waterfall after a company changes domains. Everything from the Filter down stays the same.

## See also

- [Webhook lead intake](/guides/capture-and-qualify/webhook-lead-intake/)
- [Variables](/explanation/variables/)
- [Send HTTP request](/reference/utilities/send-http-request/)
- [Parse JSON](/reference/utilities/parse-json/)
- [Credits and pricing](/reference/credits-and-pricing/)
