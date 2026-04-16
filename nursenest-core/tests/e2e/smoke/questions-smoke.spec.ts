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

test.describe("Smoke — question bank", () => {
  test("/app/questions loads and allows basic interaction", async ({ page }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*)");

    const observers = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await expectOnPaidSubscriberApp(page);

      await page.goto("/app/questions", { waitUntil: "domcontentloaded" });
      await expectNoSubscriptionPaywall(page, "questions-smoke");

      await expect(page.locator("main")).toBeVisible({ timeout: 60_000 });

      await page.waitForLoadState("domcontentloaded");
      const firstPick = page.locator(".nn-qopt-list").first().locator("button, label").first();
      if (await firstPick.isVisible().catch(() => false)) {
        await firstPick.click();
        const check = page.getByRole("button", { name: /^Check answer$/i });
        if (await check.isVisible().catch(() => false)) {
          await check.click();
        }
      }

      await page.waitForLoadState("networkidle", { timeout: 45_000 }).catch(() => {});

      await attachSmokeCapture(testInfo, "questions-smoke", buildCaptureFromObservers(page, observers));
      expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join(" | ")).toEqual([]);
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "questions-smoke-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });
});
