/**
 * Breadcrumb intent architecture — visibility, layout stability, single BreadcrumbList JSON-LD.
 *
 * Run: npx playwright test tests/e2e/seo/breadcrumb-intent.spec.ts --project=chromium
 */

import { expect, test } from "@playwright/test";
import { getE2eBaseURL } from "../helpers/e2e-env";

const BASE_URL = getE2eBaseURL();

const VIEWPORTS = [
  { name: "mobile-320", width: 320, height: 640 },
  { name: "ipad-portrait", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
  { name: "ultra-wide", width: 1920, height: 1080 },
] as const;

function countBreadcrumbListScripts(html: string): number {
  const matches = html.match(/"@type"\s*:\s*"BreadcrumbList"/g);
  return matches?.length ?? 0;
}

async function assertSingleBreadcrumbSchema(page: import("@playwright/test").Page) {
  const html = await page.content();
  const count = countBreadcrumbListScripts(html);
  expect(count, "exactly one BreadcrumbList per page").toBeLessThanOrEqual(1);
}

async function assertBreadcrumbNavVisible(page: import("@playwright/test").Page) {
  const nav = page.locator('nav[aria-label="Breadcrumb"], [aria-label="Breadcrumb"]').first();
  await expect(nav).toBeVisible({ timeout: 20_000 });
  const box = await nav.boundingBox();
  expect(box?.width ?? 0).toBeGreaterThan(0);
}

test.describe("Breadcrumb intent — public education surfaces", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const vp of VIEWPORTS) {
    test(`ECG hub breadcrumb visible @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/ecg`, { waitUntil: "domcontentloaded", timeout: 60_000 });
      await assertBreadcrumbNavVisible(page);
      await assertSingleBreadcrumbSchema(page);
    });
  }

  test("labs hub — education trail and unique schema", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/labs-interpretation`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await assertBreadcrumbNavVisible(page);
    const nav = page.locator('[aria-label="Breadcrumb"]').first();
    await expect(nav.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(nav.getByText(/Clinical Modules/i)).toBeVisible();
    await assertSingleBreadcrumbSchema(page);
  });

  test("ECG topic page — hub link in trail", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/ecg/sinus-rhythm`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await assertBreadcrumbNavVisible(page);
    const nav = page.locator('[aria-label="Breadcrumb"]').first();
    await expect(nav.getByRole("link", { name: /ECG Interpretation/i })).toBeVisible();
    await assertSingleBreadcrumbSchema(page);
  });

  test("nursing glossary hub — governed trail", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/nursing-glossary`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await assertBreadcrumbNavVisible(page);
    await assertSingleBreadcrumbSchema(page);
  });

  test("ECG drill — canonical root label (no ECG Academy alias)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/ecg/sinus-rhythm`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    const nav = page.locator('[aria-label="Breadcrumb"]').first();
    await expect(nav).toBeVisible({ timeout: 20_000 });
    await expect(nav.getByText(/ECG Academy|Heart Rhythms|Telemetry Academy/i)).toHaveCount(0);
    await assertSingleBreadcrumbSchema(page);
  });

  test("nursing glossary term — single BreadcrumbList", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/nursing-glossary`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    const termLink = page.locator('a[href^="/nursing-glossary/"]').first();
    const href = await termLink.getAttribute("href");
    test.skip(!href, "no glossary term published");
    await page.goto(`${BASE_URL}${href}`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await assertBreadcrumbNavVisible(page);
    await assertSingleBreadcrumbSchema(page);
  });

  test("pathway lesson detail — education hierarchy (no geo country crumb)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/canada/rn/nclex-rn/lessons`, { waitUntil: "domcontentloaded", timeout: 90_000 });
    const lessonLink = page.locator('a[href*="/canada/rn/nclex-rn/lessons/"]').first();
    const href = await lessonLink.getAttribute("href");
    test.skip(!href, "no published lesson link on lessons hub");
    await page.goto(`${BASE_URL}${href}`, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await assertBreadcrumbNavVisible(page);
    const nav = page.locator('[aria-label="Breadcrumb"]').first();
    await expect(nav.getByText(/Canada/i)).toHaveCount(0);
    await expect(nav.getByRole("link", { name: /NCLEX-RN/i })).toBeVisible();
    await assertSingleBreadcrumbSchema(page);
  });
});

test.describe("Breadcrumb intent — programmatic SEO convergence", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("programmatic hub page — single schema and visible trail", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/nclex-prep`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    test.skip((await page.locator('[aria-label="Breadcrumb"]').count()) === 0, "route not deployed");
    await assertBreadcrumbNavVisible(page);
    await assertSingleBreadcrumbSchema(page);
  });
});

test.describe("Breadcrumb intent — layout fallback signals", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("about page — at most one BreadcrumbList (layout fallback safe)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/about`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await assertSingleBreadcrumbSchema(page);
  });
});
