/**
 * Answer History — cross-session AnswerRecord store
 *
 * The readiness scorer and performance tracker need answer history across
 * multiple sessions to compute meaningful scores. This module reads completed
 * NP CAT sessions from `practice_tests` and reconstructs the full
 * `AnswerRecord[]` timeline for a user.
 *
 * Architecture decision: we read from completed `practice_tests` rows rather
 * than maintaining a separate `user_question_attempts` table. This avoids a
 * new migration, reuses existing session data, and keeps the system simple.
 * The `adaptiveState.sessionAnswers` field is the authoritative answer source.
 *
 * For users with many sessions, we cap history at the last N sessions to
 * keep DB load bounded. The recency weighting in readiness-scorer.ts means
 * that older sessions contribute little to the final score anyway.
 */

import type { PrismaClient } from "@prisma/client";
import type { AnswerRecord } from "./types";
import type { NpCatAdaptiveState } from "./session-persistence";

/** Maximum number of past sessions to load for history computation. */
const MAX_HISTORY_SESSIONS = 12;

/**
 * Load all AnswerRecords for a user from completed NP CAT sessions.
 *
 * Records are returned in chronological order (oldest first) so that
 * recency weighting in the scorer can discount older answers correctly.
 *
 * @param prisma - Prisma client instance.
 * @param userId - The user whose history to load.
 * @param sinceMs - Optional cutoff: only include answers after this timestamp (ms).
 *                  Defaults to 90 days ago to bound the load.
 */
export async function loadAnswerHistory(
  prisma: PrismaClient,
  userId: string,
  sinceMs?: number,
): Promise<AnswerRecord[]> {
  const cutoff = sinceMs ?? Date.now() - 90 * 24 * 60 * 60 * 1000;

  const recentSessions = await prisma.practiceTest.findMany({
    where: {
      userId,
      status: "COMPLETED",
      startedAt: { gte: new Date(cutoff) },
    },
    orderBy: { startedAt: "desc" },
    take: 12,
    select: { adaptiveState: true, startedAt: true },
  });
  const sessions = recentSessions.slice(0, MAX_HISTORY_SESSIONS);

  const allAnswers: AnswerRecord[] = [];

  for (const session of [...sessions].reverse()) {
    const state = session.adaptiveState as unknown as NpCatAdaptiveState | null;
    if (!state || state._v !== 1) continue;
    if (!Array.isArray(state.sessionAnswers)) continue;

    for (const record of state.sessionAnswers) {
      if (!isValidAnswerRecord(record)) continue;
      allAnswers.push(record);
    }
  }

  // We fetch the most recent bounded window, then restore chronological order
  // for downstream recency weighting.
  return allAnswers;
}

/**
 * Load AnswerRecords from a single session (for mid-session performance updates).
 * Returns an empty array if the session doesn't exist or isn't accessible.
 */
export async function loadSessionAnswers(
  prisma: PrismaClient,
  practiceTestId: string,
  userId: string,
): Promise<AnswerRecord[]> {
  const record = await prisma.practiceTest.findFirst({
    where: { id: practiceTestId, userId },
    select: { adaptiveState: true },
  });

  if (!record?.adaptiveState) return [];

  const state = record.adaptiveState as unknown as NpCatAdaptiveState | null;
  if (!state || state._v !== 1 || !Array.isArray(state.sessionAnswers)) return [];

  return state.sessionAnswers.filter(isValidAnswerRecord);
}

/**
 * Compute a summary of a user's NP CAT engagement — used for dashboard display
 * without loading full answer history.
 */
export async function loadNpCatEngagementSummary(
  prisma: PrismaClient,
  userId: string,
): Promise<{
  totalSessions: number;
  totalQuestionsAnswered: number;
  lastSessionAt: Date | null;
  lastReadinessScore: number | null;
}> {
  const recentSessions = await prisma.practiceTest.findMany({
    where: { userId, status: "COMPLETED" },
    orderBy: { completedAt: "desc" },
    take: 12,
    select: { completedAt: true, cursorIndex: true, results: true, config: true },
  });
  const sessions = recentSessions.slice(0, MAX_HISTORY_SESSIONS);

  const npSessions = sessions.filter((s) => {
    const c = s.config as unknown as { kind?: string };
    return c?.kind === "np-cat";
  });

  if (npSessions.length === 0) {
    return { totalSessions: 0, totalQuestionsAnswered: 0, lastSessionAt: null, lastReadinessScore: null };
  }

  const totalQuestionsAnswered = npSessions.reduce((sum, s) => sum + (s.cursorIndex ?? 0), 0);
  const lastSessionAt = npSessions[0]?.completedAt ?? null;

  // Readiness score from the most recent completed session
  const lastResults = npSessions[0]?.results as unknown as { summary?: { readinessScore?: { score?: number } } } | null;
  const lastReadinessScore = lastResults?.summary?.readinessScore?.score ?? null;

  return {
    totalSessions: npSessions.length,
    totalQuestionsAnswered,
    lastSessionAt,
    lastReadinessScore,
  };
}

/**
 * Merge historical answers with current session answers into a single timeline.
 * De-duplicates by questionId (keeps most recent attempt for each question).
 *
 * Used for readiness score computation: we want all answers, but don't double-count
 * questions that were repeated across sessions.
 */
export function mergeAnswerHistory(
  historical: AnswerRecord[],
  sessionAnswers: AnswerRecord[],
): AnswerRecord[] {
  // Build a map of questionId → most-recent record
  const byQuestion = new Map<string, AnswerRecord>();

  for (const a of [...historical, ...sessionAnswers]) {
    const existing = byQuestion.get(a.questionId);
    if (!existing || a.answeredAt > existing.answeredAt) {
      byQuestion.set(a.questionId, a);
    }
  }

  return [...byQuestion.values()].sort((a, b) => a.answeredAt - b.answeredAt);
}

/**
 * Get just the question IDs answered in recent sessions (for exclusion from new pools).
 * Uses a shorter lookback window than full history — prevents immediate repeats.
 */
export async function recentlyAnsweredIds(
  prisma: PrismaClient,
  userId: string,
  withinMs = 24 * 60 * 60 * 1000,
): Promise<Set<string>> {
  const cutoff = Date.now() - withinMs;

  const recentSessions = await prisma.practiceTest.findMany({
    where: {
      userId,
      startedAt: { gte: new Date(cutoff) },
    },
    orderBy: { startedAt: "desc" },
    take: 12,
    select: { adaptiveState: true },
  });
  const sessions = recentSessions.slice(0, 5);

  const ids = new Set<string>();

  for (const session of sessions) {
    const state = session.adaptiveState as unknown as NpCatAdaptiveState | null;
    if (!state || state._v !== 1) continue;
    for (const id of state.answeredIds ?? []) {
      ids.add(id);
    }
  }

  return ids;
}

// ─── Internal validation ──────────────────────────────────────────────────────

function isValidAnswerRecord(record: unknown): record is AnswerRecord {
  if (!record || typeof record !== "object") return false;
  const r = record as Record<string, unknown>;
  return (
    typeof r["questionId"] === "string" &&
    typeof r["topicSlug"] === "string" &&
    typeof r["systemTag"] === "string" &&
    (r["cognitiveLayer"] === "L1" || r["cognitiveLayer"] === "L2" || r["cognitiveLayer"] === "L3") &&
    (r["riskLevel"] === "low" || r["riskLevel"] === "moderate" || r["riskLevel"] === "high") &&
    typeof r["correct"] === "boolean" &&
    typeof r["answeredAt"] === "number"
  );
}
