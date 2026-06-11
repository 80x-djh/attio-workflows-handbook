---
title: Variables & data passing
description: How data flows between Attio workflow blocks — variables, multiple data sources, fallbacks, and the wiring mistakes that cause most broken workflows.
page-type: concept
---

Blocks don't share memory. The *only* way data moves through a workflow is **outputs → variables → inputs**: a block produces outputs during a run, and downstream blocks reference them as variables. Almost every "my workflow is broken" ends up being a wiring problem here, so it's worth understanding properly.

## The basics

Every input on a block accepts either:

- **A static value** — fixed at build time, same every run ("Canada", a specific list, a hardcoded URL).
- **A variable** — click **{x} use variable** on the input and pick an output from any earlier block in the path. Resolved fresh on every run.

Variables can be mixed with static text — a Slack message like `🎉 {Deal name} moved to {New value}` interpolates live values into a template, and so does a URL in a [Send HTTP request](/reference/utilities/send-http-request/) block.

## What produces outputs

- **Triggers** emit the triggering record/entry's data, the actor, the timestamp, and (for attribute-scoped triggers) new + previous values.
- **Find blocks** emit matching records/entries and a match count.
- **Create/update blocks** emit the resulting record or entry — use this, not the trigger's copy, when later blocks need post-update values.
- **Calculation blocks** emit their result (formula result, adjusted timestamp, random number…).
- **Agents and AI blocks** emit text — answers, classifications, summaries. **These are not saved anywhere automatically**; see below.
- **[Loop](/reference/utilities/loop/)** exposes special outputs *inside* the loop: current item, position, count.

The [run viewer](/concepts/runs-and-debugging/) shows every block's actual inputs and outputs per run — when wiring confuses you, look at real run data rather than reasoning in the abstract.

## Multiple data sources and fallbacks

The new engine's **advanced variables** let one input try several sources in order, then a fixed fallback:

- **Data sources** — "use the email from the webhook payload; if empty, use the email on the trigger record."
- **Fallback** — a static value used only if *every* data source is empty.

Where this earns its keep:

1. **Multi-trigger workflows** — downstream blocks read from whichever trigger fired by listing both triggers' outputs as data sources.
2. **Patchy data** — route to the deal owner, fall back to the team lead when ownership is empty.
3. **[Formula](/reference/calculations/formula/) safety** — a formula with an empty variable fails the whole block ("Invalid formula"). Set a fallback of `0` on every numeric variable that could be empty. This is the documented fix, and it belongs on essentially every formula you write.

A variable highlighted **yellow** in the editor is the builder warning you it may be empty at runtime — hover for the details, then add a data source or fallback.

## AI outputs don't save themselves

[Classify record](/reference/ai/classify-record/), [Summarize record](/reference/ai/summarize-record/), and the [agent blocks](/reference/agents/custom-agent/) return text into the run — and that's all. If you want the result *on the record*, you must:

1. Create an attribute to hold it (select/multi-select for classifications — with options matching your tags — or text for summaries/agent answers).
2. Follow the AI block with [Update record](/reference/records/update-record/) or [Update list entry](/reference/lists/update-list-entry/), mapping the AI output into that attribute.

Skipping step 2 is the most common reason "the AI ran but nothing happened."

## Wiring rules that prevent debugging sessions

- **Type matters.** An input expecting a list entry fails if handed a record, and vice versa — the error literally says "Please provide a List Entry, not a Record". The bridge patterns are in [records vs list entries](/concepts/records-vs-list-entries/).
- **Person-typed inputs are strict.** [Enroll in sequence](/reference/sequences/enroll-in-sequence/) takes a *person record* — not a company, not a list entry. Reach people through relationship attributes on the triggering record.
- **Find blocks hand downstream blocks only the first match** unless you loop. A warning icon on the downstream block is the builder telling you this. See [loops](/concepts/loops/).
- **After a write, reference the write's output.** The trigger's record data is a snapshot from trigger time; the Update block's output reflects the update.
- **Migrated workflows:** re-verify every variable reference block by block — rewiring is the main thing [Ask Attio migration](/migration/) gets subtly wrong.
