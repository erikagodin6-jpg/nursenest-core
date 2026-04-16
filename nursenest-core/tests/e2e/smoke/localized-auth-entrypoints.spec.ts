/**
 * Localized auth entrypoints: login/signup links from the marketing header resolve to locale-aware
 * marketing routes; `/app` and `/admin` stay unprefixed.
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import {
  recordLocalizedSmoke,
  seriousLocalizedGuestConsoleErrors,
} from "../helpers/localized-smoke-diagnostics";
import { HEADER_CHROME } from "../helpers/country-selector";
import { dismissMarketingScrims } from "../helpers/marketing-smoke-scrims";
import {
  DEFAULT_MARKETING_LOCALE,
  expectPathMatchesMarketingLocale,
  getSmokeMarketingLocaleMatrix,
} from "../helpers/smoke-marketing-locales";

const locales = getSmokeMarketingLocaleMatrix();

const LOGIN_ARIA = "Log in to your NurseNest account";
const SIGNUP_ARIA = "Start free account — nursing and healthcare exam prep";

async function assertHeaderDoesNotLocalePrefixAppAdmin(page: Page, localeCode: string) {
  const hrefs = await page.locator(`${HEADER_CHROME} a[href]`).evaluateAll((els) =>
    els.map((a) => (a as HTMLAnchorElement).getAttribute("href") || ""),
  );
  const badApp = new RegExp(`/${localeCode}/app(?:/|$)`);
  const badAdmin = new RegExp(`/${localeCode}/admin(?:/|$)`);
  for (const raw of hrefs) {
    if (!raw || raw.startsWith("mailto:") || raw.startsWith("tel:")) continue;
    let path = raw;
    try {
      if (raw.startsWith("http://") || raw.startsWith("https://")) {
        path = new URL(raw).pathname;
      }
    } catch {
      continue;
    }
    path = path.split("?")[0] || path;
    if (path.includes("/app")) {
      expect(path, `app href must stay /app, got ${raw}`).toMatch(/^\/app(\/|$)/);
      expect(raw).not.toMatch(badApp);
    }
    if (path.includes("/admin")) {
      expect(path, `admin href must stay /admin, got ${raw}`).toMatch(/^\/admin(\/|$)/);
      expect(raw).not.toMatch(badAdmin);
    }
  }
}

function expectLoginPath(pathname: string, localeCode: string) {
  const p = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  if (localeCode === DEFAULT_MARKETING_LOCALE) {
    expect(p.startsWith("/login"), `expected /login, got ${pathname}`).toBeTruthy();
  } else {
    expect(p.startsWith(`/${localeCode}/login`), `expected /${localeCode}/login, got ${pathname}`).toBeTruthy();
  }
}

function expectSignupPath(pathname: string, localeCode: string) {
  const p = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  if (localeCode === DEFAULT_MARKETING_LOCALE) {
    expect(p.startsWith("/signup"), `expected /signup, got ${pathname}`).toBeTruthy();
  } else {
    expect(p.startsWith(`/${localeCode}/signup`), `expected /${localeCode}/signup, got ${pathname}`).toBeTruthy();
  }
}

async function gotoAndPrep(page: Page, homePath: string) {
  const r = await page.goto(homePath, { waitUntil: "domcontentloaded" });
  expect(r?.ok(), `HTTP ${r?.status()} for ${homePath}`).toBeTruthy();
  await dismissMarketingScrims(page);
  await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
}

test.describe("Localized auth entrypoints (guest)", () => {
  for (const { code, homePath } of locales) {
    test(`${code}: login + signup destinations; app/admin not locale-prefixed`, async ({ page }, testInfo) => {
      test.setTimeout(180_000);
      const o = attachPageObservers(page, { profile: "public" });
      try {
        await page.setViewportSize({ width: 1440, height: 900 });
        await gotoAndPrep(page, homePath);
        expectPathMatchesMarketingLocale(page.url(), code);
        await assertHeaderDoesNotLocalePrefixAppAdmin(page, code);

        const loginLink = page.locator(`${HEADER_CHROME} a[aria-label="${LOGIN_ARIA}"]`).first();
        await expect(loginLink).toBeVisible({ timeout: 30_000 });
        const loginHref = await loginLink.getAttribute("href");
        expect(loginHref).toBeTruthy();
        await loginLink.evaluate((el: HTMLElement) => (el as HTMLAnchorElement).click());
        await page.waitForLoadState("domcontentloaded");
        expectLoginPath(new URL(page.url()).pathname, code);
        await expect(page.locator("main, [role='main']").first()).toBeVisible({ timeout: 30_000 });

        await gotoAndPrep(page, homePath);
        const signupLink = page.locator(`${HEADER_CHROME} a[aria-label="${SIGNUP_ARIA}"]`).first();
        await expect(signupLink).toBeVisible({ timeout: 30_000 });
        await signupLink.evaluate((el: HTMLElement) => (el as HTMLAnchorElement).click());
        await page.waitForLoadState("domcontentloaded");
        expectSignupPath(new URL(page.url()).pathname, code);
        await expect(page.locator("main, [role='main']").first()).toBeVisible({ timeout: 30_000 });

        const cap = await recordLocalizedSmoke(o, testInfo, `auth-entry-${code}`, page.url(), code);
        const serious = seriousLocalizedGuestConsoleErrors(cap.consoleErrors);
        expect(serious, `console errors (locale ${code})`).toEqual([]);
        expect(cap.failedRequests, `failed requests (locale ${code})`).toEqual([]);
      } finally {
        o.dispose();
      }
    });
  }
});
