import { expect, test } from "@playwright/test";

/**
 * Smoke: blog index + representative static/marketing article slugs.
 * Static corpus slugs: nursenest-core/src/content/blog-static-posts.ts
 * (used when DB has no live posts or build skips DB reads).
 */
const STATIC_BLOG_SLUGS = [
  "clinical-judgment-on-exam-day",
  "pharmacology-without-memorization-chaos",
  "lab-trends-and-acute-kidney-injury",
] as const;

test.describe("Blog patho/pharm smoke (static slugs)", () => {
  test("blog index loads", async ({ page }) => {
    const res = await page.goto("/blog", { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(res?.ok(), `/blog status ${res?.status()}`).toBeTruthy();
    await expect(page.locator("main")).toBeVisible();
  });

  for (const slug of STATIC_BLOG_SLUGS) {
    test(`article /blog/${slug}`, async ({ page }) => {
      const url = `/blog/${slug}`;
      const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120_000 });
      const status = res?.status() ?? 0;
      if (status === 404) {
        test.skip(true, `${url} not in active corpus (DB may override static fallback)`);
      }
      expect(res?.ok(), `${url} status ${status}`).toBeTruthy();
      await expect(page.locator("article")).toBeVisible();
    });
  }

  test("tag hub pathophysiology", async ({ page }) => {
    const res = await page.goto("/blog/tag/pathophysiology", { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(res?.ok(), `/blog/tag/pathophysiology ${res?.status()}`).toBeTruthy();
    await expect(page.locator("main")).toBeVisible();
  });
});
