---
title: Glossary
description: Definitions of the Attio Workflows engine terms and the GTM-engineering vocabulary this handbook uses — fit, intent, signal waterfall, Run as, and more.
sidebar:
  order: 99
page-type: glossary
---

The vocabulary this handbook uses, in two halves: the **engine** terms (how Attio Workflows actually work) and the **go-to-market** terms (the language the builds are written in). Concept and guide pages link here on first mention instead of re-explaining.

## Engine terms

**Workflow** — an event-driven automation that runs inside Attio: a trigger starts it, step blocks do the work. See [What are workflows](/explanation/what-are-workflows/).

**Trigger** — the event that starts a run (a record change, a schedule, a webhook, a manual command). See [Triggers, explained](/explanation/triggers/).

**Block** — a single step in a workflow: a trigger, a logic/condition block, a data block, an AI block, or an integration block. The full catalog is the [reference](/reference/).

**Run** — one execution of a workflow against one trigger event. You inspect runs in run history. See [Runs and debugging](/explanation/runs-and-debugging/).

**Record vs list entry** — a record is the underlying object (a company, person, deal); a list entry is that record's membership of a list, with its own list-specific attributes. Blocks are strict about which they accept. See [Records vs list entries](/explanation/records-vs-list-entries/).

**Variable** — an output from an earlier block, referenced in a later block (often as `{Field name}`). See [Variables and data passing](/explanation/variables/).

**Credit** — the unit a workflow consumes. Triggers, logic, and lookups are free; data writes and external actions cost 1; AI blocks are variable. The full model is the canonical [credits and pricing](/reference/credits-and-pricing/) page.

**Run as** — the permission model that decides whose access a workflow (and any AI agent block in it) runs with. Agent blocks access data read-only. See [Permissions and access](/explanation/permissions-and-access/).

**Sequence** — Attio's outbound email cadence. Workflows can [enroll](/reference/sequences/enroll-in-sequence/) and [exit](/reference/sequences/exit-from-sequence/) records.

**Legacy workflows** — the previous engine. You can no longer create new legacy workflows; existing ones keep running, and Attio says sunset notice will come "well in advance." See [Migrate your legacy workflows](/guides/migrating-from-legacy/).

## Go-to-market terms

**ICP / ECP** — Ideal Customer Profile (the company you sell to) and Ideal/Engaged Customer Profile at the persona level. Most qualification logic is "does this record match the ICP?".

**Fit, intent, engagement** — the three scoring dimensions. *Fit* = firmographics (industry, size). *Intent* = buying signals (research, funding). *Engagement* = your touches (opens, replies, product usage). A good lead score keeps them separable. See [Score leads into explainable bands](/guides/capture-and-qualify/signal-scoring/).

**Signal** — an external event worth reacting to: a funding round, a job change, a product action, a form fill. Signal-based (or "warm") outbound triggers a play off a signal instead of cold lists.

**Waterfall enrichment** — calling data providers cheapest-first and stopping at the first hit, so you never pay two vendors for the same field. See [Cheapest-first enrichment waterfall](/guides/capture-and-qualify/enrichment-waterfall/).

**Routing** — assigning a record to the right owner (by territory, segment, round-robin, or score). See [Route inbound by territory and seniority](/guides/route-and-sequence/territory-routing/).

**Pipeline hygiene** — keeping the pipeline honest: flagging stale deals, deduping, and handing off, usually on a schedule. See [Stale-deal sweep](/guides/pipeline-hygiene/stale-deal-sweep/).

**PQL / SQL / MQL** — Product-, Sales-, and Marketing-Qualified Lead: the threshold a record crosses to deserve a sales touch. The threshold is just a [Filter](/reference/conditions/filter/) condition.

**NRR / expansion** — Net Revenue Retention and the upsell motions that drive it: usage thresholds, renewal watches, and health scores.

**GTM engineer** — the technical go-to-market operator who builds these systems: the person this handbook is written for.

## See also

- [How the engine works](/explanation/)
- [Credits and pricing](/reference/credits-and-pricing/)
- [Guides](/guides/)
