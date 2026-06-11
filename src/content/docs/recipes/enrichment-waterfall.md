---
title: Enrichment waterfall
description: Use filters, HTTP requests, and create/update blocks to enrich records only when data is missing.
page-type: recipe
---

## Outcome

Fill missing company or person fields without paying external or AI costs on records that already have good data.

## Build

1. Trigger: [Record command](/reference/triggers/record-command/) for human-controlled enrichment, or [Attribute value changed](/reference/triggers/attribute-value-changed/) when a domain/email is set.
2. Filter: required lookup key exists.
3. Filter: enrichment fields are empty.
4. [Send HTTP request](/reference/utilities/send-http-request/) to the enrichment provider.
5. [Parse JSON](/reference/utilities/parse-json/) for the fields you need.
6. [Update record](/reference/records/update-record/) with only trusted fields.

## Credit model

Filters and Parse JSON are free. HTTP request costs 1 credit. Update record costs 1 credit. Provider costs are separate.

## Safety guard

Never overwrite human-verified fields by default. Use separate source fields such as `Enriched industry` or only update empty attributes.

## Upgrade path

Add [Custom agent](/reference/agents/custom-agent/) after enrichment for judgment calls like ICP fit, but only after deterministic enrichment has done the cheap work.
