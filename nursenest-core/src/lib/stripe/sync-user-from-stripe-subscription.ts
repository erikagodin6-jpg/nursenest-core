import { CountryCode, TierCode, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { canonicalProfessionKeyForAlliedCareer } from "@/lib/allied/allied-billing-career-resolution";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { planFromCheckoutMetadata, type CheckoutPlan } from "@/lib/stripe/checkout-plan-metadata";
import { findTierCountryByPriceId } from "@/lib/stripe/pricing-map";
import type { AlliedCareerKey } from "@/lib/pricing/display-catalog";

export type { CheckoutPlan } from "@/lib/stripe/checkout-plan-metadata";
export { planFromCheckoutMetadata } from "@/lib/stripe/checkout-plan-metadata";

/**
 * Aligns `User.tier`, `User.country`, and `User.alliedProfessionKey`
 * with what the learner purchased.
 */
export async function syncUserFromCheckoutSessionMetadata(
  userId: string,
  metadata: Record<string, string> | null | undefined,
): Promise<void> {
  const plan = planFromCheckoutMetadata(metadata);
  if (!plan) return;
  const data: Prisma.UserUpdateInput = { tier: plan.tier };
  if (plan.country != null) {
    data.country = plan.country;
  }
  if (plan.alliedCareer) {
    data.alliedProfessionKey = canonicalProfessionKeyForAlliedCareer(plan.alliedCareer);
  }
  await prisma.user.update({ where: { id: userId }, data });
  safeServerLog("stripe_sync", "user_profile_from_checkout_metadata", {
    tier: plan.tier,
    country: plan.country ?? undefined,
    regionalOnly: plan.country == null ? 1 : 0,
    alliedCareer: plan.alliedCareer ?? undefined,
  });
}

export async function syncUserFromStripePriceId(
  userId: string,
  priceId: string,
  planOverride?: CountryCode | CheckoutPlan | null,
): Promise<void> {
  const mapped = findTierCountryByPriceId(priceId);
  if (!mapped) {
    safeServerLog("stripe_sync", "unknown_price_id_skip_user_tier", {
      priceIdPrefix: priceId.slice(0, 28),
    });
    return;
  }
  const overridePlan =
    planOverride && typeof planOverride === "object" && "tier" in planOverride ? planOverride : null;
  const countryOverride = overridePlan
    ? overridePlan.country
    : planOverride === undefined || typeof planOverride === "object"
      ? undefined
      : planOverride;
  const resolvedTier = overridePlan?.tier ?? mapped.tier;
  const resolvedCountry = countryOverride === undefined ? mapped.country : countryOverride;
  const data: Prisma.UserUpdateInput = { tier: resolvedTier };
  if (resolvedCountry != null) {
    data.country = resolvedCountry;
  }
  /**
   * Shared Allied Stripe prices do not encode occupation — never infer `alliedProfessionKey` from price id alone
   * (would incorrectly pin a single career from duplicate matrix rows).
   */
  const alliedCareer = overridePlan?.alliedCareer ?? mapped.alliedCareer;
  if (resolvedTier === TierCode.ALLIED && alliedCareer) {
    data.alliedProfessionKey = canonicalProfessionKeyForAlliedCareer(alliedCareer as AlliedCareerKey);
  }
  await prisma.user.update({ where: { id: userId }, data });
  safeServerLog("stripe_sync", "user_profile_from_price_id", {
    tier: resolvedTier,
    country: resolvedCountry ?? undefined,
    alliedCareer: alliedCareer ?? undefined,
  });
}
