import type { TierCode } from "@prisma/client";

// ─── Entitlement constants ─────────────────────────────────────────────────────

export const ADVANCED_LABS_ENTITLEMENT =
  "advanced_labs_paid" as const;

export const CRITICAL_CARE_BUNDLE_ENTITLEMENT =
  "critical_care_bundle_paid" as const;

// ─── Module routing ────────────────────────────────────────────────────────────

export const ADVANCED_LABS_MODULE_ROUTE =
  "/modules/labs-advanced" as const;

export const ADVANCED_LABS_MODULE_CHECKOUT_ANCHOR =
  `${ADVANCED_LABS_MODULE_ROUTE}#upgrade` as const;

export const ADVANCED_LABS_PRICING_ANCHOR =
  "/pricing#advanced-labs-add-on" as const;

// ─── Tier eligibility ──────────────────────────────────────────────────────────

/** Advanced Labs (paid add-on) requires RN or NP base subscription. */
export const ADVANCED_LABS_ALLOWED_TIERS =
  ["RN", "NP"] as const satisfies readonly TierCode[];

export type AdvancedLabsAllowedTier =
  (typeof ADVANCED_LABS_ALLOWED_TIERS)[number];

// ─── Plan codes ────────────────────────────────────────────────────────────────

/** One-time purchase — plan code carries no duration suffix. */
export const ADVANCED_LABS_PLAN_CODE = ADVANCED_LABS_ENTITLEMENT;

export const CRITICAL_CARE_BUNDLE_PLAN_CODE = CRITICAL_CARE_BUNDLE_ENTITLEMENT;

// ─── Stripe env key helpers ───────────────────────────────────────────────────

/** Env var for the Advanced Labs add-on Stripe price. One-time purchase. */
export function advancedLabsStripePriceEnvKey(): string {
  return "STRIPE_PRICE_ADVANCED_LABS";
}

/** Env var for the Critical Care Bundle Stripe price. One-time purchase. */
export function criticalCareBundleStripePriceEnvKey(): string {
  return "STRIPE_PRICE_CRITICAL_CARE_BUNDLE";
}

// ─── Feature flag helpers ─────────────────────────────────────────────────────

export function isAdvancedLabsModuleEnabled(
  env: Record<string, string | undefined> =
    process.env as Record<string, string | undefined>,
): boolean {
  const raw = env.ENABLE_ADVANCED_LABS_MODULE?.trim().toLowerCase();
  if (!raw) return true;
  return raw === "1" || raw === "true";
}

// ─── Tier eligibility helpers ─────────────────────────────────────────────────

export function isAdvancedLabsTierEligible(
  tier: TierCode | string | null | undefined,
): tier is AdvancedLabsAllowedTier {
  return tier === "RN" || tier === "NP";
}

// ─── Plan code helpers ────────────────────────────────────────────────────────

export function isAdvancedLabsPlanCode(
  planCode: string | null | undefined,
): boolean {
  if (!planCode) return false;
  const code = planCode.trim().toLowerCase();
  return (
    code === ADVANCED_LABS_PLAN_CODE ||
    code === CRITICAL_CARE_BUNDLE_PLAN_CODE
  );
}

export function isCriticalCareBundlePlanCode(
  planCode: string | null | undefined,
): boolean {
  return (
    planCode?.trim().toLowerCase() === CRITICAL_CARE_BUNDLE_PLAN_CODE
  );
}
