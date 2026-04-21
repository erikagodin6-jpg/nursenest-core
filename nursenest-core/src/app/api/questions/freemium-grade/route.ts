import { NextRequest, NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { auth } from "@/lib/auth";
import { freemiumQuestionWhereForProfile } from "@/lib/entitlements/content-access-scope";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { notSubscribedResponse } from "@/lib/entitlements/require-subscriber-session";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { recordEntitlementResolveFailureSignal } from "@/lib/observability/production-signal-metrics";
import { productEvent } from "@/lib/observability/product-events";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { emitStructuredLog } from "@/lib/observability/structured-log";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import type { CountryCode, TierCode } from "@prisma/client";
import { enforceQuestionGradeProtection } from "@/lib/http/api-protection";
import { gradeMatches, normalizeCorrect } from "@/lib/questions/grade-answer-match";

export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  return runWithApiTelemetry(req, "POST /api/questions/freemium-grade", "content", async () => {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401 });
  }

  const rateLimited = await enforceQuestionGradeProtection(req, userId);
  if (rateLimited) return rateLimited;

  let body: { questionId?: string; answer?: unknown };
  try {
    body = (await req.json()) as { questionId?: string; answer?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON", code: "invalid_json" }, { status: 400 });
  }

  const questionId = typeof body.questionId === "string" && body.questionId.length > 4 ? body.questionId : null;
  if (!questionId) {
    return NextResponse.json({ error: "questionId required", code: "question_id_required" }, { status: 400 });
  }

  let entitlement;
  try {
    entitlement = await resolveEntitlement(userId);
  } catch (e) {
    const correlationId = correlationIdFromRequest(req);
    productEvent("entitlement_resolve_failed", { surface: "api_freemium_grade" });
    recordEntitlementResolveFailureSignal("api_freemium_grade", correlationId);
    emitStructuredLog("entitlement_resolve_failed", "error", {
      correlationId,
      route: "/api/questions/freemium-grade",
      method: "POST",
      flow: "content",
      errorClass: e instanceof Error ? e.name : typeof e,
      message: "resolveEntitlement failed in freemium grade",
    });
    safeServerLogCritical("api_questions_freemium_grade", "entitlement_resolve_failed", {}, e);
    return NextResponse.json(
      { error: "Unable to verify access. Try again shortly.", code: "access_verify_failed" },
      { status: 503 },
    );
  }

  if (entitlement.hasAccess) {
    return NextResponse.json(
      {
        code: "subscriber_use_grade_endpoint",
        message: "Use POST /api/questions/grade with an active study session.",
      },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { country: true, tier: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401 });
  }

  setSentryServerContext({ route: "/api/questions/freemium-grade", feature: SERVER_FEATURE.question, userId });

  const snap = await getFreemiumSnapshot(userId);
  if (!snap || snap.questionRemaining <= 0) {
    return notSubscribedResponse();
  }

  const where = {
    AND: [{ id: questionId }, freemiumQuestionWhereForProfile(user.country as CountryCode, user.tier as TierCode)],
  };

  try {
    const row = await withRetry(() =>
      prisma.examQuestion.findFirst({
        where,
        select: {
          id: true,
          questionType: true,
          correctAnswer: true,
        },
      }),
    );

    if (!row) {
      return NextResponse.json({ error: "Not found", code: "not_found" }, { status: 404 });
    }

    const expected = normalizeCorrect(row.correctAnswer);
    if (expected.length === 0) {
      return NextResponse.json(
        { error: "Question is missing an answer key in the bank.", questionId: row.id, code: "missing_answer_key" },
        { status: 422 },
      );
    }

    const correct = gradeMatches(row.questionType, expected, body.answer);

    await prisma.user.update({
      where: { id: userId },
      data: { freeQuestionViews: { increment: 1 } },
    });

    const nextRemaining = Math.max(0, snap.questionRemaining - 1);

    return NextResponse.json({
      correct,
      correctKeys: expected,
      questionId: row.id,
      questionType: row.questionType,
      rationaleLocked: true as const,
      freemiumRemainingAfter: nextRemaining,
    });
  } catch (e) {
    safeServerLogCritical("api_questions_freemium_grade", "failed", { questionId }, e);
    return NextResponse.json({ error: "Unable to grade. Try again shortly.", code: "service_unavailable" }, { status: 503 });
  }
  });
}
