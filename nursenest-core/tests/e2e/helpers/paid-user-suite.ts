/**
 * Shared utilities for paid-subscriber Playwright specs (`tests/e2e/paid-user/*`).
 *
 * ## How to run
 *
 * **Prerequisites:** `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD` (or `PLAYWRIGHT_TEST_*`), and once:
 * `npx playwright test --project=setup-paid-auth` to write `tests/e2e/.auth/paid-user.json`.
 *
 * | Command | Scope |
 * | --- | --- |
 * | `npx playwright test --project=chromium-paid tests/e2e/paid-user/paid-user-smoke.spec.ts` | Paid **smoke** (lighter) |
 * | `npx playwright test --project=chromium-paid tests/e2e/paid-user/` | Full **paid-user** directory |
 * | `npm run test:e2e:ci-master` | CI gate subset (`playwright.ci-master.config.ts`) |
 * | `npx playwright test --project=chromium-paid tests/e2e/paid-user/paid-user-mobile.spec.ts` | **Mobile** paid smoke |
 *
 * Uses stored `storageState` from `setup-paid-auth` — **no per-test UI login**.
 *
 * Console allowlist: noise from analytics/CSP/third-party is filtered in `seriousConsoleLines`.
 * Extend sparingly and document new patterns inline.
 */
import { expect, type Page } from "@playwright/test";
import { attachPageObservers, type PageObservers } from "./attach-observers";
import { attachPaidJourneyApiObserver } from "./paid-journey-network";
import { expectNoSubscriptionPaywall, expectOnLearnerApp } from "./paid-surface-assertions";
import { logObserverFailureSummary } from "./log-observer-failure-summary";

export const PLACEHOLDER_COPY_RE = /\b(TBD|null|undefined)\b/i;

/** Leaked i18n token pattern in DOM (not console). */
export const DOM_MISSING_I18N_RE = /\[missing:/i;

export function expectNotLoginUrl(page: Page, context?: string): void {
  expect(page.url(), `${context ?? "page"}: unexpected /login`).not.toMatch(/\/login/i);
}

export function assertNoMissingI18nDomTokens(page: Page): Promise<void> {
  return expect(page.locator("body")).not.toContainText(DOM_MISSING_I18N_RE);
}

export async function expectNoSubscriberPaywallSurface(page: Page, context: string): Promise<void> {
  await expectNoSubscriptionPaywall(page, context);
  const main = page.locator("main");
  await expect(main.getByRole("heading", { name: /subscription required/i })).toHaveCount(0);
  await expect(main.getByRole("button", { name: /^Upgrade$/i })).toHaveCount(0);
  await expect(main.getByRole("link", { name: /^Upgrade to unlock/i })).toHaveCount(0);
}

export async function dismissFlashcardResumeIfPresent(page: Page): Promise<void> {
  const startFresh = page.getByRole("button", { name: /^Start fresh$/i });
  if (await startFresh.isVisible().catch(() => false)) {
    await startFresh.click();
    await page.waitForTimeout(300);
  }
}

/** Filters dev noise; remaining lines are treated as regressions. */
export function seriousConsoleLines(consoleErrors: string[]): string[] {
  return consoleErrors.filter(
    (x) =>
      !/cookie|Content Security Policy|third-party|analytics/i.test(x) &&
      !/favicon|ResizeObserver|Failed to load resource.*404.*\.ico/i.test(x),
  );
}

/** Missing-key signals from console (marketing + app bundles). */
export function i18nMissingKeyConsoleLines(consoleErrors: string[]): string[] {
  return consoleErrors.filter(
    (x) =>
      /\[marketing-i18n\] missing key|\[nursenest-core\].*marketing_message_key_missing|missing key.*locale bundle|missing i18n key|translation missing|undefined translation/i.test(
        x,
      ),
  );
}

export type PaidUserStandardGuards = {
  observers: PageObservers;
  apiObserver: ReturnType<typeof attachPaidJourneyApiObserver>;
  dispose: () => void;
};

/** Console + failed-request capture + same-origin `/api/*` HTTP contract (2xx/304). */
export function attachPaidUserStandardGuards(page: Page, appOrigin: string): PaidUserStandardGuards {
  const observers = attachPageObservers(page, { profile: "app" });
  const apiObserver = attachPaidJourneyApiObserver(page, appOrigin);
  return {
    observers,
    apiObserver,
    dispose: () => {
      apiObserver.dispose();
      observers.dispose();
    },
  };
}

export function assertPaidUserGuardsClean(input: {
  tag: string;
  routeLabel: string;
  observers: PageObservers;
  apiViolations: string[];
  pageUrl: string;
}): void {
  const { tag, routeLabel, observers, apiViolations, pageUrl } = input;
  const i18n = i18nMissingKeyConsoleLines(observers.consoleErrors);
  expect(i18n, `i18n missing-key console errors:\n${i18n.join("\n")}`).toEqual([]);

  const serious = seriousConsoleLines(observers.consoleErrors);
  if (serious.length > 0 || observers.failedRequests.length > 0) {
    logObserverFailureSummary({
      tag,
      routeLabel,
      seriousConsole: serious,
      failedRequests: observers.failedRequests,
      pageUrl,
    });
  }
  expect(serious, serious.slice(0, 8).join("\n")).toEqual([]);
  expect(observers.failedRequests, observers.failedRequests.slice(0, 8).join("\n")).toEqual([]);
  expect(apiViolations, apiViolations.join("\n")).toEqual([]);
}

export async function answerOneQuestionBankItem(page: Page): Promise<void> {
  const checkBtn = page.getByRole("button", { name: /^Check answer$/i });
  await expect(checkBtn).toBeVisible({ timeout: 120_000 });

  const list = page.locator("ul.nn-qopt-list").first();
  await expect(list).toBeVisible({ timeout: 15_000 });

  const firstCb = list.locator('input[type="checkbox"]').first();
  if (await firstCb.isVisible().catch(() => false)) {
    await firstCb.click();
  } else {
    await list.locator("li > button").first().click();
  }

  await expect(checkBtn).toBeEnabled({ timeout: 15_000 });
  await checkBtn.click();

  await expect(page.getByRole("status")).toBeVisible({ timeout: 30_000 });
  const rationaleBody = page.locator(
    "aside.nn-question-session-rationale .nn-rationale-prose, aside.nn-question-session-rationale .nn-question-rationale-card__body",
  );
  await expect(rationaleBody.first()).toBeVisible({ timeout: 30_000 });
  const ratText = await rationaleBody.first().innerText();
  expect(ratText.trim().length, "Rationale should render for paid bank items").toBeGreaterThan(20);

  const nextQ = page.locator("button.nn-question-nav-actions__next").filter({ hasText: /next question/i });
  if ((await nextQ.count()) > 0 && (await nextQ.isEnabled())) {
    await nextQ.click();
    await page.waitForTimeout(400);
  } else {
    const loadMore = page.getByRole("button", { name: /load more/i });
    if (await loadMore.isVisible().catch(() => false)) {
      await loadMore.click();
      await page.waitForTimeout(600);
    }
  }
}

export { expectOnLearnerApp, expectNoSubscriptionPaywall };
export type { PageObservers };
