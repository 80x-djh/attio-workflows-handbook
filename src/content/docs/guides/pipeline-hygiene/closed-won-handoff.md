---
title: Hand off closed-won deals to Customer Success
description: When a deal moves to Closed won, auto-summarize it, create an onboarding record and task, add it to the active onboarding list, and ping CS in Slack.
page-type: recipe
---

When a deal moves to Closed won, auto-summarize it, create an onboarding record and task, add it to the active onboarding list, and ping CS in Slack. This recipe fires on [Attribute value changed](/reference/triggers/attribute-value-changed/) when a deal's Stage becomes Closed won, guards against re-fires with an [If](/reference/conditions/if/), drafts a handoff brief with [Summarize record](/reference/ai/summarize-record/), then runs [Create record](/reference/records/create-record/), [Create task](/reference/tasks/create-task/), [Add record to list](/reference/lists/add-record-to-list/), and a [Slack](/reference/integrations/) message so no won deal ever falls through the cracks between Sales and CS.

| Field | Value |
| --- | --- |
| Difficulty | Intermediate |
| Time to build | ~15 min |
| Trigger | [Attribute value changed](/reference/triggers/attribute-value-changed/) on Deals → Stage |
| Blocks used | [If](/reference/conditions/if/), [Summarize record](/reference/ai/summarize-record/), [Create record](/reference/records/create-record/), [Create task](/reference/tasks/create-task/), [Add record to list](/reference/lists/add-record-to-list/), [Slack](/reference/integrations/) |
| Credit cost per run | ~3 credits + variable AI (see worked example) |
| Plan required | Plus and above |

## Prerequisites

- A workspace on the **Plus** plan or higher.
- The **Slack** integration connected, with a channel for Customer Success (for example, `#cs-onboarding`).
- A **Deals** object with a **Stage** status attribute that includes a **Closed won** option.
- An **Onboarding** object (or you can target a CS list) with at least a **Name**, a **Deal** record-reference attribute back to Deals, and an **Owner** attribute.
- A list named **Active onboarding** to track in-flight handoffs.
- An API key isn't required for this build — the Slack block uses the connected integration, not a raw token.

## How it works

The workflow listens for a single attribute changing on a deal. When Stage flips to Closed won, an If guard confirms the value actually changed (so a re-save of an already-won deal doesn't re-trigger the whole handoff). It then summarizes the deal for CS, materializes an onboarding record, assigns the CS owner a task, files the deal on the active-onboarding list, and announces it in Slack with the summary inline.

1. [Attribute value changed](/reference/triggers/attribute-value-changed/) — Deals, Stage → Closed won
2. [If](/reference/conditions/if/) — old value ≠ new value (re-fire guard)
3. [Summarize record](/reference/ai/summarize-record/) — deal brief for CS
4. [Create record](/reference/records/create-record/) — onboarding record
5. [Create task](/reference/tasks/create-task/) — for the CS owner
6. [Add record to list](/reference/lists/add-record-to-list/) — active onboarding
7. [Slack](/reference/integrations/) — post summary to the CS channel

## Build steps

### Step 1 — Add the trigger

Create a new workflow and add the [Attribute value changed](/reference/triggers/attribute-value-changed/) trigger. Scope it to the Deals object and the Stage attribute so the workflow only wakes when a deal's stage moves.

| Field | Value |
| --- | --- |
| Object | Deals |
| Attribute | Stage |
| Condition | Changes to **Closed won** |

### Step 2 — Guard against re-fires with If

Add an [If](/reference/conditions/if/) block immediately after the trigger. Compare the old Stage value to the new one so a re-save or bulk edit of an already-won deal can't replay the handoff. Only the **true** branch continues.

| Field | Value |
| --- | --- |
| Left value | Trigger → Stage (old value) |
| Operator | is not equal to |
| Right value | Trigger → Stage (new value) |
| On false | Stop run |

### Step 3 — Summarize the deal for CS

Add a [Summarize record](/reference/ai/summarize-record/) block on the true branch and point it at the deal from the trigger. Write a prompt aimed at the CS reader so the brief is actionable, not a data dump.

| Field | Value |
| --- | --- |
| Record | Trigger → Deal |
| Prompt | "Summarize this deal for Customer Success: who the customer is, what they bought, the primary contact, and any commitments made during the sale." |
| Run as | Priya Sharma (CS lead, read-only) |

### Step 4 — Create the onboarding record

Add a [Create record](/reference/records/create-record/) block targeting your Onboarding object. Link it back to the deal and seed the owner so CS has a single home for the engagement.

| Field | Value |
| --- | --- |
| Object | Onboarding |
| Name | Acme — Onboarding |
| Deal | Trigger → Deal |
| Owner | Priya Sharma |
| Status | Kickoff pending |

### Step 5 — Create a task for the CS owner

Add a [Create task](/reference/tasks/create-task/) block so the handoff lands in someone's queue, not just a record.

| Field | Value |
| --- | --- |
| Title | Kick off onboarding for Acme |
| Assignee | Priya Sharma |
| Linked record | Create record → Onboarding (Acme — Onboarding) |
| Due date | 2 business days from today |

### Step 6 — Add the deal to the active-onboarding list

Add an [Add record to list](/reference/lists/add-record-to-list/) block so the deal shows up on the CS board everyone watches.

| Field | Value |
| --- | --- |
| List | Active onboarding |
| Record | Trigger → Deal |
| Stage (list entry) | Onboarding |

### Step 7 — Post the summary to Slack

Add a [Slack](/reference/integrations/) block to announce the win and paste the brief inline.

| Field | Value |
| --- | --- |
| Channel | #cs-onboarding |
| Message | "🎉 Closed won: Acme (acme.com). Owner: Priya Sharma. Summary: {{ Summarize record → summary }}" |

## Variable mapping

| Variable | Source block | Field | Example value |
| --- | --- | --- | --- |
| Deal | [Attribute value changed](/reference/triggers/attribute-value-changed/) | Record | Acme (acme.com) |
| Old stage | [Attribute value changed](/reference/triggers/attribute-value-changed/) | Stage (old value) | Proposal |
| New stage | [Attribute value changed](/reference/triggers/attribute-value-changed/) | Stage (new value) | Closed won |
| CS summary | [Summarize record](/reference/ai/summarize-record/) | summary | "Acme bought the Growth plan; primary contact Priya Sharma; promised EMEA data residency." |
| Onboarding record | [Create record](/reference/records/create-record/) | record | Acme — Onboarding |
| Owner | [Create record](/reference/records/create-record/) | Owner | Priya Sharma |

## Credit cost worked example

Per run, the fixed costs are: the trigger is free, the [If](/reference/conditions/if/) guard is free (a condition that stops a run is free), and the [Create record](/reference/records/create-record/), [Create task](/reference/tasks/create-task/), [Add record to list](/reference/lists/add-record-to-list/), and [Slack](/reference/integrations/) blocks are **1 credit each** — so **4 credits** of writes per completed handoff.

The [Summarize record](/reference/ai/summarize-record/) block is **variable and token-based**: its cost depends on how much deal context the model reads and writes. Don't assume a fixed number — fire the workflow on ~10 representative deals and read the actual per-run AI cost in the run viewer, then multiply by your volume.

At a realistic **40 closed-won deals/month**: 40 × 4 = **160 write credits/month**, plus the AI cost (≈ 40 × your sampled per-summary figure). Check that combined total against your plan's monthly allowance on [Credits and pricing](/reference/credits-and-pricing/).

## Test plan

1. Pick a sandbox deal still in Proposal. Open the run viewer (or have it in another tab) so you can watch.
2. Move the deal's Stage to **Closed won**. The [Attribute value changed](/reference/triggers/attribute-value-changed/) trigger should fire once.
3. Confirm the [If](/reference/conditions/if/) guard resolves **true** (old `Proposal` ≠ new `Closed won`) and the run continues.
4. Confirm [Summarize record](/reference/ai/summarize-record/) returns a non-empty CS brief; check its output in run history.
5. Confirm a new Onboarding record exists, a task is assigned to the CS owner, the deal appears on **Active onboarding**, and the Slack message lands in `#cs-onboarding` with the summary text.
6. **Deliberately failing input:** re-save the same already-won deal (or set Stage to Closed won again without a real change). The [If](/reference/conditions/if/) guard should resolve **false** and stop the run — no second onboarding record, task, list entry, or Slack message. Verify the stopped run in run history.

## Failure modes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Duplicate onboarding records for one deal | Re-save of an already-won deal re-triggered the run | Confirm the [If](/reference/conditions/if/) guard compares old ≠ new and stops on false |
| AI summary is empty or thin | Deal record has little context to read, or Run-as identity can't see related records | Enrich the deal first; set Run as to a CS user with read access |
| Slack message never posts | Slack integration disconnected or channel renamed | Reconnect Slack and re-select `#cs-onboarding` in the block |
| Task created but unassigned | Owner attribute on the deal/onboarding record is empty | Default the assignee to the CS lead instead of an empty Owner reference |
| Onboarding record missing the deal link | Deal reference mapped to the wrong field | Map the Deal attribute to Trigger → Deal in [Create record](/reference/records/create-record/) |

## Variations

### Skip the summary for small deals

Add a free [Filter](/reference/conditions/filter/) before [Summarize record](/reference/ai/summarize-record/) that only lets deals above a threshold (for example, ACV ≥ $25,000) reach the AI block. Small deals still get the record, task, list entry, and Slack ping — they just skip the variable AI cost. Gating the AI behind a free Filter keeps token spend on the deals that warrant a written brief.

### Route by segment

If CS is split by region or segment, add a [Switch](/reference/conditions/switch/) after the guard on the deal's Segment attribute (for example, EMEA, AMER, SMB). Each branch sets a different owner, Slack channel, and list so the handoff lands with the right team automatically.

## See also

- [Stale-deal sweep](/guides/pipeline-hygiene/stale-deal-sweep/)
- [Conditions and filters](/explanation/conditions-and-filters/)
- [Summarize record](/reference/ai/summarize-record/)
- [Credits and pricing](/reference/credits-and-pricing/)
- [Attio: Workflows overview](https://attio.com/help/workflows)
