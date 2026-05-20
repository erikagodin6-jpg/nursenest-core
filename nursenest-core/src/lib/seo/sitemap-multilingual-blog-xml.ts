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
  const candidates = listMultilingualBlogRegistryEntries().filter((entry) => {
    if (entry.locale !== locale) return false;
    const cheapIndexability = evaluateMultilingualBlogIndexability({
      entry,
      englishSourceVisible: true,
    });
    return cheapIndexability.indexable;
  });

  const entries = await Promise.all(
    candidates.map(async (entry): Promise<SitemapUrlEntry | null> => {
      const enOk = await englishVisibleFor(entry.sourceEnglishSlug);
      const idx = evaluateMultilingualBlogIndexability({
        entry,
        englishSourceVisible: enOk,
      });
      if (!idx.indexable) return null;

      const path = buildMultilingualBlogPublicPath(locale, entry.localizedSlug);
      return {
        loc: `${origin}${path}`,
        lastmod: entry.dateModified,
      };
    }),
  );

  return entries.filter((entry): entry is SitemapUrlEntry => entry !== null);
}

export async function buildMultilingualBlogSitemapXmlForLocale(locale: MultilingualBlogLocaleCode): Promise<string> {
  const rows = await listMultilingualBlogSitemapEntriesForLocale(locale);
  if (rows.length === 0) {
    const origin = normalizeOrigin(resolveSitemapOrigin());
    return buildSitemapUrlsetFromAbsoluteUrls([{ loc: `${origin}/${locale}/blog` }]);
  }
  return buildSitemapUrlsetFromAbsoluteUrls(rows);
}
