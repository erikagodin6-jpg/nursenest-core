/**
 * Guest homepage — `/` only: shell, nav, CTA, no serious console errors or failed same-origin requests.
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
  seriousPublicSmokeConsoleErrors,
} from "../helpers/smoke-evidence";
import { attachSmokeProductionFailure } from "../helpers/smoke-production-diagnostics";
import { HEADER_CHROME } from "../helpers/country-selector";
import { MARKETING_PUBLIC_SELECTOR } from "../helpers/navigation-e2e";

test.describe("Guest", () => {
  test("guest homepage — nav, primary CTA, no console errors or failed requests", async ({ page }, testInfo) => {
    const observers = attachPageObservers(page, { profile: "public", captureConsoleContext: true });
    try {
      const res = await page.goto("/", { waitUntil: "domcontentloaded" });
      expect(res?.ok(), `page load failed: HTTP ${res?.status()} for /`).toBeTruthy();

      await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });

      const header = page.locator(HEADER_CHROME).first();
      await expect(header).toBeVisible({ timeout: 30_000 });
      await expect(header.getByRole("link", { name: /^Pricing$/i }).first()).toBeVisible({ timeout: 20_000 });

      const primaryCta = page.locator("main a.nn-btn-primary").first();
      await expect(primaryCta).toBeVisible({ timeout: 30_000 });
      await expect(primaryCta).toBeEnabled({ timeout: 5_000 });

      await page.waitForLoadState("networkidle", { timeout: 25_000 }).catch(() => {});
      await expect(header).toBeVisible({ timeout: 10_000 });

      const capture = buildCaptureFromObservers(page, observers, {});
      await attachSmokeCapture(testInfo, "guest-homepage", capture);

      const serious = seriousPublicSmokeConsoleErrors(observers.consoleErrors);
      expect(serious, `console errors: ${serious.join(" | ")}`).toEqual([]);
      expect(observers.failedRequests, `failed requests: ${observers.failedRequests.join(" | ")}`).toEqual([]);
    } catch (e) {
      await attachSmokeProductionFailure(testInfo, page, observers, "guest-homepage");
      await attachSmokeCapture(testInfo, "guest-homepage", buildCaptureFromObservers(page, observers, {}));
      await attachSmokeFailureScreenshot(page, testInfo, "guest-homepage-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });
});
