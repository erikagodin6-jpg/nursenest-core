import { expect, test } from "@playwright/test";

/**
 * Blog marketing redesign: index, tag, category, article; no console errors; mobile viewport.
 */
test.describe("Blog marketing redesign", () => {
  test("blog index, tag, category, and article — no console errors, main content", async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (e) => errors.push(e.message));

    const indexRes = await page.goto("/blog", { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(indexRes?.ok(), `GET /blog ${indexRes?.status()}`).toBeTruthy();
    await expect(page.locator("main")).toBeVisible();
    const candidates = page.locator('main a[href^="/blog/"]');
    const n = await candidates.count();
    let postHref: string | null = null;
    for (let i = 0; i < n; i++) {
      const h = await candidates.nth(i).getAttribute("href");
      if (h && /^\/blog\/[^/]+$/.test(h) && !h.includes("/blog/tag/") && !h.includes("/blog/category/")) {
        postHref = h;
        break;
      }
    }
    test.skip(!postHref, "No article href on blog index");

    const tagRes = await page.goto("/blog/tag/pathophysiology", { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(tagRes?.ok(), `tag page ${tagRes?.status()}`).toBeTruthy();
    await expect(page.locator("main")).toBeVisible();

    const categoryRes = await page.goto("/blog/category/Pathophysiology", { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(categoryRes?.status() ?? 0, "category page should render (may be empty)").toBeLessThan(500);

    const articleRes = await page.goto(postHref!, { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(articleRes?.ok(), `article ${postHref} ${articleRes?.status()}`).toBeTruthy();
    await expect(page.locator("article")).toBeVisible();

    const bad = errors.filter((e) => !/favicon|ResizeObserver|hydration|Warning:/i.test(e));
    expect(bad, `console errors: ${bad.join("\n")}`).toEqual([]);

    await testInfo.attach("blog-article-desktop", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  });

  test("blog index mobile viewport", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const res = await page.goto("/blog", { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(res?.ok(), `/blog mobile ${res?.status()}`).toBeTruthy();
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const vp = page.viewportSize()?.width ?? 390;
    expect(bodyWidth, "horizontal scroll / overflow").toBeLessThanOrEqual(vp + 2);
    await testInfo.attach("blog-index-mobile", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  });
});
