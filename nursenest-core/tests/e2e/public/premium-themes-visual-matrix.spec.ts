/**
 * Visual regression matrix: Ocean, Midnight, Aurora, Sunset on marketing homepage.
 * Screenshots → test-results/theme-matrix/ (gitignored by default).
 *
 *   npx playwright test tests/e2e/public/premium-themes-visual-matrix.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import { themeOptionsForPublicMarketingPicker } from "@/lib/theme/theme-registry";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";

test.beforeEach(async ({ context }) => {
  await context.addInitScript((key: string) => {
    try {
      localStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
  }, SELECTOR_DISMISSED_LS);
});

test.describe("Premium themes visual matrix (public homepage)", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  for (const opt of themeOptionsForPublicMarketingPicker()) {
    test(`homepage — ${opt.id} nav contrast + hero`, async ({ page }) => {
      await page.goto("/", { waitUntil: "load", timeout: 120_000 });
      await dismissMarketingScrims(page);
      await expect(page.locator('[data-nn-nav-mode="public"]').first()).toBeVisible({ timeout: 60_000 });

      const themeButton = page.getByRole("button", { name: /^Theme\b/i }).first();
      await themeButton.click();
      await page.getByRole("option", { name: new RegExp(`^${opt.label}`, "i") }).first().click();
      await page.waitForTimeout(200);

      await expect(page.locator("html")).toHaveAttribute("data-theme", opt.id);

      const { navBg, navFg, ratioHint } = await page.evaluate(() => {
        const root = document.documentElement;
        const cs = getComputedStyle(root);
        const navBg = cs.getPropertyValue("--nav-bg").trim() || cs.getPropertyValue("--nn-nav-bg").trim();
        const navFg = cs.getPropertyValue("--nav-fg").trim() || cs.getPropertyValue("--nn-nav-fg").trim();
        return { navBg, navFg, ratioHint: `${navBg} / ${navFg}` };
      });
      expect(navBg.length, `${opt.id} --nav-bg`).toBeGreaterThan(3);
      expect(navFg.length, `${opt.id} --nav-fg`).toBeGreaterThan(3);
      expect(navFg, `${opt.id}: nav fg not transparent (${ratioHint})`).not.toMatch(/^transparent$/i);

      await page.screenshot({
        path: `test-results/theme-matrix/home-${opt.id}-1280.png`,
        fullPage: false,
      });
    });
  }

  test("mobile viewport — Sunset", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);
    const themeButton = page.getByRole("button", { name: /^Theme\b/i }).first();
    await themeButton.click();
    await page.getByRole("option", { name: /^Sunset/i }).first().click();
    await page.waitForTimeout(200);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "sunset");
    await page.screenshot({ path: "test-results/theme-matrix/home-sunset-390.png", fullPage: false });
  });
});
