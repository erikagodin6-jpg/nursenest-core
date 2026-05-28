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

function checkLegacyFallbacks(): void {
  console.log("\n[2] Legacy fallback images …");
  const legacyPaths = [
    "dashboard-redesign-preview/01-dash-desktop-ocean.png",
    "dashboard-redesign-preview/03-readiness-desktop.png",
    "dashboard-redesign-preview/07-coaching-panel.png",
    "dashboard-redesign-preview/10-cat-trajectory.png",
    "landing-polish-preview/png/08-flashcards-session-blossom.png",
    "landing-polish-preview/png/09-cat-readiness-ocean.png",
    "dashboard-redesign-preview/05-kpi-components.png",
  ];

  let allPresent = true;
  for (const relPath of legacyPaths) {
    const absPath = path.join(PUBLIC_DIR, relPath);
    if (!fs.existsSync(absPath)) {
      critical("GOV-FALLBACK", `Legacy fallback missing: ${relPath}`);
      allPresent = false;
    }
  }
  if (allPresent) {
    pass("GOV-FALLBACK", `All ${legacyPaths.length} legacy fallbacks present`);
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

// ─── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
  console.log("NurseNest — screenshot governance CI check");
  console.log(`Strict mode: ${STRICT}`);

  checkRegistryIntegrity();
  checkLegacyFallbacks();
  checkGeneratedScreenshots();
  checkManifestFreshness();

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
