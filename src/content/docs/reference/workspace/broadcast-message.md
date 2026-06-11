---
title: Broadcast message
description: Shows an in-app popup notification to selected workspace users.
sidebar:
  order: 3
page-type: block-reference
---

**Broadcast message** shows a popup notification in Attio.

| | |
| --- | --- |
| **Type** | Workspace step |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Style | Yes | Neutral, success, warning, or error. |
| Target | Yes | Users who should see it. |
| Title | Yes | Message title. |
| Description | No | Message body. |
| Duration | Yes | How long the popup remains visible. |

## Gotchas

- Broadcasts are free in the new engine, but still interrupt humans. Use them for high-signal events.
- Slack may be better for durable team visibility.

## Example

High-priority inbound lead routed -> Broadcast warning to assigned owner.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
