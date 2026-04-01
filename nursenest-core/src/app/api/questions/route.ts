import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { freemiumQuestionWhereForProfile, questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
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
import { MAX_LIST_SKIP_ROWS_DEFAULT } from "@/lib/api/api-pagination-limits";
import { enforceQuestionsListProtection } from "@/lib/http/api-protection";
import {
  examQuestionAccessWhereSql,
  excludeQuestionIdsSql,
  freemiumExamQuestionWhereSql,
  pathwayExamKeysSql,
  topicEqualsSql,
} from "@/lib/questions/exam-question-access-sql";
import { getWeakTopicTargetsForPractice } from "@/lib/learner/topic-performance";

/** Deep offset pagination is expensive on large tables; reject before issuing heavy skip scans. */
const MAX_QUESTION_LIST_SKIP_ROWS = MAX_LIST_SKIP_ROWS_DEFAULT;
const MAX_EXCLUDE_IDS = 400;

function parseExcludeIdsParam(raw: string | null): string[] {
  if (!raw || raw.trim().length === 0) return [];
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const out: string[] = [];
  const seen = new Set<string>();
  for (const p of parts) {
    if (p.length < 8 || p.length > 64) continue;
    if (seen.has(p)) continue;
    seen.add(p);
    out.push(p);
    if (out.length >= MAX_EXCLUDE_IDS) break;
  }
  return out;
}

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
  const topicCodeFilter = searchParams.get("topicCode")?.trim().toLowerCase();
  const pathwayIdParam = searchParams.get("pathwayId")?.trim();
  const responseMode = parseQuestionListMode(searchParams.get("mode"));
  const sortRaw = searchParams.get("sort")?.trim().toLowerCase() ?? "recent";
  const sort = sortRaw === "random" ? "random" : "recent";
  const excludeIds = parseExcludeIdsParam(searchParams.get("excludeIds"));

  if (sort === "random" && page > 1 && excludeIds.length === 0) {
    return NextResponse.json(
      {
        error: "Random mode uses page=1, or pass excludeIds for additional batches.",
        code: "random_page_invalid",
      },
      { status: 400 },
    );
  }

  const skipRows = sort === "random" ? 0 : (page - 1) * pageSize;
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
    setSentryServerContext({ route: "/api/questions", feature: SERVER_FEATURE.question, userId: gate.userId });

    const rateLimited = enforceQuestionsListProtection(req, gate.userId, pageSize);
    if (rateLimited) return rateLimited;

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
        subtopic: true,
        bodySystem: true,
      } as const;
      const fullSelect = {
        id: true,
        stem: true,
        questionType: true,
        rationale: true,
        options: true,
        topic: true,
        subtopic: true,
        exam: true,
      } as const;

      let pathway: ReturnType<typeof getExamPathwayById> | null = pathwayIdParam
        ? getExamPathwayById(pathwayIdParam) ?? null
        : null;
      if (pathway && !subscriptionCoversPathwayBase(gate.entitlement, pathway)) {
        pathway = null;
      }
      const baseWhere = questionAccessWhereWithPathway(gate.entitlement, pathway);

      const studyModeRaw = searchParams.get("studyMode")?.trim().toLowerCase() ?? "";
      const STUDY_MODES = new Set(["weak", "high_yield", "rapid", "final_prep"]);
      const studyMode = STUDY_MODES.has(studyModeRaw) ? studyModeRaw : null;
      const effectivePageSize = studyMode === "rapid" ? Math.min(pageSize, 8) : pageSize;
      const skipRowsEff = sort === "random" ? 0 : (page - 1) * effectivePageSize;

      let topicFilterResolved = topicFilter;
      let studyModeNote: string | null = null;
      let weakTopicCodeApplied: string | null = null;
      let weakTopicConfidence: "high" | "medium" | "low" | null = null;
      if (studyMode === "weak" && !topicFilterResolved) {
        const targets = await getWeakTopicTargetsForPractice(gate.userId, gate.entitlement, 4);
        const preferred = targets.find((t) => t.confidence !== "low") ?? targets[0];
        if (preferred?.topicCode) {
          topicFilterResolved = preferred.topicCode;
          weakTopicCodeApplied = preferred.topicCode;
          weakTopicConfidence = preferred.confidence;
          if (preferred.confidence === "low") {
            studyModeNote = "weak_topic_low_confidence";
          }
        } else {
          studyModeNote = "weak_topic_unavailable";
        }
      }

      const studyModeFilters: Prisma.ExamQuestionWhereInput[] = [];
      if (studyMode === "high_yield") {
        studyModeFilters.push({
          OR: [{ blueprintWeight: { gte: 0.35 } }, { difficulty: { gte: 4 } }],
        });
      }
      if (studyMode === "final_prep") {
        studyModeFilters.push({
          OR: [{ difficulty: { gte: 3 } }, { blueprintWeight: { gte: 0.25 } }],
        });
      }

      const buildWhereParts = (includeTopic: boolean): Prisma.ExamQuestionWhereInput => {
        const parts: Prisma.ExamQuestionWhereInput[] = [baseWhere, ...studyModeFilters];
        if (includeTopic && topicFilterResolved && topicFilterResolved.length > 0) {
          parts.push({ topic: topicFilterResolved });
        }
        if (includeTopic && topicCodeFilter && topicCodeFilter.length > 0) {
          parts.push({ subtopic: topicCodeFilter });
        }
        if (excludeIds.length > 0) {
          parts.push({ id: { notIn: excludeIds } });
        }
        return parts.length === 1 ? parts[0]! : { AND: parts };
      };

      let topicRelaxed = false;
      let questions;

      if (sort === "random") {
        if (studyModeFilters.length > 0) {
          const pool = await withRetry(() =>
            prisma.examQuestion.findMany({
              where: buildWhereParts(true),
              select: responseMode === "full" ? fullSelect : previewSelect,
              take: Math.min(160, Math.max(48, effectivePageSize * 12)),
            }),
          );
          const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, effectivePageSize);
          questions = shuffled;
        } else {
          const accessSql = examQuestionAccessWhereSql(gate.entitlement);
          const pathSql = pathwayExamKeysSql(pathway);
          const exSql = excludeQuestionIdsSql(excludeIds);
          let topicSql =
            topicFilterResolved && topicFilterResolved.length > 0 ? topicEqualsSql(topicFilterResolved) : Prisma.empty;

          let idRows = await withRetry(() =>
            prisma.$queryRaw<{ id: string }[]>`
            SELECT id FROM exam_questions
            WHERE ${accessSql} ${pathSql} ${topicSql} ${exSql}
            ORDER BY random()
            LIMIT ${effectivePageSize}
          `,
          );

          if (idRows.length === 0 && topicFilterResolved && topicFilterResolved.length > 0) {
            topicSql = Prisma.empty;
            idRows = await withRetry(() =>
              prisma.$queryRaw<{ id: string }[]>`
              SELECT id FROM exam_questions
              WHERE ${accessSql} ${pathSql} ${topicSql} ${exSql}
              ORDER BY random()
              LIMIT ${effectivePageSize}
            `,
            );
            if (idRows.length > 0) topicRelaxed = true;
          }

          const ids = idRows.map((r) => r.id);
          const rows = await withRetry(() =>
            prisma.examQuestion.findMany({
              where: { id: { in: ids } },
              select: responseMode === "full" ? fullSelect : previewSelect,
            }),
          );
          const order = new Map(ids.map((id, i) => [id, i]));
          questions = [...rows].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
        }
      } else {
        const whereWithTopic = buildWhereParts(true);
        questions = await withRetry(() =>
          prisma.examQuestion.findMany({
            where: whereWithTopic,
            select: responseMode === "full" ? fullSelect : previewSelect,
            orderBy: { updatedAt: "desc" },
            skip: skipRowsEff,
            take: effectivePageSize,
          }),
        );
        if (questions.length === 0 && topicFilterResolved && topicFilterResolved.length > 0) {
          questions = await withRetry(() =>
            prisma.examQuestion.findMany({
              where: buildWhereParts(false),
              select: responseMode === "full" ? fullSelect : previewSelect,
              orderBy: { updatedAt: "desc" },
              skip: skipRowsEff,
              take: effectivePageSize,
            }),
          );
          if (questions.length > 0) topicRelaxed = true;
        }
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
          topicFilter:
            topicRelaxed ? null : topicFilterResolved && topicFilterResolved.length > 0 ? topicFilterResolved : null,
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
        pageSize: effectivePageSize,
        studyMode: studyMode ?? null,
        studyModeNote,
        weakTopicCodeApplied,
        weakTopicConfidence,
        questions: payload,
        mode: "subscriber" as const,
        fields: responseMode,
        sort,
        excludeIdsCount: excludeIds.length,
        pathwayIdApplied: pathway?.id ?? null,
        pathwayIdRequested: pathwayIdParam && pathwayIdParam.length > 0 ? pathwayIdParam : null,
        topicRequested: topicFilterResolved && topicFilterResolved.length > 0 ? topicFilterResolved : null,
        topicCodeRequested: topicCodeFilter ?? null,
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

  setSentryServerContext({ route: "/api/questions", feature: SERVER_FEATURE.question, userId });

  await seedMinimalQuestionBankIfEmpty();

  const snap = await getFreemiumSnapshot(userId);
  if (!snap || snap.questionRemaining <= 0) {
    return NextResponse.json({ code: "not_subscribed", message: "Subscription required", freemiumExhausted: true }, { status: 403 });
  }

  const take = Math.min(pageSize, snap.questionRemaining);

  const freemiumRateLimited = enforceQuestionsListProtection(req, userId, take);
  if (freemiumRateLimited) return freemiumRateLimited;

  if (responseMode === "full" && !acquireQuestionFullModeSlot(userId)) {
    safeServerLog("api_questions", "full_mode_concurrency_limit_freemium", { userId });
    return NextResponse.json(
      { error: "Too many concurrent full-mode question requests. Try again shortly.", code: "rate_limited" },
      { status: 429 },
    );
  }

  try {
    const country = user.country as CountryCode;
    const tier = user.tier as TierCode;
    const baseFreemium = freemiumQuestionWhereForProfile(country, tier);
    const freeWhere =
      excludeIds.length > 0 ? { AND: [baseFreemium, { id: { notIn: excludeIds } }] } : baseFreemium;

    const previewFreemiumSelect = {
      id: true,
      stem: true,
      questionType: true,
      difficulty: true,
      exam: true,
      topic: true,
      bodySystem: true,
    } as const;
    const fullFreemiumSelect = {
      id: true,
      stem: true,
      questionType: true,
      options: true,
      topic: true,
      exam: true,
    } as const;

    let questions;

    if (sort === "random") {
      const freeSql = freemiumExamQuestionWhereSql(country, tier);
      const exSql = excludeQuestionIdsSql(excludeIds);
      const idRows = await withRetry(() =>
        prisma.$queryRaw<{ id: string }[]>`
          SELECT id FROM exam_questions
          WHERE ${freeSql} ${exSql}
          ORDER BY random()
          LIMIT ${take}
        `,
      );
      const ids = idRows.map((r) => r.id);
      const rows = await withRetry(() =>
        prisma.examQuestion.findMany({
          where: { id: { in: ids } },
          select: responseMode === "full" ? fullFreemiumSelect : previewFreemiumSelect,
        }),
      );
      const order = new Map(ids.map((id, i) => [id, i]));
      questions = [...rows].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    } else {
      questions = await withRetry(() =>
        prisma.examQuestion.findMany({
          where: freeWhere,
          select: responseMode === "full" ? fullFreemiumSelect : previewFreemiumSelect,
          orderBy: { updatedAt: "desc" },
          skip: 0,
          take,
        }),
      );
    }

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
      sort,
      excludeIdsCount: excludeIds.length,
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
