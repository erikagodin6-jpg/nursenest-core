import { expect, type Page } from "@playwright/test";
import type { PageObservers } from "./attach-observers";
import { learnerShellStudyNavigation } from "./learner-shell-locators";
import {
  assertNoAuthSessionBlockingBeforeShell,
  assertSyncNotOnboardingBlocking,
  markLearnerShellReady,
} from "./paid-durability";
import { expectOnLearnerApp } from "./paid-surface-assertions";

/**
 * Default pathway for US RN paid E2E — align with `scripts/qa-paid-test-account-reset.mts`
 * (`resolveDefaultPathwayIdForOnboarding("rn", US)` → `us-rn-nclex-rn`).
 */
export const PAID_E2E_DEFAULT_PATHWAY_ID = "us-rn-nclex-rn";

/**
 * Wait until the learner app chrome is interactive: `main` plus at least one of the
 * desktop primary nav or mobile bottom nav (viewport-dependent).
 */
export async function waitForAuthenticatedLearnerShell(
  page: Page,
  opts?: { timeoutMs?: number },
): Promise<void> {
  const ms = opts?.timeoutMs ?? 120_000;
  assertSyncNotOnboardingBlocking(page, "waitForAuthenticatedLearnerShell");
  await expect(page.locator("main")).toBeVisible({ timeout: ms });
  await expect(learnerShellStudyNavigation(page)).toBeVisible({ timeout: Math.min(ms, 90_000) });
  assertNoAuthSessionBlockingBeforeShell(page);
  markLearnerShellReady(page);
}

/**
 * Single entry point for paid E2E: not on `/login`, not on `/app/onboarding`, learner chrome visible.
 * Prefer this over ad-hoc waits in specs.
 */
export async function expectPaidLearnerShellReady(
  page: Page,
  context: string,
  opts?: { timeoutMs?: number },
): Promise<void> {
  assertSyncNotOnboardingBlocking(page, context);
  await expectOnLearnerApp(page);
  assertSyncNotOnboardingBlocking(page, context);
  await waitForAuthenticatedLearnerShell(page, opts);
}

/** Stable: same study links appear in desktop primary nav or mobile bottom nav (exactly one visible). */
export function learnerPrimaryNavLinkToHref(page: Page, hrefPart: string) {
  return learnerShellStudyNavigation(page).locator(`a[href*="${hrefPart}"]`).first();
}

export function learnerBottomNavLinkToHref(page: Page, hrefPart: string) {
  return learnerPrimaryNavLinkToHref(page, hrefPart);
}

export type PaidSurfaceDebug = {
  step: string;
  url: string;
  title: string;
  onboardingRoute: boolean;
  subscriptionRequiredHeadingCount: number;
  mainH1: string | null;
};

export async function collectPaidSurfaceDebug(page: Page, step: string): Promise<PaidSurfaceDebug> {
  const url = page.url();
  const title = await page.title().catch(() => "");
  let onboardingPath = "";
  try {
    onboardingPath = new URL(url).pathname;
  } catch {
    onboardingPath = "";
  }
  const onboardingRoute = onboardingPath.includes("/app/onboarding");
  const subscriptionRequiredHeadingCount = await page
    .getByRole("heading", { name: "Subscription required" })
    .count()
    .catch(() => 0);
  const mainH1 =
    (await page.locator("main h1").first().innerText().catch(() => null)) ??
    (await page.getByRole("heading", { level: 1 }).first().innerText().catch(() => null));
  return {
    step,
    url,
    title: title.slice(0, 200),
    onboardingRoute,
    subscriptionRequiredHeadingCount,
    mainH1: mainH1?.trim() ? mainH1.trim().slice(0, 240) : null,
  };
}

export function logPaidSurfaceDebug(d: PaidSurfaceDebug | PaidFailureSnapshot): void {
  console.log(`[paid-e2e] ${d.step}`, JSON.stringify(d));
}

export type PaidFailureSnapshot = PaidSurfaceDebug & {
  authHttpLast?: { url: string; status: number; pageUrl: string }[];
  seriousConsoleLast?: string[];
  failedRequestsLast?: string[];
};

export function buildPaidFailureSnapshot(
  d: PaidSurfaceDebug,
  obs?: Pick<PageObservers, "authHttp" | "consoleErrors" | "failedRequests">,
): PaidFailureSnapshot {
  return {
    ...d,
    authHttpLast: obs?.authHttp?.slice(-5),
    seriousConsoleLast: obs?.consoleErrors?.slice(-5),
    failedRequestsLast: obs?.failedRequests?.slice(-5),
  };
}
