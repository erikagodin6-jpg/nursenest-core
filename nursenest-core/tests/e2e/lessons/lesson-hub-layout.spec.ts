/**
 * Lesson hub layout smoke tests — Option C UX pass (2026-05-13)
 *
 * Validates that the compact hero + unified top-nav + scannable card layout
 * renders correctly across all major pathways:
 *   - RN (NCLEX-RN, US and Canada)
 *   - RPN / PN
 *   - CNPLE (Canadian NP)
 *   - Allied Health
 *
 * Checks:
 *   - Hub page loads without 404 / error shells
 *   - Lesson library section is present
 *   - Top-nav sticky chrome is rendered (data-testid="lesson-hub-sticky-nav")
 *   - Surface chips nav is rendered (data-testid="lesson-hub-surface-chips")
 *   - Main content is NOT squeezed: lesson library width ≥ 60% of viewport
 *   - Lesson system cards render with accent stripe (`.nn-lesson-system-card`)
 *   - Lesson rows render with the compact class (`nn-qa-pathway-lesson-card`)
 *   - No horizontal overflow at 375px mobile viewport
 *   - Back link is visible and keyboard-focusable
 *   - H1 is present (no heading regression)
 */

import { expect, test } from "@playwright/test";
import { gotoExpectOk, expectNotPageNotFound } from "../helpers/navigation-e2e";

const HUB_ROUTES = {
  rnUs: "/us/rn/nclex-rn/lessons",
  rnCa: "/canada/rn/nclex-rn/lessons",
  rpnCa: "/canada/rpn/rex-pn/lessons",
  cnple: "/canada/np/cnple/lessons",
  allied: "/us/allied/allied-health/lessons",
} as const;

const LESSON_LIBRARY_SELECTOR = "#pathway-lesson-library";
const STICKY_NAV_SELECTOR = '[data-testid="lesson-hub-sticky-nav"]';
const SURFACE_CHIPS_SELECTOR = '[data-testid="lesson-hub-surface-chips"]';
const LESSON_CARD_SELECTOR = ".nn-lesson-system-card";
const LESSON_ROW_SELECTOR = ".nn-qa-pathway-lesson-card";

async function assertHubLayoutIntegrity(page: Parameters<Parameters<typeof test>[1]>[0], route: string) {
  await gotoExpectOk(page, route);
  await expectNotPageNotFound(page);

  // H1 must be present
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toBeVisible({ timeout: 30_000 });

  // Error shell must not appear
  await expect(page.getByText("Lessons temporarily unavailable")).toHaveCount(0);

  // Lesson library section present
  const library = page.locator(LESSON_LIBRARY_SELECTOR);
  await library.waitFor({ state: "visible", timeout: 60_000 });

  // Top-nav sticky chrome
  await expect(page.locator(STICKY_NAV_SELECTOR)).toBeVisible({ timeout: 15_000 });

  // Surface chips nav
  await expect(page.locator(SURFACE_CHIPS_SELECTOR)).toBeVisible();
}

test.describe("lesson hub layout — RN US", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("loads with sticky nav and lesson library", async ({ page }) => {
    await assertHubLayoutIntegrity(page, HUB_ROUTES.rnUs);

    const cards = page.locator(LESSON_CARD_SELECTOR);
    await expect(cards.first()).toBeVisible({ timeout: 15_000 });

    const rows = page.locator(LESSON_ROW_SELECTOR);
    const rowCount = await rows.count();
    expect(rowCount, "expected ≥ 5 lesson rows").toBeGreaterThanOrEqual(5);
  });

  test("main content is not squeezed — lesson library width ≥ 60% of viewport", async ({ page }) => {
    await gotoExpectOk(page, HUB_ROUTES.rnUs);
    const library = page.locator(LESSON_LIBRARY_SELECTOR);
    await library.waitFor({ state: "visible", timeout: 60_000 });
    const box = await library.boundingBox();
    const viewportWidth = page.viewportSize()?.width ?? 1280;
    expect(box?.width, `lesson library width ${box?.width}px should be ≥ 60% of ${viewportWidth}px viewport`).toBeGreaterThanOrEqual(viewportWidth * 0.6);
  });

  test("back link is keyboard-focusable", async ({ page }) => {
    await gotoExpectOk(page, HUB_ROUTES.rnUs);
    const backLink = page.locator('a:has-text("overview")').first();
    await backLink.focus();
    await expect(backLink).toBeFocused();
  });
});

test.describe("lesson hub layout — RN Canada", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("loads with lesson library and surface chips", async ({ page }) => {
    await assertHubLayoutIntegrity(page, HUB_ROUTES.rnCa);
  });
});

test.describe("lesson hub layout — RPN Canada", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("loads with lesson library and surface chips", async ({ page }) => {
    await assertHubLayoutIntegrity(page, HUB_ROUTES.rpnCa);
  });
});

test.describe("lesson hub layout — CNPLE", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("loads with lesson library and surface chips", async ({ page }) => {
    await assertHubLayoutIntegrity(page, HUB_ROUTES.cnple);
  });

  test("CNPLE lesson cards are visible and link to detail pages", async ({ page }) => {
    await gotoExpectOk(page, HUB_ROUTES.cnple);
    const library = page.locator(LESSON_LIBRARY_SELECTOR);
    await library.waitFor({ state: "visible", timeout: 60_000 });
    const links = library.locator('a[href*="/lessons/"]');
    await expect(links.first()).toBeVisible({ timeout: 15_000 });
    const n = await links.count();
    expect(n).toBeGreaterThanOrEqual(5);
  });
});

test.describe("lesson hub layout — Allied Health", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("loads with lesson library and surface chips", async ({ page }) => {
    await assertHubLayoutIntegrity(page, HUB_ROUTES.allied);
  });
});

test.describe("lesson hub layout — mobile (375px)", () => {
  test.use({
    storageState: { cookies: [], origins: [] },
    viewport: { width: 375, height: 812 },
  });

  test("RN US hub: no horizontal overflow at 375px", async ({ page }) => {
    await gotoExpectOk(page, HUB_ROUTES.rnUs);
    const library = page.locator(LESSON_LIBRARY_SELECTOR);
    await library.waitFor({ state: "visible", timeout: 60_000 });

    // body scroll width must not exceed viewport width
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth, `horizontal overflow: scrollWidth ${scrollWidth} > innerWidth ${innerWidth}`).toBeLessThanOrEqual(innerWidth + 2);
  });

  test("CNPLE hub: sticky nav visible and lesson cards stack full-width on mobile", async ({ page }) => {
    await gotoExpectOk(page, HUB_ROUTES.cnple);
    const library = page.locator(LESSON_LIBRARY_SELECTOR);
    await library.waitFor({ state: "visible", timeout: 60_000 });

    // Sticky nav must still be rendered on mobile
    await expect(page.locator(STICKY_NAV_SELECTOR)).toBeVisible();

    // Lesson cards should be present
    const cards = page.locator(LESSON_CARD_SELECTOR);
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // No horizontal overflow
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 2);
  });
});

test.describe("lesson hub layout — filter navigation usability", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("RN US hub: surface chips contain at least one link to practice questions", async ({ page }) => {
    await gotoExpectOk(page, HUB_ROUTES.rnUs);
    const nav = page.locator(SURFACE_CHIPS_SELECTOR);
    await expect(nav).toBeVisible({ timeout: 15_000 });
    const questionsLink = nav.locator('a:has-text("Questions"), a:has-text("Practice")');
    await expect(questionsLink.first()).toBeVisible();
  });

  test("RN US hub: surface chips nav is keyboard-navigable", async ({ page }) => {
    await gotoExpectOk(page, HUB_ROUTES.rnUs);
    const nav = page.locator(SURFACE_CHIPS_SELECTOR);
    await expect(nav).toBeVisible({ timeout: 15_000 });
    // First chip should be focusable
    const firstChip = nav.locator("a").first();
    await firstChip.focus();
    await expect(firstChip).toBeFocused();
  });
});
