/**
 * ECG inventory audit script — hard-fails if ECG checkout is enabled but inventory is below threshold.
 *
 * Usage:
 *   node scripts/audit-ecg-inventory.mjs
 *
 * Exit codes:
 *   0 — audit passed (or ECG checkout disabled)
 *   1 — ECG checkout enabled with insufficient inventory and no early-access override
 *   2 — ECG checkout enabled with insufficient inventory but ALLOW_ECG_EARLY_ACCESS_CHECKOUT=true
 *         (exits 0 with warning — early-access launch is intentional)
 *
 * This script checks static thresholds only (curated-pack count + env flags).
 * For live DB inventory counts use: GET /api/admin/modules/ecg/readiness
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// ── Thresholds ────────────────────────────────────────────────────────────────

const FULL_LAUNCH_THRESHOLD = 300;   // learner-visible questions for full paid launch
const BASIC_LAUNCH_THRESHOLD = 150;  // minimum for a credible basic ECG module
const EARLY_ACCESS_MINIMUM = 30;     // absolute floor even for soft launch

// ── Static inventory: count makeRow calls in curated pack ─────────────────────

function countCuratedPackQuestions() {
  const packPath = join(root, "src/lib/ecg-module/ecg-premium-curated-pack.ts");
  if (!existsSync(packPath)) return { total: 0, error: "ecg-premium-curated-pack.ts not found" };
  const src = readFileSync(packPath, "utf8");
  const matches = src.match(/makeRow\s*\(/g);
  return { total: matches ? matches.length : 0, error: null };
}

// ── Env flags ─────────────────────────────────────────────────────────────────

function isEcgCheckoutActive() {
  const enableEcg = (process.env.ENABLE_ECG_MODULE ?? "true").trim().toLowerCase();
  const enableAdvanced = (process.env.ENABLE_ADVANCED_ECG_MODULE ?? "true").trim().toLowerCase();
  const hasStripePrice = Boolean(process.env.STRIPE_PRICE_ADVANCED_ECG?.trim());
  const enabled = enableEcg !== "false" && enableEcg !== "0";
  const advanced = enableAdvanced !== "false" && enableAdvanced !== "0";
  return { enabled, advanced, hasStripePrice, active: enabled && advanced && hasStripePrice };
}

function isEarlyAccessOverride() {
  const val = (process.env.ALLOW_ECG_EARLY_ACCESS_CHECKOUT ?? "false").trim().toLowerCase();
  return val === "true" || val === "1";
}

// ── Category breakdown (from pack source file) ────────────────────────────────

function categorizeQuestions() {
  const packPath = join(root, "src/lib/ecg-module/ecg-premium-curated-pack.ts");
  if (!existsSync(packPath)) return {};
  const src = readFileSync(packPath, "utf8");

  const categories = {
    rhythm_interpretation_mcq: 0,
    waveform_identification_drill: 0,
    ngn_ecg_case: 0,
    telemetry_prioritization: 0,
    medication_ecg_integration: 0,
    acls_rhythm_progression: 0,
    electrolyte_ecg: 0,
    artifact_vs_true_rhythm: 0,
    progressive_curated_set: 0,
    other: 0,
  };

  for (const [key] of Object.entries(categories)) {
    if (key === "other") continue;
    const re = new RegExp(`category:\\s*["']${key}["']`, "g");
    const matches = src.match(re);
    categories[key] = matches ? matches.length : 0;
  }

  const known = Object.entries(categories)
    .filter(([k]) => k !== "other")
    .reduce((s, [, v]) => s + v, 0);

  // Count total makeRow calls
  const totalMatch = src.match(/makeRow\s*\(/g);
  categories.other = (totalMatch ? totalMatch.length : 0) - known;

  return categories;
}

function countByLevel() {
  const packPath = join(root, "src/lib/ecg-module/ecg-premium-curated-pack.ts");
  if (!existsSync(packPath)) return { basic: 0, advanced: 0 };
  const src = readFileSync(packPath, "utf8");
  const basicMatch = src.match(/level:\s*["']basic["']/g);
  const advancedMatch = src.match(/level:\s*["']advanced["']/g);
  return {
    basic: basicMatch ? basicMatch.length : 0,
    advanced: advancedMatch ? advancedMatch.length : 0,
  };
}

// ── Report ────────────────────────────────────────────────────────────────────

function pad(str, len) {
  return String(str).padEnd(len);
}

function bar(value, max, width = 30) {
  const filled = Math.round((value / max) * width);
  return "[" + "█".repeat(filled) + "░".repeat(Math.max(0, width - filled)) + "]";
}

// ── Main ──────────────────────────────────────────────────────────────────────

const { total: staticCount, error: packError } = countCuratedPackQuestions();
const categories = categorizeQuestions();
const { basic: basicCount, advanced: advancedCount } = countByLevel();
const { enabled, advanced, hasStripePrice, active: checkoutActive } = isEcgCheckoutActive();
const earlyAccessOverride = isEarlyAccessOverride();

console.log("\n╔══════════════════════════════════════════════════════════════╗");
console.log("║              ECG INVENTORY AUDIT — NurseNest                ║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");

if (packError) {
  console.error("❌ ERROR:", packError);
}

console.log("── Static Inventory (curated pack) ──────────────────────────────");
console.log(`  Total questions in curated pack: ${staticCount}`);
console.log(`  Basic level:                     ${basicCount}`);
console.log(`  Advanced level:                  ${advancedCount}`);
console.log();
console.log(`  Progress to full-launch threshold (${FULL_LAUNCH_THRESHOLD}):`);
console.log(`  ${bar(staticCount, FULL_LAUNCH_THRESHOLD)} ${staticCount}/${FULL_LAUNCH_THRESHOLD}`);
console.log(`  Progress to basic threshold (${BASIC_LAUNCH_THRESHOLD}):`);
console.log(`  ${bar(staticCount, BASIC_LAUNCH_THRESHOLD)} ${staticCount}/${BASIC_LAUNCH_THRESHOLD}`);
console.log();

console.log("── Category Breakdown ───────────────────────────────────────────");
for (const [cat, count] of Object.entries(categories)) {
  if (count > 0) {
    console.log(`  ${pad(cat, 35)} ${count}`);
  }
}
console.log();

console.log("── Env / Checkout Flags ─────────────────────────────────────────");
console.log(`  ENABLE_ECG_MODULE:               ${enabled ? "✅ true" : "❌ false"}`);
console.log(`  ENABLE_ADVANCED_ECG_MODULE:      ${advanced ? "✅ true" : "❌ false/unset"}`);
console.log(`  STRIPE_PRICE_ADVANCED_ECG:       ${hasStripePrice ? "✅ set" : "❌ not set"}`);
console.log(`  ECG checkout active:             ${checkoutActive ? "⚠️  YES" : "✅ NO (disabled)"}`);
console.log(`  ALLOW_ECG_EARLY_ACCESS_CHECKOUT: ${earlyAccessOverride ? "⚠️  true" : "✅ false"}`);
console.log();

console.log("── Thresholds ───────────────────────────────────────────────────");
console.log(`  Full paid launch minimum:        ${FULL_LAUNCH_THRESHOLD} learner-visible questions`);
console.log(`  Basic module minimum:            ${BASIC_LAUNCH_THRESHOLD} learner-visible questions`);
console.log(`  Early-access absolute floor:     ${EARLY_ACCESS_MINIMUM} learner-visible questions`);
console.log();

// ── Verdict ───────────────────────────────────────────────────────────────────

let exitCode = 0;

if (!checkoutActive) {
  console.log("✅ PASS — ECG checkout is not active. No inventory gate triggered.");
  console.log("   NP/CNPLE checkout is unaffected.\n");
  process.exit(0);
}

if (staticCount >= FULL_LAUNCH_THRESHOLD) {
  console.log("✅ PASS — ECG inventory meets full-launch threshold.");
  console.log(`   ${staticCount} >= ${FULL_LAUNCH_THRESHOLD} questions. ECG full launch: GO.`);
  process.exit(0);
}

if (staticCount >= BASIC_LAUNCH_THRESHOLD) {
  if (earlyAccessOverride) {
    console.log("⚠️  EARLY ACCESS — ECG inventory meets basic threshold but not full-launch.");
    console.log(`   ${staticCount} >= ${BASIC_LAUNCH_THRESHOLD} (basic) but < ${FULL_LAUNCH_THRESHOLD} (full).`);
    console.log("   ALLOW_ECG_EARLY_ACCESS_CHECKOUT=true — intentional early-access launch.");
    console.log("   Label checkout as 'Early Access ECG Module'. Do not claim complete mastery.");
    process.exit(0);
  }
  console.error("❌ FAIL — ECG inventory meets basic threshold but ALLOW_ECG_EARLY_ACCESS_CHECKOUT is not set.");
  console.error(`   ${staticCount}/${FULL_LAUNCH_THRESHOLD} questions (${Math.round(staticCount/FULL_LAUNCH_THRESHOLD*100)}% of target).`);
  console.error("   To proceed with early-access: set ALLOW_ECG_EARLY_ACCESS_CHECKOUT=true and update marketing copy.");
  console.error("   NP/CNPLE checkout is unaffected by this gate.");
  exitCode = 1;
} else if (staticCount >= EARLY_ACCESS_MINIMUM) {
  if (earlyAccessOverride) {
    console.warn("⚠️  SOFT LAUNCH WARNING — ECG inventory is below basic threshold.");
    console.warn(`   ${staticCount}/${BASIC_LAUNCH_THRESHOLD} basic minimum. ALLOW_ECG_EARLY_ACCESS_CHECKOUT=true.`);
    console.warn("   This is the absolute minimum for any paid ECG offering.");
    console.warn("   Recommend: label as 'Founding Access' with transparent scope disclosure.");
    process.exit(0);
  }
  console.error("❌ FAIL — ECG inventory below basic launch threshold.");
  console.error(`   ${staticCount}/${BASIC_LAUNCH_THRESHOLD} required for basic module (${Math.round(staticCount/BASIC_LAUNCH_THRESHOLD*100)}%).`);
  console.error("   Set ALLOW_ECG_EARLY_ACCESS_CHECKOUT=true to override with early-access launch.");
  exitCode = 1;
} else {
  console.error("❌ HARD FAIL — ECG inventory below absolute minimum for any paid offering.");
  console.error(`   ${staticCount}/${EARLY_ACCESS_MINIMUM} minimum. Do not launch ECG checkout.`);
  console.error("   Expand inventory before enabling ENABLE_ADVANCED_ECG_MODULE=true.");
  exitCode = 1;
}

console.log("\n── NP/CNPLE Checkout ────────────────────────────────────────────");
console.log("   NP/CNPLE checkout does NOT depend on ECG inventory.");
console.log("   NP/CNPLE checkout: UNBLOCKED by this gate.\n");

process.exit(exitCode);
