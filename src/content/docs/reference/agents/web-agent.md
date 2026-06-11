---
title: Web agent
description: Researches a record across the web and returns answers that can be used later in the workflow.
sidebar:
  order: 2
page-type: block-reference
---

**Web agent** researches a record with AI and web search.

| | |
| --- | --- |
| **Type** | Agent step |
| **Credit cost** | Variable, token-based |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Record | Yes | Must be a record, not a list entry. |
| Questions | Yes | One or more specific research questions. |

## Outputs

- Answers to each configured question

## When to use it

Use it for company briefs, qualification research, outbound angles, market context, and account prep.

## Gotchas

- It cannot research a list entry directly. Pass the parent record.
- Some websites are private or login-gated; the agent may not reliably use them.
- More questions and broader prompts increase token cost.
- Save answers explicitly with an Update step if they need to persist.

## Example

Record added to high-intent inbound list -> Filter ICP fit -> Web agent asks three qualification questions -> Update company research notes -> Slack alert.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
