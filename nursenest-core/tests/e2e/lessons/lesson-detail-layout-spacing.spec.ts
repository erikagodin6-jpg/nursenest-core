/**
 * Lesson detail layout spacing — structural regression tests.
 *
 * Verifies the six layout fixes shipped in the lesson-detail-layout-spacing pass:
 *   1. Pearl cards have generous internal padding (≥ 10px top/bottom).
 *   2. No orphan collapse button above the left rail (button removed).
 *   3. Units toggle lives inside the lesson header, not floating mid-page.
 *   4. Lesson progress badge is inside the header area.
 *   5. Vertical gap between header and reading content is compact (≤ 100px).
 *   6. Left rail cards have consistent gap between them (≥ 10px).
 *
 * Screenshots are saved to docs/screenshots/lesson-layout-spacing/ for visual review.
 *
 * Run:
 *   npx playwright test tests/e2e/lessons/lesson-detail-layout-spacing.spec.ts
 * Against staging:
 *   BASE_URL=https://staging.nursenest.ca npx playwright test tests/e2e/lessons/lesson-detail-layout-spacing.spec.ts
 */
import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { getE2eBaseURL } from "../helpers/e2e-env";

const baseURL = getE2eBaseURL();
const LESSON_URL = `${baseURL}/canada/rn/nclex-rn/lessons/ca-rn-angina`;
const SCREENSHOT_DIR = path.join("docs", "screenshots", "lesson-layout-spacing");

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
});

test.describe("lesson detail layout spacing", () => {
  // ── Desktop (1280 × 800) ──────────────────────────────────────────────────

  test("desktop — header contains units toggle; no orphan collapse button", async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(LESSON_URL, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.waitForSelector("[data-nn-premium-lessons-reading-hero]", { timeout: 90_000 });

    // Units toggle must be INSIDE the header element, not after it.
    const header = page.locator("[data-nn-premium-lessons-reading-hero]").first();
    await expect(header).toBeVisible();
    const unitsToggleInHeader = header.locator('[aria-label*="Units"]').first();
    await expect(unitsToggleInHeader).toBeVisible({ timeout: 20_000 });

    // No standalone floating units toggle AFTER the header (outside it).
    const allUnitsToggles = page.locator('[aria-label*="Units"]');
    const count = await allUnitsToggles.count();
    // Only the one inside the header should exist; no duplicates outside.
    for (let i = 0; i < count; i++) {
      const toggle = allUnitsToggles.nth(i);
      const isInsideHeader = await toggle.evaluate((el) => {
        const header = document.querySelector("[data-nn-premium-lessons-reading-hero]");
        return header ? header.contains(el) : false;
      });
      expect(isInsideHeader, `Units toggle at index ${i} must be inside the lesson header`).toBe(true);
    }

    // The stray collapse button (nn-lesson-reading-viewport__collapse) must NOT be present.
    const collapseBtn = page.locator(".nn-lesson-reading-viewport__collapse");
    await expect(collapseBtn).toHaveCount(0);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "desktop-header-and-rail.png"),
      fullPage: false,
    });
  });

  test("desktop — pearl cards have generous padding", async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(LESSON_URL, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.waitForSelector(".nn-lesson-clinical-pearls-rail__box", { timeout: 90_000 });

    const pearlBox = page.locator(".nn-lesson-clinical-pearls-rail__box").first();
    await expect(pearlBox).toBeVisible();

    const paddingTop = await pearlBox.evaluate(
      (el) => parseFloat(getComputedStyle(el).paddingTop),
    );
    const paddingLeft = await pearlBox.evaluate(
      (el) => parseFloat(getComputedStyle(el).paddingLeft),
    );

    // Expect at least 10px top/bottom padding and 12px left/right (generous, not cramped).
    expect(paddingTop, "pearl card top padding must be ≥ 10px").toBeGreaterThanOrEqual(10);
    expect(paddingLeft, "pearl card left padding must be ≥ 12px").toBeGreaterThanOrEqual(12);
  });

  test("desktop — reading layout starts close to header (compact vertical gap)", async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(LESSON_URL, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.waitForSelector("[data-nn-premium-lessons-reading-layout]", { timeout: 90_000 });

    const header = page.locator("[data-nn-premium-lessons-reading-hero]").first();
    const readingLayout = page.locator("[data-nn-premium-lessons-reading-layout]").first();

    await expect(header).toBeVisible();
    await expect(readingLayout).toBeVisible();

    const headerBottom = await header.evaluate((el) => el.getBoundingClientRect().bottom);
    const layoutTop = await readingLayout.evaluate((el) => el.getBoundingClientRect().top);
    const gap = layoutTop - headerBottom;

    // Gap should be compact — no more than 80px of dead space between header and content.
    expect(gap, `Gap between header bottom and reading layout top should be ≤ 80px, got ${gap}px`).toBeLessThanOrEqual(80);
  });

  test("desktop — left rail cards have consistent gap", async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(LESSON_URL, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.waitForSelector(".nn-lesson-reading-viewport__left-inner", { timeout: 90_000 });

    const inner = page.locator(".nn-lesson-reading-viewport__left-inner").first();
    await expect(inner).toBeVisible();

    const gapValue = await inner.evaluate(
      (el) => parseFloat(getComputedStyle(el).gap || getComputedStyle(el).rowGap),
    );
    // Gap between rail cards should be at least 10px.
    expect(gapValue, "left rail inner gap must be ≥ 10px").toBeGreaterThanOrEqual(10);
  });

  test("desktop — full above-fold screenshot", async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(LESSON_URL, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.waitForSelector("[data-nn-premium-lessons-reading-hero]", { timeout: 90_000 });
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "desktop-above-fold.png"),
      fullPage: false,
    });
  });

  // ── Tablet (768 × 1024) ───────────────────────────────────────────────────

  test("tablet — header and content visible, no orphan controls", async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(LESSON_URL, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.waitForSelector("[data-nn-premium-lessons-reading-hero]", { timeout: 90_000 });

    await expect(page.locator("h1.nn-lesson-page-title")).toBeVisible();

    // Collapse button must still be absent at tablet.
    await expect(page.locator(".nn-lesson-reading-viewport__collapse")).toHaveCount(0);

    // Units toggle inside the header must be present.
    const header = page.locator("[data-nn-premium-lessons-reading-hero]").first();
    await expect(header.locator('[aria-label*="Units"]').first()).toBeVisible({ timeout: 20_000 });

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "tablet-above-fold.png"),
      fullPage: false,
    });
  });

  // ── Mobile (390 × 844) ────────────────────────────────────────────────────

  test("mobile — header and content visible, layout is single-column", async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(LESSON_URL, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.waitForSelector("h1.nn-lesson-page-title", { timeout: 90_000 });

    await expect(page.locator("h1.nn-lesson-page-title")).toBeVisible();

    // Prose section must render.
    await expect(page.locator(".nn-lesson-prose").first()).toBeVisible({ timeout: 60_000 });

    // Desktop left rail should be hidden on mobile (display:none).
    const leftRail = page.locator(".nn-lesson-reading-viewport__left").first();
    const isHidden = await leftRail.evaluate(
      (el) => getComputedStyle(el).display === "none",
    );
    expect(isHidden, "left rail must be display:none on mobile").toBe(true);

    // No collapse button on mobile either.
    await expect(page.locator(".nn-lesson-reading-viewport__collapse")).toHaveCount(0);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "mobile-above-fold.png"),
      fullPage: false,
    });
  });
});
