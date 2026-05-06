#!/usr/bin/env node
/**
 * Lessons performance regression guard.
 *
 * This script statically inspects the lesson hub pipeline constants to ensure
 * the root-cause fixes (verify slug cap + DB timeout reduction) have not been
 * silently reverted. It does NOT require a running server, so it can run in CI
 * without a DB connection.
 *
 * What it checks:
 *   1. PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP <= 80
 *      (was 400 — 400 individual full-row DB reads per hub render caused 5+ min loads)
 *   2. PATHWAY_LESSON_MARKETING_HUB_VERIFY_DB_TIMEOUT_MS <= 5000
 *      (was 15 000 — 50 rounds × 15 s timeout = 750 s worst case)
 *   3. The hub page.tsx applies a per-page verify cap
 *      (ensures the page-level bound is not accidentally removed)
 *   4. No lesson hub route directly imports full lesson body modules
 *      (prevents re-introduction of O(N) full-body imports at route level)
 *
 * Thresholds (local dev / CI without live DB):
 *   The thresholds below are constants-level checks, not live TTFB checks,
 *   because a local dev box may not have the DB running. For live TTFB checks
 *   add a running server and uncomment the fetch block at the bottom.
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

let failed = false;

function pass(msg) {
  console.log(`[verify-lessons-performance] ✓ ${msg}`);
}

function fail(msg) {
  console.error(`[verify-lessons-performance] ✗ FAIL: ${msg}`);
  failed = true;
}

// ── 1. Verify slug cap ──────────────────────────────────────────────────────

const scaleFile = readFileSync(
  join(root, "src/lib/lessons/pathway-lesson-scale.ts"),
  "utf8",
);

const capMatch = scaleFile.match(
  /PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP\s*=\s*(\d+)/,
);
if (!capMatch) {
  fail("Could not find PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP in pathway-lesson-scale.ts");
} else {
  const cap = Number(capMatch[1]);
  if (cap > 80) {
    fail(
      `PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP is ${cap} (must be ≤ 80). ` +
        "Values above 80 cause hundreds of individual DB reads per hub render.",
    );
  } else {
    pass(`PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP = ${cap} (≤ 80)`);
  }
}

// ── 2. Verify DB timeout ────────────────────────────────────────────────────

const configFile = readFileSync(
  join(root, "src/lib/lessons/pathway-lesson-loader-config.ts"),
  "utf8",
);

const timeoutMatch = configFile.match(
  /PATHWAY_LESSON_MARKETING_HUB_VERIFY_DB_TIMEOUT_MS\s*=\s*([\d_]+)/,
);
if (!timeoutMatch) {
  fail("Could not find PATHWAY_LESSON_MARKETING_HUB_VERIFY_DB_TIMEOUT_MS in pathway-lesson-loader-config.ts");
} else {
  const timeoutMs = Number(timeoutMatch[1].replace(/_/g, ""));
  if (timeoutMs > 5000) {
    fail(
      `PATHWAY_LESSON_MARKETING_HUB_VERIFY_DB_TIMEOUT_MS is ${timeoutMs} ms (must be ≤ 5000 ms). ` +
        "High timeouts compound with the slug count to produce minutes-long renders.",
    );
  } else {
    pass(`PATHWAY_LESSON_MARKETING_HUB_VERIFY_DB_TIMEOUT_MS = ${timeoutMs} ms (≤ 5000 ms)`);
  }
}

// ── 3. Hub page applies per-page verify cap ─────────────────────────────────

const hubPageFile = readFileSync(
  join(
    root,
    "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx",
  ),
  "utf8",
);

if (!hubPageFile.includes("pageVerifyCap")) {
  fail(
    "Marketing hub page.tsx no longer applies a per-page verify cap (pageVerifyCap). " +
      "Without this, the full PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP applies to every render.",
  );
} else {
  pass("Marketing hub page.tsx applies per-page verify cap (pageVerifyCap)");
}

if (!hubPageFile.includes("effectiveHubPageSizeForVerify * pageRequested")) {
  fail(
    "Marketing hub page.tsx pageVerifyCap formula missing " +
      "'effectiveHubPageSizeForVerify * pageRequested'. Formula may have been changed.",
  );
} else {
  pass("pageVerifyCap formula = effectiveHubPageSizeForVerify × pageRequested");
}

// ── 4. Hub route does not import full lesson body modules ───────────────────

const heavyModulePatterns = [
  // Full lesson-body imports that should never appear at route level
  { pattern: /from ["']@\/lib\/lessons\/lesson-library/, label: "lesson-library (full body)" },
  { pattern: /from ["']@\/lib\/blog\//, label: "blog generation utilities" },
  { pattern: /from ["']@\/lib\/admin\//, label: "admin generation utilities" },
  { pattern: /from ["']@\/lib\/generation\//, label: "generation utilities" },
  { pattern: /import.*lesson-library\.json/, label: "lesson-library.json direct import" },
];

for (const { pattern, label } of heavyModulePatterns) {
  if (pattern.test(hubPageFile)) {
    fail(
      `Marketing hub page.tsx imports heavy module: ${label}. ` +
        "Hub routes must not import full lesson bodies or generation utilities.",
    );
  } else {
    pass(`Hub page does not import ${label}`);
  }
}

// ── Result ──────────────────────────────────────────────────────────────────

if (failed) {
  console.error(
    "\n[verify-lessons-performance] FAILED — one or more lesson performance guards failed. " +
      "See errors above. Fix the constants or code before merging.",
  );
  process.exit(1);
} else {
  console.log(
    "\n[verify-lessons-performance] OK — all lesson performance guards passed.",
  );
}
