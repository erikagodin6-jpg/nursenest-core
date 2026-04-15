/**
 * Country selector + marketing region behavior (desktop + mobile).
 *
 * Uses sticky chrome `.nn-header-animate-in` (utility strip + header are siblings inside it).
 *
 * Leaving `/exams/*` for US/CA lands on canonical RN hubs (`/us/rn/nclex-rn`, `/canada/rn/nclex-rn`) so the
 * marketing shell always has a real route (bare `/us` / `/canada` are not guaranteed to resolve).
 *
 * Run: `npx playwright test tests/e2e/navigation/country-selector.spec.ts`
 * Screenshots: `screenshot: 'only-on-failure'` in `playwright.config.ts` (global).
 */
import { expect, test, type Page } from "@playwright/test";
import { MARKETING_REGION_COOKIE } from "../../../src/lib/region/marketing-region-cookie";
import {
  GLOBAL_REGION_COOKIE,
  HEADER_CHROME,
  openDesktopCountryMenu,
  selectCountryFromListbox,
  setGlobalRegionCookie,
} from "../helpers/country-selector";
import { expectMobileRegionSettingsHeading, openMobileRegionLanguageDrawer } from "../helpers/mobile-drawer";

function requireOrigin(baseURL: string | undefined): string {
  expect(baseURL, "Playwright `baseURL` must be set (see playwright.config.ts `use.baseURL` or env BASE_URL)").toBeTruthy();
  return baseURL!;
}

/** Avoid substring false positives (e.g. `/enus` or unrelated `/…/us/…` segments). */
function pathnameIsUsMarketing(url: string): boolean {
  const p = new URL(url).pathname.replace(/\/$/, "") || "/";
  return p === "/us" || p.startsWith("/us/");
}

function pathnameIsCanadaMarketing(url: string): boolean {
  const p = new URL(url).pathname.replace(/\/$/, "") || "/";
  return p === "/canada" || p.startsWith("/canada/");
}

async function waitForUsOrCanadaHubUrl(page: Page, target: "us" | "canada") {
  await page.waitForFunction(
    (t) => {
      const p = new URL(window.location.href).pathname.replace(/\/$/, "") || "/";
      if (t === "us") return p === "/us" || p.startsWith("/us/");
      return p === "/canada" || p.startsWith("/canada/");
    },
    target,
    { timeout: 45_000 },
  );
}

async function expectPublicChromeVisible(page: Page) {
  await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
}

/** Utility strip uses `Country: …` while the primary row uses `nav.regionLabel` (often "Region: …") — compare parsed display names. */
function regionNameFromTriggerAria(aria: string): string {
  const m = /^(?:Country|Region):\s*([^.]+)/i.exec(aria.trim());
  return (m?.[1] ?? "").trim().toLowerCase();
}

/** All country/region triggers in the sticky header chrome should show the same region (utility strip + primary row). */
async function expectHeaderCountryControlsAgree(page: Page) {
  const triggers = page.locator(
    `${HEADER_CHROME} button[aria-label*="Country:"], ${HEADER_CHROME} button[aria-label*="Region:"]`,
  );
  const n = await triggers.count();
  expect(n, "expected at least one country/region trigger in header chrome").toBeGreaterThan(0);
  const names = new Set<string>();
  for (let i = 0; i < n; i++) {
    const al = await triggers.nth(i).getAttribute("aria-label");
    if (al) names.add(regionNameFromTriggerAria(al));
  }
  expect(names.size, `header country display names disagree — ${[...names].join(" | ")}`).toBe(1);
}

test.describe("Country selector — desktop", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test("from /exams/philippines → US: URL under /us/… (canonical hub) and header shows United States", async ({
    page,
    baseURL,
  }) => {
    const origin = requireOrigin(baseURL);
    await setGlobalRegionCookie(page, "philippines", origin);
    await page.goto("/exams/philippines", { waitUntil: "domcontentloaded" });
    await expectPublicChromeVisible(page);

    await openDesktopCountryMenu(page);
    await selectCountryFromListbox(page, /United States/i);
    await waitForUsOrCanadaHubUrl(page, "us");
    expect(pathnameIsUsMarketing(page.url()), `expected /us marketing path, got ${page.url()}`).toBe(true);
    await expect(page).toHaveURL(/\/us\/rn\/nclex-rn(?:\/|\?|#|$)/);

    await expect(page.locator(`${HEADER_CHROME} button[aria-label*="United States"]`).first()).toBeVisible({
      timeout: 30_000,
    });
  });

  test("from /exams/philippines → Canada: URL under /canada/… (canonical hub) and header shows Canada", async ({
    page,
    baseURL,
  }) => {
    const origin = requireOrigin(baseURL);
    await setGlobalRegionCookie(page, "philippines", origin);
    await page.goto("/exams/philippines", { waitUntil: "domcontentloaded" });
    await expectPublicChromeVisible(page);

    await openDesktopCountryMenu(page);
    await selectCountryFromListbox(page, /^Canada$/);
    await waitForUsOrCanadaHubUrl(page, "canada");
    expect(pathnameIsCanadaMarketing(page.url()), `expected /canada marketing path, got ${page.url()}`).toBe(true);
    await expect(page).toHaveURL(/\/canada\/rn\/nclex-rn(?:\/|\?|#|$)/);

    await expect(page.locator(`${HEADER_CHROME} button[aria-label*="Canada"]`).first()).toBeVisible({
      timeout: 30_000,
    });
  });

  test("stale expansion cookie on neutral route does not show Philippines in header", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await page.context().addCookies([
      { name: GLOBAL_REGION_COOKIE, value: "philippines", url: origin },
      { name: MARKETING_REGION_COOKIE, value: "US", url: origin },
    ]);
    await page.goto("/pricing", { waitUntil: "domcontentloaded" });
    await expectPublicChromeVisible(page);

    await expect(
      page.locator(HEADER_CHROME).getByRole("button", { name: /Country: United States|Region: United States/i }).first(),
    ).toBeVisible({ timeout: 30_000 });
    await expect(
      page.locator(HEADER_CHROME).getByRole("button", { name: /Country: Philippines|Region: Philippines/i }),
    ).toHaveCount(0);
  });

  test("no duplicate in-content US/CA region radiogroup on neutral marketing page", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "domcontentloaded" });
    await expectPublicChromeVisible(page);
    await expect(page.locator("main [role='radiogroup']")).toHaveCount(0);
    await expect(page.locator("main [aria-label='Select country']")).toHaveCount(0);
  });

  test("header utility and primary row agree on displayed country (US hub)", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await page.context().addCookies([{ name: GLOBAL_REGION_COOKIE, value: "us", url: origin }]);
    await page.goto("/us/rn/nclex-rn", { waitUntil: "domcontentloaded" });
    await expectPublicChromeVisible(page);
    await expectHeaderCountryControlsAgree(page);
  });
});

test.describe("Country selector — mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test("from /exams/philippines → US: URL under /us/… and drawer shows United States", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await setGlobalRegionCookie(page, "philippines", origin);
    await page.goto("/exams/philippines", { waitUntil: "domcontentloaded" });
    await expectPublicChromeVisible(page);

    await openMobileRegionLanguageDrawer(page);
    await expectMobileRegionSettingsHeading(page);
    await page.getByRole("option", { name: /United States/i }).first().click();
    await waitForUsOrCanadaHubUrl(page, "us");
    await expect(page).toHaveURL(/\/us\/rn\/nclex-rn(?:\/|\?|#|$)/);

    const cookies = await page.context().cookies(origin);
    expect(cookies.find((c) => c.name === GLOBAL_REGION_COOKIE)?.value).toBe("us");

    await openMobileRegionLanguageDrawer(page);
    await expect(
      page.locator("div.rounded-xl.border").filter({ hasText: /United States/i }).first(),
    ).toBeVisible();
  });

  test("from /exams/philippines → Canada: URL under /canada/… and drawer shows Canada", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await setGlobalRegionCookie(page, "philippines", origin);
    await page.goto("/exams/philippines", { waitUntil: "domcontentloaded" });
    await expectPublicChromeVisible(page);

    await openMobileRegionLanguageDrawer(page);
    await page.getByRole("option", { name: /^Canada$/ }).first().click();
    await waitForUsOrCanadaHubUrl(page, "canada");
    await expect(page).toHaveURL(/\/canada\/rn\/nclex-rn(?:\/|\?|#|$)/);

    const cookies = await page.context().cookies(origin);
    expect(cookies.find((c) => c.name === GLOBAL_REGION_COOKIE)?.value).toBe("canada");

    await openMobileRegionLanguageDrawer(page);
    await expect(page.locator("div.rounded-xl.border").filter({ hasText: /^Canada$/ }).first()).toBeVisible();
  });

  test("stale expansion cookie on neutral route: drawer does not imply Philippines", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await page.context().addCookies([
      { name: GLOBAL_REGION_COOKIE, value: "philippines", url: origin },
      { name: MARKETING_REGION_COOKIE, value: "US", url: origin },
    ]);
    await page.goto("/pricing", { waitUntil: "domcontentloaded" });
    await expectPublicChromeVisible(page);

    await openMobileRegionLanguageDrawer(page);
    await expectMobileRegionSettingsHeading(page);
    await expect(
      page.locator("div.rounded-xl.border").filter({ hasText: /Philippines/i }).first(),
    ).toHaveCount(0);
    await expect(
      page.locator("div.rounded-xl.border").filter({ hasText: /United States/i }).first(),
    ).toBeVisible();
  });

  test("no duplicate in-content US/CA radiogroup on neutral marketing page", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "domcontentloaded" });
    await expectPublicChromeVisible(page);
    await expect(page.locator("main [role='radiogroup']")).toHaveCount(0);
    await expect(page.locator("main [aria-label='Select country']")).toHaveCount(0);
  });

  test("drawer summary matches cookie after US hub navigation", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await page.context().addCookies([{ name: GLOBAL_REGION_COOKIE, value: "us", url: origin }]);
    await page.goto("/us/rn/nclex-rn", { waitUntil: "domcontentloaded" });
    await expectPublicChromeVisible(page);

    await openMobileRegionLanguageDrawer(page);
    await expect(
      page.locator("div.rounded-xl.border").filter({ hasText: /United States/i }).first(),
    ).toBeVisible();
  });

  test("header utility and primary row agree on displayed country (US hub, mobile viewport)", async ({
    page,
    baseURL,
  }) => {
    const origin = requireOrigin(baseURL);
    await page.context().addCookies([{ name: GLOBAL_REGION_COOKIE, value: "us", url: origin }]);
    await page.goto("/us/rn/nclex-rn", { waitUntil: "domcontentloaded" });
    await expectPublicChromeVisible(page);
    await expectHeaderCountryControlsAgree(page);
  });
});
