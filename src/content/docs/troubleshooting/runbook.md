---
title: Production runbook
description: A practical operating runbook for failed, expensive, or unsafe Attio workflow behavior.
page-type: guide
---

Use this when a live workflow is failing or behaving unexpectedly.

## Failed runs

1. Open the workflow -> Runs.
2. Pick the newest failed run.
3. Click the failed block.
4. Read Inputs, Outputs, and error detail.
5. Trace upstream until the first wrong value appears.
6. Fix the draft.
7. Publish.
8. Trigger a fresh test run.

## Runaway volume

1. Disable the workflow if it is writing or spending credits.
2. Check whether the trigger is unscoped.
3. Add an early Filter.
4. Add "Updated by is not Workflow" when self-triggering is possible.
5. Re-enable only after a one-record test.

## Bad data write

1. Disable the workflow.
2. Export or list affected records.
3. Identify the write block and variable source.
4. Correct the data manually or with a controlled script.
5. Add idempotency guards before republishing.

## External app failure

1. Check whether the connected app credential is still valid.
2. Inspect the request payload or sequence recipient.
3. Retry from failed only if earlier successful writes should not repeat.
4. Trigger a new run when workflow logic changed.

## Weekly review

- failed runs
- expensive runs
- paused runs
- high-volume triggers
- newly disconnected apps
- workflows edited but not published
