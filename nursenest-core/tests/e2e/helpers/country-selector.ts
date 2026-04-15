import { expect, type Page } from "@playwright/test";
import { GLOBAL_REGION_COOKIE } from "../../../src/lib/region/global-region-cookie";
import { getE2eBaseURL } from "./e2e-env";

/** Sticky chrome wraps utility strip + `<header>` (MapPin lives here; strip uses `Country: …`). */
export const HEADER_CHROME = ".nn-header-animate-in";

export { getE2eBaseURL } from "./e2e-env";
export { GLOBAL_REGION_COOKIE };

export async function setGlobalRegionCookie(page: Page, value: string, baseURL = getE2eBaseURL()) {
  await page.context().addCookies([{ name: GLOBAL_REGION_COOKIE, value, url: baseURL }]);
}

/**
 * Desktop: match the real a11y names so we don’t click unrelated “Philippines” UI in page content.
 */
export async function openDesktopCountryMenu(page: Page, headerSelector = HEADER_CHROME) {
  const regionBtn = page
    .locator(headerSelector)
    .getByRole("button", { name: /Country: Philippines|Region: Philippines/i })
    .first();
  await expect(regionBtn).toBeVisible({ timeout: 60_000 });
  await regionBtn.click();
  await page.locator(`${headerSelector} [role="listbox"][aria-label="Select country"]`).waitFor({
    state: "visible",
    timeout: 30_000,
  });
}

export async function selectCountryFromListbox(page: Page, label: RegExp, headerSelector = HEADER_CHROME) {
  const list = page.locator(`${headerSelector} [role="listbox"][aria-label="Select country"]`);
  await list.getByRole("option", { name: label }).first().click();
}
