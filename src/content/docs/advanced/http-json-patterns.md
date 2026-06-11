---
title: HTTP and JSON patterns
description: Patterns for using Webhook received, Send HTTP request, and Parse JSON in Attio Workflows.
page-type: guide
---

HTTP and JSON blocks let Attio participate in a broader GTM stack without moving the whole workflow to Zapier, Make, or a custom backend.

## Inbound pattern

```text
Webhook received -> Parse JSON -> Filter -> Create or update record -> Add record to list
```

Use this for forms, product events, partner leads, and enrichment callbacks.

## Outbound pattern

```text
Trigger -> Filter -> Send HTTP request -> Parse JSON -> Update record
```

Use this when an external system has the data or action Attio needs.

## JSON schema advice

- Paste a representative payload to generate the schema.
- Mark optional fields as optional.
- Use strings for IDs unless you truly need number math.
- Parse only fields the workflow needs.
- Follow Parse JSON with a Filter before writing anything.

## Timeout and failure behavior

Send HTTP request has a two-minute timeout. Treat every external call as unreliable: inspect success status, parse the response only when successful, and avoid making customer-visible writes if the response is partial.
