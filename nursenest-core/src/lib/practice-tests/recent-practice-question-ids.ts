import { prisma } from "@/lib/db";
import type { PracticeTestConfigJson } from "@/lib/practice-tests/types";
import {
  STUDY_DIVERSITY_PRACTICE_RECENT_MAX_IDS,
  STUDY_DIVERSITY_PRACTICE_RECENT_MIN_REMAINING_DEFAULT,
  STUDY_DIVERSITY_PRACTICE_RECENT_SESSION_LOOKBACK_DEFAULT,
} from "@/lib/study/study-diversity-config";

function asIdList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string" && x.length > 4);
}

function pathwayIdFromConfigJson(config: unknown): string | null {
  if (!config || typeof config !== "object" || Array.isArray(config)) return null;
  const pid = (config as PracticeTestConfigJson).pathwayId;
  return typeof pid === "string" && pid.trim().length > 0 ? pid.trim() : null;
}

/**
 * Collect question ids from recent practice/CAT sessions for the same pathway so new sessions
 * can bias away from immediate repeats (graceful degrade when the pool is small).
 */
export async function recentPracticeQuestionIdsForPathway(params: {
  userId: string;
  pathwayId: string | null;
  /** How many prior sessions (same pathway) to scan */
  sessionLookback?: number;
  /** Cap on ids returned (most recent first across sessions) */
  maxIds?: number;
}): Promise<{ ids: Set<string>; sessionsScanned: number }> {
  const { userId, pathwayId } = params;
  const sessionLookback = params.sessionLookback ?? STUDY_DIVERSITY_PRACTICE_RECENT_SESSION_LOOKBACK_DEFAULT;
  const maxIds = params.maxIds ?? STUDY_DIVERSITY_PRACTICE_RECENT_MAX_IDS;
  if (!pathwayId) return { ids: new Set(), sessionsScanned: 0 };

  const rows = await prisma.practiceTest.findMany({
    where: { userId },
    orderBy: { startedAt: "desc" },
    take: Math.min(80, sessionLookback * 6),
    select: { config: true, questionIds: true },
  });

  const out: string[] = [];
  let sessionsScanned = 0;
  for (const r of rows) {
    if (pathwayIdFromConfigJson(r.config) !== pathwayId) continue;
    sessionsScanned += 1;
    if (sessionsScanned > sessionLookback) break;
    out.push(...asIdList(r.questionIds));
  }

  const uniq: string[] = [];
  const seen = new Set<string>();
  for (const id of out) {
    if (seen.has(id)) continue;
    seen.add(id);
    uniq.push(id);
    if (uniq.length >= maxIds) break;
  }
  return { ids: new Set(uniq), sessionsScanned };
}

/** Narrow the pool by excluding recent ids when enough items remain; otherwise keep the full pool. */
export function filterPoolRemovingRecentQuestions<T extends { id: string }>(
  pool: T[],
  recent: Set<string>,
  minRemaining = STUDY_DIVERSITY_PRACTICE_RECENT_MIN_REMAINING_DEFAULT,
): { pool: T[]; applied: boolean; skipReason?: string } {
  if (recent.size === 0) return { pool, applied: false };
  const filtered = pool.filter((p) => !recent.has(p.id));
  if (filtered.length >= minRemaining) return { pool: filtered, applied: true };
  return { pool, applied: false, skipReason: "pool_too_small_after_recent_exclusion" };
}
