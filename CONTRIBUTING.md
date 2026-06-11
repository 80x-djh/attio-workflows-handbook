# Contributing

Thanks for helping keep this handbook accurate. It only stays useful if every claim in it can be trusted, so the bar for contributions is sourcing, not volume.

## What we want

- **Corrections with sources.** Anything in the handbook that is wrong or out of date, with a link to the official Attio docs/changelog or evidence from a real workspace.
- **Verified gotchas.** Surprising engine behavior (trigger timing, credit consumption, filter edge cases) that you have actually hit.
- **Recipes from real workspaces.** Workflows you run in production, anonymized.
- **Migration mappings.** Zapier/Make/n8n/custom-script patterns mapped to their Workflows equivalents.

## The bar

Every behavioral or cost claim needs **one** of:

1. A link to an official Attio source (docs, changelog, help center), or
2. A documented workspace observation describing what you saw and when.

PRs without sourcing are closed. "It probably works like X" is not a contribution.

## Before you write

Read [STYLE.md](./STYLE.md). It is the enforced writing standard (MDN-style page anatomy, Mintlify components, fact discipline). Then preview and check your change locally:

```sh
npm i -g mint
cd mintlify
mint dev             # preview
mint validate        # strict build: must pass
mint broken-links    # must report no broken links
```

Mintlify also validates the build on every deploy, so a PR that breaks the build or a link is caught before it goes live.

## PR checklist

- [ ] Page follows the anatomy for its type in [STYLE.md](./STYLE.md) (opening summary, section order, `## See also`)
- [ ] Mintlify components only, no Starlight `:::` asides, no Astro imports
- [ ] Internal links are root-relative with no trailing slash, and resolve (`mint broken-links` passes)
- [ ] Example values are realistic (`jane@acme.com`, `Priya Sharma`), never `foo`/`bar`/`test123`
- [ ] No restated credit tables; link to [/reference/credits-and-pricing](https://handbook.80x.ai/reference/credits-and-pricing) instead
- [ ] Every behavioral/cost claim is sourced (official link or a workspace observation)

## Licensing of contributions

Inbound = outbound: by submitting a PR you agree your contribution is licensed under the terms in [LICENSE.md](./LICENSE.md), with prose under CC BY-NC-SA 4.0 and code under MIT.

## Conduct

Be kind. Assume good faith in reviews. AI-generated text is fine as a drafting tool, but unverified AI-generated slop is not. If you didn't check it against a source or a workspace, don't submit it.
