/**
 * Raw SQL fragments mirroring {@link questionAccessWhere} and pathway exam filters
 * for `ORDER BY random()` ID sampling (Prisma has no portable random row order).
 */
import type { CountryCode, TierCode } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { DB_PUBLISHED, examQuestionTiersForUserTier } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

export function examQuestionAccessWhereSql(entitlement: AccessScope): Prisma.Sql {
  if (!entitlement.hasAccess) return Prisma.sql`FALSE`;
  if (entitlement.reason === "admin_override") {
    const country = entitlement.country as CountryCode | null;
    if (!country) return Prisma.sql`status = ${DB_PUBLISHED}`;
    const region =
      country === "CA"
        ? Prisma.sql`(region_scope = 'BOTH' OR region_scope = 'CA_ONLY')`
        : Prisma.sql`(region_scope = 'BOTH' OR region_scope = 'US_ONLY')`;
    return Prisma.sql`status = ${DB_PUBLISHED} AND ${region}`;
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
  return Prisma.sql`status = ${DB_PUBLISHED} AND tier IN (${Prisma.join(tiers)}) AND ${region}`;
}

export function pathwayExamKeysSql(pathway: ExamPathwayDefinition | null): Prisma.Sql {
  if (!pathway || pathway.contentExamKeys.length === 0) return Prisma.empty;
  const keys = [...new Set(pathway.contentExamKeys)];
  return Prisma.sql` AND exam IN (${Prisma.join(keys)})`;
}

export function topicEqualsSql(topic: string): Prisma.Sql {
  return Prisma.sql` AND topic = ${topic}`;
}

export function excludeQuestionIdsSql(ids: string[]): Prisma.Sql {
  if (ids.length === 0) return Prisma.empty;
  return Prisma.sql` AND id NOT IN (${Prisma.join(ids)})`;
}

/** Full profile-tier pool (mirrors {@link questionBankWhereForProfile}) for baseline sampling. */
export function profileTierExamQuestionWhereSql(country: CountryCode, tier: TierCode): Prisma.Sql {
  const tiers = examQuestionTiersForUserTier(tier);
  if (tiers.length === 0) return Prisma.sql`FALSE`;
  const region =
    country === "CA"
      ? Prisma.sql`(region_scope = 'BOTH' OR region_scope = 'CA_ONLY')`
      : Prisma.sql`(region_scope = 'BOTH' OR region_scope = 'US_ONLY')`;
  return Prisma.sql`status = ${DB_PUBLISHED} AND tier IN (${Prisma.join(tiers)}) AND ${region}`;
}

/** Freemium pool — mirrors {@link freemiumQuestionWhereForProfile}. */
export function freemiumExamQuestionWhereSql(country: CountryCode, tier: TierCode): Prisma.Sql {
  const tiers =
    tier === "ALLIED" ? examQuestionTiersForUserTier("ALLIED") : examQuestionTiersForUserTier("LVN_LPN");
  const region =
    country === "CA"
      ? Prisma.sql`(region_scope = 'BOTH' OR region_scope = 'CA_ONLY')`
      : Prisma.sql`(region_scope = 'BOTH' OR region_scope = 'US_ONLY')`;
  return Prisma.sql`status = ${DB_PUBLISHED} AND tier IN (${Prisma.join(tiers)}) AND ${region}`;
}
