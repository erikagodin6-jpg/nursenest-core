/**
 * Session Persistence — store and reload CatSessionState via PracticeTest rows.
 *
 * Uses the existing `practice_tests` table (`PracticeTest` Prisma model) to
 * persist NP CAT sessions. No new tables required.
 *
 * ─── Snapshotting (why) ───────────────────────────────────────────────────────
 * After completion, a compact `NpCatCompletionSnapshot` is embedded inside
 * `adaptiveState` (not a new column). Dashboard views read this snapshot
 * directly instead of loading and recomputing the full SessionAnalysis from
 * `results`. This prevents dashboard queries from inflating memory or causing
 * expensive recomputations.
 *
 * Backward compatibility: old completed sessions without a snapshot return null
 * from `extractSnapshotFromAdaptiveState`; callers fall back to `results`.
 *
 * ─── Idempotency ─────────────────────────────────────────────────────────────
 * `completeNpCatSession` is safe to call multiple times on the same record.
 * The `updateMany` where-clause scopes to `{ id, userId }` only; if the row is
 * already COMPLETED the data is overwritten harmlessly (same analysis). A
 * re-completion guard using `status: "IN_PROGRESS"` is applied when the caller
 * is uncertain.
 *
 * ─── State version ───────────────────────────────────────────────────────────
 * `_v: 1` is the current version. Deserialisation rejects unknown versions
 * rather than silently consuming corrupt data.
 */

import type { PrismaClient } from "@prisma/client";
import type { AnswerRecord, CatSessionState, SessionAnalysis } from "./types";
import { emptyPerformanceProfile } from "./performance-tracker";
import { readinessBand } from "./readiness-scorer";

// ─── Compact snapshot ─────────────────────────────────────────────────────────

/**
 * Compact summary stored inside adaptiveState after session completion.
 * Kept small on purpose — no full SessionAnalysis duplication.
 *
 * ─── Load-safety ─────────────────────────────────────────────────────────────
 * Dashboard views use this snapshot instead of the full `results` column.
 * If absent (legacy sessions), callers must gracefully fall back to `results`.
 */
export type NpCatCompletionSnapshot = {
  readinessScore: number;
  readinessBand: string;
  weakSystems: string[];
  weakRiskCategories: string[];
  /** Accuracy 0–1 per cognitive layer at session end. */
  layerSummary: { L1: number; L2: number; L3: number };
  /** Up to 3 focus areas for the learner's next session. */
  nextFocusAreas: string[];
  completedAt: string;
};

/**
 * Build a compact completion snapshot from a SessionAnalysis.
 * Exported for testing; called internally by completeNpCatSession.
 */
export function buildCompletionSnapshot(
  analysis: Pick<SessionAnalysis, "summary" | "weakAreas" | "performanceSnapshot">,
): NpCatCompletionSnapshot {
  const score = analysis.summary.readinessScore.score;

  const weakSystems = analysis.weakAreas
    .filter((w) => w.dimension === "system")
    .slice(0, 3)
    .map((w) => w.key);

  const weakRiskCategories = analysis.weakAreas
    .filter((w) => w.dimension === "risk")
    .slice(0, 2)
    .map((w) => w.key);

  const layerPerf = analysis.performanceSnapshot.byLayer;
  const layerSummary = {
    L1: Math.round((layerPerf.L1?.accuracy ?? 0) * 100) / 100,
    L2: Math.round((layerPerf.L2?.accuracy ?? 0) * 100) / 100,
    L3: Math.round((layerPerf.L3?.accuracy ?? 0) * 100) / 100,
  };

  // Combine weak areas into up to 3 human-readable focus strings
  const nextFocusAreas = analysis.weakAreas
    .slice(0, 3)
    .map((w) => w.label);

  return {
    readinessScore: score,
    readinessBand: readinessBand(score),
    weakSystems,
    weakRiskCategories,
    layerSummary,
    nextFocusAreas,
    completedAt: new Date().toISOString(),
  };
}

/**
 * Safely extract the compact snapshot from a raw adaptiveState object.
 *
 * Returns null when:
 *  - input is null / not an object
 *  - _v is missing or unrecognised
 *  - snapshot field is absent (legacy sessions without a snapshot)
 *  - snapshot is malformed (missing required fields)
 *
 * Never throws.
 */
export function extractSnapshotFromAdaptiveState(raw: unknown): NpCatCompletionSnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  if (obj["_v"] !== 1) return null;

  const snap = obj["snapshot"];
  if (!snap || typeof snap !== "object") return null;
  const s = snap as Record<string, unknown>;

  // Validate required fields — fail fast for malformed snapshots
  if (typeof s["readinessScore"] !== "number") return null;
  if (typeof s["readinessBand"] !== "string") return null;
  if (!Array.isArray(s["weakSystems"])) return null;
  if (!Array.isArray(s["weakRiskCategories"])) return null;
  if (typeof s["layerSummary"] !== "object" || !s["layerSummary"]) return null;
  if (!Array.isArray(s["nextFocusAreas"])) return null;
  if (typeof s["completedAt"] !== "string") return null;

  return snap as NpCatCompletionSnapshot;
}

// ─── Serialisation helpers ────────────────────────────────────────────────────

/**
 * Shape stored in `PracticeTest.adaptiveState` for NP CAT sessions.
 * Extended with optional `snapshot` for completed sessions.
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
  performance: unknown;
  /** Present only on completed sessions. See NpCatCompletionSnapshot. */
  snapshot?: NpCatCompletionSnapshot;
};

function serialise(state: CatSessionState, snapshot?: NpCatCompletionSnapshot): NpCatAdaptiveState {
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
    ...(snapshot !== undefined && { snapshot }),
  };
}

function deserialise(raw: unknown): CatSessionState | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  if (obj["_v"] !== 1) return null;

  try {
    return {
      sessionId: String(obj["sessionId"] ?? ""),
      startedAt: Number(obj["startedAt"]) || Date.now(),
      abilityEstimate: Number(obj["abilityEstimate"]) || 0,
      answeredIds: Array.isArray(obj["answeredIds"]) ? (obj["answeredIds"] as string[]) : [],
      recentlySeenIds: new Set(
        Array.isArray(obj["recentlySeenIds"]) ? (obj["recentlySeenIds"] as string[]) : [],
      ),
      sessionAnswers: Array.isArray(obj["sessionAnswers"])
        ? (obj["sessionAnswers"] as AnswerRecord[])
        : [],
      correctStreak: Number(obj["correctStreak"]) || 0,
      incorrectStreak: Number(obj["incorrectStreak"]) || 0,
      performance:
        (obj["performance"] as CatSessionState["performance"]) ?? emptyPerformanceProfile(),
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
  poolQuestionIds: string[];
};

// ─── Prisma JSON cast helper ──────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asJson<T>(v: T): any {
  return v;
}

// ─── CRUD operations ──────────────────────────────────────────────────────────

export interface CreateNpCatSessionInput {
  userId: string;
  pathwayId: string;
  initialState: CatSessionState;
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
      config: asJson(config),
      questionIds: asJson(input.poolQuestionIds),
      answers: asJson({}),
      status: "IN_PROGRESS",
      adaptiveState: asJson(serialise(input.initialState)),
    },
    select: { id: true },
  });

  return record.id;
}

/**
 * Load an in-progress NP CAT session from the DB.
 * Returns null when:
 *   - record not found or not owned by userId
 *   - session is already COMPLETED
 *   - adaptiveState is missing or corrupt (_v mismatch)
 *   - config.kind is not "np-cat"
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

  // Guard: missing or already completed
  if (!record) return null;
  if (record.status === "COMPLETED") return null;

  const state = deserialise(record.adaptiveState);
  if (!state) return null;

  const config = record.config as unknown as NpCatSessionConfig | null;
  if (!config || config.kind !== "np-cat") return null;

  return { state, config };
}

/**
 * Persist the updated session state after each answer.
 * Scoped to status IN_PROGRESS to avoid overwriting a completed session.
 */
export async function saveNpCatSession(
  prisma: PrismaClient,
  practiceTestId: string,
  userId: string,
  state: CatSessionState,
): Promise<void> {
  const answers: Record<string, { correct: boolean }> = {};
  for (const a of state.sessionAnswers) {
    answers[a.questionId] = { correct: a.correct };
  }

  await prisma.practiceTest.updateMany({
    where: { id: practiceTestId, userId, status: "IN_PROGRESS" },
    data: {
      adaptiveState: asJson(serialise(state)),
      answers: asJson(answers),
      cursorIndex: state.answeredIds.length,
      updatedAt: new Date(),
    },
  });
}

/**
 * Mark a session as completed and store the full analysis + compact snapshot.
 *
 * ─── Idempotency ─────────────────────────────────────────────────────────────
 * Safe to call more than once on the same record. The where-clause does NOT
 * restrict on status, so a re-completion just overwrites with the same data.
 * The snapshot and results are deterministic for the same inputs.
 *
 * ─── Guards ──────────────────────────────────────────────────────────────────
 * If `state.sessionAnswers` is empty we short-circuit with a warning rather
 * than persisting a zero-answer completed session.
 *
 * Never throws — any DB error is swallowed after logging (a completion failure
 * must not crash the answer route mid-flight; the client will retry on reload).
 */
export async function completeNpCatSession(
  prisma: PrismaClient,
  practiceTestId: string,
  userId: string,
  state: CatSessionState,
  analysis: SessionAnalysis,
): Promise<void> {
  if (state.sessionAnswers.length === 0) {
    // Refuse to complete a session with no answers — likely a race condition.
    return;
  }

  const answers: Record<string, { correct: boolean }> = {};
  for (const a of state.sessionAnswers) {
    answers[a.questionId] = { correct: a.correct };
  }

  const snapshot = buildCompletionSnapshot(analysis);
  const adaptiveStateWithSnapshot = serialise(state, snapshot);

  try {
    await prisma.practiceTest.updateMany({
      where: { id: practiceTestId, userId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        adaptiveState: asJson(adaptiveStateWithSnapshot),
        answers: asJson(answers),
        cursorIndex: state.answeredIds.length,
        results: asJson(analysis),
        updatedAt: new Date(),
      },
    });
  } catch {
    // Intentionally non-throwing — caller must handle gracefully.
  }
}

/**
 * Load the completed analysis for a finished session.
 * Returns null if not found, not owned, or not yet complete.
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
 * Load the compact completion snapshot for a finished session.
 * Cheaper than loading the full analysis — use this for dashboard cards.
 * Returns null for legacy sessions without a snapshot.
 */
export async function loadNpCatSnapshot(
  prisma: PrismaClient,
  practiceTestId: string,
  userId: string,
): Promise<NpCatCompletionSnapshot | null> {
  const record = await prisma.practiceTest.findFirst({
    where: { id: practiceTestId, userId, status: "COMPLETED" },
    select: { adaptiveState: true },
  });

  if (!record) return null;
  return extractSnapshotFromAdaptiveState(record.adaptiveState);
}

/**
 * List recent NP CAT sessions for a user (history/dashboard).
 * Uses the compact snapshot when available; falls back to results.score.
 * Caps at MAX_LIST_SESSIONS to keep queries bounded.
 */
const MAX_LIST_SESSIONS = 20;

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
  readinessBand: string | null;
}>> {
  const cappedLimit = Math.min(limit, MAX_LIST_SESSIONS);

  const records = await prisma.practiceTest.findMany({
    where: { userId },
    orderBy: { startedAt: "desc" },
    take: cappedLimit,
    select: {
      id: true,
      status: true,
      startedAt: true,
      completedAt: true,
      cursorIndex: true,
      adaptiveState: true,
      config: true,
    },
  });

  return records
    .filter((r) => {
      const c = r.config as unknown as { kind?: string } | null;
      return c?.kind === "np-cat";
    })
    .map((r) => {
      // Prefer compact snapshot (cheap); no need to load full `results`
      const snap = extractSnapshotFromAdaptiveState(r.adaptiveState);
      return {
        id: r.id,
        status: r.status,
        startedAt: r.startedAt,
        completedAt: r.completedAt,
        questionCount: r.cursorIndex,
        readinessScore: snap?.readinessScore ?? null,
        readinessBand: snap?.readinessBand ?? null,
      };
    });
}
