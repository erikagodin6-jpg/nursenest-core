/**
 * Smoke checks for premium branded loading shell (`data-nn-premium-loader`).
 *
 * Limits: the loader only mounts during segment transitions; a cold `/` load may never
 * paint it. We assert it does not remain stuck after navigation settles and that the
 * marketing homepage fits a mobile viewport without horizontal overflow.
 *
 * Run (from `nursenest-core/` with dev server or `BASE_URL`):
 *   npx playwright test tests/e2e/public/branded-loader-smoke.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";

test.describe("Branded premium loader", () => {
  test("homepage settles without a stuck premium loader shell", async ({ page }) => {
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await page.waitForTimeout(2000);
    await expect(page.locator("[data-nn-premium-loader]")).toHaveCount(0);
  });

  test("mobile 375: homepage fits viewport width (no horizontal scroll)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    const overflow = await page.evaluate(() => {
      const el = document.documentElement;
      return Math.max(0, el.scrollWidth - el.clientWidth);
    });
    expect(overflow, `horizontal overflow ${overflow}px`).toBeLessThanOrEqual(8);
  });
});
