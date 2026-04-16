/**
 * POST /api/cat/np/answer
 *
 * Submit an answer to the current question and receive the next one.
 *
 * Request body:
 *   {
 *     practiceTestId: string,
 *     questionId: string,
 *     answeredCorrectly: boolean,
 *     responseTimeMs?: number,
 *   }
 *
 * Response:
 *   {
 *     nextQuestion: SerializedCatQuestion | null,
 *     sessionComplete: boolean,
 *     terminationReason?: string,
 *     progress: { answered: number, correct: number, maxQuestions: number },
 *     selectionDiagnostics: object,
 *   }
 *
 * When `sessionComplete` is true and `nextQuestion` is null, the client
 * should call GET /api/cat/np/analysis?practiceTestId=... to get results.
 *
 * Auth: subscriber required (ownership verified by userId).
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { takeForIdIn } from "@/lib/db/prisma-find-many-bounds";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import {
  CAT_QUESTION_SELECT,
  dbRowsToCatQuestions,
  type DbQuestionRow,
} from "@/lib/cat/db-adapter";
import { loadAnswerHistory, mergeAnswerHistory } from "@/lib/cat/answer-history";
import {
  isSessionComplete,
  recordAnswer,
  selectNextQuestion,
} from "@/lib/cat/cat-engine";
import {
  completeNpCatSession,
  loadNpCatSession,
  saveNpCatSession,
} from "@/lib/cat/session-persistence";
import { analyseSession } from "@/lib/cat/session-analyzer";
import type { CatSessionConfig, CatQuestion } from "@/lib/cat/types";

// ─── Validation ────────────────────────────────────────────────────────────────

const bodySchema = z.object({
  practiceTestId: z.string().min(1).max(64),
  questionId: z.string().min(1).max(64),
  answeredCorrectly: z.boolean(),
  responseTimeMs: z.number().int().min(0).max(600_000).optional(),
});

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await requireSubscriberSession();
  if (!session.ok) return session.response;
  const { userId } = session;

  let body: z.infer<typeof bodySchema>;
  try {
    const raw = await req.json();
    body = bodySchema.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { practiceTestId, questionId, answeredCorrectly, responseTimeMs } = body;

  // ── Load session state ───────────────────────────────────────────────────

  const loaded = await loadNpCatSession(prisma, practiceTestId, userId);
  if (!loaded) {
    return NextResponse.json(
      { error: "Session not found or already completed" },
      { status: 404 },
    );
  }

  const { state, config: sessionConfig } = loaded;

  // Guard: question must be in the answered-id pipeline (was actually presented)
  if (state.answeredIds.includes(questionId)) {
    return NextResponse.json(
      { error: "Question already answered in this session" },
      { status: 409 },
    );
  }

  // ── Reload pool (minimal select) ─────────────────────────────────────────

  const poolIds = sessionConfig.poolQuestionIds;
  const rows = await prisma.examQuestion.findMany({
    where: { id: { in: poolIds } },
    select: CAT_QUESTION_SELECT,
    take: takeForIdIn(poolIds),
  });

  const pool = dbRowsToCatQuestions(rows as unknown as DbQuestionRow[]);

  // Find the question being answered
  const question = pool.find((q) => q.id === questionId);
  if (!question) {
    return NextResponse.json(
      { error: "Question not found in session pool" },
      { status: 404 },
    );
  }

  // ── Record the answer ────────────────────────────────────────────────────

  recordAnswer(state, question, answeredCorrectly, Date.now(), responseTimeMs);

  // ── Check for session completion ─────────────────────────────────────────

  const catConfig: CatSessionConfig = {
    questionPool: pool,
    historicalAnswers: [],
    maxQuestions: sessionConfig.maxQuestions,
    riskFloors: { low: 4, moderate: 8, high: 10 },
    layerFloors: { L1: 4, L2: 12, L3: 10 },
  };

  const complete = isSessionComplete(state, catConfig);

  if (complete) {
    // ── Complete session: run analysis and persist ──────────────────────────

    const historicalAnswers = await loadAnswerHistory(prisma, userId);
    const allAnswers = mergeAnswerHistory(historicalAnswers, state.sessionAnswers);

    // Lesson catalog is optional — pass empty for now; can be enriched later
    const analysis = analyseSession({
      sessionState: state,
      allAnswers,
      questionPool: pool,
      lessonCatalog: [],
    });

    await completeNpCatSession(prisma, practiceTestId, userId, state, analysis);

    return NextResponse.json({
      nextQuestion: null,
      sessionComplete: true,
      terminationReason: "session_complete",
      progress: progressSummary(state, sessionConfig.maxQuestions),
      readinessScore: analysis.summary.readinessScore.score,
      weakAreaCount: analysis.weakAreas.length,
      selectionDiagnostics: null,
    });
  }

  // ── Save state and select next question ──────────────────────────────────

  await saveNpCatSession(prisma, practiceTestId, userId, state);

  const { question: nextQ, terminationReason, selectionDiagnostics } = selectNextQuestion(state, catConfig);

  if (!nextQ) {
    // Pool exhausted or limit reached mid-save — complete the session
    const historicalAnswers = await loadAnswerHistory(prisma, userId);
    const allAnswers = mergeAnswerHistory(historicalAnswers, state.sessionAnswers);
    const analysis = analyseSession({ sessionState: state, allAnswers, questionPool: pool, lessonCatalog: [] });
    await completeNpCatSession(prisma, practiceTestId, userId, state, analysis);

    return NextResponse.json({
      nextQuestion: null,
      sessionComplete: true,
      terminationReason,
      progress: progressSummary(state, sessionConfig.maxQuestions),
      readinessScore: analysis.summary.readinessScore.score,
      weakAreaCount: analysis.weakAreas.length,
      selectionDiagnostics,
    });
  }

  return NextResponse.json({
    nextQuestion: serialiseQuestion(nextQ),
    sessionComplete: false,
    terminationReason: null,
    progress: progressSummary(state, sessionConfig.maxQuestions),
    readinessScore: null,
    weakAreaCount: null,
    selectionDiagnostics,
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function serialiseQuestion(q: CatQuestion) {
  return {
    id: q.id,
    cognitiveLayer: q.cognitiveLayer,
    riskLevel: q.riskLevel,
    difficulty: q.difficulty,
    populationTags: q.populationTags ?? [],
    dispositionTag: q.dispositionTag ?? null,
  };
}

function progressSummary(state: import("@/lib/cat/types").CatSessionState, maxQuestions: number) {
  return {
    answered: state.answeredIds.length,
    correct: state.sessionAnswers.filter((a) => a.correct).length,
    maxQuestions,
    abilityEstimate: Math.round(state.abilityEstimate * 100) / 100,
  };
}
