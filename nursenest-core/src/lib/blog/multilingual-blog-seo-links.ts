import {
  getMultilingualBlogEntryByEnglishSource,
  isMultilingualBlogSeoLocale,
} from "@/lib/blog/multilingual-blog-seo-registry";
import { evaluateMultilingualBlogIndexability } from "@/lib/blog/multilingual-blog-seo-gates";
import { buildMultilingualBlogPublicPath } from "@/lib/blog/multilingual-blog-seo-resolve";
import type { MultilingualBlogLocaleCode } from "@/lib/blog/multilingual-blog-seo-types";
import { isBlogPostMetaVisible } from "@/lib/blog/safe-blog-queries";

/**
 * Resolves an internal `/blog/{slug}` link for a given marketing locale overlay:
 * returns localized URL when a published, gated overlay exists; otherwise the English path.
 */
export async function resolveLocalizedBlogHref(params: {
  locale: string;
  englishBlogPath: string;
}): Promise<string> {
  const { locale, englishBlogPath } = params;
  const trimmed = englishBlogPath.trim();
  const pathOnly = trimmed.split("?")[0] ?? "";
  if (!pathOnly.startsWith("/blog/")) return trimmed;
  const englishSlug = decodeURIComponent(pathOnly.replace(/^\/blog\//, "").replace(/\/$/, ""));
  if (!englishSlug) return trimmed;

  if (!isMultilingualBlogSeoLocale(locale)) {
    return `/blog/${englishSlug}`;
  }

  const entry = getMultilingualBlogEntryByEnglishSource(locale as MultilingualBlogLocaleCode, englishSlug);
  if (!entry) return `/blog/${englishSlug}`;

  let enOk = true;
  try {
    enOk = await isBlogPostMetaVisible(englishSlug);
  } catch {
    enOk = false;
  }

  const idx = evaluateMultilingualBlogIndexability({
    entry,
    englishSourceVisible: enOk,
  });

  if (!idx.indexable) return `/blog/${englishSlug}`;
  return buildMultilingualBlogPublicPath(entry.locale, entry.localizedSlug);
}

/**
 * Rewrites `<a href="/blog/slug">` in HTML when a safe localized target exists.
 */
export async function rewriteBlogHtmlAnchorsForLocale(html: string, locale: string): Promise<string> {
  if (!html.includes('href="/blog/')) return html;

  let result = html;
  const matches = [...html.matchAll(/href="(\/blog\/[^"?#]+)"/g)];
  for (const m of matches) {
    const full = m[0];
    const path = m[1];
    const resolved = await resolveLocalizedBlogHref({
      locale,
      englishBlogPath: path,
    });
    result = result.replace(full, `href="${resolved}"`);
  }
  return result;
}
