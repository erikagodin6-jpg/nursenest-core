import type { TierCode } from "@prisma/client";

// ─── Entitlement constants ─────────────────────────────────────────────────────

export const HEMODYNAMICS_FUNDAMENTALS_ENTITLEMENT = "hemodynamics_fundamentals" as const;
export const ADVANCED_HEMODYNAMICS_ENTITLEMENT = "advanced_hemodynamics_paid" as const;
export const CRITICAL_CARE_BUNDLE_ENTITLEMENT = "critical_care_bundle_paid" as const;

// ─── Module routing ────────────────────────────────────────────────────────────

export const HEMODYNAMICS_MODULE_ROUTE = "/modules/hemodynamics" as const;
export const ADVANCED_HEMODYNAMICS_MODULE_ROUTE = "/modules/hemodynamics-advanced" as const;
export const ADVANCED_HEMODYNAMICS_MODULE_CHECKOUT_ANCHOR = `${ADVANCED_HEMODYNAMICS_MODULE_ROUTE}#upgrade` as const;
export const ADVANCED_HEMODYNAMICS_PRICING_ANCHOR = "/pricing#advanced-hemodynamics-add-on" as const;

// ─── Tier eligibility ──────────────────────────────────────────────────────────

/** RN and NP subscribers get Hemodynamic Monitoring Fundamentals included. */
export const HEMODYNAMICS_FUNDAMENTALS_ALLOWED_TIERS = ["RN", "NP"] as const satisfies readonly TierCode[];

/** Advanced Hemodynamics (paid add-on) requires RN or NP base subscription. */
export const ADVANCED_HEMODYNAMICS_ALLOWED_TIERS = ["RN", "NP"] as const satisfies readonly TierCode[];

export type AdvancedHemodynamicsAllowedTier = (typeof ADVANCED_HEMODYNAMICS_ALLOWED_TIERS)[number];

// ─── Plan codes ─────────────────────────────────────────────────────────────────

/** One-time purchase — plan code carries no duration suffix. */
export const ADVANCED_HEMODYNAMICS_PLAN_CODE = ADVANCED_HEMODYNAMICS_ENTITLEMENT as const;
export const CRITICAL_CARE_BUNDLE_PLAN_CODE = CRITICAL_CARE_BUNDLE_ENTITLEMENT as const;

// ─── Stripe env key helpers ────────────────────────────────────────────────────

/** Env var for the Advanced Hemodynamics add-on Stripe price. One-time purchase. */
export function advancedHemodynamicsStripePriceEnvKey(): string {
  return "STRIPE_PRICE_ADVANCED_HEMODYNAMICS";
}

/** Env var for the Critical Care Bundle Stripe price. One-time purchase. */
export function criticalCareBundleStripePriceEnvKey(): string {
  return "STRIPE_PRICE_CRITICAL_CARE_BUNDLE";
}

// ─── Feature flag helpers ──────────────────────────────────────────────────────

export function isHemodynamicsModuleEnabled(
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): boolean {
  const raw = env.ENABLE_HEMODYNAMICS_MODULE?.trim().toLowerCase();
  if (!raw) return true;
  return raw === "1" || raw === "true";
}

export function isAdvancedHemodynamicsModuleEnabled(
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): boolean {
  const raw = env.ENABLE_ADVANCED_HEMODYNAMICS_MODULE?.trim().toLowerCase();
  if (!raw) return true;
  return raw === "1" || raw === "true";
}

// ─── Tier eligibility helpers ──────────────────────────────────────────────────

export function isHemodynamicsFundamentalsTierEligible(tier: TierCode | string | null | undefined): boolean {
  return tier === "RN" || tier === "NP";
}

export function isAdvancedHemodynamicsTierEligible(tier: TierCode | string | null | undefined): tier is AdvancedHemodynamicsAllowedTier {
  return tier === "RN" || tier === "NP";
}

// ─── Plan code helpers ──────────────────────────────────────────────────────────

export function isAdvancedHemodynamicsPlanCode(planCode: string | null | undefined): boolean {
  if (!planCode) return false;
  const code = planCode.trim().toLowerCase();
  return code === ADVANCED_HEMODYNAMICS_PLAN_CODE || code === CRITICAL_CARE_BUNDLE_PLAN_CODE;
}

export function isCriticalCareBundlePlanCode(planCode: string | null | undefined): boolean {
  return planCode?.trim().toLowerCase() === CRITICAL_CARE_BUNDLE_PLAN_CODE;
}
