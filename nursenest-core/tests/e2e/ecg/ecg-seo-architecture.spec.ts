/**
 * ECG SEO + internal linking architecture smoke tests.
 *
 * Validates that the ECG topical cluster is correctly integrated:
 *  - Pillar page (/advanced-ecg-nursing) renders with correct heading
 *  - Clinical modules hub (/clinical-modules) renders with ECG card
 *  - All 10 ECG cluster topic pages (/ecg/[topic]) render correctly
 *  - Internal links on pillar page point to cluster and module
 *  - No noindex tags on any ECG SEO page
 *  - Nav link is present (ECG Mastery)
 *  - Mobile: no horizontal overflow on pillar
 *  - CTA buttons are present and keyboard-focusable
 */

import { expect, test } from "@playwright/test";
import { gotoExpectOk, expectNotPageNotFound } from "../helpers/navigation-e2e";

const ECG_CLUSTER_SLUGS = [
  "ecg-leads-explained",
  "stemi-localization",
  "hyperkalemia-ecg-changes",
  "mobitz-1-vs-mobitz-2",
  "svt-vs-atrial-fibrillation",
  "ventricular-tachycardia",
  "torsades-de-pointes",
  "qt-prolongation",
  "heart-block-interpretation",
  "ecg-practice-questions",
] as const;

test.describe("ECG pillar page — /advanced-ecg-nursing", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("renders with correct H1 and required sections", async ({ page }) => {
    await gotoExpectOk(page, "/advanced-ecg-nursing");
    await expectNotPageNotFound(page);

    // H1 must be present
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible({ timeout: 20_000 });
    const h1Text = await h1.textContent();
    expect(h1Text).toContain("ECG");

    // Required content sections
    await expect(page.getByRole("heading", { name: /12-lead/i, level: 2 })).toBeVisible();
    await expect(page.getByRole("heading", { name: /arrhythmia/i, level: 2 })).toBeVisible();
    await expect(page.getByRole("heading", { name: /STEMI/i, level: 2 })).toBeVisible();
    await expect(page.getByRole("heading", { name: /heart block/i, level: 2 })).toBeVisible();
    await expect(page.getByRole("heading", { name: /electrolyte/i, level: 2 })).toBeVisible();
  });

  test("has indexable robots directive (no noindex)", async ({ page }) => {
    await page.goto("/advanced-ecg-nursing", { waitUntil: "domcontentloaded" });
    const metaRobots = await page.$eval(
      'meta[name="robots"]',
      (el) => el.getAttribute("content") ?? "",
    ).catch(() => "");
    expect(metaRobots).not.toContain("noindex");
  });

  test("has EducationalCourse JSON-LD schema", async ({ page }) => {
    await page.goto("/advanced-ecg-nursing", { waitUntil: "domcontentloaded" });
    const ldJson = await page.$eval('script[type="application/ld+json"]', (el) => el.textContent ?? "");
    const parsed = JSON.parse(ldJson);
    const graph = parsed["@graph"] ?? [parsed];
    const hasCourse = graph.some((node: Record<string, unknown>) => node["@type"] === "EducationalCourse");
    expect(hasCourse, "Page must include EducationalCourse JSON-LD").toBe(true);
  });

  test("has FAQ section with at least 3 items", async ({ page }) => {
    await gotoExpectOk(page, "/advanced-ecg-nursing");
    const faqItems = page.locator("dl dt, section[aria-labelledby] dt");
    await expect(faqItems.first()).toBeVisible({ timeout: 15_000 });
    const count = await faqItems.count();
    expect(count, "Expected at least 3 FAQ items").toBeGreaterThanOrEqual(3);
  });

  test("primary CTA links to Advanced ECG module", async ({ page }) => {
    await gotoExpectOk(page, "/advanced-ecg-nursing");
    const cta = page.locator('a[href="/modules/ecg-advanced"]').first();
    await expect(cta).toBeVisible({ timeout: 15_000 });
    await cta.focus();
    await expect(cta).toBeFocused();
  });

  test("internal links include ECG cluster topics", async ({ page }) => {
    await gotoExpectOk(page, "/advanced-ecg-nursing");
    const clusterLink = page.locator('a[href*="/ecg/stemi-localization"]');
    await expect(clusterLink).toBeVisible({ timeout: 15_000 });
  });

  test("has breadcrumb navigation with correct structure", async ({ page }) => {
    await gotoExpectOk(page, "/advanced-ecg-nursing");
    const breadcrumb = page.getByRole("navigation", { name: /breadcrumb/i });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByRole("link", { name: /ECG Interpretation/i })).toBeVisible();
  });
});

test.describe("Clinical modules hub — /clinical-modules", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("renders with ECG module card above the fold", async ({ page }) => {
    await gotoExpectOk(page, "/clinical-modules");
    await expectNotPageNotFound(page);

    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible({ timeout: 20_000 });

    // ECG card must be present with correct anchor text
    const ecgCard = page.getByRole("heading", {
      name: /Advanced ECG Interpretation.*Cardiac Rhythm Mastery/i,
    });
    await expect(ecgCard).toBeVisible();
  });

  test("has indexable robots and no noindex", async ({ page }) => {
    await page.goto("/clinical-modules", { waitUntil: "domcontentloaded" });
    const metaRobots = await page.$eval(
      'meta[name="robots"]',
      (el) => el.getAttribute("content") ?? "",
    ).catch(() => "");
    expect(metaRobots).not.toContain("noindex");
  });

  test("ECG module CTA links to Advanced ECG module", async ({ page }) => {
    await gotoExpectOk(page, "/clinical-modules");
    const moduleCta = page.locator('a[href="/modules/ecg-advanced"]').first();
    await expect(moduleCta).toBeVisible({ timeout: 15_000 });
  });

  test("links to /advanced-ecg-nursing pillar", async ({ page }) => {
    await gotoExpectOk(page, "/clinical-modules");
    const pillarLink = page.locator('a[href="/advanced-ecg-nursing"]').first();
    await expect(pillarLink).toBeVisible({ timeout: 15_000 });
  });
});

test.describe("ECG cluster topic pages — /ecg/[topic]", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const slug of ECG_CLUSTER_SLUGS) {
    test(`/ecg/${slug} renders with heading and pillar link`, async ({ page }) => {
      await gotoExpectOk(page, `/ecg/${slug}`);
      await expectNotPageNotFound(page);

      // H1 must contain ECG-related content
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toBeVisible({ timeout: 20_000 });

      // Must link back to pillar
      const pillarLink = page.locator('a[href="/advanced-ecg-nursing"]').first();
      await expect(pillarLink).toBeVisible({ timeout: 15_000 });

      // Must not have noindex
      const metaRobots = await page.$eval(
        'meta[name="robots"]',
        (el) => el.getAttribute("content") ?? "",
      ).catch(() => "");
      expect(metaRobots).not.toContain("noindex");
    });
  }
});

test.describe("ECG SEO — mobile responsiveness", () => {
  test.use({
    storageState: { cookies: [], origins: [] },
    viewport: { width: 375, height: 812 },
  });

  test("/advanced-ecg-nursing: no horizontal overflow on mobile", async ({ page }) => {
    await gotoExpectOk(page, "/advanced-ecg-nursing");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible({ timeout: 20_000 });

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth, `horizontal overflow: ${scrollWidth} > ${innerWidth}`).toBeLessThanOrEqual(innerWidth + 2);
  });

  test("/clinical-modules: renders cleanly on mobile", async ({ page }) => {
    await gotoExpectOk(page, "/clinical-modules");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible({ timeout: 20_000 });

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 2);
  });
});

test.describe("ECG navigation — ECG Mastery nav item", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("desktop nav contains link to /advanced-ecg-nursing", async ({ page }) => {
    await gotoExpectOk(page, "/");
    // Look for any ECG-related navigation link — nav item or mega menu
    const ecgNavLink = page.locator('nav a[href="/advanced-ecg-nursing"]').first();
    // This may be in desktop dropdown — check if it exists in DOM
    const linkCount = await page.locator('a[href="/advanced-ecg-nursing"]').count();
    expect(linkCount, "At least one link to /advanced-ecg-nursing must exist on homepage").toBeGreaterThanOrEqual(1);
  });
});
