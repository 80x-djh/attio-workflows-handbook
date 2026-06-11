# Style guide

This is the writing standard every page in the Attio Workflows Handbook must meet. It is the contract for contributors.

The handbook's differentiator is structure, not prose. Anyone can write paragraphs about workflow blocks; nobody else gives readers the same fixed anatomy on every page — the cost table is always in the same place, the gotchas are always under the same heading, and the downstream reference syntax is always one scroll away. We copy MDN Web Docs' *anatomy* — opening summary, fixed section order, "See also" discipline — but never MDN's *sentences*. MDN text is licensed CC-BY-SA, which is incompatible with this project's CC BY-NC-SA prose license. Imitate the skeleton; write every word yourself.

The site runs on **Mintlify**. Pages are MDX in `mintlify/`. Frontmatter carries `title` and `description` (no Starlight `page-type`); callouts and steps use Mintlify components, not `:::` asides.

## Frontmatter

Every page declares:

- `title` — for reference block/trigger pages, the **exact block name as Attio renders it** (`Create record`, not `Create a record`). Otherwise a sentence-case title, no leading article.
- `description` — **one sentence, ≤ 160 characters**, which is also the page's opening sentence. It is the meta description and the search/hover snippet, so it must read as a complete answer on its own.
- `icon` — optional, reference pages and section landings only. A [Lucide](https://lucide.dev) icon name.

Never use Starlight frontmatter (`page-type`, `sidebar`, `template`, `hero`).

## Mintlify components

| Use | Component |
| --- | --- |
| Note / aside | `<Note>…</Note>` |
| Helpful tip | `<Tip>**Lead.** …</Tip>` (callouts take children only — fold any title into a bold lead) |
| Caution (credit-burn, destructive, irreversible) | `<Warning>…</Warning>` or `<Danger>…</Danger>` |
| Procedure / build steps | `<Steps>` with `<Step title="Imperative step title">…</Step>` |
| Index / landing route list | `<CardGroup cols={2}>` of `<Card title="…" icon="…" href="/route">summary</Card>` |
| Multiple code variants | `<CodeGroup>` wrapping titled fenced blocks |
| Collapsible detail | `<AccordionGroup>` / `<Accordion title="…">` |

Restraint, MDN-style: **at most one `<Note>` and one `<Warning>` per screenful.** Reserve `<Warning>`/`<Danger>` for credit-burning, data-destroying, or irreversible actions. Never use Starlight `:::` asides, `<CardGrid>`, or Astro `import` lines. Reference anatomy tables (cost, Inputs, Outputs) stay as Markdown tables — do not convert them to components.

## Page anatomy

Apply the anatomy for the page's type. Headings appear in the exact order given.

### A — Block and trigger reference (`reference/…`)
1. **Opening summary** (no heading, 1–3 sentences). Sentence 1: `The **<Block name>** block (<category>) <present-tense verb> <what it does>.` Then the single most important caveat — front-load the gotcha.
2. **Availability & cost table** (no heading, immediately after the summary) — fixed rows in fixed order: **Category**, **Credit cost**, **Engine** (New Workflows engine, June 2026+), **Plan availability**, **Limits**.
3. `## Inputs` — table `Input | Type | Required | Default | Notes`, or `None.`
4. `## Outputs` — table `Output | Type | Example | Notes`, then one line giving the exact downstream reference syntax (e.g. `` `{{ steps.create_record.record }}` ``), or `None.`
5. `## Behavior` — execution semantics, empty/null handling, retry/idempotency, multi-value handling, ordering.
6. `## Gotchas` — each item is a **bold failure phrase** + cause + the fix.
7. `## Examples` — **always plural**. Each example: a gerund-phrase `###` heading, one intro sentence, a `Field | Value` table or fenced JSON with realistic values, one result sentence. No arrow-notation pseudo-examples.
8. `## Credit cost worked example` — non-free blocks only: per-run math × monthly volume vs a plan allowance (link the credits page; don't restate the table).
9. `## Source` — official Attio link(s) + `Last reviewed against the Attio Help Center, June 2026.`
10. `## See also` — mandatory, ≤ 5, ordered: sibling blocks → concepts → recipes → official docs. Link text = exact target title.

### B — Recipe (the follow-along Guides builds)
Opening (ICP outcome + linked trigger/blocks) → at-a-glance table (`Difficulty | Time to build | Trigger | Blocks used | Credit cost per run | Plan required`) → `## Prerequisites` → `## How it works` (paragraph + linear flow list) → `## Build steps` (wrapped in `<Steps>`, each step a `Field | Value` config table) → `## Variable mapping` → `## Credit cost worked example` → `## Test plan` (numbered, **including one deliberately failing input**) → `## Failure modes` (`Symptom | Cause | Fix`) → `## Variations` → `## See also`.

### C — Concept (Explanation)
2–4 paragraph opening with the concept as the grammatical subject in sentence one → task-organized `##` headings in parallel gerund form, simple → complex, with a minimal example in the first body section → one example per ~200–250 words, each introduced and followed by a result sentence → close with `## See also`. No summary section.

### D — Tutorial lesson and how-to guide
Tutorial lessons (`learn/…`) open with the outcome, then a learning-outcomes block at the very top — a `<Note>` with bold **Prerequisites:** and **By the end you can:** lines — then the build via `<Steps>`, a cost note linking `/reference/credits-and-pricing`, and a closing next-step / `## See also`. Other how-to guides are task-oriented: opening summary, ordered `##` sections (use `<Steps>` for procedures), `## See also`.

### E — Landing / index
One short orienting paragraph, then a `<CardGroup cols={2}>` of `<Card>`s, one per subpage, each with a one-line summary. Nothing else.

### F — Glossary
One `###` per term, alphabetical, each a 1–2 sentence self-contained definition with the term as subject. Close with `## See also`.

## Sentence-level rules

1. Sentence one makes the page's bolded subject the grammatical subject, present tense. Never open with "In this article", "This page", or "Attio lets you".
2. Present tense; active voice (passive only for system behavior: "the run is retried").
3. Second person for the reader; imperative for steps; "we" only in a worked-example walkthrough; "I" only for the author's first-hand operational judgment, used sparingly.
4. One idea per sentence. If a sentence has two commas and an "and", split it.
5. Name UI elements by label and type: **Click the *Run test* button.** Bold block and UI names exactly as Attio renders them; backticks for variables, attribute slugs, JSON keys, code, and channel names.
6. Sentence-case all headings; no leading article; parallel headings at each level.
7. Never "above", "below", "here", or "click here". Link text equals the target page title or reads as a natural noun phrase — never a bare URL.
8. Serial comma, American English, straight quotes; contractions are fine.
9. Expand acronyms on first use per page — MCP, ICP, PQL — except CRM, API, URL. Link engine jargon to the glossary on first mention.
10. Example values are realistic and inclusive (`jane@acme.com`, `acme.com`, `Priya Sharma`), never `foo`/`bar`/`test123`. Always show the expected output.
11. Every Attio block, trigger, or concept name links to its reference page on first mention in the page. Internal links are root-relative with no trailing slash (`/reference/records/create-record`).

## Fact discipline

- **One canonical fact layer.** The full credit table, plan allowances, and timeout numbers live only on `/reference/credits-and-pricing`. Every other page links there and never restates them. A single block's inline cost ("1 credit") is fine.
- Canonical phrasings, used verbatim:
  - Legacy workflows: "You can no longer create new legacy workflows; existing ones keep running, and Attio says sunset notice will come 'well in advance.'" Never "deprecated".
  - Execute code cost: "Variable (complexity-based)".
  - Agent tool access: read-only, gated by the "Run as" permission model.
  - Per-workflow credit caps were removed — never advise setting one.
  - OpenAI models are named only "GPT". Anthropic: Sonnet, Opus. Google: Gemini Flash, Gemini Pro.
- Every behavioral or cost claim cites an official Attio page or a documented workspace observation. Reference and concept pages end with a Source line: `Last reviewed against the Attio Help Center, June 2026.` Do **not** write a "verified in workspace" stamp until that verification has actually been done.

## Checks

Run before opening a PR (Mintlify also validates the build on every deploy):

```sh
cd mintlify
mint validate        # strict build — fails on any error
mint broken-links    # every internal link must resolve
mint a11y            # color contrast + image alt text
```
