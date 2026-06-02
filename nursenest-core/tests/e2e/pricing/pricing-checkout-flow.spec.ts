import { expect, test, type Page } from "@playwright/test";

const CHECKOUT_URL = "https://checkout.stripe.com/c/pay/cs_test_nursenest_mock";

type CheckoutCase = {
  name: string;
  segment: RegExp;
  segmentId: "rn" | "pn" | "np";
  duration: "monthly" | "yearly";
  expectedTier: string | RegExp;
};

const CHECKOUT_CASES: CheckoutCase[] = [
  {
    name: "monthly checkout",
    segment: /RN\s*\/\s*NCLEX-RN/i,
    segmentId: "rn",
    duration: "monthly",
    expectedTier: "RN",
  },
  {
    name: "yearly checkout",
    segment: /RN\s*\/\s*NCLEX-RN/i,
    segmentId: "rn",
    duration: "yearly",
    expectedTier: "RN",
  },
  {
    name: "RN checkout",
    segment: /RN\s*\/\s*NCLEX-RN/i,
    segmentId: "rn",
    duration: "monthly",
    expectedTier: "RN",
  },
  {
    name: "PN checkout",
    segment: /PN/i,
    segmentId: "pn",
    duration: "monthly",
    expectedTier: /RPN|LVN_LPN/,
  },
  {
    name: "NP checkout",
    segment: /^NP$/i,
    segmentId: "np",
    duration: "monthly",
    expectedTier: "NP",
  },
];

async function mockAuthenticatedCheckout(page: Page, requests: unknown[]) {
  await page.route("**/api/auth/session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user: {
          id: "test-pricing-checkout-user",
          email: "checkout@example.com",
          name: "Checkout Tester",
        },
        expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      }),
    });
  });

  await page.route("**/api/subscriptions/checkout", async (route) => {
    const payload = route.request().postDataJSON();
    requests.push(payload);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        url: CHECKOUT_URL,
        sessionId: "cs_test_nursenest_mock",
      }),
    });
  });

  await page.route("https://checkout.stripe.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<!doctype html><title>Stripe Checkout</title><main>Stripe Checkout</main>",
    });
  });
}

test.describe("Pricing checkout flow", () => {
  test.skip(
    !process.env.E2E_PRICING_CHECKOUT_FLOW_ENABLED,
    "Set E2E_PRICING_CHECKOUT_FLOW_ENABLED=1 when pricing Stripe plans are configured in the test runtime.",
  );

  for (const c of CHECKOUT_CASES) {
    test(`${c.name} creates a checkout session and redirects`, async ({
      page,
    }) => {
      const requests: unknown[] = [];
      await mockAuthenticatedCheckout(page, requests);

      const response = await page.goto("/pricing", {
        waitUntil: "domcontentloaded",
      });
      expect(response?.ok()).toBeTruthy();

      await expect(page.getByRole("button", { name: c.segment })).toBeVisible();
      const segmentButton = page.getByTestId(`pricing-segment-${c.segmentId}`);
      await expect(segmentButton).toBeEnabled();
      await segmentButton.click();
      await expect(segmentButton).toHaveAttribute("data-active", "true");

      const checkoutButton = page.getByTestId(`pricing-checkout-${c.duration}`);
      await expect(checkoutButton).toBeVisible({ timeout: 60_000 });
      await expect(checkoutButton).toBeEnabled();
      await checkoutButton.click();

      const modal = page.locator(".nn-pricing-consent-modal");
      await expect(modal).toBeVisible();
      const checkboxes = await modal.locator('input[type="checkbox"]').all();
      for (const checkbox of checkboxes) {
        await checkbox.check();
      }

      const continueButton = modal.getByRole("button", {
        name: /Continue to secure checkout|Continue to North America Checkout/i,
      });
      await continueButton.click();

      await page.waitForURL(
        /checkout\.stripe\.com\/c\/pay\/cs_test_nursenest_mock/,
      );
      expect(page.url()).toContain("checkout.stripe.com");
      expect(requests).toHaveLength(1);
      const payload = requests[0] as {
        tier?: unknown;
        duration?: unknown;
        acceptPolicies?: unknown;
      };
      if (c.expectedTier instanceof RegExp) {
        expect(String(payload.tier)).toMatch(c.expectedTier);
      } else {
        expect(payload.tier).toBe(c.expectedTier);
      }
      expect(payload.duration).toBe(c.duration);
      expect(payload.acceptPolicies).toBe(true);
    });
  }
});
