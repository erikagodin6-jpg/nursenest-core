/**
 * Multiple dashboard client endpoints return 500 — shell and Topic performance panel must stay mounted
 * with per-section fallbacks (no full-page crash).
 *
 * ```
 * npx playwright test --project=chromium-paid tests/e2e/paid-user/paid-user-dashboard-multi-fail-soft.spec.ts
 * ```
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { learnerAppMainLandmark } from "../helpers/paid-learner-shell";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";

function seriousConsoleAfterSynthetic500(lines: string[]): string[] {
  return lines.filter(
    (t) =>
      !/Failed to load resource.*(weak-areas|due-summary)|Fetch failed loading:.*(weak-areas|due-summary)/i.test(
        t,
      ) && !/status of 500.*(weak-areas|due-summary)/i.test(t),
  );
}

test.describe("Paid user — dashboard multi fail-soft", () => {
  test("weak-areas + flashcards due-summary 500 — page renders; topic panel fallback", async ({ page, baseURL }) => {
    test.setTimeout(120_000);
    const pageErrors: Error[] = [];
    page.on("pageerror", (err) => {
      pageErrors.push(err);
    });
    const observers = attachPageObservers(page, { profile: "app" });

    let weakAreasHits = 0;
    let dueSummaryHits = 0;

    await page.route("**/api/learner/weak-areas*", async (route) => {
      weakAreasHits += 1;
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "e2e_multi_weak_areas_500" }),
      });
    });
    await page.route("**/api/flashcards/due-summary*", async (route) => {
      dueSummaryHits += 1;
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "e2e_multi_due_summary_500" }),
      });
    });

    try {
      await page.goto("/app", { waitUntil: "domcontentloaded", timeout: 120_000 });
      await page.waitForLoadState("networkidle").catch(() => {});

      await expect(page.getByTestId("learner-shell")).toBeVisible({ timeout: 30_000 });
      await expectNoSubscriptionPaywall(page, "multi fail-soft /app");

      const main = learnerAppMainLandmark(page);
      await expect(main).toBeVisible({ timeout: 30_000 });
      const mainText = (await main.innerText().catch(() => "")).trim();
      expect(mainText.length, "main must not blank").toBeGreaterThan(80);

      await expect(page.getByTestId("dashboard-topic-performance")).toBeVisible({ timeout: 45_000 });
      await expect(page.getByText(/e2e_multi_weak_areas_500|Could not refresh topic performance/i)).toBeVisible({
        timeout: 25_000,
      });

      expect(pageErrors, "no uncaught page errors").toEqual([]);
      expect(seriousConsoleAfterSynthetic500(observers.consoleErrors)).toEqual([]);
      expect(weakAreasHits, "weak-areas should have been requested").toBeGreaterThan(0);
      await expect
        .poll(() => dueSummaryHits, { timeout: 20_000 })
        .toBeGreaterThan(0);
    } finally {
      observers.dispose();
    }
  });
});
