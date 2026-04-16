/**
 * Guest homepage — public `/`: marketing shell, sticky header/nav, primary CTA; no console or failed-request noise.
 * Evidence pattern matches `logged-in-homepage-nav.spec.ts` (attachPageObservers → capture JSON / failure diagnostics / screenshot).
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
} from "../helpers/smoke-evidence";
import { attachSmokeProductionFailure } from "../helpers/smoke-production-diagnostics";
import { HEADER_CHROME } from "../helpers/country-selector";
import { MARKETING_PUBLIC_SELECTOR } from "../helpers/navigation-e2e";

test.describe("Guest", () => {
  test("guest homepage — marketing shell, nav, primary CTA", async ({ page }, testInfo) => {
    const observers = attachPageObservers(page, { profile: "public", captureConsoleContext: true });
    try {
      const res = await page.goto("/", { waitUntil: "domcontentloaded" });
      expect(res?.ok(), `HTTP ${res?.status()} for /`).toBeTruthy();

      await expect(page.locator(MARKETING_PUBLIC_SELECTOR).first()).toBeVisible({ timeout: 60_000 });

      const header = page.locator(HEADER_CHROME).first();
      await expect(header).toBeVisible({ timeout: 30_000 });
      await expect(header.getByRole("link", { name: /^Pricing$/i }).first()).toBeVisible({ timeout: 20_000 });

      const primaryCta = page.locator("main a.nn-btn-primary").first();
      await expect(primaryCta).toBeVisible({ timeout: 30_000 });
      await expect(primaryCta).toBeEnabled({ timeout: 5_000 });

      await page.waitForLoadState("networkidle", { timeout: 25_000 }).catch(() => {});
      await expect(header).toBeVisible({ timeout: 10_000 });

      await page.waitForFunction(() => document.readyState === "complete", undefined, { timeout: 15_000 }).catch(() => {});
      await expect(header).toBeVisible({ timeout: 10_000 });

      const capture = buildCaptureFromObservers(page, observers, {});
      await attachSmokeCapture(testInfo, "guest-homepage", capture);

      expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join(" | ")).toEqual([]);
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
