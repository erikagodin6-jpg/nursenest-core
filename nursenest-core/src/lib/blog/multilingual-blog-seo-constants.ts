/** Minimum plain-text words (from HTML) before a localized blog URL may be indexed (non-Spanish tiers). */
export const MULTILINGUAL_BLOG_INDEX_MIN_WORDS = 800;

/** Spanish-first SEO phase: stricter long-form gate for `/es/blog/*` indexability. */
export const MULTILINGUAL_BLOG_INDEX_MIN_WORDS_ES = 1000;

export function multilingualBlogIndexMinWordsForLocale(locale: string): number {
  return locale === "es" ? MULTILINGUAL_BLOG_INDEX_MIN_WORDS_ES : MULTILINGUAL_BLOG_INDEX_MIN_WORDS;
}
