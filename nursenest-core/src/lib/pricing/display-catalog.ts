import type { TierCode } from "@prisma/client";
import type { BillingDuration } from "@/lib/pricing/billing-types";

/**
 * Single source of truth for **list prices** shown in UI (CAD or USD major units).
 * Stripe charge amounts must match Prices configured in Stripe for the env `STRIPE_PRICE_*` IDs.
 * Full matrix (country + tier + duration → env key + resolved Price id): `eachStripePriceMatrixRow` in `@/lib/stripe/pricing-map`.
 */
const CA_LIST_PRICE_MAJOR: Partial<Record<TierCode, Record<BillingDuration, number>>> = {
  RPN: { monthly: 24.99, "3-month": 64.99, "6-month": 109.99, yearly: 169.99 },
  RN: { monthly: 32.99, "3-month": 84.99, "6-month": 149.99, yearly: 229.99 },
  NP: { monthly: 39.99, "3-month": 99.99, "6-month": 179.99, yearly: 269.99 },
  ALLIED: { monthly: 19.99, "3-month": 49.99, "6-month": 89.99, yearly: 139.99 },
};

const US_LIST_PRICE_MAJOR: Partial<Record<TierCode, Record<BillingDuration, number>>> = {
  LVN_LPN: { monthly: 19.99, "3-month": 49.99, "6-month": 89.99, yearly: 139.99 },
  RN: { monthly: 29.99, "3-month": 79.99, "6-month": 139.99, yearly: 209.99 },
  NP: { monthly: 34.99, "3-month": 89.99, "6-month": 159.99, yearly: 239.99 },
  ALLIED: { monthly: 17.99, "3-month": 44.99, "6-month": 79.99, yearly: 129.99 },
};

/** Tiers sold per country (no CA LVN/LPN; no US RPN in public pricing). */
export const TIERS_BY_COUNTRY: Record<"CA" | "US", TierCode[]> = {
  CA: ["RPN", "RN", "NP", "ALLIED"],
  US: ["LVN_LPN", "RN", "NP", "ALLIED"],
};

export const BILLING_DURATION_ORDER: BillingDuration[] = ["monthly", "3-month", "6-month", "yearly"];

export function getDisplayTotalMajorUnits(
  country: "CA" | "US",
  tier: TierCode,
  duration: BillingDuration,
): number | undefined {
  const table = country === "CA" ? CA_LIST_PRICE_MAJOR : US_LIST_PRICE_MAJOR;
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

/** Env var for Stripe Price id: STRIPE_PRICE_CA_RPN_MONTHLY, STRIPE_PRICE_US_ALLIED_YEARLY, etc. */
export function stripePriceEnvKey(country: "CA" | "US", tier: TierCode, duration: BillingDuration): string {
  const dur =
    duration === "monthly"
      ? "MONTHLY"
      : duration === "3-month"
        ? "3MONTH"
        : duration === "6-month"
          ? "6MONTH"
          : "YEARLY";
  return `STRIPE_PRICE_${country}_${tier}_${dur}`;
}

export function* eachPricedCombination(): Generator<{
  country: "CA" | "US";
  tier: TierCode;
  duration: BillingDuration;
}> {
  for (const country of ["CA", "US"] as const) {
    for (const tier of TIERS_BY_COUNTRY[country]) {
      for (const duration of BILLING_DURATION_ORDER) {
        if (getDisplayTotalMajorUnits(country, tier, duration) !== undefined) {
          yield { country, tier, duration };
        }
      }
    }
  }
}

export function formatCurrencyLabel(amount: number, country: "CA" | "US"): string {
  const cur = country === "CA" ? "CAD" : "USD";
  return `$${amount.toFixed(2)} ${cur}`;
}

export function formatPerMonthLabel(amount: number, country: "CA" | "US"): string {
  const cur = country === "CA" ? "CAD" : "USD";
  return `$${amount.toFixed(2)} ${cur}/mo`;
}

/** Monthly list price for plan summary cards (domain layer). */
export function getMonthlyListLabel(country: "CA" | "US", tier: TierCode): string {
  const m = getDisplayTotalMajorUnits(country, tier, "monthly");
  if (m === undefined) return "—";
  const sym = country === "CA" ? "CAD" : "USD";
  return `$${m.toFixed(2)} ${sym}/mo`;
}
