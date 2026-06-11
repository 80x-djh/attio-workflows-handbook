---
title: AI ICP-fit research and routing
description: Score high-intent inbound against your ICP with a read-only Web agent, save the research, classify into fit bands, and route only qualified leads.
page-type: recipe
---

When a high-intent inbound lead lands in your funnel, you want it researched, scored against your ideal customer profile (ICP), and routed to the right rep — but only when it's worth the spend. This recipe fires on [Record added to list](/reference/triggers/record-added-to-list/), gates the expensive [Web agent](/reference/agents/web-agent/) behind a free [Filter](/reference/conditions/filter/) so it researches only ICP-threshold companies, classifies the result into A/B/C fit bands with [Classify record](/reference/ai/classify-record/), branches on the band with [Switch](/reference/conditions/switch/), saves the research with [Update record](/reference/records/update-record/), assigns qualified leads with [Round robin](/reference/workspace/round-robin/), and pings the owner over [Slack](/reference/integrations/).

| Field | Value |
| --- | --- |
| Difficulty | Advanced |
| Time to build | ~25 min |
| Trigger | [Record added to list](/reference/triggers/record-added-to-list/) (or [Webhook received](/reference/triggers/webhook-received/)) |
| Blocks used | [Filter](/reference/conditions/filter/), [Web agent](/reference/agents/web-agent/), [Classify record](/reference/ai/classify-record/), [Switch](/reference/conditions/switch/), [Update record](/reference/records/update-record/), [Round robin](/reference/workspace/round-robin/), [Slack](/reference/integrations/) |
| Credit cost per run | Variable — Web agent is token-based; writes are 1 credit each. See [Credits and pricing](/reference/credits-and-pricing/) |
| Plan required | Pro recommended |

## Prerequisites

- An Attio plan that includes agent and AI blocks. Pro is recommended for the volume this recipe assumes. Check current availability on [Credits and pricing](/reference/credits-and-pricing/).
- The Slack integration connected to your workspace, with the workflow authorized to post to your routing channel.
- A list for high-intent inbound (for example, "Inbound — high intent") that leads are added to by a form, a product event, or a routing rule.
- On the Companies object: a long-text attribute for the research summary (slug `icp_research`), a single-select attribute for the fit band (slug `fit_band`, options `A`, `B`, `C`), and an owner attribute (slug `owner`).
- A read-only "Run as" identity for the Web agent so it can read records and the web but cannot write. See [Permissions and access](/explanation/permissions-and-access/).

## How it works

The trigger fires the moment a lead enters the high-intent list. A free Filter checks the lead against your ICP threshold and stops the run when it doesn't qualify, so the token-priced Web agent never touches raw, low-fit traffic. Qualified companies go to the Web agent, which answers two to four specific qualification questions read-only. Classify record turns that research into an A, B, or C fit band; a Switch branches on the band; Update record saves the summary; Round robin assigns an owner; and a Slack message notifies that owner.

1. [Record added to list](/reference/triggers/record-added-to-list/) — a high-intent lead enters the list.
2. [Filter](/reference/conditions/filter/) — continue only when the lead meets the ICP threshold (free; stops the run otherwise).
3. [Web agent](/reference/agents/web-agent/) — research the company read-only against two to four qualification questions.
4. [Classify record](/reference/ai/classify-record/) — assign an A/B/C fit band from the research.
5. [Switch](/reference/conditions/switch/) — branch on the fit band.
6. [Update record](/reference/records/update-record/) — save the research summary and fit band to the company.
7. [Round robin](/reference/workspace/round-robin/) — assign an owner to A and B leads only.
8. [Slack](/reference/integrations/) — notify the assigned owner.

## Build steps

### Step 1 — Add the trigger

Create a new workflow. Click **Add trigger**, choose [Record added to list](/reference/triggers/record-added-to-list/), and select your high-intent inbound list. If your leads arrive from an external form or product event instead, use [Webhook received](/reference/triggers/webhook-received/) and map the payload to a company record first.

| Field | Value |
| --- | --- |
| Trigger | Record added to list |
| List | Inbound — high intent |
| Object | Companies |

### Step 2 — Gate the agent with a Filter

Add a [Filter](/reference/conditions/filter/) immediately after the trigger. This is the cost guard: it's free and it stops every below-threshold run before the Web agent can spend a token. Set conditions that approximate your ICP.

| Field | Value |
| --- | --- |
| Block | Filter |
| Condition 1 | `domain` is not empty |
| Condition 2 | `employee_count` is greater than 50 |
| Condition 3 | `region` is one of EMEA, North America |
| Match | All conditions |

### Step 3 — Research with a read-only Web agent

Add a [Web agent](/reference/agents/web-agent/) after the Filter. Set its **Run as** identity to your read-only research user so it can read the record and the public web but cannot write back. Keep the prompt to two to four specific questions.

| Field | Value |
| --- | --- |
| Block | Web agent |
| Run as | Research (read-only) |
| Input | `acme.com` (from `domain`) |
| Questions | What does this company sell? Who is the likely buyer? Why might they need our product now? What's a relevant first line for outreach? |

Use a tightly scoped prompt so the agent returns structured, verifiable research:

```text
Research this company for a B2B sales rep. Return:
1. one-sentence company summary
2. likely business model
3. why they may have urgency now
4. one concise outreach angle

Avoid unsupported claims. If you cannot verify something, say so.
```

### Step 4 — Classify into fit bands

Add a [Classify record](/reference/ai/classify-record/) block. Feed it the company record plus the agent's research, and have it return a single fit band.

| Field | Value |
| --- | --- |
| Block | Classify record |
| Input | `{{ web_agent.summary }}` plus company attributes |
| Categories | A — strong ICP fit, B — partial fit, C — weak or out of ICP |
| Output | `fit_band` |

### Step 5 — Branch on the band with a Switch

Add a [Switch](/reference/conditions/switch/) on the fit band so A and B leads get routed and C leads are saved but not assigned.

| Field | Value |
| --- | --- |
| Block | Switch |
| Switch on | `{{ classify_record.fit_band }}` |
| Case A | Save, assign, notify |
| Case B | Save, assign, notify |
| Case C | Save only |

### Step 6 — Save the research

In every branch, add an [Update record](/reference/records/update-record/) to write the research and band back to the company. The Web agent does not save anything on its own.

| Field | Value |
| --- | --- |
| Block | Update record |
| Record | Trigger company |
| `icp_research` | `{{ web_agent.summary }}` |
| `fit_band` | `{{ classify_record.fit_band }}` |

### Step 7 — Assign qualified leads with Round robin

In the A and B branches only, add a [Round robin](/reference/workspace/round-robin/) to pick the next rep and write the owner.

| Field | Value |
| --- | --- |
| Block | Round robin |
| Pool | EMEA AEs: Priya Sharma, Jordan Lee, Mateo Ruiz |
| Assign to | `owner` |

### Step 8 — Notify the owner over Slack

In the A and B branches, add a [Slack](/reference/integrations/) block to message the assigned rep.

| Field | Value |
| --- | --- |
| Block | Slack |
| Channel or user | Assigned owner from Round robin |
| Message | New {{ fit_band }} lead: {{ company.name }} ({{ domain }}). Research saved in Attio. Owner: {{ owner }}. |

## Variable mapping

| Variable | Source block | Field | Example value |
| --- | --- | --- | --- |
| `domain` | Trigger | Company `domain` | `acme.com` |
| `web_agent.summary` | Web agent | Research output | "Acme sells warehouse robotics to mid-market 3PLs..." |
| `classify_record.fit_band` | Classify record | Category | `A` |
| `owner` | Round robin | Assigned rep | Priya Sharma |
| `company.name` | Trigger | Company `name` | Acme Robotics |

## Credit cost worked example

Assume 400 leads enter the high-intent list per month, and the ICP Filter passes ~30% of them (120 leads). The Filter, Switch, and Round robin are free [logic blocks](/reference/credits-and-pricing/). The token-based cost of this recipe is the Web agent, plus Classify record and the writes.

- **Filter** — free, runs on all 400 leads.
- **Web agent** — variable, token-based; runs only on the ~120 leads that pass the Filter. Don't assume a fixed number: sample ~10 representative leads, run them, and read the actual per-run credit cost in the run viewer before you scale. Gating with the Filter is what keeps this line from running on all 400.
- **Classify record** — variable, token-based; ~120 runs. Sample and read per-run cost the same way.
- **Update record** — 1 credit each, ~120 runs.
- **Round robin** — free, ~A+B leads only.
- **Slack** — 1 credit each, ~A+B leads only.

So the fixed-rate floor is roughly 120 Update writes plus one Slack per assigned (A/B) lead; the variable ceiling is the Web agent and Classify totals you measure in the run viewer. Compare that monthly total against your plan allowance on [Credits and pricing](/reference/credits-and-pricing/).

## Test plan

1. Add a real ICP-fit company (for example, a 200-person EMEA SaaS firm with a populated `domain`) to the high-intent list to fire the trigger.
2. Open the run in run history and confirm the **Filter** passed. Expect a green continue.
3. Confirm the **Web agent** returned a research summary keyed to your four questions, and that its Run as identity is read-only.
4. Confirm **Classify record** output an `A`, `B`, or `C` band.
5. Confirm the **Switch** entered the matching branch, **Update record** wrote `icp_research` and `fit_band` to the company, and — for A/B — **Round robin** set an owner and **Slack** posted to that owner.
6. Now add a deliberately failing input: a lead with an empty `domain` and `employee_count` of 5. Expect the **Filter** to stop the run before the Web agent — verify in run history that no agent or write block executed and no tokens were spent.

## Failure modes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Credit spend far higher than expected | Web agent running on raw, low-fit leads | Tighten the Filter and confirm it sits before the Web agent; re-sample 10 runs in the run viewer. |
| Research summary is blank in Attio | No Update record after the agent | Agent output isn't saved automatically; add Update record mapping `{{ web_agent.summary }}` into `icp_research`. |
| Agent attempts to write or errors on permissions | Run as identity has write access or is wrong | Set the Web agent's Run as to a read-only research user. |
| C leads getting assigned and pinged | Round robin and Slack placed outside the Switch | Move Round robin and Slack into the A and B branches only. |
| Owner field unset on qualified leads | Round robin pool empty or not mapped to `owner` | Populate the pool and map the assigned rep to the `owner` attribute. |
| Webhook leads never trigger | Payload not resolved to a company record | When using Webhook received, create or match the company before the Filter. |

## Variations

### Command trigger to control spend

Swap [Record added to list](/reference/triggers/record-added-to-list/) for [Record command](/reference/triggers/record-command/) so a human chooses when a lead is worth researching. Everything downstream is identical; this puts the token-priced Web agent behind an explicit click instead of an automatic list event, which is the safest way to cap spend while you tune the Filter.

### Summarize instead of Web agent for a cheaper tier

For high volume or B-tier leads where public-web research isn't worth the cost, replace the [Web agent](/reference/agents/web-agent/) with [Summarize record](/reference/ai/summarize-record/). It's still token-based but works only from data already in Attio — no web browsing — so it's cheaper per run. Keep the Filter, Classify record, Switch, and routing unchanged; only the research block changes.

## See also

- [AI agents playbook](/guides/signals-and-ai/ai-agents-playbook/)
- [Permissions and access](/explanation/permissions-and-access/)
- [Web agent](/reference/agents/web-agent/)
- [Classify record](/reference/ai/classify-record/)
- [Credits and pricing](/reference/credits-and-pricing/)
