import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
  seriousPublicSmokeConsoleErrors,
} from "../helpers/smoke-evidence";
import { HEADER_CHROME } from "../helpers/country-selector";
import { MARKETING_PUBLIC_SELECTOR } from "../helpers/navigation-e2e";

test.describe("Smoke — guest homepage", () => {
  test("loads with nav, CTA, clean console and network", async ({ page }, testInfo) => {
    const observers = attachPageObservers(page, { profile: "public", captureConsoleContext: true });
    try {
      const r = await page.goto("/", { waitUntil: "domcontentloaded" });
      expect(r?.ok(), `HTTP ${r?.status()} for /`).toBeTruthy();

      await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });
      await expect(page.locator(HEADER_CHROME).first()).toBeVisible({ timeout: 30_000 });
      const chrome = page.locator(HEADER_CHROME);
      await expect(chrome.getByRole("link", { name: /^Pricing$/i }).first()).toBeVisible({ timeout: 20_000 });

      const primaryCta = page.locator("main a.nn-btn-primary").first();
      await expect(primaryCta).toBeVisible({ timeout: 30_000 });

      const serious = seriousPublicSmokeConsoleErrors(observers.consoleErrors);
      await attachSmokeCapture(testInfo, "guest-homepage", buildCaptureFromObservers(page, observers, {}));
      expect(serious, `console: ${serious.join(" | ")}`).toEqual([]);
      expect(observers.failedRequests, `failed: ${observers.failedRequests.join(" | ")}`).toEqual([]);
    } catch (e) {
      await attachSmokeCapture(testInfo, "guest-homepage", buildCaptureFromObservers(page, observers, {}));
      await attachSmokeFailureScreenshot(page, testInfo, "guest-homepage-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });
});
