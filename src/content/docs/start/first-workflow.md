---
title: Build your first workflow
description: A complete walkthrough — build, test, and publish a deal-stage Slack alert workflow in about ten minutes, and learn the canvas, variables, and publishing model on the way.
page-type: guide
---

We'll build the classic first workflow: **when a deal moves to a new stage, post an alert with the deal's details**. It's simple, it touches every fundamental (trigger, filter, variables, an action, publishing), and it's genuinely useful.

If you don't have Slack connected, swap step 4 for a [Create task](/reference/tasks/create-task/) block — everything else is identical.

## Before you start

- Workflows live under **Automations → Workflows** in the left sidebar.
- You build in a **draft**; nothing runs until you **publish**.
- Workflows don't have write access to objects by default — for this read-only alert that's fine, but bookmark [permissions](/concepts/permissions-and-access/) for when you build something that writes.

## Step 1 — Create the workflow

1. Go to **Automations → Workflows** and click **Create workflow**.
2. Click the **Untitled Workflow** name in the top-left and call it something a colleague would understand: `Deal stage → Slack alert`.
3. Add a one-line description. Future-you will be grateful.

> **The Ask Attio shortcut:** you could type *"When a deal's stage changes, post the deal name, value, and new stage to #revenue"* into the **Describe your workflow…** box and let the agent build this. Do it manually once first — debugging agent-built workflows requires exactly the block knowledge this walkthrough teaches.

## Step 2 — Add the trigger

1. Press `B` (or click **Add block**) and choose **Attribute value changed**.
2. Set **Object or List** to **Deals**.
3. Set **Attribute** to **Deal stage**.

Why this trigger and not **Record updated**? Because *Record updated does not fire when an attribute is first set during record creation*. A deal created directly into "Won" would silently skip your workflow. **Attribute value changed** catches both creation-time values and later changes — this distinction is the single most common trigger mistake. See [choosing the right trigger](/concepts/triggers/).

## Step 3 — Filter to the stages you care about

You probably don't want an alert for *every* stage change.

1. Add a **[Filter](/reference/conditions/filter/)** block after the trigger.
2. Add a condition: **New value → is → Won** (or whichever stage matters).

A Filter block silently stops the run when its conditions aren't met — no error, no alert. If you want different messages for different stages, use a [Switch](/reference/conditions/switch/) block here instead.

## Step 4 — Post the message

1. Add the Slack **Post message to channel** block (available once the [Slack app](https://attio.com/help/apps/automations-apps/slack-app) is connected).
2. Pick your channel.
3. Write the message and click **{x} use variable** to inject live data:

```
🎉 {Deal name} just moved to {New value}
Value: {Deal value} · Owner: {Deal owner}
```

Each `{…}` is a variable pulled from the trigger's outputs. This is [data passing](/concepts/variables/) — outputs from earlier blocks become inputs to later ones. Note the new engine uses **standard markdown** in Slack messages, not Slack's own markup (a [change from legacy](/migration/block-changes/)).

## Step 5 — Publish and test

1. Click **Publish workflow**. Attio highlights any misconfigured blocks in red; fix and re-publish.
2. Trigger it for real: move a test deal into the target stage.
3. Open the **Runs** tab. You'll see the run, the path it took (green arrows), and each block's inputs and outputs — the [run viewer](/concepts/runs-and-debugging/) is where you'll live when things misbehave.

**What did that cost?** The trigger is free, the Filter is free, and the Slack post is 1 credit. One credit per alert. Understanding this arithmetic *before* publishing matters a lot more for loops and AI blocks — read [credits & pricing](/start/credits-and-pricing/) next.

## Where this pattern goes next

This trigger → filter → act shape is the skeleton of most GTM automation:

- Swap the action for [Enroll in sequence](/reference/sequences/enroll-in-sequence/) → stage-based outbound ([recipe](/recipes/sequence-enrollment/))
- Swap the trigger for [Webhook received](/reference/triggers/webhook-received/) → product-signal intake ([recipe](/recipes/webhook-lead-intake/))
- Add a [Web agent](/reference/agents/web-agent/) before the Slack post → research attached to every alert ([recipe](/recipes/inbound-lead-research/))

*Source of truth: [Create a workflow](https://attio.com/help/reference/automations/workflows/create-a-workflow).*
