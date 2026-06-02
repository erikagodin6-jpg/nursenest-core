import "server-only";

import { evaluateMultilingualBlogIndexability } from "@/lib/blog/multilingual-blog-seo-gates";
import { getMultilingualBlogEntryByLocalizedSlug, isMultilingualBlogSeoLocale } from "@/lib/blog/multilingual-blog-seo-registry";
import type { MultilingualBlogIndexability } from "@/lib/blog/multilingual-blog-seo-types";
import { isBlogPostMetaVisible } from "@/lib/blog/safe-blog-queries";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";

export function buildMultilingualBlogPublicPath(locale: string, localizedSlug: string): string {
  return `/${locale}/blog/${localizedSlug}`;
}

export async function resolveMultilingualBlogIndexabilityForPage(params: {
  locale: string;
  /** Public URL segment after `/{locale}/blog/`. */
  slug: string;
}): Promise<{
  entry: ReturnType<typeof getMultilingualBlogEntryByLocalizedSlug>;
  indexability: MultilingualBlogIndexability;
  englishSourceVisible: boolean;
}> {
  const entry = getMultilingualBlogEntryByLocalizedSlug(params.locale, params.slug);
  let englishSourceVisible = true;
  if (entry?.sourceEnglishSlug) {
    try {
      englishSourceVisible = await isBlogPostMetaVisible(entry.sourceEnglishSlug);
    } catch {
      englishSourceVisible = false;
    }
  } else {
    englishSourceVisible = false;
  }

  const indexability = evaluateMultilingualBlogIndexability({
    entry,
    englishSourceVisible,
  });

  return { entry, indexability, englishSourceVisible };
}

/**
 * True when the URL should respond 404 (unknown locale segment for this product surface).
 */
export function multilingualBlogRouteLocaleUnsupported(locale: string): boolean {
  return !isMultilingualBlogSeoLocale(locale);
}

export function absoluteUrlForPath(path: string): string {
  const origin = resolveCanonicalSiteOrigin().replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${p}`;
}
