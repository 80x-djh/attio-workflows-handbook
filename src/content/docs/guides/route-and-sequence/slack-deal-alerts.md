---
title: Slack deal alerts on stage change
description: Notify the revenue team in Slack when a deal moves to a meaningful stage, without firing on every minor CRM edit.
page-type: recipe
---

Notify the revenue team in Slack when a deal moves to a meaningful stage, without firing on every minor CRM edit. This build watches the **Stage** attribute on your Deals object with the [Attribute value changed](/reference/triggers/attribute-value-changed/) trigger, optionally branches the message with [Switch](/reference/conditions/switch/), and posts the deal name, value, owner, and Attio URL to `#revenue` with the [Slack](/reference/integrations/) block. Sales leaders see momentum the moment it happens, not at the next pipeline review.

| Field | Value |
| --- | --- |
| Difficulty | Starter |
| Time to build | ~8 minutes |
| Trigger | [Attribute value changed](/reference/triggers/attribute-value-changed/) on Deals → Stage |
| Blocks used | [Switch](/reference/conditions/switch/) (optional), [Slack](/reference/integrations/) post message |
| Credit cost per run | 1 credit (the Slack post); trigger and Switch are free |
| Plan required | Plus and above |

## Prerequisites

- An Attio plan of Plus or above, which includes the Slack integration and the new Workflows engine.
- The Slack integration connected to your workspace, with the connecting user a member of the target channel (`#revenue`).
- A **Deals** object with a single-select **Stage** attribute (slug `stage`) and the stages you care about already defined, for example `Qualified`, `Proposal`, and `Won`.
- An **Owner** attribute on Deals (slug `owner`) and an **Amount** or **Deal value** attribute (slug `value`) populated for live deals.
- No API key is needed for the Slack block; the integration handles authentication.

## How it works

The trigger fires only when the **Stage** attribute changes, so routine edits to other fields never reach the Slack step. An optional [Switch](/reference/conditions/switch/) reads the new stage value and routes to a different message branch per stage; if you only care about a single message format, skip it. The Slack block then posts a formatted message into `#revenue`, pulling the deal name, value, owner, and Attio URL from the triggering record. The Slack post is the only block that writes externally, so it's the only block that costs a credit.

Execution order:

1. [Attribute value changed](/reference/triggers/attribute-value-changed/) — fires on Deals → Stage.
2. [Switch](/reference/conditions/switch/) — optional, branches by new stage value (free).
3. [Slack](/reference/integrations/) — posts the alert to `#revenue` (1 credit).

## Build steps

### Step 1 — Add the trigger

In a new workflow, click **Add trigger** and choose **Attribute value changed**. Set the object to **Deals** and the attribute to **Stage**. Do not use an unscoped [Record updated](/reference/triggers/record-updated/) trigger here — it fires on every field edit and would post to Slack when someone fixes a typo in the company name. Scoping to the **Stage** attribute is what keeps the channel signal high.

| Field | Value |
| --- | --- |
| Trigger | Attribute value changed |
| Object | Deals |
| Attribute | Stage |
| Run as | Priya Sharma (a user with access to all deals) |

### Step 2 — Branch by stage (optional)

If different stages deserve different messages, add a **Switch** block. Set the input to the trigger's new **Stage** value and add one branch per stage you want to announce. Leave the default branch empty so unlisted stages (like `Discovery`) stop the run silently — a stopped run is free. If one message works for every stage, skip this step and wire the trigger straight to Slack.

| Field | Value |
| --- | --- |
| Block | Switch |
| Input | Stage (new value) from trigger |
| Branch 1 | `Proposal` → continue |
| Branch 2 | `Won` → continue |
| Default | Stop run (no announcement) |

### Step 3 — Post to Slack

Add the **Slack** block and choose **Post message to channel**. Select the connected workspace, set the channel to `#revenue`, and compose the message with variables from the trigger. Use Slack markdown so the deal name and stage stand out.

| Field | Value |
| --- | --- |
| Block | Slack → Post message to channel |
| Channel | #revenue |
| Message | `*{{trigger.record.name}}* moved to *{{trigger.new_value}}*` |
| Line 2 | `Value: {{trigger.record.value}} · Owner: {{trigger.record.owner}}` |
| Line 3 | `Open in Attio: {{trigger.record.web_url}}` |

## Variable mapping

| Variable | Source block | Field | Example value |
| --- | --- | --- | --- |
| `{{trigger.record.name}}` | Attribute value changed | Deal name | Acme renewal |
| `{{trigger.new_value}}` | Attribute value changed | Stage (new value) | Proposal |
| `{{trigger.record.value}}` | Attribute value changed | Deal value | $48,000 |
| `{{trigger.record.owner}}` | Attribute value changed | Owner | Priya Sharma |
| `{{trigger.record.web_url}}` | Attribute value changed | Attio record URL | https://app.attio.com/acme/deals/record/abc123 |

## Credit cost worked example

The trigger is free. The optional **Switch** is a free logic block. Only the **Slack** post costs 1 credit, and only when the run reaches it. If 120 deals move into an announced stage in a month, that's 120 runs × 1 credit = **120 credits**. Branches that hit the empty **Switch** default stop the run before Slack and cost nothing, so deals cycling through `Discovery` add no cost. Compare 120 credits against your plan's monthly allowance on [Credits and pricing](/reference/credits-and-pricing/) to confirm headroom.

If you add the optional [Summarize record](/reference/ai/summarize-record/) upgrade described under Variations, that block's cost is variable and token-based, not a flat credit. Sample about 10 representative deals, run them through, and read the per-run cost in the run viewer before estimating a monthly total.

## Test plan

1. Open a real deal, such as **Acme renewal**, and change its **Stage** from `Qualified` to `Proposal`.
2. Open the workflow's run history. Confirm a new run appears, triggered by the stage change.
3. Check the **Attribute value changed** trigger output: `new_value` should read `Proposal` and the record should be Acme renewal.
4. If you built the **Switch**, confirm the run took the `Proposal` branch and not the default.
5. Check the **Slack** block output for a `200` status and a message timestamp, then open `#revenue` and confirm the post shows the deal name, value, owner, and a working Attio link.
6. Deliberately fail it: change a deal's **Stage** to `Discovery` (an unlisted value). Confirm the run stops at the **Switch** default with no Slack post and no credit consumed.

## Failure modes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Slack posts on unrelated edits | Trigger is unscoped Record updated | Switch the trigger to Attribute value changed scoped to the Stage attribute |
| `channel_not_found` error | Connecting user isn't in `#revenue`, or the channel is private | Invite the connecting Slack user to the channel, then re-run |
| Message shows empty value or owner | Attribute is blank on the deal, or the variable slug is wrong | Confirm `value` and `owner` are populated and match the slugs in the message |
| No run appears at all | Stage edited by an automation the trigger ignores, or workflow is paused | Confirm the workflow is live and that Stage actually changed value |
| Attio link 404s | Used a relative path instead of `web_url` | Map the link to `{{trigger.record.web_url}}` |

## Variations

### Route each stage to its own channel

Replace the single Slack block with one per **Switch** branch: send `Proposal` to `#deals-active`, `Won` to `#wins`, and so on. Each branch's Slack post still costs 1 credit, but only one branch runs per stage change, so per-run cost is unchanged.

### Announce only above an amount threshold

Add a free [If](/reference/conditions/if/) block before Slack that continues only when **Deal value** is greater than `25000`. Small deals stop the run for free, so the channel stays focused on material movement.

### Add a one-line "why it moved" summary

Insert a [Summarize record](/reference/ai/summarize-record/) block before Slack to generate a short narrative from the deal's recent notes, then add the summary as a fourth line in the message. Gate it behind a free [Filter](/reference/conditions/filter/) so the AI only runs on deals reaching `Proposal` or `Won` — this block's cost is variable and token-based, so don't run it on every stage change.

### Create a task instead of posting

Swap the Slack block for [Create task](/reference/tasks/create-task/) to assign a follow-up to the deal owner when a deal reaches `Proposal`. The task write also costs 1 credit and keeps the alert inside Attio.

## See also

- [Round-robin lead routing](/guides/route-and-sequence/round-robin-routing/)
- [Triggers](/explanation/triggers/)
- [Attribute value changed](/reference/triggers/attribute-value-changed/)
- [Switch](/reference/conditions/switch/)
- [Build a workflow that sends Slack messages](https://attio.com/help/apps/other-apps/slack)
