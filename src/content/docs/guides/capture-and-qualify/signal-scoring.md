---
title: Signal scoring
description: Score product, web, or CRM signals with free logic first, then write one clean score back to Attio.
page-type: recipe
---

## Outcome

Turn multiple GTM signals into a single score and next action.

## Build

1. Trigger: [Webhook received](/reference/triggers/webhook-received/) from product analytics, or [Attribute value changed](/reference/triggers/attribute-value-changed/) on a signal field.
2. [Parse JSON](/reference/utilities/parse-json/) if the signal arrives externally.
3. [Formula](/reference/calculations/formula/) or [Execute code](/reference/calculations/execute-code/) for scoring.
4. [Switch](/reference/conditions/switch/) on score band:
   - high: assign owner and alert
   - medium: add to nurture list
   - low: update score only
5. [Update record](/reference/records/update-record/) or [Update list entry](/reference/lists/update-list-entry/).

## Credit model

Trigger, Parse JSON, Formula, and Switch are free. Execute code is variable. Each write or external alert costs credits.

## Safety guard

Keep score formulas explainable. If a rep cannot understand why a lead is high priority, the score will not change behavior.

## Simple score idea

```text
pricing_page_visit * 25
+ demo_request * 50
+ target_account * 30
+ recent_funding * 20
- student_email * 50
```
