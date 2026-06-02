import assert from "node:assert/strict";
import test from "node:test";
import { buildLanguageSitemapXml } from "@/lib/seo/language-sitemap-xml";

test("English language sitemap includes only the canonical language apex", async () => {
  const xml = await buildLanguageSitemapXml("en");
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(xml, /<loc>https:\/\/nursenest\.ca<\/loc>/);
  assert.doesNotMatch(xml, /<loc>https:\/\/nursenest\.ca\/pricing<\/loc>/);
});

test("French and Spanish language sitemaps are valid but empty while preview/noindex", async () => {
  const fr = await buildLanguageSitemapXml("fr");
  const es = await buildLanguageSitemapXml("es");
  assert.match(fr, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(es, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.doesNotMatch(fr, /<url>/);
  assert.doesNotMatch(es, /<url>/);
  assert.doesNotMatch(fr, /fr\.nursenest\.ca/);
  assert.doesNotMatch(es, /es\.nursenest\.ca/);
});
