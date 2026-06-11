---
title: "Track 4 — Let AI own a stage"
description: Stand up a read-only research and qualification agent that runs a whole funnel segment safely, with explicit credit math and infinite-loop guards.
sidebar:
  order: 5
  label: "4 · Let AI own a stage"
page-type: guide
---

**Who this is for:** a solo Attio consultant (or a technical RevOps lead) templatizing safe, cost-aware agent patterns across client workspaces — where a surprise credit bill is a fireable offense.

**By the end you can:** stand up a read-only research and qualification agent that owns an entire funnel segment safely, and reason confidently about agent permissions, credit cost, and infinite-loop safety before you publish.

**Prerequisites:** finish [Track 1 — Capture and qualify](/learn/capture-and-qualify/), and read [Permissions and access](/explanation/permissions-and-access/) and [Infinite loops and safety](/explanation/infinite-loops-and-safety/).

## The mental model

The shift here is from "AI assists a human" to "AI owns a segment." An agent block researches read-only under the [Run as](/explanation/permissions-and-access/) model, and you put a free [Filter](/reference/conditions/filter/) in front of it so it only spends on records that deserve it. Cost discipline is the whole game: AI blocks are variable and token-based — never assume; sample ten records and read the per-run cost in run history, then decide whether the agent fires automatically or only on a command. The numbers live on the canonical [credits and pricing](/reference/credits-and-pricing/) page.

## Modules

1. **Qualify with research** — [AI ICP-fit research and routing](/guides/signals-and-ai/inbound-lead-research/). Validate fit before a rep spends a minute, route only the qualified.
2. **React to a buying signal** — [Fire personalized outbound when a target account raises funding](/guides/signals-and-ai/funding-signal-outbound/).
3. **Design agents that behave** — the [AI agents playbook](/guides/signals-and-ai/ai-agents-playbook/), and the platform escape hatches in [HTTP and JSON patterns](/guides/platform-patterns/http-json-patterns/).

## Challenge

Build a read-only research agent that owns ICP-fit qualification: gate it behind a Filter so it only runs on records that clear your bar, have it classify fit and write the summary to source fields, route only the qualified, and prove the credit math on a ten-record sample before you wire it to a live trigger. For client work, trigger it from a command so spend is always explicit.

## See also

- [AI ICP-fit research and routing](/guides/signals-and-ai/inbound-lead-research/)
- [Permissions and access](/explanation/permissions-and-access/)
- [Infinite loops and safety](/explanation/infinite-loops-and-safety/)
- [Credits and pricing](/reference/credits-and-pricing/)
