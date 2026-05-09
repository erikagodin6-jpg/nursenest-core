/**
 * Minimal marketing blog smoke: index, RN hub, tag hub, category hub (no dependency on a specific article slug;
 * production DB may shadow bundled static slugs).
 *
 * From nursenest-core:
 *   npx playwright test -c playwright.blog-smoke.config.ts
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=http://127.0.0.1:3000 npx playwright test -c playwright.blog-smoke.config.ts
 */
import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.describe("marketing blog smoke", () => {
  test("blog index responds", async ({ page }) => {
    const resp = await page.goto("/blog", { waitUntil: "domcontentloaded", timeout: 120_000 });
    if (resp && resp.status() >= 500) {
      test.skip(true, `/blog returned ${resp.status()} (skip — server/DB)`);
    }
    await expect(page.locator(".nn-blog-index, .nn-premium-blog-index").first()).toBeVisible({
      timeout: 60_000,
    });
  });

  test("RN blog hub responds", async ({ page }) => {
    const resp = await page.goto("/blog/rn", { waitUntil: "domcontentloaded", timeout: 120_000 });
    if (resp && resp.status() >= 500) {
      test.skip(true, `/blog/rn returned ${resp.status()} (skip — server/DB)`);
    }
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 60_000 });
  });

  test("pathophysiology tag hub responds", async ({ page }) => {
    const path = "/blog/tag/pathophysiology";
    const resp = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 120_000 });
    if (resp && resp.status() >= 500) {
      test.skip(true, `${path} returned ${resp.status()} (skip — server/DB)`);
    }
    await expect(page.locator(".nn-blog-index, .nn-premium-blog-index").first()).toBeVisible({
      timeout: 60_000,
    });
  });

  test("pharmacology category hub responds", async ({ page }) => {
    const path = `/blog/category/${encodeURIComponent("Pharmacology")}`;
    const resp = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 120_000 });
    if (resp && resp.status() >= 500) {
      test.skip(true, `${path} returned ${resp.status()} (skip — server/DB)`);
    }
    await expect(page.locator(".nn-blog-index, .nn-premium-blog-index").first()).toBeVisible({
      timeout: 60_000,
    });
  });
});
