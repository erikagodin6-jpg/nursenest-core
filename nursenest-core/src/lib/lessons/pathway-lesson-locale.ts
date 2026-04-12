import { DEFAULT_MARKETING_LOCALE, MARKETING_LOCALE_CODES } from "@/lib/i18n/marketing-locale-policy";

/**
 * Canonical `pathway_lessons.locale` for authored rows. Translations ship as file/DB overlays
 * (`public/i18n/educational-overlays/...`) so we do not duplicate full lesson rows per language when English exists.
 */
export const PATHWAY_LESSON_CANONICAL_DB_LOCALE = "en" as const;

/**
 * Locales we ship educational overlays for (subset of marketing codes). Hindi (`hi`) can be added when bundles exist.
 */
export const PATHWAY_LESSON_OVERLAY_TARGET_LOCALES = ["es", "fr", "tl", "hi"] as const;

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
 * (`us`, `canada`), not lesson UI language. For **viewer-facing** lesson loads, call
 * `getMarketingLocaleForDefaultRoute` from `@/lib/i18n/marketing-locale-server` (cookie / picker) and pass it into
 * `getPathwayLesson` / hub loaders so
 * overlays apply. Use this helper only when you intentionally want English-only resolution (e.g. internal diagnostics).
 */
export function defaultPathwayLessonContentLocaleForExamHubRoute(): string {
  return DEFAULT_MARKETING_LOCALE;
}

/** Canonical lesson URLs in sitemap use one primary locale until hreflang expansion is modeled. */
export const PATHWAY_LESSON_SITEMAP_LOCALE = "en";
