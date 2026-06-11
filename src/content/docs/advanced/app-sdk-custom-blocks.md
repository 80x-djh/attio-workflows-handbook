---
title: App SDK custom blocks
description: When to consider custom workflow blocks through Attio's App SDK instead of forcing everything through generic HTTP requests.
page-type: guide
---

Attio's new engine supports custom workflow blocks through the App SDK. Use this when a generic HTTP request is not enough for a repeatable integration.

## Consider a custom block when

- the same HTTP action is reused across many workflows
- non-technical operators need a friendly configuration UI
- authentication should be managed once, not pasted into headers
- the block needs typed inputs and outputs
- the integration could become a reusable product

## Stay with HTTP when

- the workflow is a one-off
- the payload is simple
- the operator is technical
- you are validating demand before building an app

## GTM product idea

The handbook can become a lead source for small Attio workflow apps:

- enrichment provider actions
- LinkedIn/company research helpers
- outbound campaign tools
- scoring blocks
- data hygiene blocks

Document the manual HTTP pattern first. If the same pattern appears in several customer workspaces, turn it into a custom block.

Source: [Attio Help Center - Migrate your legacy workflows](https://attio.com/help/reference/automations/workflows/migrate-your-legacy-workflows).
