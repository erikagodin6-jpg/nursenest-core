/**
 * Regional pricing map: display prices by region, profession, and duration.
 *
 * This is a READ-ONLY display/configuration layer. It does NOT replace the
 * existing CAD billing pipeline (`display-catalog.ts` + `pricing-map.ts`).
 *
 * When Stripe Price IDs are configured for a region, checkout can proceed.
 * Until then, the pricing page shows the price with a "Not available yet" state.
 *
 * Pricing strategy by purchasing-power tier:
 *   - VERY_LOW  — PK, BD
 *   - LOW       — PH, IN, NG, KE
 *   - MID_LOW   — ZA, JM, TT
 *   - MID       — AE, SA, SG, NZ, IE
 *   - HIGH      — US, CA, UK, AU
 */

import type { BillingDuration } from "@/lib/pricing/billing-types";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { REGION_CONFIG } from "@/lib/i18n/global-regions";

// ── Types ────────────────────────────────────────────────────────────────────

export type PricingTier = "very_low" | "low" | "mid_low" | "mid" | "high";

export type RegionalPriceEntry = {
  /** Amount in local currency major units (e.g. 499 INR, not paise). */
  price: number;
  /** ISO 4217 currency code. */
  currency: string;
  /** Stripe Price ID. `null` = not yet configured in Stripe. */
  stripePriceId: string | null;
};

export type ProfessionPricing = Record<BillingDuration, RegionalPriceEntry>;

export type RegionalPricingConfig = {
  region: GlobalRegionSlug;
  pricingTier: PricingTier;
  nursing: ProfessionPricing;
  allied: ProfessionPricing;
};

// ── Pricing tier assignment ──────────────────────────────────────────────────

const REGION_PRICING_TIER: Record<GlobalRegionSlug, PricingTier> = {
  pakistan: "very_low",
  bangladesh: "very_low",
  philippines: "low",
  india: "low",
  nigeria: "low",
  kenya: "low",
  "south-africa": "mid_low",
  jamaica: "mid_low",
  trinidad: "mid_low",
  uae: "mid",
  "saudi-arabia": "mid",
  singapore: "mid",
  ireland: "mid",
  "new-zealand": "mid",
  japan: "mid",
  "south-korea": "mid",
  indonesia: "low",
  vietnam: "low",
  thailand: "low",
  italy: "mid",
  greece: "mid",
  germany: "high",
  us: "high",
  canada: "high",
  uk: "high",
  aus: "high",
};

// ── Base price tables by tier (nursing RN-equivalent, in region's local currency) ─

type DurationPrices = Record<BillingDuration, number>;

const NURSING_PRICES_BY_TIER: Record<PricingTier, DurationPrices> = {
  very_low: { monthly: 4.99, "3-month": 11.99, "6-month": 19.99, yearly: 29.99 },
  low: { monthly: 9.99, "3-month": 24.99, "6-month": 39.99, yearly: 59.99 },
  mid_low: { monthly: 14.99, "3-month": 34.99, "6-month": 54.99, yearly: 79.99 },
  mid: { monthly: 24.99, "3-month": 59.99, "6-month": 89.99, yearly: 129.99 },
  high: { monthly: 39.99, "3-month": 89.99, "6-month": 139.99, yearly: 199.99 },
};

const ALLIED_PRICES_BY_TIER: Record<PricingTier, DurationPrices> = {
  very_low: { monthly: 3.99, "3-month": 9.99, "6-month": 16.99, yearly: 24.99 },
  low: { monthly: 7.99, "3-month": 19.99, "6-month": 34.99, yearly: 49.99 },
  mid_low: { monthly: 12.99, "3-month": 29.99, "6-month": 49.99, yearly: 69.99 },
  mid: { monthly: 19.99, "3-month": 49.99, "6-month": 79.99, yearly: 119.99 },
  high: { monthly: 24.99, "3-month": 59.99, "6-month": 89.99, yearly: 129.99 },
};

/**
 * Override map for regions that use non-USD-denominated local currencies.
 * Values here are in the region's local currency. Regions not listed use
 * the USD-equivalent amounts from the tier tables above.
 *
 * These are rounded to psychologically appealing price points per market.
 */
const LOCAL_CURRENCY_OVERRIDES: Partial<
  Record<GlobalRegionSlug, { nursing: DurationPrices; allied: DurationPrices }>
> = {
  philippines: {
    nursing: { monthly: 499, "3-month": 1_199, "6-month": 1_999, yearly: 2_999 },
    allied: { monthly: 399, "3-month": 999, "6-month": 1_699, yearly: 2_499 },
  },
  india: {
    nursing: { monthly: 799, "3-month": 1_999, "6-month": 3_299, yearly: 4_999 },
    allied: { monthly: 649, "3-month": 1_599, "6-month": 2_799, yearly: 3_999 },
  },
  nigeria: {
    nursing: { monthly: 4_999, "3-month": 12_499, "6-month": 19_999, yearly: 29_999 },
    allied: { monthly: 3_999, "3-month": 9_999, "6-month": 17_499, yearly: 24_999 },
  },
  kenya: {
    nursing: { monthly: 999, "3-month": 2_499, "6-month": 3_999, yearly: 5_999 },
    allied: { monthly: 799, "3-month": 1_999, "6-month": 3_499, yearly: 4_999 },
  },
  pakistan: {
    nursing: { monthly: 1_299, "3-month": 2_999, "6-month": 4_999, yearly: 7_499 },
    allied: { monthly: 999, "3-month": 2_499, "6-month": 3_999, yearly: 5_999 },
  },
  bangladesh: {
    nursing: { monthly: 499, "3-month": 1_199, "6-month": 1_999, yearly: 2_999 },
    allied: { monthly: 399, "3-month": 999, "6-month": 1_699, yearly: 2_499 },
  },
  "south-africa": {
    nursing: { monthly: 249, "3-month": 599, "6-month": 949, yearly: 1_399 },
    allied: { monthly: 219, "3-month": 499, "6-month": 849, yearly: 1_199 },
  },
  uae: {
    nursing: { monthly: 89, "3-month": 219, "6-month": 329, yearly: 479 },
    allied: { monthly: 69, "3-month": 179, "6-month": 289, yearly: 429 },
  },
  "saudi-arabia": {
    nursing: { monthly: 89, "3-month": 219, "6-month": 329, yearly: 479 },
    allied: { monthly: 69, "3-month": 179, "6-month": 289, yearly: 429 },
  },
  canada: {
    nursing: { monthly: 39.99, "3-month": 89.99, "6-month": 139.99, yearly: 199.99 },
    allied: { monthly: 24.99, "3-month": 59.99, "6-month": 89.99, yearly: 129.99 },
  },
  uk: {
    nursing: { monthly: 29.99, "3-month": 69.99, "6-month": 109.99, yearly: 159.99 },
    allied: { monthly: 19.99, "3-month": 49.99, "6-month": 79.99, yearly: 119.99 },
  },
  aus: {
    nursing: { monthly: 44.99, "3-month": 109.99, "6-month": 169.99, yearly: 249.99 },
    allied: { monthly: 34.99, "3-month": 79.99, "6-month": 129.99, yearly: 189.99 },
  },
  "new-zealand": {
    nursing: { monthly: 39.99, "3-month": 99.99, "6-month": 149.99, yearly: 219.99 },
    allied: { monthly: 29.99, "3-month": 79.99, "6-month": 119.99, yearly: 179.99 },
  },
  ireland: {
    nursing: { monthly: 24.99, "3-month": 59.99, "6-month": 89.99, yearly: 129.99 },
    allied: { monthly: 19.99, "3-month": 49.99, "6-month": 79.99, yearly: 119.99 },
  },
  singapore: {
    nursing: { monthly: 34.99, "3-month": 79.99, "6-month": 119.99, yearly: 179.99 },
    allied: { monthly: 24.99, "3-month": 59.99, "6-month": 99.99, yearly: 149.99 },
  },
  japan: {
    nursing: { monthly: 3_980, "3-month": 9_800, "6-month": 14_800, yearly: 21_800 },
    allied: { monthly: 2_980, "3-month": 7_800, "6-month": 11_800, yearly: 17_800 },
  },
  "south-korea": {
    nursing: { monthly: 32_900, "3-month": 79_900, "6-month": 119_900, yearly: 179_900 },
    allied: { monthly: 26_900, "3-month": 64_900, "6-month": 99_900, yearly: 149_900 },
  },
  indonesia: {
    nursing: { monthly: 149_000, "3-month": 359_000, "6-month": 579_000, yearly: 849_000 },
    allied: { monthly: 119_000, "3-month": 289_000, "6-month": 469_000, yearly: 699_000 },
  },
  vietnam: {
    nursing: { monthly: 249_000, "3-month": 599_000, "6-month": 949_000, yearly: 1_399_000 },
    allied: { monthly: 199_000, "3-month": 479_000, "6-month": 759_000, yearly: 1_099_000 },
  },
  thailand: {
    nursing: { monthly: 799, "3-month": 1_999, "6-month": 3_199, yearly: 4_699 },
    allied: { monthly: 649, "3-month": 1_599, "6-month": 2_599, yearly: 3_799 },
  },
  italy: {
    nursing: { monthly: 22.99, "3-month": 54.99, "6-month": 84.99, yearly: 124.99 },
    allied: { monthly: 18.99, "3-month": 44.99, "6-month": 69.99, yearly: 104.99 },
  },
  greece: {
    nursing: { monthly: 22.99, "3-month": 54.99, "6-month": 84.99, yearly: 124.99 },
    allied: { monthly: 18.99, "3-month": 44.99, "6-month": 69.99, yearly: 104.99 },
  },
  germany: {
    nursing: { monthly: 34.99, "3-month": 79.99, "6-month": 119.99, yearly: 179.99 },
    allied: { monthly: 27.99, "3-month": 64.99, "6-month": 99.99, yearly: 149.99 },
  },
};

// ── Build config ─────────────────────────────────────────────────────────────

function buildProfessionPricing(
  region: GlobalRegionSlug,
  profession: "nursing" | "allied",
): ProfessionPricing {
  const tier = REGION_PRICING_TIER[region];
  const cfg = REGION_CONFIG[region];
  const basePrices = profession === "nursing"
    ? NURSING_PRICES_BY_TIER[tier]
    : ALLIED_PRICES_BY_TIER[tier];
  const overrides = LOCAL_CURRENCY_OVERRIDES[region];
  const prices = overrides ? overrides[profession] : basePrices;

  const result = {} as ProfessionPricing;
  for (const d of ["monthly", "3-month", "6-month", "yearly"] as BillingDuration[]) {
    result[d] = {
      price: prices[d],
      currency: cfg.currencyCode,
      stripePriceId: lookupStripePriceId(region, profession, d),
    };
  }
  return result;
}

/**
 * Look up a Stripe Price ID from env vars.
 * Convention: STRIPE_PRICE_{REGION}_{PROFESSION}_{DURATION}
 * e.g. STRIPE_PRICE_PHILIPPINES_NURSING_MONTHLY
 *
 * Returns `null` if the env var is not set (plan not yet created in Stripe).
 */
function lookupStripePriceId(
  region: GlobalRegionSlug,
  profession: "nursing" | "allied",
  duration: BillingDuration,
): string | null {
  const regionKey = region.toUpperCase().replace(/-/g, "_");
  const profKey = profession.toUpperCase();
  const durKey = durationToEnvSuffix(duration);
  const envKey = `STRIPE_PRICE_${regionKey}_${profKey}_${durKey}`;
  return process.env[envKey] ?? null;
}

function durationToEnvSuffix(d: BillingDuration): string {
  switch (d) {
    case "monthly": return "MONTHLY";
    case "3-month": return "3MONTH";
    case "6-month": return "6MONTH";
    case "yearly": return "YEARLY";
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

const _cache = new Map<GlobalRegionSlug, RegionalPricingConfig>();

/** Get the full pricing config for a region. Cached per region per process. */
export function getRegionalPricing(region: GlobalRegionSlug): RegionalPricingConfig {
  let cached = _cache.get(region);
  if (!cached) {
    cached = {
      region,
      pricingTier: REGION_PRICING_TIER[region],
      nursing: buildProfessionPricing(region, "nursing"),
      allied: buildProfessionPricing(region, "allied"),
    };
    _cache.set(region, cached);
  }
  return cached;
}

/** Whether checkout is available for a specific region + profession + duration. */
export function isCheckoutAvailable(
  region: GlobalRegionSlug,
  profession: "nursing" | "allied",
  duration: BillingDuration,
): boolean {
  const pricing = getRegionalPricing(region);
  const entry = profession === "nursing" ? pricing.nursing[duration] : pricing.allied[duration];
  return entry.stripePriceId !== null;
}

/** Format a price for display: `₱499.00 PHP`, `₹799 INR`, `$39.99 CAD`. */
export function formatRegionalPrice(
  amount: number,
  currencyCode: string,
  currencySymbol: string,
): string {
  const isWholeNumber = amount === Math.floor(amount);
  const formatted = isWholeNumber ? amount.toLocaleString() : amount.toFixed(2);
  return `${currencySymbol}${formatted} ${currencyCode}`;
}

/** Get a display-ready price string for a region + profession + duration. */
export function getRegionalDisplayPrice(
  region: GlobalRegionSlug,
  profession: "nursing" | "allied",
  duration: BillingDuration,
): string {
  const pricing = getRegionalPricing(region);
  const entry = profession === "nursing" ? pricing.nursing[duration] : pricing.allied[duration];
  const cfg = REGION_CONFIG[region];
  return formatRegionalPrice(entry.price, cfg.currencyCode, cfg.currencySymbol);
}

/** List all regions missing Stripe Price IDs for any profession/duration combo. */
export function regionsMissingStripePrices(): {
  region: GlobalRegionSlug;
  missing: { profession: "nursing" | "allied"; duration: BillingDuration; envKey: string }[];
}[] {
  const results: ReturnType<typeof regionsMissingStripePrices> = [];
  for (const region of Object.keys(REGION_CONFIG) as GlobalRegionSlug[]) {
    const missing: { profession: "nursing" | "allied"; duration: BillingDuration; envKey: string }[] = [];
    for (const prof of ["nursing", "allied"] as const) {
      for (const dur of ["monthly", "3-month", "6-month", "yearly"] as BillingDuration[]) {
        const regionKey = region.toUpperCase().replace(/-/g, "_");
        const profKey = prof.toUpperCase();
        const durKey = durationToEnvSuffix(dur);
        const envKey = `STRIPE_PRICE_${regionKey}_${profKey}_${durKey}`;
        if (!process.env[envKey]) {
          missing.push({ profession: prof, duration: dur, envKey });
        }
      }
    }
    if (missing.length > 0) results.push({ region, missing });
  }
  return results;
}
