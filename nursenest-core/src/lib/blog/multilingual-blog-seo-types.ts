/**
 * Guarded multilingual SEO overlay for marketing blog posts (`/{locale}/blog/{slug}`).
 * Distinct from pathway-localized blog (`/:locale/:region/:profession/:exam/blog/...`).
 */

export type MultilingualBlogLocaleCode = "fr" | "es";

export type MultilingualBlogTranslationStatus = "draft" | "review" | "published";

export type MultilingualBlogFaqEntry = {
  question: string;
  answer: string;
};

/**
 * One localized adaptation of an English canonical `/blog/{sourceEnglishSlug}` article.
 */
export type MultilingualBlogRegistryEntry = {
  /** Marketing locale segment (`fr` | `es`). */
  locale: MultilingualBlogLocaleCode;
  /** URL segment after `/{locale}/blog/` — native-language slug for SEO (public path segment). */
  localizedSlug: string;
  /** English `/blog/{slug}` source this translation replaces (cluster hub). */
  sourceEnglishSlug: string;
  status: MultilingualBlogTranslationStatus;
  /** Editorial + clinical sign-off before indexing. */
  qualityReviewed: boolean;
  /** Minimum substantive words required when combined with {@link evaluateMultilingualBlogIndexability}. */
  wordCount: number;
  /** Internal editorial/clinical review notes — not rendered; optional. */
  reviewerNotes?: string | null;
  lastReviewedAt: string | null;
  localizedTitle: string;
  localizedMetaTitle: string;
  localizedMetaDescription: string;
  localizedExcerpt: string;
  localizedH1: string;
  /** Full article HTML (server-rendered; no client translation). */
  localizedBodyHtml: string;
  localizedFaq: MultilingualBlogFaqEntry[];
  /** Optional localized OG/twitter overrides; default to meta/title fields when empty. */
  openGraphTitle?: string;
  openGraphDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  /** Article / cover — defaults acceptable when empty. */
  coverImageUrl?: string | null;
  localizedCoverImageAlt?: string | null;
  categoryLabel?: string | null;
  schemaKeywords?: string[];
  /** ISO-like dates for schema. */
  datePublished: string;
  dateModified: string;
};

export type MultilingualBlogIndexabilityReason =
  | "ok"
  | "missing_registry_entry"
  | "status_not_published"
  | "not_quality_reviewed"
  | "missing_localized_slug"
  | "missing_title"
  | "missing_meta_title"
  | "missing_meta_description"
  | "missing_h1"
  | "missing_body"
  | "word_count_below_threshold"
  | "locale_not_seo_indexable"
  | "locale_not_sitemap_eligible"
  | "english_source_not_visible";

export type MultilingualBlogIndexability = {
  indexable: boolean;
  reason: MultilingualBlogIndexabilityReason;
};
