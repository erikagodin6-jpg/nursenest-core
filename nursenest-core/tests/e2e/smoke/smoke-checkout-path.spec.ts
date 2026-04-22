/**
 * Read-only: pricing page loads and plan/checkout UI is present (no Stripe session created).
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
  seriousPublicSmokeConsoleErrors,
} from "../helpers/smoke-evidence";
import { MARKETING_PUBLIC_SELECTOR } from "../helpers/navigation-e2e";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Smoke — pricing / checkout path", () => {
  test("pricing loads; plan section and checkout affordances visible", async ({ page }, testInfo) => {
    const observers = attachPageObservers(page, { profile: "public", captureConsoleContext: true });
    try {
      const r = await page.goto("/pricing", { waitUntil: "domcontentloaded" });
      expect(r?.ok(), `HTTP ${r?.status()} for /pricing`).toBeTruthy();

      await expect(page.locator(MARKETING_PUBLIC_SELECTOR).first()).toBeVisible({ timeout: 60_000 });
      await expect(page.getByRole("heading", { name: /choose your plan/i })).toBeVisible({ timeout: 90_000 });

      await expect(
        page.getByRole("button", { name: /Continue to checkout|Coming Soon/i }).first(),
      ).toBeVisible({ timeout: 90_000 });

      const serious = seriousPublicSmokeConsoleErrors(observers.consoleErrors);
      await attachSmokeCapture(testInfo, "checkout-path", buildCaptureFromObservers(page, observers, {}));
      expect(serious, serious.join(" | ")).toEqual([]);
      expect(observers.failedRequests, `failed: ${observers.failedRequests.join(" | ")}`).toEqual([]);
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "checkout-path-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });
});
