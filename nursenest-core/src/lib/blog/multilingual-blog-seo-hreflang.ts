import { evaluateMultilingualBlogIndexability } from "@/lib/blog/multilingual-blog-seo-gates";
import { resolvePublicCanonicalUrl } from "@/lib/blog/blog-seo-automation";
import {
  absoluteUrlForPath,
  buildMultilingualBlogPublicPath,
} from "@/lib/blog/multilingual-blog-seo-resolve";
import { listMultilingualBlogEntriesForEnglishSource } from "@/lib/blog/multilingual-blog-seo-registry";
import type { MultilingualBlogRegistryEntry } from "@/lib/blog/multilingual-blog-seo-types";
import { isBlogPostMetaVisible } from "@/lib/blog/safe-blog-queries";

async function resolveEnglishVisibility(sourceEnglishSlug: string | undefined): Promise<boolean> {
  if (!sourceEnglishSlug) return false;
  try {
    return await isBlogPostMetaVisible(sourceEnglishSlug);
  } catch {
    return false;
  }
}

/**
 * `alternates.languages` for localized blog posts.
 *
 * When the **current** URL is indexable, emits peer locales + English + x-default per cluster rules.
 * When not indexable (draft, gates, locale tier), emits only `hreflang=self` and a conservative x-default.
 */
export async function buildMultilingualBlogHreflangLanguages(params: {
  entry: MultilingualBlogRegistryEntry;
}): Promise<Record<string, string>> {
  const { entry } = params;
  const languages: Record<string, string> = {};

  const englishVisible = await resolveEnglishVisibility(entry.sourceEnglishSlug);
  const indexability = evaluateMultilingualBlogIndexability({
    entry,
    englishSourceVisible: englishVisible,
  });

  const selfPath = buildMultilingualBlogPublicPath(entry.locale, entry.localizedSlug);
  languages[entry.locale] = absoluteUrlForPath(selfPath);

  const enCanonical =
    englishVisible && entry.sourceEnglishSlug ?
      resolvePublicCanonicalUrl(entry.sourceEnglishSlug, null)
    : absoluteUrlForPath("/");

  if (!indexability.indexable) {
    languages["x-default"] = enCanonical;
    return languages;
  }

  const cluster = listMultilingualBlogEntriesForEnglishSource(entry.sourceEnglishSlug);
  for (const peer of cluster) {
    if (peer.locale === entry.locale) continue;
    const peerIdx = evaluateMultilingualBlogIndexability({
      entry: peer,
      englishSourceVisible: englishVisible,
    });
    if (!peerIdx.indexable) continue;
    const p = buildMultilingualBlogPublicPath(peer.locale, peer.localizedSlug);
    languages[peer.locale] = absoluteUrlForPath(p);
  }

  if (englishVisible && entry.sourceEnglishSlug) {
    const enUrl = resolvePublicCanonicalUrl(entry.sourceEnglishSlug, null);
    languages.en = enUrl;
    languages["x-default"] = enUrl;
  } else {
    languages["x-default"] = enCanonical;
  }

  return languages;
}
