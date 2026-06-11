---
title: Block reference overview
description: Every Attio Workflows block — 11 triggers and 33 steps across agents, AI, records, lists, sequences, tasks, calculations, conditions, delays, workspace, and utilities — with credit costs.
page-type: landing
---

Every workflow is assembled from the blocks on this page. Each block has its own reference page with inputs, outputs, credit cost, gotchas, and a worked example. Pages follow a fixed schema, so once you've read one you can skim them all.

**How credit costs work in one line:** triggers, logic, and lookups are free; writes and external calls are 1 credit; AI is token-priced. Full detail in [credits & pricing](/reference/credits-and-pricing/).

## Triggers

Triggers start workflow runs. All triggers are **free**.

| Block | Fires when | |
| --- | --- | --- |
| [Record command](/reference/triggers/record-command/) | A person clicks Run workflow on records | Manual |
| [Record created](/reference/triggers/record-created/) | A new record is created in an object | Automatic |
| [Record updated](/reference/triggers/record-updated/) | An object attribute changes after creation | Automatic |
| [List entry command](/reference/triggers/list-entry-command/) | A person runs it on selected list entries | Manual |
| [Record added to list](/reference/triggers/record-added-to-list/) | A record joins a list | Automatic |
| [List entry updated](/reference/triggers/list-entry-updated/) | A list attribute changes after the entry exists | Automatic |
| [Attribute value changed](/reference/triggers/attribute-value-changed/) | An attribute is set or changed — *including at creation* | Automatic |
| [Task created](/reference/triggers/task-created/) | Any new task is created | Automatic |
| [Webhook received](/reference/triggers/webhook-received/) | An external system POSTs to the workflow's URL | External |
| [Manual run](/reference/triggers/manual-run/) | You click Trigger workflow in the editor | Manual |
| [Recurring schedule](/reference/triggers/recurring-schedule/) | A daily/weekly/monthly/cron schedule fires | Scheduled |

Not sure which? Use the [trigger decision guide](/explanation/triggers/).

## Steps

### Agents
[Custom agent](/reference/agents/custom-agent/) · [Web agent](/reference/agents/web-agent/)

### AI
[Classify record](/reference/ai/classify-record/) · [Classify text](/reference/ai/classify-text/) · [Summarize record](/reference/ai/summarize-record/)

### Records
[Create record](/reference/records/create-record/) · [Create or update record](/reference/records/create-or-update-record/) · [Update record](/reference/records/update-record/) · [Find records](/reference/records/find-records/)

### Lists
[Add record to list](/reference/lists/add-record-to-list/) · [Update list entry](/reference/lists/update-list-entry/) · [Delete list entry](/reference/lists/delete-list-entry/) · [Find list entries](/reference/lists/find-list-entries/)

### Sequences
[Enroll in sequence](/reference/sequences/enroll-in-sequence/) · [Exit from sequence](/reference/sequences/exit-from-sequence/)

### Tasks
[Create task](/reference/tasks/create-task/) · [Complete task](/reference/tasks/complete-task/)

### Calculations
[Execute code](/reference/calculations/execute-code/) · [Adjust time](/reference/calculations/adjust-time/) · [Aggregate values](/reference/calculations/aggregate-values/) · [Formula](/reference/calculations/formula/) · [Random number](/reference/calculations/random-number/)

### Conditions
[Filter](/reference/conditions/filter/) · [If](/reference/conditions/if/) · [Switch](/reference/conditions/switch/)

### Delays
[Delay](/reference/delays/delay/) · [Delay until](/reference/delays/delay-until/)

### Workspace
[Round robin](/reference/workspace/round-robin/) · [Celebration](/reference/workspace/celebration/) · [Broadcast message](/reference/workspace/broadcast-message/)

### Utilities
[Loop](/reference/utilities/loop/) · [Parse JSON](/reference/utilities/parse-json/) · [Send HTTP request](/reference/utilities/send-http-request/)

### Third-party blocks
Connected apps contribute their own triggers and actions — Slack, Outreach, Mailchimp, Mixmax, Typeform, and newer ecosystem blocks like Webflow, Notion, and Linear. See [third-party blocks](/reference/integrations/).

*Source of truth: [Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library) — verification in progress; see each block page's Source line.*
