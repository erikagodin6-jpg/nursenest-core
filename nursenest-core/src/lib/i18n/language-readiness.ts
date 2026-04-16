/**
 * Language readiness — SEO policy layer on top of MarketingLanguageTier.
 *
 * Maps the three-tier system (full | partial | incomplete) to concrete SEO rules
 * that control sitemap inclusion, hreflang eligibility, and robots indexing.
 *
 * ## Status semantics
 *
 * | status   | tier       | indexed | hreflang | sitemap | switcher        |
 * |----------|------------|---------|----------|---------|-----------------|
 * | active   | full       | ✓       | ✓        | ✓       | yes, no label   |
 * | partial  | partial    | ✗       | ✓        | ✓       | yes, "(partial)"|
 * | disabled | incomplete | ✗       | ✗        | ✗       | hidden          |
 *
 * Routes for every locale remain accessible (no 404). The `disabled` status
 * applies `noindex` and removes the locale from hreflang clusters and sitemaps
 * so mostly-English content is not indexed or recommended by search engines.
 *
 * ## Adding a new language (safe workflow)
 *
 * 1. Add entry to `MARKETING_LANGUAGES` in `marketing-languages.ts` with `tier: "incomplete"`.
 *    The locale is now routable. No SEO exposure until promoted.
 * 2. Compile a UI translation bundle into `public/i18n/{locale}.json` using the i18n pipeline
 *    (`npm run i18n:compile` — see `docs/i18n-architecture.md`).
 * 3. Run `language-completeness.ts` checks to measure key coverage.
 * 4. Once navigation + core pages (home, pricing, faq) are translated, promote to `tier: "partial"`.
 *    The locale enters hreflang clusters and sitemaps, appears in the switcher with "(partial)"
 *    label, but keeps `noindex` until promoted to full.
 * 5. Complete remaining gaps. Publish at least one localized blog post.
 * 6. Pass all items in `LANGUAGE_PROMOTION_CHECKLIST`.
 * 7. Promote to `tier: "full"` → full SEO indexing activates automatically.
 */

import { MARKETING_LANGUAGES, type MarketingLanguageTier } from "./marketing-languages";
import { DEFAULT_MARKETING_LOCALE, CORE_HOSTED_MARKETING_LOCALES } from "./marketing-locale-policy";

// ─── Status type ──────────────────────────────────────────────────────────────

export type LanguageStatus = "active" | "partial" | "disabled";

// ─── Per-tier policy ──────────────────────────────────────────────────────────

interface LocaleSeoPolicy {
  status: LanguageStatus;
  /** Full crawl + indexing allowed. Only true for tier=full. */
  seoIndexable: boolean;
  /** Included in hreflang rel=alternate clusters. True for full + partial. */
  hreflangEligible: boolean;
  /** Included in any sitemap urlset. True for full + partial. */
  sitemapIncluded: boolean;
}

const TIER_POLICY: Record<MarketingLanguageTier, LocaleSeoPolicy> = {
  full: { status: "active", seoIndexable: true, hreflangEligible: true, sitemapIncluded: true },
  partial: { status: "partial", seoIndexable: false, hreflangEligible: true, sitemapIncluded: true },
  incomplete: { status: "disabled", seoIndexable: false, hreflangEligible: false, sitemapIncluded: false },
};

const ACTIVE_LOCALE_POLICY: LocaleSeoPolicy = {
  status: "active",
  seoIndexable: true,
  hreflangEligible: true,
  sitemapIncluded: true,
};

const DISABLED_LOCALE_POLICY: LocaleSeoPolicy = {
  status: "disabled",
  seoIndexable: false,
  hreflangEligible: false,
  sitemapIncluded: false,
};

function policyForLocale(localeCode: string): LocaleSeoPolicy {
  if (localeCode === DEFAULT_MARKETING_LOCALE) return ACTIVE_LOCALE_POLICY;
  const lang = MARKETING_LANGUAGES.find((l) => l.code === localeCode);
  return lang ? TIER_POLICY[lang.tier] : DISABLED_LOCALE_POLICY;
}

// ─── Public helpers ───────────────────────────────────────────────────────────

/** Resolved lifecycle status for a locale code. */
export function getLanguageStatus(localeCode: string): LanguageStatus {
  return policyForLocale(localeCode).status;
}

/** Whether this locale's pages should be crawled and indexed by search engines. */
export function isLocaleSeoIndexable(localeCode: string): boolean {
  return policyForLocale(localeCode).seoIndexable;
}

/**
 * Whether this locale should appear in hreflang clusters.
 * Excluding incomplete locales prevents diluting hreflang signal for well-translated pages.
 */
export function isLocaleHreflangEligible(localeCode: string): boolean {
  return policyForLocale(localeCode).hreflangEligible;
}

/** Whether this locale's URL set should be included in any sitemap document. */
export function isLocaleSitemapIncluded(localeCode: string): boolean {
  return policyForLocale(localeCode).sitemapIncluded;
}

/** Non-default locales eligible for hreflang rel=alternate (full + partial tiers). */
export function getHreflangEligibleLocales(): readonly string[] {
  return CORE_HOSTED_MARKETING_LOCALES.filter((c) => isLocaleHreflangEligible(c));
}

/** Non-default locales that should appear in sitemap urlsets (full + partial tiers). */
export function getSitemapIncludedLocales(): readonly string[] {
  return CORE_HOSTED_MARKETING_LOCALES.filter((c) => isLocaleSitemapIncluded(c));
}

/** Non-default locales with full SEO indexing (tier=full only). */
export function getIndexableLocales(): readonly string[] {
  return CORE_HOSTED_MARKETING_LOCALES.filter((c) => isLocaleSeoIndexable(c));
}

/**
 * Returns a `robots` metadata override for non-indexable locales.
 * Inject this into Next.js `generateMetadata` to prevent partial/incomplete
 * locale pages from being indexed.
 *
 * Returns `null` for active (fully-indexed) locales — no override needed.
 */
export function localeRobotsOverride(localeCode: string): { index: false; follow: true } | null {
  if (isLocaleSeoIndexable(localeCode)) return null;
  return { index: false, follow: true };
}

/**
 * When true, `robots.txt` should emit `Disallow: /{locale}/` for this locale.
 *
 * **Only** `incomplete` (disabled-switcher) tiers — **not** `partial` (noindex in metadata but
 * still hreflang/sitemap eligible; bots must fetch pages to see `noindex` + alternates).
 *
 * Do **not** use `!isLocaleSeoIndexable` here — that is also false for partial locales and would
 * incorrectly block crawling.
 */
export function isLocaleRobotsPathDisallowed(localeCode: string): boolean {
  if (localeCode === DEFAULT_MARKETING_LOCALE) return false;
  return getLanguageStatus(localeCode) === "disabled";
}

// ─── Promotion gate ───────────────────────────────────────────────────────────

/**
 * Checklist items that must pass before promoting a language from `partial` → `full`.
 * Verify each manually (or via CI script using `language-completeness.ts`) before
 * updating `tier` in `marketing-languages.ts`.
 */
export const LANGUAGE_PROMOTION_CHECKLIST = [
  "UI bundle: all CRITICAL_KEY_PREFIXES present with ≥80% key coverage vs English",
  "Navigation: language switcher renders without placeholder [missing:…] keys",
  "Core pages: home, pricing, faq, lessons, question-bank render localized copy",
  "Legal pages: terms, privacy, refund-policy, acceptable-use, disclaimer localized",
  "Blog: at least one published localized blog post exists for this locale",
  "Internal links: no broken /{locale}/… href references in navigation or footer",
  "Routing: /{locale} → 200, /{locale}/pricing → 200 (smoke test)",
  "hreflang: validate with Google Search Console or a tag inspector tool",
  "Canonical: /{locale} canonical resolves correctly; no conflict with English /",
  "Sitemap: locale appears in /sitemaps/locale-{code}.xml with correct URLs",
] as const;
