/**
 * Public nursing exam hubs — premium module grid (study tools, readiness, optional new-grad section).
 *
 * Run: `cd nursenest-core && npx playwright test tests/e2e/public/nursing-tier-hub-premium-modules-smoke.spec.ts`
 */
import { expect, test } from "@playwright/test";
import { seedCaMarketingCookie, seedUsMarketingCookie } from "../helpers/navigation-e2e";

const PREMIUM_ZONE = '[data-nn-qa-pathway-premium-modules=""]';

test.describe("Nursing tier hub — premium modules smoke", () => {
  test("US RN — ECG marker present in premium modules", async ({ page, baseURL }) => {
    test.skip(!baseURL, "BASE_URL required");
    await seedUsMarketingCookie(page, baseURL!);
    await page.goto(`${baseURL}/us/rn/nclex-rn`);
    await expect(page.locator(PREMIUM_ZONE)).toBeVisible({ timeout: 60_000 });
    await expect(page.locator(`${PREMIUM_ZONE} [data-nn-qa-hub-ecg="1"]`)).toHaveCount(1);
    await expect(page.getByText(/Study tools/i).first()).toBeVisible();
    await expect(page.getByText(/Readiness & progress/i).first()).toBeVisible();
  });

  test("Canada RPN — no ECG marker in premium modules", async ({ page, baseURL }) => {
    test.skip(!baseURL, "BASE_URL required");
    await seedCaMarketingCookie(page, baseURL);
    await page.goto(`${baseURL}/canada/pn/rex-pn`);
    await expect(page.locator(PREMIUM_ZONE)).toBeVisible({ timeout: 60_000 });
    await expect(page.locator(`${PREMIUM_ZONE} [data-nn-qa-hub-ecg]`)).toHaveCount(0);
  });

  test("US NP — NP clinical cases QA marker", async ({ page, baseURL }) => {
    test.skip(!baseURL, "BASE_URL required");
    await seedUsMarketingCookie(page, baseURL!);
    await page.goto(`${baseURL}/us/np/fnp`);
    await expect(page.locator(PREMIUM_ZONE)).toBeVisible({ timeout: 60_000 });
    await expect(page.locator(`${PREMIUM_ZONE} [data-nn-qa-hub-np-cases="1"]`)).toHaveCount(1);
    await expect(page.locator(`${PREMIUM_ZONE} [data-nn-qa-hub-ecg="1"]`)).toHaveCount(1);
  });

  test("US New Grad — transition section heading + no ECG", async ({ page, baseURL }) => {
    test.skip(!baseURL, "BASE_URL required");
    await seedUsMarketingCookie(page, baseURL!);
    await page.goto(`${baseURL}/us/rn/new-grad-transition`);
    await expect(page.locator(PREMIUM_ZONE)).toBeVisible({ timeout: 60_000 });
    await expect(page.getByText(/New graduate transition/i).first()).toBeVisible();
    await expect(page.locator(`${PREMIUM_ZONE} [data-nn-qa-hub-ecg]`)).toHaveCount(0);
  });

  test("Guest hubs — no admin links in premium module zone", async ({ page, baseURL }) => {
    test.skip(!baseURL, "BASE_URL required");
    await seedUsMarketingCookie(page, baseURL!);
    await page.goto(`${baseURL}/us/rn/nclex-rn`);
    const zone = page.locator(PREMIUM_ZONE);
    await expect(zone).toBeVisible({ timeout: 60_000 });
    await expect(zone.locator('a[href*="/admin"]')).toHaveCount(0);
    const html = await zone.innerHTML();
    expect(html.toLowerCase().includes("/admin")).toBe(false);
  });

  test("Light / dark theme attribute — premium zone still visible", async ({ page, baseURL }) => {
    test.skip(!baseURL, "BASE_URL required");
    await seedUsMarketingCookie(page, baseURL!);
    await page.goto(`${baseURL}/us/rn/nclex-rn`);
    await expect(page.locator(PREMIUM_ZONE)).toBeVisible({ timeout: 60_000 });
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "midnight");
    });
    await expect(page.locator(PREMIUM_ZONE)).toBeVisible();
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "ocean");
    });
    await expect(page.locator(PREMIUM_ZONE)).toBeVisible();
  });
});
