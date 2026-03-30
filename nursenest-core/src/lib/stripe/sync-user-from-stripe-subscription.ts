import { CountryCode, TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { findTierCountryByPriceId } from "@/lib/stripe/pricing-map";

const TIER_VALUES = new Set<string>(Object.values(TierCode));

/** Parsed Stripe Checkout metadata (`country`, `tier`) when valid. */
export function planFromCheckoutMetadata(
  metadata: Record<string, string> | null | undefined,
): { tier: TierCode; country: CountryCode } | null {
  if (!metadata) return null;
  const countryRaw = metadata.country;
  const tierRaw = metadata.tier;
  if (countryRaw !== "CA" && countryRaw !== "US") return null;
  if (!tierRaw || !TIER_VALUES.has(tierRaw)) return null;
  return { tier: tierRaw as TierCode, country: countryRaw as CountryCode };
}

/**
 * Aligns `User.tier` and `User.country` with what the learner purchased.
 * Entitlement content scope uses these fields (see `content-access-scope.ts`).
 */
export async function syncUserFromCheckoutSessionMetadata(
  userId: string,
  metadata: Record<string, string> | null | undefined,
): Promise<void> {
  const plan = planFromCheckoutMetadata(metadata);
  if (!plan) return;
  await prisma.user.update({
    where: { id: userId },
    data: { tier: plan.tier, country: plan.country },
  });
  safeServerLog("stripe_sync", "user_profile_from_checkout_metadata", { tier: plan.tier, country: plan.country });
}

export async function syncUserFromStripePriceId(userId: string, priceId: string): Promise<void> {
  const mapped = findTierCountryByPriceId(priceId);
  if (!mapped) return;
  await prisma.user.update({
    where: { id: userId },
    data: { tier: mapped.tier, country: mapped.country },
  });
  safeServerLog("stripe_sync", "user_profile_from_price_id", { tier: mapped.tier, country: mapped.country });
}
