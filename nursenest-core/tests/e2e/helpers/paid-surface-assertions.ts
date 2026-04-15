import { expect, type Page } from "@playwright/test";
import { isLearnerAppShellPath } from "./learner-login";

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
  const path = new URL(page.url()).pathname;
  if (path === "/app/onboarding" || path.startsWith("/app/onboarding/")) {
    throw new Error(
      `${context}: unexpected /app/onboarding — E2E account should have User.onboardingCompletedAt set. Run scripts/qa-paid-test-account-reset.mts against this environment's DATABASE_URL for the paid E2E email.`,
    );
  }
}

export async function expectOnLearnerApp(page: Page): Promise<void> {
  const url = page.url();
  if (/\/login/i.test(url)) {
    throw new Error("Redirected to /login — session missing or seeded paid credentials invalid for BASE_URL.");
  }
  const path = new URL(url).pathname;
  if (!isLearnerAppShellPath(path)) {
    if (path === "/app/onboarding" || path.startsWith("/app/onboarding/")) {
      throw new Error(
        "On /app/onboarding — complete onboarding or run scripts/qa-paid-test-account-reset.mts for the paid E2E user (sets onboardingCompletedAt).",
      );
    }
    throw new Error(`Not on learner shell: ${path}`);
  }
  await expect(page).toHaveURL(/\/app(\/|$)/);
}
