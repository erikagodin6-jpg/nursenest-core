import { expect, type Locator, type Page } from "@playwright/test";
import type { PageObservers } from "./attach-observers";
import { learnerShellStudyNavigation } from "./learner-shell-locators";
import {
  assertNoAuthSessionBlockingBeforeShell,
  assertSyncNotOnboardingBlocking,
  markLearnerShellReady,
} from "./paid-durability";
import { expectOnPaidSubscriberApp } from "./paid-surface-assertions";

/**
 * Default pathway for US RN paid E2E — align with `scripts/qa-paid-test-account-reset.mts`
 * (`resolveDefaultPathwayIdForOnboarding("rn", US)` → `us-rn-nclex-rn`).
 */
export const PAID_E2E_DEFAULT_PATHWAY_ID = "us-rn-nclex-rn";

/**
 * Canonical learner `<main>` from `(learner)/layout` — prefer `#nn-learner-main`, then `data-nn-learner-main`,
 * then the single `main` under `.nn-learner-app` (covers older deploys where `id` was missing from SSR HTML).
 */
export function learnerAppMainLandmark(page: Page): Locator {
  return page
    .locator("#nn-learner-main")
    .or(page.locator("[data-nn-learner-main]"))
    .or(page.locator(".nn-learner-app main").first());
}

/** Snapshot when `#nn-learner-main` is missing — auth redirect, onboarding, marketing guest hub, or auth gate. */
export type LearnerShellMainMissingDiagnostics = {
  pageUrl: string;
  windowPathname: string;
  pathnameFromPageUrl: string;
  title: string;
  /** Total `<main>` in document (nested marketing + learner mains break generic `main` locators). */
  documentMainCount: number;
  nnLearnerMainCount: number;
  authGateCount: number;
  learnerStickyChromeCount: number;
  marketingSurfaceCount: number;
  loginPathOrQuery: boolean;
  /** True if any password field exists in the DOM (login form). */
  hasPasswordInput: boolean;
  signInButtonVisible: boolean;
  onboardingUrl: boolean;
  likelyMarketingLessonsHub: boolean;
  inferredCause: string;
};

export async function collectLearnerShellMainMissingDiagnostics(
  page: Page,
): Promise<LearnerShellMainMissingDiagnostics> {
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
    documentMainCount,
    nnLearnerMainCount,
    authGateCount,
    learnerStickyChromeCount,
    marketingSurfaceCount,
    passwordInputs,
    signInButtonVisible,
  ] = await Promise.all([
    page.locator("main").count(),
    learnerAppMainLandmark(page).count(),
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
    documentMainCount,
    nnLearnerMainCount,
    authGateCount,
    learnerStickyChromeCount,
    marketingSurfaceCount,
    loginPathOrQuery,
    hasPasswordInput: passwordInputs > 0,
    signInButtonVisible,
    onboardingUrl,
    likelyMarketingLessonsHub,
    inferredCause,
  };
}

/** Full contract snapshot when learner shell wait fails (URL, pathname, main landmark, study nav, role=navigation audit, inferred cause). */
async function logLearnerShellContractFailure(page: Page, context: string): Promise<void> {
  let pageUrl = "";
  let pathname = "";
  try {
    pageUrl = page.url();
    pathname = new URL(pageUrl).pathname;
  } catch {
    pageUrl = "";
  }

  let nnLearnerMainCount = 0;
  let nnLearnerMainVisible = false;
  let documentMainCount = 0;
  let studyNavMarkedTotal = 0;
  let studyNavVisibleCount = 0;
  try {
    const mainLoc = learnerAppMainLandmark(page);
    nnLearnerMainCount = await mainLoc.count();
    nnLearnerMainVisible =
      nnLearnerMainCount > 0 ? await mainLoc.first().isVisible().catch(() => false) : false;
    [documentMainCount, studyNavMarkedTotal, studyNavVisibleCount] = await Promise.all([
      page.locator("main").count(),
      page.locator("[data-nn-learner-shell-study-nav]").count(),
      page.locator("[data-nn-learner-shell-study-nav]").filter({ visible: true }).count(),
    ]);
  } catch {
    /* page may be closed */
  }

  const navigationLandmarks: string[] = [];
  try {
    const navigations = page.getByRole("navigation");
    const count = await navigations.count();
    for (let i = 0; i < count; i++) {
      const loc = navigations.nth(i);
      const visible = await loc.isVisible().catch(() => false);
      const label = (await loc.getAttribute("aria-label"))?.trim() || "(no aria-label)";
      navigationLandmarks.push(`${visible ? "visible" : "hidden"}:aria-label=${label}`);
    }
  } catch (e) {
    navigationLandmarks.push(
      `(navigation enumeration failed: ${e instanceof Error ? e.message : String(e)})`,
    );
  }

  const inferred = await collectLearnerShellMainMissingDiagnostics(page);

  // eslint-disable-next-line no-console -- paid E2E deploy-gate diagnostics
  console.error(
    `[paid-e2e] learner shell contract failure (${context})`,
    JSON.stringify(
      {
        pageUrl,
        pathname,
        nnLearnerMainExists: nnLearnerMainCount > 0,
        nnLearnerMainVisible,
        nnLearnerMainCount,
        documentMainCount,
        studyNavMarkedTotal,
        studyNavVisibleCount,
        navigationLandmarks,
        inferred,
      },
      null,
      2,
    ),
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

  try {
    await expect(learnerAppMainLandmark(page)).toBeVisible({ timeout: ms });
  } catch (e) {
    await logLearnerShellContractFailure(page, "waitForAuthenticatedLearnerShell#main");
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(
      `Learner app main landmark not visible after ${ms}ms (#nn-learner-main, [data-nn-learner-main], or .nn-learner-app main). See [paid-e2e] learner shell contract failure log above. Original: ${msg}`,
      { cause: e },
    );
  }
  try {
    await expect(learnerShellStudyNavigation(page)).toBeVisible({ timeout: Math.min(ms, 90_000) });
  } catch (e) {
    await logLearnerShellContractFailure(page, "waitForAuthenticatedLearnerShell#nav");
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
  await expectOnPaidSubscriberApp(page);
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
    (await learnerAppMainLandmark(page).locator("h1").first().innerText().catch(() => null)) ??
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
