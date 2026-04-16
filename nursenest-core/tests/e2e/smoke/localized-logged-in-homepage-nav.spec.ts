/**
 * Localized logged-in homepage: marketing shell stays public on locale home routes;
 * session affordances (dashboard, account overview, sign out) remain after hydration.
 *
 * Requires the same paid QA credentials as other authenticated Playwright suites
 * (`E2E_PAID_EMAIL` / `E2E_PAID_PASSWORD` or `PLAYWRIGHT_TEST_*`).
 *
 * Run via `playwright.localized-smoke.config.ts` (project `localized-logged-in`).
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import {
  recordLocalizedSmoke,
  seriousLocalizedGuestConsoleErrors,
} from "../helpers/localized-smoke-diagnostics";
import { HEADER_CHROME } from "../helpers/country-selector";
import { ensureLoggedInMarketingHeaderVisible } from "../helpers/marketing-header-navigation";
import { dismissMarketingScrims } from "../helpers/marketing-smoke-scrims";
import {
  expectPathMatchesMarketingLocale,
  getSmokeMarketingLocaleMatrix,
} from "../helpers/smoke-marketing-locales";

const locales = getSmokeMarketingLocaleMatrix();

async function gotoHomeOk(page: import("@playwright/test").Page, path: string) {
  const r = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(r?.ok(), `HTTP ${r?.status()} for ${path}`).toBeTruthy();
}

test.describe("Localized logged-in homepage nav", () => {
  for (const { code, homePath } of locales) {
    test(`${code}: marketing public shell; dashboard + account menu`, async ({ page }, testInfo) => {
      test.setTimeout(180_000);
      const o = attachPageObservers(page, { profile: "public" });
      try {
        await page.setViewportSize({ width: 1440, height: 900 });
        await gotoHomeOk(page, homePath);
        await dismissMarketingScrims(page);

        await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
        expectPathMatchesMarketingLocale(page.url(), code);

        await expect
          .poll(async () => await page.locator('[data-nn-nav-mode="learner"]').count(), { timeout: 60_000 })
          .toBe(0);

        await ensureLoggedInMarketingHeaderVisible(page);

        await expect(page.locator(`${HEADER_CHROME} a[href="/app"]`).filter({ visible: true }).first()).toBeVisible({
          timeout: 30_000,
        });
        await expect(
          page.locator(`${HEADER_CHROME} a[href="/app/account/overview"]`).filter({ visible: true }).first(),
        ).toBeVisible({ timeout: 30_000 });

        const signOut = page
          .locator(`${HEADER_CHROME} a[href="/app/account/overview"] ~ button[type="button"]`)
          .filter({ visible: true })
          .first();
        await expect(signOut).toBeAttached({ timeout: 15_000 });
        await expect(signOut).toBeVisible({ timeout: 15_000 });

        await page.waitForTimeout(900);
        await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible();
        await expect(page.locator('[data-nn-nav-mode="public"] nav').first()).toBeVisible({ timeout: 20_000 });

        const cap = await recordLocalizedSmoke(o, testInfo, `logged-in-home-${code}`, page.url(), code);
        const serious = seriousLocalizedGuestConsoleErrors(cap.consoleErrors);
        expect(serious, `console errors (locale ${code})`).toEqual([]);
        expect(cap.failedRequests, `failed requests (locale ${code})`).toEqual([]);
      } finally {
        o.dispose();
      }
    });
  }
});
