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

test.describe("Smoke — lessons hub", () => {
  test("/app/lessons renders main shell", async ({ page }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*)");

    const observers = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await expectOnPaidSubscriberApp(page);

      await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
      await expectNoSubscriptionPaywall(page, "lessons-smoke");

      const main = page.locator("main");
      await expect(main).toBeVisible({ timeout: 60_000 });
      const text = await main.innerText().catch(() => "");
      expect(text.length, "lessons main not empty").toBeGreaterThan(80);

      await attachSmokeCapture(testInfo, "lessons-smoke", buildCaptureFromObservers(page, observers));
      expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join(" | ")).toEqual([]);
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "lessons-smoke-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });
});
