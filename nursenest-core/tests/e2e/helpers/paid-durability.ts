/**
 * Enterprise durability rules for paid-user E2E: onboarding fail-fast, auth/session classification,
 * and core learner shell health assertions.
 */
import { expect, type Page, type Response } from "@playwright/test";
import { learnerShellStudyNavigation } from "./learner-shell-locators";

export type DurabilityPageState = {
  shellReady: boolean;
  /** `/api/auth/session` returned 401/403/5xx before {@link markLearnerShellReady} */
  authSessionPreShellFailures: string[];
  /** Console: Failed to fetch + session/auth — non-blocking, reported only */
  authFetchNoiseLines: string[];
};

const durabilityByPage = new WeakMap<Page, DurabilityPageState>();
const durabilityListenersRegistered = new WeakSet<Page>();

function getOrCreateState(page: Page): DurabilityPageState {
  let s = durabilityByPage.get(page);
  if (!s) {
    s = {
      shellReady: false,
      authSessionPreShellFailures: [],
      authFetchNoiseLines: [],
    };
    durabilityByPage.set(page, s);
  }
  return s;
}

/** Call when attaching paid guards (before first navigation). Idempotent per page. */
export function registerPaidDurabilityListeners(page: Page, appOrigin: string): void {
  if (durabilityListenersRegistered.has(page)) return;
  durabilityListenersRegistered.add(page);
  const state = getOrCreateState(page);

  const onResponse = (res: Response) => {
    const req = res.request();
    if (req.resourceType() !== "fetch" && req.resourceType() !== "xhr") return;
    let url = "";
    try {
      url = res.url();
      if (!url.startsWith(appOrigin)) return;
    } catch {
      return;
    }
    let pathname = "";
    try {
      pathname = new URL(url).pathname;
    } catch {
      return;
    }
    if (pathname !== "/api/auth/session" && !pathname.endsWith("/api/auth/session")) return;
    const st = res.status();
    if (st === 401 || st === 403 || st >= 500) {
      if (!state.shellReady) {
        state.authSessionPreShellFailures.push(
          `authFailure: /api/auth/session returned ${st} before learner shell ready (${req.method()} ${url})`,
        );
      }
    }
  };

  const onConsole = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() !== "error" && msg.type() !== "warning") return;
    const t = msg.text();
    if (!/Failed to fetch/i.test(t)) return;
    if (!/session|\/api\/auth|getSession|SessionProvider/i.test(t)) return;
    state.authFetchNoiseLines.push(`[${msg.type()}] ${t}`);
  };

  page.on("response", onResponse);
  page.on("console", onConsole);

  const cleanup = () => {
    page.off("response", onResponse);
    page.off("console", onConsole);
  };
  const anyPage = page as Page & { __paidDurabilityCleanup?: () => void };
  anyPage.__paidDurabilityCleanup = cleanup;
}

export function disposePaidDurabilityListeners(page: Page): void {
  const anyPage = page as Page & { __paidDurabilityCleanup?: () => void };
  anyPage.__paidDurabilityCleanup?.();
  anyPage.__paidDurabilityCleanup = undefined;
  durabilityListenersRegistered.delete(page);
  durabilityByPage.delete(page);
}

/** Invoke at end of {@link waitForAuthenticatedLearnerShell} / successful shell wait. */
export function markLearnerShellReady(page: Page): void {
  getOrCreateState(page).shellReady = true;
}

export function assertNoAuthSessionBlockingBeforeShell(page: Page): void {
  const state = durabilityByPage.get(page);
  if (!state?.authSessionPreShellFailures.length) return;
  throw new Error(state.authSessionPreShellFailures.join("\n"));
}

export function formatAuthFetchNoiseForSummary(page: Page): string {
  const state = durabilityByPage.get(page);
  if (!state?.authFetchNoiseLines.length) return "";
  return state.authFetchNoiseLines.join("\n");
}

/**
 * **Sync** onboarding check — no awaits. Call after every navigation and before long timeouts.
 * Throws {@link OnboardingBlockingFlowError} for summary classification `onboardingBlockingFlow`.
 */
export class OnboardingBlockingFlowError extends Error {
  readonly category = "onboardingBlockingFlow" as const;

  constructor(
    readonly detail: { url: string; context: string; lastNavigationStep?: string },
  ) {
    let pathname = "";
    try {
      pathname = new URL(detail.url).pathname;
    } catch {
      pathname = "";
    }
    super(
      `On /app/onboarding — complete onboarding or reset the paid QA seed (User.onboardingCompletedAt). onboardingBlockingFlow url=${detail.url} pathname=${pathname} context=${detail.context}${
        detail.lastNavigationStep ? ` lastStep=${detail.lastNavigationStep}` : ""
      }. Fix: run scripts/qa-paid-test-account-reset.mts.`,
    );
    this.name = "OnboardingBlockingFlowError";
  }
}

export function assertSyncNotOnboardingBlocking(
  page: Page,
  context: string,
  lastNavigationStep?: string,
): void {
  let path = "";
  try {
    path = new URL(page.url()).pathname;
  } catch {
    return;
  }
  if (path.includes("/app/onboarding")) {
    throw new OnboardingBlockingFlowError({
      url: page.url(),
      context,
      lastNavigationStep,
    });
  }
}

/**
 * End-of-step durability: main has content, nav interactive, no obvious stuck global loading on `main`.
 */
export async function assertCoreLearnerDurability(page: Page, step: string): Promise<void> {
  assertSyncNotOnboardingBlocking(page, `durability:${step}`);

  const main = page.locator("main").first();
  const mainVisible = await main.isVisible().catch(() => false);
  if (!mainVisible) {
    throw new Error(`shellFailure: main landmark not visible (${step}) url=${page.url()}`);
  }

  const text = (await main.innerText().catch(() => "")).trim();
  if (text.length < 20) {
    throw new Error(
      `blankScreenDetected: main content too sparse at step "${step}" (len=${text.length}) url=${page.url()}`,
    );
  }

  const busyMain = main.locator('[data-loading="true"], [aria-busy="true"]').first();
  if (await busyMain.isVisible().catch(() => false)) {
    throw new Error(`stuckLoadingState: main still marked loading at step "${step}" url=${page.url()}`);
  }

  try {
    await expect(learnerShellStudyNavigation(page)).toBeVisible({ timeout: 12_000 });
  } catch {
    throw new Error(`shellNotInteractive: learner nav not visible at step "${step}" url=${page.url()}`);
  }
}
