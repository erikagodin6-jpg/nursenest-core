import { expect, test, type Page } from "@playwright/test";
import {
  expectNotPageNotFound,
  gotoExpectOk,
  requireOrigin,
  seedCaMarketingCookie,
} from "../helpers/navigation-e2e";

const HUB_ROOT = '[data-nn-nursing-tier-hub="surface"]';
const QUICK_ACTIONS = '[data-nn-hub-section="quick-actions"]';
const IMAGE_GRID = '[data-nn-hub-section="study-topic-image-grid"]';

async function topOf(page: Page, selector: string): Promise<number> {
  const box = await page.locator(selector).first().boundingBox();
  expect(box, `${selector} should have a layout box`).not.toBeNull();
  return box?.y ?? 0;
}

async function expectStudyToolsBeforeImages(page: Page) {
  await expect(page.locator(HUB_ROOT)).toBeVisible({ timeout: 90_000 });
  await expect(page.locator(QUICK_ACTIONS)).toBeVisible();
  await expect(page.locator(IMAGE_GRID)).toBeVisible();

  const imageGridTop = await topOf(page, IMAGE_GRID);
  const quickActionsTop = await topOf(page, QUICK_ACTIONS);
  expect(quickActionsTop, "study tools should appear before the image grid").toBeLessThan(imageGridTop);

  const selectors = [
    ".nn-qa-nursing-tier-hub-flashcards-card",
    ".nn-qa-nursing-tier-hub-practice-card",
    ".nn-qa-nursing-tier-hub-lessons-card",
    ".nn-qa-nursing-tier-hub-cat-card",
  ];

  for (const selector of selectors) {
    await expect(page.locator(selector).first()).toBeVisible();
    expect(await topOf(page, selector), `${selector} should appear before image grid`).toBeLessThan(imageGridTop);
  }

  const order = await page.locator(QUICK_ACTIONS).evaluate((list) =>
    Array.from(list.querySelectorAll("a")).map((anchor) => anchor.textContent?.replace(/\s+/g, " ").trim() ?? ""),
  );
  expect(order[0]).toMatch(/Flashcards/i);
  expect(order[1]).toMatch(/Practice Questions/i);
  expect(order[2]).toMatch(/Lessons/i);
  expect(order[3]).toMatch(/CAT/i);

  const proofBeforeCards = await page.locator(HUB_ROOT).evaluate((root, args) => {
    const quick = root.querySelector(args.quickActions);
    const proof = root.querySelector(args.imageGrid);
    if (!quick || !proof) return true;
    return Boolean(proof.compareDocumentPosition(quick) & Node.DOCUMENT_POSITION_FOLLOWING);
  }, { quickActions: QUICK_ACTIONS, imageGrid: IMAGE_GRID });
  expect(proofBeforeCards, "hero/product image section must not render before study tools").toBe(false);

  await expect(page.locator(`${IMAGE_GRID} img`)).not.toHaveCount(0);
  const imageLoadingModes = await page.locator(`${IMAGE_GRID} img`).evaluateAll((imgs) =>
    imgs.map((img) => img.getAttribute("loading") ?? "auto"),
  );
  expect(imageLoadingModes.every((mode) => mode === "lazy")).toBe(true);

  const emptyPreview = await page.locator(IMAGE_GRID).evaluate((section) => section.textContent?.trim().length === 0);
  expect(emptyPreview, "image section should not be an empty placeholder").toBe(false);
}

test.describe("NCLEX-RN Canada hub layout refinement", () => {
  for (const viewport of [
    { name: "desktop", width: 1280, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    test(`${viewport.name}: study tools appear before support imagery`, async ({ page, baseURL }) => {
      const origin = requireOrigin(baseURL);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await seedCaMarketingCookie(page, origin);
      await gotoExpectOk(page, "/canada/rn/nclex-rn");
      await expectNotPageNotFound(page);

      await expectStudyToolsBeforeImages(page);

      if (viewport.name === "mobile") {
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
        expect(overflow, "mobile layout should not horizontally scroll").toBe(false);
      }
    });
  }
});
