---
title: Dedupe on create
description: Catch duplicate companies and people the instant a record is created by matching on a reliable key and flagging collisions for review.
page-type: recipe
---

Catch duplicate companies and people the instant a record is created by matching on a reliable key and flagging collisions for review, instead of running a quarterly cleanup that never quite happens. This build fires on [Record created](/reference/triggers/record-created/), uses [Find records](/reference/records/find-records/) to look up an existing match on a unique key, and — when one exists — consolidates data with [Update record](/reference/records/update-record/), drops the new record onto a "Possible duplicate" review list with [Add record to list](/reference/lists/add-record-to-list/), and posts a [Slack](/reference/integrations) heads-up so a human decides what to merge.

| Field | Value |
| --- | --- |
| Difficulty | Advanced |
| Time to build | ~20 min |
| Trigger | [Record created](/reference/triggers/record-created/) (People or Companies) |
| Blocks used | [Find records](/reference/records/find-records/), [If](/reference/conditions/if/), [Update record](/reference/records/update-record/), [Add record to list](/reference/lists/add-record-to-list/), [Slack](/reference/integrations) |
| Credit cost per run | 0 when no match; up to 3 when a match is found, consolidated, and posted to Slack |
| Plan required | Plus and above |

## Prerequisites

- **Plan:** Plus or higher (the new Workflows engine).
- **Integrations:** Slack connected to the workspace, with a channel like `#crm-hygiene` the workflow can post to.
- **Objects and attributes:** the Companies object with a populated `Domain` attribute, or the People object with a populated `Email` attribute — whichever you're deduping. The chosen key must be the field people actually fill in, not an optional one.
- **A review list:** a list named "Possible duplicate" on the same object, with at least a `Matched record` reference attribute and a `Reviewed?` checkbox so a human can clear entries.
- **Scopes:** the workflow runs with the workspace's automation identity; confirm under [Permissions and access](/explanation/permissions-and-access/) that it can read the object and write to the list.

## How it works

A new record is the cheapest moment to catch a duplicate, because nothing downstream has attached to it yet — no notes, no tasks, no sequence enrollments to reconcile later. The workflow reads the new record's dedup key, searches the object for any other record carrying the same key, and branches: if a match exists, it consolidates the obviously-safe fields onto the older record and flags the new one for human review; if not, the run ends free. It never auto-merges, because a single key collision can still be two different real-world entities.

Execution order:

1. [Record created](/reference/triggers/record-created/) — fires on a new Company or Person.
2. [Find records](/reference/records/find-records/) — search the same object for the matching key, excluding the new record's own ID.
3. [If](/reference/conditions/if/) — does Find return at least one record?
4. **Match branch:** [Update record](/reference/records/update-record/) consolidates fields onto the existing record → [Add record to list](/reference/lists/add-record-to-list/) flags the new record for review → [Slack](/reference/integrations) posts a heads-up.
5. **No-match branch:** the [If](/reference/conditions/if/) condition stops the run for free.

## Build steps

### Step 1 — Add the trigger

Create a new workflow and add the [Record created](/reference/triggers/record-created/) trigger. Scope it to a single object — run one copy for Companies and a separate copy for People, because the dedup key differs.

| Field | Value |
| --- | --- |
| Trigger | Record created |
| Object | Companies |
| Run as | CRM Automation (workspace bot identity) |

### Step 2 — Find a record with the same key

Add a [Find records](/reference/records/find-records/) block. Search the same object for any record whose key equals the new record's key, and exclude the new record itself so a record never matches on its own value.

| Field | Value |
| --- | --- |
| Object | Companies |
| Filter — Domain | is `{{trigger.record.Domain}}` |
| Filter — Record ID | is not `{{trigger.record.id}}` |
| Sort | Created at, ascending (oldest first) |
| Limit | 5 |

For People, set the filter to `Email is {{trigger.record.Email}}`. Use one exact, normalized key — `acme.com`, not a partial name match. See [Records vs list entries](/explanation/records-vs-list-entries/) for why object-level Find is the right scope here.

### Step 3 — Branch on whether a match exists

Add an [If](/reference/conditions/if/) condition that checks whether Find returned anything. When the count is zero, the condition stops the run, and that's free.

| Field | Value |
| --- | --- |
| Condition | `{{step2.records.count}}` is greater than `0` |
| If true | continue to Step 4 |
| If false | stop run |

### Step 4 — Consolidate safe fields onto the existing record

On the true branch, add an [Update record](/reference/records/update-record/) block targeting the oldest match — the first record Find returned. Only copy fields that are unambiguously additive: fill blanks on the existing record from the new one. Never overwrite a populated field, and never delete the new record automatically.

| Field | Value |
| --- | --- |
| Record to update | `{{step2.records.first.id}}` |
| Description | keep existing if set, else `{{trigger.record.Description}}` |
| LinkedIn | keep existing if set, else `{{trigger.record.LinkedIn}}` |
| Owner | leave unchanged |

### Step 5 — Flag the new record for human review

Add an [Add record to list](/reference/lists/add-record-to-list/) block that puts the *new* record onto the "Possible duplicate" list with a pointer to its match. This is the safety valve: a person, not the workflow, decides the merge.

| Field | Value |
| --- | --- |
| List | Possible duplicate |
| Record to add | `{{trigger.record.id}}` |
| Matched record | `{{step2.records.first.id}}` |
| Reviewed? | `No` |

### Step 6 — Post a Slack heads-up

Add a [Slack](/reference/integrations) block so the data owner sees the collision in real time rather than discovering it in a report.

| Field | Value |
| --- | --- |
| Channel | `#crm-hygiene` |
| Message | `Possible duplicate: "{{trigger.record.Name}}" ({{trigger.record.Domain}}) matches an existing record. Added to the review list — please confirm before merging. Owner: Priya Sharma` |

## Variable mapping

| Variable | Source block | Field | Example value |
| --- | --- | --- | --- |
| New record key | [Record created](/reference/triggers/record-created/) | `trigger.record.Domain` | `acme.com` |
| New record ID | [Record created](/reference/triggers/record-created/) | `trigger.record.id` | `rec_8f2a…` |
| New record name | [Record created](/reference/triggers/record-created/) | `trigger.record.Name` | `Acme Corp` |
| Match count | [Find records](/reference/records/find-records/) | `step2.records.count` | `1` |
| Matched record ID | [Find records](/reference/records/find-records/) | `step2.records.first.id` | `rec_1b90…` |
| Owner notified | [Slack](/reference/integrations) | message body | `Priya Sharma` |

For People runs, the key variable is `trigger.record.Email` (example `jane@acme.com`). See [Variables](/explanation/variables/) for the full reference syntax.

## Credit cost worked example

Per run, the [Record created](/reference/triggers/record-created/) trigger, [Find records](/reference/records/find-records/) lookup, and [If](/reference/conditions/if/) condition are all free — a condition that stops the run costs nothing. Only the two writes cost credits:

- [Update record](/reference/records/update-record/): 1 credit
- [Add record to list](/reference/lists/add-record-to-list/): 1 credit
- [Slack](/reference/integrations): 1 credit

So a clean create (no match) costs **0 credits**, and a flagged duplicate costs **3 credits** if you keep the Slack step, or **2 credits** if you drop it.

Say you create 800 companies a month and roughly 4% collide on domain — 32 flagged duplicates. That's `32 × 3 = 96 credits/month`, with the other 768 creates costing nothing. Compare that monthly total against your plan's included allowance on [Credits and pricing](/reference/credits-and-pricing/). This build adds no AI block, so there's no variable token-based cost to estimate; if you later add a [Classify record](/reference/ai/classify-record/) step to score fuzzy matches, gate it behind the [If](/reference/conditions/if/) so it only runs on collisions, then sample ~10 records and read the per-run cost in the run viewer rather than assuming a fixed number.

## Test plan

1. **Create a known duplicate.** With the workflow live, create a new company `Acme Corp` with domain `acme.com` when one already exists. This fires [Record created](/reference/triggers/record-created/).
2. **Check Find.** In run history, open the [Find records](/reference/records/find-records/) step and confirm it returned exactly the older `acme.com` record and excluded the new one. `step2.records.count` should be `1`.
3. **Check the branch.** The [If](/reference/conditions/if/) condition should resolve true and continue.
4. **Check the writes.** Confirm [Update record](/reference/records/update-record/) only filled blank fields on the older record, [Add record to list](/reference/lists/add-record-to-list/) added the new record to "Possible duplicate" with the match pointer, and [Slack](/reference/integrations) posted to `#crm-hygiene`.
5. **Deliberately failing input.** Now create `Globex Inc` with domain `globex.io` — a domain nothing else uses. The run should reach [If](/reference/conditions/if/), resolve false, and stop. In run history the run shows `0 credits` and no writes. If it still flags something, your Find filter isn't using a unique key.
6. **Where to look.** Open [Runs and debugging](/explanation/runs-and-debugging/) to inspect each step's inputs, outputs, and credit usage for both runs.

## Failure modes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Every new record flags itself | Find filter doesn't exclude the trigger record | Add `Record ID is not {{trigger.record.id}}` to the [Find records](/reference/records/find-records/) filter. |
| Real distinct companies get consolidated | Key isn't actually unique (e.g., matching on name) | Switch to a unique key — `Domain` for companies, `Email` for people — and normalize case and whitespace. |
| Existing data gets clobbered | [Update record](/reference/records/update-record/) overwrites populated fields | Only fill blanks; keep the existing value when it's set. Never auto-delete the new record. |
| Workflow loops on its own update | Update triggers another create-style chain | This trigger fires on create, not update, so it won't re-fire here; if you add an update-based variant, review [Infinite loops and safety](/explanation/infinite-loops-and-safety/). |
| Missing flags despite obvious dupes | Records share a real-world entity but not the exact key (typo domain) | Accept that exact-key dedup misses fuzzy cases; add a separate review pass — don't loosen the key into false positives. |
| Slack step fails | Channel renamed or bot removed | Reconnect Slack and reselect `#crm-hygiene` in the [Slack](/reference/integrations) block. |

## Variations

### People by email vs companies by domain

Run two copies of this workflow. For People, scope the [Record created](/reference/triggers/record-created/) trigger to People and set the [Find records](/reference/records/find-records/) filter to `Email is {{trigger.record.Email}}`. Everything else — the [If](/reference/conditions/if/), the flag, the Slack post — stays the same. Don't try to handle both objects in one workflow; the keys and consolidation fields differ.

### Flag-only, no consolidation

If your team doesn't trust any automated field copying, delete Step 4. Keep [Find records](/reference/records/find-records/), the [If](/reference/conditions/if/), [Add record to list](/reference/lists/add-record-to-list/), and the [Slack](/reference/integrations) heads-up. This drops the per-flag cost to 2 credits and leaves every merge decision to a human reviewing the "Possible duplicate" list.

## See also

- [Stale deal sweep](/guides/pipeline-hygiene/stale-deal-sweep/)
- [Records vs list entries](/explanation/records-vs-list-entries/)
- [Find records](/reference/records/find-records/)
- [Add record to list](/reference/lists/add-record-to-list/)
- [Merge duplicate records](https://attio.com/help/apps/other-apps/merging-records)
