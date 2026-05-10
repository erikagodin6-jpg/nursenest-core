import assert from "node:assert/strict";
import test from "node:test";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";
import { excludeAbsoluteUrlsMatchingBlogSitemapEntries } from "@/lib/seo/sitemap-public-index-filter";

/**
 * Segment isolation for `/sitemap-core.xml` vs `/sitemap-blog.xml` stays aligned with
 * {@link excludeAbsoluteUrlsMatchingBlogSitemapEntries} — pathway-lesson partition is enforced via
 * `omitPathwayLessonSeoUrls` in {@link collectCoreUrls} (see source routes); full DB collectors are not run here because
 * they require Next.js cache/request context.
 */
test("excludeAbsoluteUrlsMatchingBlogSitemapEntries still strips blog from synthetic core", () => {
  const origin = CANONICAL_PRODUCTION_ORIGIN;
  const core = [`${origin}/`, `${origin}/blog`];
  const blog = [{ loc: `${origin}/blog` }];
  const out = excludeAbsoluteUrlsMatchingBlogSitemapEntries(core, blog);
  assert.deepEqual(out, [`${origin}/`]);
});
