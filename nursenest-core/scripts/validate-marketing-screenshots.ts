#!/usr/bin/env npx tsx
/**
 * validate-marketing-screenshots.ts
 *
 * Production validation report for all NurseNest marketing screenshots.
 * Verifies CDN accessibility, local file presence, component traceability,
 * and theme coverage. Generates a JSON + Markdown report.
 *
 * USAGE
 *   npx tsx scripts/validate-marketing-screenshots.ts
 *   npx tsx scripts/validate-marketing-screenshots.ts --cdn-check
 *   npx tsx scripts/validate-marketing-screenshots.ts --local-only
 *   npx tsx scripts/validate-marketing-screenshots.ts --output=report.json
 *
 * ENV
 *   SCREENSHOT_REPORT_FORMAT  "json" | "markdown" | "both" (default: both)
 *   SCREENSHOT_CDN_TIMEOUT_MS timeout for CDN HEAD requests (default: 5000)
 *
 * EXIT CODES
 *   0 — all checks pass
 *   1 — one or more critical checks failed
 *   2 — warnings only (missing optional files, stale fallbacks)
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_ROOT = path.join(__dirname, "..");

const PUBLIC_DIR = path.join(APP_ROOT, "public");
const GENERATED_DIR = path.join(PUBLIC_DIR, "marketing", "generated-screenshots");
const CDN_TIMEOUT_MS = Number(process.env.SCREENSHOT_CDN_TIMEOUT_MS ?? "5000");
const REPORT_FORMAT = (process.env.SCREENSHOT_REPORT_FORMAT ?? "both") as
  | "json"
  | "markdown"
  | "both";

// ─── CDN constants (must match screenshot-registry.ts) ───────────────────────

const CDN_BASE = "https://nursenest-images.tor1.cdn.digitaloceanspaces.com";
const CDN_SLOT_COUNT = 15;

// ─── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DO_CDN_CHECK = args.includes("--cdn-check") || args.includes("--full");
const LOCAL_ONLY = args.includes("--local-only");
const OUTPUT_FILE =
  args.find((a) => a.startsWith("--output="))?.slice("--output=".length) ?? null;

// ─── Types ────────────────────────────────────────────────────────────────────

type CheckStatus = "pass" | "warn" | "fail" | "skip";

type ScreenshotCheck = {
  id: string;
  category: "cdn-slot" | "local-generated" | "theme-variant" | "mobile" | "fallback" | "quality-gate";
  label: string;
  assetPath: string;
  status: CheckStatus;
  detail?: string;
  component?: string;
  page?: string;
  captureDate?: string;
};

type GeneratedManifest = {
  generatedAt?: string;
  totalErrors?: number;
  captures?: Array<{
    key?: string;
    tier?: string;
    viewport?: string;
    route?: string;
    files?: string[];
    qualityGate?: {
      passed?: boolean;
      readinessChecks?: string[];
      blockedStatesRejected?: string[];
    };
  }>;
  errors?: Array<{ key?: string; theme?: string; viewport?: string; error?: string }>;
};

type ValidationReport = {
  generatedAt: string;
  summary: {
    total: number;
    pass: number;
    warn: number;
    fail: number;
    skip: number;
  };
  cdnSlotsChecked: boolean;
  checks: ScreenshotCheck[];
  staleAssets: string[];
  missingCritical: string[];
  recommendations: string[];
};

// ─── CDN Slot metadata ────────────────────────────────────────────────────────

const CDN_SLOT_META: Record<
  number,
  { label: string; feature: string; pages: string[]; component: string }
> = {
  1:  { label: "Practice rationale panel",   feature: "rationale",     pages: ["home", "pricing", "faq"], component: "ScreenshotCarousel / MarketingChainScreenshot" },
  2:  { label: "Flashcard study mode",        feature: "flashcard",     pages: ["home"],                   component: "MarketingHeroCarousel" },
  3:  { label: "Learner dashboard",           feature: "dashboard",     pages: ["home", "faq"],            component: "ScreenshotCarousel" },
  4:  { label: "NGN question types",          feature: "question-types",pages: ["home"],                   component: "MarketingHeroCarousel" },
  5:  { label: "Progress reports",            feature: "reports",       pages: ["home"],                   component: "MarketingHeroCarousel" },
  6:  { label: "CAT exam session",            feature: "cat-exam",      pages: ["home", "pricing"],        component: "ScreenshotCarousel / ProductPreviewGrid" },
  7:  { label: "CAT results",                 feature: "cat-results",   pages: ["home", "pricing", "faq"], component: "ScreenshotCarousel / ProductPreviewGrid" },
  8:  { label: "Adaptive study plan",         feature: "study-plan",    pages: ["home"],                   component: "MarketingHeroCarousel" },
  9:  { label: "Smart review",                feature: "smart-review",  pages: ["home"],                   component: "MarketingHeroCarousel" },
  10: { label: "Question bank browse",        feature: "question-bank", pages: ["home", "faq"],            component: "MarketingHeroCarousel" },
  11: { label: "Confidence analytics",        feature: "confidence",    pages: ["home"],                   component: "MarketingHeroCarousel" },
  12: { label: "Lesson detail",               feature: "lesson",        pages: ["home", "faq"],            component: "MarketingHeroCarousel" },
  13: { label: "Lesson library",              feature: "lesson",        pages: ["home"],                   component: "MarketingHeroCarousel" },
  14: { label: "Marketing homepage",          feature: "general",       pages: ["home"],                   component: "MarketingHeroCarousel" },
  15: { label: "ECG / telemetry workspace",   feature: "ecg-workstation",pages: ["home"],                  component: "MarketingHeroCarousel" },
};

// ─── Required local files ─────────────────────────────────────────────────────

const REQUIRED_LOCAL = [
  // Core learner surfaces (used by tier-value-experience.tsx)
  "core/learner-dashboard.webp",
  "core/confidence-analytics.webp",
  "core/smart-review.webp",
  "core/cat-exam-session.webp",
  "core/flashcards.webp",
  "core/cat-results.webp",
  // RN tier
  "rn/rn-hub.webp",
  "rn/rn-flashcards.webp",
  "rn/rn-cat-exam.webp",
  "rn/rn-readiness.webp",
  // PN tier
  "pn/pn-hub.webp",
  // NP tier
  "np/np-hub.webp",
  "np/np-loft-simulation.webp",
  // Allied
  "allied/allied-hub.webp",
  // New Grad
  "newgrad/newgrad-hub.webp",
  "newgrad/newgrad-readiness.webp",
  // Marketing
  "marketing/marketing-home-desktop.webp",
  "marketing/pricing.webp",
  "marketing/faq.webp",
] as const;

const REQUIRED_MOBILE = [
  "mobile/mobile-homepage.webp",
  "mobile/mobile-pricing.webp",
  "mobile/mobile-questions.webp",
  "mobile/mobile-flashcards.webp",
] as const;

const REQUIRED_THEME_VARIANTS = [
  "themes/midnight/learner-dashboard.webp",
  "themes/blossom/learner-dashboard.webp",
  "themes/ocean/learner-dashboard.webp",
] as const;

// ─── Legacy fallback paths (should still exist as fallbacks) ─────────────────

const LEGACY_FALLBACK_PATHS = [
  "dashboard-redesign-preview/01-dash-desktop-ocean.png",
  "dashboard-redesign-preview/03-readiness-desktop.png",
  "dashboard-redesign-preview/07-coaching-panel.png",
  "dashboard-redesign-preview/10-cat-trajectory.png",
  "landing-polish-preview/png/08-flashcards-session-blossom.png",
  "landing-polish-preview/png/09-cat-readiness-ocean.png",
  "dashboard-redesign-preview/05-kpi-components.png",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function getFileStat(
  filePath: string,
): Promise<{ size: number; mtime: Date } | null> {
  try {
    const stat = await fs.stat(filePath);
    return { size: stat.size, mtime: stat.mtime };
  } catch {
    return null;
  }
}

async function cdnHead(url: string): Promise<{ ok: boolean; status: number; age?: number }> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), CDN_TIMEOUT_MS);
    const res = await fetch(url, { method: "HEAD", signal: ctrl.signal });
    clearTimeout(timer);
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

// ─── Check runners ────────────────────────────────────────────────────────────

async function checkCdnSlots(checks: ScreenshotCheck[]): Promise<void> {
  console.log("\n[CDN] Checking screenshot slots 1–15 …");

  for (let i = 1; i <= CDN_SLOT_COUNT; i++) {
    const key = `screenshot${i}.png`;
    const url = `${CDN_BASE}/${key}`;
    const meta = CDN_SLOT_META[i];
    const id = `cdn-slot-${i}`;

    process.stdout.write(`  slot ${String(i).padStart(2)} ${key} … `);
    const result = await cdnHead(url);

    if (result.ok) {
      console.log("✓ 200");
      checks.push({
        id,
        category: "cdn-slot",
        label: meta?.label ?? `Screenshot ${i}`,
        assetPath: url,
        status: "pass",
        component: meta?.component,
        page: meta?.pages.join(", "),
      });
    } else if (result.status === 404) {
      console.log("✗ 404 — NOT FOUND");
      checks.push({
        id,
        category: "cdn-slot",
        label: meta?.label ?? `Screenshot ${i}`,
        assetPath: url,
        status: "fail",
        detail: `CDN returned 404 — screenshot${i}.png has not been uploaded`,
        component: meta?.component,
        page: meta?.pages.join(", "),
      });
    } else {
      console.log(`⚠ ${result.status || "timeout"}`);
      checks.push({
        id,
        category: "cdn-slot",
        label: meta?.label ?? `Screenshot ${i}`,
        assetPath: url,
        status: result.status === 0 ? "warn" : "fail",
        detail: result.status === 0
          ? "CDN check timed out — verify connectivity"
          : `CDN returned HTTP ${result.status}`,
        component: meta?.component,
        page: meta?.pages.join(", "),
      });
    }
  }
}

async function checkLocalFiles(checks: ScreenshotCheck[]): Promise<void> {
  console.log("\n[LOCAL] Checking generated screenshot files …");

  for (const relPath of REQUIRED_LOCAL) {
    const absPath = path.join(GENERATED_DIR, relPath);
    const stat = await getFileStat(absPath);
    const id = `local-${relPath.replace(/[/\\.]/g, "-")}`;

    if (!stat) {
      console.log(`  ✗ MISSING  ${relPath}`);
      checks.push({
        id,
        category: "local-generated",
        label: relPath,
        assetPath: absPath,
        status: "fail",
        detail: "File not found — run: npm run generate:marketing-screenshots",
      });
    } else {
      const daysOld = (Date.now() - stat.mtime.getTime()) / (1000 * 60 * 60 * 24);
      const isStale = daysOld > 30;
      const sizeKb = Math.round(stat.size / 1024);
      const isEmpty = stat.size < 1024;

      if (isEmpty) {
        console.log(`  ✗ EMPTY    ${relPath}  (${sizeKb}KB)`);
        checks.push({
          id,
          category: "local-generated",
          label: relPath,
          assetPath: absPath,
          status: "fail",
          detail: `File exists but is suspiciously small (${sizeKb}KB) — may be a broken placeholder`,
          captureDate: stat.mtime.toISOString(),
        });
      } else if (isStale) {
        console.log(`  ⚠ STALE    ${relPath}  (${Math.round(daysOld)}d old)`);
        checks.push({
          id,
          category: "local-generated",
          label: relPath,
          assetPath: absPath,
          status: "warn",
          detail: `Screenshot is ${Math.round(daysOld)} days old — consider regenerating`,
          captureDate: stat.mtime.toISOString(),
        });
      } else {
        console.log(`  ✓  ${relPath}  (${sizeKb}KB, ${Math.round(daysOld)}d old)`);
        checks.push({
          id,
          category: "local-generated",
          label: relPath,
          assetPath: absPath,
          status: "pass",
          captureDate: stat.mtime.toISOString(),
        });
      }
    }
  }
}

async function checkMobileFiles(checks: ScreenshotCheck[]): Promise<void> {
  console.log("\n[MOBILE] Checking mobile-first screenshots …");

  for (const relPath of REQUIRED_MOBILE) {
    const absPath = path.join(GENERATED_DIR, relPath);
    const stat = await getFileStat(absPath);
    const id = `mobile-${relPath.replace(/[/\\.]/g, "-")}`;

    if (!stat) {
      console.log(`  ⚠ MISSING  ${relPath}`);
      checks.push({
        id,
        category: "mobile",
        label: relPath,
        assetPath: absPath,
        status: "warn",
        detail: "Mobile screenshot not generated — run: npm run generate:marketing-screenshots --tier=mobile",
      });
    } else {
      console.log(`  ✓  ${relPath}`);
      checks.push({
        id,
        category: "mobile",
        label: relPath,
        assetPath: absPath,
        status: "pass",
        captureDate: stat.mtime.toISOString(),
      });
    }
  }
}

async function checkThemeVariants(checks: ScreenshotCheck[]): Promise<void> {
  console.log("\n[THEMES] Checking multi-theme variants …");

  const themes = ["ocean", "midnight", "blossom", "aurora", "sage-garden"];
  const keyScreenshots = ["learner-dashboard.webp", "flashcards.webp", "marketing-home-desktop.webp"];

  for (const theme of themes) {
    let themePass = 0;
    for (const key of keyScreenshots) {
      const relPath = `themes/${theme}/${key}`;
      const absPath = path.join(GENERATED_DIR, relPath);
      const exists = await fileExists(absPath);
      const id = `theme-${theme}-${key.replace(/\./g, "-")}`;

      if (exists) {
        themePass++;
        checks.push({
          id,
          category: "theme-variant",
          label: `${theme} / ${key}`,
          assetPath: absPath,
          status: "pass",
        });
      } else {
        checks.push({
          id,
          category: "theme-variant",
          label: `${theme} / ${key}`,
          assetPath: absPath,
          status: "warn",
          detail: "Theme variant not generated — run with --theme-variants-only",
        });
      }
    }
    const allPass = themePass === keyScreenshots.length;
    console.log(`  ${allPass ? "✓" : "⚠"} theme:${theme}  ${themePass}/${keyScreenshots.length} key shots`);
  }
}

async function checkLegacyFallbacks(checks: ScreenshotCheck[]): Promise<void> {
  console.log("\n[FALLBACKS] Verifying legacy fallback images exist …");

  for (const relPath of LEGACY_FALLBACK_PATHS) {
    const absPath = path.join(PUBLIC_DIR, relPath);
    const exists = await fileExists(absPath);
    const id = `fallback-${relPath.replace(/[/\\.]/g, "-")}`;

    if (exists) {
      console.log(`  ✓  ${relPath}`);
      checks.push({
        id,
        category: "fallback",
        label: relPath,
        assetPath: absPath,
        status: "pass",
        detail: "Legacy fallback in place",
      });
    } else {
      console.log(`  ✗  ${relPath} — MISSING`);
      checks.push({
        id,
        category: "fallback",
        label: relPath,
        assetPath: absPath,
        status: "fail",
        detail: "Legacy fallback image is missing — tier-value-experience fallbackScreenshot will break",
      });
    }
  }
}

async function checkManifestQualityGate(checks: ScreenshotCheck[]): Promise<void> {
  console.log("\n[QUALITY] Checking generated manifest quality gates …");
  const manifestPath = path.join(GENERATED_DIR, "manifest.json");
  let raw = "";
  try {
    raw = await fs.readFile(manifestPath, "utf8");
  } catch {
    console.log("  ✗ manifest.json missing");
    checks.push({
      id: "quality-manifest-missing",
      category: "quality-gate",
      label: "manifest.json",
      assetPath: manifestPath,
      status: "fail",
      detail: "Generated screenshot manifest is missing.",
    });
    return;
  }

  let manifest: GeneratedManifest;
  try {
    manifest = JSON.parse(raw) as GeneratedManifest;
  } catch {
    checks.push({
      id: "quality-manifest-json",
      category: "quality-gate",
      label: "manifest.json",
      assetPath: manifestPath,
      status: "fail",
      detail: "Generated screenshot manifest is not valid JSON.",
    });
    return;
  }

  const errors = manifest.errors ?? [];
  if ((manifest.totalErrors ?? errors.length) > 0) {
    console.log(`  ✗ manifest has ${manifest.totalErrors ?? errors.length} capture errors`);
    checks.push({
      id: "quality-manifest-errors",
      category: "quality-gate",
      label: "capture errors",
      assetPath: manifestPath,
      status: "fail",
      detail: errors.map((e) => `${e.key ?? "unknown"}: ${e.error ?? "error"}`).slice(0, 4).join("; "),
    });
  } else {
    console.log("  ✓ no capture errors recorded");
    checks.push({
      id: "quality-manifest-errors",
      category: "quality-gate",
      label: "capture errors",
      assetPath: manifestPath,
      status: "pass",
    });
  }

  const captures = manifest.captures ?? [];
  if (captures.length === 0) {
    checks.push({
      id: "quality-manifest-empty",
      category: "quality-gate",
      label: "captured screenshots",
      assetPath: manifestPath,
      status: "fail",
      detail: "No screenshots are recorded in the manifest.",
    });
    return;
  }

  let passed = 0;
  let missing = 0;
  for (const capture of captures) {
    const hasGate =
      capture.qualityGate?.passed === true &&
      Array.isArray(capture.qualityGate.readinessChecks) &&
      capture.qualityGate.readinessChecks.length > 0 &&
      Array.isArray(capture.qualityGate.blockedStatesRejected) &&
      capture.qualityGate.blockedStatesRejected.length > 0;
    if (hasGate) passed++;
    else missing++;
  }
  console.log(`  ${missing === 0 ? "✓" : "✗"} quality gate metadata ${passed}/${captures.length}`);
  checks.push({
    id: "quality-manifest-gate-metadata",
    category: "quality-gate",
    label: "quality gate metadata",
    assetPath: manifestPath,
    status: missing === 0 ? "pass" : "fail",
    detail: missing === 0 ? undefined : `${missing} capture(s) were generated before screenshot readiness guards existed. Regenerate before publishing.`,
  });
}

// ─── Report generation ────────────────────────────────────────────────────────

function buildReport(checks: ScreenshotCheck[], cdnChecked: boolean): ValidationReport {
  const summary = {
    total: checks.length,
    pass: checks.filter((c) => c.status === "pass").length,
    warn: checks.filter((c) => c.status === "warn").length,
    fail: checks.filter((c) => c.status === "fail").length,
    skip: checks.filter((c) => c.status === "skip").length,
  };

  const missingCritical = checks
    .filter((c) => c.status === "fail" && c.category === "cdn-slot")
    .map((c) => c.assetPath);

  const staleAssets = checks
    .filter((c) => c.status === "warn" && c.captureDate)
    .map((c) => `${c.label} (${c.captureDate})`);

  const recommendations: string[] = [];

  if (checks.some((c) => c.status === "fail" && c.category === "local-generated")) {
    recommendations.push("Run: npm run generate:marketing-screenshots (then review and upload to CDN)");
  }
  if (checks.some((c) => c.status === "warn" && c.category === "mobile")) {
    recommendations.push("Run: npm run generate:marketing-screenshots -- --tier=mobile");
  }
  if (checks.some((c) => c.status === "warn" && c.category === "theme-variant")) {
    recommendations.push("Run: npm run generate:marketing-screenshots -- --theme-variants-only");
  }
  if (checks.some((c) => c.status === "fail" && c.category === "cdn-slot")) {
    recommendations.push(
      "Upload generated screenshots to DigitalOcean Spaces (see docs/SCREENSHOT_CAPTURE_TO_CDN.md)",
    );
  }
  if (staleAssets.length > 3) {
    recommendations.push("Several screenshots are >30 days old — regenerate before next major release");
  }

  return {
    generatedAt: new Date().toISOString(),
    summary,
    cdnSlotsChecked: cdnChecked,
    checks,
    staleAssets,
    missingCritical,
    recommendations,
  };
}

function buildMarkdown(report: ValidationReport): string {
  const { summary } = report;
  const statusIcon = (s: CheckStatus) =>
    ({ pass: "✅", warn: "⚠️", fail: "❌", skip: "⏭️" })[s];

  const lines: string[] = [
    "# NurseNest Marketing Screenshot Validation Report",
    "",
    `**Generated:** ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `| Status | Count |`,
    `|--------|-------|`,
    `| ✅ Pass | ${summary.pass} |`,
    `| ⚠️ Warn | ${summary.warn} |`,
    `| ❌ Fail | ${summary.fail} |`,
    `| Total | ${summary.total} |`,
    "",
  ];

  if (report.missingCritical.length > 0) {
    lines.push("## ❌ Critical Failures", "");
    for (const m of report.missingCritical) lines.push(`- \`${m}\``);
    lines.push("");
  }

  if (report.recommendations.length > 0) {
    lines.push("## Recommendations", "");
    for (const r of report.recommendations) lines.push(`- ${r}`);
    lines.push("");
  }

  const categories = [
    "cdn-slot",
    "local-generated",
    "mobile",
    "theme-variant",
    "fallback",
    "quality-gate",
  ] as const;
  const categoryLabels: Record<string, string> = {
    "cdn-slot": "CDN Slots (screenshot1–15)",
    "local-generated": "Local Generated Files",
    "mobile": "Mobile Screenshots",
    "theme-variant": "Theme Variants",
    "fallback": "Legacy Fallback Images",
    "quality-gate": "Screenshot Readiness Quality Gate",
  };

  for (const cat of categories) {
    const catChecks = report.checks.filter((c) => c.category === cat);
    if (catChecks.length === 0) continue;

    lines.push(`## ${categoryLabels[cat]}`, "");
    lines.push("| Status | Asset | Detail |");
    lines.push("|--------|-------|--------|");
    for (const c of catChecks) {
      const detail = c.detail ? c.detail.replace(/\|/g, "\\|") : "";
      lines.push(`| ${statusIcon(c.status)} | \`${c.label}\` | ${detail} |`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("NurseNest — marketing screenshot validation");
  console.log(`CDN check : ${DO_CDN_CHECK ? "enabled" : "skipped (use --cdn-check)"}`);
  console.log(`Local only: ${LOCAL_ONLY}`);
  console.log();

  const checks: ScreenshotCheck[] = [];

  if (DO_CDN_CHECK && !LOCAL_ONLY) {
    await checkCdnSlots(checks);
  }

  if (!DO_CDN_CHECK && !LOCAL_ONLY) {
    console.log("[CDN] Skipping CDN checks. Pass --cdn-check or --full to include.");
    // Add skipped entries
    for (let i = 1; i <= CDN_SLOT_COUNT; i++) {
      checks.push({
        id: `cdn-slot-${i}`,
        category: "cdn-slot",
        label: CDN_SLOT_META[i]?.label ?? `Screenshot ${i}`,
        assetPath: `${CDN_BASE}/screenshot${i}.png`,
        status: "skip",
        detail: "CDN check skipped — use --cdn-check flag",
      });
    }
  }

  await checkLocalFiles(checks);
  await checkMobileFiles(checks);
  await checkThemeVariants(checks);
  await checkLegacyFallbacks(checks);
  await checkManifestQualityGate(checks);

  const report = buildReport(checks, DO_CDN_CHECK && !LOCAL_ONLY);

  // Print summary
  console.log("\n────────────────────────────────────────────");
  console.log(`Total     : ${report.summary.total}`);
  console.log(`Pass      : ${report.summary.pass}`);
  console.log(`Warn      : ${report.summary.warn}`);
  console.log(`Fail      : ${report.summary.fail}`);

  // Write reports
  const reportBase = OUTPUT_FILE ?? path.join(APP_ROOT, "docs", "screenshot-validation");

  if (REPORT_FORMAT === "json" || REPORT_FORMAT === "both") {
    const jsonPath = OUTPUT_FILE ?? `${reportBase}.json`;
    await fs.mkdir(path.dirname(jsonPath), { recursive: true });
    await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
    console.log(`\nJSON      : ${jsonPath}`);
  }

  if (REPORT_FORMAT === "markdown" || REPORT_FORMAT === "both") {
    const mdPath = OUTPUT_FILE
      ? OUTPUT_FILE.replace(/\.json$/, ".md")
      : `${reportBase}.md`;
    await fs.mkdir(path.dirname(mdPath), { recursive: true });
    await fs.writeFile(mdPath, buildMarkdown(report));
    console.log(`Markdown  : ${mdPath}`);
  }

  if (report.recommendations.length > 0) {
    console.log("\nRecommendations:");
    for (const r of report.recommendations) {
      console.log(`  • ${r}`);
    }
  }

  // Exit code
  if (report.summary.fail > 0) {
    console.error(`\n✗ ${report.summary.fail} critical check(s) failed.`);
    process.exit(1);
  }
  if (report.summary.warn > 0) {
    console.warn(`\n⚠ ${report.summary.warn} warning(s) — not blocking but should be addressed.`);
    process.exit(2);
  }

  console.log("\n✓ All checks passed.");
}

main().catch((e) => {
  console.error("FATAL:", e instanceof Error ? e.message : e);
  process.exit(1);
});
