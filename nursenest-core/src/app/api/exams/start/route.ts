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
import { seedMinimalQuestionBankIfEmpty } from "@/lib/exams/seed-minimal-question-bank";

const POOL_LIMIT = 20;

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
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }
    if (!userCanAccessExam(gate.entitlement, exam)) {
      logPaywallDeny("/api/exams/start", "exam_out_of_scope", { examId: examId ?? "" });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    if (questionPool.length === 0) {
      productEvent("exam_pool_empty", { hasExamId: !!examId });
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
    });
  } catch (e) {
    safeServerLogCritical("api_exams_start", "failed", {}, e, { flow: "exam_start" });
    return NextResponse.json(
      { error: "Unable to start exam session. Try again shortly.", questions: [], total: 0, poolEmpty: true },
      { status: 503 },
    );
  }
}
