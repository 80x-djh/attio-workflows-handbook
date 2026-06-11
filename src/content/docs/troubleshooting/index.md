---
title: Troubleshooting
description: Debugging guides for Attio Workflows runs, missing triggers, broken variables, failed permissions, loops, and credit surprises.
sidebar:
  order: 1
page-type: landing
---

When a workflow fails, do not start by editing blocks. Start in the run viewer.

Core pages:

- [Common errors](/troubleshooting/common-errors/)
- [Production runbook](/troubleshooting/runbook/)

## Debugging method

1. Open the failed run.
2. Click the red block or the unexpected block.
3. Inspect Inputs.
4. Inspect the upstream Outputs that fed those inputs.
5. Decide whether the bug is source data, variable wiring, block configuration, permissions, or external system behavior.
6. Trigger a fresh run after fixing. Do not rely on retrying an old run to validate a new published version.

Source: [Attio Help Center - Troubleshooting workflows](https://attio.com/help/reference/automations/workflows/troubleshooting-workflows).
