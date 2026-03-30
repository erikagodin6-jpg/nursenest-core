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
import { acquireQuestionFullModeSlot, releaseQuestionFullModeSlot } from "@/lib/questions/full-mode-concurrency";
import {
  MAX_QUESTION_PAGE_SIZE,
  parseQuestionListMode,
  QUESTION_LIST_PAYLOAD_LOG_MIN_BYTES,
  QUESTION_PAYLOAD_WARN_BYTES,
  type QuestionListResponseMode,
} from "@/lib/questions/question-api-limits";
import { estimateJsonUtf8Bytes } from "@/lib/questions/question-payload-metrics";
import { diagnoseSubscriberQuestionListEmpty } from "@/lib/questions/question-list-empty-diagnostics";
import { logLargeApiResponse } from "@/lib/observability/perf-log";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Deep offset pagination is expensive on large tables; reject before issuing heavy skip scans. */
const MAX_QUESTION_LIST_SKIP_ROWS = 4_000;

function logSubscriberPayload(
  approxPayloadBytes: number,
  meta: {
    responseMode: QuestionListResponseMode;
    rowCount: number;
    page: number;
    pageSize: number;
    topicRelaxed: boolean;
    userId: string;
  },
) {
  const payloadLarge = approxPayloadBytes >= QUESTION_PAYLOAD_WARN_BYTES ? 1 : 0;
  safeServerLog("api_questions", "subscriber_list_payload", {
    approxPayloadBytes,
    payloadLarge,
    rowCount: meta.rowCount,
    mode: meta.responseMode,
    page: meta.page,
    pageSize: meta.pageSize,
    topicRelaxed: meta.topicRelaxed ? 1 : 0,
  });
  if (payloadLarge) {
    safeServerLog("api_questions", "subscriber_list_payload_warn", {
      approxPayloadBytes,
      threshold: QUESTION_PAYLOAD_WARN_BYTES,
      userId: meta.userId,
      page: meta.page,
      pageSize: meta.pageSize,
    });
  }
  if (meta.responseMode === "full" || approxPayloadBytes >= QUESTION_LIST_PAYLOAD_LOG_MIN_BYTES) {
    safeServerLog("api_questions", "subscriber_list_payload_estimate", {
      approxPayloadBytes,
      rowCount: meta.rowCount,
      mode: meta.responseMode === "full" ? 1 : 0,
      page: meta.page,
      pageSize: meta.pageSize,
      topicRelaxed: meta.topicRelaxed ? 1 : 0,
    });
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSizeRaw = searchParams.get("pageSize");
  const pageSizeParsed = pageSizeRaw === null || pageSizeRaw === "" ? 10 : Number(pageSizeRaw);
  if (!Number.isFinite(pageSizeParsed) || !Number.isInteger(pageSizeParsed)) {
    return NextResponse.json(
      { error: "Invalid pageSize (must be an integer).", code: "invalid_page_size" },
      { status: 400 },
    );
  }
  if (pageSizeParsed < 1 || pageSizeParsed > MAX_QUESTION_PAGE_SIZE) {
    safeServerLog("api_questions", "page_size_rejected", {
      pageSize: pageSizeParsed,
      max: MAX_QUESTION_PAGE_SIZE,
      userId,
    });
    return NextResponse.json(
      {
        error: `pageSize must be between 1 and ${MAX_QUESTION_PAGE_SIZE}.`,
        code: "page_size_limit",
        maxPageSize: MAX_QUESTION_PAGE_SIZE,
      },
      { status: 400 },
    );
  }
  const pageSize = pageSizeParsed;

  const topicFilter = searchParams.get("topic")?.trim();
  const pathwayIdParam = searchParams.get("pathwayId")?.trim();
  const responseMode = parseQuestionListMode(searchParams.get("mode"));

  const skipRows = (page - 1) * pageSize;
  if (skipRows > MAX_QUESTION_LIST_SKIP_ROWS) {
    safeServerLog("api_questions", "pagination_depth_rejected", {
      skipRows,
      maxSkipRows: MAX_QUESTION_LIST_SKIP_ROWS,
      page,
      pageSize,
      userId,
      abuse: 1,
    });
    return NextResponse.json(
      {
        error: "Page too deep for this list. Use topic or pathway filters, or a narrower query.",
        code: "pagination_depth",
        maxSkipRows: MAX_QUESTION_LIST_SKIP_ROWS,
      },
      { status: 400 },
    );
  }

  let entitlement;
  try {
    entitlement = await resolveEntitlement(userId);
  } catch (e) {
    safeServerLogCritical("api_questions", "entitlement_resolve_failed", { page }, e, { flow: "questions_load" });
    return NextResponse.json(
      { error: "Unable to verify access. Try again shortly.", code: "access_verify_failed" },
      { status: 503 },
    );
  }

  if (entitlement.hasAccess) {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    setSentryServerContext({ route: "/api/questions", feature: "question", userId: gate.userId });

    await seedMinimalQuestionBankIfEmpty();

    if (responseMode === "full" && !acquireQuestionFullModeSlot(gate.userId)) {
      safeServerLog("api_questions", "full_mode_concurrency_limit", { userId: gate.userId });
      return NextResponse.json(
        { error: "Too many concurrent full-mode question requests. Try again shortly.", code: "rate_limited" },
        { status: 429 },
      );
    }

    try {
      const previewSelect = {
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
          select: responseMode === "full" ? fullSelect : previewSelect,
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
            select: responseMode === "full" ? fullSelect : previewSelect,
            orderBy: { updatedAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
          }),
        );
        if (questions.length > 0) topicRelaxed = true;
      }

      const payload =
        responseMode === "preview"
          ? questions.map((q) => ({
              ...q,
              stem: q.stem.length > 280 ? `${q.stem.slice(0, 280).trim()}…` : q.stem,
            }))
          : questions;

      const approxPayloadBytes = estimateJsonUtf8Bytes(payload);
      logSubscriberPayload(approxPayloadBytes, {
        responseMode,
        rowCount: payload.length,
        page,
        pageSize,
        topicRelaxed,
        userId: gate.userId,
      });

      let listEmptyDiagnostics: Awaited<ReturnType<typeof diagnoseSubscriberQuestionListEmpty>> | undefined;
      if (payload.length === 0) {
        listEmptyDiagnostics = await diagnoseSubscriberQuestionListEmpty({
          entitlement: gate.entitlement,
          pathwayIdParam: pathwayIdParam ?? null,
          topicFilter: topicRelaxed ? null : topicFilter && topicFilter.length > 0 ? topicFilter : null,
        });
        safeServerLog("api_questions", "subscriber_list_empty", {
          code: listEmptyDiagnostics.code,
          publishedGlobal: listEmptyDiagnostics.counts.publishedGlobal,
          entitlementPublished: listEmptyDiagnostics.counts.entitlementPublished,
          listScopePublished: listEmptyDiagnostics.counts.listScopePublished,
        });
      }

      const subscriberBody = {
        page,
        pageSize,
        questions: payload,
        mode: "subscriber" as const,
        fields: responseMode,
        pathwayIdApplied: pathway?.id ?? null,
        pathwayIdRequested: pathwayIdParam && pathwayIdParam.length > 0 ? pathwayIdParam : null,
        topicRequested: topicFilter && topicFilter.length > 0 ? topicFilter : null,
        topicRelaxed,
        ...(listEmptyDiagnostics
          ? {
              diagnostics:
                process.env.NODE_ENV === "production"
                  ? { code: listEmptyDiagnostics.code }
                  : listEmptyDiagnostics,
            }
          : {}),
      };
      logLargeApiResponse("/api/questions", estimateJsonUtf8Bytes(subscriberBody));
      return NextResponse.json(subscriberBody);
    } catch (e) {
      safeServerLogCritical("api_questions", "prisma_find_failed", { page }, e, { flow: "questions_load" });
      return NextResponse.json(
        { error: "Unable to load questions. Try again shortly.", code: "service_unavailable" },
        { status: 503 },
      );
    } finally {
      if (responseMode === "full") {
        releaseQuestionFullModeSlot(gate.userId);
      }
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { country: true, tier: true, freeQuestionViews: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401 });
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

  if (responseMode === "full" && !acquireQuestionFullModeSlot(userId)) {
    safeServerLog("api_questions", "full_mode_concurrency_limit_freemium", { userId });
    return NextResponse.json(
      { error: "Too many concurrent full-mode question requests. Try again shortly.", code: "rate_limited" },
      { status: 429 },
    );
  }

  try {
    const where = freemiumQuestionWhereForProfile(user.country as CountryCode, user.tier as TierCode);
    const questions = await withRetry(() =>
      prisma.examQuestion.findMany({
        where,
        select:
          responseMode === "full"
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
      responseMode === "full"
        ? questions
        : questions.map((q) => ({
            ...q,
            stem: q.stem.length > 280 ? `${q.stem.slice(0, 280).trim()}…` : q.stem,
          }));

    const freemiumApproxBytes = estimateJsonUtf8Bytes(sanitized);
    safeServerLog("api_questions", "freemium_list_payload", {
      approxPayloadBytes: freemiumApproxBytes,
      payloadLarge: freemiumApproxBytes >= QUESTION_PAYLOAD_WARN_BYTES ? 1 : 0,
      rowCount: sanitized.length,
      mode: responseMode,
    });
    if (freemiumApproxBytes >= QUESTION_PAYLOAD_WARN_BYTES) {
      safeServerLog("api_questions", "freemium_list_payload_warn", {
        approxPayloadBytes: freemiumApproxBytes,
        threshold: QUESTION_PAYLOAD_WARN_BYTES,
        userId,
      });
    }
    if (responseMode === "full" || freemiumApproxBytes >= QUESTION_LIST_PAYLOAD_LOG_MIN_BYTES) {
      safeServerLog("api_questions", "freemium_list_payload_estimate", {
        approxPayloadBytes: freemiumApproxBytes,
        rowCount: sanitized.length,
        mode: responseMode === "full" ? 1 : 0,
      });
    }

    const freemiumBody = {
      page: 1,
      pageSize: take,
      questions: sanitized,
      mode: "freemium" as const,
      fields: responseMode,
      freemiumRemainingAfterBatch: remaining,
    };
    logLargeApiResponse("/api/questions", estimateJsonUtf8Bytes(freemiumBody));
    return NextResponse.json(freemiumBody);
  } catch (e) {
    safeServerLogCritical("api_questions", "prisma_find_failed_freemium", { page }, e, { flow: "questions_load" });
    return NextResponse.json(
      { error: "Unable to load questions. Try again shortly.", code: "service_unavailable" },
      { status: 503 },
    );
  } finally {
    if (responseMode === "full") {
      releaseQuestionFullModeSlot(userId);
    }
  }
}
