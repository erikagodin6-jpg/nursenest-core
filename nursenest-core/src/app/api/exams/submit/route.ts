import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import type { Prisma } from "@prisma/client";
import { ExamSessionStatus } from "@prisma/client";
import { z } from "zod";
import { invalidateLearnerPrivateReadCache } from "@/lib/cache/learner-private-read-cache";
import { JSON_BODY_EXAM_SUBMIT, parseJsonBodyWithLimit } from "@/lib/http/json-body-limit";
import { prisma } from "@/lib/db";
import { userCanAccessExam } from "@/lib/entitlements/content-access-scope";
import { logPaywallDeny } from "@/lib/entitlements/assert-question-access";
import { notSubscribedResponse, requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { buildExamSessionReview, type ExamReviewJson } from "@/lib/exams/exam-session-review";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import { collectSessionTopicOutcomes, scoreSessionAnswers } from "@/lib/exams/score-session-answers";
import { buildPostTestStudyNextFromReview } from "@/lib/learner/post-test-study-next";
import { recordTopicOutcomesSequential } from "@/lib/learner/topic-performance";
import { productEvent } from "@/lib/observability/product-events";
import { captureLearnerProductEvent } from "@/lib/observability/learner-product-analytics";
import { PH } from "@/lib/observability/posthog-conversion-events";
import type { PostTestStudyNextBundle } from "@/lib/learner/adaptive-recommendations";
import { fireExamRetentionEmails } from "@/lib/retention/retention-email";

export const dynamic = "force-dynamic";

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
    if (data.answers && typeof data.answers === "object" && data.answers !== null) {
      const n = Object.keys(data.answers as object).length;
      if (n > 2_500) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "answers map too large" });
      }
    }
  });

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/exams/submit", "content", async () => {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/exams/submit", feature: SERVER_FEATURE.exam, userId: gate.userId });

  const rawParsed = await parseJsonBodyWithLimit(req, JSON_BODY_EXAM_SUBMIT);
  if (!rawParsed.ok) return rawParsed.response;

  const parsed = schema.safeParse(rawParsed.value);
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
    logPaywallDeny("/api/exams/submit", "exam_out_of_scope", { examId: parsed.data.examId });
    return notSubscribedResponse();
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
    const subscriberRow = await prisma.user.findUnique({
      where: { id: gate.userId },
      select: { learnerPath: true },
    });
    const learnerPath = subscriberRow?.learnerPath ?? null;

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
        let studyNext: PostTestStudyNextBundle | null = null;
        if (review?.items?.length) {
          try {
            studyNext = await buildPostTestStudyNextFromReview(review, gate.entitlement, learnerPath);
          } catch {
            studyNext = null;
          }
        }
        return NextResponse.json({ attempt: result.attempt, review, studyNext, idempotent: true });
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
        captureLearnerProductEvent(gate.userId, gate.entitlement, PH.learnerExamMockSessionCompleted, {
          exam_id_prefix: parsed.data.examId.slice(0, 8),
          score,
          total,
          graded_on_server: true,
          timed: Boolean(prefetchReview?.timedMode),
        });
        let studyNext: PostTestStudyNextBundle | null = null;
        if (prefetchReview?.items?.length) {
          try {
            studyNext = await buildPostTestStudyNextFromReview(prefetchReview, gate.entitlement, learnerPath);
          } catch {
            studyNext = null;
          }
        }
        await invalidateLearnerPrivateReadCache(gate.userId);
        fireExamRetentionEmails(gate.userId, score, total);
        return NextResponse.json({ attempt: result.attempt, review: prefetchReview, studyNext });
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
    captureLearnerProductEvent(gate.userId, gate.entitlement, PH.learnerExamMockSessionCompleted, {
      exam_id_prefix: parsed.data.examId.slice(0, 8),
      score,
      total,
      graded_on_server: false,
    });
    await invalidateLearnerPrivateReadCache(gate.userId);
    fireExamRetentionEmails(gate.userId, score, total);
    return NextResponse.json({ attempt });
  } catch (e) {
    safeServerLogCritical("api_exams_submit", "attempt_create_failed", {}, e);
    return NextResponse.json({ error: "Unable to save results. Try again shortly." }, { status: 503 });
  }
  });
}
