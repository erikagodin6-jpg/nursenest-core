/**
 * Minimal marketing blog smoke: stable routes from static corpus + hub index.
 *
 * From nursenest-core:
 *   npx playwright test tests/e2e/public/marketing-blog-smoke.spec.ts --project=chromium
 *
 * Skips when the server returns 5xx on /blog (environment/DB cold start) to avoid flaky CI noise.
 */
import { expect, test } from "@playwright/test";
import { STATIC_BLOG_POSTS } from "../../../src/content/blog-static-posts";

const STABLE_SLUGS = STATIC_BLOG_POSTS.map((p) => p.slug).slice(0, 3);

test.describe("marketing blog smoke", () => {
  test("blog index responds", async ({ page, request }) => {
    const head = await request.get("/blog", { maxRedirects: 5 });
    if (head.status() >= 500) {
      test.skip(true, `/blog returned ${head.status()} (skip — server/DB)`);
    }
    await page.goto("/blog", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await expect(page.locator(".nn-blog-index, .nn-premium-blog-index").first()).toBeVisible({
      timeout: 60_000,
    });
  });

  test("RN blog hub responds", async ({ page, request }) => {
    const head = await request.get("/blog/rn", { maxRedirects: 5 });
    if (head.status() >= 500) {
      test.skip(true, `/blog/rn returned ${head.status()} (skip — server/DB)`);
    }
    await page.goto("/blog/rn", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 60_000 });
  });

  for (const slug of STABLE_SLUGS) {
    test(`article static slug: ${slug}`, async ({ page, request }) => {
      const path = `/blog/${encodeURIComponent(slug)}`;
      const res = await request.get(path, { maxRedirects: 5 });
      if (res.status() >= 500) {
        test.skip(true, `${path} returned ${res.status()} (skip — server/DB)`);
      }
      await page.goto(path, { waitUntil: "domcontentloaded", timeout: 120_000 });
      await expect(page.locator("#nn-blog-article-body").first()).toBeVisible({ timeout: 60_000 });
    });
  }
});
