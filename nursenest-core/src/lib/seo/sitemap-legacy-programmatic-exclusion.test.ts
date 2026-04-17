import assert from "node:assert/strict";
import test from "node:test";
import { LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT } from "@/lib/marketing/canonical-pathway-hubs";
import { collectLocaleMarketingUrls, collectSeoPagesUrls } from "@/lib/seo/sitemap-static-xml";

const ORIGIN = "https://example.test";

test("collectSeoPagesUrls excludes legacy programmatic slugs that 301 to pathway hubs", () => {
  const urls = new Set(collectSeoPagesUrls(ORIGIN));
  for (const slug of LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT) {
    assert.equal(urls.has(`${ORIGIN}/${slug}`), false, `must not sitemap ${slug} (HTTP redirect to hub)`);
  }
});

test("collectLocaleMarketingUrls excludes legacy programmatic slugs per locale", () => {
  const urls = new Set(collectLocaleMarketingUrls(ORIGIN, "fr"));
  for (const slug of LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT) {
    assert.equal(urls.has(`${ORIGIN}/fr/${slug}`), false, `must not sitemap /fr/${slug}`);
  }
});
