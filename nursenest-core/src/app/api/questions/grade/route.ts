import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { questionIdWhereIfAllowed } from "@/lib/entitlements/assert-question-access";
import { prisma } from "@/lib/db";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import type { Prisma } from "@prisma/client";
import { recordTopicOutcomesSequential } from "@/lib/learner/topic-performance";
import { normalizeTopicLabel } from "@/lib/learner/weak-topics-from-sessions";
import { buildRationalePayloadForGradeResponse } from "@/lib/content-quality/rationale-display";

function normalizeCorrect(correctAnswer: Prisma.JsonValue | null | undefined): string[] {
  if (correctAnswer == null) return [];
  if (Array.isArray(correctAnswer)) return correctAnswer.map((x) => String(x));
  if (typeof correctAnswer === "string") return [correctAnswer];
  return [String(correctAnswer)];
}

function gradeMatches(questionType: string, correct: string[], userAnswer: unknown): boolean {
  const t = questionType.toUpperCase();
  if (t === "SATA" || t === "SELECT_ALL_THAT_APPLY") {
    const u = Array.isArray(userAnswer) ? userAnswer.map((x) => String(x)).sort() : [];
    const c = [...correct].map(String).sort();
    if (u.length !== c.length) return false;
    return u.every((v, i) => v === c[i]);
  }
  const u = userAnswer == null ? "" : String(userAnswer);
  return correct.length > 0 && u === String(correct[0]);
}

export async function POST(req: Request) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/questions/grade", feature: "question", userId: gate.userId });

  let body: { questionId?: string; answer?: unknown };
  try {
    body = (await req.json()) as { questionId?: string; answer?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const questionId = typeof body.questionId === "string" && body.questionId.length > 4 ? body.questionId : null;
  if (!questionId) {
    return NextResponse.json({ error: "questionId required" }, { status: 400 });
  }

  try {
    const row = await withRetry(() =>
      prisma.examQuestion.findFirst({
        where: questionIdWhereIfAllowed(questionId, gate.entitlement),
        select: {
          id: true,
          questionType: true,
          correctAnswer: true,
          rationale: true,
          correctAnswerExplanation: true,
          clinicalReasoning: true,
          keyTakeaway: true,
          clinicalPearl: true,
          examStrategy: true,
          memoryHook: true,
          clinicalTrap: true,
          distractorRationales: true,
          topic: true,
          bodySystem: true,
        },
      }),
    );

    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const expected = normalizeCorrect(row.correctAnswer);
    if (expected.length === 0) {
      return NextResponse.json(
        { error: "Question is missing an answer key in the bank.", questionId: row.id },
        { status: 422 },
      );
    }

    const correct = gradeMatches(row.questionType, expected, body.answer);

    try {
      await recordTopicOutcomesSequential(gate.userId, [
        { topic: normalizeTopicLabel(row.topic), correct },
      ]);
    } catch {
      /* ledger is best-effort */
    }

    const rationaleBundle = buildRationalePayloadForGradeResponse(row);

    return NextResponse.json({
      correct,
      rationale: row.rationale ?? null,
      rationaleQuality: rationaleBundle.rationaleQuality,
      rationaleSections: rationaleBundle.sections,
      topic: row.topic ?? null,
      bodySystem: row.bodySystem ?? null,
      questionType: row.questionType,
      topicStatsUpdated: true,
    });
  } catch (e) {
    safeServerLogCritical("api_questions_grade", "failed", { questionId }, e);
    return NextResponse.json({ error: "Unable to grade. Try again shortly." }, { status: 503 });
  }
}
