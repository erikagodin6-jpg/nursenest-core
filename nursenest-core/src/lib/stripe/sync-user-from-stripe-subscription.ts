import { type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { planFromCheckoutMetadata } from "@/lib/stripe/checkout-plan-metadata";
import { findTierCountryByPriceId } from "@/lib/stripe/pricing-map";

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
    data.alliedProfessionKey = plan.alliedCareer;
  }
  await prisma.user.update({ where: { id: userId }, data });
  safeServerLog("stripe_sync", "user_profile_from_checkout_metadata", {
    tier: plan.tier,
    country: plan.country ?? undefined,
    regionalOnly: plan.country == null ? 1 : 0,
    alliedCareer: plan.alliedCareer ?? undefined,
  });
}

export async function syncUserFromStripePriceId(userId: string, priceId: string): Promise<void> {
  const mapped = findTierCountryByPriceId(priceId);
  if (!mapped) {
    safeServerLog("stripe_sync", "unknown_price_id_skip_user_tier", {
      priceIdPrefix: priceId.slice(0, 28),
    });
    return;
  }
  const data: Prisma.UserUpdateInput = { tier: mapped.tier, country: mapped.country };
  if (mapped.alliedCareer) {
    data.alliedProfessionKey = mapped.alliedCareer;
  }
  await prisma.user.update({ where: { id: userId }, data });
  safeServerLog("stripe_sync", "user_profile_from_price_id", {
    tier: mapped.tier,
    country: mapped.country,
    alliedCareer: mapped.alliedCareer ?? undefined,
  });
}
