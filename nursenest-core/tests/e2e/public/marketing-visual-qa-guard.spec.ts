/**
 * Strict visual/copy QA guards for **public marketing** routes (no UI redesign — assertions only).
 *
 * Requires a running app (`BASE_URL`, default http://localhost:3000). Typical local workflow:
 * `npm run build && npm run start` then `npx playwright test tests/e2e/public/marketing-visual-qa-guard.spec.ts --project=chromium`
 *
 * @see docs/testing/marketing-visual-qa-guards.md
 */
import { expect, test, type Page } from "@playwright/test";
import {
  applyMidnightThemeFromPicker,
  assertCapitalizationHeuristics,
  assertMarketingHeroHeadingContrast,
  assertNoHorizontalOverflow,
  assertNoPlaceholderText,
} from "../helpers/marketing-qa";

const SHARED_ROUTES = ["/", "/pricing", "/blog"] as const;

const MOBILE_WIDTHS = [320, 375, 390, 768] as const;

async function gotoMarketing(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: "load", timeout: 120_000 });
  await page.waitForSelector("main", { timeout: 60_000 });
  await page.waitForTimeout(600);
}

test.describe("Marketing visual QA guard — shared routes", () => {
  for (const route of SHARED_ROUTES) {
    test(`no placeholder / junk copy in main (${route})`, async ({ page }) => {
      await gotoMarketing(page, route);
      await assertNoPlaceholderText(page, page.locator("main"));
    });

    test(`capitalization heuristics on h1/h2 in main (${route})`, async ({ page }) => {
      await gotoMarketing(page, route);
      await assertCapitalizationHeuristics(page.locator("main"));
    });

    test(`no horizontal overflow — mobile widths (${route})`, async ({ page }) => {
      for (const w of MOBILE_WIDTHS) {
        await page.setViewportSize({ width: w, height: 900 });
        await gotoMarketing(page, route);
        await assertNoHorizontalOverflow(page, 1);
      }
    });
  }
});

test.describe("Marketing visual QA guard — homepage CTAs", () => {
  test("hero primary → question bank, secondary → lessons (localized paths allowed)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoMarketing(page, "/");

    const hero = page.locator(".nn-home-marketing-rich-hero");
    await expect(hero).toBeVisible();

    const links = hero.getByRole("link");
    const href0 = await links.nth(0).getAttribute("href");
    const href1 = await links.nth(1).getAttribute("href");
    expect(href0, "hero primary CTA href").toMatch(/question-bank/);
    expect(href1, "hero secondary CTA href").toMatch(/\/lessons(\?|$|\/)/);
  });

  test("final premium CTA — signup + pricing href patterns", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoMarketing(page, "/");

    const primary = page.getByTestId("premium-final-cta-primary");
    const secondary = page.getByTestId("premium-final-cta-secondary");
    test.skip((await primary.count()) === 0, "premium final CTA not rendered on this homepage variant");

    const signupHref = await primary.getAttribute("href");
    const pricingHref = await secondary.getAttribute("href");
    expect(signupHref).toMatch(/\/signup(\?|$)/);
    expect(pricingHref).toMatch(/\/pricing(\?|$)/);
  });
});

test.describe("Marketing visual QA guard — dark theme (Midnight)", () => {
  test("Midnight theme: hero heading has pragmatic contrast vs section bg", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoMarketing(page, "/");

    const applied = await applyMidnightThemeFromPicker(page);
    test.skip(!applied, "Theme picker or Midnight option not available — see docs for emulateMedia limitation");

    await assertMarketingHeroHeadingContrast(page, "#home-conversion-hero-heading");
  });
});
