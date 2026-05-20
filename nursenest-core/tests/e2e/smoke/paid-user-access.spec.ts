import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
} from "../helpers/smoke-evidence";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";
import { expectNoSubscriptionPaywall, expectOnPaidSubscriberApp } from "../helpers/paid-surface-assertions";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Smoke — paid access", () => {
  test("lessons and questions load without incorrect paywall", async ({ page }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*)");

    const observers = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await expectOnPaidSubscriberApp(page);

      await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
      await expectNoSubscriptionPaywall(page, "/app/lessons");
      await expect(page.locator("main")).toBeVisible({ timeout: 60_000 });

      await page.goto("/app/questions", { waitUntil: "domcontentloaded" });
      await expectNoSubscriptionPaywall(page, "/app/questions");
      await expect(page.locator("main")).toBeVisible({ timeout: 60_000 });

      const body = await page.locator("body").innerText().catch(() => "");
      expect(body.length, "questions surface not blank").toBeGreaterThan(120);

      await attachSmokeCapture(testInfo, "paid-user-access", buildCaptureFromObservers(page, observers));
      expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join(" | ")).toEqual([]);
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "paid-user-access-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });
});
