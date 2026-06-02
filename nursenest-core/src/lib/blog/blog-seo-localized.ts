/**
 * SEO metadata generation for localized blog articles.
 *
 * Generates hreflang tags, canonical URLs, JSON-LD Article schema,
 * OG metadata, and breadcrumb data for internationally adapted blog posts.
 */

import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { REGION_CONFIG } from "@/lib/i18n/global-regions";
import { isLocaleHreflangEligible } from "@/lib/i18n/language-readiness";
import type { LocalizedBlogSeoMeta } from "./blog-localization-types";
import { localizedBlogPath } from "./blog-slug-localized";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "https://nursenest.ca";
const SITE_NAME = "NurseNest";

// ── Hreflang ─────────────────────────────────────────────────────────────────

export type HreflangVariant = {
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  slug: string;
  profession: string;
  exam: string;
};

/**
 * Build hreflang entries for all known variants of a canonical article.
 *
 * Only includes variants whose locale is hreflang-eligible (full or partial tier).
 * Disabled/incomplete locales are excluded to avoid polluting the hreflang cluster
 * with mostly-English content. x-default points to the English variant (or the
 * current locale's variant if no English one exists).
 */
export function buildHreflangEntries(
  currentLocale: GlobalLocaleCode,
  currentRegion: GlobalRegionSlug,
  variants: HreflangVariant[],
): { locale: string; href: string }[] {
  const entries: { locale: string; href: string }[] = [];

  for (const v of variants) {
    // Filter out locales that are not hreflang-eligible (incomplete tier).
    if (!isLocaleHreflangEligible(v.locale)) continue;

    const path = localizedBlogPath({
      locale: v.locale,
      region: v.region,
      profession: v.profession,
      exam: v.exam,
      slug: v.slug,
    });
    const langRegionCode = buildHreflangCode(v.locale, v.region);
    entries.push({ locale: langRegionCode, href: `${SITE_ORIGIN}${path}` });
  }

  // x-default: prefer en variant, or the current one (if hreflang-eligible)
  const enVariant = variants.find((v) => v.locale === "en");
  const currentVariant = variants.find((v) => v.locale === currentLocale && v.region === currentRegion);
  const defaultVariant =
    enVariant ??
    (currentVariant && isLocaleHreflangEligible(currentLocale) ? currentVariant : undefined) ??
    variants.find((v) => isLocaleHreflangEligible(v.locale));
  if (defaultVariant) {
    const defaultPath = localizedBlogPath({
      locale: defaultVariant.locale,
      region: defaultVariant.region,
      profession: defaultVariant.profession,
      exam: defaultVariant.exam,
      slug: defaultVariant.slug,
    });
    entries.push({ locale: "x-default", href: `${SITE_ORIGIN}${defaultPath}` });
  }

  return entries;
}

function buildHreflangCode(locale: GlobalLocaleCode, region: GlobalRegionSlug): string {
  const regionConfig = REGION_CONFIG[region];
  if (!regionConfig) return locale;
  const countryCode = regionConfig.countryCodes[0];
  return countryCode ? `${locale}-${countryCode}` : locale;
}

// ── Canonical URL ────────────────────────────────────────────────────────────

export function buildLocalizedCanonicalUrl(params: {
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  profession: string;
  exam: string;
  slug: string;
}): string {
  const path = localizedBlogPath(params);
  return `${SITE_ORIGIN}${path}`;
}

// ── JSON-LD ──────────────────────────────────────────────────────────────────

export function buildArticleJsonLd(params: {
  title: string;
  description: string;
  canonicalUrl: string;
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  publishedAt: string | null;
  updatedAt: string | null;
  coverImage: string | null;
  slug: string;
}): Record<string, unknown> {
  const regionConfig = REGION_CONFIG[params.region];

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    url: params.canonicalUrl,
    inLanguage: params.locale,
    ...(params.publishedAt && { datePublished: params.publishedAt }),
    ...(params.updatedAt && { dateModified: params.updatedAt }),
    ...(params.coverImage && {
      image: { "@type": "ImageObject", url: params.coverImage },
    }),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
    ...(regionConfig && {
      about: {
        "@type": "Place",
        name: regionConfig.displayName,
      },
    }),
  };
}

// ── Breadcrumbs ──────────────────────────────────────────────────────────────

export function buildLocalizedBreadcrumbs(params: {
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  profession: string;
  exam: string;
  slug: string;
  title: string;
}): { label: string; href: string }[] {
  const regionConfig = REGION_CONFIG[params.region];
  const regionName = regionConfig?.displayName ?? params.region;

  return [
    { label: "Home", href: `/${params.locale}/${params.region}` },
    { label: regionName, href: `/${params.locale}/${params.region}` },
    { label: params.exam.toUpperCase(), href: `/${params.locale}/${params.region}/${params.profession}/${params.exam}` },
    { label: "Blog", href: `/${params.locale}/${params.region}/${params.profession}/${params.exam}/blog` },
    { label: params.title, href: localizedBlogPath(params) },
  ];
}

// ── Full SEO metadata bundle ─────────────────────────────────────────────────

/**
 * Build the full SEO metadata bundle for a localized blog article.
 * Used by the page-level `generateMetadata` and JSON-LD components.
 */
export function buildLocalizedBlogSeoMeta(params: {
  title: string;
  metaTitle: string | null;
  description: string;
  metaDescription: string | null;
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  profession: string;
  exam: string;
  slug: string;
  publishedAt: string | null;
  updatedAt: string | null;
  coverImage: string | null;
  variants: HreflangVariant[];
}): LocalizedBlogSeoMeta {
  const effectiveTitle = params.metaTitle?.trim() || params.title;
  const effectiveDescription = (params.metaDescription?.trim() || params.description).slice(0, 160);

  const canonicalUrl = buildLocalizedCanonicalUrl({
    locale: params.locale,
    region: params.region,
    profession: params.profession,
    exam: params.exam,
    slug: params.slug,
  });

  const hreflangEntries = buildHreflangEntries(params.locale, params.region, params.variants);

  const breadcrumbs = buildLocalizedBreadcrumbs({
    locale: params.locale,
    region: params.region,
    profession: params.profession,
    exam: params.exam,
    slug: params.slug,
    title: effectiveTitle,
  });

  const jsonLdArticle = buildArticleJsonLd({
    title: effectiveTitle,
    description: effectiveDescription,
    canonicalUrl,
    locale: params.locale,
    region: params.region,
    publishedAt: params.publishedAt,
    updatedAt: params.updatedAt,
    coverImage: params.coverImage,
    slug: params.slug,
  });

  return {
    title: effectiveTitle,
    description: effectiveDescription,
    canonicalUrl,
    hreflangEntries,
    ogTitle: effectiveTitle,
    ogDescription: effectiveDescription,
    ogUrl: canonicalUrl,
    breadcrumbs,
    jsonLdArticle,
  };
}
