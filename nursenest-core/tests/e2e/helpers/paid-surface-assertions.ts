import { expect, type Page } from "@playwright/test";

/** Premium learner surfaces should not render the freemium subscription gate heading. */
export async function expectNoSubscriptionPaywall(page: Page, context: string): Promise<void> {
  const paywall = page.getByRole("heading", { name: "Subscription required" });
  const count = await paywall.count();
  if (count > 0) {
    throw new Error(`Entitlement mismatch on ${context}: expected premium access, found Subscription required paywall.`);
  }
}

export async function expectOnLearnerApp(page: Page): Promise<void> {
  const url = page.url();
  if (/\/login/i.test(url)) {
    throw new Error("Redirected to /login — session missing or seeded paid credentials invalid for BASE_URL.");
  }
  await expect(page).toHaveURL(/\/app(\/|$)/);
}
