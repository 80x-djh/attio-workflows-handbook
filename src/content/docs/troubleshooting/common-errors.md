---
title: Common errors
description: Common Attio workflow failures and the fastest fixes.
page-type: guide
---

## Workflow did not fire

Likely causes:

- wrong trigger type
- Record updated used for a value set during creation
- Record updated watching object attributes while the change happened on a list entry
- workflow not published
- trigger scoped to the wrong object/list/attribute

Fix: compare the event to [choosing the right trigger](/explanation/triggers/).

## Variable is empty

Likely causes:

- selected output is not on the executed path
- Find block returned zero matches
- multi-trigger workflow is missing a data source fallback
- AI/agent output was expected to save automatically

Fix: inspect upstream outputs in the run viewer and add data sources or fallbacks.

## "Please provide a List Entry, not a Record"

The block expects a list entry but received the parent record. Use [Find list entries](/reference/lists/find-list-entries/) to locate the entry, then pass the entry output.

## Sequence enrollment failed

Likely causes:

- recipient is not a person record
- sender does not have delegated sending enabled
- person is already not eligible for the sequence
- workflow lacks sequence access

Fix: validate recipient type and sender configuration before the Enroll in sequence block.

## Formula failed

Likely causes:

- empty numeric variable
- unexpected text value
- invalid operator or function

Fix: add fallbacks to variables and test with real run data.

## Credit usage is higher than expected

Likely causes:

- unscoped trigger fires too often
- loop contains a 1-credit write
- AI block runs before filtering
- duplicate workflows are both active

Fix: inspect run volume, executed path, and per-run credits in the run viewer and billing usage.
