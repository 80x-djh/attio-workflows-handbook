---
title: Funding-signal outbound that beats competitors to a fresh raise
description: When a target account raises funding, parse the signal, gate a read-only Web agent behind an ICP Filter, research a funding-aware angle, and enroll contacts.
page-type: recipe
---

When a target account closes a round, you have a short window before every other vendor floods their inbox — so you want a non-generic, funding-aware first touch out the door fast. This recipe fires on [Webhook received](/reference/triggers/webhook-received/) from your funding-signal source, reads the event with [Parse JSON](/reference/utilities/parse-json/), gates an expensive read-only [Web agent](/reference/agents/web-agent/) behind a free [Filter](/reference/conditions/filter/) so only ICP-fit raises get researched, pulls the right contacts with [Find records](/reference/records/find-records/), saves the angle with [Update record](/reference/records/update-record/), kicks off the tailored sequence with [Enroll in sequence](/reference/sequences/enroll-in-sequence/), and pings the account owner over [Slack](/reference/integrations/).

| Field | Value |
| --- | --- |
| Difficulty | Advanced |
| Time to build | ~25 min |
| Trigger | [Webhook received](/reference/triggers/webhook-received/) (funding-signal source) |
| Blocks used | [Parse JSON](/reference/utilities/parse-json/), [Filter](/reference/conditions/filter/), [Find records](/reference/records/find-records/), [Web agent](/reference/agents/web-agent/), [Update record](/reference/records/update-record/), [Enroll in sequence](/reference/sequences/enroll-in-sequence/), [Slack](/reference/integrations/) |
| Credit cost per run | Variable — Web agent is token-based; writes are 1 credit each. See [Credits and pricing](/reference/credits-and-pricing/) |
| Plan required | Pro recommended |

## Prerequisites

- An Attio plan that includes agent and AI blocks. Pro is recommended for the volume this recipe assumes. Check current availability on [Credits and pricing](/reference/credits-and-pricing/).
- A funding-signal source (for example, a data provider or your own enrichment job) that can POST a JSON event to an Attio webhook when a company raises a round.
- The Slack integration connected to your workspace, with the workflow authorized to post to your account-owner channel.
- An existing sequence (for example, "Funding congrats — outbound") with a first email whose opening line accepts a variable for the tailored angle.
- On the Companies object: a long-text attribute for the funding angle (slug `funding_angle`), attributes for the round details (slugs `last_round_stage` and `last_round_amount`), and an owner attribute (slug `owner`).
- A read-only "Run as" identity for the Web agent so it can read records and the public web but cannot write. See [Permissions and access](/explanation/permissions-and-access/).

## How it works

The webhook delivers the raw funding event. Parse JSON turns that payload into usable variables, and a free Filter checks the raised company against your ICP threshold — stopping the run when it doesn't qualify, so the token-priced Web agent never researches a raise you'd never sell into. Qualified accounts go to Find records, which pulls the people you actually want to email; the Web agent reads the company and the round read-only and returns one funding-aware outreach angle; Update record saves that angle; Enroll in sequence starts the tailored outbound; and a Slack message tells the owner to get ahead of the competition.

1. [Webhook received](/reference/triggers/webhook-received/) — a funding-signal source POSTs a round event.
2. [Parse JSON](/reference/utilities/parse-json/) — extract company, stage, and amount from the payload (free).
3. [Filter](/reference/conditions/filter/) — continue only when the company meets the ICP threshold (free; stops the run otherwise).
4. [Find records](/reference/records/find-records/) — pull the target contacts at the account (free).
5. [Web agent](/reference/agents/web-agent/) — research one funding-aware angle, read-only.
6. [Update record](/reference/records/update-record/) — save the angle and round details to the company.
7. [Enroll in sequence](/reference/sequences/enroll-in-sequence/) — start the tailored outbound with the angle as the first line.
8. [Slack](/reference/integrations/) — notify the account owner.

## Build steps

### Step 1 — Add the webhook trigger

Create a new workflow. Click **Add trigger**, choose [Webhook received](/reference/triggers/webhook-received/), and copy the generated endpoint URL into your funding-signal source so it POSTs there on each round. Send one test event so Attio can capture a sample payload to map against.

| Field | Value |
| --- | --- |
| Trigger | Webhook received |
| Source | Funding-signal provider |
| Sample payload | `{ "company": "Acme Robotics", "domain": "acme.com", "stage": "Series B", "amount_usd": 40000000 }` |

### Step 2 — Parse the funding event

Add a [Parse JSON](/reference/utilities/parse-json/) block immediately after the trigger to turn the webhook body into named variables. This is free.

| Field | Value |
| --- | --- |
| Block | Parse JSON |
| Input | `{{ trigger.body }}` |
| Maps `company` | → `event.company` |
| Maps `domain` | → `event.domain` (`acme.com`) |
| Maps `stage` | → `event.stage` (`Series B`) |
| Maps `amount_usd` | → `event.amount` (`40000000`) |

### Step 3 — Gate the agent with an ICP Filter

Add a [Filter](/reference/conditions/filter/) after Parse JSON. This is the cost guard: it's free and it stops every below-threshold run before the Web agent can spend a token. Don't research every funding event — filter to ICP first.

| Field | Value |
| --- | --- |
| Block | Filter |
| Condition 1 | `event.domain` is not empty |
| Condition 2 | `event.stage` is one of Seed, Series A, Series B |
| Condition 3 | `event.amount` is greater than 5000000 |
| Condition 4 | matched company `region` is one of EMEA, North America |
| Match | All conditions |

### Step 4 — Find the contacts at the account

Add a [Find records](/reference/records/find-records/) block to pull the people you'll actually enroll. This is free.

| Field | Value |
| --- | --- |
| Block | Find records |
| Object | People |
| Filter | `company.domain` equals `{{ event.domain }}` and `title` contains one of VP, Head, Director |
| Return | Up to 3 contacts |

### Step 5 — Research the angle with a read-only Web agent

Add a [Web agent](/reference/agents/web-agent/) after Find records. Set its **Run as** identity to your read-only research user so it can read the record and the public web but cannot write back. Keep the prompt to one tightly scoped output: a funding-aware angle, not generic research.

| Field | Value |
| --- | --- |
| Block | Web agent |
| Run as | Research (read-only) |
| Input | `acme.com` (from `event.domain`), `Series B`, `$40M` |
| Output | `funding_angle` |

Use a prompt that forces a verifiable, funding-specific opening line:

```text
This company just raised a {{ event.stage }} round of {{ event.amount }}.
Return one concise outreach angle (under 40 words) that ties our product to
what a company typically does with this stage of capital. Reference a real,
verifiable detail about the company. If you cannot verify a detail, say so and
keep the angle generic to the round stage.
```

### Step 6 — Save the angle

Add an [Update record](/reference/records/update-record/) to write the angle and round details to the company. The Web agent does not save anything on its own.

| Field | Value |
| --- | --- |
| Block | Update record |
| Record | Matched company |
| `funding_angle` | `{{ web_agent.funding_angle }}` |
| `last_round_stage` | `{{ event.stage }}` |
| `last_round_amount` | `{{ event.amount }}` |

### Step 7 — Enroll the contacts with the tailored first line

Add an [Enroll in sequence](/reference/sequences/enroll-in-sequence/) block. Loop over the contacts Find records returned and enroll each into the funding sequence, passing the angle as the first-line variable.

| Field | Value |
| --- | --- |
| Block | Enroll in sequence |
| Sequence | Funding congrats — outbound |
| Enroll | `{{ find_records.results }}` (Priya Sharma, plus up to 2 more) |
| First-line variable | `{{ web_agent.funding_angle }}` |

### Step 8 — Notify the owner over Slack

Add a [Slack](/reference/integrations/) block so the account owner knows to move now.

| Field | Value |
| --- | --- |
| Block | Slack |
| Channel or user | `owner` |
| Message | {{ event.company }} just raised {{ event.stage }} ({{ event.amount }}). Tailored outbound enrolled. Angle: {{ web_agent.funding_angle }}. Get ahead of it. |

## Variable mapping

| Variable | Source block | Field | Example value |
| --- | --- | --- | --- |
| `event.company` | Parse JSON | `company` | Acme Robotics |
| `event.domain` | Parse JSON | `domain` | `acme.com` |
| `event.stage` | Parse JSON | `stage` | Series B |
| `event.amount` | Parse JSON | `amount_usd` | $40M |
| `find_records.results` | Find records | People at account | Priya Sharma, +2 |
| `web_agent.funding_angle` | Web agent | Angle output | "Fresh Series B usually means scaling ops headcount — our routing cuts onboarding time as you ramp." |
| `owner` | Matched company | `owner` | Priya Sharma |

## Credit cost worked example

Assume 300 funding events hit the webhook per month, and the ICP Filter passes ~20% of them (60 accounts). Parse JSON, the Filter, and Find records are free [logic and lookup blocks](/reference/credits-and-pricing/). The token-based cost is the Web agent; the fixed-rate cost is the writes.

- **Parse JSON** — free, runs on all 300 events.
- **Filter** — free, runs on all 300 events.
- **Find records** — free, runs only on the ~60 accounts that pass the Filter.
- **Web agent** — variable, token-based; runs only on the ~60 ICP-fit accounts. Don't assume a fixed number: sample ~10 representative raises, run them, and read the actual per-run credit cost in the run viewer before you scale. Gating with the Filter is what keeps this line from running on all 300 events.
- **Update record** — 1 credit each, ~60 runs.
- **Enroll in sequence** — 1 credit each, ~60 runs (one enroll call per contact if you enroll individually).
- **Slack** — 1 credit each, ~60 runs.

So the fixed-rate floor is roughly 60 Update writes plus the enroll and Slack calls per qualified account; the variable ceiling is the Web agent total you measure in the run viewer. Compare that monthly total against your plan allowance on [Credits and pricing](/reference/credits-and-pricing/).

## Test plan

1. POST a real ICP-fit funding event to the webhook endpoint — for example, a $40M Series B at a 200-person EMEA company with a populated `domain`.
2. Open the run in run history and confirm **Parse JSON** extracted `company`, `domain`, `stage`, and `amount`.
3. Confirm the **Filter** passed. Expect a green continue.
4. Confirm **Find records** returned the expected contacts at the account.
5. Confirm the **Web agent** returned a funding-aware angle keyed to the round, and that its Run as identity is read-only.
6. Confirm **Update record** wrote `funding_angle`, `last_round_stage`, and `last_round_amount`; **Enroll in sequence** enrolled the contacts with the angle as the first line; and **Slack** posted to the owner.
7. Now POST a deliberately failing input: an event with an empty `domain` and `amount_usd` of 250000. Expect the **Filter** to stop the run before the Web agent — verify in run history that no agent, enroll, or write block executed and no tokens were spent.

## Failure modes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Credit spend far higher than expected | Web agent running on every funding event | Tighten the Filter and confirm it sits before the Web agent; re-sample 10 runs in the run viewer. |
| Variables come through empty | Parse JSON mapping doesn't match the payload keys | Re-send a sample event and re-map fields to the actual JSON keys. |
| Angle is blank in Attio | No Update record after the agent | Agent output isn't saved automatically; add Update record mapping `{{ web_agent.funding_angle }}` into `funding_angle`. |
| Agent attempts to write or errors on permissions | Run as identity has write access or is wrong | Set the Web agent's Run as to a read-only research user. |
| No contacts enrolled | Find records returned nothing for the account | Loosen the People filter (title or domain match) and confirm the account has people linked. |
| Owner never pinged | `owner` attribute unset on the company | Backfill the owner attribute, or fall back to a shared channel in the Slack block. |
| Webhook events never trigger | Endpoint URL or payload not configured at the source | Re-copy the endpoint into the provider and POST one test event to capture the sample payload. |

## Variations

### Job-change signal instead of funding

Point the [Webhook received](/reference/triggers/webhook-received/) trigger at a job-change source instead, and have [Parse JSON](/reference/utilities/parse-json/) extract the person's new title and company. Filter to ICP companies and seniority, then have the [Web agent](/reference/agents/web-agent/) write an angle about the new role rather than the round. Everything downstream — Update record, Enroll in sequence, and Slack — stays the same; only the signal and the angle prompt change.

### Summarize instead of Web agent for a cheaper tier

For high volume or smaller raises where public-web research isn't worth the cost, replace the [Web agent](/reference/agents/web-agent/) with [Summarize record](/reference/ai/summarize-record/). It's still token-based but works only from data already in Attio — no web browsing — so it's cheaper per run. Keep Parse JSON, the Filter, Find records, and the routing unchanged; only the research block changes.

## See also

- [AI ICP-fit research and routing](/guides/signals-and-ai/inbound-lead-research/)
- [Permissions and access](/explanation/permissions-and-access/)
- [Web agent](/reference/agents/web-agent/)
- [Enroll in sequence](/reference/sequences/enroll-in-sequence/)
- [Credits and pricing](/reference/credits-and-pricing/)
