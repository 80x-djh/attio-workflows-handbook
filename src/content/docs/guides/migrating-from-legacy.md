---
title: Migrate legacy workflows
description: A practical migration playbook for moving legacy Attio workflows into the new Workflows engine without breaking GTM processes or duplicating writes.
page-type: guide
---

Legacy workflows keep running — Attio says sunset notice will come "well in advance" — but the new engine is where the better pricing and new capabilities live: agent blocks, Execute code, multi-trigger support, advanced variables, copy/paste across workspaces, retry/pause/resume, and custom App SDK blocks.

Migration is not a button-click exercise. Treat it like production software replacement.

:::tip[Pricing changed too]
The new engine reprices everything — keep the [credit-model cheat sheet (PDF)](/attio-credits-cheatsheet.pdf) next to you while you rebuild, and see [pricing changes](/guides/migrating-from-legacy/pricing-changes/) for what's different from legacy.
:::

## Migration flow

### 1. Inventory the legacy workflow

Document:

- trigger and trigger conditions
- every block and branch
- variables passed between blocks
- objects, lists, sequences, and apps touched
- credit-heavy sections
- whether it writes to the same object/list that triggered it

Screenshot the legacy canvas before touching anything.

### 2. Rebuild with Ask Attio, then review manually

Ask Attio can recreate a legacy workflow in the new builder. Use that as a first draft, not a guarantee. Open the new workflow and check every block:

- did the trigger map to the right new trigger?
- did variables map to the right source?
- did filters preserve the same logic?
- did Slack formatting or renamed options change behavior?
- are workflow write permissions granted?

The new workflow is created disabled, which is good. Keep it disabled until testing passes.

### 3. Test with real trigger data

Use test records where possible. Open the Runs tab and inspect:

- inputs and outputs for each block
- green path vs expected path
- credit usage
- any empty variables or yellow warnings
- loop iteration behavior

If you changed the workflow after a failed run, trigger a new run to validate the fix. Retrying an old run uses the original published version.

### 4. Cut over safely

When the new workflow matches the legacy output:

1. Publish the new workflow.
2. Disable the legacy workflow.
3. Trigger one production-safe test.
4. Watch failure notifications and credit usage for the first week.

Do not run old and new write-enabled workflows in parallel unless you are intentionally testing duplicate-safe behavior.

## Common migration surprises

- `Attribute changed` is now `Attribute value changed`.
- `If/else` is now `If`.
- `Research record` is now `Web agent`.
- Prompt completion style work now belongs in `Custom agent`.
- Slack messages use standard markdown in the new engine.
- Logic, delays, lookups, and round-robin are free in the new engine.
- AI blocks are variable token-priced, not fixed 1 or 10 credit blocks.
- Workflow write access is still explicit. Missing access often looks like a broken block, not a broken migration.

## Migration triage

Migrate in this order:

1. High-volume workflows where cheaper pricing matters now.
2. Workflows using legacy research blocks.
3. Workflows with many logic/delay/lookup steps that become cheaper.
4. Workflows that operators touch daily.
5. Low-volume back-office workflows.

Leave stable, low-value legacy workflows until the high-leverage ones are done.

Source: [Attio Help Center - Migrate your legacy workflows](https://attio.com/help/reference/automations/workflows/migrate-your-legacy-workflows).
