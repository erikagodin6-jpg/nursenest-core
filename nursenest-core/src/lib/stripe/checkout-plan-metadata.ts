import { CountryCode, TierCode } from "@prisma/client";
import { isGlobalRegionSlug } from "@/lib/i18n/global-regions";
import { ALLIED_CAREER_KEYS, type AlliedCareerKey } from "@/lib/pricing/display-catalog";

const TIER_VALUES = new Set<string>(Object.values(TierCode));
const CAREER_SET = new Set<string>(ALLIED_CAREER_KEYS);

export type CheckoutPlan = {
  tier: TierCode;
  /**
   * CA/US entitlement pool when set. `null` for international regional checkout — use Subscription `billingRegionSlug`
   * for the market; do not overwrite `User.country` with a fake CA/US value.
   */
  country: CountryCode | null;
  alliedCareer?: AlliedCareerKey;
};

/**
 * Parsed Stripe Checkout session metadata. **Server** writes metadata at session creation — not client-supplied price IDs.
 * Supports legacy CA/US, `region` = `canada`|`us`, and global regional slugs (tier without CA/US pool).
 */
export function planFromCheckoutMetadata(
  metadata: Record<string, string> | null | undefined,
): CheckoutPlan | null {
  if (!metadata) return null;
  const tierRaw = metadata.tier?.trim();
  if (!tierRaw || !TIER_VALUES.has(tierRaw)) return null;
  const tier = tierRaw as TierCode;

  const regionRaw = metadata.region?.trim();
  const countryMeta = metadata.country?.trim();

  let country: CountryCode | null = null;

  if (regionRaw && isGlobalRegionSlug(regionRaw) && regionRaw !== "canada" && regionRaw !== "us") {
    country = null;
  } else if (countryMeta === "CA" || countryMeta === "US") {
    country = countryMeta as CountryCode;
  } else if (regionRaw === "canada") {
    country = "CA";
  } else if (regionRaw === "us") {
    country = "US";
  } else {
    return null;
  }

  const result: CheckoutPlan = { tier, country };
  const careerRaw = metadata.alliedCareer?.trim();
  if (careerRaw && CAREER_SET.has(careerRaw)) {
    result.alliedCareer = careerRaw as AlliedCareerKey;
  }
  return result;
}
