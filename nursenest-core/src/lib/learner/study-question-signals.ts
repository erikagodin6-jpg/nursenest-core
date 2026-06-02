import "server-only";

import { LearnerNoteScope } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { PracticeTestResultsJson } from "@/lib/practice-tests/types";

const MAX_MISSED_TESTS = 30;
const MAX_MISSED_IDS = 220;

export type MissedQuestionSignal = {
  missCount: number;
  lastMissedAtMs: number;
};

/**
 * Aggregates missed question ids from recent completed practice tests (bounded).
 * Tier/pathway isolation is enforced later when intersecting with the entitlement-scoped question pool.
 */
export async function loadMissedQuestionSignals(userId: string): Promise<Map<string, MissedQuestionSignal>> {
  const tests = await prisma.practiceTest.findMany({
    where: { userId, status: "COMPLETED" },
    orderBy: { completedAt: "desc" },
    take: MAX_MISSED_TESTS,
    select: { results: true, completedAt: true },
  });

  const map = new Map<string, MissedQuestionSignal>();
  for (const test of tests) {
    const ts = test.completedAt?.getTime() ?? Date.now();
    const incorrectIds = (test.results as PracticeTestResultsJson | null)?.incorrectQuestionIds ?? [];
    for (const qId of incorrectIds) {
      if (typeof qId !== "string" || qId.length < 4) continue;
      const cur = map.get(qId);
      if (!cur) {
        map.set(qId, { missCount: 1, lastMissedAtMs: ts });
      } else {
        cur.missCount += 1;
        cur.lastMissedAtMs = Math.max(cur.lastMissedAtMs, ts);
      }
    }
  }

  const sorted = [...map.entries()]
    .sort((a, b) => b[1].missCount - a[1].missCount || b[1].lastMissedAtMs - a[1].lastMissedAtMs)
    .slice(0, MAX_MISSED_IDS);
  return new Map(sorted);
}

/** Ids for `IN (...)` filters on {@link prisma.examQuestion} (bounded). */
export async function loadMissedQuestionIdsForPoolFilter(userId: string, cap = 200): Promise<string[]> {
  const m = await loadMissedQuestionSignals(userId);
  return [...m.keys()].slice(0, cap);
}

const SAVED_RATIONALE_PREFIX = "rationale:";

/**
 * Question ids the learner flagged via "Save this rationale" (LearnerNote scope QUESTION_BANK).
 * Used for adaptive practice "Starred / saved for review" prioritization with soft fallback.
 */
export async function loadSavedRationaleQuestionIdsForPoolFilter(userId: string, cap = 200): Promise<string[]> {
  const rows = await prisma.learnerNote.findMany({
    where: {
      userId,
      scope: LearnerNoteScope.QUESTION_BANK,
      contextId: { startsWith: SAVED_RATIONALE_PREFIX },
    },
    select: { contextId: true },
    orderBy: { updatedAt: "desc" },
    take: cap + 40,
  });
  const out: string[] = [];
  const seen = new Set<string>();
  for (const r of rows) {
    const id = r.contextId.slice(SAVED_RATIONALE_PREFIX.length).trim();
    if (id.length < 4 || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
    if (out.length >= cap) break;
  }
  return out;
}
