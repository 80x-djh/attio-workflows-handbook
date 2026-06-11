---
title: Send HTTP request
description: Sends an HTTP request to an external system from a workflow.
sidebar:
  order: 3
page-type: block-reference
---

**Send HTTP request** calls an external URL.

| | |
| --- | --- |
| **Type** | Utility/external step |
| **Credit cost** | 1 credit |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Method | Yes | DELETE, GET, HEAD, PATCH, POST, or PUT. |
| URL | Yes | Static text, variables, or both. |
| Headers | No | Required auth/content headers, subject to platform restrictions. |
| Content-Type | Sometimes | Required when sending a body. |
| Body | No | Request payload. |

## Outputs

- HTTP status code
- HTTP response body
- Whether the response was successful

## Gotchas

- Timeout is 2 minutes.
- Parse JSON if the response body contains JSON you need downstream.
- Check success before writing returned data.

## Example

Company domain added -> Send HTTP request to enrichment API -> Parse JSON -> Update record.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
