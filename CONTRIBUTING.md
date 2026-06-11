# Contributing

Thanks for helping keep this handbook accurate. It only stays useful if every claim in it can be trusted, so the bar for contributions is sourcing, not volume.

## What we want

- **Corrections with sources** — anything in the handbook that is wrong or out of date, with a link to the official Attio docs/changelog or evidence from a real workspace.
- **Verified gotchas** — surprising engine behavior (trigger timing, credit consumption, filter edge cases) that you have actually hit.
- **Recipes from real workspaces** — workflows you run in production, anonymized.
- **Migration mappings** — Zapier/Make/n8n/custom-script patterns mapped to their Workflows equivalents.

## The bar

Every behavioral or cost claim needs **one** of:

1. A link to an official Attio source (docs, changelog, help center), or
2. A `verified in workspace on <date>` note describing what you observed.

PRs without sourcing are closed. "It probably works like X" is not a contribution.

## Before you write

Read `STYLE.md` first. Page anatomy (frontmatter, section order, See also) is enforced by CI:

```sh
npm run build
node scripts/check-pages.mjs
```

Both must pass before a PR can merge.

## Running locally

```sh
npm install
npm run dev
```

## PR checklist

- [ ] `page-type` frontmatter set correctly
- [ ] "See also" section present
- [ ] Example values are realistic (real-looking object/attribute names, not `foo`/`bar`)
- [ ] No restated credit tables — link to [/start/credits-and-pricing/](https://handbook.80x.ai/start/credits-and-pricing/) instead
- [ ] Every behavioral/cost claim is sourced (link or verification note)
- [ ] `npm run build` and `node scripts/check-pages.mjs` pass

## Licensing of contributions

Inbound = outbound: by submitting a PR you agree your contribution is licensed under the terms in [LICENSE.md](./LICENSE.md) — prose under CC BY-NC-SA 4.0, code under MIT.

## Conduct

Be kind. Assume good faith in reviews. AI-generated text is fine as a drafting tool, but unverified AI-generated slop is not — if you didn't check it against a source or a workspace, don't submit it.
