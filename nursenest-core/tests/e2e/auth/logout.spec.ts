/**
 * Logout: learner shell → Sign out → public `/` or localized `/login`; session cleared; `/app/*` redirects to login.
 *
 * **Credentials:** `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD` (or `PLAYWRIGHT_TEST_*`) — see `helpers/paid-test-credentials.ts`.
 *
 * **UI:** On narrow viewports, **Sign out** is a button in the bottom nav. On `md+`, open the account menu
 * (`button[aria-haspopup="menu"]`) first, then use the **Sign out** `menuitem`.
 *
 * Run (from `nursenest-core/`): `npx playwright test tests/e2e/auth/logout.spec.ts`
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers, logObserverDiagnostics } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";
import { expectOnLearnerApp } from "../helpers/paid-surface-assertions";

test.use({ storageState: { cookies: [], origins: [] } });

function isIgnorableAuthMarketingConsole(text: string): boolean {
  return (
    /favicon|ResizeObserver|Failed to load resource.*404.*\.ico/i.test(text) ||
    /hydration mismatch|hydrated but some attributes of the server rendered HTML/i.test(text) ||
    /\[marketing-i18n\]/i.test(text) ||
    /\[MarketingI18nProvider\]/i.test(text) ||
    /next-image-unconfigured-qualities|images\.qualities/i.test(text) ||
    /\[nursenest-core\].*marketing_message_key_missing/i.test(text) ||
    /webpack-hmr|WebSocket connection.*_next\/webpack-hmr/i.test(text)
  );
}

async function clickLearnerSignOut(page: Page): Promise<void> {
  const signOutButton = page.getByRole("button", { name: /^Sign out$/i });
  if (await signOutButton.first().isVisible().catch(() => false)) {
    await signOutButton.first().click();
    return;
  }
  await page.locator('button[aria-haspopup="menu"]').first().click({ timeout: 15_000 });
  await page.getByRole("menuitem", { name: /^Sign out$/i }).click({ timeout: 15_000 });
}

test.describe("Logout", () => {
  test("sign out redirects to a public page, clears session, and protects /app routes", async ({ page }, testInfo) => {
    const creds = getPaidTestCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL and E2E_PAID_PASSWORD (or PLAYWRIGHT_TEST_*) for logout E2E");

    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });

    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await expectOnLearnerApp(page);

      await clickLearnerSignOut(page);

      await page.waitForFunction(
        () => {
          const p = window.location.pathname;
          return p === "/" || /\/login/i.test(p);
        },
        null,
        { timeout: 60_000 },
      );

      const afterLogoutUrl = page.url();
      const path = new URL(afterLogoutUrl).pathname;
      expect(
        path === "/" || /\/login/i.test(path),
        `expected marketing home or login after sign out; got ${afterLogoutUrl}`,
      ).toBe(true);

      const origin = new URL(page.url()).origin;
      const sessionRes = await page.request.get(`${origin}/api/auth/session`);
      expect(sessionRes.ok()).toBeTruthy();
      const sessionJson = (await sessionRes.json()) as { user?: unknown };
      expect(Boolean(sessionJson.user), "session cookie cleared (no user in /api/auth/session)").toBe(false);

      await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
      await expect(page).toHaveURL(/\/login/i, { timeout: 45_000 });

      const significantConsole = observers.consoleErrors.filter((t) => !isIgnorableAuthMarketingConsole(t));
      expect(
        significantConsole,
        `unexpected console errors (full list attached as logout-capture.json): ${significantConsole.join(" | ")}`,
      ).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join(" | ")).toEqual([]);
    } finally {
      await logObserverDiagnostics(observers, testInfo.title);
      const significantConsoleErrors = observers.consoleErrors.filter((t) => !isIgnorableAuthMarketingConsole(t));
      await testInfo.attach("logout-capture.json", {
        body: Buffer.from(
          JSON.stringify(
            {
              finalUrl: page.url(),
              consoleErrors: observers.consoleErrors,
              significantConsoleErrors,
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
