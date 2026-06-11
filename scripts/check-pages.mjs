#!/usr/bin/env node
/**
 * check-pages.mjs — CI check for STYLE.md page anatomy.
 *
 * Zero dependencies. Scans every .md/.mdx page under src/content/docs/ and
 * validates frontmatter and body structure per page type.
 *
 * Baseline mechanism:
 *   - scripts/page-check-baseline.json maps file path -> [failure codes].
 *   - Failures listed in the baseline are warnings (stderr, "BASELINED").
 *   - Only NEW failures (not in the baseline) cause exit 1.
 *   - If no baseline file exists, all failures are warnings and exit is 0.
 *   - Run with --update-baseline to write the current failure set.
 *
 * Usage:
 *   node scripts/check-pages.mjs
 *   node scripts/check-pages.mjs --update-baseline
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, relative, sep, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(SCRIPT_DIR);
const DOCS_DIR = join(ROOT, "src", "content", "docs");
const BASELINE_PATH = join(SCRIPT_DIR, "page-check-baseline.json");

const VALID_PAGE_TYPES = new Set([
  "block-reference",
  "trigger-reference",
  "recipe",
  "concept",
  "guide",
  "glossary",
  "landing",
  "legal",
]);

const RECIPE_HEADINGS = [
  "Prerequisites",
  "How it works",
  "Build steps",
  "Variable mapping",
  "Credit cost worked example",
  "Test plan",
  "Failure modes",
  "See also",
];

const MIN_WORDS = 300;
const MAX_DESCRIPTION = 160;

// ---------------------------------------------------------------------------
// File discovery
// ---------------------------------------------------------------------------

function findPages(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...findPages(full));
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out.sort();
}

function relPath(file) {
  return relative(ROOT, file).split(sep).join("/");
}

// ---------------------------------------------------------------------------
// Frontmatter parsing (deliberately simple — no YAML dependency)
// ---------------------------------------------------------------------------

function parseFrontmatter(src) {
  const lines = src.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") {
    return { data: {}, body: src };
  }
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      end = i;
      break;
    }
  }
  if (end === -1) {
    return { data: {}, body: src };
  }
  const fmLines = lines.slice(1, end);
  const data = {};
  let i = 0;
  while (i < fmLines.length) {
    const m = fmLines[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) {
      i++;
      continue;
    }
    const key = m[1];
    let value = m[2].trim();
    if (/^[>|][+-]?$/.test(value)) {
      // Folded/literal block scalar: gather indented continuation lines.
      const parts = [];
      i++;
      while (i < fmLines.length && /^\s+\S/.test(fmLines[i])) {
        parts.push(fmLines[i].trim());
        i++;
      }
      value = parts.join(" ");
    } else {
      const quoted = value.match(/^(["'])([\s\S]*)\1$/);
      if (quoted) value = quoted[2];
      i++;
    }
    data[key] = value;
  }
  return { data, body: lines.slice(end + 1).join("\n") };
}

// ---------------------------------------------------------------------------
// Body analysis helpers (all fence-aware)
// ---------------------------------------------------------------------------

function bodyLinesOutsideFences(body) {
  const out = [];
  let inFence = false;
  let fenceMarker = null;
  for (const line of body.split("\n")) {
    const t = line.trim();
    const fence = t.match(/^(```+|~~~+)/);
    if (fence) {
      if (!inFence) {
        inFence = true;
        fenceMarker = fence[1][0];
      } else if (fence[1][0] === fenceMarker) {
        inFence = false;
        fenceMarker = null;
      }
      continue;
    }
    if (!inFence) out.push(line);
  }
  return out;
}

function extractH2s(lines) {
  const headings = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^##\s+(.+?)\s*#*\s*$/);
    if (m) headings.push({ text: m[1].trim(), index: i });
  }
  return headings;
}

function norm(s) {
  return s.trim().toLowerCase();
}

function kebab(s) {
  return norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function countWords(lines) {
  const text = lines
    .filter((l) => !/^\s*(import|export)\s/.test(l))
    .join(" ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> link text
    .replace(/<[^>]+>/g, " ") // inline html/jsx tags
    .replace(/[|#*_`>~:-]+/g, " "); // markdown punctuation
  return text.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
}

function hasCostTable(lines) {
  return lines.some(
    (l) => l.includes("|") && /category/i.test(l) && /credit cost/i.test(l)
  );
}

function hasSeeAlso(h2s) {
  return h2s.some((h) => norm(h.text) === "see also");
}

/** Content lines of an h2 section: everything until the next h1/h2 heading. */
function sectionContent(lines, h2s, heading) {
  const start = heading.index + 1;
  let end = lines.length;
  for (let i = start; i < lines.length; i++) {
    if (/^#{1,2}\s+\S/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end);
}

// ---------------------------------------------------------------------------
// Per-page checks
// ---------------------------------------------------------------------------

function checkPage(file) {
  const src = readFileSync(file, "utf8");
  const { data, body } = parseFrontmatter(src);
  const failures = [];
  const fail = (code, message) => failures.push({ code, message });

  // --- Frontmatter (all page types) ---
  if (!data.title) {
    fail("missing-title", 'frontmatter is missing "title"');
  }
  if (!data.description) {
    fail("missing-description", 'frontmatter is missing "description"');
  } else if (data.description.length > MAX_DESCRIPTION) {
    fail(
      "desc-too-long",
      `description is ${data.description.length} chars (max ${MAX_DESCRIPTION})`
    );
  }

  const pageType = data["page-type"];
  if (!pageType) {
    fail("missing-page-type", 'frontmatter is missing "page-type"');
  } else if (!VALID_PAGE_TYPES.has(pageType)) {
    fail(
      "invalid-page-type",
      `page-type "${pageType}" is not one of: ${[...VALID_PAGE_TYPES].join(", ")}`
    );
  }

  // Body checks only apply when we know the page type.
  if (!pageType || !VALID_PAGE_TYPES.has(pageType)) {
    return failures;
  }

  const lines = bodyLinesOutsideFences(body);
  const h2s = extractH2s(lines);
  const words = countWords(lines);

  if (pageType === "block-reference" || pageType === "trigger-reference") {
    if (!hasCostTable(lines)) {
      fail(
        "no-cost-table",
        'no Availability & cost table (header row must mention "Category" and "Credit cost")'
      );
    }
    if (!hasSeeAlso(h2s)) {
      fail("no-see-also", 'missing "## See also" section');
    }
    if (words < MIN_WORDS) {
      fail("under-300-words", `body is ${words} words (min ${MIN_WORDS})`);
    }
    // Empty Inputs/Outputs sections must say "None." (only if the heading exists).
    for (const name of ["Inputs", "Outputs"]) {
      const heading = h2s.find((h) => norm(h.text) === norm(name));
      if (!heading) continue;
      const content = sectionContent(lines, h2s, heading).join("\n").trim();
      if (content === "") {
        fail(
          "missing-none",
          `"## ${name}" section is empty — it must contain "None."`
        );
      }
    }
  }

  if (pageType === "recipe") {
    const h2Texts = h2s.map((h) => norm(h.text));
    const positions = RECIPE_HEADINGS.map((r) => h2Texts.indexOf(norm(r)));

    RECIPE_HEADINGS.forEach((r, idx) => {
      if (positions[idx] === -1) {
        fail(`missing-heading:${kebab(r)}`, `missing required "## ${r}" heading`);
      }
    });

    let ordered = true;
    const present = positions.filter((p) => p !== -1);
    for (let i = 1; i < present.length; i++) {
      if (present[i] <= present[i - 1]) ordered = false;
    }
    // "Variations" is optional, but if present must sit between
    // "Failure modes" and "See also".
    const vi = h2Texts.indexOf("variations");
    if (vi !== -1) {
      const fm = h2Texts.indexOf("failure modes");
      const sa = h2Texts.indexOf("see also");
      if ((fm !== -1 && vi < fm) || (sa !== -1 && vi > sa)) ordered = false;
    }
    if (!ordered) {
      fail(
        "heading-order",
        `recipe h2 headings out of order (expected: ${RECIPE_HEADINGS.join(" → ")}, Variations optional before See also)`
      );
    }

    if (words < MIN_WORDS) {
      fail("under-300-words", `body is ${words} words (min ${MIN_WORDS})`);
    }
  }

  if (pageType === "concept") {
    if (!hasSeeAlso(h2s)) {
      fail("no-see-also", 'missing "## See also" section');
    }
    if (words < MIN_WORDS) {
      fail("under-300-words", `body is ${words} words (min ${MIN_WORDS})`);
    }
  }

  // guide / landing / glossary / legal: frontmatter checks only.

  return failures;
}

// ---------------------------------------------------------------------------
// Baseline handling
// ---------------------------------------------------------------------------

function loadBaseline() {
  if (!existsSync(BASELINE_PATH)) return null;
  try {
    const parsed = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
    console.error(
      `WARNING: ${relPath(BASELINE_PATH)} is not an object — ignoring it.`
    );
    return null;
  } catch (err) {
    console.error(
      `WARNING: could not parse ${relPath(BASELINE_PATH)} (${err.message}) — ignoring it.`
    );
    return null;
  }
}

function writeBaseline(results) {
  const baseline = {};
  for (const { path, failures } of results) {
    if (failures.length === 0) continue;
    baseline[path] = [...new Set(failures.map((f) => f.code))].sort();
  }
  writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2) + "\n");
  return baseline;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const updateBaseline = process.argv.includes("--update-baseline");

  if (!existsSync(DOCS_DIR)) {
    console.error(`ERROR: docs directory not found: ${relPath(DOCS_DIR)}`);
    process.exit(2);
  }

  const files = findPages(DOCS_DIR);
  const results = files.map((file) => ({
    path: relPath(file),
    failures: checkPage(file),
  }));

  if (updateBaseline) {
    const baseline = writeBaseline(results);
    const failingFiles = Object.keys(baseline).length;
    const totalCodes = Object.values(baseline).reduce((n, a) => n + a.length, 0);
    console.log(
      `Baseline written to ${relPath(BASELINE_PATH)}: ${failingFiles} files, ${totalCodes} known failure codes.`
    );
    process.exit(0);
  }

  const baseline = loadBaseline();
  const enforcing = baseline !== null;

  let passCount = 0;
  let baselinedCount = 0;
  let newFailureCount = 0;

  for (const { path, failures } of results) {
    if (failures.length === 0) {
      passCount++;
      continue;
    }

    const known = new Set(enforcing ? baseline[path] ?? [] : []);
    const newFailures = [];
    const baselined = [];
    for (const f of failures) {
      if (enforcing && known.has(f.code)) baselined.push(f);
      else newFailures.push(f);
    }

    if (!enforcing) {
      // No baseline yet: everything is a warning.
      console.error(path);
      for (const f of failures) {
        console.error(`  WARN ${f.code}  ${f.message}`);
      }
    } else {
      for (const f of baselined) {
        console.error(`BASELINED ${path}: ${f.code}  ${f.message}`);
      }
      if (newFailures.length > 0) {
        console.log(path);
        for (const f of newFailures) {
          console.log(`  FAIL ${f.code}  ${f.message}`);
        }
      }
    }

    baselinedCount += baselined.length;
    newFailureCount += enforcing ? newFailures.length : 0;
  }

  // Note stale baseline entries (failures that have since been fixed).
  if (enforcing) {
    let stale = 0;
    const byPath = new Map(results.map((r) => [r.path, r.failures]));
    for (const [path, codes] of Object.entries(baseline)) {
      const current = new Set((byPath.get(path) ?? []).map((f) => f.code));
      for (const code of codes) {
        if (!current.has(code)) stale++;
      }
    }
    if (stale > 0) {
      console.log(
        `NOTE: ${stale} baselined failure(s) no longer occur — run with --update-baseline to prune.`
      );
    }
  }

  const warned = enforcing
    ? 0
    : results.reduce((n, r) => n + r.failures.length, 0);

  console.log(
    `Summary: ${results.length} files, ${passCount} pass, ${baselinedCount} baselined, ${
      enforcing ? newFailureCount : warned
    } ${enforcing ? "new failures" : "failures (warnings only)"}`
  );

  if (!enforcing) {
    console.log(
      `NOTE: ${relPath(BASELINE_PATH)} not found — all failures reported as warnings, exit 0.\n` +
        `      Enforcement starts once a baseline exists. Create one with:\n` +
        `      node scripts/check-pages.mjs --update-baseline`
    );
    process.exit(0);
  }

  process.exit(newFailureCount > 0 ? 1 : 0);
}

main();
