---
title: Block changes reference
description: Renamed and changed blocks/options to check when migrating from legacy workflows to the new Attio Workflows builder.
page-type: guide
---

Use this page when a legacy block name does not appear in the new builder, or a migrated workflow looks right but behaves differently.

| Legacy workflows | New Workflows | Migration note |
| --- | --- | --- |
| Attribute changed | Attribute value changed | Same core purpose, clearer name. It fires when a value is set at creation or changed later. |
| If/else | If | Same decision pattern with updated naming. |
| Guidance on Summarize record | Instructions | Re-check prompts after migration. |
| Prompt completion | Custom agent subset | Put prompt-style generation into Custom agent instructions. |
| Research record | Web agent | Token-priced and more capable; re-test credit cost. |
| Condition 1, Condition 2 path labels | Case 1, Case 2 labels | Cases are customizable. Name them for the business path. |
| Confetti celebration | Ceiling drop | Option rename. |
| Overwrite multi-select values | Replace values | Especially important on Create or update record. |
| Slack markdown syntax | Standard markdown | Re-test links, mentions, and formatting. |
| Record URL variable | Attio URL variable | Rewire if the migrated message points to the wrong URL field. |
| Canvas notes | Not available | Move durable notes into the workflow description or external docs. |

## Manual review checklist

- Variables that reference created/updated records.
- Filters that depended on previous/new values.
- Multi-select update behavior.
- Slack payload formatting.
- Sequence sender permissions.
- Any block that writes to the same object or list that triggered the workflow.

Source: [Attio Help Center - Migrate your legacy workflows](https://attio.com/help/reference/automations/workflows/migrate-your-legacy-workflows).
