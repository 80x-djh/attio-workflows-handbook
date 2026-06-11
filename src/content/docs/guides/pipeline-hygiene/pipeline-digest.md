---
title: Daily pipeline digest to Slack
description: Every weekday morning, find new and stalled deals, total the new pipeline, and broadcast a formatted digest to your sales channel — with zero AI credits.
page-type: recipe
---

Every weekday morning, find new and stalled deals, total the new pipeline, and broadcast a formatted digest to your sales channel — with zero AI credits. This recipe fires on a [Recurring schedule](/reference/triggers/recurring-schedule/) at the start of each business day, pulls fresh deals with [Find records](/reference/records/find-records/), rolls them up with [Aggregate values](/reference/calculations/aggregate-values/), finds the deals that have gone quiet with a second [Find records](/reference/records/find-records/), and posts the whole picture in-app with [Broadcast message](/reference/workspace/broadcast-message/) — so the team starts the day knowing what's new, what's won, and what's slipping without anyone running a report.

| Field | Value |
| --- | --- |
| Difficulty | Intermediate |
| Time to build | ~15 min |
| Trigger | [Recurring schedule](/reference/triggers/recurring-schedule/) — weekday mornings |
| Blocks used | [Find records](/reference/records/find-records/), [Aggregate values](/reference/calculations/aggregate-values/), [Broadcast message](/reference/workspace/broadcast-message/) |
| Credit cost per run | 0 credits (Broadcast is a free workspace block) |
| Plan required | Plus and above |

## Prerequisites

- A workspace on the **Plus** plan or higher.
- A **Deals** object with a **Stage** status attribute (with a **Closed won** option), an **Amount** number attribute, a **Created at** system timestamp, and a **Last activity** date attribute.
- An **Owner** attribute on Deals if you plan to scope or attribute the digest.
- A workspace channel or audience for [Broadcast message](/reference/workspace/broadcast-message/) — for example, a **Sales** team broadcast everyone watches.
- No API key or external integration is required: every block here is native and free. Broadcast posts inside Attio, not to Slack's API.

## How it works

The workflow wakes on a fixed schedule, does three free reads — count and total the deals created since yesterday, then list the deals that have stalled — and assembles a single in-app broadcast from those results. Nothing writes to a record, so the whole run costs zero credits. The only thing you must get right is the schedule's timezone, so "since yesterday" means yesterday for your team and not for a server in another hemisphere.

1. [Recurring schedule](/reference/triggers/recurring-schedule/) — weekday mornings, fixed timezone
2. [Find records](/reference/records/find-records/) — deals created since yesterday
3. [Aggregate values](/reference/calculations/aggregate-values/) — count + total Amount of those new deals
4. [Find records](/reference/records/find-records/) — open deals with no activity in 7+ days
5. [Broadcast message](/reference/workspace/broadcast-message/) — post the formatted digest

## Build steps

### Step 1 — Add the trigger

Create a new workflow and add the [Recurring schedule](/reference/triggers/recurring-schedule/) trigger. Set it to run on weekday mornings and — this is the part people skip — pin the timezone to where your team works. Without it, the schedule runs in UTC and your "yesterday" window drifts by hours.

| Field | Value |
| --- | --- |
| Frequency | Weekly |
| Days | Monday–Friday |
| Time | 08:00 |
| Timezone | Europe/London (set to your team's timezone) |

### Step 2 — Find deals created since yesterday

Add a [Find records](/reference/records/find-records/) block on the Deals object. Filter to deals created in the last day so the digest covers exactly the fresh pipeline.

| Field | Value |
| --- | --- |
| Object | Deals |
| Filter | Created at is on or after `now - 1 day` |
| Sort | Created at, newest first |
| Limit | 50 |

### Step 3 — Aggregate the new deals

Add an [Aggregate values](/reference/calculations/aggregate-values/) block fed by Step 2's results. Produce two outputs: a count of new deals and the sum of their Amount, so the digest leads with hard numbers.

| Field | Value |
| --- | --- |
| Input | Find records (Step 2) → records |
| Operation 1 | Count → `new_count` |
| Operation 2 | Sum of Amount → `new_value` |
| Empty handling | Treat no records as 0 |

### Step 4 — Find stalled deals

Add a second [Find records](/reference/records/find-records/) block on Deals. Filter to open deals that haven't moved in a week so the team sees what's slipping, not just what's new.

| Field | Value |
| --- | --- |
| Object | Deals |
| Filter | Stage is not Closed won **and** Stage is not Closed lost |
| Filter | Last activity is before `now - 7 days` |
| Sort | Last activity, oldest first |
| Limit | 10 |

### Step 5 — Broadcast the digest

Add a [Broadcast message](/reference/workspace/broadcast-message/) block and compose the digest from the variables above. Keep it scannable: counts first, then a short stalled list so owners know exactly what to chase.

| Field | Value |
| --- | --- |
| Audience | Sales team |
| Title | Daily pipeline digest |
| Message | "New deals today: {{ Aggregate → new_count }} worth {{ Aggregate → new_value }}. Stalled (7+ days, oldest first): {{ Find records (Step 4) → records }}. Owners, please update before standup. — Priya Sharma" |

## Variable mapping

| Variable | Source block | Field | Example value |
| --- | --- | --- | --- |
| New deals | [Find records](/reference/records/find-records/) (Step 2) | records | Acme (acme.com), Northwind, Globex |
| New deal count | [Aggregate values](/reference/calculations/aggregate-values/) | new_count | 6 |
| New pipeline value | [Aggregate values](/reference/calculations/aggregate-values/) | new_value | $148,000 |
| Stalled deals | [Find records](/reference/records/find-records/) (Step 4) | records | Initech (8 days), Umbrella (11 days) |
| Owner | [Find records](/reference/records/find-records/) (Step 2) | Owner | Priya Sharma |

## Credit cost worked example

This is the credit-conscious operator's favorite: it costs **0 credits per run**. The [Recurring schedule](/reference/triggers/recurring-schedule/) trigger is free, both [Find records](/reference/records/find-records/) blocks are free lookups, [Aggregate values](/reference/calculations/aggregate-values/) is free math, and [Broadcast message](/reference/workspace/broadcast-message/) is a free workspace block. There are no data writes, no external blocks, and no AI blocks anywhere in the run.

At a realistic **22 business days/month**, that's 22 runs × 0 = **0 credits/month**. The entire digest stays comfortably inside any plan's allowance — see [Credits and pricing](/reference/credits-and-pricing/) for the canonical model. If you later add a write (say, stamping a "last digested" date on each stalled deal inside a [Loop](/reference/utilities/loop/)), the cost becomes the per-iteration write × number of stalled deals; until then, this workflow is genuinely free to run forever.

## Test plan

1. Open the workflow and use **Run now** (a [Manual run](/reference/triggers/manual-run/)) to fire it on demand instead of waiting for tomorrow's schedule. Keep the run viewer open in another tab.
2. Confirm Step 2's [Find records](/reference/records/find-records/) returns only deals created in the last day — check the record count in run history.
3. Confirm [Aggregate values](/reference/calculations/aggregate-values/) outputs a `new_count` and a `new_value` that match those records (count of 0 and value of 0 is a valid result on a quiet day).
4. Confirm Step 4's [Find records](/reference/records/find-records/) returns open deals last touched 7+ days ago, oldest first.
5. Confirm the [Broadcast message](/reference/workspace/broadcast-message/) posts to the Sales audience with the counts and stalled list filled in from the variables — no empty `{{ }}` placeholders.
6. **Deliberately failing input:** leave the trigger timezone unset (or on UTC) while your team is on Europe/London, then run it at 08:00 local. The "since yesterday" window will be off by your UTC offset, so new deals created late last evening get missed or double-counted. Fix it by pinning the timezone in Step 1 and re-running — the count should now match what you see in the Deals view.

## Failure modes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Digest counts don't match the Deals view | Schedule timezone unset, so "since yesterday" is computed in UTC | Pin the timezone in the [Recurring schedule](/reference/triggers/recurring-schedule/) trigger |
| New pipeline value is blank or wrong | Aggregate summed the wrong attribute, or Amount is empty on some deals | Point the Sum at the Amount attribute and treat empty as 0 in [Aggregate values](/reference/calculations/aggregate-values/) |
| Stalled list never empties | Last activity isn't updated when reps work a deal | Confirm what writes to Last activity, or filter on a stage-changed timestamp instead |
| Broadcast shows raw `{{ }}` text | A variable reference points at a block that returned nothing | Check the source block in run history and confirm the variable path in the message |
| Digest fires on weekends | Days set to all-week instead of Monday–Friday | Restrict the schedule to weekdays in Step 1 |

## Variations

### Per-team digests

If pipeline is split by team or region, duplicate the workflow per segment and add an Owner or Region filter to each [Find records](/reference/records/find-records/) block (for example, Owner in EMEA team), then point each [Broadcast message](/reference/workspace/broadcast-message/) at that team's audience. Each squad gets a digest about its own deals instead of one firehose.

### Weekly exec rollup

Change the [Recurring schedule](/reference/triggers/recurring-schedule/) to Monday mornings only, widen Step 2's window to `now - 7 days`, and add a third [Find records](/reference/records/find-records/) for deals that hit Closed won in the same window so the exec digest reports new, won, and stalled for the week. Everything stays free — it's the same blocks on a longer cadence.

## See also

- [Stale deal sweep](/guides/pipeline-hygiene/stale-deal-sweep/)
- [Triggers](/explanation/triggers/)
- [Aggregate values](/reference/calculations/aggregate-values/)
- [Broadcast message](/reference/workspace/broadcast-message/)
- [Attio: Workflows overview](https://attio.com/help/workflows)
