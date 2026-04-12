import { CountryCode, TierCode, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { findTierCountryByPriceId } from "@/lib/stripe/pricing-map";
import { ALLIED_CAREER_KEYS, type AlliedCareerKey } from "@/lib/pricing/display-catalog";

const TIER_VALUES = new Set<string>(Object.values(TierCode));
const CAREER_SET = new Set<string>(ALLIED_CAREER_KEYS);

export type CheckoutPlan = {
  tier: TierCode;
  country: CountryCode;
  alliedCareer?: AlliedCareerKey;
};

/** Parsed Stripe Checkout metadata (`country`, `tier`, optionally `alliedCareer`). */
export function planFromCheckoutMetadata(
  metadata: Record<string, string> | null | undefined,
): CheckoutPlan | null {
  if (!metadata) return null;
  const countryRaw = metadata.country;
  const tierRaw = metadata.tier;
  if (countryRaw !== "CA" && countryRaw !== "US") return null;
  if (!tierRaw || !TIER_VALUES.has(tierRaw)) return null;
  const result: CheckoutPlan = { tier: tierRaw as TierCode, country: countryRaw as CountryCode };
  const careerRaw = metadata.alliedCareer;
  if (careerRaw && CAREER_SET.has(careerRaw)) {
    result.alliedCareer = careerRaw as AlliedCareerKey;
  }
  return result;
}

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
  const data: Prisma.UserUpdateInput = { tier: plan.tier, country: plan.country };
  if (plan.alliedCareer) {
    data.alliedProfessionKey = plan.alliedCareer;
  }
  await prisma.user.update({ where: { id: userId }, data });
  safeServerLog("stripe_sync", "user_profile_from_checkout_metadata", {
    tier: plan.tier,
    country: plan.country,
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
