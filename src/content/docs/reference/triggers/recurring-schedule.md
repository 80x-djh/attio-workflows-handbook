---
title: Recurring schedule
description: Starts a workflow on a daily, weekly, monthly, or cron-based schedule.
sidebar:
  order: 11
page-type: trigger-reference
---

**Recurring schedule** starts a workflow at a configured time.

| | |
| --- | --- |
| **Type** | Trigger (scheduled) |
| **Credit cost** | Free |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Frequency | Yes | Daily, weekly, monthly, or advanced cron |
| Timezone | Yes | Controls when the schedule fires |
| Frequency settings | Yes | Time of day, day of week, day of month, or cron expression |

## Outputs

- Timestamp

## When to use it

Use it for pipeline sweeps, daily digests, stale account tasks, renewal checks, and periodic data hygiene.

## Gotchas

- Scheduled workflows usually begin with Find records or Find list entries, so set limits while testing.
- Check the workflow timezone in Settings.
- If the run writes many records in a loop, estimate worst-case credits before publishing.

## Example

Every Monday 9:00 -> Find stale open deals -> Loop -> Create task for owner.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
