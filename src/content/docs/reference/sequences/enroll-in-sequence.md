---
title: Enroll in sequence
description: Enrolls a person record into an Attio email sequence.
sidebar:
  order: 1
page-type: block-reference
---

**Enroll in sequence** adds a person record as a recipient in an Attio sequence.

| | |
| --- | --- |
| **Type** | Sequence step |
| **Credit cost** | 1 credit |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Sequence | Yes | Sequence to enroll into. |
| Recipient | Yes | Must be a person record. |
| Sender | Yes | Workspace member sending the emails. |

## Outputs

- Enrolled successfully: true or false

## Gotchas

- Recipient must be a person record.
- The sender needs delegated sending enabled for the sequence.
- If the recipient is already enrolled, the workflow run does not fail.
- Filter for consent and suppression before this block.

## Example

Lead status becomes Ready for outbound -> Filter region/consent -> Enroll person in sequence.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
