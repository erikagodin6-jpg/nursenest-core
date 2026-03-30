import { DEFAULT_MARKETING_LOCALE, MARKETING_LOCALE_CODES } from "@/lib/i18n/marketing-locale-policy";

/**
 * Allowed `pathway_lessons.locale` values (subset of marketing UI codes; extend when adding DB rows).
 * Keys are normalized with {@link normalizePathwayLessonLocale}.
 */
export const PATHWAY_LESSON_CONTENT_LOCALE_CODES: readonly string[] = [...MARKETING_LOCALE_CODES];

export function isKnownPathwayLessonContentLocale(code: string): boolean {
  return (PATHWAY_LESSON_CONTENT_LOCALE_CODES as readonly string[]).includes(code);
}

/**
 * Normalize a BCP-47-style tag to a short DB key (prefix before `-`/`_`, lowercased, max 16 chars).
 */
export function normalizePathwayLessonLocale(locale: string | undefined): string {
  if (!locale || typeof locale !== "string") return "en";
  const base = locale.trim().split(/[-_]/)[0]?.toLowerCase() ?? "en";
  if (base.length === 0) return "en";
  return base.slice(0, 16);
}

/**
 * **Exam hub URLs** under `(default)/[locale]/[slug]/[examCode]` use the first segment as **countrySlug**
 * (`us`, `canada`), not a lesson content locale. Pass {@link DEFAULT_MARKETING_LOCALE} (or a future UI locale)
 * separately into pathway lesson loaders for `pathway_lessons.locale`.
 */
export function defaultPathwayLessonContentLocaleForExamHubRoute(): string {
  return DEFAULT_MARKETING_LOCALE;
}

/** Canonical lesson URLs in sitemap use one primary locale until hreflang expansion is modeled. */
export const PATHWAY_LESSON_SITEMAP_LOCALE = "en";
