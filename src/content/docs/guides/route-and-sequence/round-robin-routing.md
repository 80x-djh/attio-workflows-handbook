---
title: Round-robin lead routing
description: Assign every new qualified lead to the next rep in a pool, set the Owner, and create a first-touch task so no inbound goes cold.
page-type: recipe
---

When a new lead lands, this workflow assigns it to the next rep in a fair rotation so nobody hoards the easy ones and nobody gets skipped. It fires on [Record created](/reference/triggers/record-created/) (or [Record added to list](/reference/triggers/record-added-to-list/) if you stage inbound on a list), gates on a free [Filter](/reference/conditions/filter/) so only qualified leads route, picks the next rep with [Round robin](/reference/workspace/round-robin/), writes the owner with [Update record](/reference/records/update-record/), books a first-touch with [Create task](/reference/tasks/create-task/), and pings the assigned rep in [Slack](/reference/integrations/). The result is that the right rep owns every qualifying lead and has a task waiting within 24 hours.

| Field | Value |
| --- | --- |
| Difficulty | Starter |
| Time to build | ~10 minutes |
| Trigger | [Record created](/reference/triggers/record-created/) on People, or [Record added to list](/reference/triggers/record-added-to-list/) |
| Blocks used | [Filter](/reference/conditions/filter/), [Round robin](/reference/workspace/round-robin/), [Update record](/reference/records/update-record/), [Create task](/reference/tasks/create-task/), [Slack](/reference/integrations/) |
| Credit cost per run | 3 credits (Update + Create task + Slack) |
| Plan required | Plus and above |

## Prerequisites

- An Attio Plus plan or higher (Workflows is available from Plus up).
- The Slack integration connected to your workspace, with the workflow allowed to post to your target channel.
- A People object (or a Companies object, if you route accounts) with an `owner` attribute of type **User**.
- A defined pool of reps as workspace members — the people who should receive routed leads.
- A `lead_status` (or equivalent) attribute you can filter on to tell qualified leads from raw signups.
- Workspace admin access to publish a workflow, plus a Slack channel ID for the alert.

## How it works

The trigger fires once per new lead. A free [Filter](/reference/conditions/filter/) drops anything that isn't qualified or already has an owner, so the rotation only advances on real work. [Round robin](/reference/workspace/round-robin/) returns the next rep from your pool and remembers its position across runs. [Update record](/reference/records/update-record/) stamps that rep onto the lead's `owner`. [Create task](/reference/tasks/create-task/) gives the rep a dated first-touch, and a [Slack](/reference/integrations/) message tells them to go work it.

1. [Record created](/reference/triggers/record-created/) on People (or [Record added to list](/reference/triggers/record-added-to-list/)) — free.
2. [Filter](/reference/conditions/filter/): qualified and no owner — free.
3. [Round robin](/reference/workspace/round-robin/): pick the next rep — free.
4. [Update record](/reference/records/update-record/): set `owner` — 1 credit.
5. [Create task](/reference/tasks/create-task/): first touch due in 24 hours — 1 credit.
6. [Slack](/reference/integrations/): notify the assigned rep — 1 credit.

## Build steps

### Step 1 — Add the trigger

In a new workflow, click **Add trigger** and choose **Record created**. Set the object to **People**. If you instead collect inbound on a list, choose **Record added to list** and select that list — the rest of the build is identical except you read fields from the list entry's parent record.

| Field | Value |
| --- | --- |
| Trigger | Record created |
| Object | People |
| Run as | A workspace member with edit access to People |

### Step 2 — Filter to qualified, unowned leads

Click **Add block**, choose **Filter**, and add two conditions joined with **And**. This is a free condition: when it doesn't pass, the run stops and costs nothing. Stopping here also keeps the rotation fair, because Round robin only advances on leads you actually route.

| Field | Value |
| --- | --- |
| Condition 1 | `lead_status` is `Qualified` |
| Condition 2 | `owner` is empty |
| Join | And |

### Step 3 — Pick the next rep

Add a **Round robin** block. Add each rep in the pool as an entry; the block hands out the next member in sequence and persists its cursor between runs, so assignment stays even over time.

| Field | Value |
| --- | --- |
| Pool members | Priya Sharma, Marcus Lee, Dana Okoro |
| Mode | Round robin (one per run) |
| Output | `round_robin.assignee` |

### Step 4 — Set the owner

Add an **Update record** block. Target the lead from the trigger and write the rep from Round robin into `owner`. This is the one write that makes ownership real, so it costs 1 credit.

| Field | Value |
| --- | --- |
| Record | `{{trigger.record}}` |
| Attribute | `owner` |
| Value | `{{round_robin.assignee}}` |

### Step 5 — Create the first-touch task

Add a **Create task**. Assign it to the same rep and date it for 24 hours out so first-touch is enforced, not hoped for.

| Field | Value |
| --- | --- |
| Linked record | `{{trigger.record}}` |
| Assignee | `{{round_robin.assignee}}` |
| Title | First touch: {{trigger.record.name}} |
| Due | {{trigger.timestamp}} + 24 hours |

### Step 6 — Notify the rep in Slack

Add the **Slack** block, choose **Send message**, and post to your inbound channel. Keep the message short and include the rep mention and a link to the record.

| Field | Value |
| --- | --- |
| Channel | `#inbound-leads` |
| Message | New lead {{trigger.record.name}} routed to {{round_robin.assignee}}. First touch due in 24h. |

Click **Publish** to go live.

## Variable mapping

| Variable | Source block | Field | Example value |
| --- | --- | --- | --- |
| `{{trigger.record}}` | Record created | The new person record | jane@acme.com |
| `{{trigger.record.name}}` | Record created | Person name | Jane Rivera |
| `{{round_robin.assignee}}` | Round robin | Next pool member | Priya Sharma |
| `{{trigger.timestamp}}` | Record created | When the record was created | 2026-06-11T14:02:00Z |

## Credit cost worked example

The trigger, [Filter](/reference/conditions/filter/), and [Round robin](/reference/workspace/round-robin/) are free logic blocks, so a run that's filtered out costs 0. A lead that routes costs 3 credits: 1 for [Update record](/reference/records/update-record/), 1 for [Create task](/reference/tasks/create-task/), and 1 for the [Slack](/reference/integrations/) message.

At 400 new leads a month with a 50% qualification rate, 200 leads route:

```
200 routed leads × 3 credits = 600 credits / month
```

There are no AI blocks here, so the cost is fixed and predictable. Check your monthly allowance against this number on [Credits and pricing](/reference/credits-and-pricing/) before you scale the pool or add channels.

## Test plan

1. Create a test person with `lead_status` set to `Qualified` and `owner` empty (use a record you can delete, e.g. jane@acme.com).
2. Open **Run history** and find the run the create triggered.
3. Confirm the [Filter](/reference/conditions/filter/) shows **Passed**.
4. Confirm [Round robin](/reference/workspace/round-robin/) output names a real pool member, e.g. Priya Sharma.
5. Confirm [Update record](/reference/records/update-record/) set `owner` to that member on the record.
6. Confirm a first-touch task exists, assigned to that member, due ~24 hours out.
7. Confirm the [Slack](/reference/integrations/) message landed in `#inbound-leads`.
8. Deliberately fail it: create a person with `lead_status` set to `Unqualified`. The run should stop at the [Filter](/reference/conditions/filter/) with **Did not pass** and consume 0 credits — Round robin must not advance.

## Failure modes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Same rep gets every lead | Round robin cursor resets each run, or pool has one member | Keep the block published, don't rebuild it, and confirm the pool lists all reps. |
| Leads with an owner get reassigned | Filter is missing the `owner` is empty condition | Add the empty-owner condition so manually assigned leads are skipped. |
| Rotation skews over time | A run set owner but Round robin advanced on a record that later disqualified | Keep the qualification check in the Filter before Round robin so the cursor only moves on real routes. |
| No Slack message | Channel ID wrong, or the integration lacks post access | Re-select the channel and confirm the Slack app is invited to it. |
| Task has no due date | Date expression left blank | Set Due to the trigger timestamp plus 24 hours. |

## Variations

### Route by territory or segment first

Add a [Switch](/reference/conditions/switch/) on a `region` or `segment` attribute before Round robin, then keep a separate pool per branch — EMEA leads rotate through the EMEA reps, SMB through the SMB reps. The writes downstream are unchanged.

### Weighted pools

If one rep should carry more volume, list them more than once in the pool, or split into tiers and route a [Filter](/reference/conditions/filter/)-defined slice (for example, enterprise leads) to a smaller senior pool. Round robin stays free; only the writes after it cost credits.

## See also

- [Sequence enrollment](/reference/sequences/enroll-in-sequence/)
- [Records vs list entries](/explanation/records-vs-list-entries/)
- [Round robin](/reference/workspace/round-robin/)
- [Update record](/reference/records/update-record/)
- [Assign records and tasks in Attio](https://attio.com/help/workflows)
