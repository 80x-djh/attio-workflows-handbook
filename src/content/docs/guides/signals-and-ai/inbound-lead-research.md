---
title: Inbound lead research
description: Research high-intent inbound companies with an agent, save the summary, and notify the owner.
page-type: recipe
---

## Outcome

When a qualified inbound lead appears, research the company, save the answer to Attio, and notify the revenue team.

## Build

1. Trigger: [Record added to list](/reference/triggers/record-added-to-list/) on the inbound leads list, or [Webhook received](/reference/triggers/webhook-received/) from a form/product event.
2. Filter: only continue when email/domain/company size/source meets your ICP threshold.
3. [Web agent](/reference/agents/web-agent/) on the company record. Ask 2-4 specific questions:
   - What does this company sell?
   - Who is the likely buyer?
   - Why might they need our product now?
   - What is a relevant first line for outreach?
4. [Update record](/reference/records/update-record/) to save the summary to a text attribute.
5. Slack integration block or [Create task](/reference/tasks/create-task/) for the owner.

## Credit model

Filter is free. Web agent is variable token-priced. Update record is 1 credit. Slack is 1 credit.

Sample 10 leads first and inspect actual credit usage in the run viewer.

## Safety guard

Do not run Web agent on every raw lead. Filter before AI. Start with Record command if humans should choose when research is worth the cost.

## Better prompt

```text
Research this company for a B2B sales rep. Return:
1. one-sentence company summary
2. likely business model
3. why they may have urgency now
4. one concise outreach angle

Avoid unsupported claims. If you cannot verify something, say so.
```
