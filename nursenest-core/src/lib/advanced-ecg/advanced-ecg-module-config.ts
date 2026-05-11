import type { TierCode } from "@prisma/client";

export const ADVANCED_ECG_MODULE_NAME = "Advanced ECG & Telemetry Mastery" as const;
export const ADVANCED_ECG_MODULE_ENTITLEMENT = "module_advanced_ecg" as const;
export const ADVANCED_ECG_MODULE_ROUTE = "/modules/ecg-advanced" as const;
export const ADVANCED_ECG_MODULE_CHECKOUT_ANCHOR = `${ADVANCED_ECG_MODULE_ROUTE}#upgrade` as const;
export const ADVANCED_ECG_MARKETING_ROUTE = "/advanced-ecg" as const;
export const ADVANCED_ECG_PRICING_ANCHOR = "/pricing#advanced-ecg-add-on" as const;
export const ADVANCED_ECG_ALLOWED_TIERS = ["RN", "NP"] as const satisfies readonly TierCode[];
export const ADVANCED_ECG_PLAN_CODE_PREFIX = `${ADVANCED_ECG_MODULE_ENTITLEMENT}_` as const;
export const ADVANCED_ECG_LIFETIME_PLAN_CODE = `${ADVANCED_ECG_MODULE_ENTITLEMENT}_lifetime` as const;
export const ADVANCED_ECG_STRIPE_PRICE_ENV_KEY = "STRIPE_PRICE_MODULE_ADVANCED_ECG_LIFETIME" as const;
export const ADVANCED_ECG_PRICE_CAD = 99 as const;
export const ADVANCED_ECG_PRICE_LABEL = "$99 CAD" as const;
export const ADVANCED_ECG_PURCHASE_MODEL = "one_time_lifetime" as const;
export const ADVANCED_ECG_PURCHASE_BADGE = "One-time purchase" as const;

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

export function advancedEcgPlanCode(): string {
  return ADVANCED_ECG_LIFETIME_PLAN_CODE;
}

export function isAdvancedEcgPlanCode(planCode: string | null | undefined): boolean {
  return planCode?.trim().toLowerCase().startsWith(ADVANCED_ECG_PLAN_CODE_PREFIX) ?? false;
}

export function advancedEcgStripePriceEnvKey(): string {
  return ADVANCED_ECG_STRIPE_PRICE_ENV_KEY;
}

export function advancedEcgPriceLabel(): string {
  return ADVANCED_ECG_PRICE_LABEL;
}

export function advancedEcgLifetimeStripeReference(paymentIntentId: string | null | undefined, checkoutSessionId: string): string {
  const paymentId = paymentIntentId?.trim();
  if (paymentId) return `payment:${paymentId}`;
  return `checkout:${checkoutSessionId}`;
}
