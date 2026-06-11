---
title: "Track 3 — Keep the pipeline honest"
description: Make the pipeline self-clean, self-summarize, and hand off — on a schedule, with no false positives and no manual work.
sidebar:
  order: 4
  label: "3 · Keep the pipeline honest"
page-type: guide
---

**Who this is for:** a RevOps lead at a 20–200-person SaaS company who owns hygiene, lifecycle stages, and handoffs — and is tired of the pipeline being a polite work of fiction.

**By the end you can:** make the pipeline self-clean, self-summarize, and hand off — on a schedule, with no false positives and no manual work.

**Prerequisites:** finish [Track 1 — Capture and qualify](/learn/capture-and-qualify/), and skim [Loops and processing many records](/explanation/loops/) and [Runs and debugging](/explanation/runs-and-debugging/).

## The mental model

Hygiene runs on a clock, not on a click. A scheduled workflow finds the records that have drifted and acts — but it **flags and tasks; it never auto-closes**. The two failure modes to design against are false positives (which make people ignore the system) and runaway loop cost (which makes finance ignore you). Stage-specific thresholds fix the first; a tight Find filter and a test limit fix the second.

## Modules

1. **Surface aging deals** — [Stale-deal sweep](/guides/pipeline-hygiene/stale-deal-sweep/). Stage-specific age, flag and task, zero false positives.
2. **Stop duplicates at birth** — [Dedupe on create](/guides/pipeline-hygiene/dedupe-on-create/). Catch them the instant a record is created, not in a quarterly cleanup.
3. **Never miss a renewal** — [Daily renewal watch at 90, 60, and 30 days](/guides/pipeline-hygiene/renewal-watch/).
4. **Hand off cleanly** — [Hand off closed-won deals to Customer Success](/guides/pipeline-hygiene/closed-won-handoff/).
5. **Report without a standup** — [Daily pipeline digest to Slack](/guides/pipeline-hygiene/pipeline-digest/), entirely free of AI credits.

## Challenge

Stand up the stale-deal sweep end to end: a Monday schedule finds open deals past a stage-specific age, loops them, flags each and tasks the owner, and posts a single review digest — with a test run capped at five records so you can watch the credit math before you let it loose on the whole pipeline.

## See also

- [Stale-deal sweep](/guides/pipeline-hygiene/stale-deal-sweep/)
- [Track 4 — Let AI own a stage](/learn/let-ai-own-a-stage/)
- [Loops and processing many records](/explanation/loops/)
- [Credits and pricing](/reference/credits-and-pricing/)
