/**
 * Session Persistence — store and reload CatSessionState via PracticeTest rows.
 *
 * Uses the existing `practice_tests` table (`PracticeTest` Prisma model) to
 * persist NP CAT sessions. The `adaptiveState` JSON column holds the serialised
 * CatSessionState; the `results` column holds the completed SessionAnalysis.
 *
 * Session lifecycle:
 *   createNpCatSession   → INSERT practice_tests row (status IN_PROGRESS)
 *   loadNpCatSession     → SELECT + deserialise state
 *   saveNpCatSession     → UPDATE adaptiveState after each answer
 *   completeNpCatSession → UPDATE status COMPLETED + results + readiness score
 *
 * IMPORTANT: `recentlySeenIds` is a Set — it requires special serialisation.
 * We store it as a JSON array and reconstruct on load.
 */

import type { PrismaClient } from "@prisma/client";
import type { AnswerRecord, CatSessionState, SessionAnalysis } from "./types";
import { emptyPerformanceProfile } from "./performance-tracker";

// ─── Serialisation helpers ────────────────────────────────────────────────────

/**
 * Shape stored in `PracticeTest.adaptiveState` for NP CAT sessions.
 * Versioned to allow future migrations.
 */
export type NpCatAdaptiveState = {
  _v: 1;
  sessionId: string;
  startedAt: number;
  abilityEstimate: number;
  answeredIds: string[];
  recentlySeenIds: string[];
  sessionAnswers: AnswerRecord[];
  correctStreak: number;
  incorrectStreak: number;
  /** Serialised PerformanceProfile — persisted between answers for fast re-load. */
  performance: unknown;
};

function serialise(state: CatSessionState): NpCatAdaptiveState {
  return {
    _v: 1,
    sessionId: state.sessionId,
    startedAt: state.startedAt,
    abilityEstimate: state.abilityEstimate,
    answeredIds: state.answeredIds,
    recentlySeenIds: [...state.recentlySeenIds],
    sessionAnswers: state.sessionAnswers,
    correctStreak: state.correctStreak,
    incorrectStreak: state.incorrectStreak,
    performance: state.performance,
  };
}

function deserialise(raw: unknown): CatSessionState | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  if (obj["_v"] !== 1) return null;

  try {
    return {
      sessionId: String(obj["sessionId"]),
      startedAt: Number(obj["startedAt"]),
      abilityEstimate: Number(obj["abilityEstimate"]) || 0,
      answeredIds: Array.isArray(obj["answeredIds"]) ? (obj["answeredIds"] as string[]) : [],
      recentlySeenIds: new Set(Array.isArray(obj["recentlySeenIds"]) ? (obj["recentlySeenIds"] as string[]) : []),
      sessionAnswers: Array.isArray(obj["sessionAnswers"]) ? (obj["sessionAnswers"] as AnswerRecord[]) : [],
      correctStreak: Number(obj["correctStreak"]) || 0,
      incorrectStreak: Number(obj["incorrectStreak"]) || 0,
      performance: (obj["performance"] as CatSessionState["performance"]) ?? emptyPerformanceProfile(),
    };
  } catch {
    return null;
  }
}

// ─── NP CAT session config stored in PracticeTest.config ─────────────────────

export type NpCatSessionConfig = {
  kind: "np-cat";
  pathwayId: string;
  maxQuestions: number;
  /** IDs of questions in the pool (stored for resume support). */
  poolQuestionIds: string[];
};

// ─── CRUD operations ──────────────────────────────────────────────────────────

export interface CreateNpCatSessionInput {
  userId: string;
  pathwayId: string;
  initialState: CatSessionState;
  /** IDs of all questions in the pool — needed for resume. */
  poolQuestionIds: string[];
  maxQuestions: number;
}

/**
 * Insert a new NP CAT session row into practice_tests.
 * Returns the Prisma `id` (cuid) of the created record.
 */
export async function createNpCatSession(
  prisma: PrismaClient,
  input: CreateNpCatSessionInput,
): Promise<string> {
  const config: NpCatSessionConfig = {
    kind: "np-cat",
    pathwayId: input.pathwayId,
    maxQuestions: input.maxQuestions,
    poolQuestionIds: input.poolQuestionIds,
  };

  const record = await prisma.practiceTest.create({
    data: {
      userId: input.userId,
      title: `NP CAT Session — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      config: config as unknown as Parameters<typeof prisma.practiceTest.create>[0]["data"]["config"],
      questionIds: input.poolQuestionIds as unknown as Parameters<typeof prisma.practiceTest.create>[0]["data"]["questionIds"],
      answers: {} as unknown as Parameters<typeof prisma.practiceTest.create>[0]["data"]["answers"],
      status: "IN_PROGRESS",
      adaptiveState: serialise(input.initialState) as unknown as Parameters<typeof prisma.practiceTest.create>[0]["data"]["adaptiveState"],
    },
    select: { id: true },
  });

  return record.id;
}

/**
 * Load a NP CAT session from the DB.
 * Returns null if the record is not found, not owned by the user, or state is corrupt.
 */
export async function loadNpCatSession(
  prisma: PrismaClient,
  practiceTestId: string,
  userId: string,
): Promise<{ state: CatSessionState; config: NpCatSessionConfig } | null> {
  const record = await prisma.practiceTest.findFirst({
    where: { id: practiceTestId, userId },
    select: { adaptiveState: true, config: true, status: true },
  });

  if (!record || record.status === "COMPLETED") return null;

  const state = deserialise(record.adaptiveState);
  if (!state) return null;

  const config = record.config as unknown as NpCatSessionConfig;
  if (config?.kind !== "np-cat") return null;

  return { state, config };
}

/**
 * Persist the updated session state after each answer.
 * Also updates `answers` (for UI progress display) and `cursorIndex`.
 */
export async function saveNpCatSession(
  prisma: PrismaClient,
  practiceTestId: string,
  userId: string,
  state: CatSessionState,
): Promise<void> {
  // Build a simple answers map for UI: questionId → { correct }
  const answers: Record<string, { correct: boolean }> = {};
  for (const a of state.sessionAnswers) {
    answers[a.questionId] = { correct: a.correct };
  }

  await prisma.practiceTest.updateMany({
    where: { id: practiceTestId, userId },
    data: {
      adaptiveState: serialise(state) as unknown as Parameters<typeof prisma.practiceTest.updateMany>[0]["data"]["adaptiveState"],
      answers: answers as unknown as Parameters<typeof prisma.practiceTest.updateMany>[0]["data"]["answers"],
      cursorIndex: state.answeredIds.length,
      updatedAt: new Date(),
    },
  });
}

/**
 * Mark a session as completed and store the full analysis results.
 * Once completed, `loadNpCatSession` will return null for this record.
 */
export async function completeNpCatSession(
  prisma: PrismaClient,
  practiceTestId: string,
  userId: string,
  state: CatSessionState,
  analysis: SessionAnalysis,
): Promise<void> {
  const answers: Record<string, { correct: boolean }> = {};
  for (const a of state.sessionAnswers) {
    answers[a.questionId] = { correct: a.correct };
  }

  await prisma.practiceTest.updateMany({
    where: { id: practiceTestId, userId },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
      adaptiveState: serialise(state) as unknown as Parameters<typeof prisma.practiceTest.updateMany>[0]["data"]["adaptiveState"],
      answers: answers as unknown as Parameters<typeof prisma.practiceTest.updateMany>[0]["data"]["answers"],
      cursorIndex: state.answeredIds.length,
      results: analysis as unknown as Parameters<typeof prisma.practiceTest.updateMany>[0]["data"]["results"],
      updatedAt: new Date(),
    },
  });
}

/**
 * Load the completed analysis for a finished session.
 * Returns null if the session is still in progress or not found.
 */
export async function loadNpCatAnalysis(
  prisma: PrismaClient,
  practiceTestId: string,
  userId: string,
): Promise<SessionAnalysis | null> {
  const record = await prisma.practiceTest.findFirst({
    where: { id: practiceTestId, userId, status: "COMPLETED" },
    select: { results: true },
  });

  if (!record?.results) return null;
  return record.results as unknown as SessionAnalysis;
}

/**
 * List recent NP CAT sessions for a user (for history/dashboard display).
 */
export async function listNpCatSessions(
  prisma: PrismaClient,
  userId: string,
  limit = 10,
): Promise<Array<{
  id: string;
  status: string;
  startedAt: Date;
  completedAt: Date | null;
  questionCount: number;
  readinessScore: number | null;
}>> {
  const records = await prisma.practiceTest.findMany({
    where: { userId },
    orderBy: { startedAt: "desc" },
    take: limit,
    select: {
      id: true,
      status: true,
      startedAt: true,
      completedAt: true,
      cursorIndex: true,
      results: true,
      config: true,
    },
  });

  return records
    .filter((r) => {
      const c = r.config as unknown as { kind?: string };
      return c?.kind === "np-cat";
    })
    .map((r) => {
      const results = r.results as unknown as SessionAnalysis | null;
      return {
        id: r.id,
        status: r.status,
        startedAt: r.startedAt,
        completedAt: r.completedAt,
        questionCount: r.cursorIndex,
        readinessScore: results?.summary?.readinessScore?.score ?? null,
      };
    });
}
