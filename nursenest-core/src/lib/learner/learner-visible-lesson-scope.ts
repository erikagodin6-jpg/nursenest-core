import { Prisma } from "@prisma/client";
import type { CountryCode, TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { contentItemTiersForUserTier, lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { syntheticPathwayLessonId } from "@/lib/lessons/pathway-lesson-progress";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Minimal row shape for synthetic pathway lesson ids (matches {@link PathwayLessonDashboardRow} picks). */
export type PathwayLessonKeyRow = { pathwayId: string; slug: string };

/** Max `content_items` ids to hold in memory for `lessonId IN (...)` — beyond this, use JOIN-based counts. */
export const CONTENT_LESSON_ID_SCOPE_CAP = 8_000;

const PROGRESS_IN_CHUNK = 450;

function chunkIds(ids: string[]): string[][] {
  const out: string[][] = [];
  for (let i = 0; i < ids.length; i += PROGRESS_IN_CHUNK) {
    out.push(ids.slice(i, i + PROGRESS_IN_CHUNK));
  }
  return out;
}

/**
 * Pathway synthetic ids from the same capped catalog list used by {@link loadPathwayLessonProgressBundle}
 * (aligns progress lookups with visible inventory).
 */
export function pathwaySyntheticIdsFromRows(rows: PathwayLessonKeyRow[]): string[] {
  return rows.map((r) => syntheticPathwayLessonId(r.pathwayId, r.slug));
}

/**
 * Content lesson ids in entitlement scope (minimal select). When the pool exceeds {@link CONTENT_LESSON_ID_SCOPE_CAP},
 * returns only the cap (sorted by id) and `truncated: true` for callers that must switch to JOIN counts.
 */
export async function loadContentLessonIdsScoped(
  entitlement: AccessScope,
): Promise<{ ids: string[]; totalInScope: number; truncated: boolean }> {
  const lessonWhere = lessonAccessWhere(entitlement);
  const totalInScope = await prisma.contentItem.count({ where: lessonWhere }).catch(() => 0);
  if (totalInScope === 0) {
    return { ids: [], totalInScope: 0, truncated: false };
  }
  const truncated = totalInScope > CONTENT_LESSON_ID_SCOPE_CAP;
  const rows = await prisma.contentItem.findMany({
    where: lessonWhere,
    select: { id: true },
    orderBy: { id: "asc" },
    take: CONTENT_LESSON_ID_SCOPE_CAP,
  });
  return { ids: rows.map((r) => r.id), totalInScope, truncated };
}

/** Sum `Progress` rows with `completed=true` and `lessonId` in the given set (chunked `IN`). */
export async function countProgressCompletedForLessonIds(userId: string, lessonIds: string[]): Promise<number> {
  if (!lessonIds.length) return 0;
  let total = 0;
  for (const chunk of chunkIds(lessonIds)) {
    total += await prisma.progress.count({
      where: { userId, completed: true, lessonId: { in: chunk } },
    });
  }
  return total;
}

/** Sum in-progress (`completed=false`) rows scoped to lesson ids. */
export async function countProgressInProgressForLessonIds(userId: string, lessonIds: string[]): Promise<number> {
  if (!lessonIds.length) return 0;
  let total = 0;
  for (const chunk of chunkIds(lessonIds)) {
    total += await prisma.progress.count({
      where: { userId, completed: false, lessonId: { in: chunk } },
    });
  }
  return total;
}

/**
 * Latest incomplete row among scoped lesson ids (replaces unbounded `findFirst` on all user progress).
 * Chunked so huge `IN` lists do not blow statement size.
 */
export async function findLatestIncompleteProgressLessonId(
  userId: string,
  lessonIds: string[],
): Promise<{ lessonId: string } | null> {
  if (!lessonIds.length) return null;
  let best: { lessonId: string; updatedAt: Date } | null = null;
  for (const chunk of chunkIds(lessonIds)) {
    const row = await prisma.progress.findFirst({
      where: { userId, completed: false, lessonId: { in: chunk } },
      orderBy: { updatedAt: "desc" },
      select: { lessonId: true, updatedAt: true },
    });
    if (!row) continue;
    if (!best || row.updatedAt > best.updatedAt) {
      best = { lessonId: row.lessonId, updatedAt: row.updatedAt };
    }
  }
  return best ? { lessonId: best.lessonId } : null;
}

/**
 * When the content pool is larger than {@link CONTENT_LESSON_ID_SCOPE_CAP}, count completed content progress
 * via JOIN (keeps semantics aligned with {@link lessonAccessWhere} for standard subscribers).
 */
async function countContentCompletedViaJoin(userId: string, entitlement: AccessScope): Promise<number | null> {
  if (!entitlement.hasAccess || accessScopeIsStaffLearnerEntitlementBypass(entitlement)) {
    return null;
  }
  const country = entitlement.country as CountryCode | null;
  const tier = entitlement.tier as TierCode | null;
  if (!country || !tier) return null;

  const regionAlt = country === "CA" ? "CA_ONLY" : "US_ONLY";
  const tiers = contentItemTiersForUserTier(tier);

  try {
    const rows = await prisma.$queryRaw<[{ c: bigint }]>(Prisma.sql`
      SELECT COUNT(*)::bigint AS c
      FROM "Progress" p
      INNER JOIN "content_items" c ON c.id = p."lessonId"
      WHERE p."userId" = ${userId}
        AND p."completed" = true
        AND c.type = 'lesson'
        AND c.status IN ('published', 'PUBLISHED')
        AND c.region_scope IN ('BOTH', ${regionAlt})
        AND (c.tier IS NULL OR c.tier IN (${Prisma.join(tiers)}))
    `);
    return Number(rows[0]?.c ?? 0);
  } catch {
    return null;
  }
}

export type VisibleLessonScope = {
  lessonIds: string[];
  contentTruncated: boolean;
};

/**
 * Union of content lesson ids (tier/region scoped) + synthetic pathway ids from the capped pathway catalog list.
 */
export async function buildVisibleLessonScopeForLearner(
  entitlement: AccessScope,
  pathwayRows: PathwayLessonKeyRow[],
): Promise<VisibleLessonScope> {
  const pathwayIds = pathwaySyntheticIdsFromRows(pathwayRows);
  const { ids: contentIds, totalInScope, truncated } = await loadContentLessonIdsScoped(entitlement);

  if (truncated) {
    safeServerLog("learner_catalog_timing", "content_lesson_scope_truncated", {
      totalInScope,
      cap: CONTENT_LESSON_ID_SCOPE_CAP,
    });
  }

  const lessonIds = [...contentIds, ...pathwayIds];
  return { lessonIds, contentTruncated: truncated };
}

/**
 * Completed lesson rows in tier/region scope: chunked `IN` when the content pool fits in memory; otherwise
 * JOIN for content + chunked `IN` for pathway synthetics only.
 */
export async function countScopedLessonsCompleted(
  userId: string,
  entitlement: AccessScope,
  scope: VisibleLessonScope,
  pathwayRows: PathwayLessonKeyRow[],
): Promise<number> {
  const pathwayIds = pathwaySyntheticIdsFromRows(pathwayRows);

  if (!scope.contentTruncated) {
    return countProgressCompletedForLessonIds(userId, scope.lessonIds);
  }

  const contentTotal = await countContentCompletedViaJoin(userId, entitlement);
  const pathwayTotal =
    pathwayIds.length > 0 ? await countProgressCompletedForLessonIds(userId, pathwayIds) : 0;

  if (contentTotal != null) {
    return contentTotal + pathwayTotal;
  }

  safeServerLog("learner_catalog_timing", "scoped_content_join_failed_fallback", {
    userIdPrefix: userId.slice(0, 8),
  });
  return countProgressCompletedForLessonIds(userId, scope.lessonIds);
}
