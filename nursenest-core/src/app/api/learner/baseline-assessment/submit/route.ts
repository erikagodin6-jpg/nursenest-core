import { NextResponse } from "next/server";
import { BaselineAssessmentAttemptStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { takeForIdIn } from "@/lib/db/prisma-find-many-bounds";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { recordTopicOutcomesSequential } from "@/lib/learner/topic-performance";
import { loadLearnerRequestUser } from "@/lib/learner/load-learner-request-user";
import { formatTopicLabelForDisplay } from "@/lib/learner/topic-normalize";
import { normalizeTopicLabel } from "@/lib/learner/weak-topics-from-sessions";
import { withRetry } from "@/lib/resilience/with-retry";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { JSON_BODY_BASELINE_SUBMIT, parseJsonBodyWithLimit } from "@/lib/http/json-body-limit";
import { correctAnswerIsConfigured, gradeMatches } from "@/lib/questions/grade-answer-match";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/learner/baseline-assessment/submit", "content", async () => {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId || !isDatabaseUrlConfigured()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawParsed = await parseJsonBodyWithLimit(req, JSON_BODY_BASELINE_SUBMIT);
  if (!rawParsed.ok) return rawParsed.response;

  const body = rawParsed.value as { attemptId?: string; answers?: Record<string, unknown> };

  const attemptId = typeof body.attemptId === "string" && body.attemptId.length > 4 ? body.attemptId : null;
  const answers = body.answers && typeof body.answers === "object" ? body.answers : null;
  if (!attemptId || !answers) {
    return NextResponse.json({ error: "attemptId and answers required" }, { status: 400 });
  }
  if (Object.keys(answers).length > 400) {
    return NextResponse.json({ error: "Too many answer entries", code: "answers_too_large" }, { status: 400 });
  }

  const attempt = await prisma.baselineAssessmentAttempt.findFirst({
    where: { id: attemptId, userId, status: BaselineAssessmentAttemptStatus.OPEN },
  });
  if (!attempt) {
    return NextResponse.json({ error: "Attempt not found or already submitted", code: "invalid_attempt" }, { status: 400 });
  }

  const questionIds = attempt.questionIds as unknown;
  if (!Array.isArray(questionIds) || questionIds.some((x) => typeof x !== "string")) {
    return NextResponse.json({ error: "Invalid attempt payload" }, { status: 400 });
  }
  const ids = questionIds as string[];

  const user = await loadLearnerRequestUser(userId);
  if (user?.baselineAssessmentCompletedAt) {
    return NextResponse.json({ error: "Baseline already completed", code: "already_done" }, { status: 400 });
  }

  try {
    const rows = await withRetry(() =>
      prisma.examQuestion.findMany({
        where: { id: { in: ids } },
        take: takeForIdIn(ids),
        select: {
          id: true,
          questionType: true,
          correctAnswer: true,
          topic: true,
        },
      }),
    );

    if (rows.length !== ids.length) {
      return NextResponse.json({ error: "Questions no longer available", code: "bank_mismatch" }, { status: 400 });
    }

    const byId = new Map(rows.map((r) => [r.id, r]));
    let correctCount = 0;
    const outcomes: { topic: string; correct: boolean }[] = [];
    const wrongTopics: string[] = [];

    for (const qid of ids) {
      const row = byId.get(qid);
      if (!row) {
        return NextResponse.json({ error: "Missing question in batch", code: "bank_mismatch" }, { status: 400 });
      }
      if (!correctAnswerIsConfigured(row.questionType, row.correctAnswer)) {
        return NextResponse.json({ error: "Question missing answer key", questionId: qid }, { status: 422 });
      }
      const ans = Object.prototype.hasOwnProperty.call(answers, qid) ? answers[qid] : undefined;
      const ok = gradeMatches(row.questionType, row.correctAnswer, ans);
      if (ok) correctCount += 1;
      const topic = normalizeTopicLabel(row.topic);
      outcomes.push({ topic, correct: ok });
      if (!ok && topic) wrongTopics.push(topic);
    }

    await recordTopicOutcomesSequential(userId, outcomes);

    const weakTopics = [...new Set(wrongTopics)].slice(0, 8);
    const summary = {
      correctCount,
      totalQuestions: ids.length,
      weakTopics,
      at: new Date().toISOString(),
    };

    const now = new Date();
    await prisma.$transaction([
      prisma.baselineAssessmentAttempt.update({
        where: { id: attemptId },
        data: { status: BaselineAssessmentAttemptStatus.SUBMITTED, submittedAt: now },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          baselineAssessmentCompletedAt: now,
          baselineAssessmentSummary: summary as object,
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      correctCount,
      total: ids.length,
      weakTopics,
      weakTopicsDisplay: weakTopics.map((t) => formatTopicLabelForDisplay(t)),
    });
  } catch (e) {
    safeServerLogCritical("baseline_submit", "failed", { attemptId }, e);
    return NextResponse.json({ error: "Unable to save baseline. Try again." }, { status: 503 });
  }
  });
}
