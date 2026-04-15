/**
 * **Fast paid sanity gate** — minimal path to validate session + learner shell + lessons hub + guardrails.
 * Intended to run first in CI (`paid-user-00-*` sorts before other specs) and finish in seconds.
 *
 * Does **not** replace `paid-user-journey` (full study flows) or entitlement tests.
 *
 * @see ../helpers/paid-user-suite.ts
 */
import { expect, test } from "@playwright/test";
import { paidLessonsHubUrl } from "../helpers/paid-content-discovery";
import { expectPaidLearnerShellReady } from "../helpers/paid-learner-shell";
import {
  assertPaidUserGuardsClean,
  attachPaidUserStandardGuards,
  expectNotLoginUrl,
} from "../helpers/paid-user-suite";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";

test.describe("Paid user — fast sanity (CI gate)", () => {
  test("shell + lessons hub + no paywall + API/console contract", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(90_000);
    const appOrigin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    const guards = attachPaidUserStandardGuards(page, appOrigin);

    try {
      await test.step("/app — learner shell (not onboarding)", async () => {
        await page.goto("/app", { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectPaidLearnerShellReady(page, "fast-sanity /app");
        await expect(page.locator("main")).toBeVisible({ timeout: 15_000 });
      });

      await test.step("/app/lessons — hub loads, no subscription gate", async () => {
        await page.goto(paidLessonsHubUrl(), { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectPaidLearnerShellReady(page, "fast-sanity /app/lessons");
        await expectNoSubscriptionPaywall(page, "fast-sanity lessons hub");
        const lessonLinks = page.locator('a[href^="/app/lessons/"]');
        await expect(lessonLinks.first()).toBeVisible({ timeout: 60_000 });
      });

      await test.step("Guards — serious console, failed requests, /api HTTP", async () => {
        assertPaidUserGuardsClean({
          tag: "[paid-user-00-fast-sanity]",
          routeLabel: "final",
          observers: guards.observers,
          apiViolations: guards.apiObserver.violations,
          pageUrl: page.url(),
          i18nConsoleMode: "warn",
          attach: (name, body) => {
            void testInfo.attach(name, { body, contentType: "text/plain" });
          },
        });
      });
    } finally {
      guards.dispose();
    }
  });
});
