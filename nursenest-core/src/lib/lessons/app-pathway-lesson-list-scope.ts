import type { Prisma } from "@prisma/client";
import { ContentStatus, type CountryCode, type TierCode } from "@prisma/client";
import { prismaTierCodesForProfileTier } from "@/lib/entitlements/accessible-tiers";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { canViewFullPathwayLesson } from "@/lib/lessons/pathway-lesson-access";

/** Pathway IDs the learner may see in `/app/lessons` (tier, country, NP specialty). */
export async function visiblePathwayIdsForAppLessons(
  scope: AccessScope,
  learnerPath: string | null | undefined,
): Promise<string[]> {
  const compatible = await listPathwaysCompatibleWithSubscription(scope);
  return compatible.filter((p) => canViewFullPathwayLesson(scope, p, learnerPath)).map((p) => p.id);
}

/**
 * Prisma filter for published pathway lessons shown when `content_items` lessons are empty.
 * Aligns with pathway hub entitlement + optional row-level country/tier overrides.
 */
export async function pathwayLessonsAppListWhere(
  scope: AccessScope,
  learnerPath: string | null | undefined,
): Promise<Prisma.PathwayLessonWhereInput> {
  const pathwayIds = await visiblePathwayIdsForAppLessons(scope, learnerPath);
  if (pathwayIds.length === 0) {
    return { id: { in: [] } };
  }

  const base: Prisma.PathwayLessonWhereInput[] = [
    { status: ContentStatus.PUBLISHED },
    { pathwayId: { in: pathwayIds } },
    { locale: "en" },
  ];

  if (accessScopeIsStaffLearnerEntitlementBypass(scope)) {
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
export async function pathwayLessonsAppListWhereWithTopicFilter(
  scope: AccessScope,
  learnerPath: string | null | undefined,
  filter: { topic?: string | null; topicSlug?: string | null; pathwayId?: string | null },
): Promise<Prisma.PathwayLessonWhereInput> {
  const base = await pathwayLessonsAppListWhere(scope, learnerPath);
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
export async function appPathwayLessonVisibleToSubscriber(
  scope: AccessScope,
  row: Pick<
    { pathwayId: string; countryCode: CountryCode | null; tierCode: TierCode | null; status?: ContentStatus | null },
    "pathwayId" | "countryCode" | "tierCode" | "status"
  >,
  learnerPath: string | null | undefined,
): Promise<boolean> {
  if (row.status && row.status !== ContentStatus.PUBLISHED) return false;
  const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-product-registry");
  const pathway = getExamPathwayById(row.pathwayId);
  if (!pathway) return false;

  if (accessScopeIsStaffLearnerEntitlementBypass(scope)) {
    return canViewFullPathwayLesson(scope, pathway, learnerPath);
  }

  if (!canViewFullPathwayLesson(scope, pathway, learnerPath)) return false;

  const country = scope.country as CountryCode | null;
  const tier = scope.tier as TierCode | null;
  if (!country || !tier) return false;
  if (row.countryCode && row.countryCode !== country) return false;
  if (row.tierCode && !prismaTierCodesForProfileTier(tier).includes(row.tierCode)) return false;
  return true;
}
