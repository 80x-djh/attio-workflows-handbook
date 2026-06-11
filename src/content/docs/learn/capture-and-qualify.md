---
title: "Track 1 — Capture and qualify"
description: Make inbound and webhook leads arrive enriched, scored on fit and intent, and tagged for routing — paying for AI only where it changes a decision.
sidebar:
  order: 2
  label: "1 · Capture & qualify"
page-type: guide
---

**Who this is for:** a 12-rep B2B SaaS team drowning in form-fills, where data quality is the number-one complaint and good leads sit unworked while someone copies fields by hand.

**By the end you can:** make inbound and webhook leads arrive already enriched, scored on fit and intent, and tagged for routing — and you'll pay for AI only where it actually changes a decision.

**Prerequisites:** finish [Build your first workflow](/learn/build-your-first-workflow/), and skim [Records vs list entries](/explanation/records-vs-list-entries/) and [Conditions and filters](/explanation/conditions-and-filters/).

## The mental model

Qualification is a stack: **fit** (is this the right kind of company?) → **intent** (are they showing buying signals?) → **engagement** (have they touched us?). You filter on the cheap, free signals first and only spend money — enrichment calls, AI classification — on the records that clear the bar. This is the "signal waterfall": enrich when a signal fires, not on every raw lead. The vocabulary here lives in the [glossary](/reference/glossary/).

## Modules

Work these in order. Each is a complete build you can ship.

1. **Take in leads from anywhere, safely** — [Webhook lead intake with safe upsert](/guides/capture-and-qualify/webhook-lead-intake/). One robust endpoint that never creates a duplicate.
2. **Fill the gaps cheaply** — [Cheapest-first enrichment waterfall](/guides/capture-and-qualify/enrichment-waterfall/). Call providers cheapest-first, stop on the first hit, never overwrite verified data.
3. **Turn signals into a score a rep trusts** — [Score leads into explainable bands](/guides/capture-and-qualify/signal-scoring/). A transparent Formula, not an opaque model.

## Challenge

Combine the three: ingest a lead by webhook, enrich only the empty fields, score it into an A/B/C band, and let the band decide the next action. When a B-band record routes to nurture and an A-band record routes to a rep with a first-touch task, you've built the front of a modern funnel.

## See also

- [Score leads into explainable bands](/guides/capture-and-qualify/signal-scoring/)
- [Track 2 — Route and sequence](/learn/route-and-sequence/)
- [Conditions and filters](/explanation/conditions-and-filters/)
- [Credits and pricing](/reference/credits-and-pricing/)
