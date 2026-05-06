import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";
import { filterPublicSitemapEntries } from "@/lib/seo/sitemap-public-index-filter";
import { buildSitemapUrlsetFromAbsoluteUrls, collectAlliedMarketingUrls, normalizeOrigin } from "@/lib/seo/sitemap-static-xml";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..", "..");

function readAppFile(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

test("collectAlliedMarketingUrls emits only HTTPS-ready paths (no query strings)", () => {
  const origin = normalizeOrigin(CANONICAL_PRODUCTION_ORIGIN);
  const urls = collectAlliedMarketingUrls(origin);
  assert.ok(urls.length >= 2, "expected main allied hub plus at least one occupation segment");
  for (const u of urls) {
    const parsed = new URL(u);
    assert.equal(parsed.protocol, "https:");
    assert.equal(parsed.hostname, "www.nursenest.ca");
    assert.equal(parsed.search, "");
    assert.equal(parsed.hash, "");
    assert.ok(
      parsed.pathname === "/allied-health" ||
        parsed.pathname.startsWith("/allied-health/") ||
        parsed.pathname === "/allied/allied-health" ||
        parsed.pathname.startsWith("/allied/allied-health/"),
    );
  }
});

test("allied sitemap entries survive public sitemap filter", () => {
  const origin = normalizeOrigin(CANONICAL_PRODUCTION_ORIGIN);
  const raw = collectAlliedMarketingUrls(origin).map((loc) => ({ loc }));
  const filtered = filterPublicSitemapEntries(raw, origin);
  assert.ok(filtered.length >= 1, "expected at least one indexable allied hub URL");
});

test("allied sitemap route builds valid urlset XML from filtered entries", () => {
  const origin = normalizeOrigin(CANONICAL_PRODUCTION_ORIGIN);
  const raw = collectAlliedMarketingUrls(origin).map((loc) => ({ loc }));
  const entries = filterPublicSitemapEntries(raw, origin);
  const xml = buildSitemapUrlsetFromAbsoluteUrls(entries);
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(xml, /<\/urlset>/);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.ok(locs.length >= 1);
  for (const loc of locs) {
    assert.match(loc, /^https:\/\/www\.nursenest\.ca\//);
    assert.doesNotMatch(loc, /^http:\/\//);
    assert.doesNotMatch(loc, /allied\.nursenest\.ca/i);
  }
  assert.ok(
    locs.some((l) => l.includes("/allied-health/") || l.includes("/allied/allied-health")),
    "expected at least one allied marketing or pathway hub loc",
  );
});

test("sitemap-allied.xml route handler wires collector + filter + urlset builder", () => {
  const src = readAppFile("app/sitemap-allied.xml/route.ts");
  assert.match(src, /collectAlliedMarketingUrls/);
  assert.match(src, /filterPublicSitemapEntries/);
  assert.match(src, /buildSitemapUrlsetFromAbsoluteUrls/);
  assert.match(src, /SITEMAP_XML_HEADERS/);
});
