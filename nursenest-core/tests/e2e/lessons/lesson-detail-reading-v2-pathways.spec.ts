/**
 * Premium lesson reading workspace v2 — RN, RPN, NP marketing lesson detail routes.
 * Guards layout CSS + DOM contract (left rail, progress strip, section cards, wide wrap).
 * Does not assert navigation chrome.
 *
 * Run: cd nursenest-core && npx playwright test tests/e2e/lessons/lesson-detail-reading-v2-pathways.spec.ts
 */
import { test, expect, type Page } from "@playwright/test";
import { LESSON_FLOW_PATHWAY_QA } from "../../../src/lib/qa/lesson-flow-pathways";
import { MARKETING_REGION_COOKIE } from "../../../src/lib/region/marketing-region-cookie";
import { getE2eBaseURL } from "../helpers/e2e-env";

const baseURL = getE2eBaseURL();

const TARGET_PATHWAY_IDS = ["us-rn-nclex-rn", "ca-rpn-rex-pn", "us-np-fnp"] as const;

const VIEWPORT = { width: 1280, height: 900 };

async function gotoPrimaryLesson(page: Page, lessonsPath: string) {
  await page.goto(lessonsPath, { waitUntil: "domcontentloaded", timeout: 180_000 });
  const primary = page.locator('[data-nn-qa-primary-lesson="true"]').first();
  await expect(primary).toBeVisible({ timeout: 120_000 });
  const href = await primary.getAttribute("href");
  expect(href).toBeTruthy();
  await page.goto(new URL(href!, baseURL).href, {
    waitUntil: "domcontentloaded",
    timeout: 180_000,
  });
}

async function expectReadingV2Layout(page: Page) {
  const shell = page.locator(".nn-premium-lesson-detail-shell.nn-lesson-page-shell--reading-v2");
  await expect(shell).toBeVisible({ timeout: 60_000 });

  const viewport = page.locator('.nn-lesson-reading-viewport[data-layout="rn-v2"]');
  await expect(viewport).toBeVisible();

  await expect(page.locator("[data-nn-lesson-reading-progress-strip]")).toBeVisible();
  await expect(page.locator('[data-nn-premium-lessons-on-this-page]').first()).toBeVisible();
  await expect(page.locator("article.nn-lesson-article-flow.nn-lesson-reading-stack")).toBeVisible();

  const layout = await viewport.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      display: style.display,
      gridTemplateColumns: style.gridTemplateColumns,
    };
  });
  expect(layout.display).toBe("grid");
  expect(layout.gridTemplateColumns).not.toBe("none");
  expect(layout.gridTemplateColumns.split(" ").length).toBeGreaterThanOrEqual(2);

  const mainCol = page.getByTestId("pathway-lesson-main-column");
  const mainBox = await mainCol.boundingBox();
  expect(mainBox?.width ?? 0).toBeGreaterThanOrEqual(400);

  const sidebar = page.locator('[data-nn-premium-lessons-on-this-page]').first();
  const sidebarBox = await sidebar.boundingBox();
  if (sidebarBox && mainBox) {
    expect(sidebarBox.x + sidebarBox.width).toBeLessThanOrEqual(mainBox.x + 8);
  }

  const cards = page.locator("article.nn-lesson-reading-stack .nn-lesson-section-card");
  await expect(cards.first()).toBeVisible();
  const cardCount = await cards.count();
  expect(cardCount).toBeGreaterThanOrEqual(2);

  const wideCard = page.locator(
    "article.nn-lesson-reading-stack .nn-lesson-section-card.nn-lesson-section-card--under-left",
  );
  if ((await wideCard.count()) > 0) {
    const wideBox = await wideCard.first().boundingBox();
    const narrowBox = await cards.first().boundingBox();
    expect(wideBox).toBeTruthy();
    expect(narrowBox).toBeTruthy();
    if (wideBox && narrowBox) {
      expect(wideBox.width).toBeGreaterThan(narrowBox.width + 40);
    }
  }

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(2);
}

for (const pathwayId of TARGET_PATHWAY_IDS) {
  const cfg = LESSON_FLOW_PATHWAY_QA.find((entry) => entry.pathwayId === pathwayId);
  if (!cfg) continue;

  test.describe(`reading v2 layout — ${pathwayId}`, () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test("marketing lesson detail matches reading workspace v2", async ({ page, context }) => {
      await context.addCookies([
        { name: MARKETING_REGION_COOKIE, value: cfg.marketingRegionCookie, url: baseURL },
      ]);
      await page.setViewportSize(VIEWPORT);
      await gotoPrimaryLesson(page, `${baseURL}${cfg.lessonsPath}`);
      await expectReadingV2Layout(page);
    });
  });
}

test.describe("reading v2 layout — canonical RN pulmonary embolism", () => {
  test.use({
    storageState: { cookies: [], origins: [] },
    viewport: VIEWPORT,
  });

  test("RN PE lesson: hero, progress strip, section cards, no right study rail", async ({
    page,
  }) => {
    await page.goto(`${baseURL}/us/rn/nclex-rn/lessons/us-rn-pulmonary-embolism`, {
      waitUntil: "domcontentloaded",
      timeout: 180_000,
    });
    await page.waitForSelector("h1.nn-lesson-page-title", { timeout: 120_000 });
    await expect(page.locator(".nn-lesson-hero-eyebrow")).toBeVisible();
    await expect(page.locator("[data-nn-premium-individual-lesson-progress]")).toBeVisible();
    await expectReadingV2Layout(page);
    await expect(page.locator(".nn-lesson-reading-viewport__right")).toHaveCount(0);
  });
});
