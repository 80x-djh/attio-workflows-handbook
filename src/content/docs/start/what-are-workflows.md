---
title: What are Attio Workflows?
description: Attio Workflows are event-driven automations that run inside your CRM — triggers start them, step blocks do the work. Here's the mental model that makes everything else click.
page-type: guide
---

An Attio workflow is an automation that lives inside your CRM: **when something happens, do these things**. A deal moves stage → notify the channel. A form submits → create the lead, enrich it, route it. Every Monday → sweep the pipeline for stale deals and assign follow-ups.

You build workflows on a visual canvas, or describe what you want in plain language and let Ask Attio assemble the blocks for you. Either way, the result is the same structure underneath — and understanding that structure is 80% of mastering workflows.

## The mental model

Every workflow is a **trigger** followed by one or more **steps**, connected on a canvas:

```
[Trigger] → [Step] → [Step] → [Step]
```

- A **trigger** is the event that starts a run: a record created, an attribute changing value, a schedule firing, a webhook arriving, or a person clicking a button. See [choosing the right trigger](/concepts/triggers/).
- A **step** is one operation: update a record, create a task, post to Slack, call an external API, run an AI agent. Steps are picked from the [block library](/reference/).
- **Connections** define order. Conditional blocks like [If](/reference/conditions/if/) and [Switch](/reference/conditions/switch/) split the path; [Loop](/reference/utilities/loop/) repeats steps for each item in a list.

Each block has **inputs** (the values you configure) and most have **outputs** (values the block produces during a run). Outputs flow downstream as [variables](/concepts/variables/) — this data-passing is where real workflows get built, and where most mistakes happen.

## What workflows are good at

Workflows shine at the connective tissue of a GTM motion:

- **Routing** — round-robin new leads, assign owners by territory or segment
- **Hygiene** — flag stale deals, enforce required fields, sync derived values
- **Signals → action** — webhook from your product or a form → enrich → route → notify
- **AI in the loop** — research a company with the [Web agent](/reference/agents/web-agent/), classify inbound with [Classify record](/reference/ai/classify-record/), or run a [Custom agent](/reference/agents/custom-agent/) with MCP tool access
- **Outbound mechanics** — enroll people in [sequences](/reference/sequences/enroll-in-sequence/) when they hit a stage, exit them when they reply

## What workflows are not

- **Not a replacement for the API.** Bulk backfills across tens of thousands of records belong in a script against the [Attio REST API](https://docs.attio.com/rest-api/overview), not a workflow. [Find records](/reference/records/find-records/) caps at 100 results per call.
- **Not free.** Runs consume workspace credits — though far fewer than they used to. Read [credits & pricing](/start/credits-and-pricing/) before you publish anything that runs at volume.
- **Not write-enabled by default.** A workflow has no write access to objects until an admin grants it. This surprises everyone exactly once. See [permissions](/concepts/permissions-and-access/).

## Where to go next

1. [What's new in the 2026 engine](/start/whats-new/) — if you've used legacy workflows, start here.
2. [Build your first workflow](/start/first-workflow/) — a complete walkthrough in ~10 minutes.
3. [Block reference](/reference/) — every trigger and step, with credit costs and gotchas.

*Source of truth: [Attio Help Center — Overview of workflows](https://attio.com/help/reference/automations/workflows/overview-of-workflows).*
