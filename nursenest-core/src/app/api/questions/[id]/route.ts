import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { freemiumQuestionWhereForProfile, questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { logPaywallDeny, questionIdWhereIfAllowed } from "@/lib/entitlements/assert-question-access";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import type { CountryCode, TierCode } from "@prisma/client";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!id || id.length < 5) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let entitlement;
  try {
    entitlement = await resolveEntitlement(userId);
  } catch (e) {
    safeServerLogCritical("api_questions_id", "entitlement_resolve_failed", {}, e);
    return NextResponse.json({ error: "Unable to verify access. Try again shortly." }, { status: 503 });
  }

  if (entitlement.hasAccess) {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({ route: "/api/questions/[id]", feature: "question", userId: gate.userId });

    try {
      const q = await withRetry(() =>
        prisma.examQuestion.findFirst({
          where: questionIdWhereIfAllowed(id, gate.entitlement),
          select: {
            id: true,
            stem: true,
            questionType: true,
            rationale: true,
            options: true,
            difficulty: true,
            exam: true,
            topic: true,
            bodySystem: true,
          },
        }),
      );

      if (!q) {
        logPaywallDeny("/api/questions/[id]", "question_not_in_scope_or_missing", { id });
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      return NextResponse.json({ question: q, mode: "subscriber" as const });
    } catch (e) {
      safeServerLogCritical("api_questions_id", "fetch_failed", {}, e);
      return NextResponse.json({ error: "Unable to load question" }, { status: 503 });
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { country: true, tier: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snap = await getFreemiumSnapshot(userId);
  if (!snap || snap.questionRemaining <= 0) {
    logPaywallDeny("/api/questions/[id]", "freemium_exhausted", { id });
    return NextResponse.json(
      { error: "Subscription required", code: "paywall" },
      { status: 403 },
    );
  }

  const where = {
    AND: [{ id }, freemiumQuestionWhereForProfile(user.country as CountryCode, user.tier as TierCode)],
  };

  try {
    const q = await withRetry(() =>
      prisma.examQuestion.findFirst({
        where,
        select: {
          id: true,
          stem: true,
          questionType: true,
          options: true,
          topic: true,
          exam: true,
        },
      }),
    );

    if (!q) {
      logPaywallDeny("/api/questions/[id]", "freemium_question_not_in_scope", { id });
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { freeQuestionViews: { increment: 1 } },
    });

    return NextResponse.json({
      question: q,
      mode: "freemium" as const,
    });
  } catch (e) {
    safeServerLogCritical("api_questions_id", "fetch_failed_freemium", {}, e);
    return NextResponse.json({ error: "Unable to load question" }, { status: 503 });
  }
}
