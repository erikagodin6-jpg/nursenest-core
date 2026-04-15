/**
 * Performance audit: key learner routes must render quickly and drop loading shells on time.
 *
 * Measures (per page):
 * - Time to first meaningful content (wall-clock from navigation start until a stable "ready" locator appears)
 * - Time to interactive (proxy): Navigation Timing `domInteractive - startTime`
 * - Same-origin `/api/*` fetch/XHR durations (wall-clock request→response)
 *
 * Fails when:
 * - Ready content not visible within budget (default 3000ms, `E2E_PERF_CONTENT_BUDGET_MS`)
 * - Loading shell (`main [aria-busy="true"]`, `.nn-qbank-skeleton`) still present after budget (default 5000ms, `E2E_PERF_LOADING_BUDGET_MS`)
 *
 * Requires `--project=chromium-paid`.
 */
import { expect, test, type Page } from "@playwright/test";
import {
  attachApiResponseTimeCollector,
  measureKeyLearnerPage,
  perfContentBudgetMs,
  perfLoadingBudgetMs,
  type KeyPagePerfMetrics,
} from "../helpers/learner-key-pages-performance";

function readyLocators(page: Page) {
  return {
    dashboard: page.locator('nav[aria-label="Learner primary actions"]'),
    lessons: page.locator('a[href^="/app/lessons/"]').first(),
    practice: page.getByRole("heading", { name: /^Question bank$/i }),
    flashcards: page.locator('a[href*="/app/flashcards/"]').first(),
  };
}

test.describe("Performance audit — key learner pages", () => {
  test("dashboard, lessons, practice, flashcards meet content, loading, and timing budgets", async ({
    page,
    baseURL,
  }, testInfo) => {
    const origin = baseURL ?? "http://127.0.0.1:3000";
    const appOrigin = new URL(origin).origin;
    const contentBudgetMs = perfContentBudgetMs();
    const loadingBudgetMs = perfLoadingBudgetMs();

    const api = attachApiResponseTimeCollector(page, appOrigin);
    const ready = readyLocators(page);
    const results: KeyPagePerfMetrics[] = [];

    try {
      const pages: { pageLabel: string; path: string; ready: ReturnType<typeof readyLocators>["dashboard"] }[] = [
        { pageLabel: "Dashboard", path: "/app", ready: ready.dashboard },
        { pageLabel: "Lessons", path: "/app/lessons", ready: ready.lessons },
        { pageLabel: "Practice", path: "/app/questions", ready: ready.practice },
        { pageLabel: "Flashcards", path: "/app/flashcards", ready: ready.flashcards },
      ];

      for (const p of pages) {
        const m = await measureKeyLearnerPage(page, {
          pageLabel: p.pageLabel,
          path: p.path,
          ready: p.ready,
          apiCollector: api,
          contentBudgetMs,
          loadingBudgetMs,
        });
        expect(m.firstContentMs, `${p.pageLabel}: first content within ${contentBudgetMs}ms`).toBeLessThanOrEqual(
          contentBudgetMs,
        );
        results.push(m);
      }

      const byFirstContent = [...results].sort((a, b) => b.firstContentMs - a.firstContentMs);
      const summary = {
        budgets: { contentBudgetMs, loadingBudgetMs },
        worstFirstContent: byFirstContent[0]?.pageLabel ?? null,
        pages: byFirstContent.map((r) => ({
          pageLabel: r.pageLabel,
          path: r.path,
          firstContentMs: r.firstContentMs,
          timeToInteractiveApproxMs: r.timeToInteractiveApproxMs,
          worstApiMs: r.worstApiMs,
          apiSampleCount: r.apiSamples.length,
        })),
        slowestApisOverall: [...results]
          .flatMap((r) => r.apiSamples.map((s) => ({ ...s, page: r.pageLabel })))
          .sort((a, b) => b.durationMs - a.durationMs)
          .slice(0, 15),
      };

      // eslint-disable-next-line no-console
      console.log(
        `[perf-audit] Worst first-content page: ${summary.worstFirstContent} (${byFirstContent[0]?.firstContentMs ?? "?"}ms). Budgets: content=${contentBudgetMs}ms loading=${loadingBudgetMs}ms`,
      );

      await testInfo.attach("key-pages-performance.json", {
        body: Buffer.from(JSON.stringify(summary, null, 2)),
        contentType: "application/json",
      });

      await testInfo.attach("worst-first-content-pages.txt", {
        body: byFirstContent.map((r) => `${r.firstContentMs}ms\t${r.pageLabel}\t${r.path}`).join("\n"),
        contentType: "text/plain",
      });
    } finally {
      api.dispose();
    }
  });
});
