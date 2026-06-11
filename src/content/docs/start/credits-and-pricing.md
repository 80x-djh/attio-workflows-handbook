---
title: Credits & pricing explained
description: How Attio workflow credits actually work in the new engine — what's free, what costs 1 credit, how token-based AI pricing behaves, and how to estimate a workflow's monthly cost before publishing.
page-type: guide
---

Workflows consume **workspace credits**. The new engine's pricing is genuinely simple once you see the pattern — but AI blocks introduced variable cost, and loops multiply everything. This page gives you the full picture, including the arithmetic to run before you publish.

:::tip[One-page version]
Grab the [credit-model cheat sheet (PDF)](/attio-credits-cheatsheet.pdf) — the full cost table, plan allowances, and worked examples on a single printable page.
:::

## The one rule that explains everything

> **Triggers, logic, and data lookups are free. Credits are only consumed when a block writes data, sends or receives something externally, or uses AI.**

| Category | Blocks | Cost |
| --- | --- | --- |
| Triggers | All of them — record events, schedules, webhooks, manual | **Free** |
| Logic & control | [Filter](/reference/conditions/filter/), [If](/reference/conditions/if/), [Switch](/reference/conditions/switch/), [Loop](/reference/utilities/loop/), [Delay](/reference/delays/delay/), [Round robin](/reference/workspace/round-robin/), [Celebration](/reference/workspace/celebration/), [Broadcast message](/reference/workspace/broadcast-message/), [Random number](/reference/calculations/random-number/) | **Free** |
| Lookups & math | [Find records](/reference/records/find-records/), [Find list entries](/reference/lists/find-list-entries/), [Formula](/reference/calculations/formula/), [Aggregate values](/reference/calculations/aggregate-values/), [Adjust time](/reference/calculations/adjust-time/), [Parse JSON](/reference/utilities/parse-json/) | **Free** |
| Data writes | [Create record](/reference/records/create-record/), [Create or update record](/reference/records/create-or-update-record/), [Update record](/reference/records/update-record/), [Add record to list](/reference/lists/add-record-to-list/), [Update list entry](/reference/lists/update-list-entry/), [Delete list entry](/reference/lists/delete-list-entry/), [Create task](/reference/tasks/create-task/), [Complete task](/reference/tasks/complete-task/) | **1 credit** |
| External | [Send HTTP request](/reference/utilities/send-http-request/), [Enroll in sequence](/reference/sequences/enroll-in-sequence/), [Exit from sequence](/reference/sequences/exit-from-sequence/), integration blocks (Slack, etc.) | **1 credit** |
| AI | [Classify record](/reference/ai/classify-record/), [Classify text](/reference/ai/classify-text/), [Summarize record](/reference/ai/summarize-record/), [Web agent](/reference/agents/web-agent/), [Custom agent](/reference/agents/custom-agent/) | **Variable** (token-based) |
| Code | [Execute code](/reference/calculations/execute-code/) | **Variable** (complexity-based) |

Three load-bearing details:

1. **Only the executed path costs anything.** A Switch with five branches charges only for the blocks on the branch that ran.
2. **Failed blocks are free.** If a run dies at block four, you pay for blocks one through three only.
3. **Loops multiply.** The Loop block is free; the 1-credit Update record *inside* it, run over 50 records, is 50 credits. Loop contents dominate the cost of most expensive workflows.

## How many credits do you have?

Workspace credits per month, by plan:

| Plan | Workspace credits / month |
| --- | --- |
| Free | 250 |
| Plus | 1,500 |
| Pro | 10,000 |
| Enterprise | Custom |

Credits renew monthly on your billing date. Admins can buy additional credit packages under **Workspace settings → Billing → Manage credits**, and can see per-workflow (and per-member) consumption under **Billing → Credits → Usage** — check this weekly for the first month after publishing anything new.

> **Note:** using Ask Attio to *build* a workflow draws on your personal **seat credits**, not workspace credits. Running the workflow draws on workspace credits.

## Worked examples

**Stage-change Slack alert** ([recipe](/recipes/slack-deal-alerts/)):
trigger (0) + Filter (0) + Slack post (1) = **1 credit per alert**. At 200 stage changes a month: 200 credits.

**Monday stale-deal sweep** ([recipe](/recipes/stale-deal-sweep/)):
schedule (0) + Find records (0) + Loop (0) + [Create task (1) × 30 stale deals] = **30 credits per week**, ~130/month.

**Inbound lead research** ([recipe](/recipes/inbound-lead-research/)):
trigger (0) + Web agent (**variable**) + Update record (1) + Slack post (1). The agent's token usage depends on how many questions you ask and how much it has to read. Run it on ten representative records, check the per-run cost in the run viewer (hover over a run), and *then* decide whether it triggers on every new lead or only filtered ones.

## Reasoning about AI block costs

Token-based pricing means you can't precompute AI costs exactly, and per-run credit limits no longer exist (they were removed when token pricing arrived). Defenses, in order of effectiveness:

1. **Filter before the AI block, not after.** Every record that reaches the agent costs money — make the cheap, free Filter do the gatekeeping.
2. **Trim the prompt surface.** Fewer questions to a [Web agent](/reference/agents/web-agent/) and tighter instructions to a [Custom agent](/reference/agents/custom-agent/) directly reduce tokens.
3. **Test on a sample and extrapolate** before wiring an AI block to a high-volume trigger like Record created on People.
4. **Monitor per-workflow usage** in Billing for the first weeks. Costs are visible per run in the run viewer.

The block configuration sidebar shows credit costs while you build: fixed-cost blocks show the number, AI blocks show a "dynamic" label, free blocks show nothing.

## Cost-optimization patterns

- **Prefer Attribute value changed over Record updated with no attribute selected.** An unscoped Record updated trigger fires on *every* attribute change on *every* record of the object — each run might cost little, but the run volume can be enormous, and runaway volume is how workspaces hit their cap mid-month.
- **Use Create or update record instead of Find + If + Create/Update chains.** Same outcome, fewer blocks, one credit.
- **Push derived values into the workflow only when they change** rather than recomputing on a schedule across the whole object.
- **Guard against [infinite loops](/advanced/infinite-loops-and-safety/)** — a self-triggering workflow burns credits until someone notices.

*Sources: [Manage workspace and seat credits](https://attio.com/help/reference/workspace-settings-billing/manage-workspace-and-seat-credits), [Migrate your legacy workflows — pricing](https://attio.com/help/reference/automations/workflows/migrate-your-legacy-workflows).*
