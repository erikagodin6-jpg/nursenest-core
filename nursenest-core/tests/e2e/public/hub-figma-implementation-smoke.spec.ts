/**
 * Convergent hub shell smoke: shared identity hero, premium module root, tier gates, mobile width.
 *
 *   cd nursenest-core && npm run test:e2e:hub-figma
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { expect, test } from "@playwright/test";
import {
  expectNotPageNotFound,
  gotoExpectOk,
  requireOrigin,
  seedCaMarketingCookie,
  seedUsMarketingCookie,
} from "../helpers/navigation-e2e";
import {
  assertDocumentNoHorizontalOverflow,
  assertElementNoHorizontalOverflow,
} from "../helpers/visual-layout-assertions";

const PREMIUM = '[data-nn-qa-pathway-premium-modules=""]';
const SCREENSHOT_OUT = join(process.cwd(), "docs", "screenshots", "hub-figma-implementation");

test.describe("Hub Figma implementation — shell smoke", () => {
  test.beforeAll(() => {
    mkdirSync(SCREENSHOT_OUT, { recursive: true });
  });

  test("RN + allied global: identity hero + premium zone, no /admin in premium HTML", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);

    await gotoExpectOk(page, "/us/rn/nclex-rn");
    await expectNotPageNotFound(page);
    await expect(page.locator('[data-nn-hub-section="identity-hero"]')).toBeVisible({ timeout: 90_000 });
    await expect(page.locator(PREMIUM)).toBeVisible();
    const rnHtml = (await page.locator(PREMIUM).innerHTML()).toLowerCase();
    expect(rnHtml.includes("/admin")).toBe(false);

    await gotoExpectOk(page, "/allied/allied-health");
    await expectNotPageNotFound(page);
    await expect(page.locator('[data-nn-hub-section="identity-hero"]')).toBeVisible({ timeout: 90_000 });
    await expect(page.locator(PREMIUM)).toBeVisible();
    await expect(page.locator(`${PREMIUM} [data-nn-qa-hub-ecg="1"]`)).toHaveCount(0);
    const alliedHtml = (await page.locator(PREMIUM).innerHTML()).toLowerCase();
    expect(alliedHtml.includes("/admin")).toBe(false);
  });

  test("mobile 390: RN hub premium grid stays within viewport width", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoExpectOk(page, "/us/rn/nclex-rn");
    await expectNotPageNotFound(page);
    await expect(page.locator(PREMIUM)).toBeVisible({ timeout: 90_000 });
    await assertDocumentNoHorizontalOverflow(page);
    await assertElementNoHorizontalOverflow(page, PREMIUM);
  });

  test("theme harness: data-theme ocean → midnight on RN hub", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await page.setViewportSize({ width: 1280, height: 800 });
    await gotoExpectOk(page, "/us/rn/nclex-rn");
    await expect(page.locator(PREMIUM)).toBeVisible({ timeout: 90_000 });
    await page.evaluate(() => document.documentElement.removeAttribute("data-theme"));
    await expect(page.locator('[data-nn-hub-section="identity-hero"]')).toBeVisible();
    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "midnight"));
    await page.waitForTimeout(200);
    await expect(page.locator('[data-nn-hub-section="identity-hero"]')).toBeVisible();
    await page.evaluate(() => document.documentElement.removeAttribute("data-theme"));
  });

  test("evidence screenshot — RN hub desktop (optional artifact)", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoExpectOk(page, "/us/rn/nclex-rn");
    await expectNotPageNotFound(page);
    await page.locator(PREMIUM).waitFor({ state: "visible", timeout: 120_000 });
    await page.screenshot({
      path: join(SCREENSHOT_OUT, "hub-figma-smoke-us-rn-desktop.png"),
      fullPage: true,
    });
  });
});
