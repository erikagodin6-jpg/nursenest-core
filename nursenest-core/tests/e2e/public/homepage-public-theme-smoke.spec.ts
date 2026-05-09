/**
 * Public marketing homepage: theme picker lists Ocean, Midnight, Blossom and each applies `data-theme`.
 *
 * Run with app on BASE_URL:
 *   npx playwright test tests/e2e/public/homepage-public-theme-smoke.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";

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

test.describe("Homepage public theme smoke", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("cycles Ocean → Midnight → Blossom via Theme picker", async ({ page }) => {
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);

    await expect(page.locator('[data-nn-nav-mode="public"]').first()).toBeVisible({ timeout: 60_000 });

    const themeButton = page.getByRole("button", { name: /^Theme\b/i }).first();
    await expect(themeButton).toBeVisible({ timeout: 30_000 });

    const sequence = [
      { label: /Ocean/i, id: "ocean" },
      { label: /Midnight/i, id: "midnight" },
      { label: /Blossom/i, id: "blossom" },
    ] as const;

    for (const step of sequence) {
      await themeButton.click();
      await expect(page.getByRole("listbox")).toBeVisible({ timeout: 5000 });
      await page.getByRole("option", { name: step.label }).first().click();
      await page.waitForTimeout(150);
      const dataTheme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
      expect(dataTheme, `expected data-theme=${step.id}`).toBe(step.id);
    }
  });
});
