import "server-only";

import { listBlogSitemapEntriesSafe } from "@/lib/seo/sitemap-blog-xml";
import { listLocalizedBlogSitemapEntriesSafe } from "@/lib/seo/sitemap-localized-blog-xml";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  collectCoreUrls,
  collectLocaleMarketingUrls,
  collectSeoPagesUrls,
  collectToolsUrls,
  normalizeOrigin,
  resolveSitemapOrigin,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-static-xml";
import { getSitemapIncludedLocales } from "@/lib/i18n/language-readiness";

/**
 * Single sitemap urlset used by `/sitemap.xml`.
 * Includes core marketing, locale marketing, tools, SEO pages, and blog URLs.
 */
export async function buildSingleSitemapXmlSafe(): Promise<string> {
  const origin = normalizeOrigin(resolveSitemapOrigin());
  const allStatic = new Set<string>();
  const blogEntries = new Map<string, string | undefined>();

  for (const url of await collectCoreUrls(origin)) {
    allStatic.add(url);
  }

  for (const url of collectSeoPagesUrls(origin)) {
    allStatic.add(url);
  }

  for (const url of collectToolsUrls(origin)) {
    allStatic.add(url);
  }

  for (const locale of getSitemapIncludedLocales()) {
    for (const url of collectLocaleMarketingUrls(origin, locale)) {
      allStatic.add(url);
    }
  }

  for (const entry of await listBlogSitemapEntriesSafe()) {
    blogEntries.set(entry.loc, entry.lastmod);
  }

  for (const entry of await listLocalizedBlogSitemapEntriesSafe()) {
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
}
