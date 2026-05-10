import assert from "node:assert/strict";
import test from "node:test";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";
import { excludeAbsoluteUrlsMatchingBlogSitemapEntries } from "@/lib/seo/sitemap-public-index-filter";
import { collectCoreUrls, collectPathwayLessonSeoUrls } from "@/lib/seo/sitemap-static-xml";

/**
 * Cheap overlap guard: core-without-lessons and pathway-lesson collector must not share `<loc>` strings
 * for default canonical origin (static parts of collectors only — full DB lists not asserted).
 */
test("collectCoreUrls omit lessons does not overlap collectPathwayLessonSeoUrls prefix paths", async () => {
  const origin = CANONICAL_PRODUCTION_ORIGIN;
  const [coreMinus, lessonUrls] = await Promise.all([
    collectCoreUrls(origin, { omitPathwayLessonSeoUrls: true }),
    collectPathwayLessonSeoUrls(origin),
  ]);
  const lessonSet = new Set(lessonUrls);
  const overlap = coreMinus.filter((u) => lessonSet.has(u));
  assert.equal(
    overlap.length,
    0,
    `expected no shared loc between core (omit lessons) and lesson urlset, got: ${overlap.slice(0, 8).join(", ")}`,
  );
});

test("excludeAbsoluteUrlsMatchingBlogSitemapEntries still strips blog from synthetic core", () => {
  const origin = CANONICAL_PRODUCTION_ORIGIN;
  const core = [`${origin}/`, `${origin}/blog`];
  const blog = [{ loc: `${origin}/blog` }];
  const out = excludeAbsoluteUrlsMatchingBlogSitemapEntries(core, blog);
  assert.deepEqual(out, [`${origin}/`]);
});
