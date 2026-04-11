import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PracticeTestStatus } from "@prisma/client";
import { z } from "zod";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { advanceCatPracticeTest, finalizeCatPracticeTest } from "@/lib/practice-tests/cat-session";
/**
 * Topic ledger updates run only when a practice test completes (linear or CAT finalization).
 * Incremental recording on each CAT advance would double-count if the client retried the same step
 * or replayed answers; completion uses the full question id + answer set once.
 */
import { recordTopicOutcomesFromPracticeTest } from "@/lib/learner/topic-performance";
import { buildLinearCommitFeedback } from "@/lib/practice-tests/build-linear-commit-feedback";
import { getLinearCommittedQuestionIds, mergeLinearCommittedQuestionId } from "@/lib/practice-tests/practice-linear-engine";
import { enrichPracticeTestResultsWithCatCoach } from "@/lib/practice-tests/enrich-cat-results-coach";
import { computePracticeTestResults } from "@/lib/practice-tests/score-practice-test";
import { parsePracticeTestConfigAtBoundary } from "@/lib/practice-tests/practice-test-config-boundary";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";

function withCatSessionResultMeta(
  results: PracticeTestResultsJson,
  cfg: PracticeTestConfigJson,
  answeredInSession: number,
): PracticeTestResultsJson {
  if (cfg.selectionMode !== "cat") return results;
  const mode = cfg.catExamFeedbackMode ?? "test";
  return {
    ...results,
    catExamFeedbackMode: mode,
    ...(mode === "study" && answeredInSession > 0 ? { catStudyRationaleSteps: answeredInSession } : {}),
  };
}
import { buildPracticeTestTeachingReview } from "@/lib/practice-tests/build-teaching-review";
import {
  enforcePracticeTestDetailProtection,
  enforcePracticeTestMutationProtection,
} from "@/lib/http/api-protection";
import { mergeQuestionApiPayload } from "@/lib/i18n/educational-content-overlay";
import { resolveMergedQuestionOverlayBundle } from "@/lib/i18n/educational-translation-db";
import { getMarketingLocaleFromRequestCookie } from "@/lib/i18n/marketing-locale-cookie";
import {
  captureCatCoachGenerationAnalytics,
  capturePracticeTestCompletedAnalytics,
} from "@/lib/observability/learner-product-analytics";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const practiceTestRouteDeps = {
  requireSubscriberSession,
  prisma,
  findPracticeTest: (args: Parameters<typeof prisma.practiceTest.findFirst>[0]) => prisma.practiceTest.findFirst(args),
  updatePracticeTest: (args: Parameters<typeof prisma.practiceTest.update>[0]) => prisma.practiceTest.update(args),
  setSentryServerContext,
  advanceCatPracticeTest,
  finalizeCatPracticeTest,
  recordTopicOutcomesFromPracticeTest,
  enrichPracticeTestResultsWithCatCoach,
  computePracticeTestResults,
  parsePracticeTestConfigAtBoundary,
  capturePracticeTestCompletedAnalytics,
  captureCatCoachGenerationAnalytics,
  enforcePracticeTestDetailProtection,
  enforcePracticeTestMutationProtection,
};

const previewSelect = {
  id: true,
  stem: true,
  questionType: true,
  options: true,
  topic: true,
  subtopic: true,
  difficulty: true,
  exam: true,
  bodySystem: true,
} as const;

function asIdList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string" && x.length > 4);
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const gate = await practiceTestRouteDeps.requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const limited = practiceTestRouteDeps.enforcePracticeTestDetailProtection(req, gate.userId);
  if (limited) return limited;

  const { id } = await ctx.params;
  if (!id || id.length < 8) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  practiceTestRouteDeps.setSentryServerContext({
    route: "/api/practice-tests/[id]",
    feature: SERVER_FEATURE.practiceTest,
    userId: gate.userId,
  });

  const row = await practiceTestRouteDeps.findPracticeTest({
    where: { id, userId: gate.userId },
  });
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ids = asIdList(row.questionIds);

  const answers =
    typeof row.answers === "object" && row.answers !== null && !Array.isArray(row.answers)
      ? (row.answers as Record<string, unknown>)
      : {};

  const cfg = practiceTestRouteDeps.parsePracticeTestConfigAtBoundary(row.config, {
    practiceTestId: id,
    surface: "practice_test_api_get",
  });

  const teachingReviewRequested = req.nextUrl.searchParams.get("teachingReview") === "1";
  const hydrateFull = req.nextUrl.searchParams.get("hydrate") === "full";

  let teachingReview: Awaited<ReturnType<typeof buildPracticeTestTeachingReview>> | null = null;
  if (teachingReviewRequested && row.status === PracticeTestStatus.COMPLETED) {
    teachingReview = await buildPracticeTestTeachingReview(ids, answers, gate.entitlement);
  }

  const educationalLocale = getMarketingLocaleFromRequestCookie(req);
  const questionOverlayBundle = await resolveMergedQuestionOverlayBundle(educationalLocale);

  const base = questionAccessWhere(gate.entitlement);
  const ID_CHUNK = 200;
  let questions: Array<Record<string, unknown>> = [];

  if (!teachingReviewRequested && hydrateFull && ids.length > 0) {
    const qs = await withRetry(async () => {
      const acc: Array<{
        id: string;
        stem: string;
        questionType: string;
        options: unknown;
        topic: string | null;
        subtopic: string | null;
        difficulty: number | null;
        exam: string | null;
        bodySystem: string | null;
      }> = [];
      for (let i = 0; i < ids.length; i += ID_CHUNK) {
        const chunk = ids.slice(i, i + ID_CHUNK);
        const part = await prisma.examQuestion.findMany({
          where: { AND: [{ id: { in: chunk } }, base] },
          select: previewSelect,
        });
        acc.push(...part);
      }
      return acc;
    });
    const order = new Map(ids.map((qid, i) => [qid, i]));
    const sorted = [...qs].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    questions = sorted.map((q) => {
      const merged = mergeQuestionApiPayload({ ...q } as Record<string, unknown>, educationalLocale, questionOverlayBundle);
      const stem = String(merged.stem ?? "");
      return {
        ...merged,
        stem: stem.length > 2000 ? `${stem.slice(0, 1997)}…` : stem,
      };
    });
  }

  return NextResponse.json({
    id: row.id,
    title: row.title,
    status: row.status,
    config: cfg,
    timedMode: row.timedMode,
    timeLimitSec: row.timeLimitSec,
    elapsedMs: row.elapsedMs,
    cursorIndex: row.cursorIndex,
    answers,
    questionIds: ids,
    total: ids.length,
    questions,
    hydrate: hydrateFull ? ("full" as const) : ("minimal" as const),
    results: row.results as PracticeTestResultsJson | null,
    startedAt: row.startedAt.toISOString(),
    completedAt: row.completedAt?.toISOString() ?? null,
    adaptiveState: row.adaptiveState ?? null,
    catMode: cfg.selectionMode === "cat",
    ...(teachingReview ? { teachingReview } : {}),
    ...(teachingReviewRequested && row.status !== PracticeTestStatus.COMPLETED
      ? { teachingReviewUnavailable: true as const }
      : {}),
  });
}

const patchSchema = z.object({
  action: z.enum(["save", "complete", "abandon", "cat_advance", "linear_commit"]),
  answers: z.record(z.string(), z.unknown()).optional(),
  cursorIndex: z.number().int().min(0).optional(),
  elapsedMs: z.number().int().min(0).max(48 * 60 * 60 * 1000).optional(),
  questionId: z.string().min(8).max(80).optional(),
});

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const gate = await practiceTestRouteDeps.requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const mutateLimited = practiceTestRouteDeps.enforcePracticeTestMutationProtection(req, gate.userId);
  if (mutateLimited) return mutateLimited;

  const { id } = await ctx.params;
  if (!id || id.length < 8) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  practiceTestRouteDeps.setSentryServerContext({
    route: "/api/practice-tests/[id]",
    feature: SERVER_FEATURE.practiceTest,
    userId: gate.userId,
  });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    safeServerLog("cat_runner", "cat_runner_payload_invalid", {
      event: "cat_runner_payload_invalid",
      reason: "json_parse",
      practiceTestId: id.slice(0, 16),
    });
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    const actionProbe =
      body && typeof body === "object" && body !== null && "action" in body
        ? String((body as { action?: unknown }).action ?? "")
        : "";
    if (actionProbe === "cat_advance") {
      safeServerLog("cat_runner", "cat_runner_payload_invalid", {
        event: "cat_runner_payload_invalid",
        practiceTestId: id.slice(0, 16),
      });
    }
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const row = await practiceTestRouteDeps.findPracticeTest({
    where: { id, userId: gate.userId },
  });
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (row.status !== PracticeTestStatus.IN_PROGRESS) {
    return NextResponse.json({ error: "Test is no longer editable", code: "finalized" }, { status: 409 });
  }

  const ids = asIdList(row.questionIds);
  const prevAnswers =
    typeof row.answers === "object" && row.answers !== null && !Array.isArray(row.answers)
      ? ({ ...(row.answers as Record<string, unknown>) } as Record<string, unknown>)
      : {};

  const merged =
    parsed.data.answers != null ? { ...prevAnswers, ...parsed.data.answers } : prevAnswers;
  const cursorIndex = parsed.data.cursorIndex ?? row.cursorIndex;
  const elapsedMs = parsed.data.elapsedMs ?? row.elapsedMs ?? undefined;
  const cfg = practiceTestRouteDeps.parsePracticeTestConfigAtBoundary(row.config, {
    practiceTestId: id,
    surface: "practice_test_api_patch",
  });

  if (parsed.data.action === "save") {
    await practiceTestRouteDeps.updatePracticeTest({
      where: { id },
      data: {
        answers: merged as object,
        cursorIndex,
        ...(elapsedMs !== undefined ? { elapsedMs } : {}),
      },
    });
    return NextResponse.json({ ok: true });
  }

  if (parsed.data.action === "linear_commit") {
    if (cfg.selectionMode === "cat") {
      return NextResponse.json({ error: "linear_commit is only for linear tests" }, { status: 400 });
    }
    if (!cfg.linearDeliveryMode) {
      return NextResponse.json({ error: "Session does not use the linear exam engine" }, { status: 400 });
    }
    const qid = parsed.data.questionId?.trim();
    if (!qid) {
      return NextResponse.json({ error: "questionId required" }, { status: 400 });
    }
    const atCursor = ids[cursorIndex];
    if (atCursor !== qid) {
      return NextResponse.json({ error: "questionId must match the current item" }, { status: 400 });
    }
    const userAns = merged[qid];
    const hasAnswer =
      userAns !== undefined &&
      userAns !== null &&
      !(typeof userAns === "string" && userAns.trim() === "") &&
      !(Array.isArray(userAns) && userAns.length === 0);
    if (!hasAnswer) {
      return NextResponse.json({ error: "Select an answer before submitting" }, { status: 400 });
    }
    const already = getLinearCommittedQuestionIds(row.adaptiveState);
    if (already.includes(qid)) {
      return NextResponse.json({ error: "This question is already submitted" }, { status: 409 });
    }
    const nextAdaptive = mergeLinearCommittedQuestionId(row.adaptiveState, qid);
    const feedback = await buildLinearCommitFeedback(
      qid,
      userAns,
      gate.entitlement,
      cfg.pathwayId ?? null,
    );
    if (!feedback) {
      return NextResponse.json({ error: "Question not available" }, { status: 404 });
    }
    await practiceTestRouteDeps.updatePracticeTest({
      where: { id },
      data: {
        answers: merged as object,
        cursorIndex,
        adaptiveState: nextAdaptive as object,
        ...(elapsedMs !== undefined ? { elapsedMs } : {}),
      },
    });
    const committedQuestionIds = getLinearCommittedQuestionIds(nextAdaptive);
    if (cfg.linearDeliveryMode === "practice") {
      return NextResponse.json({
        ok: true,
        committedQuestionIds,
        feedback: {
          isCorrect: feedback.isCorrect,
          rationale: feedback.rationale,
          correctKeys: feedback.correctKeys,
          correctAnswerExplanation: feedback.correctAnswerExplanation,
          distractorRationalesMap: feedback.distractorRationalesMap,
          keyTakeaway: feedback.keyTakeaway,
          relatedLessons: feedback.relatedLessons,
        },
      });
    }
    return NextResponse.json({ ok: true, committedQuestionIds, locked: true as const });
  }

  if (parsed.data.action === "abandon") {
    await practiceTestRouteDeps.updatePracticeTest({
      where: { id },
      data: {
        status: PracticeTestStatus.ABANDONED,
        answers: merged as object,
        cursorIndex,
        completedAt: new Date(),
        ...(elapsedMs !== undefined ? { elapsedMs } : {}),
      },
    });
    return NextResponse.json({ ok: true });
  }

  if (parsed.data.action === "cat_advance") {
    if (cfg.selectionMode !== "cat") {
      return NextResponse.json({ error: "Not a CAT session" }, { status: 400 });
    }

    const adv = await practiceTestRouteDeps.advanceCatPracticeTest({
      questionIds: ids,
      adaptiveState: row.adaptiveState,
      mergedAnswers: merged,
      cursorIndex,
      config: cfg,
      userId: gate.userId,
      entitlement: gate.entitlement,
    });

    if (adv.kind === "error") {
      return NextResponse.json({ error: adv.message }, { status: 400 });
    }

    if (adv.kind === "study_reveal") {
      await practiceTestRouteDeps.updatePracticeTest({
        where: { id },
        data: {
          answers: merged as object,
          cursorIndex,
          adaptiveState: adv.adaptiveState as object,
          ...(elapsedMs !== undefined ? { elapsedMs } : {}),
        },
      });
      return NextResponse.json({
        ok: true,
        catStudyReveal: true as const,
        studyFeedback: adv.studyFeedback,
      });
    }

    if (adv.kind === "completed") {
      const answeredCount = ids.filter((qid) => merged[qid] !== undefined).length;
      const resultsWithMeta = withCatSessionResultMeta(adv.results, cfg, answeredCount);
      const resultsFinal = await practiceTestRouteDeps.enrichPracticeTestResultsWithCatCoach(
        resultsWithMeta,
        adv.adaptiveState,
        cfg,
        gate.entitlement,
        { practiceTestId: id },
      );
      await practiceTestRouteDeps.updatePracticeTest({
        where: { id },
        data: {
          status: PracticeTestStatus.COMPLETED,
          answers: merged as object,
          cursorIndex,
          completedAt: new Date(),
          results: resultsFinal as object,
          adaptiveState: adv.adaptiveState as object,
          questionIds: ids as object,
          ...(elapsedMs !== undefined ? { elapsedMs } : {}),
        },
      });
      let topicStatsSynced = true;
      try {
        await practiceTestRouteDeps.recordTopicOutcomesFromPracticeTest(gate.userId, ids, merged, gate.entitlement);
      } catch {
        topicStatsSynced = false;
      }
      practiceTestRouteDeps.capturePracticeTestCompletedAnalytics(gate.userId, gate.entitlement, cfg, resultsFinal);
      practiceTestRouteDeps.captureCatCoachGenerationAnalytics(gate.userId, gate.entitlement, cfg, resultsFinal);
      return NextResponse.json({
        ok: true,
        results: resultsFinal,
        catCompleted: true,
        topicStatsSynced,
        studyFeedback: adv.studyFeedback ?? null,
      });
    }

    await practiceTestRouteDeps.updatePracticeTest({
      where: { id },
      data: {
        answers: merged as object,
        cursorIndex: adv.cursorIndex,
        questionIds: adv.questionIds as object,
        adaptiveState: adv.adaptiveState as object,
        ...(elapsedMs !== undefined ? { elapsedMs } : {}),
      },
    });
    return NextResponse.json({ ok: true, catAdvanced: true });
  }

  if (parsed.data.action === "complete") {
    if (cfg.selectionMode === "cat") {
      const fin = await practiceTestRouteDeps.finalizeCatPracticeTest(ids, merged, gate.entitlement, row.adaptiveState);
      const answeredCount = ids.filter((qid) => merged[qid] !== undefined).length;
      const resultsWithMeta = withCatSessionResultMeta(fin.results, cfg, answeredCount);
      const resultsFinal = await practiceTestRouteDeps.enrichPracticeTestResultsWithCatCoach(
        resultsWithMeta,
        fin.adaptiveState,
        cfg,
        gate.entitlement,
        { practiceTestId: id },
      );
      await practiceTestRouteDeps.updatePracticeTest({
        where: { id },
        data: {
          status: PracticeTestStatus.COMPLETED,
          answers: merged as object,
          cursorIndex,
          completedAt: new Date(),
          results: resultsFinal as object,
          adaptiveState: fin.adaptiveState as object,
          ...(elapsedMs !== undefined ? { elapsedMs } : {}),
        },
      });
      let topicStatsSynced = true;
      try {
        await practiceTestRouteDeps.recordTopicOutcomesFromPracticeTest(gate.userId, ids, merged, gate.entitlement);
      } catch {
        topicStatsSynced = false;
      }
      practiceTestRouteDeps.capturePracticeTestCompletedAnalytics(gate.userId, gate.entitlement, cfg, resultsFinal);
      practiceTestRouteDeps.captureCatCoachGenerationAnalytics(gate.userId, gate.entitlement, cfg, resultsFinal);
      return NextResponse.json({ ok: true, results: resultsFinal, topicStatsSynced });
    }

    const results = await practiceTestRouteDeps.computePracticeTestResults(ids, merged, gate.entitlement);

    await practiceTestRouteDeps.updatePracticeTest({
      where: { id },
      data: {
        status: PracticeTestStatus.COMPLETED,
        answers: merged as object,
        cursorIndex,
        completedAt: new Date(),
        results: results as object,
        ...(elapsedMs !== undefined ? { elapsedMs } : {}),
      },
    });

    let topicStatsSynced = true;
    try {
      await practiceTestRouteDeps.recordTopicOutcomesFromPracticeTest(gate.userId, ids, merged, gate.entitlement);
    } catch {
      topicStatsSynced = false;
    }
    practiceTestRouteDeps.capturePracticeTestCompletedAnalytics(gate.userId, gate.entitlement, cfg, results);
    return NextResponse.json({ ok: true, results, topicStatsSynced });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
