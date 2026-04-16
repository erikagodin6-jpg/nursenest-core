import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { BaselineAssessmentAttemptStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { takeForIdIn } from "@/lib/db/prisma-find-many-bounds";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { recordTopicOutcomesSequential } from "@/lib/learner/topic-performance";
import { formatTopicLabelForDisplay } from "@/lib/learner/topic-normalize";
import { normalizeTopicLabel } from "@/lib/learner/weak-topics-from-sessions";
import { withRetry } from "@/lib/resilience/with-retry";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

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
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId || !isDatabaseUrlConfigured()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { attemptId?: string; answers?: Record<string, unknown> };
  try {
    body = (await req.json()) as { attemptId?: string; answers?: Record<string, unknown> };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const attemptId = typeof body.attemptId === "string" && body.attemptId.length > 4 ? body.attemptId : null;
  const answers = body.answers && typeof body.answers === "object" ? body.answers : null;
  if (!attemptId || !answers) {
    return NextResponse.json({ error: "attemptId and answers required" }, { status: 400 });
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

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { baselineAssessmentCompletedAt: true },
  });
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
      const expected = normalizeCorrect(row.correctAnswer);
      if (expected.length === 0) {
        return NextResponse.json({ error: "Question missing answer key", questionId: qid }, { status: 422 });
      }
      const ans = Object.prototype.hasOwnProperty.call(answers, qid) ? answers[qid] : undefined;
      const ok = gradeMatches(row.questionType, expected, ans);
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
}
