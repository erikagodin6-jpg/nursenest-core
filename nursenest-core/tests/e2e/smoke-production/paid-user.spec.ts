/**
 * Paid subscriber QA — `QA_PAID_EMAIL` / `QA_PAID_PASSWORD` (or `E2E_PAID_*` / `PLAYWRIGHT_TEST_*`).
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
import { getQaPaidCredentials } from "../helpers/smoke-credentials";
import { expectNoSubscriptionPaywall, expectOnPaidSubscriberApp } from "../helpers/paid-surface-assertions";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Paid user", () => {
  test("login, lessons and questions without incorrect paywall", async ({ page }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*)");

    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await expectOnPaidSubscriberApp(page);

      await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
      await expectNoSubscriptionPaywall(page, "/app/lessons");
      await expect(page.locator("main")).toBeVisible({ timeout: 60_000 });
      const lessonsBody = await page.locator("main").innerText().catch(() => "");
      expect(lessonsBody.length, "lessons main not blank").toBeGreaterThan(80);

      await page.goto("/app/questions", { waitUntil: "domcontentloaded" });
      await expectNoSubscriptionPaywall(page, "/app/questions");
      await expect(page.locator("main")).toBeVisible({ timeout: 60_000 });
      const body = await page.locator("body").innerText().catch(() => "");
      expect(body.length, "questions surface not blank").toBeGreaterThan(120);

      await attachSmokeCapture(testInfo, "paid-user", buildCaptureFromObservers(page, observers));
      expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join(" | ")).toEqual([]);
    } catch (e) {
      await attachSmokeProductionFailure(testInfo, page, observers, "paid-user");
      await attachSmokeFailureScreenshot(page, testInfo, "paid-user-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });
});
