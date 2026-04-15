import { expect, type Page } from "@playwright/test";
import { GLOBAL_REGION_COOKIE } from "../../../src/lib/region/global-region-cookie";

export const MARKETING_PUBLIC_SELECTOR = '[data-nn-nav-mode="public"]';

/** Desktop primary link strip (Pricing, Blog, …) — first `nav` inside the desktop grid. */
export const DESKTOP_PRIMARY_STRIP_NAV = ".nn-header-desktop-grid nav";

/** Desktop mega-menu tier (RN, PN, …). */
export const DESKTOP_MEGA_TIER_NAV = ".nn-header-nav-row nav";

export function requireOrigin(baseURL: string | undefined): string {
  expect(baseURL, "Set Playwright `use.baseURL` or `BASE_URL` for navigation tests").toBeTruthy();
  return baseURL!;
}

export async function expectMarketingPublicShell(page: Page) {
  await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });
}

export async function gotoExpectOk(page: Page, path: string) {
  const r = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(r?.ok(), `HTTP ${r?.status()} for ${path}`).toBeTruthy();
  await expect(page.locator("body")).toBeVisible();
}

/** Avoid false greens on marketing routes that render a minimal not-found body. */
export async function expectNotPageNotFound(page: Page) {
  await expect(page.getByRole("heading", { name: /^page not found$/i })).toHaveCount(0);
}

export async function seedUsMarketingCookie(page: Page, origin: string) {
  await page.context().addCookies([{ name: GLOBAL_REGION_COOKIE, value: "us", url: origin }]);
}
