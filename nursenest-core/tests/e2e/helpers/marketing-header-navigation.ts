import { expect, type Page } from "@playwright/test";
import { HEADER_CHROME } from "./country-selector";

/**
 * Ensures primary marketing header auth/navigation links are present and interactable.
 * Opens the main mobile drawer when links exist in the DOM but are hidden at the current breakpoint
 * (e.g. only available inside the hamburger on narrow viewports).
 *
 * Selectors are href/structure-based — no locale-specific copy.
 */
export async function ensureHeaderNavigationVisible(page: Page): Promise<void> {
  const shell = page.locator('[data-nn-nav-mode="public"]');
  await expect(shell).toBeVisible({ timeout: 60_000 });

  const login = shell.locator(`a[href*="/login"]`).first();
  await expect(login, "expected exactly one header login link").toHaveCount(1);

  await login.scrollIntoViewIfNeeded().catch(() => {});

  if (await login.isVisible().catch(() => false)) {
    return;
  }

  const menuOpener = page
    .locator(`${HEADER_CHROME} button:has(svg[class*="lucide-menu"])`)
    .first();

  if (await menuOpener.isVisible().catch(() => false)) {
    await menuOpener.click();
    await page
      .locator(`${HEADER_CHROME} .fixed.inset-0.z-\\[200\\]`)
      .first()
      .waitFor({ state: "visible", timeout: 15_000 })
      .catch(() => {});
  }

  await login.scrollIntoViewIfNeeded().catch(() => {});
  await expect(login).toBeVisible({ timeout: 20_000 });
}
