import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { loadExamAttemptDetailForSubscriber } from "@/lib/exams/load-exam-attempt-detail";
import { enforceExamAttemptDetailProtection } from "@/lib/http/api-protection";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/exams/attempt/[id]", feature: SERVER_FEATURE.exam, userId: gate.userId });

  const limited = await enforceExamAttemptDetailProtection(req, gate.userId);
  if (limited) return limited;

  const { id } = await ctx.params;
  if (!id || id.length < 8) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const payload = await loadExamAttemptDetailForSubscriber(gate.userId, gate.entitlement, id);
  if (!payload) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    attempt: {
      id: payload.attempt.id,
      examId: payload.attempt.examId,
      score: payload.attempt.score,
      total: payload.attempt.total,
      createdAt: payload.attempt.createdAt,
      examTitle: payload.attempt.examTitle,
    },
    review: payload.review,
    studyNext: payload.studyNext,
  });
}
