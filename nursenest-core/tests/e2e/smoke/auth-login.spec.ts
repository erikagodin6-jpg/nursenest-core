import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
} from "../helpers/smoke-evidence";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";
import { expectOnLearnerApp } from "../helpers/paid-surface-assertions";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Smoke — auth login", () => {
  test("login redirects to learner shell; no error surface", async ({ page }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*)");

    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });
    try {
      await page.goto("/login", { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { name: /log in|sign in/i })).toBeVisible({ timeout: 30_000 });

      await loginWithCredentials(page, creds!.email, creds!.password);

      await expectOnLearnerApp(page);
      await expect(page.locator("main")).toBeVisible({ timeout: 45_000 });

      const body = await page.locator("body").innerText().catch(() => "");
      expect(body).not.toMatch(
        /Unable to sign in|Invalid email, username, or password|Invalid credentials|incorrect password/i,
      );

      const spinnerOnly = await page.locator('[aria-busy="true"]').count().catch(() => 0);
      expect(spinnerOnly === 0 || body.length > 80, "unexpected empty / infinite loading").toBeTruthy();

      await attachSmokeCapture(testInfo, "auth-login", buildCaptureFromObservers(page, observers));
      expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join(" | ")).toEqual([]);
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "auth-login-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });
});
