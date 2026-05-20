/**
 * NP premium marketing hub workstation — theme + viewport screenshots.
 *
 * Run: npm run test:e2e:np-premium-hub-screenshots (from nursenest-core/)
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { expect, test } from "@playwright/test";
import { expectNotPageNotFound, gotoExpectOk, requireOrigin, seedUsMarketingCookie } from "../helpers/navigation-e2e";

const OUT_DIR = path.join(process.cwd(), "reports", "premium-np-hub-screenshots");
const ROUTE = "/us/np/fnp";

async function ensureOutDir() {
  await fs.promises.mkdir(OUT_DIR, { recursive: true });
}

async function applyTheme(page: import("@playwright/test").Page, theme: string) {
  await page.evaluate((t) => {
    document.documentElement.setAttribute("data-theme", t);
  }, theme);
}

test.describe("NP premium hub screenshots", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("desktop ocean", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await ensureOutDir();
    await page.setViewportSize({ width: 1280, height: 900 });
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, ROUTE);
    await expectNotPageNotFound(page);
    await expect(page.locator('[data-nn-np-premium-workstation="1"]')).toBeVisible({ timeout: 90_000 });
    await applyTheme(page, "ocean");
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(OUT_DIR, "np-fnp-hub--desktop--ocean.png"),
      fullPage: true,
    });
  });

  test("desktop midnight", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await ensureOutDir();
    await page.setViewportSize({ width: 1280, height: 900 });
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, ROUTE);
    await expectNotPageNotFound(page);
    await expect(page.locator('[data-nn-np-premium-workstation="1"]')).toBeVisible({ timeout: 90_000 });
    await applyTheme(page, "midnight");
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(OUT_DIR, "np-fnp-hub--desktop--midnight.png"),
      fullPage: true,
    });
  });

  test("mobile ocean", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await ensureOutDir();
    await page.setViewportSize({ width: 390, height: 844 });
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, ROUTE);
    await expectNotPageNotFound(page);
    await expect(page.locator('[data-nn-np-premium-workstation="1"]')).toBeVisible({ timeout: 90_000 });
    await applyTheme(page, "ocean");
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(OUT_DIR, "np-fnp-hub--mobile--ocean.png"),
      fullPage: true,
    });
  });
});
