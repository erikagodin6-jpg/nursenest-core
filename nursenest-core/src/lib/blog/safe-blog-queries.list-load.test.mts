import assert from "node:assert/strict";
import test from "node:test";

test("getPublishedBlogPostsPage returns listLoad error when DATABASE_URL is not configured", async () => {
  const prevUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  try {
    const { getPublishedBlogPostsPage } = await import("./safe-blog-queries");
    const page = await getPublishedBlogPostsPage(1, 10);
    assert.equal(page.listLoad.querySucceeded, false);
    assert.equal(page.listLoad.source, "error");
    assert.equal(page.posts.length, 0);
    assert.ok(page.listLoad.reasonFailed?.includes("db_missing_url") || page.listLoad.reasonFailed?.length);
  } finally {
    if (prevUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = prevUrl;
    if (prevDirect === undefined) delete process.env.DIRECT_URL;
    else process.env.DIRECT_URL = prevDirect;
  }
});
