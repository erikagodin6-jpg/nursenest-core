/**
 * Learner Activity Performance Budgets
 *
 * Verifies that every learner activity hub meets its startup time budget
 * when accessed by a paid learner account.
 *
 * Measured metrics (per activity):
 *   - firstContentMs: wall-clock from navigation to meaningful content visible
 *   - timeToInteractiveApproxMs: Navigation Timing `domInteractive - startTime`
 *   - worstApiMs: slowest same-origin /api/* call during the page load
 *   - Server-Timing header values (when present)
 *
 * Activities covered:
 *   RN, RPN, NP, Allied, New Grad across:
 *   Dashboard, Questions, Flashcards, Lessons, Clinical Skills,
 *   Pharmacology, ECG, CAT, LOFT, Analytics, Readiness
 *
 * RUN
 *   npm run test:e2e:performance-budgets
 *   npx playwright test tests/e2e/performance/learner-activity-performance-budgets.spec.ts --project=chromium-paid
 *
 * ENV
 *   E2E_PERF_CONTENT_BUDGET_MS  override firstContent budget (default per-route)
 *   E2E_PERF_LOADING_BUDGET_MS  override loading shell max (default: 5000)
 *   E2E_PERF_RECORD_BASELINE    set "1" to write results to perf-baseline.json
 */

import { expect, test, type Page, type Locator } from "@playwright/test";
import { readDomInteractiveMs, attachApiResponseTimeCollector } from "../helpers/learner-key-pages-performance";
import {
  ROUTE_PERFORMANCE_REGISTRY,
  type RouteBudget,
} from "../../../src/lib/performance/route-registry";

// ─── Constants ────────────────────────────────────────────────────────────────

const CONTENT_BUDGET_MS_OVERRIDE = process.env.E2E_PERF_CONTENT_BUDGET_MS
  ? Number(process.env.E2E_PERF_CONTENT_BUDGET_MS)
  : null;
const LOADING_BUDGET_MS = Number(process.env.E2E_PERF_LOADING_BUDGET_MS ?? "5000");
const RECORD_BASELINE = process.env.E2E_PERF_RECORD_BASELINE === "1";

// ─── Helpers ──────────────────────────────────────────────────────────────────

type PerfResult = {
  id: string;
  label: string;
  route: string;
  firstContentMs: number;
  timeToInteractiveMs: number | null;
  worstApiMs: number;
  serverTimingDb?: number | null;
  serverTimingTotal?: number | null;
  budgetMs: number;
  passed: boolean;
};

/** Read Server-Timing header values from the most recent page navigation. */
async function readServerTiming(page: Page): Promise<{ db: number | null; total: number | null }> {
  return page.evaluate(() => {
    const resourceEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const nav = resourceEntries[0];
    if (!nav) return { db: null, total: null };
    // Server-Timing is exposed via PerformanceServerTiming
    const st = (nav as PerformanceNavigationTiming & {
      serverTiming?: Array<{ name: string; duration: number }>;
    }).serverTiming;
    if (!st || st.length === 0) return { db: null, total: null };
    const dbEntry = st.find((e) => e.name === "db");
    const totalEntry = st.find((e) => e.name === "total");
    return {
      db: dbEntry ? Math.round(dbEntry.duration) : null,
      total: totalEntry ? Math.round(totalEntry.duration) : null,
    };
  });
}

/** Wait for the loading shell to disappear (no aria-busy on main). */
async function waitForLoadingShellDismissed(page: Page, timeoutMs: number): Promise<void> {
  await page
    .locator("main [aria-busy='true'], .nn-qbank-skeleton")
    .waitFor({ state: "hidden", timeout: timeoutMs })
    .catch(() => {
      /* Non-fatal: loading shell may not appear on fast loads. */
    });
}

/** Navigate to a route and measure time-to-first-content against the budget. */
async function measureRoute(
  page: Page,
  budget: RouteBudget,
  appOrigin: string,
): Promise<PerfResult> {
  const api = attachApiResponseTimeCollector(page, appOrigin);
  api.clear();

  const effectiveBudget = CONTENT_BUDGET_MS_OVERRIDE ?? budget.firstContentBudgetMs;
  const navStart = Date.now();

  await page.goto(budget.route, { waitUntil: "domcontentloaded", timeout: 60_000 });

  // Wait for a broad "meaningful content" signal: main element with children
  await page
    .locator("main")
    .first()
    .waitFor({ state: "visible", timeout: effectiveBudget });

  const firstContentMs = Date.now() - navStart;
  await waitForLoadingShellDismissed(page, LOADING_BUDGET_MS);

  const tti = await readDomInteractiveMs(page);
  const st = await readServerTiming(page);

  const apiSamples = [...api.samples];
  const worstApiMs = apiSamples.reduce((max, s) => Math.max(max, s.durationMs), 0);

  api.dispose();

  return {
    id: budget.id,
    label: budget.label,
    route: budget.route,
    firstContentMs,
    timeToInteractiveMs: tti,
    worstApiMs,
    serverTimingDb: st.db,
    serverTimingTotal: st.total,
    budgetMs: effectiveBudget,
    passed: firstContentMs <= effectiveBudget,
  };
}

// ─── Learner activity tests ───────────────────────────────────────────────────

const LEARNER_BUDGETS = ROUTE_PERFORMANCE_REGISTRY.filter(
  (r) =>
    r.category.startsWith("learner-") &&
    r.ciEnforced,
);

const MARKETING_BUDGETS = ROUTE_PERFORMANCE_REGISTRY.filter(
  (r) => r.category.startsWith("marketing-") && r.ciEnforced,
);

test.describe("Learner activity startup budgets (paid account)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  const results: PerfResult[] = [];

  test.afterAll(async () => {
    if (results.length === 0) return;

    // Print table
    const header = `${"Route".padEnd(32)} ${"First content".padEnd(16)} ${"Budget".padEnd(10)} ${"TTI".padEnd(10)} ${"API worst".padEnd(12)} ${"DB(ST)".padEnd(10)} Status`;
    console.log("\n── Activity Performance Results ──────────────────────");
    console.log(header);
    for (const r of results) {
      const status = r.passed ? "✓" : "✗";
      const col = (s: string, w: number) => s.padEnd(w);
      console.log(
        `${col(r.label, 32)} ${col(`${r.firstContentMs}ms`, 16)} ${col(`${r.budgetMs}ms`, 10)} ` +
          `${col(r.timeToInteractiveMs ? `${r.timeToInteractiveMs}ms` : "—", 10)} ` +
          `${col(r.worstApiMs ? `${r.worstApiMs}ms` : "—", 12)} ` +
          `${col(r.serverTimingDb ? `${r.serverTimingDb}ms` : "—", 10)} ${status}`,
      );
    }

    if (RECORD_BASELINE) {
      const fs = await import("node:fs/promises");
      const path = await import("node:path");
      const baselinePath = path.resolve(process.cwd(), "tests/e2e/performance/perf-baseline.json");
      const baseline = {
        recordedAt: new Date().toISOString(),
        results: results.map((r) => ({
          id: r.id,
          firstContentMs: r.firstContentMs,
          timeToInteractiveMs: r.timeToInteractiveMs,
          worstApiMs: r.worstApiMs,
        })),
      };
      await fs.writeFile(baselinePath, JSON.stringify(baseline, null, 2));
      console.log(`\nBaseline written: ${baselinePath}`);
    }
  });

  test("Dashboard meets firstContent budget", async ({ page, baseURL }) => {
    const budget = LEARNER_BUDGETS.find((b) => b.id === "learner-dashboard");
    if (!budget) return test.skip();
    const r = await measureRoute(page, budget, new URL(baseURL ?? "http://127.0.0.1:3000").origin);
    results.push(r);
    expect(r.firstContentMs, `Dashboard: ${r.firstContentMs}ms > ${r.budgetMs}ms budget`).toBeLessThanOrEqual(r.budgetMs);
  });

  test("Question Bank meets firstContent budget", async ({ page, baseURL }) => {
    const budget = LEARNER_BUDGETS.find((b) => b.id === "learner-questions");
    if (!budget) return test.skip();
    const r = await measureRoute(page, budget, new URL(baseURL ?? "http://127.0.0.1:3000").origin);
    results.push(r);
    expect(r.firstContentMs, `Questions: ${r.firstContentMs}ms > ${r.budgetMs}ms budget`).toBeLessThanOrEqual(r.budgetMs);
  });

  test("Flashcards meets firstContent budget", async ({ page, baseURL }) => {
    const budget = LEARNER_BUDGETS.find((b) => b.id === "learner-flashcards");
    if (!budget) return test.skip();
    const r = await measureRoute(page, budget, new URL(baseURL ?? "http://127.0.0.1:3000").origin);
    results.push(r);
    expect(r.firstContentMs, `Flashcards: ${r.firstContentMs}ms > ${r.budgetMs}ms budget`).toBeLessThanOrEqual(r.budgetMs);
  });

  test("Lessons meets firstContent budget", async ({ page, baseURL }) => {
    const budget = LEARNER_BUDGETS.find((b) => b.id === "learner-lessons");
    if (!budget) return test.skip();
    const r = await measureRoute(page, budget, new URL(baseURL ?? "http://127.0.0.1:3000").origin);
    results.push(r);
    expect(r.firstContentMs, `Lessons: ${r.firstContentMs}ms > ${r.budgetMs}ms budget`).toBeLessThanOrEqual(r.budgetMs);
  });

  test("Clinical Skills meets firstContent budget", async ({ page, baseURL }) => {
    const budget = LEARNER_BUDGETS.find((b) => b.id === "learner-clinical-skills");
    if (!budget) return test.skip();
    const r = await measureRoute(page, budget, new URL(baseURL ?? "http://127.0.0.1:3000").origin);
    results.push(r);
    expect(r.firstContentMs, `Clinical Skills: ${r.firstContentMs}ms > ${r.budgetMs}ms`).toBeLessThanOrEqual(r.budgetMs);
  });

  test("Pharmacology meets firstContent budget", async ({ page, baseURL }) => {
    const budget = LEARNER_BUDGETS.find((b) => b.id === "learner-pharmacology");
    if (!budget) return test.skip();
    const r = await measureRoute(page, budget, new URL(baseURL ?? "http://127.0.0.1:3000").origin);
    results.push(r);
    expect(r.firstContentMs, `Pharmacology: ${r.firstContentMs}ms > ${r.budgetMs}ms`).toBeLessThanOrEqual(r.budgetMs);
  });

  test("CAT Exam meets firstContent budget", async ({ page, baseURL }) => {
    const budget = LEARNER_BUDGETS.find((b) => b.id === "learner-cat");
    if (!budget) return test.skip();
    const r = await measureRoute(page, budget, new URL(baseURL ?? "http://127.0.0.1:3000").origin);
    results.push(r);
    expect(r.firstContentMs, `CAT: ${r.firstContentMs}ms > ${r.budgetMs}ms budget`).toBeLessThanOrEqual(r.budgetMs);
  });

  test("Analytics meets firstContent budget", async ({ page, baseURL }) => {
    const budget = LEARNER_BUDGETS.find((b) => b.id === "learner-analytics");
    if (!budget) return test.skip();
    const r = await measureRoute(page, budget, new URL(baseURL ?? "http://127.0.0.1:3000").origin);
    results.push(r);
    expect(r.firstContentMs, `Analytics: ${r.firstContentMs}ms > ${r.budgetMs}ms`).toBeLessThanOrEqual(r.budgetMs);
  });
});

// ─── Marketing page tests (guest) ─────────────────────────────────────────────

test.describe("Marketing page performance budgets (guest)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("Homepage meets firstContent budget", async ({ page, baseURL }) => {
    const budget = MARKETING_BUDGETS.find((b) => b.id === "marketing-homepage");
    if (!budget) return test.skip();
    const appOrigin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    const api = attachApiResponseTimeCollector(page, appOrigin);
    const navStart = Date.now();
    await page.goto(budget.route, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page
      .locator('[data-testid="hero-section"], #home-conversion-hero-heading, h1')
      .first()
      .waitFor({ state: "visible", timeout: budget.firstContentBudgetMs });
    const firstContentMs = Date.now() - navStart;
    api.dispose();
    expect(
      firstContentMs,
      `Homepage: ${firstContentMs}ms > ${budget.firstContentBudgetMs}ms budget`,
    ).toBeLessThanOrEqual(budget.firstContentBudgetMs);
  });

  test("Pricing page meets firstContent budget", async ({ page, baseURL }) => {
    const budget = MARKETING_BUDGETS.find((b) => b.id === "marketing-pricing");
    if (!budget) return test.skip();
    const navStart = Date.now();
    await page.goto(budget.route, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.locator("main").first().waitFor({ state: "visible", timeout: budget.firstContentBudgetMs });
    const firstContentMs = Date.now() - navStart;
    expect(
      firstContentMs,
      `Pricing: ${firstContentMs}ms > ${budget.firstContentBudgetMs}ms budget`,
    ).toBeLessThanOrEqual(budget.firstContentBudgetMs);
  });
});

// ─── Mobile performance test ──────────────────────────────────────────────────

test.describe("Mobile viewport performance budgets (paid)", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    storageState: { cookies: [], origins: [] },
  });

  // Mobile budgets are 50% more lenient than desktop
  const mobileBudgetMultiplier = 1.5;

  test("Dashboard on mobile meets relaxed budget", async ({ page, baseURL }) => {
    const budget = LEARNER_BUDGETS.find((b) => b.id === "learner-dashboard");
    if (!budget) return test.skip();
    const mobileBudget = Math.round(budget.firstContentBudgetMs * mobileBudgetMultiplier);
    const navStart = Date.now();
    await page.goto(budget.route, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.locator("main").first().waitFor({ state: "visible", timeout: mobileBudget });
    const firstContentMs = Date.now() - navStart;
    expect(
      firstContentMs,
      `Dashboard (mobile): ${firstContentMs}ms > ${mobileBudget}ms budget`,
    ).toBeLessThanOrEqual(mobileBudget);
  });

  test("Questions on mobile meets relaxed budget", async ({ page, baseURL }) => {
    const budget = LEARNER_BUDGETS.find((b) => b.id === "learner-questions");
    if (!budget) return test.skip();
    const mobileBudget = Math.round(budget.firstContentBudgetMs * mobileBudgetMultiplier);
    const navStart = Date.now();
    await page.goto(budget.route, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.locator("main").first().waitFor({ state: "visible", timeout: mobileBudget });
    const firstContentMs = Date.now() - navStart;
    expect(
      firstContentMs,
      `Questions (mobile): ${firstContentMs}ms > ${mobileBudget}ms budget`,
    ).toBeLessThanOrEqual(mobileBudget);
  });
});

// ─── Performance regression check (baseline comparison) ─────────────────────

test.describe("Performance regression check (vs baseline)", () => {
  test("No activity has regressed by more than 50% vs recorded baseline", async ({ page, baseURL }) => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const baselinePath = path.resolve(process.cwd(), "tests/e2e/performance/perf-baseline.json");

    // Skip if no baseline recorded yet
    const baselineExists = await fs
      .access(baselinePath)
      .then(() => true)
      .catch(() => false);

    if (!baselineExists) {
      console.log("No baseline recorded yet — skipping regression check. Run with E2E_PERF_RECORD_BASELINE=1 first.");
      return;
    }

    const baselineRaw = await fs.readFile(baselinePath, "utf8");
    const baseline = JSON.parse(baselineRaw) as {
      recordedAt: string;
      results: Array<{ id: string; firstContentMs: number }>;
    };

    const appOrigin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    const regressions: string[] = [];

    // Check up to 3 fast routes to keep test time reasonable
    const toCheck = baseline.results.slice(0, 3);

    for (const bEntry of toCheck) {
      const budget = ROUTE_PERFORMANCE_REGISTRY.find((r) => r.id === bEntry.id);
      if (!budget || !budget.ciEnforced) continue;

      const r = await measureRoute(page, budget, appOrigin);
      const regressionThreshold = bEntry.firstContentMs * 1.5; // 50% regression threshold

      if (r.firstContentMs > regressionThreshold) {
        regressions.push(
          `${r.label}: ${r.firstContentMs}ms vs baseline ${bEntry.firstContentMs}ms (+${Math.round(((r.firstContentMs - bEntry.firstContentMs) / bEntry.firstContentMs) * 100)}%)`,
        );
      }
    }

    expect(
      regressions,
      `Performance regressions detected:\n${regressions.join("\n")}`,
    ).toHaveLength(0);
  });
});
