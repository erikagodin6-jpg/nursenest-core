import { expect, test } from "@playwright/test";

const visualRoutes = [
  { id: "login", path: "/login" },
  { id: "practice-exams", path: "/practice-exams" },
  { id: "rn-cat-entrypoint", path: "/us/rn/nclex-rn/cat" },
] as const;

const visualThemes = ["ocean", "rose", "midnight"] as const;

test.describe("runtime visual regression capture", () => {
  for (const theme of visualThemes) {
    for (const route of visualRoutes) {
      test(`${route.id} ${theme}`, async ({ page }) => {
        await page.addInitScript((themeId) => {
          localStorage.setItem("nursenest-theme", themeId);
          document.cookie = `nn-theme=${themeId}; path=/; max-age=31536000; SameSite=Lax`;
        }, theme);
        await page.goto(route.path, { waitUntil: "networkidle" });
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme, { timeout: 15_000 });
        await expect(page.locator("body")).not.toBeEmpty({ timeout: 15_000 });
        await expect(page).toHaveScreenshot(`${route.id}-${theme}.png`, {
          fullPage: true,
          maxDiffPixelRatio: 0.02,
        });
      });
    }
  }
});
