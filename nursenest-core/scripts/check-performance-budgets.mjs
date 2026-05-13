#!/usr/bin/env node
/**
 * Performance budget validation script.
 *
 * Checks CSS source file sizes and built JS chunk sizes against declared budgets.
 * Exits with code 0 on pass, 1 on budget violation.
 *
 * Usage:
 *   node scripts/check-performance-budgets.mjs [--warn-only]
 *
 * --warn-only: print violations but always exit 0 (useful during migration periods)
 */
import { statSync, existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const WARN_ONLY = process.argv.includes("--warn-only");

// ─── Budget definitions ────────────────────────────────────────────────────

/** CSS source budgets (uncompressed bytes). Note: gzip is ~18-20% of uncompressed. */
const CSS_BUDGETS = [
  {
    file: "src/app/globals.css",
    budget: 220 * 1024,  // 220 KB — currently 213 KB; tight to catch regressions
    label: "globals.css (all-routes CSS)",
  },
  {
    file: "src/app/styles/marketing/hero.css",
    budget: 30 * 1024,   // 30 KB
    label: "marketing hero.css section",
  },
  {
    file: "src/app/styles/marketing/header-nav.css",
    budget: 40 * 1024,   // 40 KB
    label: "marketing header-nav.css section",
  },
  {
    file: "src/app/styles/shared/premium-stat-tiles.css",
    budget: 8 * 1024,    // 8 KB — single-source stat tiles
    label: "shared/premium-stat-tiles.css",
  },
  {
    file: "src/app/learner-premium-ds.css",
    budget: 40 * 1024,   // 40 KB
    label: "learner-premium-ds.css",
  },
  {
    file: "src/app/theme-palettes.css",
    budget: 80 * 1024,   // 80 KB — theme palettes grow with each new theme
    label: "theme-palettes.css",
  },
  {
    file: "src/app/semantic-status-tokens.css",
    budget: 60 * 1024,   // 60 KB
    label: "semantic-status-tokens.css",
  },
];

/** Total uncompressed CSS delivered to marketing routes (source files, not built bundle).
 *  The Turbopack build output for marketing is ~375 KB (built CSS). Source is larger
 *  due to comment headers, @import barrel files, and unreferenced rules that Tailwind
 *  tree-shakes. Budget set at current level + 10% headroom. */
const MARKETING_CSS_TOTAL_BUDGET = 700 * 1024;  // 700 KB source (~375 KB built)

/** Built client chunk budgets (bytes) */
const CHUNK_BUDGETS = [
  {
    pattern: /framer-motion|84286/,
    budget: 150 * 1024,   // 150 KB — framer-motion chunk
    label: "framer-motion chunk",
  },
  {
    pattern: /framework-/,
    budget: 200 * 1024,   // 200 KB — React framework
    label: "React framework chunk",
  },
  {
    pattern: /polyfills-/,
    budget: 130 * 1024,   // 130 KB — polyfills
    label: "polyfills chunk",
  },
];

// ─── Helper functions ──────────────────────────────────────────────────────

function bytes(b) {
  return `${(b / 1024).toFixed(1)} KB`;
}

function check(label, actual, budget) {
  const ok = actual <= budget;
  const pct = ((actual / budget) * 100).toFixed(0);
  const icon = ok ? "✅" : "❌";
  console.log(`${icon} ${label}`);
  console.log(`   ${bytes(actual)} / ${bytes(budget)} budget (${pct}%)`);
  return ok;
}

// ─── Run checks ────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

console.log("\n=== CSS Source Budgets ===\n");

let marketingCssTotal = 0;
const marketingFiles = [
  "src/app/globals.css",
  "src/app/(marketing)/marketing-styles.css",
  "src/app/(marketing)/marketing-dark-utilities.css",
  "src/app/theme-palettes.css",
  "src/app/semantic-status-tokens.css",
  "src/app/color-roles.css",
  "src/app/full-platform-convergence.css",
  "src/app/premium-color-depth-convergence.css",
  "src/app/premium-atmospheric-ecosystem-convergence.css",
  "src/app/premium-mobile-study-experience-audit.css",
  "src/app/mobile-ux-standards.css",
  "src/app/marketing-brand-atmosphere.css",
  "src/app/premium-allied-newgrad-convergence.css",
  "src/app/styles/marketing/hero.css",
  "src/app/styles/marketing/header-nav.css",
  "src/app/styles/marketing/theme-overrides.css",
  "src/app/styles/marketing/hub-system.css",
  "src/app/styles/marketing/pathway-reading.css",
  "src/app/styles/marketing/hub-tiers.css",
  "src/app/styles/marketing/content-surfaces.css",
  "src/app/styles/marketing/footer-seo.css",
];

for (const f of marketingFiles) {
  const p = join(ROOT, f);
  if (existsSync(p)) {
    marketingCssTotal += statSync(p).size;
  }
}

for (const { file, budget, label } of CSS_BUDGETS) {
  const p = join(ROOT, file);
  if (!existsSync(p)) {
    console.log(`⚠️  ${label} — file not found: ${file}`);
    continue;
  }
  const size = statSync(p).size;
  const ok = check(label, size, budget);
  if (ok) passed++; else failed++;
}

console.log(`\nMarketing total CSS (all source files combined):`);
const marketingOk = check("Marketing CSS total", marketingCssTotal, MARKETING_CSS_TOTAL_BUDGET);
if (marketingOk) passed++; else failed++;

// ─── Built chunk checks ────────────────────────────────────────────────────

const chunksDir = join(ROOT, ".next/static/chunks");
if (existsSync(chunksDir)) {
  console.log("\n=== Built JS Chunk Budgets ===\n");

  const files = readdirSync(chunksDir).filter(f => f.endsWith(".js"));
  for (const { pattern, budget, label } of CHUNK_BUDGETS) {
    const match = files.find(f => pattern.test(f));
    if (!match) {
      console.log(`ℹ️  ${label} — chunk not found in build (expected pattern: ${pattern})`);
      continue;
    }
    const size = statSync(join(chunksDir, match)).size;
    const ok = check(label, size, budget);
    if (ok) passed++; else failed++;
  }
} else {
  console.log("\n⚠️  No build output found (.next/static/chunks) — skipping JS chunk checks");
  console.log("    Run: npm run build && node scripts/check-performance-budgets.mjs");
}

// ─── Summary ──────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} ${failed === 1 ? "violation" : "violations"}`);

if (failed > 0) {
  if (WARN_ONLY) {
    console.log("⚠️  Budget violations detected (--warn-only: not failing build)");
    console.log("   See docs/performance/performance-budgets.md for targets and roadmap");
    process.exit(0);
  } else {
    console.log("❌ Budget violations detected.");
    console.log("   See docs/performance/performance-budgets.md for targets and roadmap");
    console.log("   Run with --warn-only to suppress exit code during migration periods");
    process.exit(1);
  }
} else {
  console.log("✅ All budgets met.");
  process.exit(0);
}
