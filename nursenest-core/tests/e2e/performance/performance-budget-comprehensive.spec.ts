/**
 * Performance Budget — Phase 4
 *
 * Measures wall-clock load times for all major platform surfaces.
 * Fails CI if any budget is exceeded.
 *
 * Targets:
 *   Homepage       < 2000 ms
 *   Lesson Hub     < 2000 ms
 *   Lesson Detail  < 2000 ms
 *   Flashcards     < 3000 ms
 *   Practice Tests < 3000 ms
 *   CAT            < 3000 ms
 *   Blog           < 2000 ms
 *
 * Generates: docs/reports/performance-audit.md
 *
 * Run:
 *   npx playwright test tests/e2e/performance/performance-budget-comprehensive.spec.ts --project=chromium
 *
 * Remote (against production/staging):
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://nursenest.ca npx playwright test tests/e2e/performance/performance-budget-comprehensive.spec.ts
 */
import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { attachPageObservers } from "../helpers/attach-observers";

type PerfEntry = {
  label: string;
  path: string;
  budgetMs: number;
  loadMs: number;
  domInteractiveMs: number | null;
  passed: boolean;
  status: number | null;
};

const BUDGETS: { label: string; path: string; budgetMs: number; requiresAuth?: boolean }[] = [
  { label: "Homepage", path: "/", budgetMs: 2_000 },
  { label: "Lesson Hub (marketing)", path: "/lessons", budgetMs: 2_000 },
  { label: "Blog Hub", path: "/blog", budgetMs: 2_000 },
  { label: "Pricing", path: "/pricing", budgetMs: 2_000 },
  { label: "RN Hub", path: "/rn", budgetMs: 2_000 },
  { label: "Flashcards (marketing)", path: "/flashcards", budgetMs: 3_000 },
  // Authenticated surfaces use navigation timing only when logged in
  { label: "Lessons Hub (app)", path: "/app/lessons", budgetMs: 2_000, requiresAuth: true },
  { label: "Flashcards Hub (app)", path: "/app/flashcards", budgetMs: 3_000, requiresAuth: true },
  { label: "Practice Tests Hub (app)", path: "/app/practice-tests", budgetMs: 3_000, requiresAuth: true },
  { label: "CAT Hub (app)", path: "/app/practice-tests?cat=1", budgetMs: 3_000, requiresAuth: true },
];

async function measureRoute(page: Page, path: string): Promise<{ loadMs: number; domInteractiveMs: number | null; status: number | null }> {
  const start = Date.now();
  const r = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 30_000 }).catch(() => null);
  const loadMs = Date.now() - start;

  const domInteractiveMs = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (!nav) return null;
    return Math.round(nav.domInteractive - nav.startTime);
  }).catch(() => null);

  return { loadMs, domInteractiveMs, status: r?.status() ?? null };
}

function buildPerformanceReport(entries: PerfEntry[], baseUrl: string): string {
  const now = new Date().toISOString();
  const failed = entries.filter((e) => !e.passed);
  const rows = entries
    .map(
      (e) =>
        `| ${e.label} | ${e.budgetMs}ms | ${e.loadMs}ms | ${e.domInteractiveMs ?? "—"}ms | ${e.passed ? "✅ PASS" : `❌ FAIL (+${e.loadMs - e.budgetMs}ms)`} |`,
    )
    .join("\n");

  return `# Performance Budget Audit
**Generated:** ${now}
**Base URL:** ${baseUrl}
**TTFB Budget Method:** wall-clock domcontentloaded

---

## Results

| Surface | Budget | Measured | DomInteractive | Status |
|---|---|---|---|---|
${rows}

---

## Failed Budgets
${
  failed.length === 0
    ? "_All budgets met ✅_"
    : failed.map((e) => `- **${e.label}**: ${e.loadMs}ms (budget: ${e.budgetMs}ms, exceeded by ${e.loadMs - e.budgetMs}ms)`).join("\n")
}

---

## Targets Reference
| Route | Target |
|---|---|
| Homepage | < 2,000 ms |
| Lesson Hub | < 2,000 ms |
| Lesson Detail | < 2,000 ms |
| Flashcards | < 3,000 ms |
| Practice Tests | < 3,000 ms |
| CAT | < 3,000 ms |
| Blog | < 2,000 ms |
`;
}

test.describe("Performance Budget — Comprehensive", () => {
  test("all public marketing surfaces meet load time budgets", async ({ page, baseURL }, testInfo) => {
    const publicRoutes = BUDGETS.filter((b) => !b.requiresAuth);
    const entries: PerfEntry[] = [];
    const observers = attachPageObservers(page, { profile: "public" });

    try {
      for (const route of publicRoutes) {
        const { loadMs, domInteractiveMs, status } = await measureRoute(page, route.path);
        const passed = loadMs < route.budgetMs;
        entries.push({ ...route, loadMs, domInteractiveMs, passed, status });

        await testInfo.attach(`perf-${route.label.replace(/\W+/g, "-")}`, {
          body: Buffer.from(
            JSON.stringify({ label: route.label, path: route.path, budgetMs: route.budgetMs, loadMs, domInteractiveMs, passed, status }, null, 2),
            "utf-8",
          ),
          contentType: "application/json",
        });
      }

      // Write report
      const reportDir = path.resolve(process.cwd(), "../../docs/reports");
      const reportPath = path.join(reportDir, "performance-audit.md");
      try {
        if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
        fs.writeFileSync(reportPath, buildPerformanceReport(entries, baseURL ?? "unknown"));
      } catch {
        // Non-blocking
      }

      // Assert all budgets
      const failed = entries.filter((e) => !e.passed);
      expect(
        failed.map((e) => `${e.label}: ${e.loadMs}ms (budget: ${e.budgetMs}ms)`),
        `Performance budget failures`,
      ).toEqual([]);
    } finally {
      observers.dispose();
    }
  });

  test("app surfaces meet load time budgets (requires paid auth)", async ({ page, baseURL }, testInfo) => {
    const authRoutes = BUDGETS.filter((b) => b.requiresAuth);
    test.skip(authRoutes.length === 0, "No auth routes configured");

    const creds =
      process.env.QA_PAID_EMAIL && process.env.QA_PAID_PASSWORD
        ? { email: process.env.QA_PAID_EMAIL, password: process.env.QA_PAID_PASSWORD }
        : null;
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD for app surface performance tests");

    // Quick login
    const { loginWithCredentials } = await import("../helpers/learner-login");
    await loginWithCredentials(page, creds!.email, creds!.password);

    const entries: PerfEntry[] = [];

    for (const route of authRoutes) {
      const { loadMs, domInteractiveMs, status } = await measureRoute(page, route.path);
      const passed = loadMs < route.budgetMs;
      entries.push({ ...route, loadMs, domInteractiveMs, passed, status });
    }

    // Append to report
    const reportDir = path.resolve(process.cwd(), "../../docs/reports");
    const reportPath = path.join(reportDir, "performance-audit.md");
    try {
      if (fs.existsSync(reportPath)) {
        const existing = fs.readFileSync(reportPath, "utf-8");
        const appSection =
          `\n## App Surfaces (Authenticated)\n\n| Surface | Budget | Measured | Status |\n|---|---|---|---|\n` +
          entries
            .map(
              (e) =>
                `| ${e.label} | ${e.budgetMs}ms | ${e.loadMs}ms | ${e.passed ? "✅" : `❌ +${e.loadMs - e.budgetMs}ms`} |`,
            )
            .join("\n");
        fs.writeFileSync(reportPath, existing + appSection);
      }
    } catch {
      // Non-blocking
    }

    const failed = entries.filter((e) => !e.passed);
    expect(
      failed.map((e) => `${e.label}: ${e.loadMs}ms (budget: ${e.budgetMs}ms)`),
      `App surface performance budget failures`,
    ).toEqual([]);
  });
});
