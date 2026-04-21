import assert from "node:assert/strict";
import test from "node:test";

test("blog queries skip Prisma during phase-production-build", async () => {
  const prevPhase = process.env.NEXT_PHASE;
  const prevSkip = process.env.MARKETING_BLOG_SKIP_DB_FOR_BUILD;
  process.env.NEXT_PHASE = "phase-production-build";
  delete process.env.MARKETING_BLOG_SKIP_DB_FOR_BUILD;

  const {
    getPublishedBlogPostsPage,
    countPublishedPostsWithTag,
    canUseStaticBlogFallback,
  } = await import("./safe-blog-queries");

  const page = await getPublishedBlogPostsPage(1, 24);
  assert.ok(Array.isArray(page.posts));
  assert.ok(page.total >= 0);

  const tagCount = await countPublishedPostsWithTag("__nonexistent_tag_xyz__");
  assert.equal(tagCount, 0);

  assert.equal(await canUseStaticBlogFallback(), page.total > 0);

  process.env.NEXT_PHASE = prevPhase;
  if (prevSkip === undefined) delete process.env.MARKETING_BLOG_SKIP_DB_FOR_BUILD;
  else process.env.MARKETING_BLOG_SKIP_DB_FOR_BUILD = prevSkip;
});
