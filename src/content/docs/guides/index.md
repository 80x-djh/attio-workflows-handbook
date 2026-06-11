---
title: Guides
description: Follow-along Attio Workflow builds — routing, enrichment, scoring, pipeline hygiene, signals, and AI — each with real field values, credit math, and a test.
sidebar:
  order: 0
  label: All guides
page-type: landing
---

Guides are complete, follow-along builds — not abstract patterns. Each one names the trigger, every block with its exact configuration, the credit math, and a test plan, so you can ship it into your own workspace and watch it run. They assume you've done [Build your first workflow](/learn/build-your-first-workflow/); if a concept is unclear, the [Explanation](/explanation/) section has the why.

## Capture and qualify

Make inbound arrive enriched, scored, and routable — paying for AI only where it changes a decision.

- [Cheapest-first enrichment waterfall](/guides/capture-and-qualify/enrichment-waterfall/)
- [Score leads into explainable bands](/guides/capture-and-qualify/signal-scoring/)
- [Webhook lead intake with safe upsert](/guides/capture-and-qualify/webhook-lead-intake/)

## Route and sequence

Get the right rep on the right account at the right moment, with clean enroll/exit hygiene.

- [Slack deal alerts on stage change](/guides/route-and-sequence/slack-deal-alerts/)
- [Round-robin lead routing](/guides/route-and-sequence/round-robin-routing/)
- [Enroll and auto-exit sequences](/guides/route-and-sequence/sequence-enrollment/)

## Pipeline hygiene and lifecycle

Make the pipeline self-clean and hand off — on a schedule, with no false positives.

- [Stale-deal sweep](/guides/pipeline-hygiene/stale-deal-sweep/)

## Signals and AI

Turn signals into researched, routed action — with the AI cost gated behind a filter.

- [AI ICP-fit research and routing](/guides/signals-and-ai/inbound-lead-research/)
- [AI agents playbook](/guides/signals-and-ai/ai-agents-playbook/)

## Platform patterns

The escape hatches for when native blocks aren't enough.

- [HTTP and JSON patterns](/guides/platform-patterns/http-json-patterns/)
- [Custom blocks with the App SDK](/guides/platform-patterns/app-sdk-custom-blocks/)

## Migrating from legacy

- [Migrate your legacy workflows](/guides/migrating-from-legacy/)

## What makes a good build

The best Attio workflow is boring:

1. a precise trigger
2. an early, free filter
3. a minimal data lookup
4. one clear write or external action
5. run-viewer verification
6. a documented owner and rollback

Use agents, HTTP, and code when they remove real complexity — not because they're available.
