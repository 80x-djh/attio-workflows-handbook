---
title: Third-party blocks
description: Connected apps can add workflow triggers and actions for Slack, Outreach, Mailchimp, Mixmax, Typeform, Webflow, Notion, Linear, and more.
page-type: guide
---

Third-party blocks come from connected apps. They let workflows receive events from external systems or push actions out to them.

## Common uses

- Slack alerts for stage changes and new inbound leads
- Typeform or form intake
- Outreach or sequence activity
- Mailchimp or campaign sync
- Webflow, Notion, Linear, and other ecosystem actions
- Custom app blocks built with the App SDK

## Credit cost

Integration blocks that send or receive externally generally cost 1 credit when executed. Check the block sidebar while configuring; fixed-cost blocks show their cost, AI blocks show dynamic, and free blocks show no cost.

## Gotchas

- Connect the app before building with its blocks.
- Credential ownership matters. If the app connection belongs to one member, plan for what happens when that member leaves.
- Treat external writes as production operations. Add filters and test with safe records.
- If a generic HTTP request becomes a repeated pattern, consider a custom workflow block.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
