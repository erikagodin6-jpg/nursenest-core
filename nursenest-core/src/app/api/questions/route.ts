import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { freemiumQuestionWhereForProfile, questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import type { CountryCode, TierCode } from "@prisma/client";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { questionAccessWhereWithPathway } from "@/lib/exam-pathways/pathway-content-scope";
import { subscriptionCoversPathwayBase } from "@/lib/exam-pathways/pathway-entitlements";
import { seedMinimalQuestionBankIfEmpty } from "@/lib/exams/seed-minimal-question-bank";

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(25, Math.max(5, Number(searchParams.get("pageSize") ?? "10")));
  const topicFilter = searchParams.get("topic")?.trim();
  const pathwayIdParam = searchParams.get("pathwayId")?.trim();
  /** summary = card metadata only; full = stem + rationale + options (larger payloads). */
  const mode = searchParams.get("mode") === "full" ? "full" : "summary";

  let entitlement;
  try {
    entitlement = await resolveEntitlement(userId);
  } catch (e) {
    safeServerLogCritical("api_questions", "entitlement_resolve_failed", { page }, e);
    return NextResponse.json({ error: "Unable to verify access. Try again shortly." }, { status: 503 });
  }

  if (entitlement.hasAccess) {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    setSentryServerContext({ route: "/api/questions", feature: "question", userId: gate.userId });
    await seedMinimalQuestionBankIfEmpty();
    try {
      const summarySelect = {
        id: true,
        stem: true,
        questionType: true,
        difficulty: true,
        exam: true,
        topic: true,
        bodySystem: true,
      } as const;
      const fullSelect = {
        id: true,
        stem: true,
        questionType: true,
        rationale: true,
        options: true,
        topic: true,
        exam: true,
      } as const;

      let pathway: ReturnType<typeof getExamPathwayById> | null = pathwayIdParam
        ? getExamPathwayById(pathwayIdParam) ?? null
        : null;
      if (pathway && !subscriptionCoversPathwayBase(gate.entitlement, pathway)) {
        pathway = null;
      }
      const baseWhere = questionAccessWhereWithPathway(gate.entitlement, pathway);
      const whereWithTopic =
        topicFilter && topicFilter.length > 0
          ? { AND: [baseWhere, { topic: topicFilter }] }
          : baseWhere;

      let questions = await withRetry(() =>
        prisma.examQuestion.findMany({
          where: whereWithTopic,
          select: mode === "full" ? fullSelect : summarySelect,
          orderBy: { updatedAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      );

      let topicRelaxed = false;
      if (questions.length === 0 && topicFilter && topicFilter.length > 0) {
        questions = await withRetry(() =>
          prisma.examQuestion.findMany({
            where: baseWhere,
            select: mode === "full" ? fullSelect : summarySelect,
            orderBy: { updatedAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
          }),
        );
        if (questions.length > 0) topicRelaxed = true;
      }

      const payload =
        mode === "summary"
          ? questions.map((q) => ({
              ...q,
              stem: q.stem.length > 280 ? `${q.stem.slice(0, 280).trim()}…` : q.stem,
            }))
          : questions;

      return NextResponse.json({
        page,
        pageSize,
        questions: payload,
        mode: "subscriber" as const,
        fields: mode,
        pathwayIdApplied: pathway?.id ?? null,
        topicRequested: topicFilter && topicFilter.length > 0 ? topicFilter : null,
        topicRelaxed,
      });
    } catch (e) {
      safeServerLogCritical("api_questions", "prisma_find_failed", { page }, e);
      return NextResponse.json({ error: "Unable to load questions. Try again shortly." }, { status: 503 });
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { country: true, tier: true, freeQuestionViews: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  setSentryServerContext({ route: "/api/questions", feature: "question", userId });

  await seedMinimalQuestionBankIfEmpty();

  const snap = await getFreemiumSnapshot(userId);
  if (!snap || snap.questionRemaining <= 0) {
    return NextResponse.json(
      {
        error: "Subscription required",
        code: "paywall",
        message: "You have used your complimentary question previews. Subscribe to unlock the full bank and rationales.",
        freemiumExhausted: true,
      },
      { status: 403 },
    );
  }

  const take = Math.min(pageSize, snap.questionRemaining);

  try {
    const where = freemiumQuestionWhereForProfile(user.country as CountryCode, user.tier as TierCode);
    const freemiumMode = searchParams.get("mode") === "full" ? "full" : "summary";
    const questions = await withRetry(() =>
      prisma.examQuestion.findMany({
        where,
        select:
          freemiumMode === "full"
            ? {
                id: true,
                stem: true,
                questionType: true,
                options: true,
                topic: true,
                exam: true,
              }
            : {
                id: true,
                stem: true,
                questionType: true,
                difficulty: true,
                exam: true,
                topic: true,
                bodySystem: true,
              },
        orderBy: { updatedAt: "desc" },
        skip: 0,
        take,
      }),
    );

    const used = questions.length;
    if (used > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          freeQuestionViews: {
            increment: used,
          },
        },
      });
    }

    const remaining = Math.max(0, snap.questionRemaining - used);
    const sanitized =
      freemiumMode === "full"
        ? questions
        : questions.map((q) => ({
            ...q,
            stem: q.stem.length > 280 ? `${q.stem.slice(0, 280).trim()}…` : q.stem,
          }));

    return NextResponse.json({
      page: 1,
      pageSize: take,
      questions: sanitized,
      mode: "freemium" as const,
      fields: freemiumMode,
      freemiumRemainingAfterBatch: remaining,
    });
  } catch (e) {
    safeServerLogCritical("api_questions", "prisma_find_failed_freemium", { page }, e);
    return NextResponse.json({ error: "Unable to load questions. Try again shortly." }, { status: 503 });
  }
}
