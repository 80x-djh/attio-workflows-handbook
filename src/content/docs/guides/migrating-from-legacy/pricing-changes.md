---
title: Pricing changes
description: How workflow credit pricing changed between legacy Attio workflows and the new Workflows engine.
page-type: guide
---

The new pricing model is one of the strongest reasons to migrate legacy workflows.

## Comparison

The rule in the new engine: triggers, logic, and data lookups are free. Credits are only consumed when a block writes data, sends or receives something externally, or uses AI.

| Block category | Legacy | New Workflows |
| --- | --- | --- |
| Logic, lookups, delays, control flow | 1 credit for most blocks | Free |
| Data writes & external pushes | 1 credit | 1 credit |
| AI blocks (Web agent, classify, summarize) | 1–10 credits fixed | Variable (token-based) |

Legacy nuances worth knowing when you cost a migration: conditions (Filter, If, Switch) were free in legacy only as a terminal block; Research record was 10 credits fixed and is now the token-based Web agent; other AI blocks were 1 credit fixed. Execute code is new in this engine and is Variable (complexity-based).

Full per-block table: [credits & pricing](/reference/credits-and-pricing/).

## Practical migration math

Logic-heavy workflows get cheaper immediately. A legacy workflow with trigger + filter + find records + loop + 20 updates might have spent credits before the loop. In the new engine, the trigger, filter, find, and loop are free; only the 20 updates cost credits.

AI-heavy workflows need testing. A Web agent can cost less or more than the old fixed model depending on model, prompt, data, and web research depth. Run a representative sample and inspect credit usage in the run viewer.

## Cost-safe migration pattern

1. Filter before AI or external blocks.
2. Put limits on loops while testing.
3. Use Record command for expensive AI workflows until demand is proven.
4. Review Billing -> Credits -> Usage weekly after launch.
5. Keep high-volume enrichment out of workflows if a batch API script is safer.

Source: [Attio Help Center - Manage workspace and seat credits](https://attio.com/help/reference/workspace-settings-billing/manage-workspace-and-seat-credits).
