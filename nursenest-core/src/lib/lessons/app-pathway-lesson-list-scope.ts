import type { Prisma } from "@prisma/client";
import { ContentStatus, type CountryCode, type TierCode } from "@prisma/client";
import { prismaTierCodesForProfileTier } from "@/lib/entitlements/accessible-tiers";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { canViewFullPathwayLesson } from "@/lib/lessons/pathway-lesson-access";

/** Pathway IDs the learner may see in `/app/lessons` (tier, country, NP specialty). */
export function visiblePathwayIdsForAppLessons(
  scope: AccessScope,
  learnerPath: string | null | undefined,
): string[] {
  return listPathwaysCompatibleWithSubscription(scope)
    .filter((p) => canViewFullPathwayLesson(scope, p, learnerPath))
    .map((p) => p.id);
}

/**
 * Prisma filter for published pathway lessons shown when `content_items` lessons are empty.
 * Aligns with pathway hub entitlement + optional row-level country/tier overrides.
 */
export function pathwayLessonsAppListWhere(
  scope: AccessScope,
  learnerPath: string | null | undefined,
): Prisma.PathwayLessonWhereInput {
  const pathwayIds = visiblePathwayIdsForAppLessons(scope, learnerPath);
  if (pathwayIds.length === 0) {
    return { id: { in: [] } };
  }

  const base: Prisma.PathwayLessonWhereInput[] = [
    { status: ContentStatus.PUBLISHED },
    { pathwayId: { in: pathwayIds } },
    { locale: "en" },
  ];

  if (scope.reason === "admin_override") {
    const country = scope.country as CountryCode | null;
    const tier = scope.tier as TierCode | null;
    if (country) {
      base.push({ OR: [{ countryCode: null }, { countryCode: country }] });
    }
    if (tier) {
      const allowed = prismaTierCodesForProfileTier(tier);
      base.push({ OR: [{ tierCode: null }, { tierCode: { in: allowed } }] });
    }
    return { AND: base };
  }

  const country = scope.country as CountryCode | null;
  const tier = scope.tier as TierCode | null;
  if (!country || !tier) {
    return { id: { in: [] } };
  }

  base.push({ OR: [{ countryCode: null }, { countryCode: country }] });
  base.push({
    OR: [{ tierCode: null }, { tierCode: { in: prismaTierCodesForProfileTier(tier) } }],
  });

  return { AND: base };
}

/**
 * Narrows pathway lessons by catalog `topic` or `topic_slug` (from weak-area / post-test links).
 */
export function pathwayLessonsAppListWhereWithTopicFilter(
  scope: AccessScope,
  learnerPath: string | null | undefined,
  filter: { topic?: string | null; topicSlug?: string | null; pathwayId?: string | null },
): Prisma.PathwayLessonWhereInput {
  const base = pathwayLessonsAppListWhere(scope, learnerPath);
  const slugTrim = filter.topicSlug?.trim().toLowerCase();
  const topicTrim = filter.topic?.trim();
  const pathwayTrim = filter.pathwayId?.trim();
  const topicClause: Prisma.PathwayLessonWhereInput | null = slugTrim
    ? { topicSlug: slugTrim }
    : topicTrim
      ? { topic: { equals: topicTrim, mode: "insensitive" } }
      : null;
  const pathwayClause: Prisma.PathwayLessonWhereInput | null = pathwayTrim ? { pathwayId: pathwayTrim } : null;
  if (!topicClause && !pathwayClause) return base;
  const clauses = [topicClause, pathwayClause].filter(Boolean) as Prisma.PathwayLessonWhereInput[];

  if ("AND" in base && Array.isArray((base as { AND: Prisma.PathwayLessonWhereInput[] }).AND)) {
    const b = base as { AND: Prisma.PathwayLessonWhereInput[] };
    return { AND: [...b.AND, ...clauses] };
  }
  return { AND: [base, ...clauses] };
}

/** Gate `/app/lessons/[id]` for a pathway_lessons row (subscriber or admin). */
export function appPathwayLessonVisibleToSubscriber(
  scope: AccessScope,
  row: Pick<
    { pathwayId: string; countryCode: CountryCode | null; tierCode: TierCode | null },
    "pathwayId" | "countryCode" | "tierCode"
  >,
  learnerPath: string | null | undefined,
): boolean {
  const pathway = getExamPathwayById(row.pathwayId);
  if (!pathway) return false;
  if (!canViewFullPathwayLesson(scope, pathway, learnerPath)) return false;

  if (scope.reason === "admin_override") {
    const country = scope.country as CountryCode | null;
    const tier = scope.tier as TierCode | null;
    if (row.countryCode && country && row.countryCode !== country) return false;
    if (row.tierCode && tier && !prismaTierCodesForProfileTier(tier).includes(row.tierCode)) return false;
    return true;
  }

  const country = scope.country as CountryCode | null;
  const tier = scope.tier as TierCode | null;
  if (!country || !tier) return false;
  if (row.countryCode && row.countryCode !== country) return false;
  if (row.tierCode && !prismaTierCodesForProfileTier(tier).includes(row.tierCode)) return false;
  return true;
}
