---
title: Loops & processing many records
description: How the Loop block works in Attio workflows — iterating over Find results, relationship attributes, and multi-selects, with the credit math and the one-record default trap.
---

Workflows process **one thing at a time** by default. The moment a block returns *many* things — Find results, a multi-reference relationship, a multi-select — you need a [Loop](/reference/utilities/loop/) to act on all of them. This page covers the patterns; the block's full spec is in the [reference](/reference/utilities/loop/).

## The one-record default trap

Connect a block directly to a [Find records](/reference/records/find-records/) output and it processes **only the first match**. No error — just silently incomplete work, usually noticed weeks later. The builder shows a warning icon on the downstream block; don't dismiss it.

The fix is always the same shape:

```
[Find records] → [Loop: iterate matching records]
                    ↳ inside: [act on Current item]
```

## What you can iterate

The Loop's **Iterable** input accepts any multi-valued output:

- Matching records / entries from Find blocks
- Multi-reference relationship attributes (all people linked to a company, all deals on a fund)
- Multi-select attribute values
- Arrays parsed from JSON by [Parse JSON](/reference/utilities/parse-json/) (webhook payloads with arrays of items)

Inside the loop, blocks get loop-scoped variables: **Current item** (the star of the show), **Item position**, **Count**, and **Total count**.

## Canvas mechanics

Blocks that repeat go **inside the loop container** (the dotted boundary). The Loop block has two exits: **Next step** (first block of each iteration) and **Complete** (runs once after all iterations — put your "swept 30 deals ✅" summary Slack post here). The new builder lets you drag existing blocks straight into the container.

In the [run viewer](/concepts/runs-and-debugging/), use the **<** and **>** arrows above the Loop to step through individual iterations — essential when iteration 17 of 40 is the one that failed.

## The credit math

The Loop itself is free. Its *contents* run once per iteration:

```
Find stale deals (0) → Loop (0) over 38 deals
  ↳ Create task (1) per deal        = 38 credits
```

Loop contents are where workflow costs actually live. Two levers:

- **Limit** input on the Loop caps iterations — set it during testing so a bad filter doesn't fan out into hundreds of writes.
- **Filter inside the loop is free** — a Filter on Current item that skips most iterations costs nothing and saves every skipped write.

An AI block inside a loop deserves real thought: Web agent × 50 iterations is 50 variable-cost agent runs. Test on a small Limit first and check actual per-run costs before lifting it. See [credits & pricing](/start/credits-and-pricing/).

## Common loop recipes

- **[Stale-deal sweep](/recipes/stale-deal-sweep/):** schedule → Find entries (stage unchanged in 14 days) → loop → create task for owner.
- **Enroll all champions:** trigger on deal stage → loop over the deal's contacts relationship → [Enroll in sequence](/reference/sequences/enroll-in-sequence/) inside the loop (it's strictly one person per call).
- **Webhook batch intake:** Parse JSON exposing an array of leads → loop → [Create or update record](/reference/records/create-or-update-record/) per item.
- **Roll-up calculations:** prefer one [Aggregate values](/reference/calculations/aggregate-values/) block over a loop with a running total — aggregation is free, simpler, and built for it.

## Limits to design around

- **Find blocks return at most 100 results.** A "sweep everything" workflow over a bigger set needs either filters that keep matches under 100, a tighter schedule (sweep daily instead of weekly), or honestly, a script against the REST API — workflows aren't a bulk-backfill tool.
- **No nested iteration patterns** beyond what one loop gives you — flatten the data upstream (Execute code can reshape arrays) rather than fighting the canvas.
