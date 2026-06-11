---
title: Sequence enrollment
description: Enroll the right person in an Attio sequence when a deal, lead, or account reaches the correct stage.
page-type: recipe
---

## Outcome

Move a contact into a sequence at the moment a record enters an outbound-ready stage.

## Build

1. Trigger: [Attribute value changed](/reference/triggers/attribute-value-changed/) on the status/stage attribute.
2. Filter: New value is `Ready for outbound`.
3. Optional Filter: contact email is present and unsubscribed is not true.
4. [Enroll in sequence](/reference/sequences/enroll-in-sequence/):
   - sequence: selected sequence
   - recipient: person record
   - sender: owner or fixed sender
5. Optional [Update record](/reference/records/update-record/) to stamp `Sequence enrolled at`.

## Credit model

Trigger and filters are free. Enroll in sequence costs 1 credit when it succeeds. Optional update costs 1 credit.

## Safety guard

The recipient must be a person record. A company, list entry, or string email will fail. If your trigger starts from a company or deal, use the relationship attribute that points to the person, or add a Find records step to locate the right person.

## Deliverability guard

Workflow logic is not consent logic. Keep opt-out, region, role, and suppression fields in the data model and filter before enrollment.
