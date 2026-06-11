---
title: Enroll and auto-exit sequences
description: Enroll a lead in an Attio sequence the moment they qualify, then auto-exit them the moment they reply or book — so you never double-touch.
page-type: recipe
---

When a lead's status flips to Qualified, you want them in an outbound sequence within seconds — and you want them out of that sequence the instant they reply or book a meeting, so a sales rep and an automated touch never land on the same person in the same hour. This is a paired build: Workflow A fires on [Attribute value changed](/reference/triggers/attribute-value-changed/), runs a free [Filter](/reference/conditions/filter/), and calls [Enroll in sequence](/reference/sequences/enroll-in-sequence/); Workflow B fires on the reply or meeting-booked signal and calls [Exit from sequence](/reference/sequences/exit-from-sequence/) plus [Update record](/reference/records/update-record/). Build both, or you double-touch.

| Field | Value |
| --- | --- |
| Difficulty | Intermediate |
| Time to build | ~12 minutes |
| Trigger | [Attribute value changed](/reference/triggers/attribute-value-changed/) (Workflow A); reply / meeting-booked / stage change (Workflow B) |
| Blocks used | [Filter](/reference/conditions/filter/), [Enroll in sequence](/reference/sequences/enroll-in-sequence/), [Exit from sequence](/reference/sequences/exit-from-sequence/), [Update record](/reference/records/update-record/) |
| Credit cost per run | 1 credit per enrollment, 1 credit per exit, plus 1 credit for the stamp update — see the worked example |
| Plan required | Plus or higher |

## Prerequisites

- An Attio plan of **Plus** or higher (sequences are gated below Plus).
- A connected mailbox so sequences can send. Workflow logic does not send mail on its own.
- A **People** object with a single-select **Status** attribute that includes the value `Qualified`, plus an **Email** attribute and an opt-out boolean such as `Unsubscribed`.
- At least one published sequence — this recipe uses one named **EMEA outbound** — and a configured sender or sender pool.
- A `Sequence enrolled at` date attribute and a `Sequence exit reason` text attribute on People, so you can stamp state.
- Workflow edit access. No API keys or scopes are needed; both workflows run inside Attio.

## How it works

Two workflows share one piece of state: whether a person is currently in the sequence. Workflow A enrolls qualified leads who have a valid email and have not opted out. Workflow B watches for any signal that the conversation went human — a reply, a booked meeting, or a manual stage change — and exits the person from the sequence before the next step can send. Because [Filter](/reference/conditions/filter/) and the trigger are free, you only pay when a write actually happens.

Workflow A, in execution order:

1. [Attribute value changed](/reference/triggers/attribute-value-changed/) — fires when `Status` changes.
2. [Filter](/reference/conditions/filter/) — continue only if the new value is `Qualified`, email is present, and `Unsubscribed` is not true.
3. [Enroll in sequence](/reference/sequences/enroll-in-sequence/) — add the person to **EMEA outbound**.
4. [Update record](/reference/records/update-record/) — stamp `Sequence enrolled at`.

Workflow B, in execution order:

1. [Attribute value changed](/reference/triggers/attribute-value-changed/) — fires when `Status` changes to `Replied`, `Meeting booked`, or `Closed`.
2. [Filter](/reference/conditions/filter/) — continue only if `Sequence enrolled at` is set (the person is actually in a sequence).
3. [Exit from sequence](/reference/sequences/exit-from-sequence/) — remove the person from **EMEA outbound**.
4. [Update record](/reference/records/update-record/) — stamp `Sequence exit reason`.

## Build steps

### Step 1 — Add the enrollment trigger (Workflow A)

Create a new workflow named **Enroll on qualify**. Add the [Attribute value changed](/reference/triggers/attribute-value-changed/) trigger and point it at the People status attribute.

| Field | Value |
| --- | --- |
| Object | People |
| Attribute | Status |
| Trigger on | Any change |

### Step 2 — Gate enrollment with a free filter

Add a [Filter](/reference/conditions/filter/) block. This is where you stop unqualified, unreachable, and opted-out records before they cost a credit.

| Field | Value |
| --- | --- |
| Condition 1 | `Status` is `Qualified` |
| Condition 2 | `Email` is not empty |
| Condition 3 | `Unsubscribed` is not true |
| Match | All conditions |

### Step 3 — Enroll the person

Add the [Enroll in sequence](/reference/sequences/enroll-in-sequence/) block. The recipient must be a **person** record — if your trigger object were a deal, you'd map through the relationship attribute that points to the person.

| Field | Value |
| --- | --- |
| Sequence | EMEA outbound |
| Recipient | `{{trigger.record}}` (Priya Sharma, priya@acme.com) |
| Sender | Record owner, falling back to a fixed sender |

### Step 4 — Stamp the enrollment time

Add an [Update record](/reference/records/update-record/) block so Workflow B can tell who is actually enrolled.

| Field | Value |
| --- | --- |
| Record | `{{trigger.record}}` |
| Attribute | `Sequence enrolled at` |
| Value | `{{run.started_at}}` |

### Step 5 — Add the exit trigger (Workflow B)

Create a second workflow named **Exit on reply or booking**. Add the [Attribute value changed](/reference/triggers/attribute-value-changed/) trigger on the same status attribute. This is the half people skip — without it, a lead who replies keeps getting sequence steps.

| Field | Value |
| --- | --- |
| Object | People |
| Attribute | Status |
| Trigger on | Changed to `Replied`, `Meeting booked`, or `Closed` |

### Step 6 — Filter to enrolled records only

Add a [Filter](/reference/conditions/filter/) so you only attempt an exit for people who are actually in the sequence.

| Field | Value |
| --- | --- |
| Condition | `Sequence enrolled at` is not empty |
| Match | All conditions |

### Step 7 — Exit and stamp the reason

Add the [Exit from sequence](/reference/sequences/exit-from-sequence/) block, then an [Update record](/reference/records/update-record/) block to record why.

| Field | Value |
| --- | --- |
| Sequence | EMEA outbound |
| Recipient | `{{trigger.record}}` |
| Update attribute | `Sequence exit reason` |
| Update value | `{{trigger.attribute.new_value}}` (e.g., `Replied`) |

## Variable mapping

| Variable | Source block | Field | Example value |
| --- | --- | --- | --- |
| `{{trigger.record}}` | Attribute value changed | Triggering record | Priya Sharma (priya@acme.com) |
| `{{trigger.attribute.new_value}}` | Attribute value changed | New status value | `Qualified` |
| `{{trigger.attribute.old_value}}` | Attribute value changed | Previous status value | `Working` |
| `{{run.started_at}}` | Run context | Workflow start timestamp | `2026-06-11T09:14:00Z` |
| `{{enroll.status}}` | Enroll in sequence | Enrollment result | `enrolled` |

## Credit cost worked example

The trigger and every [Filter](/reference/conditions/filter/) are **free**. You pay for the writes.

Workflow A per qualifying lead: 1 credit for [Enroll in sequence](/reference/sequences/enroll-in-sequence/) + 1 credit for the [Update record](/reference/records/update-record/) stamp = **2 credits**.

Workflow B per lead who replies or books: 1 credit for [Exit from sequence](/reference/sequences/exit-from-sequence/) + 1 credit for the stamp = **2 credits**.

At a realistic 400 newly qualified leads a month, where 35% reply or book (140 exits):

- Enrollments: 400 × 2 = 800 credits.
- Exits: 140 × 2 = 280 credits.
- Monthly total: **1,080 credits.**

Leads filtered out — wrong status, missing email, unsubscribed — cost nothing, because a [Filter](/reference/conditions/filter/) that stops a run is free. For how this total compares against your plan's monthly allowance, see [Credits and pricing](/reference/credits-and-pricing/); allowances are documented only there.

## Test plan

1. In your own workspace, open a test person — Priya Sharma, priya@acme.com — and confirm `Status` is `Working` and `Sequence enrolled at` is empty.
2. Change `Status` to `Qualified`. Workflow A should fire. In run history, expect the [Filter](/reference/conditions/filter/) to pass, [Enroll in sequence](/reference/sequences/enroll-in-sequence/) to return `enrolled`, and [Update record](/reference/records/update-record/) to write a timestamp to `Sequence enrolled at`.
3. Open run history under the **Runs** tab of Workflow A and confirm two writes are logged (enroll + stamp) and no errors.
4. Now exercise the exit path explicitly. Change the same person's `Status` to `Replied`. Workflow B should fire, the [Filter](/reference/conditions/filter/) should pass because `Sequence enrolled at` is set, [Exit from sequence](/reference/sequences/exit-from-sequence/) should remove them, and `Sequence exit reason` should read `Replied`.
5. Confirm in the sequence's own enrollment view that Priya is no longer active — this is the proof you won't double-touch.
6. **Deliberately failing input:** set a second test person to `Qualified` but leave `Email` empty. Workflow A should fire, the [Filter](/reference/conditions/filter/) should **stop** the run, and run history should show zero writes and zero credits consumed. If you instead see an enrollment error, your filter is mis-ordered.

## Failure modes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Lead enrolled but keeps getting steps after replying | Workflow B was never built, or its trigger doesn't cover the reply status | Build the paired exit; add every "conversation went human" status to the exit trigger. |
| Enroll step errors with an invalid-recipient message | Recipient is a company, list entry, or raw email string, not a person record | Map the recipient through the relationship attribute that resolves to a person. |
| Exit runs but person stays in the sequence view | Exit targeted a different sequence than the one they were enrolled in | Pin both workflows to the exact same sequence, here **EMEA outbound**. |
| Re-qualified leads enroll twice | `Status` cycles back to `Qualified` after an exit and Workflow A fires again | Add a filter condition that `Sequence enrolled at` is empty before re-enrolling. |
| Opted-out contacts still enrolled | Suppression field isn't in the filter, or consent is computed elsewhere | Keep opt-out, region, and role in the data model and filter on them before [Enroll in sequence](/reference/sequences/enroll-in-sequence/). |

## Variations

### Exit on meeting booked from your calendar tool

If meetings come from an external scheduler, don't wait for a status edit. Swap Workflow B's trigger for [Webhook received](/reference/triggers/webhook-received/) fed by the calendar tool, then keep the same [Filter](/reference/conditions/filter/) → [Exit from sequence](/reference/sequences/exit-from-sequence/) → [Update record](/reference/records/update-record/) chain. Only the trigger changes.

### Pause instead of exit

If you want to resume the sequence later — for example, after a no-show — don't exit. Set a `Sequence paused` boolean with [Update record](/reference/records/update-record/) and let your sequence's own send conditions skip paused people, then clear the flag to resume. Exit is permanent for that enrollment; pausing is recoverable but keeps the credit cost identical (one write either way).

## See also

- [Round-robin lead routing](/guides/route-and-sequence/round-robin-routing/)
- [Conditions and filters](/explanation/conditions-and-filters/)
- [Enroll in sequence](/reference/sequences/enroll-in-sequence/)
- [Exit from sequence](/reference/sequences/exit-from-sequence/)
- [Sequences in Attio](https://attio.com/help/apps/sequences)
