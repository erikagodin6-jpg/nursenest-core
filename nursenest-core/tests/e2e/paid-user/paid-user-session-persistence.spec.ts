/**
 * Session persistence: paid storage state must survive multi-page navigation, reload, and idle time.
 *
 * Requires `--project=chromium-paid` + `setup-paid-auth` (see `paid-user-smoke.spec.ts`).
 *
 * Idle wait default: 2.5 minutes. Override for faster local runs:
 *   E2E_SESSION_PERSISTENCE_IDLE_MS=5000 npx playwright test .../paid-user-session-persistence.spec.ts --project=chromium-paid
 */
import { expect, test, type Page } from "@playwright/test";
import {
  assertPaidUserGuardsClean,
  attachPaidUserStandardGuards,
} from "../helpers/paid-user-suite";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";

/** Default 150_000 ms (2.5 min); must stay within 2–3 min unless overridden. */
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

async function visitAndAssert(page: Page, path: string, label: string): Promise<void> {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await assertSessionActiveOnAppRoute(page, `${label} (${path})`);
  await expect(page.locator("main")).toBeVisible({ timeout: 30_000 });
}

test.describe("Paid user — session persistence", () => {
  test("navigation, reload, idle wait, and retry keep learner session", async ({ page, baseURL }, testInfo) => {
    const idleMs = idleWaitMs();
    // Idle + navigations + margin (global config default is 180s).
    test.setTimeout(Math.max(600_000, idleMs + 240_000));

    await testInfo.attach("session-persistence-config.txt", {
      body: `E2E_SESSION_PERSISTENCE_IDLE_MS effective: ${idleMs}ms (${(idleMs / 60_000).toFixed(2)} min)\n`,
      contentType: "text/plain",
    });

    await test.step("Navigate 6 learner pages (session + premium access)", async () => {
      await visitAndAssert(page, "/app", "dashboard");
      await visitAndAssert(page, "/app/lessons", "lessons hub");
      await visitAndAssert(page, "/app/questions", "question bank");
      await visitAndAssert(page, "/app/flashcards", "flashcards hub");
      await visitAndAssert(page, "/app/account/overview", "account overview");
      await visitAndAssert(page, "/app/account/billing", "billing");
    });

    await test.step("Reload browser (full document reload)", async () => {
      await page.reload({ waitUntil: "domcontentloaded" });
      await assertSessionActiveOnAppRoute(page, "after reload");
      await expect(page.locator("main")).toBeVisible({ timeout: 30_000 });
    });

    await test.step("Continue navigation after reload", async () => {
      await visitAndAssert(page, "/app", "post-reload dashboard");
      await visitAndAssert(page, "/app/lessons", "post-reload lessons");
    });

    await test.step(`Idle wait (${idleMs}ms) — session must not expire`, async () => {
      // Keep page alive; session cookies should persist across real time.
      await page.waitForTimeout(idleMs);
    });

    await test.step("Retry navigation after idle (session still valid)", async () => {
      await visitAndAssert(page, "/app", "retry dashboard");
      await visitAndAssert(page, "/app/questions", "retry questions");
      await visitAndAssert(page, "/app/account/overview", "retry account");
    });

    await test.step("Final reload + guards (session still valid; no console/API regressions)", async () => {
      const appOrigin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
      const guards = attachPaidUserStandardGuards(page, appOrigin);
      try {
        await page.goto("/app", { waitUntil: "domcontentloaded" });
        await page.reload({ waitUntil: "domcontentloaded" });
        await assertSessionActiveOnAppRoute(page, "final after idle + reload");
        await expect(page.getByRole("link", { name: /lessons/i }).first()).toBeVisible({ timeout: 30_000 });
        assertPaidUserGuardsClean({
          tag: "[paid-user-session-persistence]",
          routeLabel: "final",
          observers: guards.observers,
          apiViolations: guards.apiObserver.violations,
          pageUrl: page.url(),
        });
      } finally {
        guards.dispose();
      }
    });
  });
});
