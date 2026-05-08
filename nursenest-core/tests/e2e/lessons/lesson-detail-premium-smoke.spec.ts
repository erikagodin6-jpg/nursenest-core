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

    const summary = page.getByTestId("pathway-lesson-quick-clinical-summary");
    if (await summary.count()) {
      await expect(summary).toBeVisible();
      await expect(summary.locator("#quick-clinical-summary")).toBeVisible();
    }

    await expect(page.locator(".nn-lesson-section-nav").first()).toBeVisible();
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
  });

  test("dark theme class: lesson shell still renders", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto(`${baseURL}/us/rn/nclex-rn/lessons/us-rn-pulmonary-embolism`, {
      waitUntil: "domcontentloaded",
      timeout: 180_000,
    });
    await page.waitForSelector("h1.nn-lesson-page-title", { timeout: 120_000 });
    await expect(page.locator(".nn-lesson-page-shell, .nn-premium-lesson-detail-shell").first()).toBeVisible();
  });
});
