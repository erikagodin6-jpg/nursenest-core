import assert from "node:assert/strict";
import test from "node:test";

test("getPublishedBlogPostsPage returns static fallback when DATABASE_URL is not configured", async () => {
  const prevUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  try {
    const { getPublishedBlogPostsPage } = await import("./safe-blog-queries");
    const page = await getPublishedBlogPostsPage(1, 10);
    assert.equal(page.listLoad.querySucceeded, true);
    assert.equal(page.listLoad.source, "static_fallback");
    assert.equal(page.listLoad.reasonDropped, "database_url_missing_static_bundle");
    assert.ok(Array.isArray(page.posts));
  } finally {
    if (prevUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = prevUrl;
  }
});
