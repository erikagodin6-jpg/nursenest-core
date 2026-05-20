/**
 * Normalization helper for the localized blog route family.
 *
 * Route: /:locale/:slug/:examCode/:exam/blog/[:postSlug]
 *
 * IMPORTANT — WHY PARAM NAMES ARE OVERLOADED HERE:
 * Next.js App Router requires that all routes at the same URL segment depth
 * share the same dynamic param name. Because the localized blog routes share
 * the /:locale/:slug/:examCode segment tree with exam-pathway pages, the blog
 * routes must use "slug" and "examCode" even though those segments hold
 * different semantic values on blog URLs:
 *
 *   param name in Next.js   │ actual semantic meaning on blog routes
 *   ─────────────────────── │ ──────────────────────────────────────
 *   slug                    │ geographic region / country code  (e.g. "canada")
 *   examCode                │ profession / specialty category   (e.g. "nursing")
 *   exam                    │ exam code                         (e.g. "nclex-rn")
 *   postSlug                │ blog article slug
 *
 * Always call `normalizeBlogRouteParams` at the top of every page in this
 * route family to get correctly named variables before passing to any helper.
 */

import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";

/** Raw Next.js params shape for the blog listing page. */
export type RawBlogIndexParams = {
  locale: string;
  slug: string;
  examCode: string;
  exam: string;
};

/** Raw Next.js params shape for the blog post detail page. */
export type RawBlogPostParams = RawBlogIndexParams & {
  postSlug: string;
};

/** Semantically named params after normalization — safe to pass to library helpers. */
export type NormalizedBlogParams = {
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  profession: string;
  exam: string;
};

/** Semantically named params for blog post detail — safe to pass to library helpers. */
export type NormalizedBlogPostParams = NormalizedBlogParams & {
  postSlug: string;
};

/**
 * Normalize raw Next.js blog listing params into semantically named variables.
 *
 * @example
 * const { locale, region, profession, exam } = normalizeBlogIndexParams(await params);
 */
export function normalizeBlogIndexParams(raw: RawBlogIndexParams): NormalizedBlogParams {
  return {
    locale: raw.locale as GlobalLocaleCode,
    // `slug` at this URL depth holds the geographic region/country code
    region: raw.slug as GlobalRegionSlug,
    // `examCode` at this URL depth holds the profession/specialty category
    profession: raw.examCode,
    exam: raw.exam,
  };
}

/**
 * Normalize raw Next.js blog post params into semantically named variables.
 *
 * @example
 * const { locale, region, profession, exam, postSlug } = normalizeBlogPostParams(await params);
 */
export function normalizeBlogPostParams(raw: RawBlogPostParams): NormalizedBlogPostParams {
  return {
    ...normalizeBlogIndexParams(raw),
    postSlug: raw.postSlug,
  };
}

/**
 * Build the canonical public URL for a localized blog article or listing.
 * Accepts semantic values (region, profession, exam) — not raw route params.
 */
export function buildLocalizedBlogHref(params: {
  locale: string;
  region: string;
  profession: string;
  exam: string;
  postSlug?: string;
}): string {
  const base = `/${params.locale}/${params.region}/${params.profession}/${params.exam}/blog`;
  return params.postSlug ? `${base}/${params.postSlug}` : base;
}
