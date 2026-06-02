import { expect, test } from "@playwright/test";

test.describe("revenue reliability recovery surfaces", () => {
  test("checkout success reconciliation endpoint rejects anonymous visitors without 500", async ({ request }) => {
    const response = await request.post("/api/subscriptions/sync-after-checkout");
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.code).toBe("UNAUTHORIZED");
  });

  test("checkout success banner calls billing sync before session sync", async ({ page, context, baseURL }) => {
    const authCookie = process.env.QA_AUTH_COOKIE?.trim();
    test.skip(!authCookie || !baseURL, "Requires QA_AUTH_COOKIE for protected /app shell");
    const origin = new URL(baseURL);
    await context.addCookies([
      {
        name: origin.protocol === "https:" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
        value: authCookie!,
        domain: origin.hostname,
        path: "/",
        httpOnly: true,
        secure: origin.protocol === "https:",
        sameSite: "Lax",
      },
    ]);
    const calls: string[] = [];

    await page.route("**/api/subscriptions/sync-after-checkout", async (route) => {
      calls.push("billing");
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          recovered: true,
          recoveryReason: "stripe_subscription_reconciled",
          entitlement: { hasAccess: true, reason: "active_subscription", tier: "RN", country: "US" },
          plan: { status: "active", planCode: "us_rn_monthly", expiresAt: null, cancelAtPeriodEnd: false },
        }),
      });
    });

    await page.route("**/api/auth/sync-session", async (route) => {
      calls.push("session");
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ tier: "RN", country: "US", subscriptionStatus: "active", role: "LEARNER" }),
      });
    });

    await page.goto("/app?checkout=success", { waitUntil: "domcontentloaded" });
    await expect.poll(() => calls.join(">")).toContain("billing>session");
  });
});
