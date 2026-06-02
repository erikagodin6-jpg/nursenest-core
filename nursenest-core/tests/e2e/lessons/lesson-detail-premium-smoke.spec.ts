import { test, expect } from "@playwright/test";
import { getE2eBaseURL } from "../helpers/e2e-env";

const baseURL = getE2eBaseURL();

/** Presentation-shell smoke: nav, quick summary i18n surface, loading leaf, mobile TOC — no pedagogy assertions. */
test.describe("lesson detail premium shells", () => {
  test("marketing RN lesson: hero, article flow, optional quick summary & desktop TOC", async ({ page }) => {
    await page.goto(`${baseURL}/us/rn/nclex-rn/lessons/us-rn-pulmonary-embolism`, {
      waitUntil: "domcontentloaded",
      timeout: 180_000,
    });
    await page.waitForSelector("h1.nn-lesson-page-title", { timeout: 120_000 });
    await expect(page.locator("article.nn-lesson-article-flow")).toBeVisible();
    await expect(page.locator(".nn-premium-pathway-lesson-header")).toBeVisible();
    await expect(page.locator("[data-nn-premium-lessons-reading-hero]")).toBeVisible();
    await expect(page.locator("[data-nn-premium-lessons-section-system]")).toBeVisible();
    await expect(page.locator("[data-nn-premium-lessons-on-this-page]")).toBeVisible();
    await expect(page.locator("[data-nn-premium-lessons-study-rail]")).toBeVisible();
    await expect(page.locator("[data-nn-premium-individual-lesson-header-meta]")).toBeVisible();
    await expect(page.locator("[data-nn-premium-individual-lesson-progress]")).toBeVisible();
    await expect(page.locator("[data-nn-premium-individual-lesson-actions]")).toBeVisible();
    await expect(page.locator("[data-nn-premium-individual-lesson-recommendations]")).toBeVisible();
    await expect(page.getByText(/Review Flashcards|Practice Related Questions|Continue Weak Area Recovery/).first()).toBeVisible();

    const summary = page.getByTestId("pathway-lesson-quick-clinical-summary");
    if (await summary.count()) {
      await expect(summary).toBeVisible();
      await expect(summary.locator("#quick-clinical-summary")).toBeAttached();
    }

    await expect(page.locator(".nn-lesson-section-nav").first()).toBeVisible();
    await expect(page.getByText(/Clinical Pearls|Pathophysiology|Labs & Diagnostics|Nursing Interventions|Patient Education/).first()).toBeVisible();
  });

  test("mobile 375: collapsible lesson contents control", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${baseURL}/us/rn/nclex-rn/lessons/respiratory-assessment-ngn`, {
      waitUntil: "domcontentloaded",
      timeout: 180_000,
    });
    await page.waitForSelector("h1.nn-lesson-page-title", { timeout: 120_000 });
    const mobileNav = page.locator(".nn-lesson-section-nav-mobile");
    await expect(mobileNav.locator("summary")).toBeVisible();
    await mobileNav.locator("summary").click();
    await expect(page.locator("[data-nn-premium-lessons-mobile-nav]")).toBeVisible();
  });

  test("mobile 375: article column does not widen page (no horizontal overflow)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${baseURL}/us/rn/nclex-rn/lessons/us-rn-pulmonary-embolism`, {
      waitUntil: "domcontentloaded",
      timeout: 180_000,
    });
    await page.waitForSelector('[data-testid="pathway-lesson-main-column"]', { timeout: 120_000 });
    const overflow = await page.evaluate(() => {
      const el = document.documentElement;
      return el.scrollWidth - el.clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("marketing lesson body: no raw learner i18n key leakage in article", async ({ page }) => {
    await page.goto(`${baseURL}/us/rn/nclex-rn/lessons/us-rn-pulmonary-embolism`, {
      waitUntil: "domcontentloaded",
      timeout: 180_000,
    });
    await page.waitForSelector("article.nn-lesson-article-flow", { timeout: 120_000 });
    const articleText = await page.locator("article.nn-lesson-article-flow").innerText();
    expect(articleText.includes("learner.lessons.detail.")).toBe(false);
    expect(articleText.includes("{{")).toBe(false);
  });

  test("dark theme class: lesson shell still renders", async ({ page }) => {
    await page.emulateMedia({
      colorScheme: "dark",
    });
    await page.goto(`${baseURL}/us/rn/nclex-rn/lessons/us-rn-pulmonary-embolism`, {
      waitUntil: "domcontentloaded",
      timeout: 180_000,
    });
    await page.waitForSelector("h1.nn-lesson-page-title", { timeout: 120_000 });
    await expect(page.locator("article.nn-lesson-article-flow")).toBeVisible();
  });
});
