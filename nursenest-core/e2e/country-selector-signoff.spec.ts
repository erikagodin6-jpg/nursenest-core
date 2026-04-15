/**
 * Browser sign-off: country selector (Philippines hub → US/CA, mobile drawer, keyboard).
 *
 * Prerequisites:
 * - `BASE_URL` (default http://127.0.0.1:3000) with `npm run dev`
 * - `RUN_HEAVY_BUILD_TASKS=false` if `next.config.ts` dynamic imports fail in dev
 * - `AUTH_SECRET` / `NEXTAUTH_SECRET` set (avoids Auth.js MissingSecret noise)
 *
 * Locators use `.nn-header-animate-in` because the light-theme utility strip is a **sibling** of
 * `<header data-nn-nav-mode>`, not a descendant.
 */
import { expect, test, type Page } from "@playwright/test";
import { GLOBAL_REGION_COOKIE } from "../src/lib/region/global-region-cookie";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

async function setPhilippinesCookie(page: import("@playwright/test").Page) {
  await page.context().addCookies([
    { name: GLOBAL_REGION_COOKIE, value: "philippines", url: baseURL },
  ]);
}

/** Sticky chrome wraps utility strip + `<header>` (MapPin lives here; strip uses `Country: …`). */
const HEADER_CHROME = ".nn-header-animate-in";

/**
 * Desktop: match the real a11y names so we don’t click unrelated “Philippines” UI in page content.
 */
async function openDesktopCountryMenu(page: Page) {
  const regionBtn = page
    .locator(HEADER_CHROME)
    .getByRole("button", { name: /Country: Philippines|Region: Philippines/i })
    .first();
  await expect(regionBtn).toBeVisible({ timeout: 60_000 });
  await regionBtn.click();
  await page.locator(`${HEADER_CHROME} [role="listbox"][aria-label="Select country"]`).waitFor({
    state: "visible",
    timeout: 30_000,
  });
}

async function selectCountryFromListbox(page: Page, label: RegExp) {
  const list = page.locator(`${HEADER_CHROME} [role="listbox"][aria-label="Select country"]`);
  await list.getByRole("option", { name: label }).first().click();
}

test.describe("Country selector sign-off — desktop (chromium)", () => {
  test.beforeEach(async ({ page }) => {
    await setPhilippinesCookie(page);
    await page.goto(`${baseURL}/exams/philippines`, { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
  });

  test("Philippines → US: URL /us, header shows United States", async ({ page }) => {
    const before = page.url();
    await openDesktopCountryMenu(page);
    await selectCountryFromListbox(page, /United States/i);
    await page.waitForURL(/\/us(\/|$|\?)/, { timeout: 30_000 });
    const after = page.url();
    expect(after, `expected navigation from ${before}`).toMatch(/\/us(\/|$|\?)/);
    await expect(
      page.locator(HEADER_CHROME).getByRole("button", { name: /Country: United States|Region: United States/i }).first(),
    ).toBeVisible();
  });

  test("Philippines → Canada: URL /canada, header shows Canada", async ({ page }) => {
    const before = page.url();
    await openDesktopCountryMenu(page);
    await selectCountryFromListbox(page, /^Canada$/);
    await page.waitForURL(/\/canada(\/|$|\?)/, { timeout: 30_000 });
    const after = page.url();
    expect(after, `expected navigation from ${before}`).toMatch(/\/canada(\/|$|\?)/);
    await expect(
      page.locator(HEADER_CHROME).getByRole("button", { name: /Country: Canada|Region: Canada/i }).first(),
    ).toBeVisible();
  });

  test("US marketing pathway: US ↔ Canada keeps valid hub URL (no dead click)", async ({ page }) => {
    await page.context().addCookies([{ name: GLOBAL_REGION_COOKIE, value: "us", url: baseURL }]);
    await page.goto(`${baseURL}/us/rn/nclex-rn`, { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
    const before = page.url();
    const regionBtn = page
      .locator(HEADER_CHROME)
      .getByRole("button", { name: /Country: United States|Region: United States/i })
      .first();
    await regionBtn.click();
    await page.locator(`${HEADER_CHROME} [role="listbox"][aria-label="Select country"]`).waitFor({
      state: "visible",
      timeout: 30_000,
    });
    await page.getByRole("option", { name: /^Canada$/ }).first().click();
    await page.waitForURL(/\/canada\//, { timeout: 30_000 });
    const after = page.url();
    expect(after, `toggle CA from ${before}`).toMatch(/\/canada\/r[nn]\//);
    await expect(
      page.locator(HEADER_CHROME).getByRole("button", { name: /Country: Canada|Region: Canada/i }).first(),
    ).toBeVisible();
  });

  test("Keyboard: focus option + Enter selects country", async ({ page }) => {
    await openDesktopCountryMenu(page);
    const usOption = page.locator(`${HEADER_CHROME} [role="listbox"]`).getByRole("option", { name: /United States/i }).first();
    await usOption.focus();
    await page.keyboard.press("Enter");
    await page.waitForURL(/\/us(\/|$|\?)/, { timeout: 30_000 });
    await expect(
      page.locator(HEADER_CHROME).getByRole("button", { name: /Country: United States|Region: United States/i }).first(),
    ).toBeVisible();
  });

  test("Public marketing: no learner primary-nav emphasis on exam hub", async ({ page }) => {
    await expect(page.locator("header.nn-learner-nav-link--primary")).toHaveCount(0);
    await expect(page.locator("a.nn-learner-nav-link--primary")).toHaveCount(0);
  });
});

test.describe("Country selector sign-off — mobile viewport", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await setPhilippinesCookie(page);
    await page.goto(`${baseURL}/exams/philippines`, { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
  });

  test("Drawer: Philippines → US → /us + United States in header", async ({ page }) => {
    const before = page.url();
    await page.getByRole("button", { name: /Region and language settings/i }).click();
    await expect(page.getByRole("heading", { name: /Region & Settings/i })).toBeVisible();
    await page.getByRole("option", { name: /United States/i }).first().click();
    await page.waitForURL(/\/us(\/|$|\?)/, { timeout: 30_000 });
    expect(page.url(), `from ${before}`).toMatch(/\/us(\/|$|\?)/);
    const cookiesUs = await page.context().cookies(baseURL);
    expect(cookiesUs.find((c) => c.name === GLOBAL_REGION_COOKIE)?.value).toBe("us");
    // Drawer summary (public pages have no header country chip on small screens).
    await page.getByRole("button", { name: /Region and language settings/i }).click();
    await expect(
      page
        .locator("div.rounded-xl.border")
        .filter({ hasText: "United States" })
        .first(),
    ).toBeVisible();
  });

  test("Drawer: Philippines → Canada → /canada + Canada in header", async ({ page }) => {
    const before = page.url();
    await page.getByRole("button", { name: /Region and language settings/i }).click();
    await page.getByRole("option", { name: /^Canada$/ }).first().click();
    await page.waitForURL(/\/canada(\/|$|\?)/, { timeout: 30_000 });
    expect(page.url(), `from ${before}`).toMatch(/\/canada(\/|$|\?)/);
    const cookiesCa = await page.context().cookies(baseURL);
    expect(cookiesCa.find((c) => c.name === GLOBAL_REGION_COOKIE)?.value).toBe("canada");
    await page.getByRole("button", { name: /Region and language settings/i }).click();
    await expect(
      page
        .locator("div.rounded-xl.border")
        .filter({ hasText: /^Canada$/ })
        .first(),
    ).toBeVisible();
  });
});
