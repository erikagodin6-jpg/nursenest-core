/**
 * Proves marketing `/blog` lists and `/blog/{slug}` render article HTML for live posts.
 *
 * Requires a running app (`BASE_URL`, default http://localhost:3000) and enough published posts
 * under {@link blogLiveWhere} (postStatus + workflowStatus contract).
 */
import { expect, test } from "@playwright/test";

function extractBlogSlugsFromIndexHtml(html: string, max: number): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const m of html.matchAll(/href="(\/blog\/[a-z0-9][a-z0-9-]*)"/gi)) {
    const path = m[1].toLowerCase();
    const slug = path.replace(/^\/blog\//, "");
    if (!slug || slug.startsWith("tag") || slug === "page") continue;
    if (seen.has(slug)) continue;
    seen.add(slug);
    out.push(slug);
    if (out.length >= max) break;
  }
  return out;
}

test.describe("blog publication proof", () => {
  test.describe.configure({ mode: "serial" });

  test("index, five articles, body, no draft placeholders, sitemap contains slugs", async ({ page, request }) => {
    const indexRes = await request.get("/blog");
    expect(
      indexRes.ok(),
      `GET /blog failed: ${indexRes.status()} ${await indexRes.text().then((t) => t.slice(0, 200))}`,
    ).toBeTruthy();
    const indexHtml = await indexRes.text();
    expect(indexHtml).not.toMatch(/Blog list could not load/i);

    const slugs = extractBlogSlugsFromIndexHtml(indexHtml, 8);
    expect(
      slugs.length,
      "Need at least 5 /blog/{slug} links on the index to prove publication (seed or publish posts).",
    ).toBeGreaterThanOrEqual(5);

    const chosen = slugs.slice(0, 5);
    for (const slug of chosen) {
      await page.goto(`/blog/${slug}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("article")).toBeVisible();
      const prose = page.locator("article .prose");
      await expect(prose).toBeVisible();
      const text = (await prose.innerText()).replace(/\s+/g, " ").trim();
      expect(text.length, `Article body too short for /blog/${slug}`).toBeGreaterThan(200);
      const lower = text.toLowerCase();
      expect(lower, `placeholder 'coming soon' in body for ${slug}`).not.toContain("coming soon");
      if (lower.includes("lorem ipsum")) {
        expect(text.length, `lorem-heavy stub for ${slug}`).toBeGreaterThan(400);
      }
      const h1 = page.locator("article h1").first();
      await expect(h1).toBeVisible();
      const h1t = (await h1.innerText()).toLowerCase();
      if (h1t.includes("draft")) {
        expect(h1t.length, `draft-like h1 for ${slug}`).toBeGreaterThan(40);
      }
    }

    const sm = await request.get("/sitemap.xml");
    expect(sm.ok(), `GET /sitemap.xml failed: ${sm.status()}`).toBeTruthy();
    const smText = await sm.text();
    for (const slug of chosen) {
      expect(smText, `sitemap should include /blog/${slug}`).toContain(`/blog/${slug}`);
    }
  });
});
