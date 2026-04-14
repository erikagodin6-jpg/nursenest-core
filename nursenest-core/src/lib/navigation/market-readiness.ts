/**
 * Market readiness config — defines what level of product support each
 * region has, so the UI, SEO, and conversion systems can make honest claims.
 *
 * Four support tiers:
 *   1. full          — adapted questions, localized content, full conversion funnel
 *   2. partial       — some adapted content, basic SEO, limited conversion
 *   3. marketing     — SEO pages and blog, but no adapted questions yet
 *   4. planned       — in roadmap, no public pages
 *
 * This config is consumed by:
 *   - Context switcher (controls messaging when switching to unsupported markets)
 *   - Blog generator (gates claims about product support)
 *   - SEO helpers (controls which country pages get indexed)
 *   - Pricing pages (controls which markets show pricing)
 */

import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";

// ── Types ────────────────────────────────────────────────────────────────────

export type MarketSupportTier = "full" | "partial" | "marketing" | "planned";

export type MarketReadinessConfig = {
  region: GlobalRegionSlug;
  supportTier: MarketSupportTier;
  /** Questions are adapted and approved for this market. */
  questionsAdapted: boolean;
  /** At least some content is translated into the region's non-English locale. */
  hasTranslatedContent: boolean;
  /** Region-specific pricing is configured in Stripe. */
  pricingConfigured: boolean;
  /** Full conversion funnel (signup → checkout → onboarding) works for this market. */
  conversionFunnelReady: boolean;
  /** SEO pages may be published for this market. */
  seoEnabled: boolean;
  /** Blog content may reference this market. */
  blogEnabled: boolean;
  /**
   * Sub-regions that share this config but may need distinct SEO treatment.
   * E.g., UK → Scotland, Wales, England, Northern Ireland.
   */
  subRegions?: SubRegionConfig[];
  /** Human-readable notes for admin dashboards. */
  notes?: string;
};

export type SubRegionConfig = {
  slug: string;
  displayName: string;
  /** When true, this sub-region gets its own SEO landing pages. */
  distinctSeo: boolean;
  /** Country codes that map to this sub-region (for geo detection). */
  countryCodes?: readonly string[];
};

// ── Config ───────────────────────────────────────────────────────────────────

export const MARKET_READINESS: Record<GlobalRegionSlug, MarketReadinessConfig> = {
  // ── Full support ─────────────────────────────────────────────────────────
  us: {
    region: "us",
    supportTier: "full",
    questionsAdapted: true,
    hasTranslatedContent: false,
    pricingConfigured: true,
    conversionFunnelReady: true,
    seoEnabled: true,
    blogEnabled: true,
  },
  canada: {
    region: "canada",
    supportTier: "full",
    questionsAdapted: true,
    hasTranslatedContent: true,
    pricingConfigured: true,
    conversionFunnelReady: true,
    seoEnabled: true,
    blogEnabled: true,
  },

  // ── Partial support ──────────────────────────────────────────────────────
  philippines: {
    region: "philippines",
    supportTier: "partial",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
    notes: "High priority. NCLEX-RN questions broadly applicable. Needs pricing + Tagalog overlays.",
  },
  india: {
    region: "india",
    supportTier: "partial",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
    notes: "High priority. Needs INR pricing + Hindi overlays.",
  },

  // ── Marketing only ───────────────────────────────────────────────────────
  nigeria: {
    region: "nigeria",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  kenya: {
    region: "kenya",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  "south-africa": {
    region: "south-africa",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  uk: {
    region: "uk",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
    subRegions: [
      { slug: "england", displayName: "England", distinctSeo: true },
      { slug: "scotland", displayName: "Scotland", distinctSeo: true, countryCodes: ["GB-SCT"] },
      { slug: "wales", displayName: "Wales", distinctSeo: true, countryCodes: ["GB-WLS"] },
      { slug: "northern-ireland", displayName: "Northern Ireland", distinctSeo: false },
    ],
    notes: "NMC exam pathway differs significantly from NCLEX. Needs dedicated question adaptation.",
  },
  ireland: {
    region: "ireland",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
    notes: "NMBI registration. Distinct from UK system.",
  },
  aus: {
    region: "aus",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
    notes: "AHPRA/NMBA registration. Needs adapted exam framing.",
  },
  "new-zealand": {
    region: "new-zealand",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  japan: {
    region: "japan",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  china: {
    region: "china",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
    notes:
      "NNQE-aligned marketing hub. Content is based on NurseNest's own lesson and question inventory; not a proprietary national item bank.",
  },
  "south-korea": {
    region: "south-korea",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  indonesia: {
    region: "indonesia",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  vietnam: {
    region: "vietnam",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  thailand: {
    region: "thailand",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  italy: {
    region: "italy",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  greece: {
    region: "greece",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  hungary: {
    region: "hungary",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  portugal: {
    region: "portugal",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  mexico: {
    region: "mexico",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  germany: {
    region: "germany",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  france: {
    region: "france",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  singapore: {
    region: "singapore",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  uae: {
    region: "uae",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  "saudi-arabia": {
    region: "saudi-arabia",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  jamaica: {
    region: "jamaica",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },
  trinidad: {
    region: "trinidad",
    supportTier: "marketing",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: true,
    blogEnabled: true,
  },

  // ── Planned ──────────────────────────────────────────────────────────────
  pakistan: {
    region: "pakistan",
    supportTier: "planned",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: false,
    blogEnabled: true,
  },
  bangladesh: {
    region: "bangladesh",
    supportTier: "planned",
    questionsAdapted: false,
    hasTranslatedContent: false,
    pricingConfigured: false,
    conversionFunnelReady: false,
    seoEnabled: false,
    blogEnabled: true,
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getMarketReadiness(region: GlobalRegionSlug): MarketReadinessConfig {
  return MARKET_READINESS[region];
}

export function isMarketFullySupported(region: GlobalRegionSlug): boolean {
  return MARKET_READINESS[region].supportTier === "full";
}

export function canShowPricing(region: GlobalRegionSlug): boolean {
  return MARKET_READINESS[region].pricingConfigured;
}

export function canPublishSeo(region: GlobalRegionSlug): boolean {
  return MARKET_READINESS[region].seoEnabled;
}

/** Regions where the full conversion funnel is available. */
export function regionsWithFullSupport(): GlobalRegionSlug[] {
  return (Object.keys(MARKET_READINESS) as GlobalRegionSlug[]).filter(
    (r) => MARKET_READINESS[r].supportTier === "full",
  );
}

/** Regions where at least marketing/SEO pages should exist. */
export function regionsWithSeoEnabled(): GlobalRegionSlug[] {
  return (Object.keys(MARKET_READINESS) as GlobalRegionSlug[]).filter(
    (r) => MARKET_READINESS[r].seoEnabled,
  );
}

/**
 * User-facing label for the support level (used in context switcher messaging).
 */
export function marketSupportLabel(region: GlobalRegionSlug): string {
  const tier = MARKET_READINESS[region].supportTier;
  switch (tier) {
    case "full":
      return "Full exam prep available";
    case "partial":
      return "Study content available";
    case "marketing":
      return "Coming soon";
    case "planned":
      return "In development";
  }
}
