---
title: Parse JSON
description: Converts a JSON string into structured variables for later workflow blocks.
sidebar:
  order: 2
page-type: block-reference
---

**Parse JSON** turns JSON text into typed outputs.

| | |
| --- | --- |
| **Type** | Utility step |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Input | Yes | JSON string, often from Webhook received or Send HTTP request. |
| Schema | Yes | Generated from sample JSON or created manually. |
| Root type | Yes | Top-level JSON structure. |
| Properties | Yes | Fields and types to extract. |

## Outputs

- Parsed values based on the schema

## Gotchas

- Missing optional values return empty.
- Type mismatches fail the block.
- Parse only fields the workflow actually uses.

## Example

Webhook received -> Parse JSON email/domain/source -> Create or update person.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
