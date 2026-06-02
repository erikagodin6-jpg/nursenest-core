/**
 * Localized guest homepage smoke: each locale’s marketing home loads with public shell,
 * primary CTA region, stable locale URL, clean observers, and mobile drawer behavior.
 *
 * @see tests/e2e/helpers/smoke-marketing-locales.ts — `E2E_SMOKE_MARKETING_LOCALES` overrides the matrix.
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import {
  recordLocalizedSmoke,
  seriousLocalizedGuestConsoleErrors,
} from "../helpers/localized-smoke-diagnostics";
import { HEADER_CHROME } from "../helpers/country-selector";
import { ensureHeaderNavigationVisible } from "../helpers/marketing-header-navigation";
import { dismissMarketingScrims } from "../helpers/marketing-smoke-scrims";
import {
  expectPathMatchesMarketingLocale,
  getSmokeMarketingLocaleMatrix,
} from "../helpers/smoke-marketing-locales";

async function gotoHomeOk(page: Page, path: string) {
  const r = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(r?.ok(), `HTTP ${r?.status()} for ${path}`).toBeTruthy();
  await expect(page.locator("body")).toBeVisible();
}

async function expectNoObvious404(page: Page) {
  const dead = await page
    .getByRole("heading", { name: /^404|Not [Ff]ound|Page not found/i })
    .first()
    .isVisible()
    .catch(() => false);
  expect(dead, "unexpected 404 / not-found heading").toBe(false);
}

const locales = getSmokeMarketingLocaleMatrix();

test.describe("Localized guest homepage", () => {
  for (const { code, homePath } of locales) {
    test(`${code}: shell, CTA, locale URL, observers, mobile nav`, async ({ page }, testInfo) => {
      test.setTimeout(180_000);
      const o = attachPageObservers(page, { profile: "public" });
      try {
        await page.setViewportSize({ width: 1440, height: 900 });
        await gotoHomeOk(page, homePath);
        await dismissMarketingScrims(page);

        await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
        await expect(page.locator(HEADER_CHROME).first()).toBeVisible({ timeout: 30_000 });
        await expect(page.locator('[data-nn-nav-mode="public"] nav').first()).toBeVisible({ timeout: 30_000 });

        const main = page.locator("main, [role='main']").first();
        await expect(main).toBeVisible({ timeout: 30_000 });
        const heroCta = main.locator(
          'a[href*="/signup"], a[href*="/login"], a[href="/app"], a[href*="/app/"], a[href*="/pricing"]',
        );
        await expect(heroCta.first()).toBeAttached({ timeout: 30_000 });
        await heroCta.first().scrollIntoViewIfNeeded();
        await expect(heroCta.first()).toBeVisible({ timeout: 30_000 });

        await expect(page.locator("footer").first()).toBeVisible({ timeout: 25_000 });

        expectPathMatchesMarketingLocale(page.url(), code);
        await expectNoObvious404(page);

        await page.waitForTimeout(900);
        await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible();
        await expect(page.locator('[data-nn-nav-mode="public"] nav').first()).toBeVisible();

        await page.setViewportSize({ width: 390, height: 844 });
        await dismissMarketingScrims(page);
        await ensureHeaderNavigationVisible(page);

        const menuBtn = page.locator(`${HEADER_CHROME} button:has(svg[class*="lucide-menu"])`).first();
        await expect(menuBtn).toBeAttached({ timeout: 15_000 });
        if (await menuBtn.isVisible().catch(() => false)) {
          await menuBtn.click();
          await expect(menuBtn).toHaveAttribute("aria-expanded", "true", { timeout: 15_000 });
          await page.keyboard.press("Escape");
          await expect(menuBtn).toBeVisible({ timeout: 15_000 });
        }

        const cap = await recordLocalizedSmoke(o, testInfo, `guest-home-${code}`, page.url(), code);
        const serious = seriousLocalizedGuestConsoleErrors(cap.consoleErrors);
        expect(serious, `console errors (locale ${code})`).toEqual([]);
        expect(cap.failedRequests, `failed requests (locale ${code})`).toEqual([]);
      } finally {
        o.dispose();
      }
    });
  }
});
