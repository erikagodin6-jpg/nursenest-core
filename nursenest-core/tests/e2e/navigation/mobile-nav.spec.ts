/**
 * Mobile marketing navigation: hamburger drawer, region/settings drawer, links, keyboard.
 *
 * Run: `npx playwright test tests/e2e/navigation/mobile-nav.spec.ts`
 */
import { expect, test } from "@playwright/test";
import { CANONICAL_PATHWAY_HUB } from "../../../src/lib/marketing/canonical-pathway-hubs";
import { expectMobileRegionSettingsHeading, openMobileRegionLanguageDrawer } from "../helpers/mobile-drawer";
import {
  expectMarketingPublicShell,
  expectNotPageNotFound,
  gotoExpectOk,
  requireOrigin,
  seedUsMarketingCookie,
} from "../helpers/navigation-e2e";

test.describe("Mobile header navigation (public marketing)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test("hamburger opens and closes without dead controls", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expectMarketingPublicShell(page);

    const openBtn = page.getByRole("button", { name: /^Open menu$/ });
    await openBtn.click();
    // Backdrop + header both use `aria-label="Close menu"` — use `.first()` to satisfy strict mode.
    const closeMenu = page.getByRole("button", { name: /^Close menu$/ });
    await expect(closeMenu.first()).toBeVisible({ timeout: 15_000 });

    await closeMenu.first().click();
    await expect(closeMenu).toHaveCount(0);
  });

  test("mobile drawer: expand RN and follow hub link", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expectMarketingPublicShell(page);

    await page.getByRole("button", { name: /^Open menu$/ }).click();
    await page.getByRole("button", { name: /^RN$/ }).click();
    const mobileRnPanel = page.locator("#mobile-mega-rn");
    await expect(mobileRnPanel).toBeVisible({ timeout: 20_000 });
    await mobileRnPanel.getByRole("link", { name: /Open Hub/i }).click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(new RegExp(`${CANONICAL_PATHWAY_HUB.usRn.replace(/\//g, "\\/")}(?:\\/|\\?|#|$)`));
    await expectNotPageNotFound(page);
  });

  test("mobile drawer: primary link (Pricing) navigates", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expectMarketingPublicShell(page);

    await page.getByRole("button", { name: /^Open menu$/ }).click();
    await page.getByRole("link", { name: /^Pricing$/ }).click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/pricing/);
    await expectNotPageNotFound(page);
  });

  test("region & settings drawer opens and closes", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expectMarketingPublicShell(page);

    await openMobileRegionLanguageDrawer(page);
    await expectMobileRegionSettingsHeading(page);
    await page.getByRole("button", { name: /^Close settings$/ }).first().click();
    await expect(page.getByRole("heading", { name: /Region & Settings/i })).toHaveCount(0);
  });

  test("footer link works on mobile viewport", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expectMarketingPublicShell(page);

    const blog = page.locator("footer").getByRole("link", { name: /^Blog$/ }).first();
    await blog.scrollIntoViewIfNeeded();
    await blog.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/blog/);
    await expectNotPageNotFound(page);
  });

  test("history back after in-drawer navigation", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expectMarketingPublicShell(page);

    await page.getByRole("button", { name: /^Open menu$/ }).click();
    await page.getByRole("link", { name: /^FAQ$/ }).click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/faq/);

    await page.goBack();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/$/);
  });

  test("no duplicate in-content region radiogroup (mobile)", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/tools");
    await expectMarketingPublicShell(page);
    await expect(page.locator("main [role='radiogroup']")).toHaveCount(0);
  });

  test("keyboard: Open menu via Enter, then Close menu", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expectMarketingPublicShell(page);

    await page.getByRole("button", { name: /^Open menu$/ }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: /^Close menu$/ }).first()).toBeVisible({ timeout: 15_000 });

    // Backdrop and header can both expose "Close menu"; the backdrop dismisses the drawer.
    await page.getByRole("button", { name: /^Close menu$/ }).first().click();
    await expect(page.getByRole("button", { name: /^Close menu$/ })).toHaveCount(0);
  });

  test("keyboard: Region and language settings opens with Enter", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expectMarketingPublicShell(page);

    await page.getByRole("button", { name: /Region and language settings/i }).focus();
    await page.keyboard.press("Enter");
    await expectMobileRegionSettingsHeading(page);
  });
});
