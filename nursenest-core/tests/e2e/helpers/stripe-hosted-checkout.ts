import type { Page } from "@playwright/test";

/**
 * Complete Stripe **test mode** Checkout (hosted page on checkout.stripe.com).
 * Uses card 4242 — no real charges when the Stripe account is in test mode.
 *
 * Stripe’s DOM changes occasionally; this tries several iframe + a11y strategies.
 */
export async function completeStripeHostedCheckoutTestCard(page: Page, opts: { customerEmail: string }): Promise<void> {
  await page.waitForURL(/https:\/\/checkout\.stripe\.com\//, { timeout: 180_000 });

  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(800);

  const email = page.locator('input[type="email"], input[name="email"], input[id*="email"]').first();
  if (await email.isVisible({ timeout: 8000 }).catch(() => false)) {
    await email.fill(opts.customerEmail);
  }

  async function tryFillCardFields(): Promise<boolean> {
    const cardByLabel = page.getByLabel(/^Card number|^Number$/i).first();
    if (await cardByLabel.isVisible({ timeout: 1500 }).catch(() => false)) {
      await cardByLabel.fill("4242424242424242");
      const exp = page.getByLabel(/expiration|expiry|mm\s*\/\s*yy/i).first();
      if (await exp.isVisible({ timeout: 2000 }).catch(() => false)) {
        await exp.fill("12/34");
      }
      const cvc = page.getByLabel(/^CVC|^CVV|^Security code$/i).first();
      if (await cvc.isVisible({ timeout: 2000 }).catch(() => false)) {
        await cvc.fill("123");
      }
      const zip = page.getByLabel(/ZIP|postal/i).first();
      if (await zip.isVisible({ timeout: 2000 }).catch(() => false)) {
        await zip.fill("94107");
      }
      return true;
    }

    const placeholderCard = page.getByPlaceholder(/1234\s+1234\s+1234\s+1234/i).first();
    if (await placeholderCard.isVisible({ timeout: 1500 }).catch(() => false)) {
      await placeholderCard.fill("4242424242424242");
      const expPh = page.getByPlaceholder(/MM\s*\/\s*YY/i).first();
      if (await expPh.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expPh.fill("12/34");
      }
      const cvcPh = page.getByPlaceholder(/CVC/i).first();
      if (await cvcPh.isVisible({ timeout: 2000 }).catch(() => false)) {
        await cvcPh.fill("123");
      }
      return true;
    }

    const frames = page.frames().filter((f) => /stripe\.com|stripejs|elements-inner/i.test(f.url()));
    for (const fr of frames) {
      const n = fr.locator(
        'input[name="cardnumber"], input[name="cardNumber"], input[autocomplete="cc-number"], input[data-elements-stable-field-name="cardNumber"]',
      ).first();
      if (await n.isVisible({ timeout: 800 }).catch(() => false)) {
        await n.fill("4242424242424242");
        const exp = fr.locator(
          'input[name="exp-date"], input[name="exp"], input[autocomplete="cc-exp"], input[data-elements-stable-field-name="cardExpiry"]',
        ).first();
        if (await exp.isVisible({ timeout: 1500 }).catch(() => false)) {
          await exp.fill("12 / 34");
        }
        const cvc = fr
          .locator('input[name="cvc"], input[autocomplete="cc-csc"], input[data-elements-stable-field-name="cardCvc"]')
          .first();
        if (await cvc.isVisible({ timeout: 1500 }).catch(() => false)) {
          await cvc.fill("123");
        }
        const zip = fr.locator('input[name="postal"], input[autocomplete="postal-code"]').first();
        if (await zip.isVisible({ timeout: 1500 }).catch(() => false)) {
          await zip.fill("94107");
        }
        return true;
      }
    }

    return false;
  }

  for (let i = 0; i < 45; i++) {
    if (await tryFillCardFields()) break;
    await page.waitForTimeout(400);
    if (i === 44) {
      throw new Error(
        "Could not find Stripe card fields on checkout.stripe.com — update stripe-hosted-checkout.ts selectors.",
      );
    }
  }

  const pay = page.getByRole("button", {
    name: /subscribe|pay|start trial|complete|continue|submit payment/i,
  });
  await pay.first().click({ timeout: 60_000 });

  await page.waitForURL((url) => !url.href.includes("checkout.stripe.com"), { timeout: 180_000 });
}
