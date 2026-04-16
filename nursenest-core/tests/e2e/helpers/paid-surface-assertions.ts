import type { Page } from "@playwright/test";
import { describeAuthFailureSurface } from "./auth-diagnostics";
import { assertSyncNotOnboardingBlocking } from "./paid-durability";
import { formatLearnerShellMismatch, isLearnerShell } from "./learner-shell";

/** Premium learner surfaces should not render the freemium subscription gate heading. */
export async function expectNoSubscriptionPaywall(page: Page, context: string): Promise<void> {
  const paywall = page.getByRole("heading", { name: "Subscription required" });
  const count = await paywall.count();
  if (count > 0) {
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    throw new Error(
      `Expected paid access but found paywall (Subscription required). context=${context} ${diag}`,
    );
  }
}

/**
 * Fails if the session is on the onboarding wizard — same chrome as the learner app but wrong surface for E2E.
 * Fix data: `scripts/qa-paid-test-account-reset.mts` (paid QA) or complete onboarding manually.
 */
export async function expectNotOnAppOnboarding(page: Page, context: string): Promise<void> {
  assertSyncNotOnboardingBlocking(page, context);
}

/**
 * Sync onboarding check runs **before** any async polling (function is async for call-site parity only).
 * Onboarding uses {@link assertSyncNotOnboardingBlocking} → `onboardingBlockingFlow` classification.
 */
export async function expectOnLearnerApp(page: Page): Promise<void> {
  assertSyncNotOnboardingBlocking(page, "expectOnLearnerApp");
  const url = page.url();
  let path = "";
  try {
    path = new URL(url).pathname;
  } catch {
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    throw new Error(`Invalid page URL for learner shell check. url=${url} ${diag}`);
  }

  if (!isLearnerShell(path)) {
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    throw new Error(`${formatLearnerShellMismatch(url, path)} ${diag}`);
  }
}

/**
 * Paid subscriber E2E: must be on the in-app shell (`/app`, `/app/*`), not the public marketing lesson hub
 * (`/lessons` after guest redirect from `/app/lessons`) or other top-level marketing routes.
 */
export async function expectOnPaidSubscriberApp(page: Page): Promise<void> {
  assertSyncNotOnboardingBlocking(page, "expectOnPaidSubscriberApp");
  const url = page.url();
  let path = "";
  try {
    path = new URL(url).pathname;
  } catch {
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    throw new Error(`Invalid page URL for paid learner shell. url=${url} ${diag}`);
  }
  if (path.includes("/app/onboarding")) {
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    throw new Error(`On onboarding route — not subscriber shell. url=${url} ${diag}`);
  }
  if (path !== "/app" && !path.startsWith("/app/")) {
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    throw new Error(
      `Expected /app subscriber surface; got pathname=${path}. Often a guest redirect from /app/lessons to /lessons (session missing). url=${url} ${diag}`,
    );
  }
}
