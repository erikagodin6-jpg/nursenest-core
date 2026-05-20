/**
 * Localized blog sitemap: published LocalizedBlogArticle URLs.
 *
 * Complements `sitemap-blog-xml.ts` (canonical blog posts) with
 * localized variant URLs following the /:locale/:region/:profession/:exam/blog/:slug canonical pattern.
 *
 * Only includes rows for locales whose language status allows sitemap inclusion (tier=full).
 * Partial and incomplete locales are excluded — their pages use `noindex` (and incomplete tiers are
 * `Disallow` in robots.txt); they must not consume sitemap budget.
 */

import "server-only";

import { localizedBlogPath } from "@/lib/blog/blog-slug-localized";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { getSitemapLocalizedBlogRowsStrict } from "@/lib/blog/safe-localized-blog-queries";
import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { isLocaleSitemapIncluded } from "@/lib/i18n/language-readiness";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  minimalUrlsetSingleHome,
  normalizeOrigin,
  resolveSitemapOrigin,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-static-xml";

export async function listLocalizedBlogSitemapUrlsSafe(): Promise<string[]> {
  const entries = await listLocalizedBlogSitemapEntriesSafe();
  return entries.map((entry) => entry.loc);
}

export async function listLocalizedBlogSitemapEntriesSafe(): Promise<SitemapUrlEntry[]> {
  const origin = normalizeOrigin(resolveSitemapOrigin());
  const entries: SitemapUrlEntry[] = [];

  const rows = await getSitemapLocalizedBlogRowsStrict();
  let excluded = 0;
  let excludedIncompletePath = 0;

  for (const r of rows) {
    // Skip locales that are not sitemap-eligible (partial + incomplete tiers).
    if (!isLocaleSitemapIncluded(r.locale)) {
      excluded++;
      continue;
    }

    const profession = r.profession?.trim() ?? "";
    const exam = r.exam?.trim() ?? "";
    // Public localized blog routes always use four segments before `/blog/:slug` (see `localizedBlogPath`).
    if (!profession || !exam) {
      excludedIncompletePath++;
      continue;
    }

    const path = localizedBlogPath({
      locale: r.locale as GlobalLocaleCode,
      region: r.region as GlobalRegionSlug,
      profession,
      exam,
      slug: r.localizedSlug,
    });
    entries.push({
      loc: `${origin}${path}`,
      lastmod: r.updatedAt.toISOString(),
    });
  }

  if (excluded > 0) {
    safeServerLog("seo", "sitemap_localized_blog_locale_excluded", { excluded });
  }
  if (excludedIncompletePath > 0) {
    safeServerLog("seo", "sitemap_localized_blog_incomplete_path_excluded", { excluded: excludedIncompletePath });
  }

  if (rows.length >= 50_000) {
    safeServerLog("seo", "sitemap_localized_blog_cap_reached", { count: rows.length });
  }

  return entries;
}

export async function buildLocalizedBlogSitemapXmlSafe(): Promise<string> {
  try {
    const entries = await listLocalizedBlogSitemapEntriesSafe();
    if (entries.length === 0) return minimalUrlsetSingleHome();
    return buildSitemapUrlsetFromAbsoluteUrls(entries);
  } catch {
    return minimalUrlsetSingleHome();
  }
}
