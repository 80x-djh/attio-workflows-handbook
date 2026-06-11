---
title: Records vs list entries
description: The single most confusing concept in Attio workflows — records and list entries are different entities, blocks are strict about which they accept, and here are the bridge patterns.
page-type: concept
---

If you only internalize one concept page on this site, make it this one. More workflow errors trace back to record/entry confusion than to everything else combined.

## The data model in 60 seconds

- A **record** is the entity itself: a company, a person, a deal. It lives on an **object** and carries **object attributes** (name, domain, ARR…).
- A **list entry** is that record's *membership in a list* — a pipeline, a process, a tracking view. The entry carries its own **list attributes** (stage, priority, next step…) that exist only in that list's context.

One record can be in five lists → one record, five list entries, each with independent list attributes. Deleting an entry removes the record *from the list*; the record itself is untouched.

## Why workflows make you care

**Blocks are strictly typed.** Entry inputs reject records; record inputs reject entries. The errors are literal: *"Please provide a List Entry, not a Record."* Concretely:

- [Update record](/reference/records/update-record/) writes object attributes → needs a **record**
- [Update list entry](/reference/lists/update-list-entry/) writes list attributes → needs an **entry**
- [Enroll in sequence](/reference/sequences/enroll-in-sequence/) needs specifically a **person record**
- [Web agent](/reference/agents/web-agent/) researches a **record**, never an entry

**Triggers are scoped to one side.** [Record updated](/reference/triggers/record-updated/) ignores list attributes; [List entry updated](/reference/triggers/list-entry-updated/) ignores object attributes. If "stage" is a list attribute on your pipeline list and you trigger on Record updated → Deals, your workflow will never fire. (This exact mismatch is the most common "my workflow never runs" cause.)

## The bridge patterns

### You have a record, you need its list entry

Use [Find list entries](/reference/lists/find-list-entries/) on the target list with the condition **Parent record → is → {your record variable}**, then feed the found entry into the entry-typed block. This is the official pattern for the "List Entry, not a Record" error.

### You have a list entry, you need the record

The entry's outputs include its **parent record** — select it directly in the variable picker. No lookup needed.

### You have a deal/company entry, you need a person to enroll

Chain through relationships: from the entry → parent record → a relationship attribute holding people (e.g. "Champion" or "Contacts") → person record. If the relationship can hold *several* people, the input takes only the first — wrap the enroll block in a [Loop](/reference/utilities/loop/) over the relationship attribute to enroll them all.

## Modeling advice from the field

When you control the schema, decide deliberately where attributes live — it determines which triggers and blocks you'll be able to use:

- **List attribute** (stage, owner-in-this-process, next step): right when the value only makes sense within that process, or when the same record needs different values in different pipelines.
- **Object attribute** (ICP score, segment, ARR): right when the value is a fact about the entity itself, visible everywhere it appears.

A pipeline stage as an object attribute looks convenient until the company is in two pipelines at once. A "fact" stored as a list attribute is invisible to every other view and workflow. Get this wrong and you'll feel it in every automation you build downstream — moving an attribute later means migrating data and rewiring workflows.

One more downstream effect: **a record can appear in a list only once**, but the same person can be created as a duplicate record many times — dedupe hygiene directly affects whether your "added to list" automations behave sanely.
