/**
 * Marketing homepage with session — nav must stay visible after load/hydration; logged-in chrome present.
 * Uses QA paid credentials if set, otherwise QA free (`getQaPaidOrFreeCredentials`).
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
} from "../helpers/smoke-evidence";
import { attachSmokeProductionFailure } from "../helpers/smoke-production-diagnostics";
import { getQaPaidOrFreeCredentials } from "../helpers/smoke-credentials";
import { HEADER_CHROME } from "../helpers/country-selector";
import { MARKETING_PUBLIC_SELECTOR } from "../helpers/navigation-e2e";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Logged-in homepage", () => {
  test("navigation stays visible; dashboard, account, sign out", async ({ page }, testInfo) => {
    const creds = getQaPaidOrFreeCredentials();
    test.skip(!creds, "Set QA_PAID_* or QA_FREE_* (or E2E_PAID_* / E2E_FREE_* / PLAYWRIGHT_TEST_*)");

    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);

      const res = await page.goto("/", { waitUntil: "domcontentloaded" });
      expect(res?.ok(), `HTTP ${res?.status()} for /`).toBeTruthy();

      await expect(page.locator(MARKETING_PUBLIC_SELECTOR).first()).toBeVisible({ timeout: 60_000 });

      const nav = page.locator(HEADER_CHROME).first();
      await expect(nav).toBeVisible({ timeout: 60_000 });

      await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
      await expect(nav).toBeVisible({ timeout: 15_000 });

      await page.waitForFunction(
        () => document.readyState === "complete",
        undefined,
        { timeout: 15_000 },
      ).catch(() => {});
      await expect(nav).toBeVisible({ timeout: 15_000 });

      await expect(page.locator(`${HEADER_CHROME} a[href="/app"]`).first()).toBeVisible({ timeout: 30_000 });

      const accountLink = page.locator(`${HEADER_CHROME} a[href="/app/account/overview"]`).first();
      await expect(accountLink).toBeVisible({ timeout: 25_000 });

      await expect(page.getByRole("button", { name: /^Sign out$/i }).first()).toBeVisible({ timeout: 25_000 });

      const capture = buildCaptureFromObservers(page, observers, {});
      await attachSmokeCapture(testInfo, "logged-in-homepage-nav", capture);
      expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
    } catch (e) {
      await attachSmokeProductionFailure(testInfo, page, observers, "logged-in-homepage-nav");
      await attachSmokeCapture(testInfo, "logged-in-homepage-nav", buildCaptureFromObservers(page, observers, {}));
      await attachSmokeFailureScreenshot(page, testInfo, "logged-in-homepage-nav-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });
});
