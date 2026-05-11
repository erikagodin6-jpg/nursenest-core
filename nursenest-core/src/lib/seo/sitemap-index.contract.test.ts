import assert from "node:assert/strict";
import test from "node:test";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";
import {
  absoluteUrlsForSitemapIndexChildren,
  buildSitemapIndexXmlForOrigin,
  SITEMAP_INDEX_CHILD_FILENAMES,
} from "@/lib/seo/sitemap-index-children";
import { buildSitemapIndexXml } from "@/lib/seo/sitemap-urlset-build";

test("sitemap index XML declares sitemapindex schema", () => {
  const xml = buildSitemapIndexXml([`${CANONICAL_PRODUCTION_ORIGIN}/sitemap-core.xml`]);
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<sitemapindex xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(xml, /<sitemap>/);
  assert.match(xml, /<loc>https:\/\/www\.nursenest\.ca\/sitemap-core\.xml<\/loc>/);
  assert.match(xml, /<\/sitemapindex>/);
});

test("canonical child filenames cover phase-3 segments", () => {
  assert.deepEqual(SITEMAP_INDEX_CHILD_FILENAMES, [
    "sitemap-core.xml",
    "sitemap-blog.xml",
    "sitemap-fr-blog.xml",
    "sitemap-es-blog.xml",
    "sitemap-pathways.xml",
    "sitemap-lessons.xml",
    "sitemap-localized.xml",
    "sitemap-clinical-modules.xml",
    "sitemap-allied.xml",
    "sitemap-new-grad.xml",
  ]);
});

test("absoluteUrlsForSitemapIndexChildren matches canonical origin prefix", () => {
  const urls = absoluteUrlsForSitemapIndexChildren(CANONICAL_PRODUCTION_ORIGIN);
  assert.equal(urls.length, SITEMAP_INDEX_CHILD_FILENAMES.length);
  assert.ok(urls.every((u) => u.startsWith(`${CANONICAL_PRODUCTION_ORIGIN}/`)));
  assert.ok(urls[0]?.endsWith("/sitemap-core.xml"));
});

test("buildSitemapIndexXmlForOrigin produces one child loc per configured sitemap segment", () => {
  const xml = buildSitemapIndexXmlForOrigin(CANONICAL_PRODUCTION_ORIGIN);
  const locs = xml.match(/<loc>[^<]+<\/loc>/g) ?? [];
  assert.equal(locs.length, SITEMAP_INDEX_CHILD_FILENAMES.length);
});
