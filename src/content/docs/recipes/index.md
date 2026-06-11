---
title: GTM recipes
description: Copyable Attio Workflows patterns for lead routing, enrichment, outbound, pipeline hygiene, alerts, and product-signal intake.
sidebar:
  order: 1
page-type: landing
---

Recipes are complete build plans, not abstract examples. Each one names the trigger, the blocks, the credit model, and the safety guard.

Start with these:

- [Slack deal alerts](/recipes/slack-deal-alerts/)
- [Stale deal sweep](/recipes/stale-deal-sweep/)
- [Inbound lead research](/recipes/inbound-lead-research/)
- [Sequence enrollment](/recipes/sequence-enrollment/)
- [Webhook lead intake](/recipes/webhook-lead-intake/)
- [Round-robin lead routing](/recipes/round-robin-routing/)
- [Enrichment waterfall](/recipes/enrichment-waterfall/)
- [Signal scoring](/recipes/signal-scoring/)

## Recipe design rule

The best Attio workflow is boring:

1. precise trigger
2. early free filter
3. minimal data lookup
4. one clear write or external action
5. run viewer verification
6. documented owner and rollback

Use agents, HTTP, and code when they remove real complexity, not because they are available.
