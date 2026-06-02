import { isValidPublicUrl } from "@/lib/seo/public-url-validator";
import { isEligiblePublicIndexSitemapLoc } from "@/lib/seo/sitemap-marketing-exclusions";
import type { SitemapUrlEntry } from "@/lib/seo/sitemap-urlset-build";

function normalizeOrigin(origin: string): string {
  return origin.endsWith("/") ? origin.slice(0, -1) : origin;
}

/** Normalize loc for XML dedupe (whitespace / line breaks). */
export function normalizeSitemapLoc(loc: string): string {
  return loc.trim().replace(/[\r\n]+/g, "");
}

/**
 * Drops URLs that must never appear in `/sitemap.xml`: auth noindex surfaces, `/app`, `/api`, `/seo/`, etc.
 * @see isValidPublicUrl — static rules only (no HTTP fetch).
 */
export function filterPublicSitemapEntries(entries: readonly SitemapUrlEntry[], origin: string): SitemapUrlEntry[] {
  const o = normalizeOrigin(origin);
  const out: SitemapUrlEntry[] = [];
  const seen = new Set<string>();
  for (const e of entries) {
    const loc = normalizeSitemapLoc(e.loc);
    if (!loc || seen.has(loc)) continue;
    if (!isEligiblePublicIndexSitemapLoc(loc, o)) continue;
    const v = isValidPublicUrl(loc, { origin: o });
    if (!v.ok) continue;
    seen.add(loc);
    out.push({ loc, lastmod: e.lastmod });
  }
  return out;
}

/**
 * Removes core URLs that appear in the blog urlset so `/sitemap.xml` and `/sitemap-blog.xml` do not duplicate `<loc>`s.
 */
export function excludeAbsoluteUrlsMatchingBlogSitemapEntries(
  coreUrls: readonly string[],
  blogEntries: readonly SitemapUrlEntry[],
): string[] {
  if (blogEntries.length === 0) return [...coreUrls];
  const blogLocs = new Set(blogEntries.map((e) => normalizeSitemapLoc(e.loc)));
  return coreUrls.filter((u) => !blogLocs.has(normalizeSitemapLoc(u)));
}

/**
 * Merges `collectCoreUrls` strings with blog `SitemapUrlEntry` rows (blog wins `lastmod` on duplicate `loc`).
 */
export function mergeCoreUrlsWithBlogEntries(coreUrls: readonly string[], blogEntries: readonly SitemapUrlEntry[]): SitemapUrlEntry[] {
  const byLoc = new Map<string, SitemapUrlEntry>();
  for (const u of coreUrls) {
    const loc = normalizeSitemapLoc(u);
    if (!loc) continue;
    byLoc.set(loc, { loc });
  }
  for (const e of blogEntries) {
    const loc = normalizeSitemapLoc(e.loc);
    if (!loc) continue;
    const prev = byLoc.get(loc);
    byLoc.set(loc, { loc, lastmod: e.lastmod ?? prev?.lastmod });
  }
  return [...byLoc.values()];
}
