/**
 * Pre-deploy regression — highest-risk public marketing flows (desktop + mobile).
 *
 * Run before deploy:
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 npx playwright test tests/e2e/public/pre-deploy-regression.spec.ts --project=chromium
 *
 * Screenshots: `only-on-failure` (see playwright.config.ts) under `test-results/`.
 */
import { expect, test, type Page } from "@playwright/test";
import { CANONICAL_PATHWAY_HUB } from "../../../src/lib/marketing/canonical-pathway-hubs";
import { MARKETING_REGION_COOKIE } from "../../../src/lib/region/marketing-region-cookie";
import { LESSON_FLOW_PATHWAY_QA } from "../../../src/lib/qa/lesson-flow-pathways";
import { HEADER_CHROME, setGlobalRegionCookie } from "../helpers/country-selector";
import { expectMobileRegionSettingsHeading, openMobileRegionLanguageDrawer } from "../helpers/mobile-drawer";
import {
  expectNotPageNotFound,
  gotoExpectOk,
  MARKETING_PUBLIC_SELECTOR,
  requireOrigin,
  seedUsMarketingCookie,
} from "../helpers/navigation-e2e";
import { isLearnerNavInternalHref } from "../helpers/learner-shell";

const usRn = LESSON_FLOW_PATHWAY_QA.find((x) => x.pathwayId === "us-rn-nclex-rn");
if (!usRn) throw new Error("us-rn-nclex-rn missing from LESSON_FLOW_PATHWAY_QA");

async function dismissScrims(page: Page) {
  for (let i = 0; i < 5; i++) await page.keyboard.press("Escape");
}

function marketingShell(page: Page) {
  return page.locator('[data-nn-nav-mode="public"]').first();
}

test.describe("Pre-deploy regression — desktop", () => {
  test("homepage — shell + brand home link", async ({ page, baseURL }) => {
    requireOrigin(baseURL);
    await gotoExpectOk(page, "/");
    await expect(marketingShell(page)).toBeVisible({ timeout: 60_000 });
    await expect(page.getByRole("link", { name: /NurseNest home/i })).toBeVisible();
    await expectNotPageNotFound(page);
  });

  test("nav — marketing strip → Pricing", async ({ page, baseURL }) => {
    requireOrigin(baseURL);
    await gotoExpectOk(page, "/");
    await dismissScrims(page);
    await expect(marketingShell(page)).toBeVisible({ timeout: 60_000 });
    const marketingNav = page.getByRole("navigation", { name: /who we help|marketing|explore/i });
    const pricing = marketingNav.getByRole("link", { name: /^Pricing$/i }).first();
    await expect(pricing).toBeVisible({ timeout: 30_000 });
    await pricing.evaluate((el: HTMLElement) => (el as HTMLAnchorElement).click());
    await expect(page).toHaveURL(/\/pricing\/?(\?|$)/, { timeout: 60_000 });
    await expectNotPageNotFound(page);
  });

  test("country selector — listbox opens, Canada visible", async ({ page, baseURL }) => {
    requireOrigin(baseURL);
    await setGlobalRegionCookie(page, "us", baseURL);
    await gotoExpectOk(page, "/");
    await dismissScrims(page);
    await expect(marketingShell(page)).toBeVisible({ timeout: 60_000 });
    const regionBtn = page
      .locator(HEADER_CHROME)
      .getByRole("button", { name: /Country: United States|Region: United States/i })
      .first();
    await expect(regionBtn).toBeVisible({ timeout: 30_000 });
    await regionBtn.click({ force: true });
    await page.locator(`${HEADER_CHROME} [role="listbox"][aria-label="Select country"]`).waitFor({
      state: "visible",
      timeout: 30_000,
    });
    await expect(page.getByRole("option", { name: /Canada/i }).first()).toBeVisible();
  });

  test("pricing — loads with marketing chrome", async ({ page, baseURL }) => {
    requireOrigin(baseURL);
    await gotoExpectOk(page, "/pricing");
    await expect(marketingShell(page)).toBeVisible({ timeout: 60_000 });
    await expectNotPageNotFound(page);
  });

  test("login — loads", async ({ page, baseURL }) => {
    requireOrigin(baseURL);
    await gotoExpectOk(page, "/login");
    await expect(page.getByRole("heading", { name: /welcome|log in|sign in/i })).toBeVisible({ timeout: 30_000 });
    await expectNotPageNotFound(page);
  });

  test("signup — loads", async ({ page, baseURL }) => {
    requireOrigin(baseURL);
    await gotoExpectOk(page, "/signup");
    await expect(page.locator("main, [role='main']").first()).toBeVisible({ timeout: 30_000 });
    await expectNotPageNotFound(page);
  });

  test("lesson hub — US RN pathway hub", async ({ page, baseURL }) => {
    requireOrigin(baseURL);
    await page.context().addCookies([{ name: MARKETING_REGION_COOKIE, value: "US", url: baseURL! }]);
    await gotoExpectOk(page, usRn.hubPath);
    await expect(marketingShell(page)).toBeVisible({ timeout: 60_000 });
    await expectNotPageNotFound(page);
  });

  test("lesson pages (3) — discover slugs from US RN hub list, then HTTP OK + no 404 heading", async ({
    page,
    baseURL,
  }) => {
    requireOrigin(baseURL);
    await page.context().addCookies([{ name: MARKETING_REGION_COOKIE, value: "US", url: baseURL! }]);
    await gotoExpectOk(page, usRn.lessonsPath);
    await dismissScrims(page);
    await expect(marketingShell(page)).toBeVisible({ timeout: 60_000 });

    const paths = await page.evaluate(() => {
      const out: string[] = [];
      const seen = new Set<string>();
      for (const a of document.querySelectorAll<HTMLAnchorElement>('a[href*="/lessons/"]')) {
        const u = new URL(a.href, window.location.href);
        const segs = u.pathname.split("/").filter(Boolean);
        const li = segs.indexOf("lessons");
        if (li < 0 || segs.length <= li + 1) continue;
        if (segs[li + 1] === "topics") continue;
        const p = u.pathname + u.search;
        if (!seen.has(p)) {
          seen.add(p);
          out.push(p);
        }
        if (out.length >= 3) break;
      }
      return out;
    });

    expect(paths.length, "need ≥3 lesson detail links on hub (check hub data / env)").toBeGreaterThanOrEqual(3);

    for (const p of paths.slice(0, 3)) {
      const r = await page.goto(p, { waitUntil: "domcontentloaded", timeout: 120_000 });
      expect(r?.ok(), `${p} HTTP ${r?.status()}`).toBeTruthy();
      await expect(page.locator("body")).toBeVisible();
      await expect(page.getByRole("heading", { name: /^page not found$/i })).toHaveCount(0);
      await expect(marketingShell(page)).toBeVisible({ timeout: 45_000 });
    }
  });

  test("blog hub — index loads", async ({ page, baseURL }) => {
    requireOrigin(baseURL);
    await gotoExpectOk(page, "/blog");
    await expect(marketingShell(page)).toBeVisible({ timeout: 60_000 });
    await expectNotPageNotFound(page);
  });

  test("footer — sample internal links return OK (HTTP)", async ({ page, baseURL, request }) => {
    requireOrigin(baseURL);
    const origin = baseURL!;
    await gotoExpectOk(page, "/");
    await expect(marketingShell(page)).toBeVisible({ timeout: 60_000 });
    const footer = page.locator("footer");
    const hrefs = await footer.locator('a[href^="/"]').evaluateAll((els) =>
      [...new Set(els.map((a) => (a as HTMLAnchorElement).getAttribute("href") || ""))].filter(
        (h) =>
          h &&
          !isLearnerNavInternalHref(h) &&
          h !== "/" &&
          !h.startsWith("/login?") &&
          !h.startsWith("/signup?"),
      ),
    );
    const sample = hrefs.slice(0, 8);
    expect(sample.length, "footer should expose internal links").toBeGreaterThan(0);
    for (const path of sample) {
      const url = new URL(path, origin).href;
      const res = await request.get(url, { timeout: 45_000 });
      expect(res.ok(), `${path} → HTTP ${res.status()}`).toBeTruthy();
    }
  });
});

test.describe("Pre-deploy regression — mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test("mobile drawer — open / close hamburger", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR).first()).toBeVisible({ timeout: 60_000 });
    await page.getByRole("button", { name: /^Open menu$/ }).click();
    const closeMenu = page.getByRole("button", { name: /^Close menu$/ });
    await expect(closeMenu.last()).toBeVisible({ timeout: 15_000 });
    await closeMenu.last().click();
    await expect(closeMenu).toHaveCount(0);
  });

  test("mobile drawer — RN expand → US RN hub", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR).first()).toBeVisible({ timeout: 60_000 });
    await page.getByRole("button", { name: /^Open menu$/ }).click();
    await page.getByRole("button", { name: /^RN$/ }).click();
    const mobileRnPanel = page.locator("#mobile-mega-rn");
    await expect(mobileRnPanel).toBeVisible({ timeout: 20_000 });
    await mobileRnPanel.getByRole("link", { name: /RN Exam Hub/i }).click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(new RegExp(`${CANONICAL_PATHWAY_HUB.usRn.replace(/\//g, "\\/")}(?:\\/|\\?|#|$)`));
    await expectNotPageNotFound(page);
  });

  test("mobile drawer — Pricing link", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR).first()).toBeVisible({ timeout: 60_000 });
    await page.getByRole("button", { name: /^Open menu$/ }).click();
    await page.locator(".nn-header-animate-in").getByRole("link", { name: /^Pricing$/ }).first().click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/pricing/);
    await expectNotPageNotFound(page);
  });

  test("country / language — region drawer opens", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR).first()).toBeVisible({ timeout: 60_000 });
    await openMobileRegionLanguageDrawer(page);
    await expectMobileRegionSettingsHeading(page);
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll<HTMLButtonElement>('button[aria-label="Close settings"]'));
      btns[btns.length - 1]?.click();
    });
    await expect(page.getByRole("heading", { name: /Region & Settings/i })).toHaveCount(0);
  });
});
