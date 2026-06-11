---
title: AI agents playbook
description: How to use Web agent and Custom agent blocks without turning every workflow into an expensive black box.
page-type: guide
---

Agent blocks are powerful because they can make judgment calls. They are risky for the same reason.

## Use agents when

- the input is messy text or public web context
- deterministic rules would be brittle
- the value of a good answer is higher than the token cost
- a human can tolerate occasional uncertainty

## Avoid agents when

- a filter, formula, or lookup can decide the answer
- the workflow runs at high volume
- the result directly changes customer-facing communication without review
- the needed source is private, login-gated, or unreliable

## Prompt pattern

```text
You are helping a B2B revenue team qualify an account.

Use only the provided record data and web evidence you can verify.
Return:
1. concise summary
2. qualification signal
3. uncertainty or missing evidence
4. recommended next action

If you cannot verify a claim, say "unknown".
```

## Save outputs deliberately

Agent outputs are not saved automatically. Follow the agent with [Update record](/reference/records/update-record/) or [Update list entry](/reference/lists/update-list-entry/) and map the answer into a text attribute.

## Cost guard

Filter before the agent. Test 10 representative runs. Use the run viewer to inspect token-priced credit usage before publishing to a high-volume trigger.
