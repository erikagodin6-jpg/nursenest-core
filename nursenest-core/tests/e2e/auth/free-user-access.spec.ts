/**
 * Free-tier QA: log in with the seeded free account, open `/app/lessons` and `/app/questions`, and assert
 * previews/peeks load while subscription-gated surfaces stay gated.
 *
 * **Credentials:** `E2E_FREE_EMAIL` + `E2E_FREE_PASSWORD` (or `QA_FREE_EMAIL` / `QA_FREE_PASSWORD` — see
 * `helpers/smoke-credentials.ts`). Optional: `.env.playwright.local` in `nursenest-core/`.
 *
 * **Project:** `chromium` with empty `storageState` so each run performs a real free-tier login.
 *
 * Run (from `nursenest-core/`): `npx playwright test tests/e2e/auth/free-user-access.spec.ts`
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers, logObserverDiagnostics } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import { expectOnLearnerApp } from "../helpers/paid-surface-assertions";
import { getQaFreeCredentials } from "../helpers/smoke-credentials";

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

test.describe("Free user — access", () => {
  test("lessons and questions: allowed preview loads; paywall blocks premium; no full unlock", async ({
    page,
  }, testInfo) => {
    const creds = getQaFreeCredentials();
    test.skip(!creds, "Set E2E_FREE_EMAIL + E2E_FREE_PASSWORD (or QA_FREE_*) for free-tier E2E");

    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });

    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await expectOnLearnerApp(page);

      await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
      await expect(page.locator("main, [role='main']").first()).toBeVisible({ timeout: 45_000 });

      await expect(page.getByRole("heading", { name: "Subscription required" })).toBeVisible({ timeout: 45_000 });
      await expect(page.getByText(/NurseNest subscription/i).first()).toBeVisible({ timeout: 30_000 });
      await expect(page.getByRole("heading", { name: "Lesson preview" })).toBeVisible({ timeout: 60_000 });
      await expect(page.getByText(/Full lesson bodies unlock with a subscription/i)).toBeVisible({
        timeout: 30_000,
      });

      const lessonsBody = await page.locator("body").innerText().catch(() => "");
      expect(lessonsBody, "free tier should not imply full catalog access on lessons hub").not.toMatch(
        /all lessons unlocked|full access to every lesson/i,
      );

      await page.goto("/app/questions", { waitUntil: "domcontentloaded" });
      await expect(page.locator("main, [role='main']").first()).toBeVisible({ timeout: 45_000 });

      await expect(page.getByRole("heading", { name: "Subscription required" }).first()).toBeVisible({
        timeout: 45_000,
      });
      await expect(page.locator('a[href="/pricing"]').first()).toBeVisible({ timeout: 15_000 });

      await page.waitForFunction(
        () => {
          const t = document.body?.innerText ?? "";
          return (
            t.includes("Try a few questions") ||
            t.includes("Complimentary preview") ||
            t.includes("View plans")
          );
        },
        null,
        { timeout: 120_000 },
      );

      const checkBtn = page.getByRole("button", { name: /^Check answer$/i });
      if (await checkBtn.isVisible().catch(() => false)) {
        const firstPick = page.locator(".nn-qopt-list").first().locator("button, label").first();
        await expect(firstPick).toBeVisible({ timeout: 15_000 });
        await firstPick.click();
        await checkBtn.click();
        await expect(page.getByRole("link", { name: /^Unlock rationales$/i })).toBeVisible({ timeout: 30_000 });
        await expect(page.getByText(/Full step-by-step explanations/i)).toBeVisible({ timeout: 15_000 });
      } else {
        await expect(page.getByRole("link", { name: /View plans/i })).toBeVisible({ timeout: 15_000 });
      }

      const qBody = await page.locator("body").innerText().catch(() => "");
      expect(qBody, "free tier must not show unlimited question bank copy").not.toMatch(
        /unlimited (questions|access)|full question bank unlocked/i,
      );

      const significantConsole = observers.consoleErrors.filter((t) => !isIgnorableAuthMarketingConsole(t));
      expect(
        significantConsole,
        `unexpected console errors (see free-user-access-capture.json): ${significantConsole.join(" | ")}`,
      ).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join(" | ")).toEqual([]);
    } finally {
      await logObserverDiagnostics(observers, testInfo.title);
      const significantConsoleErrors = observers.consoleErrors.filter((t) => !isIgnorableAuthMarketingConsole(t));
      await testInfo.attach("free-user-access-capture.json", {
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
