import "server-only";

import { evaluateMultilingualBlogIndexability } from "@/lib/blog/multilingual-blog-seo-gates";
import { listMultilingualBlogRegistryEntries } from "@/lib/blog/multilingual-blog-seo-registry";
import { buildMultilingualBlogPublicPath } from "@/lib/blog/multilingual-blog-seo-resolve";
import type { MultilingualBlogLocaleCode } from "@/lib/blog/multilingual-blog-seo-types";
import { isBlogPostMetaVisible } from "@/lib/blog/safe-blog-queries";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  normalizeOrigin,
  resolveSitemapOrigin,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-static-xml";

async function englishVisibleFor(slug: string): Promise<boolean> {
  try {
    return await isBlogPostMetaVisible(slug);
  } catch {
    return false;
  }
}

export async function listMultilingualBlogSitemapEntriesForLocale(
  locale: MultilingualBlogLocaleCode,
): Promise<SitemapUrlEntry[]> {
  const origin = normalizeOrigin(resolveSitemapOrigin());
  const entries: SitemapUrlEntry[] = [];

  for (const row of listMultilingualBlogRegistryEntries()) {
    if (row.locale !== locale) continue;

    const enOk = await englishVisibleFor(row.sourceEnglishSlug);
    const idx = evaluateMultilingualBlogIndexability({
      entry: row,
      englishSourceVisible: enOk,
    });
    if (!idx.indexable) continue;

    const path = buildMultilingualBlogPublicPath(locale, row.localizedSlug);
    const loc = `${origin}${path}`;
    entries.push({
      loc,
      lastmod: row.dateModified,
    });
  }

  return entries;
}

export async function buildMultilingualBlogSitemapXmlForLocale(locale: MultilingualBlogLocaleCode): Promise<string> {
  const rows = await listMultilingualBlogSitemapEntriesForLocale(locale);
  if (rows.length === 0) {
    const origin = normalizeOrigin(resolveSitemapOrigin());
    return buildSitemapUrlsetFromAbsoluteUrls([{ loc: `${origin}/${locale}/blog` }]);
  }
  return buildSitemapUrlsetFromAbsoluteUrls(rows);
}
