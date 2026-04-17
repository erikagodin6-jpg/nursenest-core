/**
 * Paid RN lesson integrity: `/app/lessons` hub → up to 20 lesson detail pages must have real body copy, no paywall, no 404 shell.
 *
 * **Credentials:** `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD` (or QA_/PLAYWRIGHT_TEST_ aliases). QA seed is RN / NCLEX pathway–aligned.
 *
 * Run: `npx playwright test tests/e2e/lessons/lesson-integrity-paid.spec.ts --project=chromium`
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import { expectAtLeastOneLessonLink } from "../helpers/paid-content-discovery";
import { expectNoSubscriptionPaywall, expectOnPaidSubscriberApp } from "../helpers/paid-surface-assertions";
import { learnerAppMainLandmark } from "../helpers/paid-learner-shell";
import { attachSmokeFailureScreenshot } from "../helpers/smoke-evidence";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";
import { scrollVirtualListAndCollectLessonRows } from "../helpers/rn-lesson-hub-inventory";

const MAX_LESSONS = 20;

/** Same noise filter as `lessons-page.spec.ts` (app shell + lesson surfaces). */
function isIgnorableLessonIntegrityConsole(text: string): boolean {
  return (
    /favicon|ResizeObserver|Failed to load resource.*404.*\.ico/i.test(text) ||
    /hydration mismatch|hydrated but some attributes of the server rendered HTML/i.test(text) ||
    /next-image-unconfigured-qualities|images\.qualities/i.test(text) ||
    /\[nursenest-core\].*marketing_message_key_missing/i.test(text) ||
    /webpack-hmr|WebSocket connection.*_next\/webpack-hmr/i.test(text)
  );
}

test.use({ storageState: { cookies: [], origins: [] } });
test.describe.configure({ mode: "serial" });

test.describe("Lesson integrity (paid RN)", () => {
  test("lesson detail pages have learner main, substantive body, no paywall or 404 shell", async ({ page }, testInfo) => {
    test.setTimeout(900_000);

    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD (or QA_PAID_* / PLAYWRIGHT_TEST_*)");

    const observers = attachPageObservers(page, { profile: "app" });

    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await expectOnPaidSubscriberApp(page);

      await page.goto("/app/lessons", {
        waitUntil: "domcontentloaded",
        timeout: 120_000,
      });
      await expectNoSubscriptionPaywall(page, "lesson-integrity-hub");
      await expect(learnerAppMainLandmark(page)).toBeVisible({ timeout: 120_000 });

      await expectAtLeastOneLessonLink(page, { timeoutMs: 120_000 });

      const { rows, diagnostics } = await scrollVirtualListAndCollectLessonRows(page, 1);
      expect(rows.length, "virtual list should expose at least one /app/lessons/:id link").toBeGreaterThan(0);

      const pathnames = [...new Set(rows.map((r) => r.pathname))].slice(0, MAX_LESSONS);
      expect(pathnames.length).toBeGreaterThan(0);

      await testInfo.attach("lesson-integrity-hub-diagnostics.json", {
        body: Buffer.from(JSON.stringify({ diagnostics, sampled: pathnames.length }, null, 2)),
        contentType: "application/json",
      });

      for (const pathname of pathnames) {
        observers.consoleErrors.length = 0;
        observers.failedRequests.length = 0;

        const res = await page.goto(pathname, {
          waitUntil: "domcontentloaded",
          timeout: 120_000,
        });
        expect(res?.ok(), `expected 2xx for ${pathname}, got ${res?.status()}`).toBeTruthy();

        const url = page.url();
        expect(url, "should stay on learner app lesson detail").toMatch(/\/app\/lessons\/[^/?#]+$/);
        expect(url.toLowerCase()).not.toContain("/404");

        const title = (await page.title().catch(() => "")).toLowerCase();
        expect(title, "not a generic 404 title").not.toMatch(/not found|^404\b/);

        await expect(page.getByRole("region", { name: "Page not found" })).toHaveCount(0);

        await expectNoSubscriptionPaywall(page, `lesson-integrity:${pathname}`);

        const main = learnerAppMainLandmark(page);
        await expect(main).toBeVisible({ timeout: 90_000 });

        await expect(page.locator("h1.nn-lesson-page-title")).toBeVisible({ timeout: 60_000 });

        const mainText = (await main.innerText().catch(() => "")).trim();
        expect(
          mainText.length,
          `learner main should have substantive text (${pathname})`,
        ).toBeGreaterThan(200);

        const proseLoc = page.locator(".nn-lesson-prose");
        await expect(proseLoc.first()).toBeVisible({ timeout: 45_000 });
        const proseParts = await proseLoc.allInnerTexts();
        const proseText = proseParts.join("\n").trim();
        expect(
          proseText.length,
          `combined .nn-lesson-prose text should be substantive (${pathname})`,
        ).toBeGreaterThan(200);

        const significant = observers.consoleErrors.filter((t) => !isIgnorableLessonIntegrityConsole(t));
        expect(significant, `console errors on ${pathname}: ${significant.join(" | ")}`).toEqual([]);
        expect(observers.failedRequests, observers.failedRequests.join(" | ")).toEqual([]);
      }
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "lesson-integrity-paid-failure.png");
      throw e;
    } finally {
      await testInfo.attach("lesson-integrity-capture.json", {
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
