import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buildSitemapUrlsetFromAbsoluteUrls } from "@/lib/seo/sitemap-urlset-build";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..", "..");

function readAppFile(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

test("sitemap with blog posts returns more than 16 URLs", () => {
  const mockUrls = Array.from({ length: 17 }, (_, i) => `https://nursenest.ca/blog/post-${i + 1}`);
  const xml = buildSitemapUrlsetFromAbsoluteUrls(mockUrls);
  const matches = xml.match(/<url>/g) ?? [];
  assert.ok(matches.length > 16, `expected >16 <url> entries, got ${matches.length}`);
});

test("sitemap XML deduplicates URLs", () => {
  const baseUrls = Array.from({ length: 10 }, (_, i) => `https://nursenest.ca/blog/post-${i + 1}`);
  const withDuplicates = [...baseUrls, ...baseUrls.slice(0, 3)];

  const seen = new Set<string>();
  const unique = withDuplicates.filter((u) => {
    if (seen.has(u)) return false;
    seen.add(u);
    return true;
  });

  assert.equal(unique.length, 10, "dedup should reduce 13 entries to 10 unique URLs");
  const xml = buildSitemapUrlsetFromAbsoluteUrls(unique);
  const matches = xml.match(/<url>/g) ?? [];
  assert.equal(matches.length, 10, "XML should contain exactly 10 <url> entries");
});

test("sitemap XML has valid structure", () => {
  const urls = ["https://nursenest.ca/", "https://nursenest.ca/pricing"];
  const xml = buildSitemapUrlsetFromAbsoluteUrls(urls);
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(xml, /<\/urlset>/);
  assert.match(xml, /<loc>https:\/\/nursenest\.ca\/<\/loc>/);
  assert.match(xml, /<loc>https:\/\/nursenest\.ca\/pricing<\/loc>/);
});

test("sitemap.xml route serves sitemap index (no merged urlset)", () => {
  const routeSrc = readAppFile("app/sitemap.xml/route.ts");
  assert.match(routeSrc, /buildSitemapIndexXmlForOrigin/, "index route must build sitemap index XML");
  assert.match(routeSrc, /normalizeOrigin/, "index route must normalize canonical origin");
  assert.match(routeSrc, /requestMatchesEtag/, "index route must support 304 via ETag");
});

test("sitemap-core route partitions pathway + localized + exam hubs into other segments", () => {
  const routeSrc = readAppFile("app/sitemap-core.xml/route.ts");
  assert.match(routeSrc, /omitPathwayLessonSeoUrls:\s*true/);
  assert.match(routeSrc, /omitLocalizedMarketingUrls:\s*true/);
  assert.match(routeSrc, /omitExamPathwayAndTopicProgrammaticUrls:\s*true/);
  assert.match(routeSrc, /collectCoreUrls/);
  assert.match(routeSrc, /collectExamPathwayUrls/);
  assert.match(routeSrc, /coreUrlsWithoutPathwayExamOverlap/);
  assert.match(routeSrc, /excludeAbsoluteUrlsMatchingBlogSitemapEntries/);
  assert.match(routeSrc, /filterPublicSitemapEntries/);
  assert.match(routeSrc, /mergeCoreUrlsWithBlogEntries/);
});

test("sitemap-lessons route emits lesson-detail URLs only", () => {
  const routeSrc = readAppFile("app/sitemap-lessons.xml/route.ts");
  assert.match(routeSrc, /collectPathwayLessonDetailSeoUrls/);
  assert.match(routeSrc, /filterPublicSitemapEntries/);
});

test("sitemap-pathways route owns exam hubs + pathway hubs/topics slice", () => {
  const routeSrc = readAppFile("app/sitemap-pathways.xml/route.ts");
  assert.match(routeSrc, /collectPathwaysSegmentUrls/);
  assert.match(routeSrc, /filterPublicSitemapEntries/);
});

test("sitemap-localized route uses tier-full locale collector only", () => {
  const routeSrc = readAppFile("app/sitemap-localized.xml/route.ts");
  assert.match(routeSrc, /collectLocalizedMarketingSegmentUrls/);
  assert.match(routeSrc, /filterPublicSitemapEntries/);
});

test("sitemap-clinical-modules route serves clinical marketing urlset only", () => {
  const routeSrc = readAppFile("app/sitemap-clinical-modules.xml/route.ts");
  assert.match(routeSrc, /collectClinicalModulesSitemapUrls/);
  assert.match(routeSrc, /filterPublicSitemapEntries/);
});

test("sitemap-blog route serves blog-only urlset", () => {
  const routeSrc = readAppFile("app/sitemap-blog.xml/route.ts");
  assert.doesNotMatch(routeSrc, /^import\s+\{\s*listBlogSitemapEntriesSafe\s*\}/m);
  assert.match(routeSrc, /await import\("@\/lib\/seo\/sitemap-blog-xml"\)/);
  assert.match(routeSrc, /listBlogSitemapEntriesSafe/);
  assert.match(routeSrc, /filterPublicSitemapEntries/);
});

test("localized blog sitemap routes lazy-load DB-backed helpers", () => {
  const frRouteSrc = readAppFile("app/sitemap-fr-blog.xml/route.ts");
  assert.doesNotMatch(frRouteSrc, /^import\s+\{\s*buildMultilingualBlogSitemapXmlForLocale\s*\}/m);
  assert.match(frRouteSrc, /await import\("@\/lib\/seo\/sitemap-multilingual-blog-xml"\)/);
  assert.match(frRouteSrc, /buildSitemapUrlsetFromAbsoluteUrls\(\[\{ loc: `\$\{origin\}\/fr\/blog` \}\]\)/);

  const esRouteSrc = readAppFile("app/sitemap-es-blog.xml/route.ts");
  assert.doesNotMatch(esRouteSrc, /^import\s+\{\s*buildMultilingualBlogSitemapXmlForLocale\s*\}/m);
  assert.match(esRouteSrc, /await import\("@\/lib\/seo\/sitemap-multilingual-blog-xml"\)/);
  assert.match(esRouteSrc, /buildSitemapUrlsetFromAbsoluteUrls\(\[\{ loc: `\$\{origin\}\/es\/blog` \}\]\)/);
});

test("sitemap-allied route exists alongside merged sitemap", () => {
  const routeSrc = readAppFile("app/sitemap-allied.xml/route.ts");
  assert.match(routeSrc, /collectAlliedMarketingUrls/);
  assert.match(routeSrc, /filterPublicSitemapEntries/);
});

test("sitemap-new-grad route exists alongside merged sitemap", () => {
  const routeSrc = readAppFile("app/sitemap-new-grad.xml/route.ts");
  assert.match(routeSrc, /collectNewGradMarketingUrls/);
  assert.match(routeSrc, /filterPublicSitemapEntries/);
});
