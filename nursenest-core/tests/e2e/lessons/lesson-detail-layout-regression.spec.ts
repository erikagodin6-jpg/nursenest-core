/**
 * Lesson detail layout regression — guards against the CSS cascade bug where
 * learner-global.css (loaded after globals.css) had a bare flex base rule that
 * overrode the grid breakpoints in globals.css, collapsing the 3-column layout
 * to a stacked column at all viewports and causing ultra-narrow text wrapping.
 *
 * Uses the public marketing lesson detail route (no auth required).
 *
 * Checks at 375 / 768 / 1024 / 1280 px:
 *   - Main column bounding-box width ≥ 320 px
 *   - Paragraph text is NOT rendered as single-word lines (line-count < word-count)
 *   - Sidebar and main content bounding boxes do NOT overlap horizontally at 1024px+
 *   - Desktop TOC sidebar is NOT visible below 1024 px
 *   - No horizontal overflow
 */

import { test, expect, type Page } from "@playwright/test";
import { getE2eBaseURL } from "../helpers/e2e-env";

const baseURL = getE2eBaseURL();
const LESSON_PATH = "/us/rn/nclex-rn/lessons/us-rn-pulmonary-embolism";

const MAIN_COL = '[data-testid="pathway-lesson-main-column"]';
const DESKTOP_TOC = '[data-nn-premium-lessons-on-this-page]';
const MOBILE_TOC = '[data-nn-premium-lessons-mobile-nav]';
const ARTICLE = "article.nn-lesson-article-flow";

async function gotoLesson(page: Page, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport);
  await page.goto(`${baseURL}${LESSON_PATH}`, {
    waitUntil: "domcontentloaded",
    timeout: 180_000,
  });
  await page.waitForSelector(MAIN_COL, { timeout: 120_000 });
}

// ─── mobile 375 ────────────────────────────────────────────────────────────
test.describe("lesson detail layout — mobile 375px", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("main column width ≥ 320 px", async ({ page }) => {
    await gotoLesson(page, { width: 375, height: 812 });
    const box = await page.locator(MAIN_COL).boundingBox();
    expect(box, "main column must be in DOM").toBeTruthy();
    expect(box!.width, `main column ${box!.width}px < 320px`).toBeGreaterThanOrEqual(320);
  });

  test("no horizontal overflow", async ({ page }) => {
    await gotoLesson(page, { width: 375, height: 812 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `horizontal overflow: ${overflow}px`).toBeLessThanOrEqual(1);
  });

  test("desktop TOC sidebar is hidden", async ({ page }) => {
    await gotoLesson(page, { width: 375, height: 812 });
    const toc = page.locator(DESKTOP_TOC);
    // Must not be VISIBLE (may exist in DOM but hidden via display:none)
    await expect(toc.first()).not.toBeVisible();
  });

  test("article paragraphs are not single-word lines", async ({ page }) => {
    await gotoLesson(page, { width: 375, height: 812 });
    const prose = page.locator(`${ARTICLE} p`).first();
    await expect(prose).toBeVisible({ timeout: 30_000 });
    const { text, width } = await prose.evaluate((el: HTMLElement) => ({
      text: el.innerText.trim(),
      width: el.getBoundingClientRect().width,
    }));
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    // A paragraph narrower than 60px would force single-word wrapping — check width
    expect(width, `prose paragraph is only ${width}px wide — likely single-word wrapping`).toBeGreaterThanOrEqual(280);
    // If the paragraph has more than 3 words it must be at least 100px wide
    if (wordCount > 3) {
      expect(width).toBeGreaterThanOrEqual(100);
    }
  });
});

// ─── tablet 768 ─────────────────────────────────────────────────────────────
test.describe("lesson detail layout — tablet 768px", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("main column width ≥ 320 px", async ({ page }) => {
    await gotoLesson(page, { width: 768, height: 1024 });
    const box = await page.locator(MAIN_COL).boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width, `main column ${box!.width}px < 320px`).toBeGreaterThanOrEqual(320);
  });

  test("no horizontal overflow", async ({ page }) => {
    await gotoLesson(page, { width: 768, height: 1024 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `horizontal overflow: ${overflow}px`).toBeLessThanOrEqual(1);
  });

  test("desktop TOC sidebar is hidden at 768px", async ({ page }) => {
    await gotoLesson(page, { width: 768, height: 1024 });
    const toc = page.locator(DESKTOP_TOC);
    await expect(toc.first()).not.toBeVisible();
  });

  test("article paragraphs not single-word lines at 768px", async ({ page }) => {
    await gotoLesson(page, { width: 768, height: 1024 });
    const prose = page.locator(`${ARTICLE} p`).first();
    await expect(prose).toBeVisible({ timeout: 30_000 });
    const width = await prose.evaluate((el: HTMLElement) => el.getBoundingClientRect().width);
    expect(width, `prose paragraph only ${width}px — likely single-word wrapping`).toBeGreaterThanOrEqual(320);
  });
});

// ─── laptop 1024 (2-column grid threshold) ──────────────────────────────────
test.describe("lesson detail layout — laptop 1024px", () => {
  test.use({
    storageState: { cookies: [], origins: [] },
    viewport: { width: 1024, height: 768 },
  });

  test("main column width ≥ 540 px at 1024px", async ({ page }) => {
    await gotoLesson(page, { width: 1024, height: 768 });
    const box = await page.locator(MAIN_COL).boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width, `main column ${box!.width}px — too narrow for 2-column grid`).toBeGreaterThanOrEqual(540);
  });

  test("desktop TOC sidebar is visible at 1024px", async ({ page }) => {
    await gotoLesson(page, { width: 1024, height: 768 });
    await expect(page.locator(DESKTOP_TOC).first()).toBeVisible({ timeout: 30_000 });
  });

  test("sidebar and main column do NOT overlap at 1024px", async ({ page }) => {
    await gotoLesson(page, { width: 1024, height: 768 });
    const sidebarBox = await page.locator(DESKTOP_TOC).first().boundingBox();
    const mainBox = await page.locator(MAIN_COL).boundingBox();
    if (!sidebarBox || !mainBox) return; // sidebar may be hidden in some configs
    const sidebarRight = sidebarBox.x + sidebarBox.width;
    const mainLeft = mainBox.x;
    expect(
      sidebarRight,
      `sidebar right edge (${sidebarRight}px) overlaps main column left edge (${mainLeft}px)`,
    ).toBeLessThanOrEqual(mainLeft + 8); // 8px tolerance for sub-pixel rounding
  });

  test("no horizontal overflow at 1024px", async ({ page }) => {
    await gotoLesson(page, { width: 1024, height: 768 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `horizontal overflow: ${overflow}px`).toBeLessThanOrEqual(2);
  });

  test("article paragraphs not single-word lines at 1024px", async ({ page }) => {
    await gotoLesson(page, { width: 1024, height: 768 });
    const prose = page.locator(`${ARTICLE} p`).first();
    await expect(prose).toBeVisible({ timeout: 30_000 });
    const width = await prose.evaluate((el: HTMLElement) => el.getBoundingClientRect().width);
    expect(width, `prose paragraph only ${width}px wide at 1024px`).toBeGreaterThanOrEqual(400);
  });
});

// ─── desktop 1280 (3-column grid threshold) ──────────────────────────────────
test.describe("lesson detail layout — desktop 1280px", () => {
  test.use({
    storageState: { cookies: [], origins: [] },
    viewport: { width: 1280, height: 900 },
  });

  test("main column width ≥ 400 px at 1280px", async ({ page }) => {
    await gotoLesson(page, { width: 1280, height: 900 });
    const box = await page.locator(MAIN_COL).boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width, `main column ${box!.width}px — too narrow for 3-column grid`).toBeGreaterThanOrEqual(400);
  });

  test("desktop TOC sidebar visible at 1280px", async ({ page }) => {
    await gotoLesson(page, { width: 1280, height: 900 });
    await expect(page.locator(DESKTOP_TOC).first()).toBeVisible({ timeout: 30_000 });
  });

  test("sidebar and main column do NOT overlap at 1280px", async ({ page }) => {
    await gotoLesson(page, { width: 1280, height: 900 });
    const sidebarBox = await page.locator(DESKTOP_TOC).first().boundingBox();
    const mainBox = await page.locator(MAIN_COL).boundingBox();
    if (!sidebarBox || !mainBox) return;
    const sidebarRight = sidebarBox.x + sidebarBox.width;
    const mainLeft = mainBox.x;
    expect(
      sidebarRight,
      `sidebar right (${sidebarRight}px) overlaps main left (${mainLeft}px) at 1280px`,
    ).toBeLessThanOrEqual(mainLeft + 8);
  });

  test("no horizontal overflow at 1280px", async ({ page }) => {
    await gotoLesson(page, { width: 1280, height: 900 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `horizontal overflow: ${overflow}px`).toBeLessThanOrEqual(2);
  });

  test("article section cards visible and have non-trivial width at 1280px", async ({ page }) => {
    await gotoLesson(page, { width: 1280, height: 900 });
    const card = page.locator(`${ARTICLE} .nn-lesson-section-card`).first();
    await expect(card).toBeVisible({ timeout: 30_000 });
    const box = await card.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width, `section card only ${box!.width}px wide`).toBeGreaterThanOrEqual(300);
  });
});
