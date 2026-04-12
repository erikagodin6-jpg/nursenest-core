/**
 * Localized slug generation for internationalized blog articles.
 *
 * Handles SEO-friendly slug creation in target languages while preserving
 * safe characters for URLs and maintaining uniqueness constraints.
 */

import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";

const SLUG_MAX_LENGTH = 120;

/**
 * Normalize a raw string into a URL-safe slug.
 * Keeps ASCII letters/digits and hyphens. Collapses runs of non-word chars into a single hyphen.
 */
export function sanitizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining diacriticals
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, SLUG_MAX_LENGTH);
}

/**
 * Build the canonical route path for a localized blog article.
 *
 * Pattern: /[locale]/[region]/[profession]/[exam]/blog/[slug]
 *
 * When locale is "en", we still include it for consistency in localized routes
 * (different from the legacy `/blog/[slug]` route which has no locale prefix).
 */
export function localizedBlogPath(params: {
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  profession: string;
  exam: string;
  slug: string;
}): string {
  const { locale, region, profession, exam, slug } = params;
  const profSlug = sanitizeSlug(profession);
  const examSlug = sanitizeSlug(exam);
  return `/${locale}/${region}/${profSlug}/${examSlug}/blog/${slug}`;
}

/**
 * Build a localized slug by optionally prefixing the canonical slug with a
 * region-specific qualifier, or using a fully localized slug provided by the AI.
 *
 * If the AI provides a localized slug, we sanitize and use it directly.
 * Otherwise, we derive one from the canonical slug + region context.
 */
export function deriveLocalizedSlug(params: {
  canonicalSlug: string;
  aiLocalizedSlug: string | null | undefined;
  region: GlobalRegionSlug;
  locale: GlobalLocaleCode;
}): string {
  const { canonicalSlug, aiLocalizedSlug, region, locale } = params;

  if (aiLocalizedSlug?.trim()) {
    const sanitized = sanitizeSlug(aiLocalizedSlug);
    if (sanitized.length >= 10) return sanitized;
  }

  // Derive from canonical: append region suffix if locale is en, otherwise
  // the canonical slug itself is used (AI should have provided a localized one).
  if (locale === "en") {
    const regionSuffix = region.replace(/[^a-z0-9]+/g, "-");
    const base = sanitizeSlug(canonicalSlug);
    const candidate = `${base}-${regionSuffix}`;
    return candidate.slice(0, SLUG_MAX_LENGTH);
  }

  return sanitizeSlug(canonicalSlug);
}

/**
 * Validate that a localized slug meets requirements.
 */
export function validateLocalizedSlug(slug: string): { valid: boolean; reason?: string } {
  if (!slug || slug.length < 3) {
    return { valid: false, reason: "Slug is too short (minimum 3 characters)" };
  }
  if (slug.length > SLUG_MAX_LENGTH) {
    return { valid: false, reason: `Slug exceeds ${SLUG_MAX_LENGTH} characters` };
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { valid: false, reason: "Slug contains invalid characters (must be lowercase alphanumeric with hyphens)" };
  }
  return { valid: true };
}
