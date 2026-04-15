/**
 * Session persistence: storage state survives reload, idle, and a **small** set of navigations.
 * Not a full product tour — see `paid-user-journey` for that.
 *
 * Idle wait default: 2.5 minutes. Override:
 *   E2E_SESSION_PERSISTENCE_IDLE_MS=5000 npx playwright test .../paid-user-session-persistence.spec.ts --project=chromium-paid
 */
import { expect, test } from "@playwright/test";
import { paidLessonsHubUrl, paidQuestionsHubUrl } from "../helpers/paid-content-discovery";
import { expectPaidLearnerShellReady } from "../helpers/paid-learner-shell";
import {
  assertPaidUserGuardsClean,
  attachPaidUserStandardGuards,
} from "../helpers/paid-user-suite";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";

function idleWaitMs(): number {
  const raw = process.env.E2E_SESSION_PERSISTENCE_IDLE_MS?.trim();
  if (raw) {
    const n = Number(raw);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return 150_000;
}

async function assertSessionActiveOnAppRoute(page: Page, context: string): Promise<void> {
  expect(page.url(), `${context}: redirected to login`).not.toMatch(/\/login/i);
  const url = page.url();
  if (/\/app(\/|$)/i.test(url)) {
    await expectNoSubscriptionPaywall(page, context);
  }
}

async function visitAndAssertShell(page: Page, path: string, label: string): Promise<void> {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await assertSessionActiveOnAppRoute(page, `${label} (${path})`);
  await expectPaidLearnerShellReady(page, `session-persistence ${label}`);
}

test.describe("Paid user — session persistence", () => {
  test("reload, idle, and retry keep learner session", async ({ page, baseURL }, testInfo) => {
    const idleMs = idleWaitMs();
    test.setTimeout(Math.max(600_000, idleMs + 240_000));

    await testInfo.attach("session-persistence-config.txt", {
      body: `E2E_SESSION_PERSISTENCE_IDLE_MS effective: ${idleMs}ms (${(idleMs / 60_000).toFixed(2)} min)\n`,
      contentType: "text/plain",
    });

    await test.step("Seed: dashboard + lessons + questions (pathway-scoped)", async () => {
      await visitAndAssertShell(page, "/app", "dashboard");
      await visitAndAssertShell(page, paidLessonsHubUrl(), "lessons hub");
      await visitAndAssertShell(page, paidQuestionsHubUrl(), "question bank");
    });

    await test.step("Reload browser (full document reload)", async () => {
      await page.reload({ waitUntil: "domcontentloaded" });
      await assertSessionActiveOnAppRoute(page, "after reload");
      await expectPaidLearnerShellReady(page, "after reload");
    });

    await test.step(`Idle wait (${idleMs}ms) — session must not expire`, async () => {
      await page.waitForTimeout(idleMs);
    });

    await test.step("Post-idle: dashboard + questions still premium", async () => {
      await visitAndAssertShell(page, "/app", "retry dashboard");
      await visitAndAssertShell(page, paidQuestionsHubUrl(), "retry questions");
    });

    await test.step("Final reload + guards (session + API/console)", async () => {
      const appOrigin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
      const guards = attachPaidUserStandardGuards(page, appOrigin);
      try {
        await page.goto("/app", { waitUntil: "domcontentloaded" });
        await page.reload({ waitUntil: "domcontentloaded" });
        await assertSessionActiveOnAppRoute(page, "final after idle + reload");
        await expectPaidLearnerShellReady(page, "final");
        await expect(page.getByRole("link", { name: /lessons/i }).first()).toBeVisible({ timeout: 30_000 });
        assertPaidUserGuardsClean({
          tag: "[paid-user-session-persistence]",
          routeLabel: "final",
          observers: guards.observers,
          apiViolations: guards.apiObserver.violations,
          pageUrl: page.url(),
          i18nConsoleMode: "warn",
          attach: (name, body) => {
            void testInfo.attach(name, { body, contentType: "text/plain" });
          },
        });
      } finally {
        guards.dispose();
      }
    });
  });
});
