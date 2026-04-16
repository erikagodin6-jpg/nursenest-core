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
 * | `npm run test:e2e:paid-fast-sanity` | **Deploy blocker** — shell + lessons + guards (~seconds) |
 * | `npx playwright test --project=chromium-paid tests/e2e/paid-user/paid-user-00-fast-sanity.spec.ts` | same (explicit path) |
 * | `npx playwright test --project=chromium-paid tests/e2e/paid-user/` | Full **paid-user** directory (extended) |
 * | `npm run test:e2e:ci-master` | Lean CI gate: fast-sanity + journey + entitlements + nav + api-health |
 *
 * **Durability:** {@link attachPaidUserStandardGuards} registers onboarding fail-fast (sync URL checks via
 * `expectNotLoginUrl` / `expectPaidLearnerShellReady`), `/api/auth/session` pre-shell failures, auth **noise**
 * (`Failed to fetch` + session), and core API SLO monitoring (warn 3s, **fail** >6s on lessons/questions/flashcards/user-access).
 *
 * Uses stored `storageState` from `setup-paid-auth` — **no per-test UI login**.
 *
 * **i18n console:** default `assertPaidUserGuardsClean` uses `i18nConsoleMode: "warn"` — missing-key lines are
 * attached as `i18n-console-warnings.txt` and do not fail the test (marketing noise).
 *
 * Console allowlist: noise from analytics/CSP/third-party is filtered in `seriousConsoleLines`.
 * Extend sparingly and document new patterns inline.
 */
import { expect, type Page } from "@playwright/test";
import { attachPageObservers, type PageObservers } from "./attach-observers";
import {
  assertNoAuthSessionBlockingBeforeShell,
  assertSyncNotOnboardingBlocking,
  disposePaidDurabilityListeners,
  formatAuthFetchNoiseForSummary,
  registerPaidDurabilityListeners,
} from "./paid-durability";
import { attachPaidJourneyApiObserver } from "./paid-journey-network";
import {
  attachPaidSessionNetworkMonitor,
  type PaidSessionNetworkMonitor,
} from "./paid-session-network-monitor";
import { expectNoSubscriptionPaywall, expectOnLearnerApp } from "./paid-surface-assertions";
import { logObserverFailureSummary } from "./log-observer-failure-summary";
import { releaseGateBlockingSnippet, releaseGateUrlContext } from "./release-gate-failure";

export const PLACEHOLDER_COPY_RE = /\b(TBD|null|undefined)\b/i;

/** Leaked i18n token pattern in DOM (not console). */
export const DOM_MISSING_I18N_RE = /\[missing:/i;

/** Non-blocking: session fetch noise in console (still reported in attachments). */
export function isAuthFetchNoiseConsoleLine(line: string): boolean {
  return /Failed to fetch/i.test(line) && /session|\/api\/auth|getSession|SessionProvider/i.test(line);
}

export function expectNotLoginUrl(page: Page, context?: string): void {
  const label = context ?? "expectNotLoginUrl";
  assertSyncNotOnboardingBlocking(page, label);
  const { line } = releaseGateUrlContext(page);
  const hint = releaseGateBlockingSnippet(page);
  expect(
    page.url(),
    `${label}: expected authenticated learner route; landed on login (session missing, bad seed, or redirect). category=auth ${line}. ${hint} Re-run setup-paid-auth if storageState is stale.`,
  ).not.toMatch(/\/login/i);
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
      !isAuthFetchNoiseConsoleLine(x) &&
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
  sessionNet: PaidSessionNetworkMonitor;
  dispose: () => void;
};

/**
 * Console + `/api/*` contract + durability listeners (auth session pre-shell, core SLO timing).
 * Attach **before** first navigation in the test.
 */
export function attachPaidUserStandardGuards(page: Page, appOrigin: string): PaidUserStandardGuards {
  const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });
  registerPaidDurabilityListeners(page, appOrigin);
  const apiObserver = attachPaidJourneyApiObserver(page, appOrigin);
  const sessionNet = attachPaidSessionNetworkMonitor(page, appOrigin);
  return {
    observers,
    apiObserver,
    sessionNet,
    dispose: () => {
      sessionNet.dispose();
      apiObserver.dispose();
      observers.dispose();
      disposePaidDurabilityListeners(page);
    },
  };
}

export type PaidGuardI18nConsoleMode = "fail" | "warn" | "ignore";

export function assertPaidUserGuardsClean(input: {
  tag: string;
  routeLabel: string;
  observers: PageObservers;
  apiViolations: string[];
  pageUrl: string;
  /** Required: auth pre-shell failures + console authNoise attachment. */
  page: Page;
  /** Required: core API latency + HTTP failures from {@link attachPaidSessionNetworkMonitor}. */
  sessionNet: PaidSessionNetworkMonitor;
  i18nConsoleMode?: PaidGuardI18nConsoleMode;
  attach?: (name: string, body: string) => void;
}): void {
  const {
    tag,
    routeLabel,
    observers,
    apiViolations,
    pageUrl,
    page,
    sessionNet,
    i18nConsoleMode = "warn",
    attach,
  } = input;

  assertNoAuthSessionBlockingBeforeShell(page);
  const noise = formatAuthFetchNoiseForSummary(page);
  if (noise) {
    attach?.("auth-noise-non-blocking.txt", noise);
    // eslint-disable-next-line no-console
    console.log(`[${tag}] authNoise (non-blocking): ${noise.slice(0, 300)}`);
  }

  if (sessionNet.slowCriticalWarnings.length > 0) {
    const w = sessionNet.formatSlowCriticalWarningsLog();
    attach?.("slow-endpoint-warnings.txt", w);
    // eslint-disable-next-line no-console
    console.log(`[${tag}] slowEndpointWarning (core APIs ${sessionNet.slowCriticalWarnings.length}):\n${w}`);
  }
  const netFails = sessionNet.buildFailureMessages();
  expect(
    netFails,
    `slowEndpointFailure / network / status (core SLO >6s on critical APIs):\n${netFails.join("\n")}`,
  ).toEqual([]);

  const i18n = i18nMissingKeyConsoleLines(observers.consoleErrors);

  if (i18nConsoleMode === "fail") {
    expect(i18n, `i18nCoreFailure: missing-key console errors:\n${i18n.join("\n")}`).toEqual([]);
  } else if (i18nConsoleMode === "warn" && i18n.length > 0) {
    const body = i18n.join("\n");
    attach?.("i18n-console-warnings.txt", body);
    // eslint-disable-next-line no-console
    console.log(`[${tag}] i18n console warnings (non-fatal, ${i18n.length} lines) — see attachment if provided`);
  }

  const i18nSet = new Set(i18n);
  const consoleForSerious =
    i18nConsoleMode === "fail" ? observers.consoleErrors : observers.consoleErrors.filter((l) => !i18nSet.has(l));

  const serious = seriousConsoleLines(consoleForSerious);
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

export { expectOnLearnerApp, expectNoSubscriptionPaywall, expectNoSubscriberPaywallSurface };
export type { PageObservers };
