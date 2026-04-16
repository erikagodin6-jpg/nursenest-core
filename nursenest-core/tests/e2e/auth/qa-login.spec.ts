/**
 * QA login: `/login` → credentials → learner shell, with diagnostics.
 *
 * **Credentials:** `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD` (or `PLAYWRIGHT_TEST_EMAIL` / `PLAYWRIGHT_TEST_PASSWORD`)
 * — same seeded QA account as other paid E2E (see `helpers/paid-test-credentials.ts`, optional `.env.playwright.local`).
 *
 * **Project:** `chromium` (no saved `storageState`). Uses empty storage so each run performs a real sign-in.
 *
 * Run (from `nursenest-core/`): `npx playwright test tests/e2e/auth/qa-login.spec.ts`
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers, logObserverDiagnostics } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";
import { expectOnLearnerApp } from "../helpers/paid-surface-assertions";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("QA — login", () => {
  test("navigates to /login, submits QA credentials, reaches learner shell", async ({ page }, testInfo) => {
    const creds = getPaidTestCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL and E2E_PAID_PASSWORD (or PLAYWRIGHT_TEST_*) for QA login");

    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });

    try {
      await loginWithCredentials(page, creds!.email, creds!.password);

      const finalUrl = page.url();
      expect(finalUrl, "expected redirect off /login after successful sign-in").not.toMatch(/\/login/i);

      await expectOnLearnerApp(page);

      await expect(page.locator("main")).toBeVisible({ timeout: 45_000 });

      await expect(page.locator("#login-identifier")).toHaveCount(0);
      await expect(page.locator("#login-password")).toHaveCount(0);

      const body = await page.locator("body").innerText().catch(() => "");
      expect(
        body,
        "no auth failure copy on destination surface",
      ).not.toMatch(/Unable to sign in|Invalid email, username, or password|Invalid credentials|incorrect password/i);

      expect(observers.consoleErrors, `unexpected console errors: ${observers.consoleErrors.join(" | ")}`).toEqual([]);
      expect(observers.failedRequests, `unexpected failed requests: ${observers.failedRequests.join(" | ")}`).toEqual([]);
    } finally {
      await logObserverDiagnostics(observers, testInfo.title);
      await testInfo.attach("qa-login-capture.json", {
        body: Buffer.from(
          JSON.stringify(
            {
              finalUrl: page.url(),
              consoleErrors: observers.consoleErrors,
              failedRequests: observers.failedRequests,
              authHttp: observers.authHttp ?? [],
            },
            null,
            2,
          ),
        ),
        contentType: "application/json",
      });
      observers.dispose();
    }
  });
});
