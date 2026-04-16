/**
 * `/app/questions` — paid QA; question UI loads and basic controls work (no infinite loading).
 *
 * **Credentials:** paid QA (`E2E_PAID_*` / `QA_PAID_*` / `PLAYWRIGHT_TEST_*`).
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers, logObserverDiagnostics } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import { paidQuestionsHubUrl } from "../helpers/paid-content-discovery";
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

test.describe("Questions — practice", () => {
  test("/app/questions loads; options interactive; no stuck loading", async ({ page }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set paid QA credentials (E2E_PAID_EMAIL + E2E_PAID_PASSWORD)");

    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });

    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await expectOnPaidSubscriberApp(page);

      await page.goto(paidQuestionsHubUrl(), { waitUntil: "domcontentloaded" });
      await expectNoSubscriptionPaywall(page, "questions-practice-page");
      await expect(page.locator("main")).toBeVisible({ timeout: 60_000 });

      const bodyPreview = await page.locator("body").innerText().catch(() => "");
      expect(bodyPreview.length, "questions page should render body text").toBeGreaterThan(80);

      const firstPick = page.locator(".nn-qopt-list").first().locator("button, label").first();
      if (await firstPick.isVisible().catch(() => false)) {
        await expect(firstPick).toBeEnabled({ timeout: 15_000 });
        await firstPick.click();
        const check = page.getByRole("button", { name: /^Check answer$/i });
        if (await check.isVisible().catch(() => false)) {
          await expect(check).toBeEnabled();
          await check.click();
        }
      }

      await expect(page.locator("main")).toBeVisible({ timeout: 30_000 });

      const significantConsole = observers.consoleErrors.filter((t) => !isIgnorableAuthMarketingConsole(t));
      expect(significantConsole, significantConsole.join(" | ")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join(" | ")).toEqual([]);
    } finally {
      await logObserverDiagnostics(observers, testInfo.title);
      const significantConsoleErrors = observers.consoleErrors.filter((t) => !isIgnorableAuthMarketingConsole(t));
      await testInfo.attach("questions-practice-capture.json", {
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
