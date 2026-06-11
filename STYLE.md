# Style guide

This is the writing standard every page in the Attio Workflows Handbook must meet. It is the contract for contributors and the spec that CI enforces (see [Machine checks](#machine-checks)).

The handbook's differentiator is structure, not prose. Anyone can write paragraphs about workflow blocks; nobody else gives readers the same fixed anatomy on every page, so the cost table is always in the same place, the gotchas are always under the same heading, and the downstream reference syntax is always one scroll away. We copy MDN's *anatomy* — opening summary, fixed section order, See also discipline — but never MDN's *sentences*. MDN text is licensed CC-BY-SA, which is incompatible with this project's CC BY-NC-SA prose license. Imitate the skeleton; write every word yourself.

## Page types

Every page declares a `page-type` in its frontmatter. The value is one of:

| `page-type` | Meaning |
| --- | --- |
| `block-reference` | Reference page for one action or logic block |
| `trigger-reference` | Reference page for one trigger |
| `recipe` | End-to-end GTM build with steps, costs, and a test plan |
| `concept` | Explains how part of the engine works |
| `guide` | Task- or journey-oriented page that isn't a recipe |
| `glossary` | Single-term definition |
| `landing` | Index page that routes readers to subpages |
| `legal` | Privacy, licensing, and similar pages |

Directory-to-type mapping:

The site is organised by the four Diátaxis modes — **Learn** (tutorial), **Guides** (how-to), **Reference**, **Explanation** — plus Troubleshooting and Pro. Page type is declared in frontmatter and is what CI validates; the directory is the convention:

| Directory | `page-type` |
| --- | --- |
| `src/content/docs/reference/triggers/*` | `trigger-reference` |
| `src/content/docs/reference/*/` (all other block subdirectories) | `block-reference` |
| `src/content/docs/reference/credits-and-pricing` | `guide` (canonical fact page) |
| `src/content/docs/guides/<category>/*` (the follow-along builds) | `recipe` |
| `src/content/docs/explanation/*` | `concept` |
| `src/content/docs/learn/*` (ordered tutorial lessons) | `guide` |
| `src/content/docs/guides/migrating-from-legacy*`, `troubleshooting/*` | `guide` |
| Index and landing pages (`index.md`/`index.mdx` at any level) | `landing` |
| Privacy page | `legal` |
| Future glossary entries | `glossary` |

CI validates heading order against the page type, so declare it accurately.

## Spec A — block reference page anatomy

Applies to all files under `src/content/docs/reference/*/` (trigger reference pages follow the same anatomy, with the trigger as the subject).

Frontmatter:

- `title` — the exact block name as shown in the Attio UI.
- `description` — the page's opening sentence, reused verbatim. It doubles as the meta description, so keep it ≤160 characters.

Body, in this exact order:

1. **Opening summary.** Mandatory, 1–3 sentences, no heading. Sentence 1 follows the formula: "The **\<Block name\>** block (\<category\>) \<verb in present tense\> \<what it does\>." Sentences 2–3 state the single most important caveat or the primary use case — front-load the gotcha.
2. **Availability & cost table.** Mandatory. Fixed rows in fixed order, identical position and row order on every page:

   | Row | Content |
   | --- | --- |
   | Category | Block category as Attio groups it |
   | Credit cost | State "Free — logic blocks consume no credits" where true |
   | Engine | e.g., "New Workflows engine, June 2026+" |
   | Plan availability | Which plans include the block |
   | Limits | Rate, payload, and timeout limits |

3. **`## Inputs`** — table with columns Input | Type | Required | Default | Notes. If the block takes no inputs, write "None."
4. **`## Outputs`** — table with columns Output | Type | Example | Notes, plus one line showing the exact downstream reference syntax for consuming the output in a later block. If the block produces no outputs, write "None."
5. **`## Behavior`** — prose covering execution semantics, empty/null input handling, retry and idempotency behavior, multi-value handling, and ordering guarantees. Optional only when the opening summary fully covers behavior.
6. **`## Gotchas`** — bulleted list. Each item = a bold failure phrase, a 1–2 sentence explanation, and the fix.
7. **`## Examples`** — always plural. Each example gets a gerund-phrase h3 ("Routing new leads by territory"), one intro sentence, the exact block configuration as a Field | Value table or fenced JSON with realistic values (`jane@acme.com`, not `foo`), and one explanation sentence stating the result. Minimum one full example; top-traffic blocks get 2–3 including an edge case. No arrow-notation pseudo-examples.
8. **`## Credit cost worked example`** — for non-free blocks only: per-run math multiplied by a realistic monthly volume, compared against a plan allowance.
9. **`## Source`** — link to the official Attio help page, plus the line "Verified against the Attio Workflows engine on \<date\>."
10. **`## See also`** — mandatory. Order: sibling/alternative blocks → concept guides → recipes using this block → official Attio docs. Link text = the exact target page title, no leading articles, no end punctuation.

## Spec B — GTM recipe page anatomy

Applies to `src/content/docs/recipes/`.

Frontmatter:

- `title` — the outcome phrased as the thing built ("Round-robin lead routing").
- `description` — a one-sentence statement of the outcome.

Body, in this exact order:

1. **Opening.** One short paragraph: the business outcome in ICP language, plus the trigger and key blocks used, each linked on first mention.
2. **At-a-glance table.** Fixed rows: Difficulty | Time to build | Trigger | Blocks used (linked) | Credit cost per run | Plan required.
3. **`## Prerequisites`** — bulleted: plan tier, connected integrations, objects/attributes that must exist, API keys/scopes. Mandatory, and it comes first among the h2 sections.
4. **`## How it works`** — one paragraph plus a linear flow list of blocks in execution order.
5. **`## Build steps`** — one h3 per step ("Step 1: Configure the webhook trigger"). Imperative instructions that name UI elements by label and type, plus an exact configuration table (Field | Value) with real values.
6. **`## Variable mapping`** — table: Variable | Source block | Field | Example value.
7. **`## Credit cost worked example`** — cost per run multiplied by monthly trigger volume, compared against a plan allowance; note which steps are free logic blocks.
8. **`## Test plan`** — numbered: how to fire a test trigger, the expected output per block, and where to look in run history. Include one deliberately failing input.
9. **`## Failure modes`** — table: Symptom | Cause | Fix.
10. **`## Variations`** — one h3 per variation, describing only what changes.
11. **`## See also`**.

## Spec C — concept guide anatomy

Applies to `src/content/docs/concepts/`.

1. **Opening.** 2–4 paragraphs. Define the concept in sentence 1 with the concept as the grammatical subject. Then: why it matters to a GTM engineer, and what the reader can do after reading. Link every named block or feature on first mention.
2. **Body** — task-organized h2s in parallel gerund form ("Mapping variables", "Handling retries"), ordered simple → complex, with a minimal working example in the *first* section.
3. **Example density** — one config or code example per ~200–250 words. Every example is introduced by prose and followed by a result sentence.
4. **Heading hygiene** — no single subsections (an h3 needs a sibling), no bumping heads (no heading immediately followed by another heading), maximum depth h4.
5. **Ending** — close with `## See also`. No summary section.

Glossary variant: a 1–2 sentence self-contained definition plus See also, under one screenful.

Landing/index pages: a one-paragraph summary plus a linked list of subpages with one-line summaries — nothing else.

## Spec D — sentence-level writing rules

1. Sentence one of every page makes the bolded subject the grammatical subject, in present tense: "The **Execute Code** block runs JavaScript..." Never open with "In this article" or "Attio lets you".
2. Present tense everywhere.
3. Second person for the reader; imperative mood for steps; "we" only in worked-example walkthroughs.
4. Active voice preferred; passive allowed for system behavior ("the run is retried").
5. One idea per sentence. If a sentence has two commas and an "and", split it.
6. Name UI elements by label and type: "Click the **Run test** button."
7. Bold for block names and UI labels exactly as Attio renders them; backticks for variables, attribute slugs, JSON keys, and code.
8. Sentence-case all headings. Never start a title with an article. Avoid "and" in titles.
9. Parallel headings at each level (all gerunds, or all nouns, or all imperatives).
10. Never "above", "below", "here", or "click here"; link text matches the target page title.
11. "None." discipline: empty Inputs and Outputs sections say "None." — never omit the section.
12. `:::note` for non-obvious useful information; `:::caution` reserved for credit-burning, data-destroying, or irreversible actions. Maximum one of each per screen.
13. Serial comma, American English, straight quotes; contractions allowed.
14. Expand acronyms on first use per page (MCP, ICP, PQL), except CRM, API, and URL. Engine-specific jargon links to the glossary on first mention.
15. Example values are realistic and inclusive (`jane@acme.com`, `acme.com`, Priya Sharma) — never `foo`, `bar`, or `test123`. Show the expected output.
16. Every Attio block, trigger, or concept name links to its reference page on first mention in every page.

## Stickiness features

These are the things readers come back for. Protect them:

- **Fixed-position cost/availability table** on every reference page — readers learn to look in one place.
- **"Verified \<date\>" Source line** — every reference page states when it was last checked against the live engine.
- **Hover-ready opening sentences** — because `description` reuses sentence one, link previews and search snippets read as complete answers.
- **Edge-case example culture** — documented credit-burn and silent-overwrite gotchas, each with a reproduction config, not just a warning.
- **Glossary terms for new-engine vocabulary** — concept pages link to the glossary instead of re-explaining terms.

## Fact discipline

Volatile facts — the credit table, plan allowances, timeouts, renames — live on exactly **one** page each. Every other page links to that page and never restates the number. The canonical credit page is `/reference/credits-and-pricing/`.

Every behavioral or cost claim either cites an official Attio page or carries "Verified in workspace on \<date\>."

Canonical phrasings that must be used verbatim:

- **Legacy workflows:** "You can no longer create new legacy workflows; existing ones keep running, and Attio says sunset notice will come 'well in advance.'" Never describe legacy workflows as "deprecated".
- **Execute code credit cost:** "Variable (complexity-based)". Never state it is free, and never state it costs 1 credit.
- **Agent tool access:** read-only, gated by the "Run as" permission model.
- **Per-workflow credit caps:** removed in the new engine — never advise setting them.
- **AI model names:** OpenAI models are documented only as "GPT". Anthropic: Sonnet, Opus. Google: Gemini Flash, Gemini Pro.

## Machine checks

Two scripts enforce parts of this guide in CI:

- `scripts/check-pages.mjs` — validates heading order against the declared `page-type`, the presence and position of the Availability & cost table on reference pages, the presence of `## See also`, and a minimum of 300 words on `block-reference`, `trigger-reference`, `recipe`, and `concept` pages.
- `scripts/check-links.mjs` — checks external links. It sends a browser User-Agent because attio.com returns 404 to non-browser user agents; keep that header if you modify the script.

If a check fails on a page that genuinely needs to deviate, fix the page, not the check — exceptions to the anatomy are almost always a sign the content belongs on a different page type.
