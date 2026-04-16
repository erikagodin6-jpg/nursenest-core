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

/** Snapshot when `#nn-learner-main` is missing — auth redirect, onboarding, marketing guest hub, or auth gate. */
export type LearnerShellMainMissingDiagnostics = {
  pageUrl: string;
  windowPathname: string;
  pathnameFromPageUrl: string;
  title: string;
  nnLearnerMainCount: number;
  authGateCount: number;
  learnerStickyChromeCount: number;
  marketingSurfaceCount: number;
  loginPathOrQuery: boolean;
  passwordInputCount: boolean;
  signInButtonVisible: boolean;
  onboardingUrl: boolean;
  likelyMarketingLessonsHub: boolean;
  inferredCause: string;
};

async function collectLearnerShellMainMissingDiagnostics(page: Page): Promise<LearnerShellMainMissingDiagnostics> {
  const pageUrl = page.url();
  let pathnameFromPageUrl = "";
  try {
    pathnameFromPageUrl = new URL(pageUrl).pathname;
  } catch {
    pathnameFromPageUrl = "";
  }
  let windowPathname = "";
  try {
    windowPathname = await page.evaluate(() => window.location.pathname);
  } catch {
    windowPathname = "";
  }
  const title = (await page.title().catch(() => "")).slice(0, 200);
  const [
    nnLearnerMainCount,
    authGateCount,
    learnerStickyChromeCount,
    marketingSurfaceCount,
    passwordInputs,
    signInButtonVisible,
  ] = await Promise.all([
    page.locator("#nn-learner-main").count(),
    page.locator("[data-nn-learner-auth-gate]").count(),
    page.locator(".nn-learner-shell-sticky").count(),
    page.locator(".nn-marketing-surface").count(),
    page.locator('input[type="password"]').count(),
    page.getByRole("button", { name: /^Sign In$/i }).isVisible().catch(() => false),
  ]);
  const onboardingUrl = pathnameFromPageUrl.includes("/app/onboarding");
  const loginPathOrQuery = /\/login/i.test(pageUrl);
  const likelyMarketingLessonsHub =
    pathnameFromPageUrl === "/lessons" || /^\/lessons\//.test(pathnameFromPageUrl);

  let inferredCause = "unknown";
  if (onboardingUrl) {
    inferredCause = "onboarding_route — complete onboarding or set User.onboardingCompletedAt (qa-paid-test-account-reset.mts)";
  } else if (loginPathOrQuery) {
    inferredCause = "login_url — session missing/invalid; re-run setup-paid-auth, check AUTH_SECRET matches dev server";
  } else if (likelyMarketingLessonsHub && nnLearnerMainCount === 0) {
    inferredCause =
      "marketing_public_hub — guest redirect from /app/lessons (proxy) or navigated to /lessons; need signed-in session";
  } else if (authGateCount > 0) {
    inferredCause =
      "unauthenticated_gate — layout rendered without userId (RSC auth empty); middleware should redirect to /login; check JWT/session cookie and AUTH_URL";
  } else if (marketingSurfaceCount > 0 && learnerStickyChromeCount === 0) {
    inferredCause = "marketing_chrome_without_learner_shell — likely off /app or session lost";
  } else if (learnerStickyChromeCount > 0 && nnLearnerMainCount === 0) {
    inferredCause = "partial_learner_chrome_without_main — unexpected DOM; check layout render path";
  }

  return {
    pageUrl,
    windowPathname,
    pathnameFromPageUrl,
    title,
    nnLearnerMainCount,
    authGateCount,
    learnerStickyChromeCount,
    marketingSurfaceCount,
    loginPathOrQuery,
    passwordInputCount: passwordInputs > 0,
    signInButtonVisible,
    onboardingUrl,
    likelyMarketingLessonsHub,
    inferredCause,
  };
}

async function logLearnerShellMainMissingDiagnostics(page: Page, context: string): Promise<void> {
  const d = await collectLearnerShellMainMissingDiagnostics(page);
  // eslint-disable-next-line no-console -- paid E2E deploy-gate diagnostics
  console.error(`[paid-e2e] #nn-learner-main missing (${context})`, JSON.stringify(d, null, 2));
}

async function logLearnerShellNavigationAudit(page: Page, context: string): Promise<void> {
  let pathname = "";
  try {
    pathname = new URL(page.url()).pathname;
  } catch {
    pathname = "";
  }
  const navigations = page.getByRole("navigation");
  const count = await navigations.count();
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const loc = navigations.nth(i);
    const visible = await loc.isVisible().catch(() => false);
    const label = (await loc.getAttribute("aria-label"))?.trim() || "(no aria-label)";
    parts.push(`${visible ? "visible" : "hidden"}:${label}`);
  }
  // eslint-disable-next-line no-console -- temporary deploy-gate diagnostics for learner shell mismatches
  console.error(
    `[paid-e2e] learner shell nav audit (${context}) pathname=${pathname} navigationCount=${count}`,
    parts.join(" | "),
  );
}

/**
 * Wait until the learner app chrome is interactive: `#nn-learner-main` (canonical `<main>` from
 * `(learner)/layout`) plus at least one of the desktop primary nav or mobile bottom nav
 * (viewport-dependent). Use the id so we do not depend on `document.querySelectorAll("main").length === 1`.
 */
export async function waitForAuthenticatedLearnerShell(
  page: Page,
  opts?: { timeoutMs?: number },
): Promise<void> {
  const ms = opts?.timeoutMs ?? 120_000;
  assertSyncNotOnboardingBlocking(page, "waitForAuthenticatedLearnerShell");

  const url = page.url();
  let pathname = "";
  try {
    pathname = new URL(url).pathname;
  } catch {
    pathname = "";
  }
  // eslint-disable-next-line no-console -- required shell-wait debug (user request)
  console.log("PATH:", pathname);
  // eslint-disable-next-line no-console -- required shell-wait debug (user request)
  console.log("URL:", url);

  try {
    await expect(page.locator("#nn-learner-main")).toBeVisible({ timeout: ms });
  } catch (e) {
    await logLearnerShellMainMissingDiagnostics(page, "waitForAuthenticatedLearnerShell");
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(
      `#nn-learner-main not visible after ${ms}ms. See [paid-e2e] #nn-learner-main missing log above. Original: ${msg}`,
      { cause: e },
    );
  }
  try {
    await expect(learnerShellStudyNavigation(page)).toBeVisible({ timeout: Math.min(ms, 90_000) });
  } catch (e) {
    await logLearnerShellNavigationAudit(page, "waitForAuthenticatedLearnerShell");
    throw e;
  }
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
    (await page.locator("#nn-learner-main h1").first().innerText().catch(() => null)) ??
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
