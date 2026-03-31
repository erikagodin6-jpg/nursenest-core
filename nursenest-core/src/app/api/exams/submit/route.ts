import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { ExamSessionStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { userCanAccessExam } from "@/lib/entitlements/content-access-scope";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { buildExamSessionReview, type ExamReviewJson } from "@/lib/exams/exam-session-review";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import { collectSessionTopicOutcomes, scoreSessionAnswers } from "@/lib/exams/score-session-answers";
import { recordTopicOutcomesSequential } from "@/lib/learner/topic-performance";
import { productEvent } from "@/lib/observability/product-events";

const schema = z
  .object({
    examId: z.string().min(5),
    sessionId: z.string().min(5).optional(),
    answers: z.record(z.string(), z.unknown()).optional(),
    score: z.number().int().min(0).optional(),
    total: z.number().int().min(1).optional(),
    elapsedMs: z.number().int().min(0).max(28_800_000).optional(),
  })
  .superRefine((data, ctx) => {
    const hasManual = data.score != null && data.total != null;
    const hasGraded = data.sessionId != null && data.answers != null;
    if (!hasManual && !hasGraded) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide score and total, or sessionId with answers for server grading",
      });
    }
  });

export async function POST(req: Request) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/exams/submit", feature: "exam", userId: gate.userId });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  let score: number;
  let total: number;
  if (parsed.data.sessionId && parsed.data.answers) {
    try {
      const graded = await scoreSessionAnswers(
        parsed.data.sessionId,
        gate.userId,
        parsed.data.examId,
        parsed.data.answers,
        gate.entitlement,
      );
      if (!graded) {
        return NextResponse.json({ error: "Could not grade session" }, { status: 400 });
      }
      score = graded.score;
      total = graded.total;
    } catch (e) {
      safeServerLogCritical("api_exams_submit", "grade_failed", {}, e);
      return NextResponse.json({ error: "Unable to grade attempt. Try again shortly." }, { status: 503 });
    }
  } else if (parsed.data.score != null && parsed.data.total != null) {
    score = parsed.data.score;
    total = parsed.data.total;
  } else {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  let exam;
  try {
    exam = await withRetry(() =>
      prisma.exam.findUnique({
        where: { id: parsed.data.examId },
        select: { id: true, status: true, country: true, tier: true },
      }),
    );
  } catch (e) {
    safeServerLogCritical("api_exams_submit", "exam_lookup_failed", {}, e);
    return NextResponse.json({ error: "Unable to verify exam. Try again shortly." }, { status: 503 });
  }

  if (!exam) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  if (!userCanAccessExam(gate.entitlement, exam)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let prefetchReview: ExamReviewJson | null = null;
  if (parsed.data.sessionId && parsed.data.answers) {
    const meta = await prisma.examSession.findFirst({
      where: { id: parsed.data.sessionId, userId: gate.userId },
      select: { timedMode: true, timeLimitSec: true, elapsedMs: true },
    });
    const elapsedFinal =
      parsed.data.elapsedMs !== undefined ? parsed.data.elapsedMs : (meta?.elapsedMs ?? null);
    prefetchReview = await buildExamSessionReview(
      parsed.data.sessionId,
      gate.userId,
      parsed.data.examId,
      parsed.data.answers,
      gate.entitlement,
      {
        timedMode: meta?.timedMode ?? false,
        timeLimitSec: meta?.timeLimitSec ?? null,
        elapsedMs: elapsedFinal,
      },
    );
  }

  if (parsed.data.sessionId) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const session = await tx.examSession.findFirst({
          where: {
            id: parsed.data.sessionId,
            userId: gate.userId,
          },
        });
        if (!session) {
          return { kind: "not_found" as const };
        }
        if (session.examId && session.examId !== parsed.data.examId) {
          return { kind: "mismatch" as const };
        }
        if (session.status === ExamSessionStatus.COMPLETED && session.attemptId) {
          const existing = await tx.examAttempt.findUnique({ where: { id: session.attemptId } });
          if (existing) {
            return { kind: "existing" as const, attempt: existing };
          }
        }
        if (session.status !== ExamSessionStatus.IN_PROGRESS) {
          return { kind: "bad_state" as const };
        }
        if (session.attemptId) {
          const existing = await tx.examAttempt.findUnique({ where: { id: session.attemptId } });
          return { kind: "existing" as const, attempt: existing };
        }

        const attempt = await tx.examAttempt.create({
          data: {
            userId: gate.userId,
            examId: parsed.data.examId,
            score,
            total,
            ...(prefetchReview ? { results: prefetchReview as Prisma.InputJsonValue } : {}),
          },
        });
        await tx.examSession.update({
          where: { id: session.id },
          data: {
            status: ExamSessionStatus.COMPLETED,
            attemptId: attempt.id,
            ...(parsed.data.elapsedMs !== undefined ? { elapsedMs: parsed.data.elapsedMs } : {}),
          },
        });
        return { kind: "created" as const, attempt };
      });

      if (result.kind === "not_found") {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }
      if (result.kind === "mismatch") {
        return NextResponse.json({ error: "Session does not match exam" }, { status: 400 });
      }
      if (result.kind === "bad_state") {
        return NextResponse.json({ error: "Session is not in a submittable state" }, { status: 409 });
      }
      if (result.kind === "existing" && result.attempt) {
        const raw = result.attempt.results;
        const review =
          raw && typeof raw === "object" && raw !== null ? (raw as ExamReviewJson) : null;
        return NextResponse.json({ attempt: result.attempt, review, idempotent: true });
      }
      if (result.kind === "created" && result.attempt) {
        if (parsed.data.sessionId && parsed.data.answers) {
          try {
            const outcomes = await collectSessionTopicOutcomes(
              parsed.data.sessionId,
              gate.userId,
              parsed.data.examId,
              parsed.data.answers,
              gate.entitlement,
            );
            if (outcomes?.length) {
              await recordTopicOutcomesSequential(gate.userId, outcomes);
            }
          } catch {
            /* best-effort */
          }
        }
        productEvent("exam_submit", { score, total, timed: prefetchReview?.timedMode ? 1 : 0 });
        return NextResponse.json({ attempt: result.attempt, review: prefetchReview });
      }
    } catch (e) {
      safeServerLogCritical("api_exams_submit", "session_tx_failed", {}, e);
      return NextResponse.json({ error: "Unable to save results. Try again shortly." }, { status: 503 });
    }
  }

  try {
    const attempt = await prisma.examAttempt.create({
      data: {
        userId: gate.userId,
        examId: parsed.data.examId,
        score,
        total,
      },
    });
    productEvent("exam_submit", { score, total });
    return NextResponse.json({ attempt });
  } catch (e) {
    safeServerLogCritical("api_exams_submit", "attempt_create_failed", {}, e);
    return NextResponse.json({ error: "Unable to save results. Try again shortly." }, { status: 503 });
  }
}
