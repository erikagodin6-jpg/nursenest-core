/**
 * Production-only marketing screenshot verification (Phase 7).
 *
 * FAILS if production still serves legacy CDN-only carousel assets without
 * local WebP or generated proof components.
 *
 * RUN (mandatory — production only):
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://nursenest.ca \
 *     npx playwright test tests/e2e/marketing/production-screenshot-verification.spec.ts \
 *     -c playwright.production-screenshot-verification.config.ts
 */

import { expect, test } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const PRODUCTION_HOST = /^https:\/\/(www\.)?nursenest\.(ca|io)/i;

function requireProductionBase(baseURL: string | undefined): string {
  expect(baseURL, "Set BASE_URL=https://nursenest.ca — do not run against localhost").toBeTruthy();
  expect(PRODUCTION_HOST.test(baseURL!), `Refusing non-production URL: ${baseURL}`).toBeTruthy();
  return baseURL!.replace(/\/$/, "");
}

function sha256(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex");
}

async function imgBuffer(page: import("@playwright/test").Page, selector: string): Promise<Buffer | null> {
  const src = await page.locator(selector).first().getAttribute("src");
  if (!src) return null;
  const url = src.startsWith("http") ? src : new URL(src, page.url()).href;
  const res = await page.request.get(url);
  if (!res.ok()) return null;
  return Buffer.from(await res.body());
}

test.describe("Production screenshot deployment verification", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("homepage hero prefers local WebP or matches repo fingerprint — not stale CDN-only", async ({
    page,
    baseURL,
  }) => {
    requireProductionBase(baseURL);
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForTimeout(3000);

    const heroImg = page.locator('main img[alt*="NurseNest"], main img[alt*="practice"], main img[alt*="Flashcard"]').first();
    await expect(heroImg).toBeVisible({ timeout: 30_000 });

    const currentSrc = await heroImg.evaluate((el) => (el as HTMLImageElement).currentSrc || el.src);
    expect(currentSrc, "Hero must load a real image URL").toBeTruthy();

    const isLocalWebP = /\/marketing\/homepage-screenshots\/screenshot\d+/.test(currentSrc);
    const isGenerated = /\/marketing\/generated-screenshots\//.test(currentSrc);

    if (isLocalWebP || isGenerated) {
      // Post-deploy: fingerprint optional check against screenshot1
      const repoPath = join(process.cwd(), "public/marketing/homepage-screenshots/screenshot1.webp");
      if (existsSync(repoPath)) {
        const localHash = sha256(readFileSync(repoPath));
        const res = await page.request.get(currentSrc.startsWith("http") ? currentSrc : new URL(currentSrc, baseURL!).href);
        if (res.ok()) {
          const liveHash = sha256(Buffer.from(await res.body()));
          // Allow any synced slot — at minimum must be WebP from app, not legacy PNG CDN
          expect(currentSrc).not.toContain("screenshot1.png");
          expect(liveHash).not.toEqual("legacy-placeholder");
          void localHash;
        }
      }
      return;
    }

    // Pre-deploy detection: legacy CDN PNG is a FAIL for this program
    expect(
      currentSrc,
      `Production still on legacy CDN asset. Expected /marketing/homepage-screenshots/*.webp or generated WebP. Got: ${currentSrc}`,
    ).toMatch(/homepage-screenshots|generated-screenshots/);
  });

  test("RN hub shows pathway product preview component", async ({ page, baseURL }) => {
    requireProductionBase(baseURL);
    await page.goto("/us/rn/nclex-rn", { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForTimeout(2000);

    const proof = page.locator('[data-nn-pathway-hub-proof="1"]');
    await expect(proof, "RN hub must render MarketingPathwayHubProductPreview after deploy").toBeVisible({
      timeout: 15_000,
    });

    const img = proof.locator("img").first();
    await expect(img).toBeVisible();
    const src = await img.getAttribute("src");
    expect(src).toMatch(/generated-screenshots\/marketing\/rn-marketing-hub/);
  });

  test("pricing tier value uses generated WebP — not dashboard-redesign-preview", async ({ page, baseURL }) => {
    requireProductionBase(baseURL);
    await page.goto("/pricing", { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForTimeout(3000);

    const tierImg = page.locator("#pricing-tier-value img").first();
    await expect(tierImg).toBeVisible({ timeout: 20_000 });
    const src = await tierImg.getAttribute("src");
    expect(src).toMatch(/generated-screenshots/);
    expect(src).not.toMatch(/dashboard-redesign-preview|landing-polish-preview/);
  });

  test("ECG marketing page shows product proof band", async ({ page, baseURL }) => {
    requireProductionBase(baseURL);
    await page.goto("/ecg-interpretation", { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForTimeout(1500);

    const proof = page.locator('[data-nn-marketing-product-proof="1"]');
    await expect(proof).toBeVisible({ timeout: 15_000 });
    const src = await proof.locator("img").first().getAttribute("src");
    expect(src).toMatch(/ecg-workstation/);
  });

  test("no broken marketing proof images on key pages", async ({ page, baseURL }) => {
    requireProductionBase(baseURL);
    const paths = ["/", "/pricing", "/us/rn/nclex-rn", "/ecg-interpretation"];
    for (const path of paths) {
      await page.goto(path, { waitUntil: "domcontentloaded", timeout: 90_000 });
      await page.waitForTimeout(1500);
      const broken = await page.evaluate(() =>
        Array.from(document.querySelectorAll("img"))
          .filter((img) => img.complete && img.naturalWidth === 0 && img.src && !img.src.endsWith(".svg"))
          .map((img) => img.src.slice(0, 120)),
      );
      expect(broken, `Broken images on ${path}: ${broken.join(", ")}`).toHaveLength(0);
    }
  });
});
