/**
 * Revenue Pipeline — Subscription Persistence
 *
 * Phase 2: Revenue Pipeline — Persistence
 * Verifies that premium access persists through a logout → login cycle.
 *
 * Requires: QA_PAID_EMAIL + QA_PAID_PASSWORD (pre-seeded paid account)
 *
 * Run:
 *   npx playwright test tests/e2e/revenue/subscription-persistence.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
} from "../helpers/smoke-evidence";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";
import { loginWithCredentials } from "../helpers/learner-login";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Revenue — Subscription Persistence", () => {
  test("premium access survives logout → login cycle", async ({ page }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD");

    const observers = attachPageObservers(page, { profile: "app" });
    try {
      // Step 1: Login
      await loginWithCredentials(page, creds!.email, creds!.password);
      await expectNoSubscriptionPaywall(page, "persistence-pre-logout");

      // Step 2: Verify premium surface accessible
      await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
      await expectNoSubscriptionPaywall(page, "persistence-lessons-pre-logout");

      // Step 3: Logout
      await page.goto("/app", { waitUntil: "domcontentloaded" });
      const accountMenu = page.locator("[data-nn-account-menu], [data-nn-user-menu]").first();
      if (await accountMenu.count() > 0) {
        await accountMenu.click();
        const logoutBtn = page.getByRole("button", { name: /sign out|log out|logout/i });
        if (await logoutBtn.count() > 0) {
          await logoutBtn.click();
          await page.waitForURL(/\/(login|signup|$)/, { timeout: 30_000 }).catch(() => {});
        }
      } else {
        // Direct logout API
        await page.goto("/api/auth/signout", { waitUntil: "domcontentloaded" });
        const signOutBtn = page.getByRole("button", { name: /sign out/i });
        if (await signOutBtn.count() > 0) await signOutBtn.click();
      }

      // Step 4: Login again
      await loginWithCredentials(page, creds!.email, creds!.password);

      // Step 5: Premium access still present
      await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
      await expectNoSubscriptionPaywall(page, "persistence-post-login");

      // CAT still unlocked
      await page.goto("/app/practice-tests?cat=1", { waitUntil: "domcontentloaded" });
      await expectNoSubscriptionPaywall(page, "persistence-cat-post-login");

      await attachSmokeCapture(
        testInfo,
        "subscription-persistence",
        buildCaptureFromObservers(page, observers),
      );
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "subscription-persistence-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });

  test("session persists after page refresh", async ({ page }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD");

    const observers = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);

      // Refresh the page
      await page.reload({ waitUntil: "domcontentloaded" });

      // Still on learner app (not redirected to login)
      const currentUrl = page.url();
      expect(currentUrl, "After refresh, user should remain on app").toMatch(/\/app\//);

      await attachSmokeCapture(testInfo, "session-refresh", buildCaptureFromObservers(page, observers));
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "session-refresh-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });
});
