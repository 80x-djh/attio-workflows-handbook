---
title: Runs, debugging & publishing
description: The publish lifecycle, the run viewer, input/output tracing, retry-from-failed, and pause/cancel — how to operate Attio workflows like production software.
page-type: concept
---

A workflow is production software that edits your CRM. This page covers its operational surface: how versions go live, how to read a run, and how to recover when one fails.

## The publish lifecycle

- Workflows are built as **drafts**; nothing triggers until you **Publish**.
- Edits to a live workflow don't apply until you click **Publish changes** (or **Discard changes** to revert to the live version).
- **In-flight runs finish on the version they started on.** A run that began before your edit completes on the old logic — relevant when a Delay block parks runs for days.
- Publishing validates the canvas: misconfigured blocks get red error indicators and block the publish.
- Disabling a workflow stops *new* runs; in-progress runs still complete. Archiving also pauses it. Deleting cancels all in-flight runs immediately and is permanent — though workflows that have ever run can only be archived, not deleted.

**Operational habit:** workflows have email notifications for failed runs (on by default for workflows you create, max one email per failure reason per day — configurable on the workflow's Settings tab). Also set the **workflow timezone** on the Settings tab; every date/time operation in the run uses it, and the default isn't always what your RevOps brain assumes.

## Reading a run

**Workflow → Runs tab** lists every execution. Click one and the canvas becomes a frozen snapshot of that run:

- **Green arrows** mark the executed path; green checks are successful blocks; **red** is the failure point.
- Hover a run in the sidebar for runtime, start/end, and **credits consumed** — your per-run cost meter.
- Click any block → sidebar shows its **Inputs** (what it received) and **Outputs** (what it passed on).
- Loops get **< >** arrows to step through iterations; agent blocks expand to show each step the agent took and what it produced.

### The tracing method

Failures usually *surface* downstream of where they *start*. The reliable diagnostic:

1. Open the failed block; read the error and its **Inputs**.
2. Ask: is the input wrong, or is the block misconfigured?
3. If an input looks wrong, open the upstream block that produced it and inspect its **Outputs**.
4. Repeat until you find the block where expectation and reality diverge — that's the bug, regardless of where the red icon is.

Common errors and their exact fixes are catalogued in [common errors](/troubleshooting/common-errors/).

## Rerun and retry

From any run: **Rerun** (successful runs) executes again with the original trigger data; **Retry** (failed runs) offers:

- **Retry from start** — full re-execution with original trigger data.
- **Retry from failed** — resumes at the failed block, skipping completed ones. Use this when the failure was transient (an external API blip) and the earlier blocks already wrote data — it avoids double-writing.

Two things to know:

- **Retries run the version that was published when the run originally triggered** — not your fixed version. To verify a fix, trigger a *new* run.
- Attempts stack under the same run with an **Attempt** dropdown, so you can compare before/after.

Also note what *doesn't* retry: there is no automatic retry. A failed run stays failed until a human acts — which is why the failure-notification emails matter, and why anything business-critical deserves a periodic "did this actually run" check. Failed blocks consume no credits; blocks that succeeded before the failure do.

## Pause, resume, cancel

In-progress runs can be **paused** (current block finishes first), **resumed**, or **cancelled** (permanent; current block still completes and bills). Pause is underrated when you spot bad data mid-run — pause, inspect inputs/outputs, then resume or cancel with full information.

## Pre-publish checklist

Thirty seconds that prevent most incidents:

1. Trigger scoped (attribute selected where possible) + early [Filter](/explanation/conditions-and-filters/)?
2. [Loop guard](/explanation/infinite-loops-and-safety/) if the workflow writes to the same object it triggers on?
3. Variables wired and no yellow warnings? [Fallbacks](/explanation/variables/) on formula inputs?
4. Write [permissions](/explanation/permissions-and-access/) granted — both sides of any relationship?
5. Worst-case run cost estimated ([credit math](/reference/credits-and-pricing/)), Loop **Limit** set while testing?
6. Test-triggered once and traced in the run viewer?
