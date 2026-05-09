/**
 * Marketing footer: structure, overflow, key legal/support routes, optional evidence screenshots.
 *
 * Run (dev server + baseURL): `cd nursenest-core && npx playwright test tests/e2e/navigation/footer-marketing-premium.spec.ts`
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { expect, test } from "@playwright/test";
import { CANONICAL_PATHWAY_HUB } from "../../../src/lib/marketing/canonical-pathway-hubs";
import {
  expectMarketingPublicShell,
  expectNotPageNotFound,
  gotoExpectOk,
  requireOrigin,
  seedUsMarketingCookie,
} from "../helpers/navigation-e2e";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import { assertDocumentNoHorizontalOverflow, assertElementNoHorizontalOverflow } from "../helpers/visual-layout-assertions";

const FOOTER = '[data-nn-footer-layout="marketing"]';
/** Git repo root `docs/screenshots/…` (cwd = `nursenest-core/`). */
const SCREENSHOT_OUT = join(process.cwd(), "..", "docs", "screenshots", "footer-figma-premium");

test.describe("Marketing footer — premium layout", () => {
  test.beforeAll(() => {
    mkdirSync(SCREENSHOT_OUT, { recursive: true });
  });

  test("desktop: key internal hrefs present on footer", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoExpectOk(page, "/");
    await dismissMarketingScrims(page);
    await expectMarketingPublicShell(page);
    const footer = page.locator(FOOTER);
    await footer.scrollIntoViewIfNeeded();

    const hrefChecks: { sub: string; pathRe: RegExp }[] = [
      { sub: "pricing", pathRe: /pricing/ },
      { sub: "lessons", pathRe: /lessons/ },
      { sub: "contact", pathRe: /contact/ },
      { sub: "faq", pathRe: /faq/ },
      { sub: "terms", pathRe: /terms/ },
      { sub: "privacy", pathRe: /privacy/ },
    ];
    for (const c of hrefChecks) {
      const link = footer.locator(`a[href*="${c.sub}"]`).first();
      await expect(link, `footer link containing /${c.sub}/`).toBeVisible({ timeout: 30_000 });
      const href = await link.getAttribute("href");
      expect(href, `href for ${c.sub}`).toBeTruthy();
      expect(href!, `href should match ${c.pathRe}`).toMatch(c.pathRe);
    }

    const contactNamed = footer.getByRole("link", { name: /Contact Support/i }).first();
    await expect(contactNamed).toBeVisible({ timeout: 15_000 });
    await expect(contactNamed).toHaveAttribute("href", /contact/);

    const pricingNamed = footer.getByRole("link", { name: /^Pricing$/ }).first();
    await expect(pricingNamed).toBeVisible();
    await expect(pricingNamed).toHaveAttribute("href", /pricing/);

    const lessonsNamed = footer.getByRole("link", { name: /^Lessons$/ }).first();
    await expect(lessonsNamed).toBeVisible();
    await expect(lessonsNamed).toHaveAttribute("href", /lessons/);
  });

  test("desktop + mobile: footer band has no horizontal overflow", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    for (const size of [
      { w: 1280, h: 900, label: "desktop" },
      { w: 390, h: 844, label: "mobile" },
    ] as const) {
      await page.setViewportSize({ width: size.w, height: size.h });
      await gotoExpectOk(page, "/");
      await expectMarketingPublicShell(page);
      const footer = page.locator(FOOTER).first();
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeVisible({ timeout: 30_000 });
      await assertDocumentNoHorizontalOverflow(page);
      await assertElementNoHorizontalOverflow(page, FOOTER);
    }
  });

  test("optional data-theme buckets: homepage + RN hub footer visible", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    const themes = ["ocean", "blossom", "midnight"] as const;
    for (const themeId of themes) {
      await page.setViewportSize({ width: 1440, height: 900 });
      await gotoExpectOk(page, "/");
      await dismissMarketingScrims(page);
      await expectNotPageNotFound(page);
      await page.evaluate((id) => document.documentElement.setAttribute("data-theme", id), themeId);
      await expect(page.locator("html")).toHaveAttribute("data-theme", themeId);
      await page.locator(FOOTER).scrollIntoViewIfNeeded();
      await expect(page.locator(FOOTER)).toBeVisible({ timeout: 45_000 });
      await page.screenshot({
        path: join(SCREENSHOT_OUT, `footer-home-${themeId}-desktop.png`),
        fullPage: true,
      });

      await page.setViewportSize({ width: 390, height: 844 });
      await page.evaluate((id) => document.documentElement.setAttribute("data-theme", id), themeId);
      await expect(page.locator("html")).toHaveAttribute("data-theme", themeId);
      await page.locator(FOOTER).scrollIntoViewIfNeeded();
      await page.screenshot({
        path: join(SCREENSHOT_OUT, `footer-home-${themeId}-mobile.png`),
        fullPage: true,
      });

      await page.setViewportSize({ width: 1440, height: 900 });
      await gotoExpectOk(page, CANONICAL_PATHWAY_HUB.usRn);
      await expectNotPageNotFound(page);
      await dismissMarketingScrims(page);
      await page.evaluate((id) => document.documentElement.setAttribute("data-theme", id), themeId);
      await expect(page.locator("html")).toHaveAttribute("data-theme", themeId);
      await page.locator(FOOTER).scrollIntoViewIfNeeded();
      await expect(page.locator(FOOTER)).toBeVisible({ timeout: 60_000 });
      await page.screenshot({
        path: join(SCREENSHOT_OUT, `footer-rn-hub-${themeId}-desktop.png`),
        fullPage: true,
      });

      await page.setViewportSize({ width: 390, height: 844 });
      await page.evaluate((id) => document.documentElement.setAttribute("data-theme", id), themeId);
      await expect(page.locator("html")).toHaveAttribute("data-theme", themeId);
      await page.locator(FOOTER).scrollIntoViewIfNeeded();
      await page.screenshot({
        path: join(SCREENSHOT_OUT, `footer-rn-hub-${themeId}-mobile.png`),
        fullPage: true,
      });

      await page.evaluate(() => document.documentElement.removeAttribute("data-theme"));
    }
  });
});
