/**
 * `/app/lessons` hub — paid QA session; lesson list/content region visible.
 *
 * **Credentials:** paid QA (`E2E_PAID_*` / `QA_PAID_*` / `PLAYWRIGHT_TEST_*`).
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers, logObserverDiagnostics } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import {
  expectAtLeastOneLessonLink,
  LESSON_HUB_CARD_LINKS,
  paidLessonsHubUrl,
} from "../helpers/paid-content-discovery";
import { expectNoSubscriptionPaywall, expectOnPaidSubscriberApp } from "../helpers/paid-surface-assertions";
import { attachSmokeFailureScreenshot } from "../helpers/smoke-evidence";
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

test.describe("Lessons page", () => {
  test("/app/lessons loads with visible lesson content for paid users", async ({ page }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set paid QA credentials (E2E_PAID_EMAIL + E2E_PAID_PASSWORD)");

    const observers = attachPageObservers(page, { profile: "app" });

    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await expectOnPaidSubscriberApp(page);

      await page.goto(paidLessonsHubUrl(), { waitUntil: "domcontentloaded" });
      await expectNoSubscriptionPaywall(page, "lessons-page");
      await expect(page.locator("main")).toBeVisible({ timeout: 60_000 });

      await expectAtLeastOneLessonLink(page, { timeoutMs: 120_000 });
      await expect(page.locator(LESSON_HUB_CARD_LINKS).first()).toBeVisible({ timeout: 30_000 });

      const mainText = await page.locator("main").innerText().catch(() => "");
      expect(mainText.length, "lesson hub main should not be empty").toBeGreaterThan(80);

      const significantConsole = observers.consoleErrors.filter((t) => !isIgnorableAuthMarketingConsole(t));
      expect(significantConsole, significantConsole.join(" | ")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join(" | ")).toEqual([]);
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "lessons-page-failure.png");
      throw e;
    } finally {
      await logObserverDiagnostics(observers, testInfo.title);
      await testInfo.attach("lessons-page-capture.json", {
        body: Buffer.from(
          JSON.stringify(
            {
              finalUrl: page.url(),
              consoleErrors: observers.consoleErrors,
              failedRequests: observers.failedRequests,
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
