import { NextResponse } from "next/server";
import { ContentStatus, ExamSessionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere, userCanAccessExam } from "@/lib/entitlements/content-access-scope";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { logPaywallDeny } from "@/lib/entitlements/assert-question-access";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { productEvent } from "@/lib/observability/product-events";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import { MAX_SESSION_QUESTION_IDS } from "@/lib/exams/exam-session-bounds";
import { seedMinimalQuestionBankIfEmpty } from "@/lib/exams/seed-minimal-question-bank";
import { diagnoseExamStartEmpty } from "@/lib/questions/exam-start-empty-diagnostics";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const POOL_LIMIT = Math.min(20, MAX_SESSION_QUESTION_IDS);

export async function POST(req: Request) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/exams/start", feature: "exam", userId: gate.userId });

  await seedMinimalQuestionBankIfEmpty();

  let examId: string | null = null;
  let hydrate: "full" | "window" = "window";
  try {
    const b = (await req.json()) as { examId?: string; hydrate?: string };
    examId = typeof b?.examId === "string" && b.examId.length > 4 ? b.examId : null;
    if (b?.hydrate === "full") hydrate = "full";
  } catch {
    /* optional body */
  }

  if (examId) {
    const exam = await withRetry(() =>
      prisma.exam.findUnique({
        where: { id: examId! },
        select: { id: true, status: true, country: true, tier: true },
      }),
    );
    if (!exam || exam.status !== ContentStatus.PUBLISHED) {
      return NextResponse.json({ error: "Exam not found", code: "exam_not_found" }, { status: 404 });
    }
    if (!userCanAccessExam(gate.entitlement, exam)) {
      logPaywallDeny("/api/exams/start", "exam_out_of_scope", { examId: examId ?? "" });
      return NextResponse.json(
        { error: "Forbidden", code: "exam_not_in_plan" },
        { status: 403 },
      );
    }
  }

  try {
    const questionPool = await withRetry(() =>
      prisma.examQuestion.findMany({
        where: questionAccessWhere(gate.entitlement),
        select: { id: true, stem: true, options: true, questionType: true },
        take: POOL_LIMIT,
      }),
    );

    const session = await prisma.examSession.create({
      data: {
        userId: gate.userId,
        examId,
        questionIds: questionPool.map((q) => q.id),
        answers: {},
        currentIndex: 0,
        status: ExamSessionStatus.IN_PROGRESS,
      },
    });

    const poolDiagnostics =
      questionPool.length === 0 ? await diagnoseExamStartEmpty(gate.entitlement) : undefined;

    if (questionPool.length === 0) {
      productEvent("exam_pool_empty", { hasExamId: !!examId });
      if (poolDiagnostics) {
        safeServerLog("api_exams_start", "pool_empty", {
          code: poolDiagnostics.code,
          publishedGlobal: poolDiagnostics.counts.publishedGlobal,
          entitlementPublished: poolDiagnostics.counts.entitlementPublished,
        });
      }
    }
    productEvent("exam_start", { total: questionPool.length });

    const questionIds = questionPool.map((q) => q.id);

    if (hydrate === "window") {
      return NextResponse.json({
        sessionId: session.id,
        examId,
        total: questionPool.length,
        questionIds,
        questions: questionPool.length ? [questionPool[0]] : [],
        poolEmpty: questionPool.length === 0,
        hydrate: "window" as const,
        ...(poolDiagnostics ? { diagnostics: poolDiagnostics } : {}),
      });
    }

    return NextResponse.json({
      sessionId: session.id,
      examId,
      total: questionPool.length,
      questionIds,
      questions: questionPool,
      poolEmpty: questionPool.length === 0,
      hydrate: "full" as const,
      ...(poolDiagnostics ? { diagnostics: poolDiagnostics } : {}),
    });
  } catch (e) {
    safeServerLogCritical("api_exams_start", "failed", {}, e, { flow: "exam_start" });
    return NextResponse.json(
      {
        error: "Unable to start exam session. Try again shortly.",
        code: "service_unavailable",
        questions: [],
        total: 0,
        poolEmpty: true,
      },
      { status: 503 },
    );
  }
}
