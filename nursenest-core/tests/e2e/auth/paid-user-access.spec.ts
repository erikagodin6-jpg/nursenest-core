/**
 * Paid subscriber: login → `/app/lessons` + `/app/questions` with full hub content (no freemium gate).
 *
 * **Credentials:** `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD` or `PLAYWRIGHT_TEST_*` / `QA_PAID_*` (see `helpers/smoke-credentials.ts`).
 *
 * Run: `npx playwright test tests/e2e/auth/paid-user-access.spec.ts --project=chromium`
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers, logObserverDiagnostics } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import {
  expectAtLeastOneLessonLink,
  LESSON_HUB_CARD_LINKS,
  paidLessonsHubUrl,
  paidQuestionsHubUrl,
} from "../helpers/paid-content-discovery";
import { expectNoSubscriptionPaywall, expectOnPaidSubscriberApp } from "../helpers/paid-surface-assertions";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";

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

test.describe("Paid user — access", () => {
  test("lessons and questions hubs load full content; no subscription gate; stable shell", async ({
    page,
  }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD (or QA_PAID_* / PLAYWRIGHT_TEST_*)");

    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });

    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await expectOnPaidSubscriberApp(page);

      await page.goto(paidLessonsHubUrl(), { waitUntil: "domcontentloaded" });
      await expectOnPaidSubscriberApp(page);
      await expectNoSubscriptionPaywall(page, "paid-user-access /app/lessons");
      await expect(page.locator("main")).toBeVisible({ timeout: 60_000 });
      await expectAtLeastOneLessonLink(page, { timeoutMs: 120_000 });
      await expect(page.locator(LESSON_HUB_CARD_LINKS).first()).toBeVisible({ timeout: 30_000 });

      const lessonsMain = await page.locator("main").innerText().catch(() => "");
      expect(lessonsMain.length, "lessons hub main has content").toBeGreaterThan(80);

      await page.goto(paidQuestionsHubUrl(), { waitUntil: "domcontentloaded" });
      await expectOnPaidSubscriberApp(page);
      await expectNoSubscriptionPaywall(page, "paid-user-access /app/questions");
      await expect(page.locator("main")).toBeVisible({ timeout: 60_000 });

      const qBody = await page.locator("body").innerText().catch(() => "");
      expect(qBody.length, "questions surface not blank").toBeGreaterThan(120);

      const firstPick = page.locator(".nn-qopt-list").first().locator("button, label").first();
      if (await firstPick.isVisible().catch(() => false)) {
        await expect(firstPick).toBeEnabled();
        await firstPick.click();
        const check = page.getByRole("button", { name: /^Check answer$/i });
        if (await check.isVisible().catch(() => false)) {
          await expect(check).toBeEnabled();
        }
      }

      await expect(page.locator("main")).toBeVisible({ timeout: 15_000 });

      const significantConsole = observers.consoleErrors.filter((t) => !isIgnorableAuthMarketingConsole(t));
      expect(significantConsole, significantConsole.join(" | ")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join(" | ")).toEqual([]);
    } finally {
      await logObserverDiagnostics(observers, testInfo.title);
      const significantConsoleErrors = observers.consoleErrors.filter((t) => !isIgnorableAuthMarketingConsole(t));
      await testInfo.attach("paid-user-access-capture.json", {
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
