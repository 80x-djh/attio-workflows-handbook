---
title: How the engine works
description: The why behind Attio Workflows — triggers, variables, conditions, records vs list entries, runs, loops, and the credit model, explained for people who build.
sidebar:
  order: 0
  label: Overview
page-type: landing
---

Reference pages tell you *what* a block does. These pages explain *why* the engine behaves the way it does — the mental models that stop you building workflows that silently misfire, double-charge, or loop forever. Read them when a reference page raises a "but why?".

## The engine

- [What are workflows](/explanation/what-are-workflows/) — the trigger → blocks → run model, and where workflows live.
- [What's new in the 2026 engine](/explanation/whats-new/) — agents, code, multi-trigger, and the repriced credit model.
- [Triggers, explained](/explanation/triggers/) — choosing record, attribute, schedule, webhook, or command, and the one distinction that trips everyone.
- [Variables and data passing](/explanation/variables/) — how an earlier block's output becomes a later block's input.
- [Conditions and filters](/explanation/conditions-and-filters/) — if, switch, and filter, and why a condition that stops a run is free.
- [Records vs list entries](/explanation/records-vs-list-entries/) — the distinction that decides which trigger and which block you reach for.

## Running, scaling, and governing

- [Runs and debugging](/explanation/runs-and-debugging/) — what a run is, and how to read one in the run viewer.
- [Loops and processing many records](/explanation/loops/) — and why loop contents dominate the cost of most expensive workflows.
- [Infinite loops and safety](/explanation/infinite-loops-and-safety/) — how a self-triggering workflow burns credits until someone notices, and how to prevent it.
- [Permissions and access](/explanation/permissions-and-access/) — what a workflow can read and write, and the "Run as" model.
- [Workflow governance](/explanation/workflow-governance/) — naming, ownership, and change control once you have more than a handful.

For the credit numbers themselves, see the canonical [credits and pricing](/reference/credits-and-pricing/) reference.
