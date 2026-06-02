/**
 * Smoke — Homepage Comprehensive
 *
 * Phase 1: Core Smoke Suite
 * Verifies: load, no 500/404/hydration errors, nav, pricing, footer.
 * Fails if: page load > 3000 ms OR console contains uncaught errors.
 *
 * Run:
 *   npx playwright test tests/e2e/smoke/homepage-comprehensive.spec.ts --project=chromium
 *
 * Remote:
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://nursenest.ca npx playwright test tests/e2e/smoke/homepage-comprehensive.spec.ts
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
  seriousPublicSmokeConsoleErrors,
} from "../helpers/smoke-evidence";

const PAGE_LOAD_BUDGET_MS = 3_000;

test.describe("Homepage — comprehensive smoke", () => {
  test("loads without 500/404 errors, nav renders, pricing visible, footer renders", async ({
    page,
  }, testInfo) => {
    const observers = attachPageObservers(page, { profile: "public", captureConsoleContext: true });
    const loadStart = Date.now();

    // Track 5xx responses
    const serverErrors: { url: string; status: number }[] = [];
    page.on("response", (res) => {
      if (res.status() >= 500) serverErrors.push({ url: res.url(), status: res.status() });
    });

    try {
      const r = await page.goto("/", { waitUntil: "domcontentloaded" });
      const loadMs = Date.now() - loadStart;

      // No 404/500 on the document itself
      expect(r?.status(), `Homepage HTTP status`).not.toBe(404);
      expect(r?.status(), `Homepage HTTP status`).not.toBe(500);
      expect(r?.ok(), `HTTP ${r?.status()} for /`).toBeTruthy();

      // No server errors from any resource
      expect(serverErrors.map((e) => `${e.status} ${e.url}`), "5xx responses").toEqual([]);

      // Page load within budget
      expect(loadMs, `Homepage loaded in ${loadMs}ms — must be < ${PAGE_LOAD_BUDGET_MS}ms`).toBeLessThan(
        PAGE_LOAD_BUDGET_MS,
      );

      // Navigation renders
      await expect(page.locator("header, nav").first()).toBeVisible({ timeout: 10_000 });

      // Pricing link exists in nav or main content
      const pricingLink = page
        .getByRole("link", { name: /^Pricing$/i })
        .first();
      await expect(pricingLink).toBeVisible({ timeout: 15_000 });

      // Footer renders
      const footer = page.locator("footer");
      await expect(footer).toBeVisible({ timeout: 15_000 });

      // No hydration errors in console
      const serious = seriousPublicSmokeConsoleErrors(observers.consoleErrors);
      const hydrationErrors = observers.consoleErrors.filter(
        (e) => /hydrat|Minified React error|Text content did not match/i.test(e),
      );
      expect(hydrationErrors, `Hydration errors: ${hydrationErrors.join(" | ")}`).toEqual([]);
      expect(serious, `Uncaught console errors: ${serious.join(" | ")}`).toEqual([]);
      expect(observers.failedRequests, `Failed requests: ${observers.failedRequests.join(" | ")}`).toEqual([]);

      await attachSmokeCapture(
        testInfo,
        "homepage-comprehensive",
        buildCaptureFromObservers(page, observers, {}),
      );
    } catch (e) {
      await attachSmokeCapture(
        testInfo,
        "homepage-comprehensive",
        buildCaptureFromObservers(page, observers, {}),
      );
      await attachSmokeFailureScreenshot(page, testInfo, "homepage-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });

  test("title is present and not empty", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const title = await page.title();
    expect(title.trim().length, "Page title must not be empty").toBeGreaterThan(0);
    expect(title, "Title must not be generic Next.js default").not.toMatch(/^Create Next App$/);
  });
});
