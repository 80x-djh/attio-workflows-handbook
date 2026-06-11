---
title: Execute code
description: Runs custom JavaScript inside a workflow and exposes the returned value downstream.
sidebar:
  order: 1
page-type: block-reference
---

**Execute code** runs a custom JavaScript function.

| | |
| --- | --- |
| **Type** | Calculation step |
| **Credit cost** | Variable, complexity-based |

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Code | Yes | Must export a function named `main` (sync or async) that receives `inputs`. |

The function receives configured inputs as one object and whatever it returns becomes the block output.

```js
export async function main(inputs) {
  return { score: 42 };
}
```

## Outputs

- The value returned by `main`

## Gotchas

- Timeout is 100 seconds.
- Keep code deterministic when it controls writes.
- Use it for transformations, scoring, and payload shaping before reaching for an external service.

## Example

Parse JSON -> Execute code to normalize source fields -> Update record.

Source: [Attio Workflows block library](https://attio.com/help/reference/automations/workflows/workflows-block-library).
