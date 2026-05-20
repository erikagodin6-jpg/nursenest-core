import type { Page } from "@playwright/test";
import { describeAuthFailureSurface } from "./auth-diagnostics";
import { assertSyncNotOnboardingBlocking } from "./paid-durability";
import { isLearnerShell } from "./learner-shell";

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
  let pathname = "";
  try {
    pathname = new URL(url).pathname;
  } catch {
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    throw new Error(`Invalid page URL for learner shell check. url=${url} ${diag}`);
  }

  if (!isLearnerShell(pathname)) {
    throw new Error(`Not on learner shell. url=${url} pathname=${pathname}`);
  }
}

/**
 * Paid subscriber E2E: must be on a learner-shell pathname (see {@link isLearnerShell}), not auth/marketing-only routes.
 */
export async function expectOnPaidSubscriberApp(page: Page): Promise<void> {
  assertSyncNotOnboardingBlocking(page, "expectOnPaidSubscriberApp");
  const url = page.url();
  let pathname = "";
  try {
    pathname = new URL(url).pathname;
  } catch {
    const diag = await describeAuthFailureSurface(page).catch(() => "");
    throw new Error(`Invalid page URL for paid learner shell. url=${url} ${diag}`);
  }
  if (!isLearnerShell(pathname)) {
    throw new Error(`Not on learner shell. url=${url} pathname=${pathname}`);
  }
}
