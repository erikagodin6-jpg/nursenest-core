import assert from "node:assert/strict";
import test from "node:test";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";
import {
  excludeAbsoluteUrlsMatchingBlogSitemapEntries,
  filterPublicSitemapEntries,
  mergeCoreUrlsWithBlogEntries,
  normalizeSitemapLoc,
} from "@/lib/seo/sitemap-public-index-filter";
import { collectLocalizedMarketingSegmentUrls } from "@/lib/seo/sitemap-static-xml";
import { collectLocaleMarketingUrls, collectSeoPagesUrls } from "@/lib/seo/sitemap-static-xml";

const origin = CANONICAL_PRODUCTION_ORIGIN;
const blockedLocales = ["it", "vi", "tr", "ur", "ko", "fa", "zh", "pa", "pt"] as const;

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

test("localized sitemap segment excludes blocked locale prefixes", () => {
  const urls = collectLocalizedMarketingSegmentUrls(origin);
  for (const locale of blockedLocales) {
    assert.equal(urls.some((u) => u === `${origin}/${locale}` || u.startsWith(`${origin}/${locale}/`)), false, locale);
  }
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

test("shared NP programmatic pages stay in the English sitemap when they do not live-redirect", () => {
  const urls = new Set(collectSeoPagesUrls(origin));
  for (const slug of [
    "np-exam-practice-questions",
    "np-exam-prep",
    "np-clinical-cases",
    "cnple-practice-questions",
    "canada-np-exam-prep",
    "np-study-guide-canada",
  ]) {
    assert.equal(urls.has(`${origin}/${slug}`), true, slug);
  }
});

test("shared NP programmatic pages stay in localized marketing sitemap slices", async () => {
  const urls = new Set(await collectLocaleMarketingUrls(origin, "fr"));
  for (const slug of [
    "np-exam-practice-questions",
    "np-exam-prep",
    "np-clinical-cases",
    "cnple-practice-questions",
    "canada-np-exam-prep",
    "np-study-guide-canada",
  ]) {
    assert.equal(urls.has(`${origin}/fr/${slug}`), true, slug);
  }
});
