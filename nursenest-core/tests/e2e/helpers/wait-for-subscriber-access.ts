import type { Page } from "@playwright/test";

/**
 * After Checkout returns to the app, entitlements usually require Stripe webhooks
 * (`checkout.session.completed` → `/api/subscriptions/webhook`). Local/staging must forward
 * webhooks (e.g. `stripe listen --forward-to …/api/subscriptions/webhook`).
 */
export async function waitUntilLessonsNotPaywalled(
  page: Page,
  opts?: { timeoutMs?: number; pollMs?: number },
): Promise<void> {
  const timeoutMs = opts?.timeoutMs ?? 120_000;
  const pollMs = opts?.pollMs ?? 2500;
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
    const paywall = page.getByRole("heading", { name: "Subscription required" });
    const visible = await paywall.isVisible().catch(() => false);
    if (!visible) return;
    await page.waitForTimeout(pollMs);
  }

  throw new Error(
    [
      "Timed out waiting for premium access on /app/lessons (still seeing Subscription required).",
      "Ensure Stripe test mode keys are set, webhook secret matches `stripe listen`,",
      "and `/api/subscriptions/webhook` receives `checkout.session.completed`.",
    ].join(" "),
  );
}
