---
title: Stale deal sweep
description: Run a weekly pipeline hygiene workflow that finds stale deals and assigns follow-up tasks to owners.
page-type: recipe
---

## Outcome

Every Monday, find open deals with no recent activity and create a follow-up task for the owner.

## Build

1. Trigger: [Recurring schedule](/reference/triggers/recurring-schedule/) every Monday morning in the team's timezone.
2. [Find records](/reference/records/find-records/) on Deals with filters:
   - stage is not Won or Lost
   - last activity is before `now - 14 days`
   - owner is not empty
3. [Loop](/reference/utilities/loop/) over matching deals.
4. [Create task](/reference/tasks/create-task/) inside the loop:
   - task text: `Follow up on stale deal: {Deal name}`
   - assignee: deal owner
   - linked record: current deal
   - due date: today or +1 day via [Adjust time](/reference/calculations/adjust-time/)

## Credit model

Schedule, Find records, Loop, and Adjust time are free. Each task costs 1 credit.

If 30 deals are stale, the run costs 30 credits.

## Safety guard

While testing, set the Find records limit to 5 and the Loop limit to 5. Remove or raise the limit after the first successful run.

## Operator note

If reps ignore tasks, do not add more workflow logic. Fix the operating agreement first: what counts as stale, who owns the follow-up, and when managers review ignored tasks.
