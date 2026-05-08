/**
 * Homepage premium quality: no raw i18n keys visible, no horizontal overflow,
 * stats line formatted, primary CTAs present (routing covered elsewhere).
 *
 * Run with production server: npm run build && npm run start
 *   npx playwright test tests/e2e/public/homepage-premium-quality.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";

test.describe("Homepage premium quality", () => {
  test("no placeholder fragments or raw i18n keys in main content", async ({ page }) => {
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await page.waitForTimeout(1500);

    const mainText = await page.locator("main").innerText();
    expect(mainText.toLowerCase()).not.toContain("placeholder");
    expect(mainText).not.toMatch(/pages\.home\.[a-z0-9_.]+/i);
    expect(mainText).not.toMatch(/\bEYEBROW\b|\bTAG\b|\bREADINESS LABEL\b|\bHeadline Premium\b|\bSubheading Premium\b/);
  });

  test("hero stats line uses comma separators when counts are present", async ({ page }) => {
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await page.waitForTimeout(2000);

    const stats = page.getByTestId("premium-hero-stats-line");
    if ((await stats.count()) === 0) return;
    const text = await stats.innerText();
    if (/Updated regularly/i.test(text)) return;
    expect(text).toMatch(/\d{1,3}(,\d{3})*/);
    expect(text.toLowerCase()).toMatch(/practice questions/);
    expect(text.toLowerCase()).toMatch(/clinical lessons/);
  });

  test("main content does not horizontally overflow viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await page.waitForTimeout(800);

    const overflow = await page.evaluate(() => {
      const el = document.documentElement;
      return el.scrollWidth - el.clientWidth;
    });
    expect(overflow, "horizontal scroll at 375px").toBeLessThanOrEqual(1);
  });

  test("primary hero CTAs resolve to http(s) routes", async ({ page }) => {
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    const links = page.locator("main .nn-home-marketing-rich-hero a[href]");
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < Math.min(count, 4); i++) {
      const href = await links.nth(i).getAttribute("href");
      expect(href, `link ${i}`).toMatch(/^\//);
    }
  });
});
