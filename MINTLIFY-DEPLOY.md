# Deploying the handbook on Mintlify

The Mintlify site lives in [`mintlify/`](./mintlify): a `docs.json` plus 96 MDX pages, migrated from the original Starlight site (which is untouched under `src/` + `astro.config.mjs` on the `main` branch).

## Local preview & checks

```sh
cd mintlify
mint dev              # local preview at http://localhost:3000
mint validate         # strict build check — exits non-zero on any error
mint broken-links     # verify every internal link resolves
```

As of this migration, `mint validate` and `mint broken-links` both pass.

## Deploy

The docs root (the folder containing `docs.json`) is `mintlify/`, not the repo root. Two options:

1. **Subfolder deploy (no file moves).** In the Mintlify dashboard, connect this GitHub repo and set the **content / docs directory** to `mintlify`.
2. **Root deploy.** Move the contents of `mintlify/` to the repo root (`git mv mintlify/* .`) so `docs.json` sits at the top level, then connect the repo with the default settings.

Either way, point your custom domain (`handbook.80x.ai`) at the Mintlify deployment in the dashboard.

## What the rewrite did

Every page was rewritten to **MDN Web Docs style** — fixed per-page-type anatomy, opening-summary-as-description, second-person present-tense voice, curated `See also`, realistic example values — and converted from Starlight to Mintlify MDX (`:::` asides → `<Note>`/`<Warning>`/`<Tip>`, build steps → `<Steps>`, index pages → `<CardGroup>`). The writing standard is `research/mintlify-mdn-spec.md`.

The Diátaxis information architecture is preserved as Mintlify tabs: **Learn → Guides → Reference → Explanation → Troubleshooting → Pro**. All 30 legacy URL redirects from the Starlight `astro.config.mjs` are ported into `docs.json`.

## Before you flip any "Verified" promise — launch gate

Page Source lines say *"Last reviewed against the Attio Help Center, June 2026"* — an honest claim that the prose is sourced from official docs. They deliberately do **not** claim live-workspace verification. The per-claim verification pass (`research/verification-checklist.md`, `research/claims-registry.csv`) is still the author's gate before publishing any stronger "verified in workspace" promise. A few reference pages reconstruct an output variable slug (e.g. `adjusted_timestamp`) or a plan-availability row by house convention; confirm those in `customobject` during that pass.
