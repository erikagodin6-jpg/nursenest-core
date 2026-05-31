import assert from "node:assert/strict";
import test from "node:test";
import { getHreflangEligibleLocales, getSitemapIncludedLocales, localeRobotsOverride } from "@/lib/i18n/language-readiness";
import { absoluteMarketingCanonical, marketingHreflangLanguagesForEnPath } from "@/lib/seo/marketing-alternates";
import { buildLanguageSitemapXml } from "@/lib/seo/language-sitemap-xml";

test("English canonical and hreflang output is stable when localized ecosystems are disabled", () => {
  assert.equal(absoluteMarketingCanonical("en", "/"), "https://nursenest.ca/");
  assert.equal(absoluteMarketingCanonical("en", "/pricing"), "https://nursenest.ca/pricing");
  assert.deepEqual(marketingHreflangLanguagesForEnPath("/pricing"), {
    "x-default": "https://nursenest.ca/pricing",
    "en-CA": "https://nursenest.ca/pricing",
  });
});

test("only English participates in production sitemap and hreflang readiness by default", () => {
  assert.deepEqual(getHreflangEligibleLocales(), []);
  assert.deepEqual(getSitemapIncludedLocales(), []);
  assert.equal(localeRobotsOverride("en"), null);
  assert.deepEqual(localeRobotsOverride("fr"), { index: false, follow: false });
  assert.deepEqual(localeRobotsOverride("es"), { index: false, follow: false });
  assert.deepEqual(localeRobotsOverride("hi"), { index: false, follow: false });
});

test("language sitemap builder keeps unfinished language urlsets empty", async () => {
  const en = await buildLanguageSitemapXml("en");
  const es = await buildLanguageSitemapXml("es");
  const ja = await buildLanguageSitemapXml("ja");

  assert.match(en, /<loc>https:\/\/nursenest\.ca\//);
  assert.doesNotMatch(en, /fr\.nursenest\.ca|es\.nursenest\.ca|jp\.nursenest\.ca/);
  assert.match(es, /<urlset/);
  assert.doesNotMatch(es, /<loc>/);
  assert.match(ja, /<urlset/);
  assert.doesNotMatch(ja, /<loc>/);
});

