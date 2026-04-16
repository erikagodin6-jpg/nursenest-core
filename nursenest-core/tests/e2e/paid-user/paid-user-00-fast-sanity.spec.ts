/**
 * **Fast paid sanity — deploy gate** (~seconds on warm app; validates session + shell + lessons + durability guards).
 *
 * **Block deploy if this fails.** Run:
 *
 * ```
 * npm run test:e2e:paid-fast-sanity
 * ```
 *
 * Or:
 *
 * ```
 * npx playwright test --project=chromium-paid tests/e2e/paid-user/paid-user-00-fast-sanity.spec.ts
 * ```
 *
 * @see ../helpers/paid-user-suite.ts
 */
import { expect, test } from "@playwright/test";
import { assertCoreLearnerDurability } from "../helpers/paid-durability";
import { LESSON_HUB_CARD_LINKS, paidLessonsHubUrl } from "../helpers/paid-content-discovery";
import { expectPaidLearnerShellReady } from "../helpers/paid-learner-shell";
import {
  assertPaidUserGuardsClean,
  attachPaidUserStandardGuards,
  expectNotLoginUrl,
  expectNoSubscriberPaywallSurface,
} from "../helpers/paid-user-suite";

test.describe("Paid user — fast sanity (CI gate)", () => {
  test("shell + lessons hub + no paywall + API/console contract", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(45_000);
    const appOrigin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    const guards = attachPaidUserStandardGuards(page, appOrigin);

    try {
      await test.step("Learner shell: /app dashboard (not onboarding)", async () => {
        await page.goto("/app", { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectPaidLearnerShellReady(page, "fast-sanity /app");
        await expectNoSubscriberPaywallSurface(page, "fast-sanity /app");
        await assertCoreLearnerDurability(page, "fast-sanity dashboard");
      });

      await test.step("/app/lessons — hub loads, no subscription gate", async () => {
        await page.goto(paidLessonsHubUrl(), { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectPaidLearnerShellReady(page, "fast-sanity /app/lessons");
        await expectNoSubscriberPaywallSurface(page, "fast-sanity lessons hub");
        const lessonLinks = page.locator(LESSON_HUB_CARD_LINKS);
        await expect(lessonLinks.first()).toBeVisible({ timeout: 20_000 });
        await assertCoreLearnerDurability(page, "fast-sanity lessons hub");
      });

      await test.step("Guards — auth/session, core SLO, serious console, /api HTTP", async () => {
        assertPaidUserGuardsClean({
          tag: "[paid-user-00-fast-sanity]",
          routeLabel: "final",
          observers: guards.observers,
          apiViolations: guards.apiObserver.violations,
          pageUrl: page.url(),
          page,
          sessionNet: guards.sessionNet,
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
