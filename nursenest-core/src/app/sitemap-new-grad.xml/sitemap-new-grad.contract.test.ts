import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { GET } from "./route";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";
import { filterPublicSitemapEntries } from "@/lib/seo/sitemap-public-index-filter";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  collectNewGradMarketingUrls,
  NEW_GRAD_MARKETING_SITEMAP_PATHS,
  normalizeOrigin,
} from "@/lib/seo/sitemap-static-xml";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..", "..");

function readAppFile(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

test("collectNewGradMarketingUrls emits only listed HTTPS paths (no query or hash)", () => {
  const origin = normalizeOrigin(CANONICAL_PRODUCTION_ORIGIN);
  const urls = collectNewGradMarketingUrls(origin);
  assert.equal(urls.length, NEW_GRAD_MARKETING_SITEMAP_PATHS.length);
  for (const u of urls) {
    const parsed = new URL(u);
    assert.equal(parsed.protocol, "https:");
    assert.equal(parsed.hostname, "www.nursenest.ca");
    assert.equal(parsed.search, "");
    assert.equal(parsed.hash, "");
    assert.ok(
      parsed.pathname.startsWith("/us/new-grad") || parsed.pathname.startsWith("/canada/new-grad"),
      parsed.pathname,
    );
    assert.doesNotMatch(parsed.pathname, /^\/app\//);
  }
  assert.ok(urls.includes(`${origin}/us/new-grad`));
  assert.ok(urls.includes(`${origin}/canada/new-grad`));
  for (const rel of NEW_GRAD_MARKETING_SITEMAP_PATHS) {
    assert.ok(urls.includes(`${origin}${rel}`), `missing ${rel}`);
  }
});

test("new grad sitemap entries survive public sitemap filter", () => {
  const origin = normalizeOrigin(CANONICAL_PRODUCTION_ORIGIN);
  const raw = collectNewGradMarketingUrls(origin).map((loc) => ({ loc }));
  const filtered = filterPublicSitemapEntries(raw, origin);
  assert.equal(filtered.length, NEW_GRAD_MARKETING_SITEMAP_PATHS.length);
});

test("new grad sitemap route GET returns application/xml and valid urlset", async () => {
  const res = await GET(new Request("http://localhost/sitemap-new-grad.xml"));
  assert.equal(res.status, 200);
  const ct = res.headers.get("content-type") ?? "";
  assert.ok(ct.includes("application/xml"), `expected application/xml, got: ${ct}`);
  const xml = await res.text();
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(xml, /<\/urlset>/);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.equal(locs.length, NEW_GRAD_MARKETING_SITEMAP_PATHS.length);
  assert.ok(locs.includes("https://www.nursenest.ca/us/new-grad"));
  assert.ok(locs.includes("https://www.nursenest.ca/canada/new-grad"));
  for (const rel of NEW_GRAD_MARKETING_SITEMAP_PATHS) {
    assert.ok(locs.includes(`https://www.nursenest.ca${rel}`), `missing loc ${rel}`);
  }
  for (const loc of locs) {
    assert.doesNotMatch(loc, /\/app\//);
    assert.doesNotMatch(loc, /\?|#/);
    assert.doesNotMatch(loc, /^http:\/\//);
    assert.doesNotMatch(loc, /allied\.nursenest\.ca/i);
  }
});

test("new grad urlset builder matches filtered collector output", () => {
  const origin = normalizeOrigin(CANONICAL_PRODUCTION_ORIGIN);
  const entries = filterPublicSitemapEntries(
    collectNewGradMarketingUrls(origin).map((loc) => ({ loc })),
    origin,
  );
  const xml = buildSitemapUrlsetFromAbsoluteUrls(entries);
  assert.match(xml, /<loc>https:\/\/www\.nursenest\.ca\/us\/new-grad<\/loc>/);
});

test("sitemap-new-grad.xml route handler wires collector + filter + urlset builder", () => {
  const src = readAppFile("app/sitemap-new-grad.xml/route.ts");
  assert.match(src, /collectNewGradMarketingUrls/);
  assert.match(src, /filterPublicSitemapEntries/);
  assert.match(src, /buildSitemapUrlsetFromAbsoluteUrls/);
  assert.match(src, /SITEMAP_XML_HEADERS/);
});
