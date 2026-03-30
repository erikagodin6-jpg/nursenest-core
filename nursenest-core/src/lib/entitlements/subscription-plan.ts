import type { CountryCode, TierCode } from "@prisma/client";
import { normalizeCountryCodeForEntitlement } from "@/lib/entitlements/country-code";

/**
 * Prefer Stripe-backed plan fields on `Subscription` when present so entitlements match
 * the purchased product even if `User` drifted before sync completed.
 */
export function effectiveTierCountryForAccess(
  user: { tier: TierCode; country: CountryCode },
  subscription: { planTier: TierCode | null; planCountry: CountryCode | null } | null,
): { tier: TierCode; country: CountryCode | null } {
  const tier = subscription?.planTier ?? user.tier;
  const country = normalizeCountryCodeForEntitlement(subscription?.planCountry ?? user.country);
  return { tier, country };
}
