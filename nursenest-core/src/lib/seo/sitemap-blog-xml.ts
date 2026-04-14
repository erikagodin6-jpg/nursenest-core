import "server-only";

import { safeServerLog } from "@/lib/observability/safe-server-log";
import { getSitemapPublishedBlogSlugs } from "@/lib/blog/safe-blog-queries";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  minimalUrlsetSingleHome,
  normalizeOrigin,
  resolveSitemapOrigin,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-static-xml";

/**
 * Blog sitemap: `/blog` plus published post URLs when Prisma is available.
 * On any failure, returns a valid urlset with at least `/blog` (caller may also use minimal home).
 */
export async function listBlogSitemapUrlsSafe(): Promise<string[]> {
  const entries = await listBlogSitemapEntriesSafe();
  return entries.map((entry) => entry.loc);
}

export async function listBlogSitemapEntriesSafe(): Promise<SitemapUrlEntry[]> {
  const origin = normalizeOrigin(resolveSitemapOrigin());
  const entries: SitemapUrlEntry[] = [{ loc: `${origin}/blog` }];

  /** Sitemaps support at most ~50k URLs per file; split into multiple sitemaps if you exceed this. */
  const SITEMAP_BLOG_CAP = 50_000;
  try {
    const rows = await getSitemapPublishedBlogSlugs();
    if (rows.length >= SITEMAP_BLOG_CAP) {
      safeServerLog("seo", "sitemap_blog_url_cap_reached", { cap: SITEMAP_BLOG_CAP });
    }
    for (const r of rows) {
      if (r.slug?.trim()) {
        entries.push({
          loc: `${origin}/blog/${encodeURIComponent(r.slug.trim())}`,
          lastmod: r.updatedAt.toISOString(),
        });
      }
    }
  } catch (e) {
    safeServerLog("seo", "sitemap_blog_optional_query_failed", {
      detail: e instanceof Error ? e.message.slice(0, 120) : "unknown",
    });
  }

  return entries;
}

/**
 * Blog sitemap XML wrapper around `listBlogSitemapUrlsSafe`.
 */
export async function buildBlogSitemapXmlSafe(): Promise<string> {
  try {
    const entries = await listBlogSitemapEntriesSafe();
    return buildSitemapUrlsetFromAbsoluteUrls(entries);
  } catch {
    return minimalUrlsetSingleHome();
  }
}
