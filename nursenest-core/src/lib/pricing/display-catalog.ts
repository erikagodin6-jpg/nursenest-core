import type { TierCode } from "@prisma/client";
import type { BillingDuration } from "@/lib/pricing/billing-types";

/**
 * Single source of truth for **list prices** shown in UI (CAD or USD major units).
 * Stripe charge amounts must match Prices configured in Stripe for the env `STRIPE_PRICE_*` IDs.
 * Full matrix: `eachStripePriceMatrixRow` in `@/lib/stripe/pricing-map`.
 *
 * Allied Health pricing is per-career; each career has its own Stripe price IDs
 * and entitlement scope. Use `alliedCareerPriceKey` for env key generation.
 */

// ── Allied career keys (stable identifiers used in env vars, plan codes, and DB) ─

export const ALLIED_CAREER_KEYS = [
  "paramedic",
  "rrt",
  "mlt",
  "imaging",
  "ota_pta",
  "pharmtech",
  "socialwork",
] as const;
export type AlliedCareerKey = (typeof ALLIED_CAREER_KEYS)[number];

export const ALLIED_CAREER_DISPLAY_NAMES: Record<AlliedCareerKey, string> = {
  paramedic: "Paramedic",
  rrt: "Respiratory Therapy (RRT)",
  mlt: "Medical Laboratory Technology (MLT)",
  imaging: "Medical Imaging",
  ota_pta: "OTA / PTA",
  pharmtech: "Pharmacy Technician",
  socialwork: "Social Work",
};

/** Map allied-professions-registry `professionKey` to our billing career key. */
export function professionKeyToCareerKey(professionKey: string): AlliedCareerKey | undefined {
  const map: Record<string, AlliedCareerKey> = {
    paramedic: "paramedic",
    respiratory: "rrt",
    mlt: "mlt",
    imaging: "imaging",
    pta: "ota_pta",
    ota: "ota_pta",
    "pharmacy-tech": "pharmtech",
    "social-work": "socialwork",
  };
  return map[professionKey.toLowerCase().trim()];
}

// ── Nursing tier prices ──────────────────────────────────────────────────────

const CA_LIST_PRICE_MAJOR: Partial<Record<TierCode, Record<BillingDuration, number>>> = {
  PRE_NURSING: { monthly: 24.99, "3-month": 59.99, "6-month": 89.99, yearly: 129.99 },
  NEW_GRAD: { monthly: 24.99, "3-month": 59.99, "6-month": 89.99, yearly: 129.99 },
  RPN: { monthly: 29.99, "3-month": 69.99, "6-month": 109.99, yearly: 159.99 },
  RN: { monthly: 39.99, "3-month": 89.99, "6-month": 139.99, yearly: 199.99 },
  NP: { monthly: 49.99, "3-month": 119.99, "6-month": 179.99, yearly: 259.99 },
};

const US_LIST_PRICE_MAJOR: Partial<Record<TierCode, Record<BillingDuration, number>>> = {
  PRE_NURSING: { monthly: 19.99, "3-month": 49.99, "6-month": 79.99, yearly: 119.99 },
  NEW_GRAD: { monthly: 19.99, "3-month": 49.99, "6-month": 79.99, yearly: 119.99 },
  LVN_LPN: { monthly: 24.99, "3-month": 59.99, "6-month": 89.99, yearly: 129.99 },
  RN: { monthly: 29.99, "3-month": 69.99, "6-month": 109.99, yearly: 159.99 },
  NP: { monthly: 39.99, "3-month": 99.99, "6-month": 149.99, yearly: 219.99 },
};

// ── Allied Health prices (same for every career within each country) ─────────

const CA_ALLIED_PRICE: Record<BillingDuration, number> = {
  monthly: 24.99,
  "3-month": 59.99,
  "6-month": 89.99,
  yearly: 129.99,
};

const US_ALLIED_PRICE: Record<BillingDuration, number> = {
  monthly: 19.99,
  "3-month": 49.99,
  "6-month": 79.99,
  yearly: 119.99,
};

// ── Anchor prices (strikethrough "was" values for conversion UI) ─────────────

const CA_ANCHOR_PRICE_MAJOR: Partial<Record<TierCode, Partial<Record<BillingDuration, number>>>> = {
  RPN: { "3-month": 99.99, "6-month": 159.99, yearly: 229.99 },
  RN: { "3-month": 119.99, "6-month": 199.99, yearly: 299.99 },
  NP: { "3-month": 149.99, "6-month": 249.99, yearly: 389.99 },
};

const US_ANCHOR_PRICE_MAJOR: Partial<Record<TierCode, Partial<Record<BillingDuration, number>>>> = {
  LVN_LPN: { "3-month": 74.99, "6-month": 129.99, yearly: 189.99 },
  RN: { "3-month": 99.99, "6-month": 159.99, yearly: 239.99 },
  NP: { "3-month": 134.99, "6-month": 224.99, yearly: 349.99 },
};

// ── Tiers sold per country ───────────────────────────────────────────────────

/** Nursing tiers sold per country (does not include ALLIED — allied is career-specific). */
export const NURSING_TIERS_BY_COUNTRY: Record<"CA" | "US", TierCode[]> = {
  CA: ["PRE_NURSING", "NEW_GRAD", "RPN", "RN", "NP"],
  US: ["PRE_NURSING", "NEW_GRAD", "LVN_LPN", "RN", "NP"],
};

/**
 * @deprecated Use NURSING_TIERS_BY_COUNTRY and iterate ALLIED_CAREER_KEYS separately.
 * Kept for backward compat; returns nursing tiers + ALLIED (without career split).
 */
export const TIERS_BY_COUNTRY: Record<"CA" | "US", TierCode[]> = {
  CA: [...NURSING_TIERS_BY_COUNTRY.CA, "ALLIED"],
  US: [...NURSING_TIERS_BY_COUNTRY.US, "ALLIED"],
};

export const BILLING_DURATION_ORDER: BillingDuration[] = ["monthly", "3-month", "6-month", "yearly"];

// ── Trial configuration ─────────────────────────────────────────────────────

export const STRIPE_TRIAL_DAYS = 3;
export const STRIPE_TRIAL_DAYS_SHORT = 1;
export const TRIAL_REQUIRES_PAYMENT_METHOD = true;

// ── Price lookups ───────────────────────────────────────────────────────────

export function getDisplayTotalMajorUnits(
  country: "CA" | "US",
  tier: TierCode,
  duration: BillingDuration,
): number | undefined {
  const table = country === "CA" ? CA_LIST_PRICE_MAJOR : US_LIST_PRICE_MAJOR;
  return table[tier]?.[duration];
}

export function getAlliedDisplayPrice(
  country: "CA" | "US",
  duration: BillingDuration,
): number {
  return country === "CA" ? CA_ALLIED_PRICE[duration] : US_ALLIED_PRICE[duration];
}

export function getAnchorPriceMajorUnits(
  country: "CA" | "US",
  tier: TierCode,
  duration: BillingDuration,
): number | undefined {
  const table = country === "CA" ? CA_ANCHOR_PRICE_MAJOR : US_ANCHOR_PRICE_MAJOR;
  return table[tier]?.[duration];
}

export function durationMonths(duration: BillingDuration): number {
  switch (duration) {
    case "monthly":
      return 1;
    case "3-month":
      return 3;
    case "6-month":
      return 6;
    case "yearly":
      return 12;
    default:
      return 1;
  }
}

// ── Env key helpers ─────────────────────────────────────────────────────────

function durationEnvSuffix(duration: BillingDuration): string {
  switch (duration) {
    case "monthly": return "MONTHLY";
    case "3-month": return "3MONTH";
    case "6-month": return "6MONTH";
    case "yearly": return "YEARLY";
    default: return "MONTHLY";
  }
}

/** Env var for nursing tier Stripe Price id: STRIPE_PRICE_CA_RPN_MONTHLY, etc. */
export function stripePriceEnvKey(country: "CA" | "US", tier: TierCode, duration: BillingDuration): string {
  return `STRIPE_PRICE_${country}_${tier}_${durationEnvSuffix(duration)}`;
}

/** Env var for allied career Stripe Price id: STRIPE_PRICE_CA_ALLIED_PARAMEDIC_MONTHLY, etc. */
export function alliedStripePriceEnvKey(
  country: "CA" | "US",
  career: AlliedCareerKey,
  duration: BillingDuration,
): string {
  return `STRIPE_PRICE_${country}_ALLIED_${career.toUpperCase()}_${durationEnvSuffix(duration)}`;
}

// ── Plan code helpers ───────────────────────────────────────────────────────

function durationPlanSuffix(duration: BillingDuration): string {
  switch (duration) {
    case "monthly": return "monthly";
    case "3-month": return "3m";
    case "6-month": return "6m";
    case "yearly": return "12m";
    default: return "monthly";
  }
}

function tierPlanPrefix(tier: TierCode): string {
  switch (tier) {
    case "PRE_NURSING": return "prenursing";
    case "NEW_GRAD": return "newgrad";
    case "RPN": return "rexpn";
    case "LVN_LPN": return "nclexpn";
    case "RN": return "rn";
    case "NP": return "np";
    case "ALLIED": return "allied";
    default: return tier.toLowerCase();
  }
}

/** Internal plan code for nursing tiers: e.g. `rn_ca_monthly`, `np_us_12m`. */
export function nursingPlanCode(country: "CA" | "US", tier: TierCode, duration: BillingDuration): string {
  return `${tierPlanPrefix(tier)}_${country.toLowerCase()}_${durationPlanSuffix(duration)}`;
}

/** Internal plan code for allied careers: e.g. `allied_paramedic_ca_monthly`. */
export function alliedPlanCode(country: "CA" | "US", career: AlliedCareerKey, duration: BillingDuration): string {
  return `allied_${career}_${country.toLowerCase()}_${durationPlanSuffix(duration)}`;
}

// ── Priced combination iterators ────────────────────────────────────────────

export type PricedCombination = {
  country: "CA" | "US";
  tier: TierCode;
  duration: BillingDuration;
  alliedCareer?: AlliedCareerKey;
  planCode: string;
};

/** Yields every priced nursing plan (not allied). */
export function* eachNursingPricedCombination(): Generator<PricedCombination> {
  for (const country of ["CA", "US"] as const) {
    for (const tier of NURSING_TIERS_BY_COUNTRY[country]) {
      for (const duration of BILLING_DURATION_ORDER) {
        if (getDisplayTotalMajorUnits(country, tier, duration) !== undefined) {
          yield { country, tier, duration, planCode: nursingPlanCode(country, tier, duration) };
        }
      }
    }
  }
}

/** Yields every priced allied career plan. */
export function* eachAlliedPricedCombination(): Generator<PricedCombination> {
  for (const country of ["CA", "US"] as const) {
    for (const career of ALLIED_CAREER_KEYS) {
      for (const duration of BILLING_DURATION_ORDER) {
        yield {
          country,
          tier: "ALLIED" as TierCode,
          duration,
          alliedCareer: career,
          planCode: alliedPlanCode(country, career, duration),
        };
      }
    }
  }
}

/** Yields every priced plan (nursing + allied). */
export function* eachPricedCombination(): Generator<PricedCombination> {
  yield* eachNursingPricedCombination();
  yield* eachAlliedPricedCombination();
}

// ── Formatting ──────────────────────────────────────────────────────────────

export function currencyCode(country: "CA" | "US"): "CAD" | "USD" {
  return country === "CA" ? "CAD" : "USD";
}

export function formatCurrencyLabel(amount: number, country: "CA" | "US"): string {
  return `$${amount.toFixed(2)} ${currencyCode(country)}`;
}

export function formatPerMonthLabel(amount: number, country: "CA" | "US"): string {
  return `$${amount.toFixed(2)} ${currencyCode(country)}/mo`;
}

export function getMonthlyListLabel(country: "CA" | "US", tier: TierCode): string {
  const m = getDisplayTotalMajorUnits(country, tier, "monthly");
  if (m === undefined) return "—";
  return `$${m.toFixed(2)} ${currencyCode(country)}/mo`;
}

/** Currency notice for pricing surfaces. */
export function canadianPricingNotice(): string {
  return "All Prices Shown for Canadian Plans Are in Canadian Dollars (CAD)";
}
