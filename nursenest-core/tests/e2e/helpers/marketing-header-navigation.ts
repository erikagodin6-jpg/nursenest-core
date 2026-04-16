import { expect, type Page } from "@playwright/test";
import { HEADER_CHROME } from "./country-selector";

async function openMainMobileDrawerIfPresent(page: Page): Promise<boolean> {
  const menuOpener = page.locator(`${HEADER_CHROME} button:has(svg[class*="lucide-menu"])`).first();
  if (await menuOpener.isVisible().catch(() => false)) {
    await menuOpener.click();
    await page
      .locator(`${HEADER_CHROME} div.fixed.inset-0`)
      .first()
      .waitFor({ state: "visible", timeout: 15_000 })
      .catch(() => {});
    return true;
  }
  return false;
}

/**
 * Guest marketing header: login (and signup) links exist and become visible — opens the mobile drawer
 * when links are only exposed there at the current viewport.
 */
export async function ensureHeaderNavigationVisible(page: Page): Promise<void> {
  const shell = page.locator('[data-nn-nav-mode="public"]');
  await expect(shell).toBeVisible({ timeout: 60_000 });

  const loginAny = page.locator(`${HEADER_CHROME} a[href*="/login"]`).first();
  await expect(loginAny).toBeAttached({ timeout: 30_000 });
  await loginAny.scrollIntoViewIfNeeded().catch(() => {});

  if (
    (await page.locator(`${HEADER_CHROME} a[href*="/login"]`).filter({ visible: true }).count().catch(() => 0)) > 0
  ) {
    return;
  }

  await openMainMobileDrawerIfPresent(page);
  await expect(
    page.locator(`${HEADER_CHROME} a[href*="/login"]`).filter({ visible: true }).first(),
  ).toBeVisible({ timeout: 20_000 });
}

/**
 * Authenticated marketing header: dashboard + account overview (+ sign-out control) — same drawer fallback.
 */
export async function ensureLoggedInMarketingHeaderVisible(page: Page): Promise<void> {
  const shell = page.locator('[data-nn-nav-mode="public"]');
  await expect(shell).toBeVisible({ timeout: 60_000 });

  const appDashAttached = page.locator(`${HEADER_CHROME} a[href="/app"]`).first();
  const accountAttached = page.locator(`${HEADER_CHROME} a[href="/app/account/overview"]`).first();

  await expect(appDashAttached).toBeAttached({ timeout: 30_000 });
  await expect(accountAttached).toBeAttached({ timeout: 30_000 });
  await appDashAttached.scrollIntoViewIfNeeded().catch(() => {});
  await accountAttached.scrollIntoViewIfNeeded().catch(() => {});

  const appVisibleCount = await page
    .locator(`${HEADER_CHROME} a[href="/app"]`)
    .filter({ visible: true })
    .count()
    .catch(() => 0);
  const accountVisibleCount = await page
    .locator(`${HEADER_CHROME} a[href="/app/account/overview"]`)
    .filter({ visible: true })
    .count()
    .catch(() => 0);

  if (appVisibleCount > 0 && accountVisibleCount > 0) {
    return;
  }

  await openMainMobileDrawerIfPresent(page);

  await expect(page.locator(`${HEADER_CHROME} a[href="/app"]`).filter({ visible: true }).first()).toBeVisible({
    timeout: 20_000,
  });
  await expect(
    page.locator(`${HEADER_CHROME} a[href="/app/account/overview"]`).filter({ visible: true }).first(),
  ).toBeVisible({ timeout: 20_000 });
}
