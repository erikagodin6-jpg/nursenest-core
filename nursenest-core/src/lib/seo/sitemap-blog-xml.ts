import "server-only";

import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  minimalUrlsetSingleHome,
  normalizeOrigin,
  resolveSitemapOrigin,
} from "@/lib/seo/sitemap-static-xml";

/**
 * Blog sitemap: `/blog` plus published post URLs when Prisma is available.
 * On any failure, returns a valid urlset with at least `/blog` (caller may also use minimal home).
 */
export async function buildBlogSitemapXmlSafe(): Promise<string> {
  const origin = normalizeOrigin(resolveSitemapOrigin());
  const urls: string[] = [`${origin}/blog`];

  /** Sitemaps support at most ~50k URLs per file; split into multiple sitemaps if you exceed this. */
  const SITEMAP_BLOG_CAP = 50_000;
  try {
    const rows = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true },
      orderBy: { slug: "asc" },
      take: SITEMAP_BLOG_CAP,
    });
    if (rows.length >= SITEMAP_BLOG_CAP) {
      safeServerLog("seo", "sitemap_blog_url_cap_reached", { cap: SITEMAP_BLOG_CAP });
    }
    for (const r of rows) {
      if (r.slug?.trim()) {
        urls.push(`${origin}/blog/${encodeURIComponent(r.slug.trim())}`);
      }
    }
  } catch (e) {
    safeServerLog("seo", "sitemap_blog_optional_query_failed", {
      detail: e instanceof Error ? e.message.slice(0, 120) : "unknown",
    });
  }

  try {
    return buildSitemapUrlsetFromAbsoluteUrls(urls);
  } catch {
    return minimalUrlsetSingleHome();
  }
}
