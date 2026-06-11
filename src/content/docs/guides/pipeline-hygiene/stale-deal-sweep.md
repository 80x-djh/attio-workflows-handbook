---
title: Stale-deal sweep
description: Every Monday, find open deals that have gone quiet, flag the ones past a stage-specific age threshold, and task the owner to act.
page-type: recipe
---

Every Monday, find open deals that have gone quiet, flag the ones past a stage-specific age threshold, and task the owner to act. This is pipeline-hygiene work for sales managers and RevOps: a [Recurring schedule](/reference/triggers/recurring-schedule/) wakes the workflow, [Find records](/reference/records/find-records/) pulls the open deals, a [Loop](/reference/utilities/loop/) walks them, and an [If](/reference/conditions/if/) condition compares each deal's idle time against an [Adjust time](/reference/calculations/adjust-time/) threshold tuned per stage. Stale deals get a "Needs review" flag and a [Create task](/reference/tasks/create-task/) for the owner — the sweep flags and nudges, it never auto-closes anything.

| Field | Value |
| --- | --- |
| Difficulty | Intermediate |
| Time to build | ~15 minutes |
| Trigger | [Recurring schedule](/reference/triggers/recurring-schedule/) |
| Blocks used | [Find records](/reference/records/find-records/), [Loop](/reference/utilities/loop/), [Adjust time](/reference/calculations/adjust-time/), [If](/reference/conditions/if/), [Update record](/reference/records/update-record/), [Create task](/reference/tasks/create-task/) |
| Credit cost per run | 1 credit per stale deal (the flag write plus the task); free if nothing is stale |
| Plan required | Plus and above |

## Prerequisites

- A Plus plan or higher, so the new Workflows engine is available.
- The **Deals** object with a **Stage** status attribute and an **Owner** attribute populated on live deals.
- A **Last interaction** (or equivalent activity-timestamp) attribute on Deals that reflects real activity. Attio maintains a system **Last interaction** value; confirm it updates the way your team expects before you trust it.
- A **Needs review** checkbox (or single-select) attribute on Deals to hold the flag. Create it before you build the workflow.
- No external integrations or API keys are required for the core build. The optional digest needs a connected Slack workspace — see [Variations](#variations).

## How it works

The schedule fires once a week and hands a list of open, owned deals to a loop. For each deal, the workflow computes a per-stage cutoff date — "Qualified" deals are stale after 7 days, "Proposal" deals after 30 — and checks whether the deal's last interaction falls before that cutoff. Deals that fail the freshness check get flagged and generate an owner task; fresh deals fall through untouched. Nothing here closes or moves a deal, so a false positive costs an owner one glance, not a lost record.

1. [Recurring schedule](/reference/triggers/recurring-schedule/) — fires Monday morning in the team's time zone.
2. [Find records](/reference/records/find-records/) — open, owned deals only.
3. [Loop](/reference/utilities/loop/) — one iteration per matching deal.
4. [Adjust time](/reference/calculations/adjust-time/) — subtract the stage-specific threshold from "now" to get a cutoff date.
5. [If](/reference/conditions/if/) — is the deal's last interaction before the cutoff?
6. [Update record](/reference/records/update-record/) — set **Needs review** on stale deals.
7. [Create task](/reference/tasks/create-task/) — assign a follow-up to the deal owner.

## Build steps

### Step 1 — Add the trigger

Create a new workflow and add the **Recurring schedule** trigger. Set it to run weekly so the sweep lands before the Monday pipeline review, and pick the time zone your reps actually work in — not the workspace default — so "Monday morning" means the same thing for everyone.

| Field | Value |
| --- | --- |
| Trigger | Recurring schedule |
| Frequency | Weekly |
| Day | Monday |
| Time | 7:00 AM |
| Time zone | Europe/London (EMEA team) |

### Step 2 — Find the open, owned deals

Add a **Find records** block on the **Deals** object. Filter hard: a tight filter is your main defense against a loop credit blow-up, because every record it returns becomes a loop iteration. Restrict to open stages, require an owner, and add a wide outer activity bound so you never loop the whole pipeline.

| Field | Value |
| --- | --- |
| Object | Deals |
| Filter | Stage is any of `Qualified`, `Proposal`, `Negotiation` |
| Filter | Owner is not empty |
| Filter | Last interaction is before `now − 7 days` |
| Limit (while testing) | 5 |

:::caution
While you're building, keep the **Limit** at 5. An untuned sweep over a 4,000-deal pipeline can fire 4,000 task writes in one run. Raise the limit only after a clean test, and keep the stage filter narrow.
:::

### Step 3 — Loop over the matches

Add a **Loop** block and point it at the records from Step 2. The loop is free; what runs inside it is not, so everything that writes lives here and is gated by the condition in Step 5.

| Field | Value |
| --- | --- |
| Iterate over | `{{find_records.records}}` |
| Current item variable | `deal` |

### Step 4 — Compute a stage-specific cutoff

Inside the loop, add an **Adjust time** block to turn "now" into a cutoff date. Stage-specific ages are how you avoid false positives: a "Qualified" deal idle for 8 days is genuinely stale, but flagging a "Proposal" deal at the same age just trains reps to ignore the flag. Subtract the right number of days for the current deal's stage.

| Field | Value |
| --- | --- |
| Base time | `now` |
| Operation | Subtract |
| Amount | 7 days for `Qualified`, 30 days for `Proposal`, 14 days for `Negotiation` |
| Output | `cutoff_date` |

:::note
The cleanest way to pick the per-stage number is a [Switch](/reference/conditions/switch/) on `{{deal.stage}}` ahead of this block, writing the day count into a variable you feed into **Amount**. Both **Switch** and **Adjust time** are free.
:::

### Step 5 — Gate on staleness

Add an **If** condition that compares the deal's last interaction against the cutoff. A condition that stops a run is free, so this is where you spend nothing to protect the writes below it. Only deals that fail the freshness check continue down the true branch.

| Field | Value |
| --- | --- |
| Left | `{{deal.last_interaction}}` |
| Operator | is before |
| Right | `{{cutoff_date}}` |

### Step 6 — Flag the deal

On the true branch, add an **Update record** block to raise the review flag. This is idempotent: re-running the sweep on an already-flagged deal just re-sets the same value.

| Field | Value |
| --- | --- |
| Record | `{{deal}}` |
| Attribute | Needs review |
| Value | `true` |

### Step 7 — Task the owner

Add a **Create task** block on the same branch. Assign it to the deal owner and link it to the deal so the owner opens straight into context. Name the deal and its stage in the task text so the task is actionable without a click.

| Field | Value |
| --- | --- |
| Task text | `Stale deal — review: {{deal.name}} ({{deal.stage}}), no activity since {{deal.last_interaction}}` |
| Assignee | `{{deal.owner}}` |
| Linked record | `{{deal}}` |
| Due date | Today |

## Variable mapping

| Variable | Source block | Field | Example value |
| --- | --- | --- | --- |
| `{{find_records.records}}` | Find records | Matching records | 23 deals |
| `{{deal}}` | Loop | Current item | "Acme renewal" deal |
| `{{deal.stage}}` | Loop item | Stage | `Proposal` |
| `{{deal.last_interaction}}` | Loop item | Last interaction | `2026-05-02` |
| `{{deal.owner}}` | Loop item | Owner | Priya Sharma |
| `{{cutoff_date}}` | Adjust time | Computed cutoff | `2026-05-12` |

## Credit cost worked example

The schedule, **Find records**, **Loop**, **Adjust time**, the optional **Switch**, and the **If** condition are all free logic and lookup blocks — they cost nothing no matter how often they run. You pay only for the two writes on the stale branch: the **Update record** flag and the **Create task**, each 1 credit.

So each stale deal costs 2 credits per run, and fresh deals cost nothing. Say a typical Monday surfaces 15 stale deals: that's 15 × 2 = 30 credits per run, roughly 120 credits a month across four sweeps. Because the loop only writes on the true branch, a quiet week with two stale deals costs 4 credits, not the full pipeline. Check your plan's monthly allowance on the canonical [Credits and pricing](/reference/credits-and-pricing/) page; never assume the number from another page.

Loops multiply: the per-iteration cost is (writes on the stale branch) × (number of stale deals), so the only lever that matters is keeping the stale count honest with a tight Step 2 filter and accurate per-stage thresholds.

## Test plan

1. Set the **Find records** limit to 5 (Step 2) so a bad run can't fan out.
2. Pick or create one **Qualified** deal with a last interaction 10 days ago, owned by a real user — this is your expected pass.
3. Add one deliberately failing input: a **Proposal** deal touched 8 days ago. With the 30-day threshold, it must *not* be flagged. If it gets a task, your stage thresholds are wired backward.
4. Open the workflow and use **Run test** to fire the trigger manually instead of waiting for Monday.
5. In run history, expect: **Find records** returns up to 5 deals; **Loop** shows one iteration per deal; **Adjust time** outputs a `cutoff_date` that differs by stage; **If** branches true only for the 10-day **Qualified** deal.
6. Confirm exactly one **Update record** and one **Create task** ran — for the **Qualified** deal — and that the **Proposal** deal produced neither.
7. Open the flagged deal and confirm **Needs review** is set and the owner has a linked task. Then remove the limit and raise it deliberately for the live schedule.

## Failure modes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Hundreds of tasks in one run | The Find filter is too broad, so the loop iterates the whole pipeline | Narrow the Step 2 filter to open stages with an owner, and retest with the limit at 5 |
| Fresh deals getting flagged | A single global age threshold instead of per-stage cutoffs | Use the Switch + Adjust time pattern so each stage gets its own day count |
| Nothing ever flags | **Last interaction** isn't updating, so every deal looks "recent" | Verify the activity attribute reflects real touches before trusting it; swap to a reliable timestamp |
| Owners ignore the tasks | An operating-agreement gap, not a workflow bug | Don't add more workflow logic. Define what "stale" means, who owns follow-up, and when managers review ignored tasks |
| Duplicate tasks each week | The deal stayed stale and the sweep re-ran | Expected. Gate **Create task** behind a check on **Needs review** if you want one task per stale spell |

## Variations

### One digest instead of per-deal tasks

If per-deal tasks feel noisy, drop **Create task** and collect the stale deals into a single message. Keep the loop and **If**, append each stale deal to a variable, and after the loop send one [Broadcast message](/reference/workspace/broadcast-message/) or a [Slack](/reference/integrations/) post to the pipeline channel. This trades one credit per deal for one credit per digest, and gives managers a single Monday list instead of scattered tasks.

### Auto-snooze low-priority stages

For early-stage deals you don't want to chase weekly, add a **Switch** that routes "Qualified" deals through a longer threshold and writes a "Snoozed until" date with **Adjust time** instead of flagging. The sweep then skips snoozed deals until their date passes — still no auto-close, just a quieter cadence for the top of the funnel.

## See also

- [Slack deal alerts](/guides/route-and-sequence/slack-deal-alerts/)
- [Loops](/explanation/loops/)
- [Find records](/reference/records/find-records/)
- [Create task](/reference/tasks/create-task/)
- [Credits and pricing](/reference/credits-and-pricing/)
