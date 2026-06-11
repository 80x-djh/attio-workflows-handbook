---
title: Conditions & filters
description: The complete guide to Attio workflow condition logic — operators by attribute type, and/or grouping, nested condition groups, and Filter vs If vs Switch.
page-type: concept
---

Three blocks make decisions in a workflow — [Filter](/reference/conditions/filter/), [If](/reference/conditions/if/), and [Switch](/reference/conditions/switch/) — and they all share the same underlying condition system. Master the condition system once and all three become trivial. All three are **free** in the new engine, so use them liberally.

## Filter vs If vs Switch

| Block | Paths | Use when |
| --- | --- | --- |
| **Filter** | Continue or stop | "Only proceed if…" — gatekeeping |
| **If** | True path / False path | Two genuinely different actions |
| **Switch** | Case 1…n + Default | Routing by stage, segment, source, tier |

Two Switch behaviors that bite people:

1. **First match wins.** Cases evaluate in order — Case 1, Case 2, …, Default — and only the first true path runs. Order your cases from most to least specific.
2. **No Default blocks = silent stop.** If no case matches and the Default path is empty, the run ends at the Switch. If "none matched" should do something (even just a Slack ping), put it on Default.

## Building conditions

A condition is **attribute → operator → value**. Chain conditions with **and** / **or**, and use **Convert to advanced condition** (⋮ menu on a condition) to create nested groups when you need `(A and B) or (C and D)` logic.

### Operators by attribute type

| Attribute type | Operators |
| --- | --- |
| Text | is, is not, contains, does not contain, starts with, ends with, empty, not empty |
| Number / currency | greater than, greater or equal to, less than, less or equal to, is, is not, empty, not empty |
| Date / timestamp | after, at or after, before, at or before, empty, not empty |
| Select / status | is, is not, empty, not empty |
| Any | empty / not empty |

### Multi-value attributes

For attributes holding multiple values (multi-selects, multi-reference relationships), a condition is true **if any one value matches**. "Tags contains Customer" passes when *any* tag is Customer. There is no built-in "all values match" operator — if you need that, evaluate it in an [Execute code](/reference/calculations/execute-code/) block instead.

## The and/or trap

Conditions joined by **and** all need to be true; **or** needs only one. The classic mistake when mixing them is flat condition lists that read differently than they evaluate:

> Deal stage is Won **or** Deal stage is Lost **and** Owner is Alex

If your intent is "(Won or Lost) and owned by Alex", build it as a nested group: an outer **and** joining `Owner is Alex` with an inner group `(stage is Won or stage is Lost)`. When a filter passes records it shouldn't, the and/or structure is the first thing to check — the official troubleshooting guide says the same.

## Conditions on trigger outputs

Filters aren't limited to record attributes — they can test any output of an earlier block, which unlocks the most useful guard patterns:

- **True transitions only:** `New value is Won` *and* `Previous value is not Won` — fires once per actual transition, not on re-saves.
- **Human-only triggers:** `Updated by → Type → is not → Workflow` — the standard [infinite-loop guard](/advanced/infinite-loops-and-safety/).
- **Webhook payload routing:** after a [Parse JSON](/reference/utilities/parse-json/) block, route on any parsed field with a Switch.

## Placement strategy

Put your cheapest, most selective check **immediately after the trigger**. Conditions are free; everything downstream of them might not be. A workflow shaped `trigger → Filter → expensive stuff` costs nothing on the 95% of runs that don't matter. The same workflow shaped `trigger → Web agent → Filter` pays the AI cost on every single run — see [credits](/start/credits-and-pricing/).
