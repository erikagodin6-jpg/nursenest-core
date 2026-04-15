/**
 * Desktop marketing header: primary strip, mega menus, auth CTAs, footer, history, keyboard.
 *
 * Requires dev server (`npm run dev`) and default locale (en) so `withMarketingLocale` keeps bare paths.
 *
 * Run: `npx playwright test tests/e2e/navigation/header-nav.spec.ts`
 */
import { expect, test } from "@playwright/test";
import { CANONICAL_PATHWAY_HUB } from "../../../src/lib/marketing/canonical-pathway-hubs";
import { HEADER_CHROME } from "../helpers/country-selector";
import {
  DESKTOP_MEGA_TIER_NAV,
  DESKTOP_PRIMARY_STRIP_NAV,
  expectMarketingPublicShell,
  expectNotPageNotFound,
  gotoExpectOk,
  requireOrigin,
  seedUsMarketingCookie,
} from "../helpers/navigation-e2e";

test.describe("Desktop header navigation (public marketing)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test("primary strip links change route and render (Who we help)", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expectMarketingPublicShell(page);

    const strip = page.locator(DESKTOP_PRIMARY_STRIP_NAV).first();
    const cases: { name: RegExp; pathRe: RegExp }[] = [
      { name: /^Pricing$/, pathRe: /\/pricing(?:\/|$)/ },
      { name: /^Blog$/, pathRe: /\/blog(?:\/|$)/ },
      { name: /^FAQ$/, pathRe: /\/faq(?:\/|$)/ },
      { name: /^Tools$/, pathRe: /\/tools(?:\/|$)/ },
    ];

    for (const c of cases) {
      await gotoExpectOk(page, "/");
      await expectMarketingPublicShell(page);
      await strip.getByRole("link", { name: c.name }).click();
      await page.waitForLoadState("domcontentloaded");
      await expect(page).toHaveURL(c.pathRe);
      await expectNotPageNotFound(page);
    }
  });

  /** Split out: `/pre-nursing` is heavier in dev (RSC); keeps the core strip loop fast and stable. */
  test("primary strip — Pre-Nursing link navigates", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expectMarketingPublicShell(page);

    const strip = page.locator(DESKTOP_PRIMARY_STRIP_NAV).first();
    await strip.getByRole("link", { name: /^Pre-Nursing$/ }).click();
    await page.waitForURL(/\/pre-nursing(?:\/|$)/, { timeout: 120_000 });
    expect(page.url(), "avoid crashed-tab interstitial").not.toMatch(/chrome-error/);
    await expectNotPageNotFound(page);
  });

  test("mega menu RN → hub link navigates to US RN pathway hub", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expectMarketingPublicShell(page);

    const tier = page.locator(DESKTOP_MEGA_TIER_NAV);
    const rnBtn = tier.getByRole("button", { name: /^RN$/ });
    // Pointer clicks race `onMouseLeave` on `<header>` (mega panel is `absolute top-full`). Opening via
    // keyboard focus matches `onFocus={() => setOpenMegaMenu(...)}` on the tier button — stable in automation.
    await rnBtn.focus();
    await expect(rnBtn).toBeFocused();
    // Mega panel: `#mega-menu-{key}` in `site-header.tsx` (more reliable than `role="dialog"` + `hidden md:block`).
    const megaPanel = page.locator("#mega-menu-rn");
    await expect(megaPanel).toBeVisible({ timeout: 20_000 });
    await megaPanel.getByRole("link", { name: /Open Hub/i }).click({ force: true });
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(new RegExp(`${CANONICAL_PATHWAY_HUB.usRn.replace(/\//g, "\\/")}(?:\\/|\\?|#|$)`));
    await expectNotPageNotFound(page);
  });

  test("Log in header link targets login with callback", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expectMarketingPublicShell(page);

    const login = page.locator(HEADER_CHROME).getByRole("link", { name: /Log in to your NurseNest account/i });
    await expect(login).toBeVisible();
    await expect(login).toHaveAttribute("href", /\/login\?/);
    await login.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/login/);
    await expectNotPageNotFound(page);
  });

  test("footer Explore + Account links navigate", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expectMarketingPublicShell(page);

    const footer = page.locator("footer");
    const pricing = footer.getByRole("link", { name: /^Pricing$/ }).first();
    await pricing.scrollIntoViewIfNeeded();
    await pricing.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/pricing/);
    await expectNotPageNotFound(page);

    await gotoExpectOk(page, "/");
    const lessons = footer.getByRole("link", { name: /^Lessons$/ }).first();
    await lessons.scrollIntoViewIfNeeded();
    await lessons.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/lessons/);
    await expectNotPageNotFound(page);

    await gotoExpectOk(page, "/");
    const contact = footer.getByRole("link", { name: /Contact Support/i }).first();
    await contact.scrollIntoViewIfNeeded();
    await contact.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/contact/);
    await expectNotPageNotFound(page);
  });

  test("history: home → pricing → back → forward", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expectMarketingPublicShell(page);
    await page.locator(DESKTOP_PRIMARY_STRIP_NAV).first().getByRole("link", { name: /^Pricing$/ }).click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/pricing/);

    await page.goBack();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/$/);

    await page.goForward();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/pricing/);
    await expectNotPageNotFound(page);
  });

  test("no duplicate in-content region radiogroup on marketing page", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/pricing");
    await expectMarketingPublicShell(page);
    await expect(page.locator("main [role='radiogroup']")).toHaveCount(0);
  });

  test("keyboard: RN mega opens with Enter when focused", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expectMarketingPublicShell(page);

    const rn = page.locator(DESKTOP_MEGA_TIER_NAV).getByRole("button", { name: /^RN$/ });
    await rn.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#mega-menu-rn")).toBeVisible({ timeout: 20_000 });
  });

  test("keyboard: country selector button opens listbox with Enter", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expectMarketingPublicShell(page);

    const countryBtn = page
      .locator(HEADER_CHROME)
      .getByRole("button", { name: /Country: United States|Region: United States/i })
      .first();
    await countryBtn.focus();
    await page.keyboard.press("Enter");
    await expect(
      page.locator(`${HEADER_CHROME} [role="listbox"][aria-label="Select country"]`),
    ).toBeVisible({ timeout: 15_000 });
  });
});
