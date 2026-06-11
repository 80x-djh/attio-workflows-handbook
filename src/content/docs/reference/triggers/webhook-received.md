---
title: Webhook received
description: Starts a workflow when an external system sends JSON to the workflow's webhook URL.
sidebar:
  order: 9
page-type: trigger-reference
---

**Webhook received** starts a workflow from an external HTTP request.

| | |
| --- | --- |
| **Type** | Trigger (external) |
| **Credit cost** | Free |

## Inputs

The block provides a webhook URL. Configure the external system to send requests to that URL with `Content-Type: application/json`.

## Outputs

- Webhook payload body
- Timestamp

## When to use it

Use it for product events, form submissions, partner leads, enrichment callbacks, or any system that should push data into Attio.

## Gotchas

- Follow it with [Parse JSON](/reference/utilities/parse-json/) before mapping payload fields.
- Validate with filters before writing records.
- Treat external payloads as untrusted. Types and optional fields matter.

## Example

Webhook received -> Parse JSON -> Create or update person -> Add record to inbound list -> Round robin owner.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
