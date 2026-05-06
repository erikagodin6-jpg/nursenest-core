/**
 * Theme picker: every registered theme updates document CSS variables used by marketing chrome
 * (nav / header bands / page background), not only accent/logo.
 */
import { expect, test } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import { THEME_OPTIONS } from "@/lib/theme/theme-registry";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";

test.beforeEach(async ({ context }) => {
  await context.addInitScript((key: string) => {
    try {
      localStorage.setItem(key, "1");
    } catch {
      /* private mode */
    }
  }, SELECTOR_DISMISSED_LS);
});

test.describe("Marketing theme chrome (public)", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("home — each theme shifts nav + page CSS variables", async ({ page }) => {
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);

    const shell = page.locator('[data-nn-nav-mode="public"]').first();
    await expect(shell).toBeVisible({ timeout: 60_000 });

    const themeButton = page.getByRole("button", { name: /theme/i }).first();
    await expect(themeButton).toBeVisible({ timeout: 30_000 });

    const samples: { id: string; navBg: string; pageBg: string }[] = [];

    for (const opt of THEME_OPTIONS) {
      await themeButton.click();
      await page.getByRole("option", { name: opt.label }).click();
      await page.waitForTimeout(150);

      const { navBg, pageBg, navFg, dataTheme } = await page.evaluate(() => {
        const root = document.documentElement;
        const cs = getComputedStyle(root);
        return {
          navBg: cs.getPropertyValue("--nav-bg").trim(),
          pageBg: cs.getPropertyValue("--bg-page").trim() || cs.getPropertyValue("--background").trim(),
          navFg: cs.getPropertyValue("--nav-fg").trim(),
          dataTheme: root.getAttribute("data-theme") ?? "",
        };
      });

      expect(dataTheme, `data-theme should switch to ${opt.id}`).toBe(opt.id);
      expect(navBg.length, `${opt.id}: --nav-bg`).toBeGreaterThan(3);
      expect(pageBg.length, `${opt.id}: page background`).toBeGreaterThan(3);
      expect(navFg.length, `${opt.id}: --nav-fg`).toBeGreaterThan(0);
      expect(navFg, `${opt.id}: nav foreground must not be transparent`).not.toMatch(/^transparent$/i);

      samples.push({ id: opt.id, navBg, pageBg });
    }

    const ocean = samples.find((s) => s.id === "ocean");
    const dark = samples.find((s) => s.id === "dark-clinical");
    expect(ocean && dark, "sanity: sampled ocean + dark-clinical").toBeTruthy();
    const paletteDiffers = ocean!.navBg !== dark!.navBg || ocean!.pageBg !== dark!.pageBg;
    expect(paletteDiffers).toBe(true);
  });

  test("pricing — header rows visible under theme rotation sample", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);
    await expect(page.locator('[data-nn-nav-mode="public"]').first()).toBeVisible({ timeout: 60_000 });

    const sample = ["ocean", "dark-clinical", "blossom"] as const;
    const themeButton = page.getByRole("button", { name: /theme/i }).first();
    for (const id of sample) {
      const opt = THEME_OPTIONS.find((o) => o.id === id);
      if (!opt) throw new Error(`missing theme ${id}`);
      await themeButton.click();
      await page.getByRole("option", { name: opt.label }).click();
      await page.waitForTimeout(120);
      const dataTheme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
      expect(dataTheme).toBe(id);
    }
  });
});
