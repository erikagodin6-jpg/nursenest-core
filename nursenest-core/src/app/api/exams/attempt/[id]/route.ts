import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import type { ExamReviewJson } from "@/lib/exams/exam-session-review";
import { enforceExamAttemptDetailProtection } from "@/lib/http/api-protection";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/exams/attempt/[id]", feature: "exam", userId: gate.userId });

  const limited = enforceExamAttemptDetailProtection(req, gate.userId);
  if (limited) return limited;

  const { id } = await ctx.params;
  if (!id || id.length < 8) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const attempt = await prisma.examAttempt.findFirst({
    where: { id, userId: gate.userId },
    select: {
      id: true,
      examId: true,
      score: true,
      total: true,
      createdAt: true,
      results: true,
      exam: { select: { title: true } },
    },
  });

  if (!attempt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const review =
    attempt.results && typeof attempt.results === "object" && attempt.results !== null
      ? (attempt.results as ExamReviewJson)
      : null;

  return NextResponse.json({
    attempt: {
      id: attempt.id,
      examId: attempt.examId,
      score: attempt.score,
      total: attempt.total,
      createdAt: attempt.createdAt,
      examTitle: attempt.exam.title,
    },
    review,
  });
}
