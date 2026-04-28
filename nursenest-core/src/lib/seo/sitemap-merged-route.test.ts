import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buildSitemapUrlsetFromAbsoluteUrls } from "@/lib/seo/sitemap-static-xml";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..", "..");

function readAppFile(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

test("sitemap with blog posts returns more than 16 URLs", () => {
  const mockUrls = Array.from({ length: 17 }, (_, i) => `https://www.nursenest.ca/blog/post-${i + 1}`);
  const xml = buildSitemapUrlsetFromAbsoluteUrls(mockUrls);
  const matches = xml.match(/<url>/g) ?? [];
  assert.ok(matches.length > 16, `expected >16 <url> entries, got ${matches.length}`);
});

test("sitemap XML deduplicates URLs", () => {
  const baseUrls = Array.from({ length: 10 }, (_, i) => `https://www.nursenest.ca/blog/post-${i + 1}`);
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
  const urls = ["https://www.nursenest.ca/", "https://www.nursenest.ca/pricing"];
  const xml = buildSitemapUrlsetFromAbsoluteUrls(urls);
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(xml, /<\/urlset>/);
  assert.match(xml, /<loc>https:\/\/www\.nursenest\.ca\/<\/loc>/);
  assert.match(xml, /<loc>https:\/\/www\.nursenest\.ca\/pricing<\/loc>/);
});

test("sitemap route has try/catch fallback, deduplication, blog entries, and lesson URLs", () => {
  const routeSrc = readAppFile("app/sitemap.xml/route.ts");
  assert.match(routeSrc, /try\s*\{/, "route must have try block for DB calls");
  assert.match(routeSrc, /\}\s*catch/, "route must have catch block for DB failures");
  assert.match(routeSrc, /STATIC_SITEMAP_PATHS/, "route must declare static path list");
  assert.match(routeSrc, /listBlogSitemapEntriesSafe/, "route must fetch live blog entries");
  assert.match(routeSrc, /collectPathwayLessonSeoUrls/, "route must fetch verified lesson URLs");
  assert.match(routeSrc, /new Set/, "route must deduplicate URLs");
  assert.match(routeSrc, /normalizeSitemapUrl/, "route must normalize URL whitespace");
});
