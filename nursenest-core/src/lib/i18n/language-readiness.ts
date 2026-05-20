/**
 * Language readiness — SEO policy layer on top of MarketingLanguageTier.
 *
 * Maps the three-tier system (full | partial | incomplete) to concrete SEO rules
 * that control sitemap inclusion, hreflang eligibility, and robots indexing.
 *
 * ## Locale SEO tiers (single source of truth — see {@link getLocaleSeoTier})
 *
 * | seo tier    | status   | mkt tier   | indexed | hreflang | sitemap | robots.txt          | switcher        |
 * |-------------|----------|------------|---------|----------|---------|---------------------|-----------------|
 * | production  | active   | full       | ✓       | ✓        | ✓       | crawlable           | yes, no label   |
 * | preview     | partial  | partial    | ✗       | ✗        | ✗       | crawlable + noindex | yes, "(partial)"|
 * | preview     | disabled | incomplete | ✗       | ✗        | ✗       | crawlable + noindex | hidden          |
 *
 * Routes for every locale remain accessible (no 404). Both `partial` and `disabled` use
 * `<meta name="robots" content="noindex,follow">` to keep pages out of the index while
 * remaining **crawlable** — Google must be able to fetch the page to honor `noindex`.
 *
 * **Why robots.txt does NOT Disallow incomplete locales:** previously, `disabled` locales emitted
 * `Disallow: /{locale}/`. Google Search Console reported these as
 * "Indexed, though blocked by robots.txt" — because URLs discovered via internal links, old
 * sitemaps, or external links could be queued for indexing but Googlebot was prevented from
 * fetching them to read the `noindex` meta. Per Google's own guidance, blocking via robots.txt
 * is **the wrong tool** for de-indexing: it suppresses crawling, not indexing. The correct fix
 * is to let Googlebot fetch and read `noindex,follow` — implemented in `safeGenerateMetadata`
 * via {@link localeRobotsOverride}. See `docs/reports/locale-seo-leakage-remediation.md`.
 *
 * The third tier — `blocked` — is reserved for locales we intentionally hard-404 or redirect
 * (none today). Today every routable marketing locale falls into `production` or `preview`.
 *
 * ## Adding a new language (safe workflow)
 *
 * 1. Add entry to `MARKETING_LANGUAGES` in `marketing-languages.ts` with `tier: "incomplete"`.
 *    The locale is now routable. No SEO exposure until promoted.
 * 2. Compile a UI translation bundle into `public/i18n/{locale}.json` using the i18n pipeline
 *    (`npm run i18n:compile` — see `docs/i18n-architecture.md`).
 * 3. Run `language-completeness.ts` checks to measure key coverage.
 * 4. Once navigation + core pages (home, pricing, faq) are translated, promote to `tier: "partial"`.
 *    The locale appears in the switcher with "(partial)" label, but stays out of sitemap and completed
 *    hreflang clusters while keeping `noindex` until promoted to full.
 * 5. Complete remaining gaps. Publish at least one localized blog post.
 * 6. Pass all items in `LANGUAGE_PROMOTION_CHECKLIST`.
 * 7. Promote to `tier: "full"` → full SEO indexing activates automatically.
 */

import { MARKETING_LANGUAGES, type MarketingLanguageTier } from "./marketing-languages";
import {
  CORE_HOSTED_MARKETING_LOCALES,
  DEFAULT_MARKETING_LOCALE,
  isCoreHostedNonDefaultLocale,
} from "./marketing-locale-policy";

// ─── Status type ──────────────────────────────────────────────────────────────

export type LanguageStatus = "active" | "partial" | "disabled";

export const SEO_BLOCKED_LOCALES = ["it", "vi", "tr", "ur", "ko", "fa", "zh", "pa", "pt"] as const;

// ─── Per-tier policy ──────────────────────────────────────────────────────────

interface LocaleSeoPolicy {
  status: LanguageStatus;
  /** Full crawl + indexing allowed. Only true for tier=full. */
  seoIndexable: boolean;
  /** Included in hreflang rel=alternate clusters. True for full + partial. */
  hreflangEligible: boolean;
  /** Included in any sitemap urlset. True for tier=full only (partial uses noindex; omit from sitemap to avoid crawl waste). */
  sitemapIncluded: boolean;
}

const TIER_POLICY: Record<MarketingLanguageTier, LocaleSeoPolicy> = {
  full: { status: "active", seoIndexable: true, hreflangEligible: true, sitemapIncluded: true },
  partial: { status: "partial", seoIndexable: false, hreflangEligible: false, sitemapIncluded: false },
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

const BLOCKED_LOCALE_OVERRIDES = new Set<string>(SEO_BLOCKED_LOCALES);

function policyForLocale(localeCode: string): LocaleSeoPolicy {
  if (localeCode === DEFAULT_MARKETING_LOCALE) return ACTIVE_LOCALE_POLICY;
  if (BLOCKED_LOCALE_OVERRIDES.has(localeCode)) return DISABLED_LOCALE_POLICY;
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

/** Non-default locales that should appear in sitemap urlsets (tier=full only). */
export function getSitemapIncludedLocales(): readonly string[] {
  return CORE_HOSTED_MARKETING_LOCALES.filter((c) => isLocaleSitemapIncluded(c));
}

/**
 * True when `pathname` is under `/{marketingLocale}/…` and that locale must not appear in `/sitemap.xml`
 * (partial + incomplete tiers). Country/exam segments like `/us/…` are unaffected.
 *
 * Use as a final guard on merged sitemap `loc` values so DB-backed rows cannot reintroduce excluded locales.
 */
export function isLocalePrefixedPathnameExcludedFromSitemap(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length < 1) return false;
  const first = parts[0] ?? "";
  if (!isCoreHostedNonDefaultLocale(first)) return false;
  return !isLocaleSitemapIncluded(first);
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
 * Always returns `false` — robots.txt **never** Disallows a marketing locale path.
 *
 * Locale readiness is controlled by `<meta name="robots" content="noindex,follow">`
 * via {@link localeRobotsOverride}, **not** by robots.txt. Blocking via robots.txt prevented
 * Googlebot from fetching pages to read `noindex`, producing
 * "Indexed, though blocked by robots.txt" warnings in Google Search Console — see
 * `docs/reports/locale-seo-leakage-remediation.md`.
 *
 * The function is preserved as a stable export so callers (robots.txt generator, contract tests)
 * keep a single invariant point. Genuinely private surfaces (`/app`, `/admin`, `/internal`, `/api`,
 * `/seo/`) are still Disallowed directly in {@link "@/app/robots.txt/route".GET}.
 *
 * @deprecated Use {@link getLocaleSeoTier} for tier checks. Always returns `false` going forward.
 */
export function isLocaleRobotsPathDisallowed(_localeCode: string): boolean {
  return false;
}

// ─── Explicit SEO tiers (production / preview / blocked) ──────────────────────

/**
 * SEO-facing tier name for a marketing locale, used by sitemap/hreflang/robots/contract tests.
 *
 * - `production` — fully indexable. Pages appear in sitemap, hreflang clusters, and canonical
 *   alternate clusters. Bots may crawl and index.
 * - `preview` — pages must remain crawlable (so Googlebot can read `noindex,follow`) but must
 *   not appear in sitemap, hreflang, or canonical alternate clusters. Partial + incomplete
 *   marketing tiers and explicit `SEO_BLOCKED_LOCALES` overrides all map here.
 * - `blocked` — reserved for locales we intentionally hard-404 or redirect at the request layer.
 *   No locale uses this today; the value exists so future deletions/region-locks are typed.
 */
export type LocaleSeoTier = "production" | "preview" | "blocked";

export function getLocaleSeoTier(localeCode: string): LocaleSeoTier {
  if (localeCode === DEFAULT_MARKETING_LOCALE) return "production";
  if (isLocaleSeoIndexable(localeCode)) return "production";
  return "preview";
}

/** Locale codes (default + non-default) currently classified as fully indexable production SEO. */
export function getProductionSeoLocales(): readonly string[] {
  return [DEFAULT_MARKETING_LOCALE, ...getIndexableLocales()];
}

/** Locale codes classified as crawlable-but-noindexed preview tier (partial/incomplete/blocked overrides). */
export function getPreviewSeoLocales(): readonly string[] {
  return CORE_HOSTED_MARKETING_LOCALES.filter((c) => getLocaleSeoTier(c) === "preview");
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
  "Core pages: home, pricing, faq, lessons, question-bank render localized copy without English fallback leakage",
  "Legal pages: terms, privacy, refund-policy, acceptable-use, disclaimer localized",
  "Blog: at least one published localized blog post exists for this locale",
  "Internal links: no broken /{locale}/… href references in navigation or footer",
  "Routing: /{locale} → 200, /{locale}/pricing → 200 (smoke test)",
  "hreflang: validate en-CA, fr-CA, and x-default only after the locale is complete",
  "Canonical: /{locale} canonical resolves correctly; no conflict with English /",
  "Sitemap: full-tier locale marketing URLs appear in merged /sitemap.xml with correct paths",
] as const;
