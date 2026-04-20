/**
 * Selectors + visibility checks for “site never appears broken” E2E contracts.
 *
 * | Selector | Target |
 * |----------|--------|
 * | `header.nn-header-animate-in` | Marketing sticky header |
 * | `[data-nn-nav-mode="public"]` | Public marketing nav chrome |
 * | `.nn-header-desktop-grid nav` | Desktop primary link strip (Pricing, Blog, …) |
 * | `img[alt="NurseNest leaf logo"]` | Header leaf logo (when asset loads) |
 * | `[data-testid="hero-section"]` | Home hero region |
 * | `[data-testid="text-hero-heading"]` | Hero primary heading |
 * | `section[aria-label="Global marketing overview"]` | First content band below hero |
 * | `footer` | Page footer |
 */
import { expect, type Locator, type Page } from "@playwright/test";

export const SEL_MARKETING_HEADER = "header.nn-header-animate-in";
export const SEL_MARKETING_PUBLIC_NAV = '[data-nn-nav-mode="public"]';
export const SEL_DESKTOP_PRIMARY_NAV = ".nn-header-desktop-grid nav";
export const SEL_LOGO_IMG = 'img[alt="NurseNest leaf logo"]';
export const SEL_HERO_SECTION = '[data-testid="hero-section"]';
export const SEL_HERO_HEADING = '[data-testid="text-hero-heading"]';
export const SEL_GLOBAL_OVERVIEW = 'section[aria-label="Global marketing overview"]';
export const SEL_LEARNER_SHELL = '[data-testid="learner-shell"]';

async function minOpacity(locator: Locator): Promise<number> {
  return locator.evaluate((el) => parseFloat(window.getComputedStyle(el).opacity));
}

/** Fails if header/hero are missing, zero-size, or effectively invisible (opacity). */
export async function assertMarketingHomeNeverBroken(page: Page, label: string) {
  const header = page.locator(SEL_MARKETING_HEADER).first();
  const publicNav = page.locator(SEL_MARKETING_PUBLIC_NAV).first();
  const desktopNav = page.locator(SEL_DESKTOP_PRIMARY_NAV).first();
  const hero = page.locator(SEL_HERO_SECTION).first();
  const heading = page.locator(SEL_HERO_HEADING).first();

  await expect(header, `${label}: marketing header`).toBeVisible({ timeout: 60_000 });
  await expect(publicNav, `${label}: public nav chrome`).toBeVisible({ timeout: 60_000 });
  await expect(desktopNav, `${label}: desktop primary nav strip`).toBeVisible({ timeout: 60_000 });
  await expect(hero, `${label}: hero section`).toBeVisible({ timeout: 60_000 });
  await expect(heading, `${label}: hero heading`).toBeVisible({ timeout: 60_000 });

  const logoImg = page.locator(SEL_LOGO_IMG).first();
  const wordmark = header.getByText("NurseNest", { exact: true }).first();
  const logoOk =
    (await logoImg.isVisible().catch(() => false)) || (await wordmark.isVisible().catch(() => false));
  expect(logoOk, `${label}: header logo (image or wordmark)`).toBe(true);

  const ho = await minOpacity(header);
  const hh = await minOpacity(heading);
  expect(ho, `${label}: header opacity`).toBeGreaterThanOrEqual(0.99);
  expect(hh, `${label}: hero heading opacity`).toBeGreaterThanOrEqual(0.99);

  const heroBox = await hero.boundingBox();
  expect(heroBox && heroBox.height > 80, `${label}: hero has height`).toBe(true);
  const headingText = (await heading.innerText()).trim();
  expect(headingText.length, `${label}: hero heading non-empty`).toBeGreaterThan(3);
}

export async function assertMarketingMainHasBody(page: Page, label: string) {
  const overview = page.locator(SEL_GLOBAL_OVERVIEW).first();
  await expect(overview, `${label}: overview section`).toBeVisible({ timeout: 60_000 });
  const text = (await overview.innerText()).trim();
  expect(text.length, `${label}: overview body text`).toBeGreaterThan(40);
}
