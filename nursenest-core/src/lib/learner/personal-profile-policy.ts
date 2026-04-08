import { SubscriptionStatus, type CountryCode, type TierCode } from "@prisma/client";
import { accessibleTiersForUserTier } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";

export type PathwayPickOption = { id: string; label: string };

/**
 * When an active billing record pins both plan tier and country, profile tier/country must not drift
 * from what Stripe/checkout established (entitlements use the subscription row).
 */
export function subscriptionLocksProfileRegionAndTier(sub: {
  status: SubscriptionStatus;
  planTier: TierCode | null;
  planCountry: CountryCode | null;
} | null): boolean {
  if (!sub) return false;
  const locksRegionTier = new Set<SubscriptionStatus>([
    SubscriptionStatus.ACTIVE,
    SubscriptionStatus.GRACE,
    SubscriptionStatus.PAST_DUE,
  ]);
  if (!locksRegionTier.has(sub.status)) return false;
  return sub.planTier != null && sub.planCountry != null;
}

/**
 * Pathways the learner may bind to `User.learnerPath` for the given profile tier/country.
 * For subscribers, options are derived from the same rules as `listPathwaysCompatibleWithSubscription`
 * but using the **profile** tier/country so validation stays correct when those fields are editable.
 */
export function listPathwayPicksForProfile(
  entitlement: AccessScope,
  profileTier: TierCode,
  profileCountry: CountryCode,
  subscriberAccess: boolean,
): PathwayPickOption[] {
  if (subscriberAccess && entitlement.hasAccess) {
    const scope: AccessScope =
      entitlement.reason === "admin_override"
        ? {
            hasAccess: true,
            reason: "admin_override",
            tier: profileTier,
            country: profileCountry,
          }
        : {
            hasAccess: true,
            reason: "active_subscription",
            tier: profileTier,
            country: profileCountry,
          };
    return listPathwaysCompatibleWithSubscription(scope).map((p) => ({
      id: p.id,
      label: p.shortName || p.displayName,
    }));
  }
  const allowedTiers = new Set(accessibleTiersForUserTier(profileTier));
  return EXAM_PATHWAYS.filter(
    (p) => p.status !== "hidden" && p.countryCode === profileCountry && allowedTiers.has(p.stripeTier),
  ).map((p) => ({
    id: p.id,
    label: p.shortName || p.displayName,
  }));
}

export function learnerPathIsAllowed(
  learnerPath: string | null,
  options: PathwayPickOption[],
): boolean {
  if (learnerPath == null || learnerPath.trim() === "") return true;
  return options.some((o) => o.id === learnerPath.trim());
}
