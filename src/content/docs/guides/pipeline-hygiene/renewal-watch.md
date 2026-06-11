---
title: Daily renewal watch at 90, 60, and 30 days
description: Run a daily workflow that flags every account approaching renewal at 90, 60, and 30 days so no contract slips past its owner.
page-type: recipe
---

This build gives customer success and account teams a daily renewal watch that catches every account approaching its contract date at the 90-, 60-, and 30-day marks, so a renewal never slips because someone forgot to look. A [Recurring schedule](/reference/triggers/recurring-schedule/) fires once a day, [Find records](/reference/records/find-records/) pulls accounts with a renewal date, a [Loop](/reference/utilities/loop/) walks each one, [Adjust time](/reference/calculations/adjust-time/) computes the windows, an [If](/reference/conditions/if/) condition gates the matches, and [Create task](/reference/tasks/create-task/), [Update record](/reference/records/update-record/), and a [Broadcast message](/reference/workspace/broadcast-message/) digest do the work.

| Field | Value |
| --- | --- |
| Difficulty | Intermediate |
| Time to build | ~15 min |
| Trigger | [Recurring schedule](/reference/triggers/recurring-schedule/) (daily) |
| Blocks used | [Find records](/reference/records/find-records/), [Loop](/reference/utilities/loop/), [Adjust time](/reference/calculations/adjust-time/), [If](/reference/conditions/if/), [Create task](/reference/tasks/create-task/), [Update record](/reference/records/update-record/), [Broadcast message](/reference/workspace/broadcast-message/) |
| Credit cost per run | 2 credits per matched window (Create task + Update record); everything else is free |
| Plan required | Plus or higher |

## Prerequisites

- An Attio plan on the **Plus** tier or higher.
- An **Accounts** object (or your equivalent customer object) with a `renewal_date` date attribute populated on active contracts.
- An `owner` attribute on the account that resolves to a workspace member who can receive tasks.
- A `renewal_notified_window` attribute on the account — a single-select or text attribute that records which window has already fired (for example `90`, `60`, or `30`). Create it before you build.
- The Slack integration connected if you want the digest posted to a channel; otherwise use the built-in **Broadcast message** block to notify in-app.
- No special API keys or scopes are needed — every block here runs inside Attio.

## How it works

The workflow runs once a day, loads every account that has a renewal date, and checks each account against three fixed windows. For an account whose renewal lands in a window it hasn't been notified about yet, the workflow creates a task for the owner, stamps the window onto the account so it never fires twice, and adds the account to a daily digest. The flow, in execution order:

1. [Recurring schedule](/reference/triggers/recurring-schedule/) — fires daily at a fixed time.
2. [Find records](/reference/records/find-records/) — accounts where `renewal_date` is not empty.
3. [Loop](/reference/utilities/loop/) — iterate each matched account.
4. [Adjust time](/reference/calculations/adjust-time/) — compute the 90-, 60-, and 30-day boundary dates from today.
5. [If](/reference/conditions/if/) — renewal falls inside a window **and** that window hasn't been notified yet.
6. [Create task](/reference/tasks/create-task/) — assign a renewal task to the account owner.
7. [Update record](/reference/records/update-record/) — set `renewal_notified_window` so the window fires once.
8. [Broadcast message](/reference/workspace/broadcast-message/) — post the daily digest of flagged accounts.

## Build steps

### Step 1 — Add the trigger

Add a [Recurring schedule](/reference/triggers/recurring-schedule/) trigger and set it to run once per day, early enough that owners see tasks before their morning standup. Pick the team's primary timezone so the windows line up with how people read dates.

| Field | Value |
| --- | --- |
| Frequency | Daily |
| Time | 07:00 |
| Timezone | Europe/London (your team's primary zone, e.g. EMEA) |

### Step 2 — Find accounts with a renewal date

Add a [Find records](/reference/records/find-records/) block on the **Accounts** object. Filter to accounts that actually have a renewal date so you never loop over the whole book.

| Field | Value |
| --- | --- |
| Object | Accounts |
| Filter | `renewal_date` is not empty |
| Sort | `renewal_date` ascending |
| Limit | 500 (set to 5 while testing) |

### Step 3 — Loop the matched accounts

Add a [Loop](/reference/utilities/loop/) block over the output of **Find records**. Everything from here down runs once per account.

| Field | Value |
| --- | --- |
| Loop over | `{{find_records.records}}` |
| Item variable | `account` |
| Max iterations | 500 (set to 5 while testing) |

### Step 4 — Compute the window boundaries

Inside the loop, add an [Adjust time](/reference/calculations/adjust-time/) block to compute the 90-, 60-, and 30-day boundary dates from today. Add the block once per window, or compute all three and compare in the next step. Each window is "today plus N days," and you match when the account's `renewal_date` equals that boundary.

| Field | Value |
| --- | --- |
| Base time | Run date (today) |
| Operation | Add |
| Amount (window A) | 90 days |
| Amount (window B) | 60 days |
| Amount (window C) | 30 days |

### Step 5 — Gate on the window and the notified flag

Add an [If](/reference/conditions/if/) block so the run only continues for an account whose renewal lands in a window it hasn't been notified about. This is the gate that stops duplicate tasks across days — it's free, and it does the real hygiene work.

| Field | Value |
| --- | --- |
| Condition | `account.renewal_date` equals one of the 90/60/30 boundary dates |
| And | `account.renewal_notified_window` does not already equal that window |
| If false | Continue loop (skip this account today) |

### Step 6 — Create the renewal task

When the **If** passes, add a [Create task](/reference/tasks/create-task/) block to assign the work to the account owner. Name the window in the task text so the owner knows the urgency at a glance.

| Field | Value |
| --- | --- |
| Task text | `Renewal in 60 days — {{account.name}} (renews {{account.renewal_date}})` |
| Assignee | `{{account.owner}}` (e.g. Priya Sharma) |
| Linked record | `{{account.record_id}}` |
| Due date | Today |

### Step 7 — Stamp the notified window

Add an [Update record](/reference/records/update-record/) block right after the task so the matched window can't fire again tomorrow. This single write is what guarantees each window fires once.

| Field | Value |
| --- | --- |
| Object | Accounts |
| Record | `{{account.record_id}}` |
| Attribute | `renewal_notified_window` |
| New value | `60` (the window that just matched) |

### Step 8 — Post the daily digest

After the loop, add a [Broadcast message](/reference/workspace/broadcast-message/) block (or a Slack block — see [Variations](#variations)) to summarize the accounts flagged on this run. Use the loop's collected matches so the digest lists every account, not just the last one.

| Field | Value |
| --- | --- |
| Channel | #customer-success |
| Message | `Renewal watch — {{matched_count}} account(s) flagged today: {{matched_list}}` |

## Variable mapping

| Variable | Source block | Field | Example value |
| --- | --- | --- | --- |
| `account` | Loop | Current item | The Acme Corp account record |
| `account.name` | Find records | `name` | Acme Corp |
| `account.renewal_date` | Find records | `renewal_date` | 2026-09-09 |
| `account.owner` | Find records | `owner` | Priya Sharma |
| `account.renewal_notified_window` | Find records | `renewal_notified_window` | (empty) |
| Window boundary | Adjust time | Computed date | 2026-09-09 (today + 90) |
| `matched_count` | Loop | Iteration tally | 7 |
| `matched_list` | Loop | Collected names | Acme Corp, Globex, Initech |

## Credit cost worked example

The schedule, [Find records](/reference/records/find-records/), [Loop](/reference/utilities/loop/), [Adjust time](/reference/calculations/adjust-time/), and the [If](/reference/conditions/if/) condition are all free logic and lookup blocks — they consume no credits, even across hundreds of loop iterations. A condition that stops a run is free, so accounts that don't match cost nothing.

Cost is incurred only on a matched window, where two writes run per account: one [Create task](/reference/tasks/create-task/) and one [Update record](/reference/records/update-record/), at 1 credit each, for **2 credits per matched window**. The [Broadcast message](/reference/workspace/broadcast-message/) digest costs 1 credit per run when it executes.

Suppose 25 accounts cross a window in a typical month. That's 25 × 2 = 50 credits for the writes, plus roughly 30 daily digest posts at 1 credit each = 30 credits, for about 80 credits a month. The daily schedule itself adds nothing. Check your plan's monthly allowance on [Credits and pricing](/reference/credits-and-pricing/) before scaling the digest frequency.

## Test plan

1. Set the **Find records** limit and the **Loop** max iterations to 5 so a test run stays small.
2. Pick one account and set its `renewal_date` to exactly today + 90 days, and clear its `renewal_notified_window`.
3. Open the workflow and use **Run test** to fire the schedule manually.
4. Expected output per block: **Find records** returns your test account; **Loop** iterates it; **Adjust time** produces the 90-day boundary equal to the account's renewal date; **If** passes; **Create task** creates one task for the owner; **Update record** sets `renewal_notified_window` to `90`; **Broadcast message** posts a digest naming the account.
5. Check **run history** to confirm the task was created, the flag was stamped, and no second task appears if you run the test again the same day — the **If** should now skip the account.
6. Deliberately failing input: set the account's `renewal_date` to 45 days out (between windows). Run the test. The **If** should fail and the loop should skip the account with zero credits spent — confirm no task is created.

## Failure modes

| Symptom | Cause | Fix |
| --- | --- | --- |
| The same account gets a task every day | The `renewal_notified_window` flag isn't being set or isn't part of the **If** condition | Confirm Step 7 runs after the task and that Step 5 reads the same window value it writes |
| No tasks ever appear | **Find records** filter excludes everything, or `renewal_date` is empty on accounts | Check the filter is `is not empty` and that renewal dates are populated |
| Windows are off by a day | Schedule timezone differs from how dates are stored | Align the **Recurring schedule** timezone with the team's primary zone |
| Tasks go to no one | `owner` is empty on the account | Add `owner is not empty` to the **Find records** filter or default the assignee |
| Digest lists only one account | The message reads a single loop item instead of the collected matches | Reference the loop's collected list, not the current item, in the **Broadcast message** |
| Run is slow or hits limits | Loop runs over the entire account book | Tighten the **Find records** filter and keep the renewal-date sort |

## Variations

### Per-window message

Branch the task text and digest copy by window so a 30-day renewal reads more urgently than a 90-day one. Add a [Switch](/reference/conditions/switch/) block after the **If** to route to three [Create task](/reference/tasks/create-task/) configurations, each with its own wording and due date. Everything else stays the same; the **Switch** is free.

### CS versus AE owner

Route the task to a customer success manager for existing-customer renewals and to an account executive for expansion-eligible accounts. Add a [Filter](/reference/conditions/filter/) or [Switch](/reference/conditions/switch/) on an account segment attribute and set the [Create task](/reference/tasks/create-task/) assignee accordingly. Only the assignee mapping changes; the windows and the notified flag are untouched.

## See also

- [Stale deal sweep](/guides/pipeline-hygiene/stale-deal-sweep/)
- [Loops](/explanation/loops/)
- [Adjust time](/reference/calculations/adjust-time/)
- [Create task](/reference/tasks/create-task/)
- [Recurring schedules in Attio](https://attio.com/help/workflows)
