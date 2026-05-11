import type { TierCode } from "@prisma/client";
import type { BillingDuration } from "@/lib/stripe/pricing-map";

export const ADVANCED_ECG_MODULE_ENTITLEMENT = "module_advanced_ecg" as const;
export const ADVANCED_ECG_MODULE_ROUTE = "/modules/ecg-advanced" as const;
export const ADVANCED_ECG_MODULE_CHECKOUT_ANCHOR = `${ADVANCED_ECG_MODULE_ROUTE}#upgrade` as const;
export const ADVANCED_ECG_PRICING_ANCHOR = "/pricing#advanced-ecg-add-on" as const;
export const ADVANCED_ECG_ALLOWED_TIERS = ["RN", "NP"] as const satisfies readonly TierCode[];
export const ADVANCED_ECG_BILLING_DURATIONS = ["monthly", "3-month", "6-month", "yearly"] as const satisfies readonly BillingDuration[];
export const ADVANCED_ECG_PLAN_CODE_PREFIX = `${ADVANCED_ECG_MODULE_ENTITLEMENT}_` as const;

export type AdvancedEcgAllowedTier = (typeof ADVANCED_ECG_ALLOWED_TIERS)[number];

export function isAdvancedEcgModuleEnabled(
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): boolean {
  const raw = env.ENABLE_ADVANCED_ECG_MODULE?.trim().toLowerCase();
  if (!raw) return true;
  return raw === "1" || raw === "true";
}

export function isAdvancedEcgTierEligible(tier: TierCode | string | null | undefined): tier is AdvancedEcgAllowedTier {
  return tier === "RN" || tier === "NP";
}

export function advancedEcgPlanCode(duration: BillingDuration): string {
  return `${ADVANCED_ECG_MODULE_ENTITLEMENT}_${duration}`;
}

export function isAdvancedEcgPlanCode(planCode: string | null | undefined): boolean {
  return planCode?.trim().toLowerCase().startsWith(ADVANCED_ECG_PLAN_CODE_PREFIX) ?? false;
}

export function advancedEcgStripePriceEnvKey(duration: BillingDuration): string {
  const durationToken = duration.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
  return `STRIPE_PRICE_MODULE_ADVANCED_ECG_${durationToken}`;
}
