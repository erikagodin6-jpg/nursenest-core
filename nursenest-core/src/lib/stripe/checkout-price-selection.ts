import type { TierCode } from "@prisma/client";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import {
  alliedStripePriceEnvKey,
  sharedAlliedStripePriceEnvKey,
  stripePriceEnvKey,
  type AlliedCareerKey,
} from "@/lib/pricing/display-catalog";
import { getRegionalPricing } from "@/lib/pricing/regional-pricing-map";
import { findAlliedPriceEntry, findPriceEntry, type BillingDuration } from "@/lib/stripe/pricing-map";

export type CheckoutPriceSelection = {
  priceId: string | null;
  planCode: string | null;
  currency: string;
  envKey: string;
  source: "legacy_na" | "regional" | "missing";
};

const LEGACY_NA_REGIONAL_SLUGS = new Set<GlobalRegionSlug>(["us", "canada"]);

/**
 * Canada/US keep the existing tier-aware Stripe billing matrix. Regional pricing is only authoritative
 * for non-NA global markets where we intentionally offer a generic nursing/allied regional plan.
 */
export function usesLegacyNaCheckoutPricing(region: GlobalRegionSlug | undefined): boolean {
  return !region || LEGACY_NA_REGIONAL_SLUGS.has(region);
}

export function resolveCheckoutPriceSelection(args: {
  country: "CA" | "US";
  region?: GlobalRegionSlug;
  tier: TierCode;
  duration: BillingDuration;
  alliedCareer?: AlliedCareerKey;
}): CheckoutPriceSelection {
  const legacyCurrency = args.country === "US" ? "USD" : "CAD";
  const regionalEnvKey = args.region
    ? `STRIPE_PRICE_${args.region.toUpperCase().replace(/-/g, "_")}_${args.tier === "ALLIED" ? "ALLIED" : "NURSING"}_${
        args.duration === "3-month"
          ? "3MONTH"
          : args.duration === "6-month"
            ? "6MONTH"
            : args.duration === "yearly"
              ? "YEARLY"
              : "MONTHLY"
      }`
    : "";
  const legacyEnvKey =
    args.tier === "ALLIED" && args.alliedCareer
      ? process.env[sharedAlliedStripePriceEnvKey(args.duration)]?.trim()
        ? sharedAlliedStripePriceEnvKey(args.duration)
        : alliedStripePriceEnvKey(args.country, args.alliedCareer, args.duration)
      : stripePriceEnvKey(args.country, args.tier, args.duration);

  if (!usesLegacyNaCheckoutPricing(args.region)) {
    const regionalConfig = getRegionalPricing(args.region!);
    const profession = args.tier === "ALLIED" ? "allied" : "nursing";
    const regionalEntry = regionalConfig[profession][args.duration];
    if (regionalEntry.stripePriceId) {
      return {
        priceId: regionalEntry.stripePriceId,
        planCode: `${args.region}_${profession}_${args.duration}`,
        currency: regionalEntry.currency,
        envKey: regionalEnvKey,
        source: "regional",
      };
    }
  }

  const legacyEntry =
    args.tier === "ALLIED" && args.alliedCareer
      ? findAlliedPriceEntry(args.country, args.alliedCareer, args.duration)
      : findPriceEntry(args.country, args.tier, args.duration);

  if (!legacyEntry) {
    return {
      priceId: null,
      planCode: null,
      currency: legacyCurrency,
      envKey: usesLegacyNaCheckoutPricing(args.region) ? legacyEnvKey : regionalEnvKey,
      source: "missing",
    };
  }

  return {
    priceId: legacyEntry.priceId,
    planCode: legacyEntry.planCode,
    currency: legacyCurrency,
    envKey: legacyEnvKey,
    source: "legacy_na",
  };
}
