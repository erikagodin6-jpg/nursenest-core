import { countWordsFromHtmlApproximate } from "@/lib/blog/blog-word-count";
import {
  isLocaleHreflangEligible,
  isLocaleSeoIndexable,
  isLocaleSitemapIncluded,
} from "@/lib/i18n/language-readiness";
import { multilingualBlogIndexMinWordsForLocale } from "@/lib/blog/multilingual-blog-seo-constants";
import type {
  MultilingualBlogIndexability,
  MultilingualBlogIndexabilityReason,
  MultilingualBlogRegistryEntry,
} from "@/lib/blog/multilingual-blog-seo-types";

function trimReq(s: string | undefined | null): string {
  return typeof s === "string" ? s.trim() : "";
}

/**
 * Pure gates used by metadata, sitemap, and tests (same logic everywhere).
 */
export function evaluateMultilingualBlogIndexability(params: {
  entry: MultilingualBlogRegistryEntry | null | undefined;
  /** When false, cluster omits English alternate + blocks indexing per readiness policy. */
  englishSourceVisible?: boolean;
  /** Override computed word count (tests). */
  wordCountOverride?: number;
}): MultilingualBlogIndexability {
  const entry = params.entry;
  if (!entry) {
    return { indexable: false, reason: "missing_registry_entry" };
  }
  if (!trimReq(entry.localizedSlug)) {
    return { indexable: false, reason: "missing_localized_slug" };
  }
  if (entry.status !== "published") {
    return { indexable: false, reason: "status_not_published" };
  }
  if (!entry.qualityReviewed) {
    return { indexable: false, reason: "not_quality_reviewed" };
  }
  if (!trimReq(entry.localizedTitle)) {
    return { indexable: false, reason: "missing_title" };
  }
  if (!trimReq(entry.localizedMetaTitle)) {
    return { indexable: false, reason: "missing_meta_title" };
  }
  if (!trimReq(entry.localizedMetaDescription)) {
    return { indexable: false, reason: "missing_meta_description" };
  }
  if (!trimReq(entry.localizedH1)) {
    return { indexable: false, reason: "missing_h1" };
  }
  if (!trimReq(entry.localizedBodyHtml)) {
    return { indexable: false, reason: "missing_body" };
  }

  const counted =
    typeof params.wordCountOverride === "number" ?
      params.wordCountOverride
    : entry.wordCount > 0 ?
      entry.wordCount
    : countWordsFromHtmlApproximate(entry.localizedBodyHtml);

  const minWords = multilingualBlogIndexMinWordsForLocale(entry.locale);
  if (counted < minWords) {
    return { indexable: false, reason: "word_count_below_threshold" };
  }

  if (!isLocaleSeoIndexable(entry.locale)) {
    return { indexable: false, reason: "locale_not_seo_indexable" };
  }
  if (!isLocaleSitemapIncluded(entry.locale)) {
    return { indexable: false, reason: "locale_not_sitemap_eligible" };
  }

  if (params.englishSourceVisible === false) {
    return { indexable: false, reason: "english_source_not_visible" };
  }

  return { indexable: true, reason: "ok" };
}

export function multilingualBlogShouldEmitHreflang(entry: MultilingualBlogRegistryEntry | null | undefined): boolean {
  if (!entry) return false;
  if (entry.status !== "published" || !entry.qualityReviewed) return false;
  if (!trimReq(entry.localizedSlug)) return false;
  return isLocaleHreflangEligible(entry.locale);
}

export function formatRobotsForMultilingualBlog(indexability: MultilingualBlogIndexability): {
  index: boolean;
  follow: boolean;
} {
  return {
    index: indexability.indexable,
    follow: true,
  };
}
