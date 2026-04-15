/**
 * Raw SQL fragments mirroring {@link questionAccessWhere} and pathway exam filters
 * for `ORDER BY random()` ID sampling (Prisma has no portable random row order).
 */
import type { CountryCode, TierCode } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { DB_PUBLISHED, examQuestionTiersForUserTier } from "@/lib/entitlements/content-access-scope";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";
import { examQuestionPoolWhereForContext } from "@/lib/exam-context/query-scope";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

export function examQuestionAccessWhereSql(entitlement: AccessScope): Prisma.Sql {
  if (!entitlement.hasAccess) return Prisma.sql`FALSE`;
  if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) {
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
  if (!pathway) return Prisma.empty;
  const ctx = buildGlobalExamContext(pathway.id, "en");
  if (!ctx) return Prisma.sql` AND FALSE`;
  const scoped = examQuestionPoolWhereForContext(ctx);
  const keys = [...new Set(scoped.examIn)];
  const tiers = [...new Set(scoped.tierMatches.map((tier) => tier.toLowerCase()))];
  if (keys.length === 0 || tiers.length === 0) return Prisma.sql` AND FALSE`;
  return Prisma.sql` AND exam IN (${Prisma.join(keys)}) AND lower(coalesce(tier, '')) IN (${Prisma.join(tiers)})`;
}

export function topicEqualsSql(topic: string): Prisma.Sql {
  return Prisma.sql` AND topic = ${topic}`;
}

export function excludeQuestionIdsSql(ids: string[]): Prisma.Sql {
  if (ids.length === 0) return Prisma.empty;
  return Prisma.sql` AND id NOT IN (${Prisma.join(ids)})`;
}

/** Restrict random sampling to this id set (e.g. learner “mistakes” from client history). */
export function includeQuestionIdsSql(ids: string[]): Prisma.Sql {
  if (ids.length === 0) return Prisma.empty;
  return Prisma.sql` AND id IN (${Prisma.join(ids)})`;
}

export function examEqualsFilterSql(exam: string): Prisma.Sql {
  return Prisma.sql` AND exam = ${exam}`;
}

/** Difficulty is nullable in DB; filters exclude rows with NULL difficulty. */
export function difficultyBoundsSql(min: number | null, max: number | null): Prisma.Sql {
  if (min == null && max == null) return Prisma.empty;
  if (min != null && max != null) {
    return Prisma.sql` AND difficulty IS NOT NULL AND difficulty >= ${min} AND difficulty <= ${max}`;
  }
  if (min != null) return Prisma.sql` AND difficulty IS NOT NULL AND difficulty >= ${min}`;
  return Prisma.sql` AND difficulty IS NOT NULL AND difficulty <= ${max!}`;
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
