import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
} from "../helpers/smoke-evidence";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Smoke — logout", () => {
  test("sign out clears session; protected routes require login", async ({ page }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*)");

    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);

      await page.getByRole("button", { name: /^Sign out$/i }).first().click({ timeout: 30_000 });

      await page.waitForFunction(
        () => {
          const p = window.location.pathname;
          return p === "/" || /\/login/i.test(p);
        },
        null,
        { timeout: 45_000 },
      );
      const path = new URL(page.url()).pathname;
      expect(path === "/" || path.includes("/login"), `expected / or /login after sign out; got ${page.url()}`).toBe(
        true,
      );

      await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
      await expect(page).toHaveURL(/\/login/i, { timeout: 45_000 });

      await attachSmokeCapture(testInfo, "auth-logout", buildCaptureFromObservers(page, observers));
      expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "auth-logout-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });
});
