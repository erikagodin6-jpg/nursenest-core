/**
 * Stress / spike simulation: rapid navigations + delayed optional APIs + parallel fetches.
 * Asserts learner shell and lessons hub stay up (no crash, no subscriber paywall regression).
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

const OPTIONAL_SLOW_MS = 800;

test.describe("Paid user — stress / spike resilience", () => {
  test("rapid navigations + slow optional APIs — shell and lessons stay usable", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(180_000);
    const appOrigin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    const guards = attachPaidUserStandardGuards(page, appOrigin);

    await page.route("**/*", async (route) => {
      const req = route.request();
      if (req.resourceType() !== "fetch" && req.resourceType() !== "xhr") {
        await route.continue();
        return;
      }
      let pathname = "";
      try {
        pathname = new URL(req.url()).pathname;
      } catch {
        await route.continue();
        return;
      }
      if (pathname.startsWith("/api/learner/engagement-nudges") || pathname.startsWith("/api/learner/protection-telemetry")) {
        await new Promise((r) => setTimeout(r, OPTIONAL_SLOW_MS));
      }
      await route.continue();
    });

    try {
      for (let i = 0; i < 4; i++) {
        await test.step(`spike round ${i + 1} — /app`, async () => {
          await page.goto("/app", { waitUntil: "domcontentloaded" });
          expectNotLoginUrl(page);
          await expectPaidLearnerShellReady(page, `stress /app r${i + 1}`, { timeoutMs: 120_000 });
          await expectNoSubscriberPaywallSurface(page, `stress /app r${i + 1}`);
          await assertCoreLearnerDurability(page, `stress dashboard r${i + 1}`);
        });
      }

      await test.step("parallel-ish burst — open lessons in new page context", async () => {
        const p2 = await page.context().newPage();
        const g2 = attachPaidUserStandardGuards(p2, appOrigin);
        try {
          await p2.goto(paidLessonsHubUrl(), { waitUntil: "domcontentloaded" });
          await expectPaidLearnerShellReady(p2, "stress parallel lessons", { timeoutMs: 120_000 });
          await expectNoSubscriberPaywallSurface(p2, "stress parallel lessons");
        } finally {
          g2.dispose();
          await p2.close();
        }
      });

      await test.step("/app/lessons — hub after burst", async () => {
        await page.goto(paidLessonsHubUrl(), { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectPaidLearnerShellReady(page, "stress /app/lessons", { timeoutMs: 120_000 });
        await expectNoSubscriberPaywallSurface(page, "stress lessons hub");
        const lessonLinks = page.locator(LESSON_HUB_CARD_LINKS);
        await expect(lessonLinks.first()).toBeVisible({ timeout: 90_000 });
        await assertCoreLearnerDurability(page, "stress lessons hub");
      });

      await test.step("Guards clean", async () => {
        assertPaidUserGuardsClean({
          tag: "[paid-user-stress]",
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
