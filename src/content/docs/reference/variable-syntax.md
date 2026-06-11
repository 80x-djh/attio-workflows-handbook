---
title: Variables and expressions reference
description: Quick reference for referencing block outputs in Attio workflows — the variable picker, the {…} syntax, null-safety, and where expression functions live.
sidebar:
  order: 98
page-type: guide
---

A quick lookup for how to **reference data between blocks**. This is the syntax companion to the conceptual [Variables and data passing](/explanation/variables/) page — read that first for the mental model; come here when you just need the mechanics.

## Inserting a variable

Most block fields accept variables. While editing a field, use the **{x} use variable** control to insert one, or type to search the available outputs. Inserted variables render as a token such as `{Deal name}` — each one is an output from the trigger or an earlier block, resolved at run time.

The rule that explains everything: **a later block can only reference an output produced by a block that runs before it.** If a variable you expect isn't in the picker, the block that produces it is downstream of where you are.

## What's available to reference

- **Trigger outputs** — the record (or list entry) that fired the workflow, and event-specific fields such as the old and new value on [Attribute value changed](/reference/triggers/attribute-value-changed/).
- **Block outputs** — each block documents its outputs on its reference page (for example [Find records](/reference/records/find-records/) returns the matched records; [Parse JSON](/reference/utilities/parse-json/) returns the parsed fields).
- **Loop item** — inside a [Loop](/reference/utilities/loop/), the current item is available to the blocks in the loop body.

## Expressions and formulas

For anything beyond inserting a single value — string concatenation, arithmetic, conditionals, date math — use the dedicated calculation blocks rather than trying to express logic inline:

- [Formula](/reference/calculations/formula/) — compute a value from other variables. The supported function set is documented on that page.
- [Adjust time](/reference/calculations/adjust-time/) — add or subtract from a date (renewal windows, staleness thresholds).
- [Aggregate values](/reference/calculations/aggregate-values/) — sum, count, or average across many records.
- [Execute code](/reference/calculations/execute-code/) — JavaScript for transformations the other blocks can't express. Cost is variable (complexity-based); see [credits and pricing](/reference/credits-and-pricing/).

## Null-safety and types

- **Empty inputs.** If a referenced output is empty, downstream blocks receive an empty value — guard with a [Filter](/reference/conditions/filter/) or [If](/reference/conditions/if/) when a later step requires the value to be present.
- **Type mismatches.** A variable carries the type of its source field. Writing a text value into a number or select attribute can fail or coerce; check the target attribute's type on its [Update record](/reference/records/update-record/) step.
- **Multi-value fields.** Multi-select and relationship attributes carry multiple values; handle them with a [Loop](/reference/utilities/loop/) rather than assuming a single value.

:::note
Exact expression function names and operators are documented on the [Formula](/reference/calculations/formula/) block page and can change between engine versions — treat that page as canonical and verify in-product if a function isn't listed.
:::

## See also

- [Variables and data passing](/explanation/variables/)
- [Formula](/reference/calculations/formula/)
- [Loops and processing many records](/explanation/loops/)
- [Records vs list entries](/explanation/records-vs-list-entries/)
