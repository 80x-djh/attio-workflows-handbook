---
title: Round-robin lead routing
description: Assign inbound leads across a team using Attio's free Round robin block and one explicit write.
page-type: recipe
---

## Outcome

New qualified leads get assigned evenly across a selected set of users.

## Build

1. Trigger: [Record created](/reference/triggers/record-created/) on People, or [Record added to list](/reference/triggers/record-added-to-list/) on an inbound list.
2. Filter: lead is qualified and owner is empty.
3. [Round robin](/reference/workspace/round-robin/) with the eligible reps.
4. [Update record](/reference/records/update-record/) or [Update list entry](/reference/lists/update-list-entry/) to set owner.
5. Optional [Create task](/reference/tasks/create-task/) for first touch.

## Credit model

Trigger, Filter, and Round robin are free. Owner update costs 1 credit. Optional task costs 1 credit.

## Safety guard

Do not route records that already have an owner. If another workflow or import sets owner first, the filter should stop this run.

## Operating note

Round-robin fairness is only as good as the eligible user list. Remove people who are out of seat, out of territory, or not currently handling inbound.
