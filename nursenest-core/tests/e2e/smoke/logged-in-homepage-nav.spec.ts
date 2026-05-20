import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
} from "../helpers/smoke-evidence";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";
import { HEADER_CHROME } from "../helpers/country-selector";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Smoke — logged-in marketing home", () => {
  test("nav stays visible after load; logged-in chrome + sign out", async ({ page }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*)");

    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);

      await page.goto("/", { waitUntil: "domcontentloaded" });
      const nav = page.locator(HEADER_CHROME).first();
      await expect(nav).toBeVisible({ timeout: 60_000 });

      await page.waitForTimeout(1200);
      await expect(nav).toBeVisible({ timeout: 15_000 });

      await expect(page.locator('a[href="/app"]').first()).toBeVisible({ timeout: 30_000 });

      await expect(page.getByRole("button", { name: /^Sign out$/i }).first()).toBeVisible({ timeout: 25_000 });

      await attachSmokeCapture(testInfo, "logged-in-homepage", buildCaptureFromObservers(page, observers));
      expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "logged-in-homepage-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });
});
