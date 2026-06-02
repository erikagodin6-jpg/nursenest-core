/**
 * Read-only: forgot-password page loads (no email send).
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
  seriousPublicSmokeConsoleErrors,
} from "../helpers/smoke-evidence";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Smoke — forgot password", () => {
  test("page loads with form", async ({ page }, testInfo) => {
    const observers = attachPageObservers(page, { profile: "public", captureConsoleContext: true });
    try {
      const r = await page.goto("/forgot-password", { waitUntil: "domcontentloaded" });
      expect(r?.ok(), `HTTP ${r?.status()} for /forgot-password`).toBeTruthy();

      await expect(page.locator("main, [role='main']").first()).toBeVisible({ timeout: 30_000 });
      await expect(page.getByRole("heading", { name: /forgot|reset|password/i })).toBeVisible({ timeout: 20_000 });
      await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible({ timeout: 15_000 });

      const serious = seriousPublicSmokeConsoleErrors(observers.consoleErrors);
      await attachSmokeCapture(testInfo, "forgot-password", buildCaptureFromObservers(page, observers, {}));
      expect(serious, serious.join(" | ")).toEqual([]);
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "forgot-password-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });
});
