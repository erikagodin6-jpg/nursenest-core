import type { TierCode } from "@prisma/client";
import type { BillingDuration } from "@/lib/pricing/billing-types";

/**
 * Single source of truth for **list prices** shown in UI (CAD or USD major units).
 * Stripe charge amounts must match Prices configured in Stripe for the env `STRIPE_PRICE_*` IDs.
 * Full matrix (country + tier + duration → env key + resolved Price id): `eachStripePriceMatrixRow` in `@/lib/stripe/pricing-map`.
 */
const CA_LIST_PRICE_MAJOR: Partial<Record<TierCode, Record<BillingDuration, number>>> = {
  RPN: { monthly: 29.99, "3-month": 64.99, "6-month": 99.99, yearly: 149.99 },
  RN: { monthly: 39.99, "3-month": 89.99, "6-month": 139.99, yearly: 199.99 },
  NP: { monthly: 49.99, "3-month": 119.99, "6-month": 179.99, yearly: 259.99 },
  ALLIED: { monthly: 19.99, "3-month": 49.99, "6-month": 79.99, yearly: 119.99 },
};

const US_LIST_PRICE_MAJOR: Partial<Record<TierCode, Record<BillingDuration, number>>> = {
  LVN_LPN: { monthly: 24.99, "3-month": 59.99, "6-month": 89.99, yearly: 129.99 },
  RN: { monthly: 34.99, "3-month": 79.99, "6-month": 119.99, yearly: 179.99 },
  NP: { monthly: 44.99, "3-month": 109.99, "6-month": 159.99, yearly: 229.99 },
  ALLIED: { monthly: 17.99, "3-month": 44.99, "6-month": 69.99, yearly: 109.99 },
};

/**
 * Anchor prices (strikethrough "was" values) for conversion UI.
 * Shown as crossed-out reference alongside the real price to convey founding/limited-time value.
 * Only set for tiers where anchor pricing is enabled; null means no strikethrough display.
 */
const CA_ANCHOR_PRICE_MAJOR: Partial<Record<TierCode, Partial<Record<BillingDuration, number>>>> = {
  RPN: { "3-month": 89.99, "6-month": 149.99, yearly: 219.99 },
  RN: { "3-month": 119.99, "6-month": 199.99, yearly: 299.99 },
  NP: { "3-month": 149.99, "6-month": 249.99, yearly: 389.99 },
  ALLIED: { "3-month": 59.99, "6-month": 99.99, yearly: 159.99 },
};

const US_ANCHOR_PRICE_MAJOR: Partial<Record<TierCode, Partial<Record<BillingDuration, number>>>> = {
  LVN_LPN: { "3-month": 74.99, "6-month": 129.99, yearly: 189.99 },
  RN: { "3-month": 104.99, "6-month": 179.99, yearly: 259.99 },
  NP: { "3-month": 134.99, "6-month": 224.99, yearly: 349.99 },
  ALLIED: { "3-month": 54.99, "6-month": 89.99, yearly: 139.99 },
};

/** Tiers sold per country (no CA LVN/LPN; no US RPN in public pricing). */
export const TIERS_BY_COUNTRY: Record<"CA" | "US", TierCode[]> = {
  CA: ["RPN", "RN", "NP", "ALLIED"],
  US: ["LVN_LPN", "RN", "NP", "ALLIED"],
};

export const BILLING_DURATION_ORDER: BillingDuration[] = ["monthly", "3-month", "6-month", "yearly"];

// ── Trial configuration ─────────────────────────────────────────────────────

/** Default Stripe trial period attached to new checkout subscriptions. */
export const STRIPE_TRIAL_DAYS = 3;

/** Fallback when a shorter trial is needed (e.g. via feature flag or specific campaigns). */
export const STRIPE_TRIAL_DAYS_SHORT = 1;

/** Whether payment method is collected upfront during trial (always true for Stripe trials). */
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
