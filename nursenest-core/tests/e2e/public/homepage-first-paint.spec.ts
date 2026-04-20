/**
 * Real-browser verification: marketing `/` first paint (header, hero, order, motion, mobile drawer).
 *
 * Artifacts: screenshots under each test's output dir (see Playwright report / test-results).
 *
 * Run from `nursenest-core`:
 *   npx playwright test tests/e2e/public/homepage-first-paint.spec.ts --project=chromium
 *
 * Requires local dev (default webServer) or PLAYWRIGHT_SKIP_WEB_SERVER=1 + running app on BASE_URL.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";

/** Matches `SELECTOR_DISMISSED_KEY` — prevents `ExamSelector` full-page scrim from blocking clicks on `/`. */
const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";

test.beforeEach(async ({ context }) => {
  await context.addInitScript((key) => {
    try {
      localStorage.setItem(key, "1");
    } catch {
      /* private mode / quota */
    }
  }, SELECTOR_DISMISSED_LS);
});

async function minOpacity(locator: Locator): Promise<number> {
  return locator.evaluate((el) => parseFloat(window.getComputedStyle(el).opacity));
}

async function assertCriticalVisible(page: Page, label: string) {
  const header = page.locator("header.nn-header-animate-in").first();
  const hero = page.getByTestId("hero-section");
  const heading = page.getByTestId("text-hero-heading");

  await expect(header, `${label}: header`).toBeVisible({ timeout: 30_000 });
  await expect(hero, `${label}: hero section`).toBeVisible({ timeout: 30_000 });
  await expect(heading, `${label}: hero heading`).toBeVisible({ timeout: 30_000 });

  const ho = await minOpacity(header);
  const hh = await minOpacity(heading);
  expect(ho, `${label}: header opacity`).toBeGreaterThanOrEqual(0.99);
  expect(hh, `${label}: hero heading opacity`).toBeGreaterThanOrEqual(0.99);
}

async function assertVerticalOrder(page: Page) {
  const order = await page.evaluate(() => {
    const header = document.querySelector("header.nn-header-animate-in");
    const hero = document.querySelector('[data-testid="hero-section"]');
    const intro = document.querySelector('section[aria-label="Global marketing overview"]');
    const footer = document.querySelector("footer");
    if (!header || !hero || !intro || !footer) {
      return {
        ok: false,
        missing: {
          header: !header,
          hero: !hero,
          intro: !intro,
          footer: !footer,
        },
      };
    }
    const tHeader = header.getBoundingClientRect().top;
    const tHero = hero.getBoundingClientRect().top;
    const tIntro = intro.getBoundingClientRect().top;
    const tFooter = footer.getBoundingClientRect().top;
    const ok = tHeader <= tHero && tHero <= tIntro && tIntro <= tFooter;
    return { ok, tHeader, tHero, tIntro, tFooter };
  });
  expect(order.ok, `DOM vertical order: ${JSON.stringify(order)}`).toBe(true);
}

/** Full-screen mobile nav overlay uses z-[200]; must not exist when menu is closed. */
async function assertMobileMenuClosed(page: Page) {
  const closeMenuButtons = page.getByRole("button", { name: /close menu/i });
  await expect(closeMenuButtons).toHaveCount(0);
}

test.describe("Homepage first paint — desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("cold load: early + settle screenshots, header/hero visible, order", async ({ page }, testInfo) => {
    await page.goto("/", { waitUntil: "commit" });
    const earlyPath = testInfo.outputPath("desktop-cold-commit.png");
    await page.screenshot({ path: earlyPath, fullPage: false });

    await assertCriticalVisible(page, "desktop cold (commit)");
    await assertMobileMenuClosed(page);

    await page.waitForLoadState("domcontentloaded");
    await assertCriticalVisible(page, "desktop cold (domcontentloaded)");
    await assertVerticalOrder(page);

    const domPath = testInfo.outputPath("desktop-cold-domcontentloaded.png");
    await page.screenshot({ path: domPath, fullPage: false });

    await page.waitForLoadState("load");
    const settlePath = testInfo.outputPath("desktop-cold-settled-load.png");
    await page.screenshot({ path: settlePath, fullPage: false });

    await expect(page.getByTestId("hero-section")).toBeVisible();
    await expect(page.getByTestId("text-hero-heading")).not.toHaveText(/^\s*$/);
  });

  test("soft navigation away and back: hero stays visible", async ({ page }, testInfo) => {
    await page.goto("/", { waitUntil: "load" });
    await assertCriticalVisible(page, "soft nav start");

    // Full-page scrims (e.g. feedback / promos) can sit above the footer link — match nav audit pattern.
    await dismissMarketingScrims(page);
    await page.locator("footer").scrollIntoViewIfNeeded();

    // Client-side away from `/` (browser back returns to cached `/` without relying on logo target).
    await Promise.all([
      page.waitForURL(/\/contact/, { timeout: 60_000, waitUntil: "domcontentloaded" }),
      page.locator("footer").getByRole("link", { name: /contact support/i }).first().click(),
    ]);
    await page.screenshot({ path: testInfo.outputPath("desktop-soft-nav-away-contact.png"), fullPage: false });

    await Promise.all([
      page.waitForURL(
        (url) => {
          const p = new URL(url).pathname;
          return p === "/" || p === "";
        },
        { timeout: 60_000, waitUntil: "domcontentloaded" },
      ),
      page.goBack(),
    ]);
    await assertCriticalVisible(page, "soft nav back home");
    await page.screenshot({ path: testInfo.outputPath("desktop-after-soft-nav-home.png"), fullPage: false });
  });

  test("slow CPU + slow network: no blank hero at domcontentloaded", async ({ page, context }, testInfo) => {
    const session = await context.newCDPSession(page);
    await session.send("Network.enable");
    await session.send("Network.emulateNetworkConditions", {
      offline: false,
      downloadThroughput: (400 * 1024) / 8,
      uploadThroughput: (400 * 1024) / 8,
      latency: 250,
    });
    await session.send("Emulation.setCPUThrottlingRate", { rate: 6 }).catch(() => {
      /* optional in some environments */
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await assertCriticalVisible(page, "throttled domcontentloaded");
    await page.screenshot({ path: testInfo.outputPath("desktop-throttled-domcontentloaded.png"), fullPage: false });
  });
});

test.describe("Homepage first paint — mobile width", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("cold load: header + hero visible; menu closed", async ({ page }, testInfo) => {
    await page.goto("/", { waitUntil: "commit" });
    await page.screenshot({ path: testInfo.outputPath("mobile-cold-commit.png"), fullPage: false });

    await assertCriticalVisible(page, "mobile cold");
    await assertMobileMenuClosed(page);

    await page.waitForLoadState("load");
    await assertVerticalOrder(page);
    await page.screenshot({ path: testInfo.outputPath("mobile-cold-settled.png"), fullPage: false });
  });
});

test.describe("Homepage first paint — reduced motion", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("prefers-reduced-motion: header and hero fully visible", async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await assertCriticalVisible(page, "reduced motion");
    await assertVerticalOrder(page);
    await page.screenshot({ path: testInfo.outputPath("reduced-motion-settled.png"), fullPage: false });
  });
});
