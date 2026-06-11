---
title: What's new in the 2026 Workflows engine
description: Attio replaced its workflows engine in June 2026 — AI agent blocks, custom JavaScript, MCP access, multi-trigger workflows, and a cheaper credit model.
page-type: guide
---

In June 2026 Attio shipped a new Workflows engine and closed the old one to new creation — you can no longer create legacy workflows; existing ones keep running, and Attio says sunset notice will come "well in advance." This isn't a facelift; it's a different product with a different pricing model. Here's what actually changed and why it matters.

## The headline changes

### 1. Agents are now workflow steps

The biggest shift: AI agents run *inside* workflows.

- **[Custom agent](/reference/agents/custom-agent/)** — a configurable AI agent (OpenAI, Google, or Anthropic models) as a workflow step, with optional read access to your Attio data (records, notes, emails, call recordings), web access, and **MCP-connected app tools**. This is the block that turns workflows from automation into orchestration.
- **[Web agent](/reference/agents/web-agent/)** — the old "Research record" block, rebuilt: ask questions about a record and the agent researches across the web.
- **Agent builder** — describe a workflow in natural language in the canvas and Ask Attio assembles it, block by block, live.

### 2. Custom code, natively

The **[Execute code](/reference/calculations/execute-code/)** block runs arbitrary JavaScript as a step — you export a `main(inputs)` function and its return value becomes the block's output. Data transformations, custom scoring, payload shaping: things that used to require an external webhook round-trip now run inline. 100-second timeout.

### 3. Most blocks are now free

The credit model was rebuilt in your favor. Triggers, logic, and data lookups are free. Credits are only consumed when a block writes data, sends or receives something externally, or uses AI.

| What | Legacy | New engine |
| --- | --- | --- |
| Logic, lookups, delays | 1 credit | **Free** |
| Writes & external sends (Slack, HTTP, sequences) | 1 credit | 1 credit |
| AI blocks | 1–10 credits fixed | **Token-based (variable)** |

Read-heavy, logic-heavy workflows got dramatically cheaper. AI-heavy workflows became variable-cost — see [credits & pricing](/reference/credits-and-pricing/) for the full per-block table and how to reason about variable cost.

### 4. Builder quality-of-life

- **Multi-trigger workflows** — one workflow, several starting events, with [advanced variables](/explanation/variables/#multiple-data-sources-and-fallbacks) to handle whichever trigger fired.
- **Copy/paste blocks** between workflows and even **between workspaces** (consultants, rejoice).
- **Retry, pause, resume** on in-flight runs, plus [retry-from-failed](/explanation/runs-and-debugging/#rerun-and-retry).
- Drag blocks from the sidebar, visual JSON editor for HTTP payloads, drop blocks straight into loops.
- **Custom workflow blocks** via the [App SDK](/guides/platform-patterns/app-sdk-custom-blocks/) and new ecosystem blocks (Webflow, Notion, Linear, and more).

## What this means in practice

**If you have legacy workflows running:** they keep running, and Attio says sunset notice will come "well in advance" — but new capability and the cheaper pricing only exist in the new engine. Several blocks were renamed and a few behave differently. Follow the [migration guide](/guides/migrating-from-legacy/) and check the [block changes reference](/guides/migrating-from-legacy/block-changes/) before you rebuild.

**If you're starting fresh:** ignore legacy entirely. Learn the new engine's [block library](/reference/) and the handful of [core concepts](/explanation/triggers/) that everything else hangs off.

**If you're a GTM engineer:** the combination of webhook triggers + Execute code + Custom agent + HTTP requests means Attio can now host logic you'd previously run in Zapier, Make, or Clay. Whether you *should* move it is a judgment call — the [recipes](/guides/) section shows where workflows genuinely win.

*Sources: [Migrate your legacy workflows](https://attio.com/help/reference/automations/workflows/migrate-your-legacy-workflows), [Attio changelog](https://attio.com/changelog).*
