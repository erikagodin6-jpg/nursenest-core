/**
 * Minimal mobile shell: hamburger opens and closes (matches critical nav journey).
 */
import { expect, test } from "@playwright/test";
import { MARKETING_PUBLIC_SELECTOR } from "../helpers/navigation-e2e";

test.describe("Smoke — mobile marketing nav", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("hamburger opens and closes", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR).first()).toBeVisible({ timeout: 60_000 });

    await page.getByRole("button", { name: /^Open menu$/ }).click();
    const closeMenu = page.getByRole("button", { name: /^Close menu$/ });
    await expect(closeMenu.last()).toBeVisible({ timeout: 15_000 });
    await closeMenu.last().click();
    await expect(closeMenu).toHaveCount(0);
  });
});
