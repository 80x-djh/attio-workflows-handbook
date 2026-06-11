---
title: Choosing the right trigger
description: A decision guide for Attio workflow triggers — record vs list vs data triggers, why Attribute value changed beats Record updated, and when to reach for schedules, webhooks, or manual commands.
page-type: concept
---

Picking the wrong trigger is the most common way workflows fail silently — they don't error, they just don't fire when you expected. This page is the decision guide; each trigger's full reference lives in the [block library](/reference/).

## The decision table

| You want to react to… | Use | Why not the alternative |
| --- | --- | --- |
| A specific attribute getting a value — *including at creation* | [Attribute value changed](/reference/triggers/attribute-value-changed/) | Record updated misses creation-time values |
| Any change to a record after creation | [Record updated](/reference/triggers/record-updated/) | Unscoped, it fires on *every* attribute change — high volume |
| A brand-new record | [Record created](/reference/triggers/record-created/) | — |
| A record entering a pipeline/list | [Record added to list](/reference/triggers/record-added-to-list/) | Record created fires for the object, not the list |
| A list attribute changing (e.g. stage on a pipeline list) | [List entry updated](/reference/triggers/list-entry-updated/) or Attribute value changed pointed at the list | Record updated ignores list attributes entirely |
| A human deciding "run it on this one" | [Record command](/reference/triggers/record-command/) / [List entry command](/reference/triggers/list-entry-command/) | Manual run doesn't carry a record with it |
| A schedule (daily digest, weekly sweep) | [Recurring schedule](/reference/triggers/recurring-schedule/) | — |
| An external system (form, product event, Clay, your backend) | [Webhook received](/reference/triggers/webhook-received/) | Polling with schedules is slower and wasteful |
| A new task | [Task created](/reference/triggers/task-created/) | — |
| Testing while you build | [Manual run](/reference/triggers/manual-run/) | Remember it passes **no record** into the run |

## The trap everyone hits: created vs updated

**Record updated** and **List entry updated** only fire for changes made *after* the record or entry exists. If the value is set during creation — a deal imported as "Won", a CSV row landing with stage pre-filled, an API call that creates the record fully formed — these triggers stay silent.

**Attribute value changed** fires in both cases: value set at creation *and* value changed later. When your logic is "this field became X", default to Attribute value changed and only use the updated-triggers when you specifically want post-creation edits.

This matters double for imports and API-driven workspaces: bulk operations create records with values already set, which means update-triggers see nothing.

## Object triggers vs list triggers

Attio's separation of [records and list entries](/concepts/records-vs-list-entries/) extends to triggers:

- **Record updated** ignores changes to list attributes.
- **List entry updated** ignores changes to object attributes.
- **Attribute value changed** can point at either — you choose the object *or* list when configuring it.

If your pipeline stage lives as a list attribute on a "Sales pipeline" list (the common pattern), a Record updated trigger on Deals will never see stage changes. You need List entry updated or Attribute value changed scoped to the list.

## Scope your triggers or pay for it

An unscoped **Record updated** on a busy object fires constantly. Each run might cost 0–1 credits, but thousands of pointless runs per month add up, clutter the run history, and can [trigger loops](/advanced/infinite-loops-and-safety/). Always ask:

1. Can I select a specific attribute on the trigger? (Record updated and List entry updated both allow this.)
2. Can a free [Filter](/reference/conditions/filter/) block immediately after the trigger kill irrelevant runs?

The combination of a scoped trigger plus an early filter is the difference between a workspace with tidy, debuggable automation and one with 40,000 mystery runs.

## Multi-trigger workflows

The new engine lets one workflow have several triggers — e.g. the same enrichment steps whether a lead arrives by webhook or is created manually. Connect each trigger to the first shared step, then use [multiple data sources](/concepts/variables/#multiple-data-sources-and-fallbacks) in downstream inputs so blocks can read from whichever trigger actually fired. One workflow to maintain instead of two copies that drift apart.

## Trigger outputs

Every trigger emits at least: the triggering entity's data (where applicable), **which actor** performed the action, and **when**. Update-style triggers with a selected attribute also emit **new and previous values** — feed those into filters ("New value is Won *and* Previous value is not Won") to catch only true transitions.

The actor output deserves special mention: filtering on **Updated by → Type → is not → Workflow** is the standard guard against [infinite loops](/advanced/infinite-loops-and-safety/).
