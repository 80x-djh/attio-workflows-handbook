#!/usr/bin/env node
/**
 * og-image.mjs — renders the social card for handbook.80x.ai.
 *
 * Builds a 1200×630 SVG in memory and rasterizes it to public/og.png
 * with sharp. System fonts only (Helvetica/Arial) — librsvg cannot
 * load webfonts. Run: node scripts/og-image.mjs
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const MARGIN = 80; // minimum side margin for all text

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "public", "og.png");

// --- background grid (subtle, muted indigo) -------------------------------
const gridLines = [];
for (let x = 0; x <= WIDTH; x += 60) {
  gridLines.push(
    `<line x1="${x}" y1="0" x2="${x}" y2="${HEIGHT}" stroke="#818cf8" stroke-opacity="0.05" stroke-width="1"/>`
  );
}
for (let y = 0; y <= HEIGHT; y += 60) {
  gridLines.push(
    `<line x1="0" y1="${y}" x2="${WIDTH}" y2="${y}" stroke="#818cf8" stroke-opacity="0.05" stroke-width="1"/>`
  );
}

// --- node-graph accent (top right, away from text) -------------------------
const nodes = [
  [905, 95],
  [1050, 145],
  [1130, 70],
  [985, 235],
  [1115, 290],
  [860, 185],
];
const edges = [
  [0, 1],
  [1, 2],
  [1, 3],
  [3, 4],
  [0, 5],
  [5, 3],
];
const graph = [
  ...edges.map(([a, b]) => {
    const [x1, y1] = nodes[a];
    const [x2, y2] = nodes[b];
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#6366f1" stroke-opacity="0.35" stroke-width="1.5"/>`;
  }),
  ...nodes.map(
    ([x, y], i) =>
      `<circle cx="${x}" cy="${y}" r="${i % 2 === 0 ? 6 : 4.5}" fill="#818cf8" fill-opacity="0.55"/>`
  ),
];

const svg = `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="0.85" cy="0.15" r="0.7">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="#0b0d12"/>
  ${gridLines.join("\n  ")}
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  ${graph.join("\n  ")}

  <!-- accent bar -->
  <rect x="${MARGIN}" y="158" width="64" height="6" rx="3" fill="#6366f1"/>

  <!-- title -->
  <text x="${MARGIN}" y="268" font-family="Helvetica, Arial, sans-serif" font-size="88" font-weight="bold" fill="#ffffff">Attio Workflows</text>
  <text x="${MARGIN}" y="372" font-family="Helvetica, Arial, sans-serif" font-size="88" font-weight="bold" fill="#ffffff">Handbook</text>

  <!-- subline -->
  <text x="${MARGIN}" y="448" font-family="Helvetica, Arial, sans-serif" font-size="29" fill="#9ca3af">The missing manual for the new Workflows engine —</text>
  <text x="${MARGIN}" y="490" font-family="Helvetica, Arial, sans-serif" font-size="29" fill="#9ca3af">every block, every credit, real recipes.</text>

  <!-- footer -->
  <text x="${MARGIN}" y="566" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="bold" fill="#818cf8">handbook.80x.ai</text>
  <text x="${WIDTH - MARGIN}" y="566" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="#9ca3af">Free &amp; open source</text>
</svg>`;

await mkdir(dirname(outPath), { recursive: true });

const png = await sharp(Buffer.from(svg)).png().toBuffer();
await writeFile(outPath, png);

const meta = await sharp(outPath).metadata();
if (meta.width !== WIDTH || meta.height !== HEIGHT) {
  console.error(`FAIL: og.png is ${meta.width}×${meta.height}, expected ${WIDTH}×${HEIGHT}`);
  process.exit(1);
}
console.log(`OK: wrote ${outPath} (${meta.width}×${meta.height}, ${png.length} bytes)`);
