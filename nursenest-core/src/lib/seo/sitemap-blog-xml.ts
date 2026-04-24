import "server-only";

import { safeServerLog } from "@/lib/observability/safe-server-log";
import { getSitemapPublishedBlogSlugsStrict } from "@/lib/blog/safe-blog-queries";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  minimalUrlsetSingleHome,
  normalizeOrigin,
  resolveSitemapOrigin,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-static-xml";
import { logSeoEmittedUrlBatch } from "@/lib/seo/seo-url-emission-audit";

/**
 * Blog slice for merged `/sitemap.xml`: `/blog` plus live post URLs when Prisma is reachable.
 * When `DATABASE_URL` is set (and build-time DB skip is off), DB failures **propagate** so the
 * merged sitemap route can return 503 instead of silently omitting every `/blog/{slug}` URL.
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
  const rows = await getSitemapPublishedBlogSlugsStrict();
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

  logSeoEmittedUrlBatch("sitemap_blog", entries.map((e) => e.loc), {
    entryCount: String(entries.length),
  });
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
