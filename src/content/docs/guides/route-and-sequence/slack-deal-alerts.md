---
title: Slack deal alerts
description: Notify the revenue team when important deal stages change, without firing on every minor CRM edit.
page-type: recipe
---

## Outcome

When a deal moves into a meaningful stage, post a clear Slack message with the deal name, value, owner, and Attio URL.

## Build

1. Trigger: [Attribute value changed](/reference/triggers/attribute-value-changed/) on the deal stage attribute.
2. Filter: New value is one of `Qualified`, `Proposal`, `Won`, or whichever stages matter.
3. Optional Switch: branch message style by stage.
4. Slack integration block: post to `#revenue`, `#sales`, or an owner-specific channel.

## Credit model

Trigger is free. Filter and Switch are free. Slack post costs 1 credit when it executes.

Monthly estimate: number of matching stage changes x 1 credit.

## Safety guard

Do not use unscoped Record updated for stage alerts. If stage is a list attribute, use the list-scoped attribute or [List entry updated](/reference/triggers/list-entry-updated/).

## Message template

```text
**{Deal name}** moved to **{New value}**
Value: {Deal value}
Owner: {Deal owner}
Open in Attio: {Attio URL}
```

## Upgrade path

Add [Web agent](/reference/agents/web-agent/) before the Slack step for strategic accounts, but put a Filter before the agent so AI only runs on the deals that deserve research.
