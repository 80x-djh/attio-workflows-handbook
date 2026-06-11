# CLAUDE.md

## Project

The Attio Workflows Handbook is an open-source **Mintlify** documentation site. It is an MDN-quality, community-maintained guide to Attio's new Workflows engine (shipped June 9, 2026). It covers every block, every credit cost, and real GTM recipes. Written by Dan Hull, a consultant who builds Attio workspaces for VC funds and startups; not affiliated with Attio Ltd. Audience: Attio admins, RevOps engineers, and consultants who need accurate, sourced answers the official docs don't give them. License: prose/content CC BY-NC-SA 4.0, code snippets/scripts MIT.

- Site: https://handbook.80x.ai
- Repo: github.com/80x-djh/attio-workflows-handbook

## Structure

The documentation lives in **`mintlify/`** (the docs root that contains `docs.json`):

- `mintlify/docs.json`: navigation (six tabs: Learn, Guides, Reference, Explanation, Troubleshooting, Pro), theme, redirects.
- `mintlify/<section>/*.mdx`: content pages. Internal links are root-relative with no trailing slash, e.g. `/reference/records/create-record`.
- Section landings are `mintlify/<section>.mdx` (siblings of the section folder); the home is `mintlify/index.mdx`.

Mintlify deploys the repo automatically via its GitHub App, reading `docs.json` from the `mintlify/` subdirectory. See `MINTLIFY-DEPLOY.md`.

## Commands

```sh
npm i -g mint                  # one-time: install the Mintlify CLI
cd mintlify && mint dev        # local preview
cd mintlify && mint validate   # strict build (must pass before push)
cd mintlify && mint broken-links
cd mintlify && mint a11y       # color contrast + image alt text
```

## Hard editorial rules

These phrasings are canonical. Use them verbatim; do not paraphrase.

- **Legacy workflows:** "You can no longer create new legacy workflows; existing ones keep running, and Attio says sunset notice will come 'well in advance.'" Never say "deprecated."
- **Execute code cost:** "Variable (complexity-based)".
- **Agent tool access:** read-only via "Run as".
- **Credit caps:** per-workflow credit caps were removed. Do not document them as current.
- **OpenAI models:** name them only "GPT" (no version numbers).

## Facts and sourcing

- **One canonical fact layer:** the full credit table and plan allowances live ONLY on `/reference/credits-and-pricing`. Every other page links to it; never duplicate the table.
- Every claim needs an official source (Attio docs, changelog, help center) or a documented workspace observation. Page Source lines read "Last reviewed against the Attio Help Center, June 2026". Do **not** write a "verified in workspace" stamp until that verification has actually been done (see `research/verification-checklist.md`).
- attio.com 404s non-browser user agents. Always check with a browser UA, e.g. `curl -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"`.
- All screenshots and workflow tests come from Dan's own workspace (`customobject`), NEVER from client workspaces.

## Writing standard

- `STYLE.md` is the enforced writing standard (MDN-style anatomy + Mintlify components). Read it before writing or editing any page.
- American English, sentence-case headings, no marketing fluff.

## Mintlify components

Use `<Note>`, `<Tip>`, `<Warning>`, `<Danger>`, `<Info>` for callouts (children only, no titles); `<Steps>`/`<Step title>` for procedures; `<CardGroup cols={2}>`/`<Card>` for landing routes; `<CodeGroup>`, `<Tabs>`/`<Tab>`, `<AccordionGroup>`/`<Accordion>` as needed. Never use Starlight `:::` asides, `<CardGrid>`, or Astro imports.

## Internal files: never publish

`PLAYBOOK.md`, `PROMPT.md`, `outreach/`, and `research/` are gitignored internal strategy and tooling. Never publish, quote, or reference them in site content.

## Workflow

- Commit and push a checkpoint after every meaningful unit of work.
