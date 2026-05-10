/**
 * Public marketing header: tier hubs + resources + auth CTAs on desktop (lg+)
 * and in the mobile drawer.
 *
 * Run: npx playwright test tests/e2e/public/marketing-nav-footer-theme-links.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";

const RESOURCE_LABELS = [/pricing/i, /blog/i, /faq/i, /pre[- ]?nursing/i, /tools/i] as const;
/** Matches {@link buildMarketingTierHubStrip} labels (US shows LPN/LVN; Canada shows RPN). */
const TIER_LINK_MATCHERS = [/^RN$/i, /LPN|LVN|RPN/i, /^NP$/i, /new grad/i, /^allied$/i] as const;

test.describe("Marketing nav chrome (public)", () => {
  test("desktop header exposes pricing, blog, FAQ, pre-nursing, tools, tier hubs, and auth CTAs", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1100, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.waitForTimeout(800);

    const header = page.locator("header[data-nn-nav-mode='public']");
    await expect(header).toBeVisible();

    for (const re of RESOURCE_LABELS) {
      await expect(header.getByRole("link", { name: re }).first()).toBeVisible();
    }

    for (const re of TIER_LINK_MATCHERS) {
      await expect(header.getByRole("link", { name: re }).first()).toBeVisible();
    }

    await expect(header.getByRole("link", { name: /log in/i }).first()).toBeVisible();
    await expect(header.getByRole("link", { name: /start free|sign up|signup/i }).first()).toBeVisible();
  });

  test("mobile drawer lists resources, tier hubs, and auth CTAs", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 820 });
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.waitForTimeout(600);

    await page.getByRole("button", { name: /open menu|menu/i }).first().click();
    const drawer = page.locator(".nn-header-overlay-mobile-only");
    await expect(drawer).toBeVisible();

    for (const re of RESOURCE_LABELS) {
      await expect(drawer.getByRole("link", { name: re }).first()).toBeVisible();
    }

    for (const re of TIER_LINK_MATCHERS) {
      await expect(drawer.getByRole("link", { name: re }).first()).toBeVisible();
    }

    await expect(drawer.getByRole("link", { name: /log in/i }).first()).toBeVisible();
    await expect(drawer.getByRole("link", { name: /start free|sign up|signup/i }).first()).toBeVisible();
  });
});
