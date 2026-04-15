import type { Page } from "@playwright/test";
import { assertSyncNotOnboardingBlocking } from "./paid-durability";
import { isLearnerShell, LEARNER_SHELL_PATH_EXPECTATION } from "./learner-login";

/** Premium learner surfaces should not render the freemium subscription gate heading. */
export async function expectNoSubscriptionPaywall(page: Page, context: string): Promise<void> {
  const paywall = page.getByRole("heading", { name: "Subscription required" });
  const count = await paywall.count();
  if (count > 0) {
    throw new Error(`Entitlement mismatch on ${context}: expected premium access, found Subscription required paywall.`);
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
  if (/\/login/i.test(url)) {
    throw new Error("Redirected to /login — session missing or seeded paid credentials invalid for BASE_URL.");
  }
  const path = new URL(url).pathname;

  if (!isLearnerShell(path)) {
    throw new Error(
      `Not on learner shell. url=${url} pathname=${path}. Expected: ${LEARNER_SHELL_PATH_EXPECTATION}`,
    );
  }
}
