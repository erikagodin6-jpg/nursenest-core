import type { Prisma } from "@prisma/client";
import { ContentStatus, type CountryCode, type TierCode } from "@prisma/client";
import { prismaTierCodesForProfileTier } from "@/lib/entitlements/accessible-tiers";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { canViewFullPathwayLesson } from "@/lib/lessons/pathway-lesson-access";

/** Pathway IDs the learner may see in `/app/lessons` by tier, country, and specialty. */
export async function visiblePathwayIdsForAppLessons(
  scope: AccessScope,
  learnerPath: string | null | undefined,
): Promise<string[]> {
  const compatiblePathways = await listPathwaysCompatibleWithSubscription(scope);

  return compatiblePathways
    .filter((pathway) => canViewFullPathwayLesson(scope, pathway, learnerPath))
    .map((pathway) => pathway.id);
}

/**
 * Prisma filter for published pathway lessons shown in `/app/lessons`.
 * This is visibility/access filtering only. It does not categorize lessons.
 */
export async function pathwayLessonsAppListWhere(
  scope: AccessScope,
  learnerPath: string | null | undefined,
): Promise<Prisma.PathwayLessonWhereInput> {
  const pathwayIds = await visiblePathwayIdsForAppLessons(scope, learnerPath);

  if (pathwayIds.length === 0) {
    return emptyWhere();
  }

  const clauses: Prisma.PathwayLessonWhereInput[] = [
    { status: ContentStatus.PUBLISHED },
    { pathwayId: { in: pathwayIds } },
    { locale: "en" },
  ];

  if (!accessScopeIsStaffLearnerEntitlementBypass(scope)) {
    const country = scope.country as CountryCode | null;
    const tier = scope.tier as TierCode | null;

    if (!country || !tier) {
      return emptyWhere();
    }

    clauses.push({ OR: [{ countryCode: null }, { countryCode: country }] });
    clauses.push({
      OR: [{ tierCode: null }, { tierCode: { in: prismaTierCodesForProfileTier(tier) } }],
    });
  }

  return andWhere(clauses);
}

/**
 * Narrows pathway lessons by catalog topic, topicSlug, or pathwayId.
 * Used by weak-area and post-test links.
 */
export async function pathwayLessonsAppListWhereWithTopicFilter(
  scope: AccessScope,
  learnerPath: string | null | undefined,
  filter: { topic?: string | null; topicSlug?: string | null; pathwayId?: string | null },
): Promise<Prisma.PathwayLessonWhereInput> {
  const base = await pathwayLessonsAppListWhere(scope, learnerPath);

  const topicSlug = normalizeSlug(filter.topicSlug);
  const topic = normalizeText(filter.topic);
  const pathwayId = normalizeText(filter.pathwayId);

  const extraClauses: Prisma.PathwayLessonWhereInput[] = [];

  if (topicSlug) {
    extraClauses.push({ topicSlug });
  } else if (topic) {
    extraClauses.push({ topic: { equals: topic, mode: "insensitive" } });
  }

  if (pathwayId) {
    extraClauses.push({ pathwayId });
  }

  if (extraClauses.length === 0) {
    return base;
  }

  return mergeAndWhere(base, extraClauses);
}

/** Gate `/app/lessons/[id]` for a pathway_lessons row. */
export async function appPathwayLessonVisibleToSubscriber(
  scope: AccessScope,
  row: Pick<
    {
      pathwayId: string;
      countryCode: CountryCode | null;
      tierCode: TierCode | null;
      status?: ContentStatus | null;
    },
    "pathwayId" | "countryCode" | "tierCode" | "status"
  >,
  learnerPath: string | null | undefined,
): Promise<boolean> {
  if (row.status && row.status !== ContentStatus.PUBLISHED) {
    return false;
  }

  const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-product-registry");
  const pathway = getExamPathwayById(row.pathwayId);

  if (!pathway) {
    return false;
  }

  if (!canViewFullPathwayLesson(scope, pathway, learnerPath)) {
    return false;
  }

  if (accessScopeIsStaffLearnerEntitlementBypass(scope)) {
    return true;
  }

  const country = scope.country as CountryCode | null;
  const tier = scope.tier as TierCode | null;

  if (!country || !tier) {
    return false;
  }

  if (row.countryCode && row.countryCode !== country) {
    return false;
  }

  if (row.tierCode && !prismaTierCodesForProfileTier(tier).includes(row.tierCode)) {
    return false;
  }

  return true;
}

function emptyWhere(): Prisma.PathwayLessonWhereInput {
  return { id: { in: [] } };
}

function andWhere(clauses: Prisma.PathwayLessonWhereInput[]): Prisma.PathwayLessonWhereInput {
  return { AND: clauses };
}

function mergeAndWhere(
  base: Prisma.PathwayLessonWhereInput,
  extraClauses: Prisma.PathwayLessonWhereInput[],
): Prisma.PathwayLessonWhereInput {
  const existingAnd = Array.isArray((base as { AND?: Prisma.PathwayLessonWhereInput[] }).AND)
    ? (base as { AND: Prisma.PathwayLessonWhereInput[] }).AND
    : [base];

  return { AND: [...existingAnd, ...extraClauses] };
}

function normalizeSlug(value: string | null | undefined): string | null {
  const normalized = value?.trim().toLowerCase();
  return normalized ? normalized : null;
}

function normalizeText(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}