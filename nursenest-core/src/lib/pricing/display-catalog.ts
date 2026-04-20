import type { TierCode } from "@prisma/client";
import type { BillingDuration } from "@/lib/pricing/billing-types";

/**
 * Single source of truth for list prices (CAD major units).
 *
 * All plans are billed in Canadian dollars. Stripe charge amounts must match
 * Prices configured in Stripe for the env `STRIPE_PRICE_*` IDs.
 *
 * Allied Health pricing is per-career; each career has its own Stripe price
 * IDs and entitlement scope.
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

// ── Nursing tier prices (CAD) ────────────────────────────────────────────────
//
// Source of truth: Stripe prices exported 2026-03-14.
// NEW_GRAD has no 3-month Stripe price — that duration is intentionally absent.
// PRE_NURSING / LVN_LPN: display amounts mirror adjacent tracks until dedicated Stripe
// rows exist; checkout still requires matching STRIPE_PRICE_* envs (see pricing-map).
// Amounts must match what is configured in Stripe for tiers that checkout; checkout charges the Stripe
// price, not these display values.

const LIST_PRICE_MAJOR: Partial<Record<TierCode, Partial<Record<BillingDuration, number>>>> = {
  // Pre-nursing — list mirrors New Grad until a dedicated Stripe matrix ships
  PRE_NURSING: { monthly: 9.99, "6-month": 39.99, yearly: 59.99 },
  // New Grad Prep — 3 plans only (no 3-month in Stripe)
  NEW_GRAD: { monthly: 9.99, "6-month": 39.99, yearly: 59.99 },
  // Canada RPN / REx-PN
  RPN: { monthly: 24.99, "3-month": 59.99, "6-month": 99.99, yearly: 149.99 },
  // US LVN/LPN / NCLEX-PN — display mirrors Canadian PN list (CAD catalog; region toggle is UX)
  LVN_LPN: { monthly: 24.99, "3-month": 59.99, "6-month": 99.99, yearly: 149.99 },
  // RN / NCLEX-RN
  RN: { monthly: 29.99, "3-month": 74.99, "6-month": 119.99, yearly: 179.99 },
  // Nurse Practitioner
  NP: { monthly: 39.99, "3-month": 99.99, "6-month": 159.99, yearly: 239.99 },
};

// ── Allied Health prices (CAD, same for every career) ────────────────────────
//
// All 7 allied careers share the same 4 Stripe prices (price_1TAxCe…, price_1TAxDb…,
// price_1TAxEa…, price_1TAxF7…). Each career's env vars point to these same IDs.

const ALLIED_PRICE: Record<BillingDuration, number> = {
  monthly: 14.99,
  "3-month": 34.99,
  "6-month": 59.99,
  yearly: 99.99,
};

// ── Anchor prices (strikethrough "was" values for conversion UI) ─────────────

const ANCHOR_PRICE_MAJOR: Partial<Record<TierCode, Partial<Record<BillingDuration, number>>>> = {
  RPN: { "3-month": 99.99, "6-month": 159.99, yearly: 229.99 },
  LVN_LPN: { "3-month": 99.99, "6-month": 159.99, yearly: 229.99 },
  RN: { "3-month": 119.99, "6-month": 199.99, yearly: 299.99 },
  NP: { "3-month": 149.99, "6-month": 249.99, yearly: 389.99 },
};

// ── Tiers sold ──────────────────────────────────────────────────────────────

export const NURSING_TIERS: TierCode[] = ["PRE_NURSING", "NEW_GRAD", "RPN", "LVN_LPN", "RN", "NP"];

/** @deprecated Kept for backward compat with code that still expects the old shape. */
export const NURSING_TIERS_BY_COUNTRY: Record<"CA" | "US", TierCode[]> = {
  CA: NURSING_TIERS,
  US: NURSING_TIERS,
};

export const BILLING_DURATION_ORDER: BillingDuration[] = ["monthly", "3-month", "6-month", "yearly"];

// ── Trial configuration ─────────────────────────────────────────────────────

export const STRIPE_TRIAL_DAYS = 3;
export const STRIPE_TRIAL_DAYS_SHORT = 1;
export const TRIAL_REQUIRES_PAYMENT_METHOD = true;

// ── Price lookups ───────────────────────────────────────────────────────────

export function getDisplayTotalMajorUnits(
  _country: "CA" | "US",
  tier: TierCode,
  duration: BillingDuration,
): number | undefined {
  return LIST_PRICE_MAJOR[tier]?.[duration];
}

export function getAlliedDisplayPrice(
  _country: "CA" | "US",
  duration: BillingDuration,
): number {
  return ALLIED_PRICE[duration];
}

export function getAnchorPriceMajorUnits(
  _country: "CA" | "US",
  tier: TierCode,
  duration: BillingDuration,
): number | undefined {
  return ANCHOR_PRICE_MAJOR[tier]?.[duration];
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

/** Env var for nursing tier Stripe Price id: STRIPE_PRICE_RN_MONTHLY, etc. */
export function stripePriceEnvKey(_country: "CA" | "US", tier: TierCode, duration: BillingDuration): string {
  return `STRIPE_PRICE_${tier}_${durationEnvSuffix(duration)}`;
}

/** Env var for allied career Stripe Price id: STRIPE_PRICE_ALLIED_PARAMEDIC_MONTHLY, etc. */
export function alliedStripePriceEnvKey(
  _country: "CA" | "US",
  career: AlliedCareerKey,
  duration: BillingDuration,
): string {
  return `STRIPE_PRICE_ALLIED_${career.toUpperCase()}_${durationEnvSuffix(duration)}`;
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
  }
}

/** Internal plan code: e.g. `rn_monthly`, `np_12m`. */
export function nursingPlanCode(_country: "CA" | "US", tier: TierCode, duration: BillingDuration): string {
  return `${tierPlanPrefix(tier)}_${durationPlanSuffix(duration)}`;
}

/** Internal plan code for allied careers: e.g. `allied_paramedic_monthly`. */
export function alliedPlanCode(_country: "CA" | "US", career: AlliedCareerKey, duration: BillingDuration): string {
  return `allied_${career}_${durationPlanSuffix(duration)}`;
}

// ── Priced combination iterators ────────────────────────────────────────────

export type PricedCombination = {
  country: "CA" | "US";
  tier: TierCode;
  duration: BillingDuration;
  alliedCareer?: AlliedCareerKey;
  planCode: string;
};

/** Yields every priced nursing plan. */
export function* eachNursingPricedCombination(_markets?: readonly ("CA" | "US")[]): Generator<PricedCombination> {
  for (const tier of NURSING_TIERS) {
    for (const duration of BILLING_DURATION_ORDER) {
      if (getDisplayTotalMajorUnits("CA", tier, duration) !== undefined) {
        yield { country: "CA", tier, duration, planCode: nursingPlanCode("CA", tier, duration) };
      }
    }
  }
}

/** Yields every priced allied career plan. */
export function* eachAlliedPricedCombination(_markets?: readonly ("CA" | "US")[]): Generator<PricedCombination> {
  for (const career of ALLIED_CAREER_KEYS) {
    for (const duration of BILLING_DURATION_ORDER) {
      yield {
        country: "CA",
        tier: "ALLIED" as TierCode,
        duration,
        alliedCareer: career,
        planCode: alliedPlanCode("CA", career, duration),
      };
    }
  }
}

/** Yields every priced plan (nursing + allied). */
export function* eachPricedCombination(_markets?: readonly ("CA" | "US")[]): Generator<PricedCombination> {
  yield* eachNursingPricedCombination();
  yield* eachAlliedPricedCombination();
}

// ── Formatting ──────────────────────────────────────────────────────────────

export function currencyCode(_country?: "CA" | "US"): "CAD" {
  return "CAD";
}

export function formatCurrencyLabel(amount: number, _country?: "CA" | "US"): string {
  return `$${amount.toFixed(2)} CAD`;
}

export function formatPerMonthLabel(amount: number, _country?: "CA" | "US"): string {
  return `$${amount.toFixed(2)} CAD/mo`;
}

export function getMonthlyListLabel(_country: "CA" | "US", tier: TierCode): string {
  const m = getDisplayTotalMajorUnits("CA", tier, "monthly");
  if (m === undefined) return "—";
  return `$${m.toFixed(2)} CAD/mo`;
}
