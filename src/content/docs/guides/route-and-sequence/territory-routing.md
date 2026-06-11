---
title: Inbound routing by territory and seniority
description: Route every inbound demo request to the right rep in seconds, matched on region and title, with owner, a first-touch task, and a Slack alert.
page-type: recipe
---

Route every inbound demo request to the right rep in seconds, matched on region and title, with owner, a first-touch task, and a Slack alert. When a new lead lands on your inbound list, this workflow fires on [Record added to list](/reference/triggers/record-added-to-list/), screens out noise with a [Filter](/reference/conditions/filter/), branches on territory with a [Switch](/reference/conditions/switch/), branches again on seniority, picks a rep with [Round robin](/reference/workspace/round-robin/), writes the owner with [Update record](/reference/records/update-record/), books a first call with [Create task](/reference/tasks/create-task/), and pings that rep over [Slack](/reference/integrations/). Speed-to-lead drops from hours to seconds, and the right rep owns every demo request.

| Field | Value |
| --- | --- |
| Difficulty | Starter |
| Time to build | ~10 minutes |
| Trigger | [Record added to list](/reference/triggers/record-added-to-list/) |
| Blocks used | [Filter](/reference/conditions/filter/), [Switch](/reference/conditions/switch/), [Round robin](/reference/workspace/round-robin/), [Update record](/reference/records/update-record/), [Create task](/reference/tasks/create-task/), [Slack](/reference/integrations/) |
| Credit cost per run | ~3 credits (Update + task + Slack) |
| Plan required | Plus and above |

## Prerequisites

- An Attio plan of Plus or above (Workflows engine, June 2026+).
- A connected Slack integration with a channel or direct message the workflow can post to.
- A People object with a `country` or `region` attribute populated on inbound records, and a `job_title` attribute.
- A `territory` single-select attribute on People with options EMEA, AMER, and APAC.
- An inbound list — for example "Demo requests" — that new leads land on from your form or webhook.
- Two or more Attio users assigned to each territory pool you plan to route to.

## How it works

The trigger fires the moment a record joins your inbound list, so the run scopes to genuinely new leads rather than every edit to a person. A free [Filter](/reference/conditions/filter/) drops records that aren't real inbound demo requests. A free [Switch](/reference/conditions/switch/) reads the country or region field and routes the run down an EMEA, AMER, or APAC branch. A second branch on each path — another [Switch](/reference/conditions/switch/) or a [Filter](/reference/conditions/filter/) — separates senior titles (VP, Director, Head) from the rest, so your strongest reps get the named-account leads. [Round robin](/reference/workspace/round-robin/) then picks one rep from the matched pool, and three writes finish the job.

1. [Record added to list](/reference/triggers/record-added-to-list/) — a lead joins the inbound list.
2. [Filter](/reference/conditions/filter/) — keep only real demo requests.
3. [Switch](/reference/conditions/switch/) — branch on territory (EMEA / AMER / APAC).
4. [Switch](/reference/conditions/switch/) — branch on seniority within the territory.
5. [Round robin](/reference/workspace/round-robin/) — pick a rep from the matched pool.
6. [Update record](/reference/records/update-record/) — set Owner and Territory.
7. [Create task](/reference/tasks/create-task/) — schedule the first touch.
8. [Slack](/reference/integrations/) — alert the assigned rep.

## Build steps

### Step 1 — Add the trigger

Create a new workflow and add [Record added to list](/reference/triggers/record-added-to-list/) as the trigger. Point it at your inbound list. Don't use [Record updated](/reference/triggers/record-updated/) here — it fires on every edit to a person and will re-route leads that already have an owner.

| Field | Value |
| --- | --- |
| Trigger | Record added to list |
| List | Demo requests |
| Object | People |

### Step 2 — Filter to real inbound

Add a [Filter](/reference/conditions/filter/) so the workflow only acts on genuine demo requests. A condition that stops the run is free, so screen out test entries, internal emails, and rows missing a territory before any write happens.

| Field | Value |
| --- | --- |
| Condition 1 | `lead_source` is `Demo request` |
| Condition 2 | `email` does not contain `acme.com` (your own domain) |
| Condition 3 | `country` is not empty |
| Match | All conditions |

### Step 3 — Switch on territory

Add a [Switch](/reference/conditions/switch/) that reads the country or region field and creates one branch per territory. Map each set of countries to a branch label.

| Field | Value |
| --- | --- |
| Switch on | `country` |
| Branch — EMEA | United Kingdom, Germany, France, Spain, UAE |
| Branch — AMER | United States, Canada, Brazil, Mexico |
| Branch — APAC | Australia, Singapore, Japan, India |
| Default branch | EMEA (or your fallback pool) |

### Step 4 — Switch on seniority

On each territory branch, add a nested [Switch](/reference/conditions/switch/) (or a [Filter](/reference/conditions/filter/) if you only need a senior/standard split) that reads the job title. Both options are free.

| Field | Value |
| --- | --- |
| Switch on | `job_title` |
| Branch — Senior | title contains `VP`, `Director`, or `Head` |
| Branch — Standard | everything else |

### Step 5 — Round robin within the pool

On each seniority branch, add a [Round robin](/reference/workspace/round-robin/) and list only the reps who own that territory and tier. Round robin is free and returns one user.

| Field | Value |
| --- | --- |
| Pool — EMEA Senior | Priya Sharma, Tomás Alvarez |
| Pool — EMEA Standard | Lena Fischer, Marco Rossi |
| Output | `assigned_rep` (a user reference) |

### Step 6 — Update the record

Add an [Update record](/reference/records/update-record/) that writes the owner and territory back to the lead. This is the first write, so it costs 1 credit.

| Field | Value |
| --- | --- |
| Record | Trigger record |
| `owner` | `assigned_rep` (from Round robin) |
| `territory` | `EMEA` (the matched branch label) |

### Step 7 — Create the first-touch task

Add a [Create task](/reference/tasks/create-task/) so the rep has a concrete next action. This costs 1 credit.

| Field | Value |
| --- | --- |
| Title | First touch: Priya Sharma — demo request |
| Assignee | `assigned_rep` |
| Linked record | Trigger record |
| Due | Today |

### Step 8 — Slack the owner

Add the [Slack](/reference/integrations/) block to alert the assigned rep. This costs 1 credit.

| Field | Value |
| --- | --- |
| Destination | Direct message to `assigned_rep` |
| Message | New EMEA demo request assigned to you: Priya Sharma (VP Marketing, acme.com). First-touch task is due today. |

## Variable mapping

| Variable | Source block | Field | Example value |
| --- | --- | --- | --- |
| `lead_email` | Record added to list | `email` | `jane@acme.com` |
| `lead_country` | Record added to list | `country` | `Germany` |
| `lead_title` | Record added to list | `job_title` | `VP Marketing` |
| `territory` | Switch (territory) | branch label | `EMEA` |
| `seniority` | Switch (seniority) | branch label | `Senior` |
| `assigned_rep` | Round robin | selected user | `Priya Sharma` |

## Credit cost worked example

The trigger, both Switch blocks, the Filter, and Round robin are free logic blocks, so they never consume credits. Only the three writes cost: [Update record](/reference/records/update-record/) (1) + [Create task](/reference/tasks/create-task/) (1) + [Slack](/reference/integrations/) (1) = **3 credits per qualified lead**.

At 400 inbound demo requests a month, that's 400 × 3 = **1,200 credits per month**. Leads that the Step 2 Filter stops cost 0 credits, so your real spend tracks qualified inbound, not raw form fills. Check your monthly allowance against the current numbers on [Credits and pricing](/reference/credits-and-pricing/).

## Test plan

1. In your form or test tool, submit a demo request for `jane@acme.com`, country `Germany`, title `VP Marketing`, source `Demo request`. The lead should land on the Demo requests list and fire the trigger.
2. Open the run in run history and confirm the **Filter** passed (all three conditions matched).
3. Confirm the territory **Switch** took the EMEA branch and the seniority **Switch** took the Senior branch.
4. Confirm **Round robin** returned one EMEA Senior rep — for example, Priya Sharma — and that the same name appears in the **Update record**, **Create task**, and **Slack** steps.
5. Verify the lead's `owner` and `territory` are set, a task is due today, and a Slack DM arrived.
6. **Deliberately failing input:** submit a lead with `country` empty and source `Newsletter`. The Step 2 Filter should stop the run; run history shows it halted at the Filter with zero writes and zero credits.

## Failure modes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Leads re-route after every edit | Trigger is Record updated, which fires on any change | Switch the trigger to Record added to list, or scope to a change on a specific attribute |
| Run lands on the Default branch | Country value isn't in any territory mapping | Add the country to the right branch, or normalize the field before the Switch |
| Round robin returns no rep | The matched pool is empty or all users are out of seat | Populate every territory-and-tier pool with at least one active user |
| Slack step fails | Slack integration disconnected or channel removed | Reconnect Slack and reselect the destination |
| Owner gets overwritten on existing leads | Filter doesn't exclude records that already have an owner | Add `owner is empty` to the Step 2 Filter |

## Variations

### Route by ICP score instead of seniority

Replace the seniority [Switch](/reference/conditions/switch/) with one that reads an `icp_score` attribute: branch high scores to your senior pool and the rest to standard. Everything downstream stays the same.

### Email the owner instead of Slack

Swap the [Slack](/reference/integrations/) block for a [Send HTTP request](/reference/utilities/send-http-request/) to your email provider, or enroll the rep in a notification via [Enroll in sequence](/reference/sequences/enroll-in-sequence/). Both are 1-credit writes, so the per-lead cost is unchanged.

## See also

- [Round-robin lead routing](/guides/route-and-sequence/round-robin-routing/)
- [Conditions and filters](/explanation/conditions-and-filters/)
- [Switch](/reference/conditions/switch/)
- [Round robin](/reference/workspace/round-robin/)
- [Attio: Workflows](https://attio.com/help/apps/other-apps/workflows)
