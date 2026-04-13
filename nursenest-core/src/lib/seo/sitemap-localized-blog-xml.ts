/**
 * Localized blog sitemap: published LocalizedBlogArticle URLs.
 *
 * Complements `sitemap-blog-xml.ts` (canonical blog posts) with
 * localized variant URLs following the /:locale/:region/:profession/:exam/blog/:slug canonical pattern.
 *
 * Only includes rows for locales whose language status allows sitemap inclusion
 * (full + partial tiers). Disabled/incomplete locales are excluded — their pages
 * carry `noindex` meta and should not consume sitemap budget or invite indexing.
 */

import "server-only";

import { safeServerLog } from "@/lib/observability/safe-server-log";
import { getSitemapLocalizedBlogRows } from "@/lib/blog/safe-localized-blog-queries";
import { isLocaleSitemapIncluded } from "@/lib/i18n/language-readiness";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  minimalUrlsetSingleHome,
  normalizeOrigin,
  resolveSitemapOrigin,
} from "@/lib/seo/sitemap-static-xml";

export async function listLocalizedBlogSitemapUrlsSafe(): Promise<string[]> {
  const origin = normalizeOrigin(resolveSitemapOrigin());
  const urls: string[] = [];

  try {
    const rows = await getSitemapLocalizedBlogRows();
    let excluded = 0;

    for (const r of rows) {
      // Skip locales that are not sitemap-eligible (incomplete tier).
      if (!isLocaleSitemapIncluded(r.locale)) {
        excluded++;
        continue;
      }

      const parts = [r.locale, r.region];
      if (r.profession) parts.push(r.profession);
      if (r.exam) parts.push(r.exam);
      parts.push("blog", r.localizedSlug);

      const path = parts.map(encodeURIComponent).join("/");
      urls.push(`${origin}/${path}`);
    }

    if (excluded > 0) {
      safeServerLog("seo", "sitemap_localized_blog_locale_excluded", { excluded });
    }

    if (rows.length >= 50_000) {
      safeServerLog("seo", "sitemap_localized_blog_cap_reached", { count: rows.length });
    }
  } catch (e) {
    safeServerLog("seo", "sitemap_localized_blog_query_failed", {
      detail: e instanceof Error ? e.message.slice(0, 120) : "unknown",
    });
  }

  return urls;
}

export async function buildLocalizedBlogSitemapXmlSafe(): Promise<string> {
  try {
    const urls = await listLocalizedBlogSitemapUrlsSafe();
    if (urls.length === 0) return minimalUrlsetSingleHome();
    return buildSitemapUrlsetFromAbsoluteUrls(urls);
  } catch {
    return minimalUrlsetSingleHome();
  }
}
