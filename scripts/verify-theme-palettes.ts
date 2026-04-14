#!/usr/bin/env tsx
/**
 * Verify theme-palettes.css source order and registry coverage.
 * Prints a readable summary and exits non-zero on failure.
 *
 * Usage:  npx tsx scripts/verify-theme-palettes.ts
 * CI:     npm run verify:theme-palettes
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { THEME_OPTIONS } from "../src/lib/theme/theme-registry";

const HERE = dirname(fileURLToPath(import.meta.url));
const PALETTES_PATH = resolve(HERE, "../src/app/theme-palettes.css");
const css = readFileSync(PALETTES_PATH, "utf-8");
const lines = css.split("\n");

// ── helpers (shared logic with the test file) ─────────────────────────────

function firstLine(pattern: RegExp): number {
  return lines.findIndex((l) => pattern.test(l));
}

function findCompleteBlock(themeId: string): number {
  const selector = new RegExp(`^\\[data-theme="${themeId}"\\]\\s*\\{`);
  for (let i = 0; i < lines.length; i++) {
    if (!selector.test(lines[i])) continue;
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[j].trim() === "}") break;
      if (lines[j].includes("--theme-page-bg")) return i;
    }
  }
  return -1;
}

function findBlockEnd(startLine: number): number {
  let depth = 0;
  for (let i = startLine; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === "{") depth++;
      if (ch === "}") {
        depth--;
        if (depth === 0) return i;
      }
    }
  }
  return -1;
}

// ── analysis ──────────────────────────────────────────────────────────────

const catchAllStart = firstLine(/^:is\(/);
const catchAllEnd = catchAllStart >= 0 ? findBlockEnd(catchAllStart) : -1;
const topbarOverrides = firstLine(/Per-theme topbar overrides/);

const COMPLETE_LIGHT_THEMES = [
  "lavender",
  "lavender-dream",
  "blueberry-sherbet",
  "strawberry-cream",
  "ocean-mist",
  "mint-breeze",
  "rose-quartz",
  "golden-hour",
  "sage-garden",
  "coral-sunset",
  "arctic-frost",
  "plum-velvet",
  "honey-cream",
  "dusty-rose",
];

const cssThemeIds = new Set<string>();
const selectorRe = /\[data-theme="([^"]+)"\]/g;
let m: RegExpExecArray | null;
while ((m = selectorRe.exec(css)) !== null) cssThemeIds.add(m[1]);

const registryIds = THEME_OPTIONS.map((t) => t.id);

// ── report ────────────────────────────────────────────────────────────────

let failures = 0;

function pass(msg: string) {
  console.log(`  ✓ ${msg}`);
}
function fail(msg: string) {
  console.log(`  ✗ ${msg}`);
  failures++;
}

console.log("\n─── Theme Palette Source-Order Verification ───\n");

console.log("Structural positions:");
if (catchAllStart >= 0) {
  console.log(`  :is() catch-all block : lines ${catchAllStart + 1}–${catchAllEnd + 1}`);
} else {
  console.log("  :is() catch-all block : NOT FOUND");
  failures++;
}
if (topbarOverrides >= 0) {
  console.log(`  topbar overrides      : starts line ${topbarOverrides + 1}`);
} else {
  console.log("  topbar overrides      : NOT FOUND");
  failures++;
}

console.log("\nComplete named light-theme block ordering:");
for (const id of COMPLETE_LIGHT_THEMES) {
  const blockLine = findCompleteBlock(id);
  if (blockLine < 0) {
    fail(`${id.padEnd(22)} — complete block NOT FOUND`);
  } else if (blockLine <= catchAllEnd) {
    fail(`${id.padEnd(22)} — line ${String(blockLine + 1).padStart(5)} (BEFORE catch-all end at ${catchAllEnd + 1})`);
  } else {
    pass(`${id.padEnd(22)} — line ${String(blockLine + 1).padStart(5)}`);
  }
}

if (topbarOverrides >= 0) {
  const lastCompleteEnd = Math.max(
    ...COMPLETE_LIGHT_THEMES.map((id) => {
      const s = findCompleteBlock(id);
      return s >= 0 ? findBlockEnd(s) : -1;
    }),
  );
  if (topbarOverrides > lastCompleteEnd) {
    pass("topbar/foreground overrides are after all complete blocks");
  } else {
    fail(`topbar overrides (line ${topbarOverrides + 1}) must be after last complete block end (line ${lastCompleteEnd + 1})`);
  }
}

console.log("\nRegistry ↔ CSS coverage:");
const missingFromCss = registryIds.filter((id) => !cssThemeIds.has(id));
if (missingFromCss.length === 0) {
  pass(`all ${registryIds.length} registry theme IDs have CSS selectors`);
} else {
  fail(`missing from CSS: ${missingFromCss.join(", ")}`);
}

const namedLight = THEME_OPTIONS.filter((t) => t.named && t.group === "light");
const incompleteName = namedLight.filter((t) => findCompleteBlock(t.id) < 0).map((t) => t.id);
if (incompleteName.length === 0) {
  pass(`all ${namedLight.length} named light themes have complete blocks`);
} else {
  fail(`named light themes without complete blocks: ${incompleteName.join(", ")}`);
}

const namedDark = THEME_OPTIONS.filter((t) => t.named && t.group === "dark");
const incompleteDark = namedDark.filter((t) => findCompleteBlock(t.id) < 0).map((t) => t.id);
if (incompleteDark.length === 0) {
  pass(`all ${namedDark.length} named dark themes have complete blocks`);
} else {
  fail(`named dark themes without complete blocks: ${incompleteDark.join(", ")}`);
}

console.log(`\n─── Result: ${failures === 0 ? "PASS ✓" : `${failures} FAILURE(S) ✗`} ───\n`);
process.exit(failures === 0 ? 0 : 1);
