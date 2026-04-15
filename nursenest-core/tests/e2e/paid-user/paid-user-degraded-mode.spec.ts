/**
 * Resilience: learner shell + lessons must render when optional systems fail or degraded mode is on.
 *
 * **Server degraded mode** (skips Tier-2 server work): start Playwright with
 * `E2E_LEARNER_DEGRADED=1` (see `playwright.config.ts` webServer env) or run:
 * `npm run test:e2e:paid-degraded`
 *
 * Client: aborts non-critical third-party / analytics-style requests — must not take down /app.
 */
import { expect, test } from "@playwright/test";
import { assertCoreLearnerDurability } from "../helpers/paid-durability";
import { paidLessonsHubUrl } from "../helpers/paid-content-discovery";
import { expectPaidLearnerShellReady } from "../helpers/paid-learner-shell";
import {
  assertPaidUserGuardsClean,
  attachPaidUserStandardGuards,
  expectNotLoginUrl,
  expectNoSubscriberPaywallSurface,
} from "../helpers/paid-user-suite";

test.describe("Paid user — degraded / crash-proof shell", () => {
  test("shell + lessons hub stay usable (degraded server + blocked optional fetches)", async ({
    page,
    baseURL,
  }, testInfo) => {
    const appOrigin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    const guards = attachPaidUserStandardGuards(page, appOrigin);

    /** After guards; before navigation — block noisy third-party fetches only. */
    await page.route("**/*", async (route) => {
      const u = route.request().url();
      if (/posthog|ingest\/e\/|googletagmanager|facebook\.net\/tr/i.test(u)) {
        await route.abort();
        return;
      }
      await route.continue();
    });

    try {
      await test.step("/app — shell visible, main not blank", async () => {
        await page.goto("/app", { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectPaidLearnerShellReady(page, "degraded /app");
        await expectNoSubscriberPaywallSurface(page, "degraded /app");
        await assertCoreLearnerDurability(page, "degraded dashboard");
      });

      await test.step("/app/lessons — hub reachable", async () => {
        await page.goto(paidLessonsHubUrl(), { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectPaidLearnerShellReady(page, "degraded /app/lessons");
        await expectNoSubscriberPaywallSurface(page, "degraded lessons hub");
        const lessonLinks = page.locator('a[href^="/app/lessons/"]');
        await expect(lessonLinks.first()).toBeVisible({ timeout: 90_000 });
        await assertCoreLearnerDurability(page, "degraded lessons hub");
      });

      await test.step("Guards clean (no blocking auth / core SLO regressions)", async () => {
        assertPaidUserGuardsClean({
          tag: "[paid-user-degraded-mode]",
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
