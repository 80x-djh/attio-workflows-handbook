# CLAUDE.md

## Project

The Attio Workflows Handbook is an open-source Astro/Starlight documentation site — an MDN-quality, community-maintained guide to Attio's new Workflows engine (shipped June 9, 2026). It covers every block, every credit cost, and real recipes. Written by Dan Hull, a consultant who builds Attio workspaces for VC funds and startups; not affiliated with Attio Ltd. Audience: Attio admins, RevOps people, and consultants who need accurate, sourced answers the official docs don't give them. License: prose/content CC BY-NC-SA 4.0, code snippets/scripts MIT.

- Site: https://handbook.80x.ai
- Repo: github.com/80x-djh/attio-workflows-handbook

## Commands

```sh
npm run dev                                # local dev server
npm run build                              # production build (must pass before push)
node scripts/check-pages.mjs               # page inventory / completeness check
node scripts/check-links.mjs --internal-only   # internal link checker
node scripts/og-image.mjs                  # regenerate public/og.png (1200×630 social card)
```

## Hard editorial rules

These phrasings are canonical. Use them verbatim; do not paraphrase.

- **Legacy workflows:** "You can no longer create new legacy workflows; existing ones keep running, and Attio says sunset notice will come 'well in advance.'" — never say "deprecated."
- **Execute code cost:** "Variable (complexity-based)".
- **Agent tool access:** read-only via "Run as".
- **Credit caps:** per-workflow credit caps were removed — do not document them as current.
- **OpenAI models:** name them only "GPT" (no version numbers).

## Facts and sourcing

- **One canonical fact layer:** the full credit table lives ONLY on `/reference/credits-and-pricing/`. Every other page links to it; never duplicate the table.
- Every claim needs an official source (Attio docs, changelog, help center) or the marker "verified in workspace on <date>".
- attio.com 404s non-browser user agents. Always check with a browser UA, e.g. `curl -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"`.
- All screenshots and workflow tests come from Dan's own workspace (`customobject`) — NEVER from client workspaces.

## Writing standard

- `STYLE.md` is the enforced writing standard. Read it before writing or editing any page.
- American English, sentence-case headings, no marketing fluff.

## Internal files — never publish

`PLAYBOOK.md`, `PROMPT.md`, and `research/` are gitignored internal strategy. Never publish, quote, or reference them in site content.

## Workflow

- Commit and push a checkpoint after every meaningful unit of work.
