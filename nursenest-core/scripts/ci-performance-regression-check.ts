#!/usr/bin/env npx tsx
/**
 * ci-performance-regression-check.ts
 *
 * CI gate for performance regression detection.
 *
 * Checks (without a running server):
 *   1. Route registry integrity — all required budgets defined, no zero budgets on CI routes
 *   2. N+1 detector module presence and basic API contract
 *   3. Cache observability module presence
 *   4. Connection pool monitor module presence
 *   5. Activity startup metrics module presence
 *   6. Server-Timing module presence
 *   7. Baseline comparison (if perf-baseline.json exists)
 *   8. Performance module contract tests
 *
 * When E2E_PERF_BASELINE_PATH is set, also compares a live performance report
 * against the baseline to detect regressions.
 *
 * EXIT CODES
 *   0 — all checks pass (or only non-critical warnings)
 *   1 — critical regression or missing required module
 *   2 — warnings only
 *
 * USAGE
 *   npx tsx scripts/ci-performance-regression-check.ts
 *   REGRESSION_THRESHOLD_PCT=30 npx tsx scripts/ci-performance-regression-check.ts
 *   E2E_PERF_BASELINE_PATH=./perf-report.json npx tsx scripts/ci-performance-regression-check.ts
 *
 * ENV
 *   REGRESSION_THRESHOLD_PCT      % overage that triggers a failure (default: 50)
 *   E2E_PERF_BASELINE_PATH        path to a live perf report JSON to compare against baseline
 *   PERF_GOVERNANCE_STRICT        "1" — treat warnings as failures
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_ROOT = path.join(__dirname, "..");

const REGRESSION_THRESHOLD_PCT = Number(process.env.REGRESSION_THRESHOLD_PCT ?? "50");
const STRICT = process.env.PERF_GOVERNANCE_STRICT === "1";
const LIVE_REPORT_PATH = process.env.E2E_PERF_BASELINE_PATH?.trim() ?? null;
const BASELINE_PATH = path.join(APP_ROOT, "tests/e2e/performance/perf-baseline.json");

// ─── Failure accumulator ──────────────────────────────────────────────────────

type Finding = { severity: "critical" | "warning"; rule: string; message: string };
const findings: Finding[] = [];

function critical(rule: string, message: string) {
  findings.push({ severity: "critical", rule, message });
  console.error(`  ❌ [${rule}] ${message}`);
}

function warning(rule: string, message: string) {
  findings.push({ severity: "warning", rule, message });
  console.warn(`  ⚠️  [${rule}] ${message}`);
}

function pass(rule: string, message: string) {
  console.log(`  ✅ [${rule}] ${message}`);
}

// ─── Check 1: Required performance modules ────────────────────────────────────

function checkPerformanceModules(): void {
  console.log("\n[1] Performance observability modules …");

  const required = [
    { path: "src/lib/performance/route-registry.ts",          label: "Route performance registry" },
    { path: "src/lib/performance/server-timing.ts",           label: "Server-Timing builder" },
    { path: "src/lib/performance/n-plus-one-detector.ts",     label: "N+1 detector" },
    { path: "src/lib/performance/cache-observability.ts",     label: "Cache observability" },
    { path: "src/lib/performance/connection-pool-monitor.ts", label: "Connection pool monitor" },
    { path: "src/lib/performance/activity-startup-metrics.ts","label": "Activity startup metrics" },
    { path: "src/lib/performance/instant-load-architecture.ts","label": "Instant-load architecture contract" },
  ] as const;

  let allPresent = true;
  for (const mod of required) {
    const absPath = path.join(APP_ROOT, mod.path);
    if (fs.existsSync(absPath)) {
      pass("PERF-MOD", mod.label);
    } else {
      critical("PERF-MOD-MISSING", `${mod.label} not found: ${mod.path}`);
      allPresent = false;
    }
  }

  if (allPresent) {
    pass("PERF-MODULES", "All performance observability modules present");
  }
}

// ─── Check 2: Route registry contract ────────────────────────────────────────

function checkRouteRegistry(): void {
  console.log("\n[2] Route performance registry contract …");

  const registryPath = path.join(APP_ROOT, "src/lib/performance/route-registry.ts");
  if (!fs.existsSync(registryPath)) {
    critical("PERF-REG-MISSING", "route-registry.ts not found");
    return;
  }

  const content = fs.readFileSync(registryPath, "utf8");

  // Required route IDs that must be in the registry
  const REQUIRED_IDS = [
    "marketing-homepage",
    "marketing-pricing",
    "learner-dashboard",
    "learner-questions",
    "learner-flashcards",
    "learner-lessons",
    "learner-clinical-skills",
    "learner-pharmacology",
    "learner-ecg",
    "learner-cat",
    "learner-loft",
    "learner-analytics",
  ];

  let missing = 0;
  for (const id of REQUIRED_IDS) {
    if (content.includes(`id: "${id}"`)) {
      // found
    } else {
      critical("PERF-REG-ROUTE", `Required route budget missing: ${id}`);
      missing++;
    }
  }

  if (missing === 0) {
    pass("PERF-REG", `All ${REQUIRED_IDS.length} required route budgets defined`);
  }

  // Verify CI-enforced routes have non-zero TTFB budgets
  const ciRoutePattern = /ciEnforced:\s*true[\s\S]*?ttfbBudgetMs:\s*(\d+)/g;
  let match;
  let zeroTtfb = 0;
  while ((match = ciRoutePattern.exec(content)) !== null) {
    if (Number(match[1]) === 0) zeroTtfb++;
  }
  if (zeroTtfb > 0) {
    warning("PERF-REG-ZERO", `${zeroTtfb} CI-enforced route(s) have ttfbBudgetMs: 0 — should set explicit budget`);
  } else {
    pass("PERF-REG-BUDGETS", "All CI-enforced routes have non-zero TTFB budgets");
  }

  // Count CI-enforced routes
  const ciCount = (content.match(/ciEnforced:\s*true/g) ?? []).length;
  if (ciCount < 5) {
    warning("PERF-REG-CI", `Only ${ciCount} CI-enforced routes — consider adding more coverage`);
  } else {
    pass("PERF-REG-CI", `${ciCount} routes are CI-enforced`);
  }
}

// ─── Check 2b: Instant-load governance contract ──────────────────────────────

function checkInstantLoadGovernance(): void {
  console.log("\n[2b] Instant-load architecture governance …");

  const contractPath = path.join(APP_ROOT, "src/lib/performance/instant-load-architecture.ts");
  const registryPath = path.join(APP_ROOT, "src/lib/performance/route-registry.ts");
  if (!fs.existsSync(contractPath) || !fs.existsSync(registryPath)) {
    critical("PERF-INSTANT-MISSING", "Instant-load contract or route registry missing");
    return;
  }

  const contract = fs.readFileSync(contractPath, "utf8");
  const registry = fs.readFileSync(registryPath, "utf8");
  const requiredActivities = [
    "questions",
    "flashcards",
    "lessons",
    "clinical-skills",
    "pharmacology",
    "ecg",
    "cat",
    "loft",
  ];

  for (const activity of requiredActivities) {
    if (!contract.includes(`activity: "${activity}"`)) {
      critical("PERF-INSTANT-ACTIVITY", `Instant-load budget missing for ${activity}`);
    }
  }

  const requiredRouteBudgets = [
    { id: "learner-questions", ttfb: 500, load: 2000 },
    { id: "learner-flashcards", ttfb: 500, load: 2000 },
    { id: "learner-lessons", ttfb: 500, load: 2000 },
    { id: "learner-clinical-skills", ttfb: 500, load: 2000 },
    { id: "learner-pharmacology", ttfb: 500, load: 2000 },
    { id: "learner-ecg", ttfb: 500, load: 2000 },
    { id: "learner-cat", ttfb: 500, load: 3000 },
    { id: "learner-loft", ttfb: 500, load: 3000 },
  ];

  for (const budget of requiredRouteBudgets) {
    const routeBlock = new RegExp(`id:\\s*"${budget.id}"[\\s\\S]*?ciEnforced:\\s*true`, "m").exec(registry)?.[0] ?? "";
    if (!routeBlock) {
      critical("PERF-INSTANT-ROUTE", `Route ${budget.id} is missing or not CI-enforced`);
      continue;
    }
    if (!routeBlock.includes(`ttfbBudgetMs: ${budget.ttfb}`)) {
      critical("PERF-INSTANT-TTFB", `${budget.id} must keep TTFB budget at ${budget.ttfb}ms`);
    }
    if (!routeBlock.includes(`firstContentBudgetMs: ${budget.load}`)) {
      critical("PERF-INSTANT-LOAD", `${budget.id} must keep load budget at ${budget.load}ms`);
    }
  }

  const warmRoute = path.join(APP_ROOT, "src/app/api/learner/activity-warm-cache/route.ts");
  const warmer = path.join(APP_ROOT, "src/components/observability/learner-cache-warmer.tsx");
  if (fs.existsSync(warmRoute) && fs.existsSync(warmer)) {
    pass("PERF-WARM-CACHE", "Login/app-shell cache warmer and API route are present");
  } else {
    critical("PERF-WARM-CACHE", "Warm-cache API route or client warmer is missing");
  }
}

// ─── Check 3: Alert threshold alignment ──────────────────────────────────────

function checkAlertAlignment(): void {
  console.log("\n[3] Alert threshold alignment …");

  const alertPath = path.join(APP_ROOT, "src/lib/observability/alert-thresholds.ts");
  if (!fs.existsSync(alertPath)) {
    warning("PERF-ALERT", "alert-thresholds.ts not found — cannot verify alignment");
    return;
  }

  const content = fs.readFileSync(alertPath, "utf8");

  // Check for DB slow query threshold
  if (content.includes("slowQueryP95Ms")) {
    pass("PERF-ALERT-DB", "DB slow query p95 threshold defined");
  } else {
    warning("PERF-ALERT-DB", "DB slow query p95 threshold not found in alert-thresholds.ts");
  }

  // Check for pool utilization threshold
  const poolPath = path.join(APP_ROOT, "src/lib/performance/connection-pool-monitor.ts");
  if (fs.existsSync(poolPath)) {
    const poolContent = fs.readFileSync(poolPath, "utf8");
    if (poolContent.includes("POOL_ALERT_THRESHOLDS")) {
      pass("PERF-POOL-ALERT", "Connection pool alert thresholds defined");
    } else {
      warning("PERF-POOL-ALERT", "Pool alert thresholds not found");
    }
  }
}

// ─── Check 4: N+1 detector contract ──────────────────────────────────────────

function checkNPlusOneDetector(): void {
  console.log("\n[4] N+1 detector contract …");

  const detectorPath = path.join(APP_ROOT, "src/lib/performance/n-plus-one-detector.ts");
  if (!fs.existsSync(detectorPath)) {
    critical("PERF-N1-MISSING", "n-plus-one-detector.ts not found");
    return;
  }

  const content = fs.readFileSync(detectorPath, "utf8");

  const exports = ["detectNPlusOnePatterns", "warnOnNPlusOne", "formatNPlusOneReport"];
  for (const exp of exports) {
    if (content.includes(`export function ${exp}`)) {
      pass("PERF-N1", `${exp} exported`);
    } else {
      critical("PERF-N1-API", `Expected export not found: ${exp}`);
    }
  }

  const patterns = ["repeated-query", "sequential-waterfall", "unbounded-scan"];
  for (const p of patterns) {
    if (content.includes(`"${p}"`)) {
      pass("PERF-N1-TYPE", `Pattern type '${p}' defined`);
    } else {
      warning("PERF-N1-TYPE", `Pattern type '${p}' not found in detector`);
    }
  }
}

// ─── Check 5: Baseline regression (when live report provided) ─────────────────

function checkBaselineRegression(): void {
  console.log("\n[5] Performance baseline regression …");

  if (!LIVE_REPORT_PATH) {
    if (fs.existsSync(BASELINE_PATH)) {
      const age = (Date.now() - fs.statSync(BASELINE_PATH).mtimeMs) / (1000 * 60 * 60 * 24);
      if (age > 30) {
        warning("PERF-BASELINE-STALE", `perf-baseline.json is ${Math.round(age)} days old — regenerate with E2E_PERF_RECORD_BASELINE=1`);
      } else {
        pass("PERF-BASELINE", `Baseline exists (${Math.round(age)}d old). Pass E2E_PERF_BASELINE_PATH to compare live data.`);
      }
    } else {
      warning("PERF-BASELINE-MISSING", "No perf-baseline.json — run with E2E_PERF_RECORD_BASELINE=1 to create one");
    }
    return;
  }

  if (!fs.existsSync(BASELINE_PATH)) {
    warning("PERF-BASELINE", "No baseline to compare against — skipping regression check");
    return;
  }

  if (!fs.existsSync(LIVE_REPORT_PATH)) {
    critical("PERF-REPORT", `Live report not found at: ${LIVE_REPORT_PATH}`);
    return;
  }

  try {
    const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8")) as {
      results: Array<{ id: string; firstContentMs: number }>;
    };
    const live = JSON.parse(fs.readFileSync(LIVE_REPORT_PATH, "utf8")) as {
      results: Array<{ id: string; firstContentMs: number }>;
    };

    const liveMap = new Map(live.results.map((r) => [r.id, r.firstContentMs]));
    const regressions: string[] = [];

    for (const b of baseline.results) {
      const liveMs = liveMap.get(b.id);
      if (liveMs == null) continue;

      const pctChange = ((liveMs - b.firstContentMs) / b.firstContentMs) * 100;
      if (pctChange > REGRESSION_THRESHOLD_PCT) {
        regressions.push(
          `${b.id}: ${liveMs}ms vs baseline ${b.firstContentMs}ms (+${Math.round(pctChange)}%)`,
        );
      }
    }

    if (regressions.length === 0) {
      pass("PERF-REGRESSION", `No regressions > ${REGRESSION_THRESHOLD_PCT}% vs baseline`);
    } else {
      for (const r of regressions) {
        critical("PERF-REGRESSION", r);
      }
    }
  } catch (e) {
    critical("PERF-REGRESSION-PARSE", `Failed to parse performance reports: ${e instanceof Error ? e.message : String(e)}`);
  }
}

// ─── Check 6: Playwright performance test presence ────────────────────────────

function checkPerformanceTests(): void {
  console.log("\n[6] Playwright performance tests …");

  const testPath = path.join(
    APP_ROOT,
    "tests/e2e/performance/learner-activity-performance-budgets.spec.ts",
  );

  if (fs.existsSync(testPath)) {
    const content = fs.readFileSync(testPath, "utf8");
    const testCount = (content.match(/^  test\(/gm) ?? []).length;
    pass("PERF-E2E", `Performance spec found with ~${testCount} test(s)`);
  } else {
    warning("PERF-E2E-MISSING", "Playwright performance budget spec not found");
  }

  // Check that the test references the route registry
  if (fs.existsSync(testPath)) {
    const content = fs.readFileSync(testPath, "utf8");
    if (content.includes("ROUTE_PERFORMANCE_REGISTRY")) {
      pass("PERF-E2E-REGISTRY", "Performance tests reference route registry");
    } else {
      warning("PERF-E2E-REGISTRY", "Performance tests do not reference route registry");
    }
  }
}

// ─── Check 7: Learner observability platform modules ─────────────────────────

function checkObservabilityPlatform(): void {
  console.log("\n[7] Learner observability platform …");

  const REQUIRED_OBS_MODULES = [
    // Platform 1.0
    { path: "src/lib/observability/learner-completion-observability.ts",  label: "Completion observability" },
    { path: "src/lib/observability/user-friction-detector.ts",            label: "User friction detector" },
    { path: "src/lib/observability/time-to-learning-metrics.ts",          label: "Time-to-learning metrics" },
    { path: "src/lib/observability/adaptive-learning-observability.ts",   label: "Adaptive learning telemetry" },
    { path: "src/lib/observability/user-activity-audit-trail.ts",         label: "Activity audit trail (chargeback defense)" },
    { path: "src/lib/observability/feature-health-engine.ts",             label: "Feature health engine" },
    { path: "src/lib/observability/seo-observability.ts",                 label: "SEO observability" },
    { path: "src/lib/observability/ops-center.ts",                        label: "Operations center aggregator" },
    { path: "src/lib/observability/event-taxonomy.ts",                    label: "Platform event taxonomy" },
    { path: "src/components/admin/ops-center-dashboard.tsx",              label: "Ops center dashboard component" },
    { path: "src/app/api/admin/ops-center/route.ts",                      label: "Ops center API route" },
    { path: "src/app/(admin)/admin/ops-center/page.tsx",                  label: "Ops center admin page" },
    // Platform 2.0
    { path: "src/lib/observability/instrumentation-coverage-audit.ts",   label: "Instrumentation coverage audit" },
    { path: "src/lib/observability/activity-instrumentation-hooks.ts",   label: "Activity instrumentation hooks (wiring layer)" },
    { path: "src/lib/observability/learning-outcomes-engine.ts",         label: "Learning outcomes engine" },
    { path: "src/lib/observability/trend-analytics.ts",                  label: "Trend analytics (7d/30d/90d/180d)" },
    { path: "src/lib/observability/content-quality-intelligence.ts",     label: "Content quality intelligence" },
    { path: "src/lib/observability/rationale-quality-engine.ts",         label: "Rationale quality engine" },
    { path: "src/lib/observability/tier-alignment-engine.ts",            label: "Tier alignment audit engine" },
    { path: "src/lib/observability/platform-readiness-engine.ts",        label: "Platform readiness engine" },
    { path: "src/lib/observability/content-review-queue.ts",             label: "Content review queue" },
  ] as const;

  let allPresent = true;
  for (const mod of REQUIRED_OBS_MODULES) {
    const absPath = path.join(APP_ROOT, mod.path);
    if (fs.existsSync(absPath)) {
      pass("OBS-MOD", mod.label);
    } else {
      critical("OBS-MOD-MISSING", `${mod.label} not found: ${mod.path}`);
      allPresent = false;
    }
  }

  if (allPresent) {
    pass("OBS-PLATFORM", "All observability platform modules present");
  }

  // Verify event taxonomy has required categories
  const taxonomyPath = path.join(APP_ROOT, "src/lib/observability/event-taxonomy.ts");
  if (fs.existsSync(taxonomyPath)) {
    const content = fs.readFileSync(taxonomyPath, "utf8");
    const requiredCategories = ["LEARNER_EVENTS", "BILLING_EVENTS", "PERFORMANCE_EVENTS",
      "AUTH_EVENTS", "CONTENT_EVENTS", "SEO_EVENTS", "AUDIT_EVENTS", "ALL_EVENTS"];
    let taxPassed = 0;
    for (const cat of requiredCategories) {
      if (content.includes(`export const ${cat}`)) taxPassed++;
      else warning("OBS-TAXONOMY", `Missing event category: ${cat}`);
    }
    if (taxPassed === requiredCategories.length) {
      pass("OBS-TAXONOMY", `All ${requiredCategories.length} event categories defined`);
    }
  }

  // Verify Prisma schema has audit models
  const schemaPath = path.join(APP_ROOT, "prisma/schema.prisma");
  if (fs.existsSync(schemaPath)) {
    const content = fs.readFileSync(schemaPath, "utf8");
    const models = ["LearnerActivityEvent", "LearnerActivityAuditSnapshot", "UserFrictionEvent", "FeatureHealthSnapshot"];
    let schemaPass = 0;
    for (const m of models) {
      if (content.includes(`model ${m}`)) schemaPass++;
      else warning("OBS-SCHEMA", `Prisma model missing: ${m}`);
    }
    if (schemaPass === models.length) {
      pass("OBS-SCHEMA", `All ${models.length} observability Prisma models defined`);
    }
  }

  // Verify contract tests present (Platform 1.0 + 2.0)
  let totalTestCount = 0;
  const contractTests = [
    "src/lib/observability/learner-observability-platform.contract.test.ts",
    "src/lib/observability/observability-platform-2.contract.test.ts",
  ];
  for (const testFile of contractTests) {
    const contractTestPath = path.join(APP_ROOT, testFile);
    if (fs.existsSync(contractTestPath)) {
      const content = fs.readFileSync(contractTestPath, "utf8");
      const testCount = (content.match(/^test\(/gm) ?? []).length;
      totalTestCount += testCount;
      pass("OBS-TESTS", `${path.basename(testFile)}: ${testCount} test(s)`);
    } else {
      warning("OBS-TESTS", `Contract test not found: ${testFile}`);
    }
  }
  if (totalTestCount > 0) {
    pass("OBS-TESTS-TOTAL", `Total observability contract tests: ${totalTestCount}`);
  }

  const coverageAuditPath = path.join(APP_ROOT, "src/lib/observability/instrumentation-coverage-audit.ts");
  if (fs.existsSync(coverageAuditPath)) {
    const content = fs.readFileSync(coverageAuditPath, "utf8");
    const requiredLifecycleEvents = [
      "activity_started",
      "activity_completed",
      "activity_abandoned",
      "activity_error",
      "activity_resume",
    ];
    const missingLifecycleEvents = requiredLifecycleEvents.filter((event) => !content.includes(event));
    if (missingLifecycleEvents.length === 0) {
      pass("OBS-LIFECYCLE", "All required learner lifecycle events are represented");
    } else {
      critical("OBS-LIFECYCLE-MISSING", `Missing lifecycle events: ${missingLifecycleEvents.join(", ")}`);
    }

    if (content.includes('status: "dark"')) {
      critical("OBS-DARK-ROUTE", "Instrumentation coverage audit contains a dark learner route");
    } else {
      pass("OBS-DARK-ROUTE", "No dark learner routes in instrumentation coverage audit");
    }

    if (content.includes("isCoverageAcceptable(minPercent = 90)")) {
      pass("OBS-COVERAGE-GATE", "Observability coverage gate is set to 90%+");
    } else {
      critical("OBS-COVERAGE-GATE", "Observability coverage gate must default to 90%+");
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
  console.log("NurseNest — performance regression CI check");
  console.log(`Regression threshold : ${REGRESSION_THRESHOLD_PCT}%`);
  console.log(`Strict mode          : ${STRICT}`);
  if (LIVE_REPORT_PATH) console.log(`Live report          : ${LIVE_REPORT_PATH}`);

  checkPerformanceModules();
  checkRouteRegistry();
  checkInstantLoadGovernance();
  checkAlertAlignment();
  checkNPlusOneDetector();
  checkBaselineRegression();
  checkPerformanceTests();
  checkObservabilityPlatform();

  const criticals = findings.filter((f) => f.severity === "critical");
  const warnings = findings.filter((f) => f.severity === "warning");

  console.log("\n────────────────────────────────────────────");
  console.log(`Criticals  : ${criticals.length}`);
  console.log(`Warnings   : ${warnings.length}`);

  if (criticals.length > 0) {
    console.error("\n✗ Critical performance governance violations:");
    for (const f of criticals) {
      console.error(`  [${f.rule}] ${f.message}`);
    }
    process.exit(1);
  }

  if (warnings.length > 0 && STRICT) {
    console.error("\n✗ Warnings in strict mode:");
    for (const f of warnings) {
      console.error(`  [${f.rule}] ${f.message}`);
    }
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn("\n⚠ Warnings (non-blocking):");
    for (const f of warnings) {
      console.warn(`  [${f.rule}] ${f.message}`);
    }
    process.exit(2);
  }

  console.log("\n✓ All performance governance checks passed.");
}

main();
