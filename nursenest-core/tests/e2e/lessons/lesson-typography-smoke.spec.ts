import { test, expect } from "@playwright/test";
import { getE2eBaseURL } from "../helpers/e2e-env";

const baseURL = getE2eBaseURL();

/** Runtime typography smoke: verifies lesson shell classes resolve to expected weights/line-heights in Chromium. */
test.describe("lesson typography (computed styles)", () => {
  test("RN + PN + NP lesson pages + CA lesson with pre/post shell", async ({ page }) => {
    const urls = [
      `${baseURL}/us/rn/nclex-rn/lessons/respiratory-assessment-ngn`,
      `${baseURL}/us/lpn/nclex-pn/lessons/lpn-scope-delegation-priority`,
      `${baseURL}/us/np/fnp/lessons/fnp-differential-primary-care`,
      `${baseURL}/canada/rn/nclex-rn/lessons/fluid-balance-acute-care`,
    ];

    for (const url of urls) {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180_000 });
      await page.waitForSelector("h1.nn-lesson-page-title", { timeout: 120_000 });

      const h1 = page.locator("h1.nn-lesson-page-title").first();
      await expect(h1).toBeVisible();
      const h1Weight = await h1.evaluate((el) => getComputedStyle(el).fontWeight);
      expect(["600", "semibold"].includes(h1Weight) || Number.parseInt(h1Weight, 10) >= 600).toBeTruthy();

      const prose = page.locator(".nn-lesson-prose").first();
      await expect(prose).toBeVisible();
      const proseWeight = await prose.evaluate((el) => getComputedStyle(el).fontWeight);
      expect(["400", "normal"].includes(proseWeight) || Number.parseInt(proseWeight, 10) === 400).toBeTruthy();
      const proseLh = await prose.evaluate((el) => parseFloat(getComputedStyle(el).lineHeight));
      const proseFs = await prose.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(proseLh / proseFs).toBeGreaterThanOrEqual(1.62);

      const sec = page.locator(".nn-lesson-section-heading").first();
      await expect(sec).toBeVisible();
      const secWeight = await sec.evaluate((el) => getComputedStyle(el).fontWeight);
      expect(["500", "medium"].includes(secWeight) || Number.parseInt(secWeight, 10) === 500).toBeTruthy();
    }

    await page.goto(`${baseURL}/canada/rn/nclex-rn/lessons/fluid-balance-acute-care`, {
      waitUntil: "domcontentloaded",
      timeout: 180_000,
    });
    const assessment = page.getByRole("heading", { name: /Pre\/post lesson tests/i });
    await expect(assessment).toBeVisible({ timeout: 120_000 });
    const assessHeading = page.locator("h2").filter({ hasText: "Pre/post lesson tests" }).first();
    const ahWeight = await assessHeading.evaluate((el) => getComputedStyle(el).fontWeight);
    expect(Number.parseInt(ahWeight, 10)).toBeGreaterThanOrEqual(600);
  });

  test("mobile viewport: RN lesson title + prose visible", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}/us/rn/nclex-rn/lessons/us-rn-pulmonary-embolism`, {
      waitUntil: "domcontentloaded",
      timeout: 180_000,
    });
    await page.waitForSelector("h1.nn-lesson-page-title", { timeout: 120_000 });
    await expect(page.locator("h1.nn-lesson-page-title")).toBeVisible();
    await expect(page.locator(".nn-lesson-prose").first()).toBeVisible();
  });
});
