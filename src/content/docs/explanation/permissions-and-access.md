---
title: Permissions & workflow access
description: Workflows get no write access by default, access only escalates, and agents run as someone — the three permission models behind Attio workflows.
page-type: concept
---

Three separate permission systems touch every workflow you build. Knowing which one is biting you turns a confusing failure into a two-minute fix.

## 1. The workflow's own data access

**Workflows have no write access to objects by default.** A workflow that reads a deal fine can still fail to update it with *"This workflow does not have permission to write for this object"*.

- An admin (or a member with full access to the object) grants the workflow access: see [managing object access](https://attio.com/help/reference/managing-your-data/objects/manage-access-to-objects).
- **Relationship attributes need write access on both sides.** Updating "Deals ↔ Companies" links requires write on Deals *and* Companies — the half-granted version produces the same error, just intermittently, which makes it nastier to spot.
- Grant write access deliberately, object by object. A workflow with broad write access plus a wiring mistake can do a lot of damage at automation speed.

## 2. Who can see and edit the workflow

Workflow sharing (the **Share** button) has four levels: **Full access** (edit + manage access), **Read and write** (edit + publish), **Read only**, and **No access**. Note that managing access requires a paid plan, and team/member-level grants exist on Pro and Enterprise.

The rule that surprises people: **more specific settings can only grant *additional* access, never reduce it.** If workspace-wide access is Full, an individual "No access" assignment does nothing. So the sane configuration is:

1. Set **workspace access to the lowest level** anyone should have (often Read only).
2. Grant Full / Read-write upward to the specific people who maintain automations.

Anyone with edit rights can change live revenue automations — treat workflow access like production deploy rights, because that's what it is.

## 3. What agents inside workflows can touch

The [Custom agent](/reference/agents/custom-agent/) block adds a third model — **Run as**:

- **Run as the workflow:** the agent reads workspace-visible data (notes, call recordings) plus whatever objects/lists the workflow can read.
- **Run as a workspace member:** the agent reads *everything that member can access* — and that member must explicitly approve via **Share access** in their Ask Attio settings, and connect their own apps before the agent can use their MCP tools.

Practical guidance: default to running agents as the workflow with the minimum read tools enabled. Run-as-member is for genuinely personal contexts (a digest of *my* meetings), not a convenience shortcut — you're impersonating their access, and offboarding that member later breaks the workflow. Also remember **web access** on an agent means external page content can influence agent behavior; enable it only when the task actually needs the web.

## Debug flow for permission errors

1. Error mentions **"permission to write"** → model 1. Have an admin grant the workflow write access to the object — and check both sides of any relationship attribute involved.
2. A teammate **can't see or edit** the workflow → model 2. Check Share settings, remembering access only escalates from the workspace default.
3. An **agent returns empty answers** it should know → model 3. Check the agent's tool access list, and whether its Run-as member ever approved the access request.
