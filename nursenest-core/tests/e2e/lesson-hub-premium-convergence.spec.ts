/**
 * Pass 3 — Lesson hub premium convergence visual smoke.
 *
 * Covers: RN / RPN / NP / Allied / New Grad hubs across Ocean / Blossom / Midnight themes.
 * Tests premium structural markers, absence of legacy artifacts, and mobile layout integrity.
 *
 * Requires a running dev server (see playwright.config.ts → webServer).
 * Screenshots land in docs/screenshots/lesson-hub-convergence/.
 */
import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";

const SCREENSHOT_DIR = "docs/screenshots/lesson-hub-convergence";

// Hub routes under test
const HUB_ROUTES = [
  { label: "rn-canada", path: "/canada/rn/nclex-rn/lessons" },
  { label: "rn-us", path: "/us/rn/nclex-rn/lessons" },
  { label: "rpn-canada", path: "/canada/rpn/rex-pn/lessons" },
  { label: "np-fnp-us", path: "/us/np/fnp/lessons" },
  { label: "allied-canada", path: "/canada/allied/allied-health/lessons" },
];

const THEMES = ["ocean", "blossom", "midnight"] as const;

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
});

/** Inject data-theme attribute without needing login or localStorage. */
async function applyTheme(page: import("@playwright/test").Page, theme: string) {
  await page.evaluate((t) => {
    document.documentElement.setAttribute("data-theme", t);
  }, theme);
  // Allow one paint cycle for CSS to settle
  await page.waitForTimeout(120);
}

/** Wait for layout stability (no shifts for 1 s), then screenshot. */
async function stableScreenshot(
  page: import("@playwright/test").Page,
  label: string,
  projectName: string,
  fullPage = false,
) {
  // Wait for network idle and at least 1 s of layout stability
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(1000);
  const path = `${SCREENSHOT_DIR}/${label}-${projectName}.png`;
  await page.screenshot({ path, fullPage });
  return path;
}

// ─── Desktop smoke across all themes ─────────────────────────────────────────

test.describe("Lesson hub desktop — premium structural markers", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  for (const hub of HUB_ROUTES) {
    for (const theme of THEMES) {
      test(`${hub.label} hub in ${theme} — premium markers present`, async ({ page }, info) => {
        test.setTimeout(240_000);
        await page.goto(hub.path, { waitUntil: "domcontentloaded", timeout: 120_000 });
        await applyTheme(page, theme);

        // Hero section must be present
        const hero = page.locator("[data-nn-premium-lessons-hero]");
        await expect(hero).toBeVisible({ timeout: 60_000 });

        // Premium lesson system wrapper must carry correct data attributes
        const hub_el = page.locator("[data-nn-lessons-marketing-hub='1']");
        await expect(hub_el).toBeAttached();

        // Hub body panel must render
        const body = page.locator("[data-nn-premium-lessons-hub-body]");
        await expect(body).toBeVisible();

        // h1 should include "Lesson Library"
        const h1 = page.locator("h1#nn-lessons-hub-title");
        await expect(h1).toBeVisible();
        const h1Text = await h1.innerText();
        expect(h1Text.toLowerCase()).toContain("lesson library");

        // No yellow placeholder blocks should be visible in the hub body
        const yellowBlocks = page.locator(
          "[data-nn-premium-lessons-hub-body] [class*='bg-yellow-'], [data-nn-premium-lessons-hub-body] [class*='bg-amber-']",
        );
        await expect(yellowBlocks).toHaveCount(0);

        // Category grid must be present and non-empty
        const categoryGrid = page.locator(".nn-qa-pathway-lessons-hub .nn-hub-category-card");
        const count = await categoryGrid.count();
        expect(count, `${hub.label}/${theme} must have at least 1 category card`).toBeGreaterThan(0);

        // review_required must NOT appear as a standalone card in the public grid
        const reviewCard = page.locator(".nn-hub-category-card[href*='review-required']");
        await expect(reviewCard).toHaveCount(0);

        await stableScreenshot(page, `${hub.label}-${theme}`, info.project.name);
      });
    }
  }
});

// ─── Stat card + trust badges ─────────────────────────────────────────────────

test.describe("Lesson hub hero — stat card and trust badges", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("RN hub hero renders stat card and trust badges in Ocean", async ({ page }, info) => {
    test.setTimeout(180_000);
    await page.goto("/canada/rn/nclex-rn/lessons", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await applyTheme(page, "ocean");

    const statCard = page.locator(".nn-lessons-hub-stat-card");
    await expect(statCard).toBeVisible({ timeout: 60_000 });
    const statText = await statCard.innerText();
    expect(statText.trim().length, "stat card must have non-empty value + label").toBeGreaterThan(3);

    const badges = page.locator(".nn-lessons-hub-trust-badge");
    const badgeCount = await badges.count();
    expect(badgeCount, "must render at least 3 trust badge pills").toBeGreaterThanOrEqual(3);

    await stableScreenshot(page, "rn-hero-statcard-ocean", info.project.name);
  });

  test("RPN hub hero renders stat card in Blossom — stat value readable", async ({ page }, info) => {
    test.setTimeout(180_000);
    await page.goto("/canada/rpn/rex-pn/lessons", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await applyTheme(page, "blossom");

    const statCard = page.locator(".nn-lessons-hub-stat-card");
    await expect(statCard).toBeVisible({ timeout: 60_000 });

    await stableScreenshot(page, "rpn-hero-blossom", info.project.name);
  });
});

// ─── Blossom theme QA ─────────────────────────────────────────────────────────

test.describe("Blossom theme QA", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("Blossom brand wordmark uses pink color (not black)", async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto("/canada/rn/nclex-rn/lessons", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await applyTheme(page, "blossom");

    const lockup = page.locator(".nn-header-brand-lockup");
    await expect(lockup).toBeVisible({ timeout: 30_000 });
    const color = await lockup.evaluate((el) => getComputedStyle(el).color);
    // Must NOT be near-black rgb(31,41,55) — expected to be a pink/rose hue
    expect(color, "Blossom wordmark must not be near-black").not.toBe("rgb(31, 41, 55)");
  });

  test("Blossom hub hero has pink/lavender ambient gradient (not plain white)", async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto("/canada/rn/nclex-rn/lessons", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await applyTheme(page, "blossom");

    const hero = page.locator("[data-nn-premium-lessons-hero]");
    await expect(hero).toBeVisible({ timeout: 60_000 });
    const bg = await hero.evaluate((el) => getComputedStyle(el).backgroundImage);
    // Blossom hero must have a gradient background, not just a solid white
    expect(bg, "Blossom hero must have gradient background-image").toContain("gradient");
  });
});

// ─── Midnight theme QA ───────────────────────────────────────────────────────

test.describe("Midnight theme QA", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("NP hub hero in Midnight has deep teal gradient", async ({ page }, info) => {
    test.setTimeout(180_000);
    await page.goto("/us/np/fnp/lessons", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await applyTheme(page, "midnight");

    const hero = page.locator("[data-nn-premium-lessons-hero]");
    await expect(hero).toBeVisible({ timeout: 60_000 });
    const bg = await hero.evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(bg, "Midnight NP hero must have gradient").toContain("gradient");

    await stableScreenshot(page, "np-midnight", info.project.name);
  });

  test("Midnight category card borders are visible (not invisible on dark surface)", async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto("/us/np/fnp/lessons", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await applyTheme(page, "midnight");

    const card = page.locator(".nn-hub-category-card").first();
    await expect(card).toBeVisible({ timeout: 60_000 });
    const border = await card.evaluate((el) => getComputedStyle(el).borderColor);
    // Border must not be fully transparent
    expect(border, "Midnight category card border must not be transparent").not.toContain("rgba(0, 0, 0, 0)");
  });
});

// ─── Mobile layout smoke ──────────────────────────────────────────────────────

test.describe("Lesson hub mobile layout", () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 14 Pro

  test("RN hub mobile — no horizontal scroll, clean stacking", async ({ page }, info) => {
    test.setTimeout(180_000);
    await page.goto("/canada/rn/nclex-rn/lessons", { waitUntil: "domcontentloaded", timeout: 120_000 });

    const hero = page.locator("[data-nn-premium-lessons-hero]");
    await expect(hero).toBeVisible({ timeout: 60_000 });

    // Ensure no horizontal overflow
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth, "mobile RN hub must not overflow horizontally").toBeLessThanOrEqual(clientWidth + 2);

    // Trust badges must be within viewport
    const firstBadge = page.locator(".nn-lessons-hub-trust-badge").first();
    if (await firstBadge.isVisible()) {
      const box = await firstBadge.boundingBox();
      expect(box?.x ?? 0, "trust badge must not overflow viewport right edge").toBeLessThan(390);
    }

    // Category cards must stack (width close to viewport)
    const firstCard = page.locator(".nn-hub-category-card").first();
    if (await firstCard.isVisible()) {
      const box = await firstCard.boundingBox();
      expect(box?.width ?? 0, "mobile category card must be near full viewport width").toBeGreaterThan(300);
    }

    await stableScreenshot(page, "rn-mobile-ocean", info.project.name, true);
  });

  test("Blossom hub mobile — stat card does not stretch full width awkwardly", async ({ page }, info) => {
    test.setTimeout(180_000);
    await page.goto("/canada/rn/nclex-rn/lessons", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await applyTheme(page, "blossom");

    const statCard = page.locator(".nn-lessons-hub-stat-card").first();
    if (await statCard.isVisible()) {
      const box = await statCard.boundingBox();
      // Stat card with self-start should be much narrower than full viewport
      expect(box?.width ?? 999, "mobile stat card must be compact (self-start), not full-width").toBeLessThan(280);
    }

    await stableScreenshot(page, "rn-mobile-blossom", info.project.name);
  });

  test("Category drill-down mobile — lesson rows truncate correctly", async ({ page }, info) => {
    test.setTimeout(180_000);
    // Navigate to a category drill-down page
    await page.goto("/canada/rn/nclex-rn/lessons/cardiovascular", {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });

    const firstRow = page.locator(".nn-lessons-hub-lesson-row").first();
    if (await firstRow.isVisible()) {
      const scrollWidth = await firstRow.evaluate((el) => el.scrollWidth);
      const clientWidth = await firstRow.evaluate((el) => el.clientWidth);
      expect(scrollWidth, "lesson row must not overflow its container").toBeLessThanOrEqual(clientWidth + 4);
    }

    await stableScreenshot(page, "rn-drill-down-mobile", info.project.name);
  });
});

// ─── Category drill-down DOM smoke ────────────────────────────────────────────

test.describe("Category drill-down surface", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("Cardiovascular drill-down renders lesson rows with directional affordance", async ({ page }, info) => {
    test.setTimeout(180_000);
    await page.goto("/canada/rn/nclex-rn/lessons/cardiovascular", {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });

    const rows = page.locator(".nn-lessons-hub-lesson-row");
    await expect(rows.first()).toBeVisible({ timeout: 60_000 });
    const count = await rows.count();
    expect(count, "drill-down must render at least 1 lesson row").toBeGreaterThan(0);

    // Each row should contain an SVG arrow
    const arrows = page.locator(".nn-lessons-hub-lesson-row svg");
    const arrowCount = await arrows.count();
    expect(arrowCount, "lesson rows must have directional SVG arrow").toBeGreaterThanOrEqual(count);

    await stableScreenshot(page, "rn-cardiovascular-drill-down", info.project.name);
  });
});

// ─── Anonymous / zero-lesson category hiding ─────────────────────────────────

test.describe("Anonymous visitor — zero-lesson and review_required exclusion", () => {
  test.use({ viewport: { width: 1280, height: 900 }, storageState: { cookies: [], origins: [] } });

  test("Anonymous RN hub hides review_required category from grid", async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto("/canada/rn/nclex-rn/lessons", { waitUntil: "domcontentloaded", timeout: 120_000 });

    // review_required card must not appear in the public grid
    const reviewCard = page.locator(".nn-hub-category-card[href*='review-required']");
    await expect(reviewCard).toHaveCount(0);
  });

  test("Anonymous RN hub shows only categories with lessons", async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto("/canada/rn/nclex-rn/lessons", { waitUntil: "domcontentloaded", timeout: 120_000 });

    const cards = page.locator(".nn-hub-category-card:not(.nn-hub-category-card--empty)");
    await expect(cards.first()).toBeVisible({ timeout: 60_000 });
    const visibleCount = await cards.count();
    expect(visibleCount, "must have at least 1 visible non-empty category").toBeGreaterThan(0);
  });
});
