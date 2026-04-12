/**
 * Analytics event helpers for localized blog tracking.
 *
 * Provides typed event payloads for the localized blog pipeline:
 * generation, review, publication, and reader engagement.
 *
 * Compatible with the existing analytics infrastructure — call site
 * passes these payloads to the project's track/log function.
 */

export type LocalizedBlogEventName =
  | "blog_variant_generated"
  | "blog_variant_reviewed"
  | "blog_variant_approved"
  | "blog_variant_published"
  | "blog_variant_rejected"
  | "localized_blog_viewed"
  | "localized_cta_clicked"
  | "localized_signup_started";

export type LocalizedBlogEventPayload = {
  event: LocalizedBlogEventName;
  articleId: string;
  canonicalArticleId: string;
  locale: string;
  region: string;
  profession: string | null;
  exam: string | null;
  contentStatus: string;
  adaptationType?: string;
  ctaVariant?: string | null;
  slug?: string;
};

/**
 * Build a typed analytics payload for a localized blog event.
 * Caller is responsible for sending this to the analytics provider.
 */
export function buildLocalizedBlogEvent(params: {
  event: LocalizedBlogEventName;
  articleId: string;
  canonicalArticleId: string;
  locale: string;
  region: string;
  profession: string | null;
  exam: string | null;
  contentStatus: string;
  adaptationType?: string;
  ctaVariant?: string | null;
  slug?: string;
}): LocalizedBlogEventPayload {
  return {
    event: params.event,
    articleId: params.articleId,
    canonicalArticleId: params.canonicalArticleId,
    locale: params.locale,
    region: params.region,
    profession: params.profession,
    exam: params.exam,
    contentStatus: params.contentStatus,
    ...(params.adaptationType && { adaptationType: params.adaptationType }),
    ...(params.ctaVariant !== undefined && { ctaVariant: params.ctaVariant }),
    ...(params.slug && { slug: params.slug }),
  };
}

/**
 * Build event payload for when a localized blog article is viewed on the public site.
 */
export function buildLocalizedBlogViewEvent(article: {
  id: string;
  canonicalArticleId: string;
  locale: string;
  region: string;
  profession: string | null;
  exam: string | null;
  contentStatus: string;
  localizedSlug: string;
}): LocalizedBlogEventPayload {
  return buildLocalizedBlogEvent({
    event: "localized_blog_viewed",
    articleId: article.id,
    canonicalArticleId: article.canonicalArticleId,
    locale: article.locale,
    region: article.region,
    profession: article.profession,
    exam: article.exam,
    contentStatus: article.contentStatus,
    slug: article.localizedSlug,
  });
}

/**
 * Build event payload for when a CTA is clicked within a localized blog article.
 */
export function buildLocalizedCtaClickEvent(article: {
  id: string;
  canonicalArticleId: string;
  locale: string;
  region: string;
  profession: string | null;
  exam: string | null;
  ctaVariant: string | null;
}): LocalizedBlogEventPayload {
  return buildLocalizedBlogEvent({
    event: "localized_cta_clicked",
    articleId: article.id,
    canonicalArticleId: article.canonicalArticleId,
    locale: article.locale,
    region: article.region,
    profession: article.profession,
    exam: article.exam,
    contentStatus: "PUBLISHED",
    ctaVariant: article.ctaVariant,
  });
}
