import { prisma } from "@/lib/db";
import type { PracticeTestConfigJson } from "@/lib/practice-tests/types";
import {
  STUDY_DIVERSITY_PRACTICE_RECENT_MAX_IDS,
  STUDY_DIVERSITY_PRACTICE_RECENT_SESSION_LOOKBACK_DEFAULT,
} from "@/lib/study/study-diversity-config";

export { filterPoolRemovingRecentQuestions } from "@/lib/practice-tests/recent-practice-question-ids-filter";

function asIdList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string" && x.length > 4);
}

export function pathwayIdFromConfigJson(config: unknown): string | null {
  if (!config || typeof config !== "object" || Array.isArray(config)) return null;
  const pid = (config as PracticeTestConfigJson).pathwayId;
  return typeof pid === "string" && pid.trim().length > 0 ? pid.trim() : null;
}

/**
 * Whether a stored session row should be included when scanning for recent question IDs.
 * - When targetPathwayId is a non-empty string: include only sessions matching that pathway.
 * - When targetPathwayId is null: include all sessions (pathway-agnostic diversity).
 */
export function sessionMatchesPathwayFilter(config: unknown, targetPathwayId: string | null): boolean {
  if (targetPathwayId === null) return true;
  return pathwayIdFromConfigJson(config) === targetPathwayId;
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

  const rows = await prisma.practiceTest.findMany({
    where: { userId },
    orderBy: { startedAt: "desc" },
    take: Math.min(80, sessionLookback * 6),
    select: { config: true, questionIds: true },
  });

  const out: string[] = [];
  let sessionsScanned = 0;
  for (const r of rows) {
    if (!sessionMatchesPathwayFilter(r.config, pathwayId)) continue;
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

/**
 * For each question id, the `startedAt` of the most recent practice/CAT session (same pathway)
 * whose `questionIds` included that id. Used to prefer less-recently exposed items in general study.
 */
export async function questionLastExposureStartedAtMsForPathway(params: {
  userId: string;
  pathwayId: string | null;
  sessionLookback?: number;
}): Promise<Map<string, number>> {
  const sessionLookback = params.sessionLookback ?? STUDY_DIVERSITY_PRACTICE_RECENT_SESSION_LOOKBACK_DEFAULT;
  const pathwayId = params.pathwayId?.trim() ?? null;

  const rows = await prisma.practiceTest.findMany({
    where: { userId: params.userId },
    orderBy: { startedAt: "desc" },
    take: Math.min(80, sessionLookback * 6),
    select: { config: true, questionIds: true, startedAt: true },
  });

  const out = new Map<string, number>();
  let sessionsScanned = 0;
  for (const r of rows) {
    if (pathwayId !== null && pathwayIdFromConfigJson(r.config) !== pathwayId) continue;
    sessionsScanned += 1;
    if (sessionsScanned > sessionLookback) break;
    const t = r.startedAt.getTime();
    for (const id of asIdList(r.questionIds)) {
      if (!out.has(id)) out.set(id, t);
    }
  }
  return out;
}
