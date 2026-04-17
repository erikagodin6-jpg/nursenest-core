import "server-only";

import { listBlogSitemapEntriesSafe } from "@/lib/seo/sitemap-blog-xml";
import { listLocalizedBlogSitemapEntriesSafe } from "@/lib/seo/sitemap-localized-blog-xml";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  collectCoreUrls,
  collectLocaleMarketingUrls,
  collectSeoPagesUrls,
  collectToolsUrls,
  minimalUrlsetSingleHome,
  normalizeOrigin,
  resolveSitemapOrigin,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-static-xml";
import { getSitemapIncludedLocales } from "@/lib/i18n/language-readiness";
import { isEligiblePublicIndexSitemapLoc } from "@/lib/seo/sitemap-marketing-exclusions";

/**
 * Single sitemap urlset used by `/sitemap.xml`.
 * Includes core marketing, locale marketing, tools, SEO pages, and blog URLs.
 */
export async function buildSingleSitemapXmlSafe(): Promise<string> {
  try {
    const origin = normalizeOrigin(resolveSitemapOrigin());
    const allStatic = new Set<string>();
    const blogEntries = new Map<string, string | undefined>();

    const pushStatic = (url: string) => {
      if (!isEligiblePublicIndexSitemapLoc(url, origin)) return;
      allStatic.add(url);
    };

    for (const url of await collectCoreUrls(origin)) {
      pushStatic(url);
    }

    for (const url of collectSeoPagesUrls(origin)) {
      pushStatic(url);
    }

    for (const url of collectToolsUrls(origin)) {
      pushStatic(url);
    }

    for (const locale of getSitemapIncludedLocales()) {
      for (const url of collectLocaleMarketingUrls(origin, locale)) {
        pushStatic(url);
      }
    }

    for (const entry of await listBlogSitemapEntriesSafe()) {
      if (!isEligiblePublicIndexSitemapLoc(entry.loc, origin)) continue;
      blogEntries.set(entry.loc, entry.lastmod);
    }

    for (const entry of await listLocalizedBlogSitemapEntriesSafe()) {
      if (!isEligiblePublicIndexSitemapLoc(entry.loc, origin)) continue;
      blogEntries.set(entry.loc, entry.lastmod);
    }

    const merged: SitemapUrlEntry[] = [];
    for (const loc of Array.from(allStatic).sort()) {
      const lastmod = blogEntries.get(loc);
      merged.push(lastmod ? { loc, lastmod } : { loc });
    }
    for (const [loc, lastmod] of Array.from(blogEntries.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
      if (allStatic.has(loc)) continue;
      merged.push(lastmod ? { loc, lastmod } : { loc });
    }
    return buildSitemapUrlsetFromAbsoluteUrls(merged);
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    safeServerLog("seo", "sitemap_merged_build_failed", {
      detail: detail.slice(0, 400),
    });
    return minimalUrlsetSingleHome();
  }
}
