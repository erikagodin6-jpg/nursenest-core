import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";
import { getSitemapIncludedLocales } from "@/lib/i18n/language-readiness";
import {
  collectLocalizedMarketingSegmentUrls,
  normalizeOrigin,
} from "@/lib/seo/sitemap-static-xml";

test("localized segment only emits tier-full locale prefixes from getSitemapIncludedLocales", () => {
  const origin = normalizeOrigin(CANONICAL_PRODUCTION_ORIGIN);
  const urls = collectLocalizedMarketingSegmentUrls(origin);
  const allowed = new Set(getSitemapIncludedLocales());
  assert.ok(urls.length > 0);
  for (const u of urls) {
    const pathname = new URL(u).pathname;
    const loc = pathname.split("/").filter(Boolean)[0];
    assert.ok(loc && allowed.has(loc), `unexpected localized segment prefix: ${loc} in ${u}`);
  }
  assert.ok(!urls.some((u) => u.includes("/fr/")), "partial-tier fr must not appear in localized urlset");
  assert.ok(!urls.some((u) => u.includes("/es/")), "partial-tier es must not appear in localized urlset");
});

test("sitemap-core route passes phase-2 omit flags for disjoint segments", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const routeSrc = readFileSync(join(here, "..", "..", "app", "sitemap-core.xml", "route.ts"), "utf8");
  assert.match(routeSrc, /omitPathwayLessonSeoUrls:\s*true/);
  assert.match(routeSrc, /omitLocalizedMarketingUrls:\s*true/);
  assert.match(routeSrc, /omitExamPathwayAndTopicProgrammaticUrls:\s*true/);
});

test("no segment uses hreflang in XML (policy: hreflang stays in page metadata only)", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const appSeo = join(here, "..", "..", "app");
  for (const name of [
    "sitemap.xml/route.ts",
    "sitemap-en.xml/route.ts",
    "sitemap-fr.xml/route.ts",
    "sitemap-es.xml/route.ts",
    "sitemap-core.xml/route.ts",
    "sitemap-pathways.xml/route.ts",
    "sitemap-lessons.xml/route.ts",
    "sitemap-localized.xml/route.ts",
    "sitemap-clinical-modules.xml/route.ts",
    "sitemap-blog.xml/route.ts",
  ]) {
    const src = readFileSync(join(appSeo, name), "utf8");
    assert.match(src, /buildSitemapIndexXml|buildSitemapUrlsetFromAbsoluteUrls|buildLanguageSitemapXml/);
    assert.ok(!src.includes("xhtml:link"), `${name} must not embed hreflang in sitemap XML`);
  }
});
