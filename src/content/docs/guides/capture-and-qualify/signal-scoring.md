---
title: Score leads into explainable bands
description: Combine fit, intent, and engagement signals into one transparent score, write it back to Attio, and route each band to the right action.
page-type: recipe
---

When a product or analytics event lands, you want a single lead score your reps actually trust, plus the right next action for each band. This recipe takes a [Webhook received](/reference/triggers/webhook-received/) trigger (or [Attribute value changed](/reference/triggers/attribute-value-changed/) if the signals already live in Attio), unpacks the payload with [Parse JSON](/reference/utilities/parse-json/), combines fit, intent, and engagement with a visible [Formula](/reference/calculations/formula/), branches on the band with [Switch](/reference/conditions/switch/), writes the score back with [Update record](/reference/records/update-record/), and then routes A-band leads through [Round robin](/reference/workspace/round-robin/) and [Enroll in sequence](/reference/sequences/enroll-in-sequence/). Because the score is an arithmetic Formula and not an opaque model output, a rep can read the run and see exactly why a lead is an A.

| Field | Value |
| --- | --- |
| Difficulty | Intermediate |
| Time to build | ~15 minutes |
| Trigger | [Webhook received](/reference/triggers/webhook-received/) (or [Attribute value changed](/reference/triggers/attribute-value-changed/)) |
| Blocks used | [Parse JSON](/reference/utilities/parse-json/), [Formula](/reference/calculations/formula/), [Switch](/reference/conditions/switch/), [Update record](/reference/records/update-record/), [Round robin](/reference/workspace/round-robin/), [Enroll in sequence](/reference/sequences/enroll-in-sequence/) |
| Credit cost per run | 1 credit (C-band) to 3 credits (A-band) — see worked example |
| Plan required | Plus or higher |

## Prerequisites

- Attio **Plus** plan or higher (the new Workflows engine).
- A `Person` (or `Company`) object with these attributes already created: `lead_score` (number), `lead_band` (single-select with options `A`, `B`, `C`), and a matching key such as `email` or `domain`.
- A source for the event payload. For the webhook path, a product-analytics or reverse-ETL tool that can POST JSON to Attio's generated webhook URL. For the attribute path, the signal fields must already be writing to the record.
- An active sequence to enroll A-band leads into, and a sales team configured for round-robin assignment.
- Workspace member access with permission to publish workflows. No external API keys are needed beyond the webhook source.

## How it works

The trigger fires on a single event, Parse JSON turns the raw payload into typed variables, and the Formula reduces fit, intent, and engagement into one number on a 0–100 scale. Switch reads the resulting band and sends the run down exactly one branch. Every run writes the score and band back to the record so the value is durable and filterable; A-band runs additionally pick an owner and start outreach, while C-band runs stop after the write.

1. [Webhook received](/reference/triggers/webhook-received/) — or [Attribute value changed](/reference/triggers/attribute-value-changed/) on a signal field.
2. [Parse JSON](/reference/utilities/parse-json/) — extract `fit`, `intent`, and `engagement` inputs.
3. [Formula](/reference/calculations/formula/) — compute the combined `lead_score`.
4. [Switch](/reference/conditions/switch/) — branch on the score band.
5. [Update record](/reference/records/update-record/) — write `lead_score` and `lead_band` on every branch.
6. A-band only: [Round robin](/reference/workspace/round-robin/) → [Enroll in sequence](/reference/sequences/enroll-in-sequence/).

## Build steps

### Step 1 — Add the trigger

Create a new workflow and add the **Webhook received** trigger. Copy the generated webhook URL into your analytics tool. If your signals already live in Attio, swap in **Attribute value changed** scoped to the `Person` object and the signal attribute instead.

| Field | Value |
| --- | --- |
| Trigger | Webhook received |
| Object context | Person |
| Sample payload key | `email` → `jane@acme.com` |
| Sample payload key | `company_domain` → `acme.com` |

### Step 2 — Parse the payload

Add the **Parse JSON** block. Point its **Source** at the trigger body and define a schema with the three signal inputs and the matching key. Mark anything optional that your source may omit so a missing field doesn't fail the run.

| Field | Value |
| --- | --- |
| Source | `{{ trigger.body }}` |
| Schema field | `email` (string, required) |
| Schema field | `fit` (number, 0–40) |
| Schema field | `intent` (number, 0–40) |
| Schema field | `engagement` (number, 0–20) |

### Step 3 — Compute the score with a visible Formula

Add the **Formula** block. Keep the expression readable so reps trust it — this is the whole point versus a black-box ML score. Each component is capped so the total lands on a clean 0–100 scale.

| Field | Value |
| --- | --- |
| Output name | `lead_score` |
| Expression | `min(fit, 40) + min(intent, 40) + min(engagement, 20)` |
| Output type | Number |
| Example result | `82` (fit 38, intent 32, engagement 12) |

### Step 4 — Branch on the band with Switch

Add the **Switch** block and create one branch per band using the score from Step 3. Order matters: Switch takes the first matching branch, so put the highest threshold first.

| Field | Value |
| --- | --- |
| Input | `{{ formula.lead_score }}` |
| Branch A | `lead_score >= 75` |
| Branch B | `lead_score >= 50` |
| Branch C (default) | everything else |

### Step 5 — Write the score and band on every branch

On each Switch branch, add an **Update record** block targeting the matched `Person`. Write both the numeric score and the band so the value is filterable and visible in the record. The band string differs per branch.

| Field | Value |
| --- | --- |
| Record | `{{ trigger.record }}` (matched by `email`) |
| `lead_score` | `{{ formula.lead_score }}` |
| `lead_band` | `A` on Branch A, `B` on Branch B, `C` on Branch C |

### Step 6 — Route the A band

On Branch A only, after Update record, add a **Round robin** block to assign an owner from your sales pool, then an **Enroll in sequence** block to start outreach. Branch B should add the lead to a nurture sequence or list; Branch C ends after the score write.

| Field | Value |
| --- | --- |
| Round robin pool | Account executives — EMEA |
| Assignment target | `Owner` on the matched record |
| Sequence | Proposal — outbound A leads |
| Enrolled record | `{{ trigger.record }}` |

## Variable mapping

| Variable | Source block | Field | Example value |
| --- | --- | --- | --- |
| `email` | Parse JSON | `email` | `jane@acme.com` |
| `fit` | Parse JSON | `fit` | `38` |
| `intent` | Parse JSON | `intent` | `32` |
| `engagement` | Parse JSON | `engagement` | `12` |
| `lead_score` | Formula | `lead_score` | `82` |
| `lead_band` | Switch | matched branch | `A` |
| `assigned_owner` | Round robin | `Owner` | Priya Sharma |

## Credit cost worked example

Parse JSON, Formula, and Switch are free logic blocks — they cost nothing no matter how often they run. Only the data writes and the sequence enrollment consume credits.

| Branch | Billable blocks | Credits per run |
| --- | --- | --- |
| A | Update record + Round robin¹ + Enroll in sequence | 3 |
| B | Update record + Enroll in nurture sequence | 2 |
| C | Update record | 1 |

¹ Round robin is a free workspace block; the 3 credits on the A branch come from the Update record and Enroll in sequence writes.

Say you process 2,000 events a month with a typical split of 10% A, 30% B, and 60% C: `(200 × 3) + (600 × 2) + (1,200 × 1) = 3,000` credits per month. Compare that against your plan's monthly credit allowance on [Credits and pricing](/reference/credits-and-pricing/), and adjust the band thresholds if the A branch is enrolling more leads than your team can work. None of this involves an AI block; if you later add a [Classify record](/reference/ai/classify-record/) step behind a Filter, sample about ten records and read the per-run cost in the run viewer, because AI cost is variable and token-based rather than a fixed number.

## Test plan

1. In the workflow editor, open the trigger and click the **Run test** button. For the webhook path, paste a sample payload with `email`, `fit`, `intent`, and `engagement`; for the attribute path, edit the signal field on a test `Person`.
2. Confirm **Parse JSON** outputs typed values — `fit: 38`, `intent: 32`, `engagement: 12` — and not raw strings.
3. Confirm the **Formula** output `lead_score` reads `82` for those inputs.
4. Confirm **Switch** routes the run down Branch A because `82 >= 75`.
5. Open the matched record and confirm **Update record** wrote `lead_score = 82` and `lead_band = A`.
6. Confirm **Round robin** assigned an owner and **Enroll in sequence** shows the lead enrolled.
7. Check the run in run history (see [Runs and debugging](/explanation/runs-and-debugging/)) and read each block's input and output to confirm the score is explainable end to end.
8. Fire one deliberately failing input: send a payload where `intent` is the string `"high"` instead of a number. Parse JSON should fail the schema and stop the run before any write. Confirm in run history that no credits were spent and no record was updated.

## Failure modes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Run stops at Parse JSON | A signal field arrived as a string or was missing | Mark optional fields optional in the schema and coerce numeric fields at the source. |
| Every lead lands in C | Formula inputs resolve to `0` because variable names don't match the Parse JSON output | Align the Formula variable names with the exact Parse JSON output keys. |
| Score looks wrong but reps can't tell why | Component caps are missing, so one signal dominates | Keep the `min(...)` caps visible in the expression and document the scale in `lead_band`. |
| A-band leads enrolled but not assigned | Round robin pool is empty or members are inactive | Confirm the pool has active members and runs before Enroll in sequence on the branch. |
| Duplicate enrollments | The trigger re-fires for the same event | Add a free [Filter](/reference/conditions/filter/) that exits when `lead_band` is already `A`. |

## Variations

### Separate fit and intent scores

Instead of one combined number, output two Formula values — `fit_score` and `intent_score` — and write both to the record. Switch on a 2×2 matrix (high fit + high intent = A) so reps can see whether a lead is a good fit, actively buying, or both. Everything else stays the same.

### Recompute on a schedule

Swap the trigger for [Recurring schedule](/reference/triggers/recurring-schedule/), add a [Find records](/reference/records/find-records/) block to pull the leads to rescore, and wrap the Formula, Switch, and Update record steps in a [Loop](/reference/utilities/loop/). The loop multiplies cost by the number of records, so gate it with a Filter to rescore only leads whose signals changed since the last run.

## See also

- [Webhook lead intake](/guides/capture-and-qualify/webhook-lead-intake/)
- [Variables](/explanation/variables/)
- [Switch](/reference/conditions/switch/)
- [Formula](/reference/calculations/formula/)
- [Send your first event to a webhook trigger](https://attio.com/help/workflows)
