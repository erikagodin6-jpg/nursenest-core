import { NextRequest, NextResponse } from "next/server";
import { ExamSessionStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { filterSessionQuestionIdsInScope } from "@/lib/entitlements/assert-question-access";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";

const patchSchema = z.object({
  sessionId: z.string().min(5),
  currentIndex: z.number().int().min(0),
  answers: z.record(z.string(), z.unknown()),
});

/** Resume in-progress session (questions + progress). */
export async function GET(req: NextRequest) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const mode = req.nextUrl.searchParams.get("mode") === "minimal" ? "minimal" : "full";

  setSentryServerContext({ route: "/api/exams/session", feature: "exam", userId: gate.userId });

  try {
    const row = await withRetry(() =>
      prisma.examSession.findFirst({
        where: { id: sessionId, userId: gate.userId, status: ExamSessionStatus.IN_PROGRESS },
        select: {
          id: true,
          examId: true,
          currentIndex: true,
          answers: true,
          questionIds: true,
          updatedAt: true,
        },
      }),
    );

    if (!row) {
      return NextResponse.json({ error: "Session not found or completed" }, { status: 404 });
    }

    const rawIds = row.questionIds as string[];
    const ids = await filterSessionQuestionIdsInScope(rawIds, gate.entitlement);
    const dropped = rawIds.length - ids.length;
    if (dropped > 0) {
      safeServerLogCritical("api_exams_session", "session_question_ids_filtered", {
        sessionId: row.id,
        dropped,
        remaining: ids.length,
      });
    }

    if (mode === "minimal") {
      return NextResponse.json({
        sessionId: row.id,
        examId: row.examId,
        currentIndex: Math.min(row.currentIndex, Math.max(0, ids.length - 1)),
        answers: row.answers,
        questionIds: ids,
        total: ids.length,
        updatedAt: row.updatedAt,
        mode: "minimal" as const,
        poolEmpty: ids.length === 0,
        entitlementFiltered: dropped > 0,
      });
    }

    const questions = await withRetry(() =>
      prisma.examQuestion.findMany({
        where: { AND: [{ id: { in: ids } }, questionAccessWhere(gate.entitlement)] },
        select: { id: true, stem: true, options: true, questionType: true },
      }),
    );
    const order = new Map(ids.map((id, i) => [id, i]));
    questions.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

    return NextResponse.json({
      sessionId: row.id,
      examId: row.examId,
      currentIndex: Math.min(row.currentIndex, Math.max(0, ids.length - 1)),
      answers: row.answers,
      questionIds: ids,
      total: ids.length,
      questions,
      updatedAt: row.updatedAt,
      mode: "full" as const,
      entitlementFiltered: dropped > 0,
    });
  } catch (e) {
    safeServerLogCritical("api_exams_session", "get_failed", {}, e);
    return NextResponse.json({ error: "Unable to load session" }, { status: 503 });
  }
}

/** Save progress after each question (idempotent upsert by session id). */
export async function PATCH(req: Request) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/exams/session", feature: "exam", userId: gate.userId });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  try {
    const existing = await prisma.examSession.findFirst({
      where: { id: parsed.data.sessionId, userId: gate.userId, status: ExamSessionStatus.IN_PROGRESS },
    });
    if (!existing) {
      return NextResponse.json({ error: "Session not found or already completed" }, { status: 404 });
    }

    const updated = await prisma.examSession.update({
      where: { id: existing.id },
      data: {
        currentIndex: parsed.data.currentIndex,
        answers: parsed.data.answers as object,
      },
      select: { id: true, currentIndex: true, updatedAt: true },
    });

    return NextResponse.json({ ok: true, session: updated });
  } catch (e) {
    safeServerLogCritical("api_exams_session", "patch_failed", {}, e);
    return NextResponse.json({ error: "Unable to save progress" }, { status: 503 });
  }
}
