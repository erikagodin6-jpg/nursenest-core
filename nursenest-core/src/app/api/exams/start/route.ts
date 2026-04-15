import { NextRequest, NextResponse } from "next/server";
import { ContentStatus, ExamSessionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere, userCanAccessExam } from "@/lib/entitlements/content-access-scope";
import { notSubscribedResponse, requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { logPaywallDeny } from "@/lib/entitlements/assert-question-access";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { productEvent } from "@/lib/observability/product-events";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import { MAX_SESSION_QUESTION_IDS } from "@/lib/exams/exam-session-bounds";
import {
  EXAM_CA_RN_FULL_2026_ID,
  EXAM_CA_RPN_FULL_2026_ID,
  EXAM_NP_CLINICAL_PRACTICE_2026_ID,
  EXAM_PN_MIXED_PRACTICE_2026_ID,
  EXAM_PRESET_CA_RN_FULL_2026_TAG,
  EXAM_PRESET_CA_RPN_FULL_2026_TAG,
  EXAM_PRESET_NP_CLINICAL_2026_TAG,
  EXAM_PRESET_PN_MIXED_2026_TAG,
  EXAM_PRESET_RN_MIXED_2026_TAG,
  EXAM_PRESET_US_PN_FULL_2026_TAG,
  EXAM_PRESET_US_RN_FULL_2026_TAG,
  EXAM_RN_MIXED_PRACTICE_2026_ID,
  EXAM_US_PN_FULL_2026_ID,
  EXAM_US_RN_FULL_2026_ID,
  FULL_EXAM_2026_QUESTION_TARGET,
  MIXED_PRACTICE_2026_EXAM_ID,
  MIXED_PRACTICE_2026_QUESTION_TARGET,
  MIXED_PRACTICE_2026_RN_PN_TAG,
  NP_CLINICAL_2026_QUESTION_TARGET,
} from "@/lib/exams/practice-exam-presets";
import { seedMinimalQuestionBankIfEmpty } from "@/lib/exams/seed-minimal-question-bank";
import { diagnoseExamStartEmpty } from "@/lib/questions/exam-start-empty-diagnostics";
import { QUESTION_PAYLOAD_WARN_BYTES } from "@/lib/questions/question-api-limits";
import { estimateJsonUtf8Bytes } from "@/lib/questions/question-payload-metrics";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { mergeQuestionApiPayload } from "@/lib/i18n/educational-content-overlay";
import { resolveMergedQuestionOverlayBundle } from "@/lib/i18n/educational-translation-db";
import { getMarketingLocaleFromRequestCookie } from "@/lib/i18n/marketing-locale-cookie";

const DEFAULT_POOL_LIMIT = Math.min(20, MAX_SESSION_QUESTION_IDS);
/** Large enough to shuffle 75-Q full exams from tagged pools without starving draws. */
const TAG_POOL_FETCH = Math.min(800, MAX_SESSION_QUESTION_IDS);

function shuffleIds<T extends { id: string }>(rows: T[]): T[] {
  const copy = [...rows];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

/** Map Prisma difficulty (typically 1–5) to NCLEX-style bands for mixed-difficulty full exams. */
function difficultyBand(d: number | null | undefined): "low" | "mid" | "high" {
  const x = typeof d === "number" && Number.isFinite(d) ? Math.round(d) : 3;
  const clamped = Math.min(5, Math.max(1, x));
  if (clamped <= 2) return "low";
  if (clamped >= 4) return "high";
  return "mid";
}

/**
 * Build a ~balanced pool across difficulty bands (e.g. 75 Q) before a final shuffle so mocks are not all one level.
 */
function pickStratifiedByDifficulty<T extends { id: string; difficulty: number | null }>(
  rows: T[],
  limit: number,
): T[] {
  if (rows.length <= limit) return shuffleIds([...rows]);
  const buckets = { low: [] as T[], mid: [] as T[], high: [] as T[] };
  for (const r of rows) {
    buckets[difficultyBand(r.difficulty)].push(r);
  }
  shuffleIds(buckets.low);
  shuffleIds(buckets.mid);
  shuffleIds(buckets.high);
  const base = Math.floor(limit / 3);
  const quotas = { low: base, mid: base, high: base };
  let rem = limit - base * 3;
  const order: ("low" | "mid" | "high")[] = ["mid", "low", "high"];
  let o = 0;
  while (rem > 0) {
    quotas[order[o % 3]!] += 1;
    o += 1;
    rem -= 1;
  }
  const out: T[] = [];
  function take(bucket: T[], n: number) {
    let k = n;
    while (k > 0 && bucket.length > 0 && out.length < limit) {
      out.push(bucket.shift()!);
      k -= 1;
    }
  }
  take(buckets.low, quotas.low);
  take(buckets.mid, quotas.mid);
  take(buckets.high, quotas.high);
  const rest = [...buckets.low, ...buckets.mid, ...buckets.high];
  shuffleIds(rest);
  while (out.length < limit && rest.length > 0) out.push(rest.shift()!);
  return shuffleIds(out).slice(0, limit);
}

export async function POST(req: NextRequest) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/exams/start", feature: SERVER_FEATURE.exam, userId: gate.userId });

  await seedMinimalQuestionBankIfEmpty();

  const educationalLocale = getMarketingLocaleFromRequestCookie(req);
  const questionOverlayBundle = await resolveMergedQuestionOverlayBundle(educationalLocale);
  const localizeStartQuestion = (q: {
    id: string;
    stem: string;
    options: unknown;
    questionType: unknown;
    difficulty: unknown;
  }) =>
    mergeQuestionApiPayload({ ...q } as Record<string, unknown>, educationalLocale, questionOverlayBundle, {
      teachingExposure: "none",
    });

  let examId: string | null = null;
  let hydrate: "full" | "window" = "window";
  let questionTag: string | null = null;
  let timedMode = false;
  let timeLimitSec: number | null = null;
  try {
    const b = (await req.json()) as {
      examId?: string;
      hydrate?: string;
      questionTag?: string;
      timedMode?: boolean;
      timeLimitSec?: number | null;
    };
    examId = typeof b?.examId === "string" && b.examId.length > 4 ? b.examId : null;
    if (b?.hydrate === "full") hydrate = "full";
    if (typeof b?.questionTag === "string" && b.questionTag.trim().length > 2) {
      questionTag = b.questionTag.trim();
    }
    if (typeof b?.timedMode === "boolean") timedMode = b.timedMode;
    if (typeof b?.timeLimitSec === "number" && Number.isFinite(b.timeLimitSec)) {
      timeLimitSec = Math.min(Math.max(60, Math.floor(b.timeLimitSec)), 28_800);
    }
  } catch {
    /* optional body */
  }

  if (timedMode && timeLimitSec == null) {
    timeLimitSec = 90 * 60;
  }
  if (!timedMode) {
    timeLimitSec = null;
  }

  const effectiveExamId =
    questionTag === MIXED_PRACTICE_2026_RN_PN_TAG
      ? MIXED_PRACTICE_2026_EXAM_ID
      : questionTag === EXAM_PRESET_RN_MIXED_2026_TAG
        ? EXAM_RN_MIXED_PRACTICE_2026_ID
        : questionTag === EXAM_PRESET_PN_MIXED_2026_TAG
          ? EXAM_PN_MIXED_PRACTICE_2026_ID
          : questionTag === EXAM_PRESET_NP_CLINICAL_2026_TAG
            ? EXAM_NP_CLINICAL_PRACTICE_2026_ID
            : questionTag === EXAM_PRESET_US_RN_FULL_2026_TAG
              ? EXAM_US_RN_FULL_2026_ID
              : questionTag === EXAM_PRESET_CA_RN_FULL_2026_TAG
                ? EXAM_CA_RN_FULL_2026_ID
                : questionTag === EXAM_PRESET_US_PN_FULL_2026_TAG
                  ? EXAM_US_PN_FULL_2026_ID
                  : questionTag === EXAM_PRESET_CA_RPN_FULL_2026_TAG
                    ? EXAM_CA_RPN_FULL_2026_ID
                    : examId;

  if (effectiveExamId) {
    const exam = await withRetry(() =>
      prisma.exam.findUnique({
        where: { id: effectiveExamId },
        select: { id: true, status: true, country: true, tier: true },
      }),
    );
    if (!exam || exam.status !== ContentStatus.PUBLISHED) {
      return NextResponse.json({ error: "Exam not found", code: "exam_not_found" }, { status: 404 });
    }
    if (!userCanAccessExam(gate.entitlement, exam)) {
      logPaywallDeny("/api/exams/start", "exam_out_of_scope", { examId: effectiveExamId });
      return notSubscribedResponse();
    }
  }

  try {
    const baseWhere = questionAccessWhere(gate.entitlement);
    const presetWhere =
      questionTag === MIXED_PRACTICE_2026_RN_PN_TAG
        ? { AND: [baseWhere, { tags: { has: MIXED_PRACTICE_2026_RN_PN_TAG } }] }
        : questionTag === EXAM_PRESET_RN_MIXED_2026_TAG
          ? {
              AND: [
                baseWhere,
                { tags: { has: EXAM_PRESET_RN_MIXED_2026_TAG } },
                { tier: "rn" },
              ],
            }
          : questionTag === EXAM_PRESET_PN_MIXED_2026_TAG
            ? {
                AND: [
                  baseWhere,
                  { tags: { has: EXAM_PRESET_PN_MIXED_2026_TAG } },
                  { tier: { in: ["rpn", "lvn"] } },
                ],
              }
            : questionTag === EXAM_PRESET_NP_CLINICAL_2026_TAG
              ? {
                  AND: [
                    baseWhere,
                    { tags: { has: EXAM_PRESET_NP_CLINICAL_2026_TAG } },
                    { tier: "np" },
                  ],
                }
              : questionTag === EXAM_PRESET_US_RN_FULL_2026_TAG
                ? {
                    AND: [
                      baseWhere,
                      { tags: { has: EXAM_PRESET_US_RN_FULL_2026_TAG } },
                      { tier: "rn" },
                    ],
                  }
                : questionTag === EXAM_PRESET_CA_RN_FULL_2026_TAG
                  ? {
                      AND: [
                        baseWhere,
                        { tags: { has: EXAM_PRESET_CA_RN_FULL_2026_TAG } },
                        { tier: "rn" },
                      ],
                    }
                  : questionTag === EXAM_PRESET_US_PN_FULL_2026_TAG
                    ? {
                        AND: [
                          baseWhere,
                          { tags: { has: EXAM_PRESET_US_PN_FULL_2026_TAG } },
                          { tier: { in: ["rpn", "lvn"] } },
                        ],
                      }
                    : questionTag === EXAM_PRESET_CA_RPN_FULL_2026_TAG
                      ? {
                          AND: [
                            baseWhere,
                            { tags: { has: EXAM_PRESET_CA_RPN_FULL_2026_TAG } },
                            { tier: { in: ["rpn", "lvn"] } },
                          ],
                        }
                      : questionTag
                        ? { AND: [baseWhere, { tags: { has: questionTag } }] }
                        : baseWhere;
    const isFull75Preset =
      questionTag === EXAM_PRESET_US_RN_FULL_2026_TAG ||
      questionTag === EXAM_PRESET_CA_RN_FULL_2026_TAG ||
      questionTag === EXAM_PRESET_US_PN_FULL_2026_TAG ||
      questionTag === EXAM_PRESET_CA_RPN_FULL_2026_TAG;

    const poolLimit =
      questionTag === MIXED_PRACTICE_2026_RN_PN_TAG ||
      questionTag === EXAM_PRESET_RN_MIXED_2026_TAG ||
      questionTag === EXAM_PRESET_PN_MIXED_2026_TAG
        ? Math.min(MIXED_PRACTICE_2026_QUESTION_TARGET, MAX_SESSION_QUESTION_IDS)
        : questionTag === EXAM_PRESET_NP_CLINICAL_2026_TAG
          ? Math.min(NP_CLINICAL_2026_QUESTION_TARGET, MAX_SESSION_QUESTION_IDS)
          : isFull75Preset
            ? Math.min(FULL_EXAM_2026_QUESTION_TARGET, MAX_SESSION_QUESTION_IDS)
            : DEFAULT_POOL_LIMIT;

    const questionPoolRaw = await withRetry(() =>
      prisma.examQuestion.findMany({
        where: presetWhere,
        select: { id: true, stem: true, options: true, questionType: true, difficulty: true },
        take: questionTag ? TAG_POOL_FETCH : poolLimit,
      }),
    );

    const useStratifiedFullExam =
      isFull75Preset &&
      (questionTag === EXAM_PRESET_US_RN_FULL_2026_TAG ||
        questionTag === EXAM_PRESET_US_PN_FULL_2026_TAG ||
        questionTag === EXAM_PRESET_CA_RN_FULL_2026_TAG ||
        questionTag === EXAM_PRESET_CA_RPN_FULL_2026_TAG);

    const questionPool = questionTag
      ? useStratifiedFullExam
        ? pickStratifiedByDifficulty(questionPoolRaw, poolLimit)
        : shuffleIds(questionPoolRaw).slice(0, poolLimit)
      : questionPoolRaw.slice(0, poolLimit);

    const session = await prisma.examSession.create({
      data: {
        userId: gate.userId,
        examId: effectiveExamId,
        questionIds: questionPool.map((q) => q.id),
        answers: {},
        currentIndex: 0,
        status: ExamSessionStatus.IN_PROGRESS,
        timedMode,
        timeLimitSec,
        elapsedMs: 0,
      },
    });

    const poolDiagnostics =
      questionPool.length === 0 ? await diagnoseExamStartEmpty(gate.entitlement) : undefined;

    if (questionPool.length === 0) {
      productEvent("exam_pool_empty", { hasExamId: !!effectiveExamId });
      if (poolDiagnostics) {
        safeServerLog("api_exams_start", "pool_empty", {
          code: poolDiagnostics.code,
          publishedGlobal: poolDiagnostics.counts.publishedGlobal,
          entitlementPublished: poolDiagnostics.counts.entitlementPublished,
        });
      }
    }
    productEvent("exam_start", { total: questionPool.length, tagged: questionTag ? 1 : 0 });

    const questionIds = questionPool.map((q) => q.id);

    if (hydrate === "window") {
      const windowBody = {
        sessionId: session.id,
        examId: effectiveExamId,
        total: questionPool.length,
        questionIds,
        questions: questionPool.length ? [localizeStartQuestion(questionPool[0]!)] : [],
        poolEmpty: questionPool.length === 0,
        hydrate: "window" as const,
        timedMode,
        timeLimitSec,
        elapsedMs: 0,
        ...(poolDiagnostics ? { diagnostics: poolDiagnostics } : {}),
      };
      const approxPayloadBytes = estimateJsonUtf8Bytes(windowBody);
      safeServerLog("api_exams_start", "response_payload", {
        hydrate: "window",
        approxPayloadBytes,
        poolSize: questionPool.length,
        payloadLarge: approxPayloadBytes >= QUESTION_PAYLOAD_WARN_BYTES ? 1 : 0,
      });
      if (approxPayloadBytes >= QUESTION_PAYLOAD_WARN_BYTES) {
        safeServerLog("api_exams_start", "response_payload_warn", {
          approxPayloadBytes,
          threshold: QUESTION_PAYLOAD_WARN_BYTES,
        });
      }
      return NextResponse.json(windowBody);
    }

    const fullBody = {
      sessionId: session.id,
      examId: effectiveExamId,
      total: questionPool.length,
      questionIds,
      questions: questionPool.map(localizeStartQuestion),
      poolEmpty: questionPool.length === 0,
      hydrate: "full" as const,
      timedMode,
      timeLimitSec,
      elapsedMs: 0,
      ...(poolDiagnostics ? { diagnostics: poolDiagnostics } : {}),
    };
    const approxFullBytes = estimateJsonUtf8Bytes(fullBody);
    safeServerLog("api_exams_start", "response_payload", {
      hydrate: "full",
      approxPayloadBytes: approxFullBytes,
      poolSize: questionPool.length,
      payloadLarge: approxFullBytes >= QUESTION_PAYLOAD_WARN_BYTES ? 1 : 0,
    });
    if (approxFullBytes >= QUESTION_PAYLOAD_WARN_BYTES) {
      safeServerLog("api_exams_start", "response_payload_warn", {
        approxPayloadBytes: approxFullBytes,
        threshold: QUESTION_PAYLOAD_WARN_BYTES,
      });
    }
    return NextResponse.json(fullBody);
  } catch (e) {
    safeServerLogCritical("api_exams_start", "failed", {}, e, { flow: "exam_start" });
    return NextResponse.json(
      {
        error: "Unable to start exam session. Try again shortly.",
        code: "service_unavailable",
        questions: [],
        total: 0,
        poolEmpty: true,
      },
      { status: 503 },
    );
  }
}
