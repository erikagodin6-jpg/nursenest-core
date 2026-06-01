/**
 * Navigation Crawl — Phase 3
 *
 * Automatically crawls core routes across all major platform sections.
 * Detects: 404, 500, redirect loops, hydration failures.
 *
 * Generates: docs/reports/navigation-health.md (via reporter / post-run script)
 *
 * Run:
 *   npx playwright test tests/e2e/navigation/navigation-crawl.spec.ts --project=chromium
 *
 * Remote:
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://nursenest.ca npx playwright test tests/e2e/navigation/navigation-crawl.spec.ts
 */
import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { attachPageObservers } from "../helpers/attach-observers";
import { seriousPublicSmokeConsoleErrors } from "../helpers/smoke-evidence";

type RouteAuditResult = {
  path: string;
  label: string;
  status: number | null;
  finalUrl: string | null;
  redirected: boolean;
  consoleErrors: string[];
  failedRequests: string[];
  hydrationError: boolean;
  loadMs: number;
  error: string | null;
};

const CORE_ROUTES = [
  // Homepage
  { path: "/", label: "Homepage" },
  // RN routes
  { path: "/rn", label: "RN Hub" },
  { path: "/rn/nclex-rn", label: "RN NCLEX-RN Hub" },
  { path: "/canada/rn/nclex-rn", label: "Canada RN Hub" },
  // RPN routes
  { path: "/canada/pn/rex-pn", label: "RPN/REx-PN Hub" },
  // NP routes
  { path: "/np", label: "NP Hub" },
  { path: "/canada/np/cnple", label: "Canada NP CNPLE Hub" },
  // Allied routes
  { path: "/allied-health", label: "Allied Health Hub" },
  // Lessons
  { path: "/lessons", label: "Marketing Lessons Hub" },
  // Flashcards
  { path: "/flashcards", label: "Marketing Flashcards" },
  // Blog
  { path: "/blog", label: "Blog Hub" },
  // Pricing
  { path: "/pricing", label: "Pricing" },
  // Auth
  { path: "/login", label: "Login" },
  { path: "/signup", label: "Signup" },
  // Health
  { path: "/api/health/ready", label: "Health Ready API" },
  { path: "/api/subscriptions/notification-health", label: "Notification Health API" },
];

async function auditRoute(page: Page, route: { path: string; label: string }): Promise<RouteAuditResult> {
  const observers = attachPageObservers(page, { profile: "public" });
  const loadStart = Date.now();
  let status: number | null = null;
  let finalUrl: string | null = null;
  let redirected = false;
  let error: string | null = null;

  try {
    const r = await page.goto(route.path, { waitUntil: "domcontentloaded", timeout: 30_000 });
    status = r?.status() ?? null;
    finalUrl = page.url();
    const parsedOriginal = new URL(route.path, page.url());
    const parsedFinal = new URL(finalUrl);
    redirected = parsedFinal.pathname !== parsedOriginal.pathname;
  } catch (e) {
    error = e instanceof Error ? e.message.slice(0, 200) : String(e);
  }

  const loadMs = Date.now() - loadStart;
  const consoleErrors = seriousPublicSmokeConsoleErrors(observers.consoleErrors);
  const hydrationError = observers.consoleErrors.some((e) =>
    /hydrat|Text content did not match|Minified React error #42[345]/i.test(e),
  );

  observers.dispose();

  return {
    path: route.path,
    label: route.label,
    status,
    finalUrl,
    redirected,
    consoleErrors,
    failedRequests: observers.failedRequests,
    hydrationError,
    loadMs,
    error,
  };
}

function buildNavigationHealthReport(results: RouteAuditResult[], baseUrl: string): string {
  const now = new Date().toISOString();
  const failed = results.filter(
    (r) => r.error || (r.status != null && r.status >= 500) || r.hydrationError,
  );
  const warnings = results.filter(
    (r) => !failed.includes(r) && (r.status === 404 || r.consoleErrors.length > 0 || r.failedRequests.length > 0),
  );
  const passing = results.filter((r) => !failed.includes(r) && !warnings.includes(r));

  const statusLine = (r: RouteAuditResult) =>
    `${r.status ?? "ERR"} | ${r.loadMs}ms | ${r.redirected ? `→ ${r.finalUrl}` : "direct"}`;

  const rows = results
    .map(
      (r) =>
        `| ${r.label} | \`${r.path}\` | ${r.status ?? "error"} | ${r.loadMs}ms | ${r.hydrationError ? "⚠️ hydration" : r.consoleErrors.length > 0 ? "⚠️ console" : "✅"} |`,
    )
    .join("\n");

  return `# Navigation Health Audit
**Generated:** ${now}
**Base URL:** ${baseUrl}
**Routes Audited:** ${results.length}
**Passing:** ${passing.length} | **Warnings:** ${warnings.length} | **Failed:** ${failed.length}

---

## Summary

| Route | Path | HTTP | Load | Status |
|---|---|---|---|---|
${rows}

---

## Failed Routes
${
  failed.length === 0
    ? "_None_"
    : failed
        .map(
          (r) =>
            `- **${r.label}** \`${r.path}\`: ${r.error ?? statusLine(r)}${r.hydrationError ? " _(hydration error)_" : ""}`,
        )
        .join("\n")
}

## Warnings
${
  warnings.length === 0
    ? "_None_"
    : warnings
        .map(
          (r) =>
            `- **${r.label}** \`${r.path}\`: ${statusLine(r)}${r.consoleErrors.length > 0 ? ` console: ${r.consoleErrors[0]?.slice(0, 120)}` : ""}`,
        )
        .join("\n")
}
`;
}

test.describe("Navigation Crawl", () => {
  test("crawl all core routes and detect 404/500/hydration failures", async ({ page, baseURL }, testInfo) => {
    const results: RouteAuditResult[] = [];

    for (const route of CORE_ROUTES) {
      const result = await auditRoute(page, route);
      results.push(result);

      await testInfo.attach(`crawl-${route.label.replace(/\W+/g, "-")}`, {
        body: Buffer.from(JSON.stringify(result, null, 2), "utf-8"),
        contentType: "application/json",
      });
    }

    // Write navigation health report
    const reportDir = path.resolve(process.cwd(), "../../docs/reports");
    const reportPath = path.join(reportDir, "navigation-health.md");
    try {
      if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
      fs.writeFileSync(reportPath, buildNavigationHealthReport(results, baseURL ?? "unknown"));
    } catch {
      // Non-blocking — test verdict is not affected by report write failures
    }

    // Fail on 5xx or hydration errors — 404s are warnings only
    const hard = results.filter(
      (r) => r.error || (r.status != null && r.status >= 500) || r.hydrationError,
    );

    if (hard.length > 0) {
      const summary = hard
        .map(
          (r) =>
            `  [${r.status ?? "ERR"}] ${r.label} (${r.path})${r.error ? `: ${r.error}` : ""}${r.hydrationError ? " [HYDRATION ERROR]" : ""}`,
        )
        .join("\n");
      throw new Error(`Navigation crawl: ${hard.length} hard failure(s):\n${summary}`);
    }
  });
});
