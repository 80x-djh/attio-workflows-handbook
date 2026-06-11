---
title: About & contributing
description: What this handbook is, how to contribute, and how source-backed community docs should evolve as Attio Workflows changes.
page-type: landing
---

The Attio Workflows Handbook is a community-maintained guide for people building go-to-market systems in Attio. It's written by [Dan Hull](https://80x.ai), who builds Attio workspaces for VC funds and startups full-time.

It is not affiliated with or endorsed by Attio Ltd. The official Attio Help Center remains the source of truth for product behavior. This handbook adds implementation judgment: patterns, recipes, migration checklists, cost tradeoffs, and GTM-specific examples.

## Contribution principles

- Prefer tested workspace behavior over speculation.
- Link to the relevant Attio Help Center page when documenting product behavior.
- Keep examples GTM-specific: pipeline, routing, enrichment, outbound, product signals, fund workflows, and customer operations.
- Mark assumptions clearly.
- Do not publish private customer data, screenshots, or workspace-specific IDs.
- If a workflow can burn credits at scale, include the cost model and safety guard.

## Good first contributions

- Add a missing block gotcha.
- Add a recipe from a real GTM workflow.
- Improve a migration note for a legacy block.
- Add a troubleshooting error and exact fix.
- Update a page when Attio changes block behavior.

## Verification standard

For each reference page, aim to include:

- block type and credit cost
- inputs and outputs
- when to use it
- common gotchas
- one GTM example
- official source link

The goal is not to out-document Attio's official reference. The goal is to make builders faster and safer.

## Licensing

The handbook is dual-licensed:

- **Prose and documentation content** — [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/): share and adapt it non-commercially, with attribution, under the same license.
- **Code snippets, examples, and repository scripts** — MIT: use them anywhere, including commercial projects.

Full terms in [LICENSE.md](https://github.com/80x-djh/attio-workflows-handbook/blob/main/LICENSE.md). For commercial licensing of the prose (republishing, training datasets, paid products), email [dan@80x.ai](mailto:dan@80x.ai).

"Attio" is a trademark of Attio Ltd, used here nominatively to describe what the handbook documents.
