import { NextRequest, NextResponse } from "next/server";
import { ExamFamily, Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { emitStructuredLog } from "@/lib/observability/structured-log";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import type { CountryCode, TierCode } from "@prisma/client";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { questionAccessWhereWithPathway } from "@/lib/exam-pathways/pathway-content-scope";
import { subscriptionCoversPathwayBase } from "@/lib/exam-pathways/pathway-entitlements";
import { seedMinimalQuestionBankIfEmpty } from "@/lib/exams/seed-minimal-question-bank";
import { allowRuntimeMinimalQuestionBankSeed } from "@/lib/jobs/runtime-heavy-work-policy";
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
import { jsonResponseGuarded } from "@/lib/server/response-guard";
import { MAX_LIST_SKIP_ROWS_DEFAULT } from "@/lib/api/api-pagination-limits";
import { FREEMIUM_QUESTION_LIST_MAX_PER_REQUEST } from "@/lib/conversion/constants";
import { parseCommaSeparatedQuestionIds } from "@/lib/questions/question-id-list-param";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { localizeQuestionListForApi } from "@/lib/i18n/educational-content-overlay";
import { resolveMergedQuestionOverlayBundle } from "@/lib/i18n/educational-translation-db";
import { getMarketingLocaleFromRequestCookie } from "@/lib/i18n/marketing-locale-cookie";
import { enforceQuestionsListProtection } from "@/lib/http/api-protection";
import { logDurabilityEvent } from "@/lib/durability/durability-log";
import { getPaidContentStaleCache } from "@/lib/durability/paid-content-stale-cache";
import { subscriberQuestionsListStaleKey } from "@/lib/durability/questions-list-stale-key";
import {
  difficultyBoundsSql,
  examEqualsFilterSql,
  examQuestionAccessWhereSql,
  excludeQuestionIdsSql,
  freemiumExamQuestionWhereSql,
  includeQuestionIdsSql,
  pathwayExamKeysSql,
  topicEqualsSql,
} from "@/lib/questions/exam-question-access-sql";
import { getWeakTopicTargetsForPractice } from "@/lib/learner/topic-performance";
import { takeForIdIn } from "@/lib/db/prisma-find-many-bounds";

/** Keep numeric literal — Next segment config must be statically analyzable (see `API_ROUTE_MAX_DURATION_LIST_HEAVY_SEC`). */
export const maxDuration = 60;

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

function parseMistakeIdsParam(raw: string | null): string[] {
  return parseExcludeIdsParam(raw);
}

function parseDifficultyBound(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null;
  const n = Number(raw.trim());
  if (!Number.isInteger(n) || n < 1 || n > 5) return null;
  return n;
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
  const mistakeIds = parseMistakeIdsParam(searchParams.get("mistakeIds"));
  /** Deep-link drill: restrict pool to these ids (takes precedence over `mistakeIds` when non-empty). */
  const includeIds = parseCommaSeparatedQuestionIds(searchParams.get("includeIds"));
  const focusIds = includeIds.length > 0 ? includeIds : mistakeIds;
  const examFilterRaw = searchParams.get("exam")?.trim() ?? "";
  const examFilter = examFilterRaw.length > 0 && examFilterRaw.length <= 64 ? examFilterRaw : null;
  const difficultyMin = parseDifficultyBound(searchParams.get("difficultyMin"));
  const difficultyMax = parseDifficultyBound(searchParams.get("difficultyMax"));
  if (difficultyMin != null && difficultyMax != null && difficultyMin > difficultyMax) {
    return NextResponse.json(
      { error: "difficultyMin must be less than or equal to difficultyMax.", code: "invalid_difficulty_range" },
      { status: 400 },
    );
  }
  const educationalLocale = getMarketingLocaleFromRequestCookie(req);
  const questionOverlayBundle = await resolveMergedQuestionOverlayBundle(educationalLocale);

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

    const rateLimited = await enforceQuestionsListProtection(req, gate.userId, pageSize);
    if (rateLimited) return rateLimited;

    if (allowRuntimeMinimalQuestionBankSeed()) {
      await seedMinimalQuestionBankIfEmpty();
    }

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
        if (examFilter) {
          parts.push({ exam: examFilter });
        }
        if (difficultyMin != null || difficultyMax != null) {
          parts.push({
            difficulty: {
              ...(difficultyMin != null ? { gte: difficultyMin } : {}),
              ...(difficultyMax != null ? { lte: difficultyMax } : {}),
            },
          });
        }
        if (focusIds.length > 0) {
          parts.push({ id: { in: focusIds } });
        }
        if (excludeIds.length > 0) {
          parts.push({ id: { notIn: excludeIds } });
        }
        return parts.length === 1 ? parts[0]! : { AND: parts };
      };

      const focusPoolSql = includeQuestionIdsSql(focusIds);
      const examExtraSql = examFilter ? examEqualsFilterSql(examFilter) : Prisma.empty;
      const difficultySqlFrag = difficultyBoundsSql(difficultyMin, difficultyMax);
      const subtopicSql =
        topicCodeFilter && topicCodeFilter.length > 0
          ? Prisma.sql` AND subtopic = ${topicCodeFilter}`
          : Prisma.empty;

      let topicRelaxed = false;
      let questions;

      if (sort === "random") {
        const usePrismaRandomSelection = studyModeFilters.length > 0 || pathway?.examFamily === ExamFamily.NP;
        if (usePrismaRandomSelection) {
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
            WHERE ${accessSql} ${pathSql} ${topicSql} ${subtopicSql} ${examExtraSql} ${difficultySqlFrag} ${focusPoolSql} ${exSql}
            ORDER BY random()
            LIMIT ${effectivePageSize}
          `,
          );

          if (idRows.length === 0 && topicFilterResolved && topicFilterResolved.length > 0) {
            topicSql = Prisma.empty;
            idRows = await withRetry(() =>
              prisma.$queryRaw<{ id: string }[]>`
              SELECT id FROM exam_questions
              WHERE ${accessSql} ${pathSql} ${topicSql} ${subtopicSql} ${examExtraSql} ${difficultySqlFrag} ${focusPoolSql} ${exSql}
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
              take: takeForIdIn(ids),
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

      const payload = localizeQuestionListForApi(
        questions as Array<Record<string, unknown>>,
        responseMode,
        educationalLocale,
        questionOverlayBundle,
      );

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
        ...(educationalLocale !== DEFAULT_MARKETING_LOCALE
          ? { educationalContentLocale: educationalLocale }
          : {}),
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
      getPaidContentStaleCache().set(
        subscriberQuestionsListStaleKey(gate.userId, req.nextUrl.searchParams),
        subscriberBody,
      );
      return jsonResponseGuarded("/api/questions", subscriberBody);
    } catch (e) {
      const staleKey = subscriberQuestionsListStaleKey(gate.userId, req.nextUrl.searchParams);
      const stale = getPaidContentStaleCache().get<Record<string, unknown>>(staleKey);
      if (stale) {
        logDurabilityEvent({
          event: "content_fallback_served",
          route: "/api/questions",
          subsystem: "question",
          durationMs: 0,
          fallbackUsed: true,
          reason: "subscriber_list_stale",
        });
        return NextResponse.json(stale, { headers: { "X-NurseNest-Content-Fallback": "1" } });
      }
      emitStructuredLog("question_load_failed", "error", {
        correlationId: correlationIdFromRequest(req),
        route: "/api/questions",
        method: "GET",
        flow: "content",
        httpStatus: 503,
        degraded: false,
        errorClass: e instanceof Error ? e.name : "unknown",
        message: "subscriber question list failure",
      });
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

  if (page > 1) {
    return NextResponse.json(
      {
        error: "Complimentary preview is limited to a single page. Subscribe for full question bank access.",
        code: "freemium_no_pagination",
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

  setSentryServerContext({ route: "/api/questions", feature: SERVER_FEATURE.question, userId });

  if (allowRuntimeMinimalQuestionBankSeed()) {
    await seedMinimalQuestionBankIfEmpty();
  }

  const snap = await getFreemiumSnapshot(userId);
  if (!snap || snap.questionRemaining <= 0) {
    return NextResponse.json({ code: "not_subscribed", message: "Subscription required", freemiumExhausted: true }, { status: 403 });
  }

  /** Non-subscribers: fixed small batch, preview fields only — ignores pathway/topic/study filters and mode=full. */
  const take = Math.min(FREEMIUM_QUESTION_LIST_MAX_PER_REQUEST, snap.questionRemaining);
  const freemiumFields: QuestionListResponseMode = "preview";

  const freemiumRateLimited = await enforceQuestionsListProtection(req, userId, take);
  if (freemiumRateLimited) return freemiumRateLimited;

  try {
    const country = user.country as CountryCode;
    const tier = user.tier as TierCode;
    const freeSql = freemiumExamQuestionWhereSql(country, tier);

    const previewFreemiumSelect = {
      id: true,
      stem: true,
      questionType: true,
      options: true,
      difficulty: true,
      exam: true,
      topic: true,
      bodySystem: true,
    } as const;

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
        select: previewFreemiumSelect,
        take: takeForIdIn(ids),
      }),
    );
    const order = new Map(ids.map((id, i) => [id, i]));
    const questions = [...rows].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

    const remaining = snap.questionRemaining;
    const sanitized = localizeQuestionListForApi(
      questions as Array<Record<string, unknown>>,
      freemiumFields,
      educationalLocale,
      questionOverlayBundle,
    );

    const freemiumApproxBytes = estimateJsonUtf8Bytes(sanitized);
    safeServerLog("api_questions", "freemium_list_payload", {
      approxPayloadBytes: freemiumApproxBytes,
      payloadLarge: freemiumApproxBytes >= QUESTION_PAYLOAD_WARN_BYTES ? 1 : 0,
      rowCount: sanitized.length,
      mode: freemiumFields,
    });
    if (freemiumApproxBytes >= QUESTION_PAYLOAD_WARN_BYTES) {
      safeServerLog("api_questions", "freemium_list_payload_warn", {
        approxPayloadBytes: freemiumApproxBytes,
        threshold: QUESTION_PAYLOAD_WARN_BYTES,
        userId,
      });
    }
    if (freemiumApproxBytes >= QUESTION_LIST_PAYLOAD_LOG_MIN_BYTES) {
      safeServerLog("api_questions", "freemium_list_payload_estimate", {
        approxPayloadBytes: freemiumApproxBytes,
        rowCount: sanitized.length,
        mode: 0,
      });
    }

    const freemiumBody = {
      page: 1,
      pageSize: take,
      questions: sanitized,
      mode: "freemium" as const,
      fields: freemiumFields,
      sort: "random" as const,
      excludeIdsCount: excludeIds.length,
      freemiumRemainingAfterBatch: remaining,
      rationaleLocked: true as const,
      upgradeRequiredFor: ["full_question_bank", "rationales", "filters", "pathway_scoped_bank"] as const,
      ...(educationalLocale !== DEFAULT_MARKETING_LOCALE
        ? { educationalContentLocale: educationalLocale }
        : {}),
    };
    logLargeApiResponse("/api/questions", estimateJsonUtf8Bytes(freemiumBody));
    return jsonResponseGuarded("/api/questions", freemiumBody);
  } catch (e) {
    emitStructuredLog("question_load_failed", "error", {
      correlationId: correlationIdFromRequest(req),
      route: "/api/questions",
      method: "GET",
      flow: "content",
      httpStatus: 503,
      errorClass: e instanceof Error ? e.name : "unknown",
      message: "freemium question list failure",
    });
    safeServerLogCritical("api_questions", "prisma_find_failed_freemium", { page }, e, { flow: "questions_load" });
    return NextResponse.json(
      { error: "Unable to load questions. Try again shortly.", code: "service_unavailable" },
      { status: 503 },
    );
  }
}
