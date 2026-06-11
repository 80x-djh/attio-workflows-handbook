---
title: Custom agent
description: Runs a configurable AI agent inside a workflow, with optional Attio data, web access, and MCP-connected app tools.
sidebar:
  order: 1
page-type: block-reference
---

**Custom agent** runs an AI agent as a workflow step.

| | |
| --- | --- |
| **Type** | Agent step |
| **Credit cost** | Variable, token-based |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Prompt | Yes | Instructions for the agent. Pass context in with variables. |
| System prompt | No | Advanced role/rules/instructions. |
| Model | Yes | OpenAI, Google, or Anthropic model selection. |
| Tool access | No | Optional read-only Attio data, web access, and MCP-enabled app tools. |
| Run as | Sometimes | Controls whose credentials and visibility the agent uses. |

## Outputs

- Custom agent response

## When to use it

Use Custom agent when the workflow needs judgment: classify messy text, synthesize notes, research with tools, or decide the next action from mixed context.

## Gotchas

- The agent has no useful context unless you pass variables or grant tool access.
- Outputs are not saved automatically. Follow with Update record or Update list entry.
- Tool access can expose broad workspace context depending on Run as settings. Be deliberate.
- Filter before the agent to control token spend.

## Example

Record command on Company -> Custom agent reads notes and call recordings -> Update record with "Account brief" -> Slack DM to owner.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
