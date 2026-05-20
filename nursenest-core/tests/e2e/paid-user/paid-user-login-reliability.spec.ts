/**
 * Login reliability — five **independent** credentials sign-ins (fresh browser context each time).
 * Exercises `/login` → `/api/auth/callback/credentials` → learner shell without reusing `storageState`,
 * so intermittent DB/session issues are less likely to be masked by a warm cookie jar.
 *
 * Uses {@link loginWithCredentials} (timeouts + rejection parsing). Fails if any attempt throws, if
 * invalid-credentials copy appears, or if navigation does not reach the learner shell.
 *
 * ```
 * npx playwright test --project=chromium-paid tests/e2e/paid-user/paid-user-login-reliability.spec.ts
 * ```
 */
import { expect, test } from "@playwright/test";
import { loginWithCredentials } from "../helpers/learner-login";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";
import { expectOnLearnerApp } from "../helpers/paid-surface-assertions";

const SEQUENTIAL_LOGINS = 5;

test.describe("Paid user — login reliability (sequential)", () => {
  test(`${SEQUENTIAL_LOGINS} sequential fresh-context logins succeed; no invalid-credentials noise; no helper timeouts`, async ({
    browser,
  }) => {
    const creds = getPaidTestCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD (or QA_PAID_* / PLAYWRIGHT_TEST_*)");

    /** Five full flows (form + credentials POST + learner shell); each step has explicit waits in {@link loginWithCredentials}. */
    test.setTimeout(900_000);

    for (let i = 1; i <= SEQUENTIAL_LOGINS; i += 1) {
      await test.step(`login ${i}/${SEQUENTIAL_LOGINS}`, async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        try {
          await loginWithCredentials(page, creds!.email, creds!.password);

          await expectOnLearnerApp(page);

          const body = await page.locator("body").innerText().catch(() => "");
          expect(
            /Unable to sign in|Invalid email, username, or password|Invalid credentials|incorrect password/i.test(
              body,
            ),
            `login ${i}: must not show invalid-credentials copy after sign-in (wrong password vs flaky DB)`,
          ).toBe(false);
        } finally {
          await context.close();
        }
      });
    }
  });
});
