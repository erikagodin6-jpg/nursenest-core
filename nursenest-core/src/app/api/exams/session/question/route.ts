import { NextRequest, NextResponse } from "next/server";
import { ExamSessionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { filterSessionQuestionIdsInScope, questionIdWhereIfAllowed } from "@/lib/entitlements/assert-question-access";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";

/**
 * Fetch a single exam question by session + index (avoids loading full pool in one response).
 */
export async function GET(req: NextRequest) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const sessionId = req.nextUrl.searchParams.get("sessionId");
  const indexRaw = req.nextUrl.searchParams.get("index");
  if (!sessionId || indexRaw === null) {
    return NextResponse.json({ error: "sessionId and index required" }, { status: 400 });
  }
  const index = Math.max(0, Number.parseInt(indexRaw, 10));
  if (Number.isNaN(index)) {
    return NextResponse.json({ error: "invalid index" }, { status: 400 });
  }

  setSentryServerContext({ route: "/api/exams/session/question", feature: "exam", userId: gate.userId });

  try {
    const row = await withRetry(() =>
      prisma.examSession.findFirst({
        where: { id: sessionId, userId: gate.userId, status: ExamSessionStatus.IN_PROGRESS },
        select: { questionIds: true },
      }),
    );

    if (!row) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const rawIds = row.questionIds as string[];
    const ids = await filterSessionQuestionIdsInScope(rawIds, gate.entitlement);
    if (ids.length === 0) {
      return NextResponse.json({ error: "No questions in scope for current access" }, { status: 404 });
    }
    if (index >= ids.length) {
      return NextResponse.json({ error: "index out of range" }, { status: 400 });
    }

    const qid = ids[index];
    const question = await withRetry(() =>
      prisma.examQuestion.findFirst({
        where: questionIdWhereIfAllowed(qid, gate.entitlement),
        select: { id: true, stem: true, options: true, questionType: true },
      }),
    );

    if (!question) {
      return NextResponse.json({ error: "Question not available" }, { status: 404 });
    }

    return NextResponse.json({ index, total: ids.length, question, entitlementFiltered: rawIds.length !== ids.length });
  } catch (e) {
    safeServerLogCritical("api_exams_session_question", "failed", {}, e);
    return NextResponse.json({ error: "Unable to load question" }, { status: 503 });
  }
}
