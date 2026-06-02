/**
 * Repo-backed long-tail blog supplements (MD under `src/content/blog-static-longtail/`).
 *
 * Public merge behavior:
 * - Live DB rows win on slug collision.
 * - Static supplements are excluded when a DB slug matches.
 */
export type BlogStaticLongtailRecord = {
  /** URL-safe unique slug (without `/blog/`). */
  slug: string;

  /** Public article title. */
  title: string;

  /** Short preview/summary used in cards and metadata. */
  excerpt: string;

  /** Editorial grouping/category label. */
  category: string;

  /**
   * ISO date string (`YYYY-MM-DD`).
   * Used for stable index ordering and fallback chronological sorting.
   */
  createdAt: string;

  /**
   * ISO date string (`YYYY-MM-DD`).
   * Preferred for recency ordering when present.
   */
  updatedAt: string;

  /** Public tag labels used for discovery/filtering. */
  tags: string[];

  /** Sanitized rendered article HTML. */
  bodyHtml: string;

  /** SEO <title>. */
  seoTitle: string;

  /** SEO meta description. */
  seoDescription: string;

  /**
   * Canonical URL.
   * Accepts:
   * - site-relative path (`/blog/...`)
   * - absolute HTTPS URL
   */
  canonicalUrl: string;

  /**
   * Educational/medical disclaimer rendered near article content.
   * Must contain required compliance language.
   */
  disclaimer: string;

  /** Optional public-facing author attribution. */
  authorDisplayName?: string;

  /** Optional medical reviewer attribution. */
  medicalReviewerName?: string;

  /**
   * BCP 47 locale identifier.
   * Examples:
   * - en
   * - en-CA
   * - fr-CA
   */
  locale?: string;

  /**
   * Primary authoring language code.
   * Usually aligned with locale base language.
   */
  languageCode?: string;

  /**
   * Shared identifier linking translated/sibling articles
   * across locales for editorial and SEO grouping.
   */
  translationGroupId?: string;

  /**
   * When true:
   * - validated locally
   * - excluded from public merge
   * - excluded from sitemap generation
   * - excluded from `/blog/[slug]`
   * - excluded from overlap/supplement discovery
   */
  draft?: boolean;
};

/**
 * Origin of a row in merged public blog lists
 * (`/blog`, tag hubs, category hubs, feeds, sitemap inputs).
 */
export type BlogPostPublicListSource = "db" | "static";