/**
 * Performance-oriented smoke for marketing lesson hubs and one lesson detail route.
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
const HUB_TIMEOUT = 120_000;
/** Category-first index uses a responsive grid of category tiles — should stay well below full-catalog card counts. */
const MAX_CATEGORY_TILE_LINKS = 80;

test.describe("lesson hub — performance smoke", () => {
  test("console: no page errors on hub + lesson navigation", async ({ page, baseURL }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => {
      errors.push(err.message);
    });
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    const t0 = performance.now();
    await gotoExpectOk(page, "/us/rn/nclex-rn/lessons");
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

    await gotoExpectOk(
      page,
      "/us/rn/nclex-rn/lessons/us-rn-prioritization-abcs",
    );
    await page.waitForSelector("h1.nn-lesson-page-title", { timeout: HUB_TIMEOUT });
    expect(errors, `no pageerror during hub+lesson load: ${errors.join("; ")}`).toEqual([]);
  });

  test("Canada RN + RPN hubs: library landmark; capped category tiles; CA RN lesson detail", async ({
    page,
    baseURL,
  }) => {
    const origin = requireOrigin(baseURL);
    await seedCaMarketingCookie(page, origin);
    for (const path of ["/canada/rn/nclex-rn/lessons", "/canada/rpn/rex-pn/lessons"] as const) {
      await gotoExpectOk(page, path);
      await expectNotPageNotFound(page);
      await expect(page.locator(LESSONS_SECTION)).toBeVisible({ timeout: HUB_TIMEOUT });
      await expect(page.getByRole("heading", { name: /^page could not load$/i })).toHaveCount(0);
      const tileCount = await page.locator("#pathway-lesson-library .grid a[href]").count();
      expect(tileCount).toBeLessThanOrEqual(MAX_CATEGORY_TILE_LINKS);
    }

    await gotoExpectOk(page, "/canada/rn/nclex-rn/lessons/ca-rn-prioritization-abcs");
    await page.waitForSelector("h1.nn-lesson-page-title", { timeout: HUB_TIMEOUT });
    await expect(page.getByRole("heading", { name: /^page could not load$/i })).toHaveCount(0);
  });

  test("mobile: CA RN hub library visible", async ({ page, baseURL }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const origin = requireOrigin(baseURL);
    await seedCaMarketingCookie(page, origin);
    await gotoExpectOk(page, "/canada/rn/nclex-rn/lessons");
    await expect(page.locator(LESSONS_SECTION)).toBeVisible({ timeout: HUB_TIMEOUT });
    await expect(page.getByRole("heading", { name: /^page could not load$/i })).toHaveCount(0);
  });

  test("filtered hub (search) still renders — exercises cached list path", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/rn/nclex-rn/lessons?q=cardiac&page=1");
    await expectNotPageNotFound(page);
    await expect(page.getByRole("heading", { name: /^page could not load$/i })).toHaveCount(0);
    await expect(page.locator('[data-nn-lessons-marketing-hub="1"]')).toBeVisible({ timeout: HUB_TIMEOUT });
  });
});
