/**
 * POST /api/cat/np/session
 *
 * Start a new NP CAT readiness session.
 *
 * Request body:
 *   { pathwayId: string, maxQuestions?: number }
 *
 * Response:
 *   { sessionId: string, practiceTestId: string, firstQuestion: SerializedCatQuestion | null }
 *
 * The response includes the first question so the UI can display it immediately
 * without a second round-trip.
 *
 * Auth: subscriber required (NP pathway entitlement checked below).
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import {
  CAT_QUESTION_SELECT,
  dbRowsToCatQuestions,
  type DbQuestionRow,
} from "@/lib/cat/db-adapter";
import {
  loadAnswerHistory,
  recentlyAnsweredIds,
} from "@/lib/cat/answer-history";
import {
  createCatSession,
  selectNextQuestion,
} from "@/lib/cat/cat-engine";
import { createNpCatSession } from "@/lib/cat/session-persistence";
import type { CatSessionConfig } from "@/lib/cat/types";

// ─── Validation ────────────────────────────────────────────────────────────────

const bodySchema = z.object({
  pathwayId: z.string().min(1).max(64),
  maxQuestions: z.number().int().min(10).max(80).optional().default(40),
});

// ─── Config ───────────────────────────────────────────────────────────────────

const NP_EXAM_KEYS = ["np-aanp", "np-aanpcnp", "np-canp", "np-fnp", "np-agpcnp", "np-pmhnp"];
const POOL_SIZE = 200;

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

  const { pathwayId, maxQuestions } = body;

  // ── Load question pool ───────────────────────────────────────────────────

  const recentIds = await recentlyAnsweredIds(prisma, userId);

  const rows = await prisma.examQuestion.findMany({
    where: {
      exam: { in: NP_EXAM_KEYS },
      status: "published",
      isAdaptiveEligible: true,
      NOT: { id: { in: [...recentIds].slice(0, 500) } },
    },
    select: CAT_QUESTION_SELECT,
    take: POOL_SIZE,
    orderBy: { updatedAt: "desc" },
  });

  if (rows.length < 10) {
    return NextResponse.json(
      { error: "Insufficient question pool for this pathway. Try again later." },
      { status: 503 },
    );
  }

  const pool = dbRowsToCatQuestions(rows as unknown as DbQuestionRow[]);

  // ── Load historical answer history ───────────────────────────────────────

  const historicalAnswers = await loadAnswerHistory(prisma, userId);

  // ── Create CAT session ───────────────────────────────────────────────────

  const sessionConfig: CatSessionConfig = {
    questionPool: pool,
    historicalAnswers,
    excludeIds: [...recentIds],
    maxQuestions,
    riskFloors: { low: 4, moderate: 8, high: 10 },
    layerFloors: { L1: 4, L2: 12, L3: 10 },
  };

  const catState = createCatSession(sessionConfig);

  // ── Persist to DB ────────────────────────────────────────────────────────

  const practiceTestId = await createNpCatSession(prisma, {
    userId,
    pathwayId,
    initialState: catState,
    poolQuestionIds: pool.map((q) => q.id),
    maxQuestions,
  });

  // ── Select first question ────────────────────────────────────────────────

  const { question, selectionDiagnostics } = selectNextQuestion(catState, sessionConfig);

  return NextResponse.json({
    practiceTestId,
    sessionId: catState.sessionId,
    firstQuestion: question
      ? {
          id: question.id,
          cognitiveLayer: question.cognitiveLayer,
          riskLevel: question.riskLevel,
          difficulty: question.difficulty,
          populationTags: question.populationTags ?? [],
          dispositionTag: question.dispositionTag ?? null,
        }
      : null,
    poolSize: pool.length,
    maxQuestions,
    selectionDiagnostics,
  });
}
