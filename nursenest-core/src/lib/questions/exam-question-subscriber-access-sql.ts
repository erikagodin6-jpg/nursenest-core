import type { CountryCode, TierCode } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { examQuestionTiersForUserTier } from "@/lib/entitlements/content-access-scope";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";

/**
 * Raw `exam_questions` WHERE fragment for subscriber/staff gates.
 * Stays aligned with {@link questionAccessWhere} — both legacy `status` spellings.
 */
export function examQuestionTierRegionPublishedSql(entitlement: AccessScope): Prisma.Sql {
  if (!entitlement.hasAccess) return Prisma.sql`FALSE`;
  if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) {
    const country = entitlement.country as CountryCode | null;
    if (!country) {
      return Prisma.sql`(status = 'published' OR status = 'PUBLISHED')`;
    }
    const region =
      country === "CA"
        ? Prisma.sql`(region_scope = 'BOTH' OR region_scope = 'CA_ONLY')`
        : Prisma.sql`(region_scope = 'BOTH' OR region_scope = 'US_ONLY')`;
    return Prisma.sql`(status = 'published' OR status = 'PUBLISHED') AND ${region}`;
  }
  const country = entitlement.country as CountryCode | null;
  const tier = entitlement.tier as TierCode | null;
  if (!country || !tier) return Prisma.sql`FALSE`;
  const tiers = examQuestionTiersForUserTier(tier);
  if (tiers.length === 0) return Prisma.sql`FALSE`;
  const region =
    country === "CA"
      ? Prisma.sql`(region_scope = 'BOTH' OR region_scope = 'CA_ONLY')`
      : Prisma.sql`(region_scope = 'BOTH' OR region_scope = 'US_ONLY')`;
  return Prisma.sql`(status = 'published' OR status = 'PUBLISHED') AND tier IN (${Prisma.join(tiers)}) AND ${region}`;
}
