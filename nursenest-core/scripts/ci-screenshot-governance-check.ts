#!/usr/bin/env npx tsx
/**
 * ci-screenshot-governance-check.ts
 *
 * CI gate: fails the build when the screenshot system violates governance rules.
 *
 * Checks (in order of severity):
 *   1. Screenshot registry integrity (no broken IDs, CDN URLs, missing groups)
 *   2. Legacy fallback images exist on disk
 *   3. Governed marketing routes have screenshot coverage
 *   4. Generated screenshots are present and not empty (when local dir exists)
 *   5. Manifest freshness (when manifest.json exists)
 *   6. Manifest quality gates (no loading/error-state captures published)
 *
 * Does NOT make HTTP requests to the CDN (use validate-marketing-screenshots.ts --cdn-check for that).
 *
 * EXIT CODES
 *   0 — all governance checks pass
 *   1 — critical violation (blocks release)
 *   2 — warning (non-blocking, logs to stderr)
 *
 * USAGE
 *   npx tsx scripts/ci-screenshot-governance-check.ts
 *   SCREENSHOT_GOVERNANCE_STRICT=1 npx tsx scripts/ci-screenshot-governance-check.ts
 *
 * ENV
 *   SCREENSHOT_GOVERNANCE_STRICT  "1" to treat warnings as failures
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  validateScreenshotRegistry,
  REQUIRED_GENERATED_PATHS,
  SCREENSHOT_STALENESS_THRESHOLD_DAYS,
  isScreenshotFresh,
} from "../src/lib/marketing/screenshot-governance";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_ROOT = path.join(__dirname, "..");

const STRICT = process.env.SCREENSHOT_GOVERNANCE_STRICT === "1";

const PUBLIC_DIR = path.join(APP_ROOT, "public");
const GENERATED_DIR = path.join(PUBLIC_DIR, "marketing", "generated-screenshots");
const MANIFEST_PATH = path.join(GENERATED_DIR, "manifest.json");

// ─── Types ────────────────────────────────────────────────────────────────────

type Failure = { severity: "critical" | "warning"; rule: string; message: string };
const failures: Failure[] = [];

function critical(rule: string, message: string) {
  failures.push({ severity: "critical", rule, message });
  console.error(`  ❌ [${rule}] ${message}`);
}

function warning(rule: string, message: string) {
  failures.push({ severity: "warning", rule, message });
  console.warn(`  ⚠️  [${rule}] ${message}`);
}

function pass(rule: string, message: string) {
  console.log(`  ✅ [${rule}] ${message}`);
}

// ─── Checks ───────────────────────────────────────────────────────────────────

function checkRegistryIntegrity(): void {
  console.log("\n[1] Screenshot registry integrity …");
  const violations = validateScreenshotRegistry();
  for (const v of violations) {
    if (v.severity === "critical") {
      critical(v.ruleId, v.message);
    } else {
      warning(v.ruleId, v.message);
    }
  }
  if (violations.filter((v) => v.severity === "critical").length === 0) {
    pass("GOV-REG", "Registry integrity checks passed");
  }
}

function checkProductFallbacks(): void {
  console.log("\n[2] Generated product fallback WebPs …");
  const fallbackPaths = [
    "marketing/generated-screenshots/core/learner-dashboard.webp",
    "marketing/generated-screenshots/core/confidence-analytics.webp",
    "marketing/generated-screenshots/core/smart-review.webp",
    "marketing/generated-screenshots/core/cat-exam-session.webp",
    "marketing/generated-screenshots/core/flashcards.webp",
    "marketing/generated-screenshots/core/cat-results.webp",
  ];

  let allPresent = true;
  for (const relPath of fallbackPaths) {
    const absPath = path.join(PUBLIC_DIR, relPath);
    if (!fs.existsSync(absPath)) {
      critical("GOV-FALLBACK", `Product fallback missing: ${relPath}`);
      allPresent = false;
    }
  }
  if (allPresent) {
    pass("GOV-FALLBACK", `All ${fallbackPaths.length} generated product fallbacks present`);
  }
}

function checkGeneratedScreenshots(): void {
  console.log("\n[3] Generated screenshots …");

  if (!fs.existsSync(GENERATED_DIR)) {
    warning(
      "GOV-LOCAL",
      `Generated screenshots directory not found: ${GENERATED_DIR}\n` +
        "   Run: npm run generate:marketing-screenshots",
    );
    return;
  }

  let missing = 0;
  let empty = 0;
  let present = 0;

  for (const relPath of REQUIRED_GENERATED_PATHS) {
    const absPath = path.join(PUBLIC_DIR, relPath);
    if (!fs.existsSync(absPath)) {
      missing++;
      warning("GOV-LOCAL", `Missing: ${relPath}`);
    } else {
      const stat = fs.statSync(absPath);
      if (stat.size < 1024) {
        empty++;
        critical(
          "GOV-LOCAL-EMPTY",
          `Screenshot appears empty or corrupt: ${relPath} (${stat.size}B)`,
        );
      } else {
        present++;
      }
    }
  }

  if (missing === 0 && empty === 0) {
    pass("GOV-LOCAL", `All ${REQUIRED_GENERATED_PATHS.length} required screenshots present`);
  } else if (missing > 0) {
    warning(
      "GOV-LOCAL-MISSING",
      `${missing} required screenshots not generated — run: npm run generate:marketing-screenshots`,
    );
  }
}

function checkManifestFreshness(): void {
  console.log("\n[4] Screenshot manifest freshness …");

  if (!fs.existsSync(MANIFEST_PATH)) {
    warning("GOV-MANIFEST", "manifest.json not found — screenshots have never been generated");
    return;
  }

  try {
    const raw = fs.readFileSync(MANIFEST_PATH, "utf8");
    const manifest = JSON.parse(raw) as Record<string, unknown>;
    const genDate = manifest.generatedAt as string | undefined;

    if (!genDate) {
      warning("GOV-MANIFEST", "manifest.json is missing generatedAt field");
      return;
    }

    const fresh = isScreenshotFresh(genDate, SCREENSHOT_STALENESS_THRESHOLD_DAYS);
    const daysOld = Math.round(
      (Date.now() - new Date(genDate).getTime()) / (1000 * 60 * 60 * 24),
    );

    if (!fresh) {
      warning(
        "GOV-STALE",
        `Screenshots are ${daysOld} days old (threshold: ${SCREENSHOT_STALENESS_THRESHOLD_DAYS}d) — regenerate before next release`,
      );
    } else {
      pass(
        "GOV-MANIFEST",
        `Screenshots are ${daysOld} days old (within ${SCREENSHOT_STALENESS_THRESHOLD_DAYS}d threshold)`,
      );
    }

    const total = manifest.totalCaptured as number | undefined;
    if (typeof total === "number" && total > 0) {
      pass("GOV-MANIFEST-COUNT", `Manifest reports ${total} captured screenshots`);
    }
  } catch {
    critical("GOV-MANIFEST-PARSE", "manifest.json is not valid JSON");
  }
}

function checkManifestQualityGates(): void {
  console.log("\n[5] Screenshot readiness quality gates …");

  if (!fs.existsSync(MANIFEST_PATH)) {
    warning("GOV-QUALITY-MANIFEST", "manifest.json not found — cannot prove screenshots passed readiness guards");
    return;
  }

  try {
    const raw = fs.readFileSync(MANIFEST_PATH, "utf8");
    const manifest = JSON.parse(raw) as {
      totalErrors?: number;
      captures?: Array<{ key?: string; qualityGate?: { passed?: boolean; readinessChecks?: string[]; blockedStatesRejected?: string[] } }>;
      errors?: unknown[];
    };
    const errorCount = manifest.totalErrors ?? manifest.errors?.length ?? 0;
    if (errorCount > 0) {
      critical("GOV-QUALITY-ERRORS", `Manifest contains ${errorCount} failed capture(s); do not publish partial screenshot sets.`);
    }
    const captures = manifest.captures ?? [];
    if (captures.length === 0) {
      critical("GOV-QUALITY-EMPTY", "Manifest contains no captures.");
      return;
    }
    const missingGate = captures.filter(
      (capture) =>
        capture.qualityGate?.passed !== true ||
        !capture.qualityGate.readinessChecks?.length ||
        !capture.qualityGate.blockedStatesRejected?.length,
    );
    if (missingGate.length > 0) {
      critical(
        "GOV-QUALITY-GATE",
        `${missingGate.length} screenshot(s) lack readiness qualityGate metadata. Regenerate with the hardened generator before publishing.`,
      );
    } else {
      pass("GOV-QUALITY-GATE", `All ${captures.length} captures passed readiness quality gates`);
    }
  } catch {
    critical("GOV-QUALITY-PARSE", "manifest.json is not valid JSON");
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
  console.log("NurseNest — screenshot governance CI check");
  console.log(`Strict mode: ${STRICT}`);

  checkRegistryIntegrity();
  checkProductFallbacks();
  checkGeneratedScreenshots();
  checkManifestFreshness();
  checkManifestQualityGates();

  const criticals = failures.filter((f) => f.severity === "critical");
  const warnings = failures.filter((f) => f.severity === "warning");

  console.log("\n────────────────────────────────────────────");
  console.log(`Criticals : ${criticals.length}`);
  console.log(`Warnings  : ${warnings.length}`);

  if (criticals.length > 0) {
    console.error("\n✗ Critical governance violations — fix before release:");
    for (const f of criticals) {
      console.error(`  [${f.rule}] ${f.message}`);
    }
    process.exit(1);
  }

  if (warnings.length > 0 && STRICT) {
    console.error("\n✗ Governance warnings in strict mode:");
    for (const f of warnings) {
      console.error(`  [${f.rule}] ${f.message}`);
    }
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn("\n⚠ Governance warnings (non-blocking):");
    for (const f of warnings) {
      console.warn(`  [${f.rule}] ${f.message}`);
    }
    console.warn("\nPass SCREENSHOT_GOVERNANCE_STRICT=1 to treat warnings as failures.");
    process.exit(2);
  }

  console.log("\n✓ All screenshot governance checks passed.");
}

main();
