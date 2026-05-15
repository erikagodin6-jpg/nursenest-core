/**
 * Performance-oriented smoke for marketing lesson hubs and category drill-down + lesson detail.
 * Run: `cd nursenest-core && npx playwright test tests/e2e/public/lesson-hub-performance.spec.ts --project=chromium`
 */
import { expect, test } from "@playwright/test";
import {
  expectNotPageNotFound,
  gotoExpectOk,
  requireOrigin,
  seedCaMarketingCookie,
  seedUsMarketingCookie,
} from "../helpers/navigation-e2e";

const LESSONS_SECTION = '[data-nn-qa-pathway-lessons-hub="true"]';
/** Index + category drill-down both mount the lesson library under this id. */
const LESSON_LIBRARY_ROOT = "#pathway-lesson-library";
const APP_ERROR_SCREEN = "[data-nn-app-error-screen]";
const HUB_TIMEOUT = 120_000;
/** Category-first index uses a responsive grid of category tiles — should stay well below full-catalog card counts. */
const MAX_CATEGORY_TILE_LINKS = 80;
/** Paginated category drill-down — cards per page must stay in marketing hub band (~40–60). */
const MAX_LESSON_CARDS_PER_CATEGORY_PAGE = 60;
/** Warm-path stability gate for anonymous marketing hubs (raise locally if cold-cache dev server exceeds). */
const HUB_INTERACTIVE_STABILITY_MS = 5_000;

/** Viewports required by acceptance criteria. */
const LAYOUT_VIEWPORTS = [
  { width: 375, height: 812, label: "mobile-375" },
  { width: 768, height: 1024, label: "tablet-768" },
  { width: 1024, height: 768, label: "desktop-1024" },
  { width: 1440, height: 900, label: "desktop-1440" },
] as const;

const BROWSE_HEADING = '[data-testid="browse-clinical-areas-heading"]';
const PILL_NAV = '[data-testid="lesson-hub-sticky-nav"]';

test.describe("lesson hub — layout smoke (title visibility + no pill overlap)", () => {
  for (const vp of LAYOUT_VIEWPORTS) {
    test(`${vp.label}: "Browse Clinical Areas" is visible and not behind pill nav`, async ({ page, baseURL }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const origin = requireOrigin(baseURL);
      await seedUsMarketingCookie(page, origin);
      await gotoExpectOk(page, "/us/rn/nclex-rn/lessons");
      await expect(page.locator(LESSONS_SECTION)).toBeVisible({ timeout: HUB_TIMEOUT });

      const heading = page.locator(BROWSE_HEADING);
      await expect(heading).toBeVisible();

      const pillNav = page.locator(PILL_NAV);
      await expect(pillNav).toBeVisible();

      const headingBox = await heading.boundingBox();
      const pillBox = await pillNav.boundingBox();

      expect(headingBox, "heading bounding box must be resolvable").not.toBeNull();
      expect(pillBox, "pill nav bounding box must be resolvable").not.toBeNull();

      if (headingBox && pillBox) {
        const pillBottom = pillBox.y + pillBox.height;
        expect(
          headingBox.y,
          `at ${vp.label}: "Browse Clinical Areas" top (${headingBox.y}px) must be below the pill nav bottom (${pillBottom}px)`,
        ).toBeGreaterThan(pillBottom);
      }
    });
  }
});

test.describe("lesson hub — performance smoke", () => {
  test("console: no page errors on hub + category + lesson navigation", async ({ page, baseURL }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => {
      errors.push(err.message);
    });
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    const t0 = performance.now();
    await gotoExpectOk(page, "/us/rn/nclex-rn/lessons");
    await expect(page.locator(APP_ERROR_SCREEN)).toHaveCount(0);
    await expect(page.locator(LESSONS_SECTION)).toBeVisible({ timeout: HUB_TIMEOUT });
    const hubMs = performance.now() - t0;
    expect(hubMs, "hub should become interactive within budget").toBeLessThan(240_000);
    await expectNotPageNotFound(page);
    await expect(page.getByRole("heading", { name: /^page could not load$/i })).toHaveCount(0);

    const tileLinks = page.locator("#pathway-lesson-library .grid a[href]");
    const tileCount = await tileLinks.count();
    expect(tileCount, "category-first hub should not render hundreds of top-level tiles").toBeLessThanOrEqual(
      MAX_CATEGORY_TILE_LINKS,
    );

    await gotoExpectOk(page, "/us/rn/nclex-rn/lessons/cardiovascular");
    await expect(page.locator(LESSON_LIBRARY_ROOT)).toBeVisible({ timeout: HUB_TIMEOUT });
    await expect(page.locator(APP_ERROR_SCREEN)).toHaveCount(0);
    const categoryCardLinks = page.locator("#pathway-lesson-library ul li a[href]");
    const cardCount = await categoryCardLinks.count();
    expect(
      cardCount,
      "paginated category page should not dump hundreds of lesson cards",
    ).toBeLessThanOrEqual(MAX_LESSON_CARDS_PER_CATEGORY_PAGE);

    await gotoExpectOk(page, "/us/rn/nclex-rn/lessons/us-rn-prioritization-abcs");
    await page.waitForSelector("h1.nn-lesson-page-title", { timeout: HUB_TIMEOUT });
    await expect(page.locator(APP_ERROR_SCREEN)).toHaveCount(0);
    expect(errors, `no pageerror during hub+lesson load: ${errors.join("; ")}`).toEqual([]);
  });

  test("Canada RN + RPN hubs: library landmark; capped category tiles; CA RN lesson detail", async ({
    page,
    baseURL,
  }) => {
    const origin = requireOrigin(baseURL);
    await seedCaMarketingCookie(page, origin);
    for (const path of ["/canada/rn/nclex-rn/lessons", "/canada/pn/rex-pn/lessons"] as const) {
      await gotoExpectOk(page, path);
      await expectNotPageNotFound(page);
      await expect(page.locator(APP_ERROR_SCREEN)).toHaveCount(0);
      await expect(page.locator(LESSONS_SECTION)).toBeVisible({ timeout: HUB_TIMEOUT });
      await expect(page.getByRole("heading", { name: /^page could not load$/i })).toHaveCount(0);
      const tileCount = await page.locator("#pathway-lesson-library .grid a[href]").count();
      expect(tileCount).toBeLessThanOrEqual(MAX_CATEGORY_TILE_LINKS);
    }

    await gotoExpectOk(page, "/canada/rn/nclex-rn/lessons/cardiovascular");
    await expect(page.locator(LESSON_LIBRARY_ROOT)).toBeVisible({ timeout: HUB_TIMEOUT });
    await expect(page.locator(APP_ERROR_SCREEN)).toHaveCount(0);
    const caCards = await page.locator("#pathway-lesson-library ul li a[href]").count();
    expect(caCards).toBeLessThanOrEqual(MAX_LESSON_CARDS_PER_CATEGORY_PAGE);

    await gotoExpectOk(page, "/canada/rn/nclex-rn/lessons/ca-rn-prioritization-abcs");
    await page.waitForSelector("h1.nn-lesson-page-title", { timeout: HUB_TIMEOUT });
    await expect(page.locator(APP_ERROR_SCREEN)).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /^page could not load$/i })).toHaveCount(0);
  });

  test("mobile: CA RN hub library visible", async ({ page, baseURL }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const origin = requireOrigin(baseURL);
    await seedCaMarketingCookie(page, origin);
    await gotoExpectOk(page, "/canada/rn/nclex-rn/lessons");
    await expect(page.locator(APP_ERROR_SCREEN)).toHaveCount(0);
    await expect(page.locator(LESSONS_SECTION)).toBeVisible({ timeout: HUB_TIMEOUT });
    await expect(page.getByRole("heading", { name: /^page could not load$/i })).toHaveCount(0);
  });

  test("anonymous US RN hub: interactive within stability budget", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    const t0 = performance.now();
    await gotoExpectOk(page, "/us/rn/nclex-rn/lessons");
    await expect(page.locator(LESSONS_SECTION)).toBeVisible({ timeout: HUB_TIMEOUT });
    await expect(page.locator(APP_ERROR_SCREEN)).toHaveCount(0);
    const hubMs = performance.now() - t0;
    expect(hubMs).toBeLessThan(HUB_INTERACTIVE_STABILITY_MS);
  });

  test("filtered hub (search) still renders — exercises cached list path", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/rn/nclex-rn/lessons?q=cardiac&page=1");
    await expectNotPageNotFound(page);
    await expect(page.locator(APP_ERROR_SCREEN)).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /^page could not load$/i })).toHaveCount(0);
    await expect(page.locator('[data-nn-lessons-marketing-hub="1"]')).toBeVisible({ timeout: HUB_TIMEOUT });
  });
});
