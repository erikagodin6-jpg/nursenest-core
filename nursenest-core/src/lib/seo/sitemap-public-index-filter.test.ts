import assert from "node:assert/strict";
import test from "node:test";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";
import {
  excludeAbsoluteUrlsMatchingBlogSitemapEntries,
  filterPublicSitemapEntries,
  mergeCoreUrlsWithBlogEntries,
  normalizeSitemapLoc,
} from "@/lib/seo/sitemap-public-index-filter";

const origin = CANONICAL_PRODUCTION_ORIGIN;

test("normalizeSitemapLoc strips line breaks", () => {
  assert.equal(normalizeSitemapLoc(` ${origin}/pricing\n`), `${origin}/pricing`);
});

test("filterPublicSitemapEntries removes /login and /app paths", () => {
  const filtered = filterPublicSitemapEntries(
    [
      { loc: `${origin}/` },
      { loc: `${origin}/login` },
      { loc: `${origin}/pricing` },
      { loc: `${origin}/app/lessons` },
    ],
    origin,
  );
  const locs = new Set(filtered.map((e) => e.loc));
  assert.ok(locs.has(`${origin}/`));
  assert.ok(locs.has(`${origin}/pricing`));
  assert.equal(locs.has(`${origin}/login`), false);
  assert.equal(locs.has(`${origin}/app/lessons`), false);
});

test("excludeAbsoluteUrlsMatchingBlogSitemapEntries drops overlapping blog locs from core", () => {
  const core = [`${origin}/`, `${origin}/blog`, `${origin}/pricing`, `${origin}/blog/post-one`];
  const blog = [{ loc: `${origin}/blog` }, { loc: `${origin}/blog/post-one`, lastmod: "2025-01-01T00:00:00.000Z" }];
  const out = excludeAbsoluteUrlsMatchingBlogSitemapEntries(core, blog);
  assert.deepEqual(new Set(out), new Set([`${origin}/`, `${origin}/pricing`]));
});

test("mergeCoreUrlsWithBlogEntries prefers blog lastmod on duplicate loc", () => {
  const merged = mergeCoreUrlsWithBlogEntries([`${origin}/blog`], [{ loc: `${origin}/blog`, lastmod: "2025-01-02T00:00:00.000Z" }]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0]?.lastmod, "2025-01-02T00:00:00.000Z");
});
