/**
 * Resilience: fire-and-forget learner APIs may be slow without blocking shell render or tripping core SLO.
 *
 * Delays {@link SLOW_OPTIONAL_PATH_PREFIXES} only. Critical paths (`/api/lessons`, `/api/questions`, `/api/flashcards`, `/api/user-access`) are untouched.
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

/** Fire-and-forget shell calls — must not block `main` / nav (see site header + retention hooks). */
const SLOW_OPTIONAL_PATH_PREFIXES = ["/api/learner/engagement-nudges", "/api/learner/protection-telemetry"] as const;

const SLOW_OPTIONAL_MS = 2_000;

function shouldSlowOptionalLearnerPath(pathname: string): boolean {
  return SLOW_OPTIONAL_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

test.describe("Paid user — slow optional APIs (shell stays up)", () => {
  test("dashboard + lessons hub render when optional learner APIs are delayed", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(120_000);
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
      if (shouldSlowOptionalLearnerPath(pathname)) {
        await new Promise((r) => setTimeout(r, SLOW_OPTIONAL_MS));
      }
      await route.continue();
    });

    try {
      await test.step("/app — shell despite slow optional learner fetches", async () => {
        await page.goto("/app", { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectPaidLearnerShellReady(page, "perf /app", { timeoutMs: 110_000 });
        await expectNoSubscriberPaywallSurface(page, "perf /app");
        await assertCoreLearnerDurability(page, "perf dashboard");
      });

      await test.step("/app/lessons — hub still reachable", async () => {
        await page.goto(paidLessonsHubUrl(), { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectPaidLearnerShellReady(page, "perf /app/lessons", { timeoutMs: 110_000 });
        await expectNoSubscriberPaywallSurface(page, "perf lessons hub");
        const lessonLinks = page.locator('a[href^="/app/lessons/"]');
        await expect(lessonLinks.first()).toBeVisible({ timeout: 90_000 });
        await assertCoreLearnerDurability(page, "perf lessons hub");
      });

      await test.step("Guards — no slowEndpointFailure on critical APIs", async () => {
        assertPaidUserGuardsClean({
          tag: "[paid-user-performance]",
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
