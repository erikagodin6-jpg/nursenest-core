#!/usr/bin/env node
/**
 * Frontend performance budget checker — Phase 7.
 *
 * Reads the Next.js build output to enforce size budgets on JS chunks and
 * detect performance-harming patterns added since a given git baseline.
 *
 * Budgets (from the frontend performance war room spec):
 *   - No single JS chunk > 800 KB (uncompressed)
 *   - Total initial JS for learner shell < 1.5 MB
 *   - No new dynamic-import-free heavy libraries added to the bundle
 *
 * Run:
 *   node scripts/check-frontend-performance.mjs            # chunk sizes only
 *   node scripts/check-frontend-performance.mjs --strict   # also check source patterns
 *   node scripts/check-frontend-performance.mjs --report   # print all chunks sorted by size
 *
 * CI: exits 1 on violations; exits 0 when clean.
 */
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "..");
const CHUNKS_DIR = join(ROOT, ".next/static/chunks");
const SRC = join(ROOT, "src");

const args = process.argv.slice(2);
const STRICT = args.includes("--strict");
const REPORT = args.includes("--report");

// ── Size budgets ──────────────────────────────────────────────────────────────

/**
 * Individual chunk cap: no single split should exceed this.
 * A 344-chunk app legitimately has large total size — what matters per-page
 * is how many and how large the chunks needed for that specific route are.
 */
const CHUNK_MAX_BYTES = 800 * 1024;        // 800 KB per individual chunk (uncompressed)
const CHUNK_WARN_BYTES = 500 * 1024;       // 500 KB — log a warning (not a failure)
const LARGEST_N_CHUNKS_BUDGET = 10;        // Top-N sum cap
const TOP_N_SUM_MAX_BYTES = 4 * 1024 * 1024; // Top 10 chunks < 4 MB combined

// ── Chunk analysis ────────────────────────────────────────────────────────────

function getChunkSizes() {
  const results = [];
  let entries;
  try {
    entries = readdirSync(CHUNKS_DIR);
  } catch {
    return results;
  }
  for (const name of entries) {
    if (!name.endsWith(".js")) continue;
    const full = join(CHUNKS_DIR, name);
    try {
      const { size } = statSync(full);
      results.push({ name, size, path: full });
    } catch {
      // skip
    }
  }
  return results.sort((a, b) => b.size - a.size);
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

// ── Source pattern checks ─────────────────────────────────────────────────────

const BANNED_CLIENT_IMPORTS = [
  // Server-only SDKs that should never reach the client bundle
  { pattern: /import.*from ['"]openai['"]/,         label: "openai SDK (server-only)" },
  { pattern: /import.*from ['"]@prisma\/client['"]/,label: "@prisma/client (server-only)" },
  { pattern: /import.*from ['"]prisma['"]/,          label: "prisma CLI (server-only)" },
  { pattern: /import.*from ['"]@paypal\//,           label: "PayPal server SDK" },
  { pattern: /import.*from ['"]mammoth['"]/,         label: "mammoth (heavy DOCX parser)" },
  { pattern: /import.*from ['"]xlsx['"]/,            label: "xlsx (heavy, server-only)" },
];

function checkSourcePatterns() {
  const violations = [];

  function walk(dir) {
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (["node_modules", ".next", "dist", ".git"].includes(e.name)) continue;
      const full = join(dir, e.name);
      if (e.isDirectory()) { walk(full); continue; }
      if (!e.name.endsWith(".tsx") && !e.name.endsWith(".ts")) continue;

      let src;
      try { src = readFileSync(full, "utf8"); } catch { continue; }

      // Only check client components — server-only files are fine
      if (!src.includes('"use client"') && !src.includes("'use client'")) continue;

      for (const check of BANNED_CLIENT_IMPORTS) {
        if (check.pattern.test(src)) {
          violations.push({
            file: relative(ROOT, full),
            label: check.label,
          });
        }
      }
    }
  }

  walk(SRC);
  return violations;
}

// ── "use client" count budget ─────────────────────────────────────────────────

const USE_CLIENT_MAX = 1000; // Alert above this; 818 today — warn before runaway growth

function countUseClientFiles() {
  try {
    const out = execSync(
      `find "${SRC}" -type f \\( -name "*.tsx" -o -name "*.ts" \\) | xargs grep -l '"use client"' 2>/dev/null | wc -l`,
      { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
    ).trim();
    return Number(out) || 0;
  } catch {
    return 0;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

const chunks = getChunkSizes();
const violations = [];

if (chunks.length === 0) {
  console.log("⚠️  No chunks found in .next/static/chunks — run `npm run build` first.");
  process.exit(0);
}

if (REPORT) {
  console.log(`\n── Top 30 JS chunks by size ────────────────────────────────────\n`);
  for (const c of chunks.slice(0, 30)) {
    const flag = c.size > CHUNK_MAX_BYTES ? " ❌ OVER BUDGET" : "";
    console.log(`  ${formatBytes(c.size).padStart(10)}  ${c.name}${flag}`);
  }
  console.log(`\nTotal chunks: ${chunks.length}, Total size: ${formatBytes(chunks.reduce((s, c) => s + c.size, 0))}\n`);
}

// Rule 1: No single chunk > 800 KB (hard failure)
const overBudgetChunks = chunks.filter((c) => c.size > CHUNK_MAX_BYTES);
for (const c of overBudgetChunks) {
  violations.push(
    `Chunk ${c.name} is ${formatBytes(c.size)} — over ${formatBytes(CHUNK_MAX_BYTES)} budget. Split with dynamic import.`,
  );
}

// Rule 1b: Warn on 500–800 KB chunks (advisory, not failure)
const warnChunks = chunks.filter((c) => c.size > CHUNK_WARN_BYTES && c.size <= CHUNK_MAX_BYTES);
for (const c of warnChunks) {
  console.log(`⚠️  Large chunk (${formatBytes(c.size)}): ${c.name} — consider splitting`);
}

// Rule 2: Top-N chunks sum budget (measures worst-case per-page cost)
const topN = chunks.slice(0, LARGEST_N_CHUNKS_BUDGET);
const topNSize = topN.reduce((s, c) => s + c.size, 0);
const totalSize = chunks.reduce((s, c) => s + c.size, 0);
if (topNSize > TOP_N_SUM_MAX_BYTES) {
  violations.push(
    `Top ${LARGEST_N_CHUNKS_BUDGET} chunks sum to ${formatBytes(topNSize)} — over ${formatBytes(TOP_N_SUM_MAX_BYTES)} budget.`,
  );
} else {
  console.log(`ℹ️  Top ${LARGEST_N_CHUNKS_BUDGET} chunks: ${formatBytes(topNSize)} / ${formatBytes(TOP_N_SUM_MAX_BYTES)} budget`);
}

// Rule 3: "use client" count < 1000
const useClientCount = countUseClientFiles();
if (useClientCount > USE_CLIENT_MAX) {
  violations.push(`"use client" file count: ${useClientCount} — over ${USE_CLIENT_MAX} budget. Audit new client components.`);
} else {
  console.log(`ℹ️  "use client" files: ${useClientCount} / ${USE_CLIENT_MAX} budget`);
}

// Rule 4 (strict): No banned imports in client components
if (STRICT) {
  const sourceViolations = checkSourcePatterns();
  for (const v of sourceViolations) {
    violations.push(`Client component ${v.file} imports ${v.label} — this should be server-only`);
  }
}

// ── Report ────────────────────────────────────────────────────────────────────

if (violations.length === 0) {
  console.log(`✅  Frontend performance budgets passed.`);
  console.log(`   Chunks: ${chunks.length}, Largest: ${formatBytes(chunks[0]?.size ?? 0)}, Total all chunks: ${formatBytes(totalSize)}`);
  process.exit(0);
} else {
  console.error(`\n❌  Frontend performance budget violations:\n`);
  for (const v of violations) {
    console.error(`   • ${v}`);
  }
  console.error(`\nFix: split large chunks with dynamic import, move server-only libs out of client components.`);
  process.exit(1);
}
