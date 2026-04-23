import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { PracticeTestStatus } from "@prisma/client";
import { z } from "zod";
import { invalidateLearnerPrivateReadCache } from "@/lib/cache/learner-private-read-cache";
import { prisma } from "@/lib/db";
import { SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
/**
 * Topic ledger updates run only when a practice test completes (linear or CAT finalization).
 * Incremental recording on each CAT advance would double-count if the client retried the same step
 * or replayed answers; completion uses the full question id + answer set once.
 */
import { buildLinearCommitFeedback } from "@/lib/practice-tests/build-linear-commit-feedback";
import { getLinearCommittedQuestionIds, mergeLinearCommittedQuestionId } from "@/lib/practice-tests/practice-linear-engine";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import type {
  PracticeTestConfigJson,
  PracticeTestPathwayClientShell,
  PracticeTestResultsJson,
} from "@/lib/practice-tests/types";

export const dynamic = "force-dynamic";

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
import { mergeQuestionApiPayload } from "@/lib/i18n/educational-content-overlay";
import { resolveMergedQuestionOverlayBundle } from "@/lib/i18n/educational-translation-db";
import { getMarketingLocaleFromRequestCookie } from "@/lib/i18n/marketing-locale-cookie";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { validatePracticeExamPostLaunchRequest } from "@/lib/learner/study-product-route-contract";
import { practiceTestRouteDeps } from "./route-deps";
import { normalizePracticeTestQuestionIds } from "@/lib/practice-tests/practice-test-question-ids";
import { assessPracticeTestSessionHydrateContract } from "@/lib/practice-tests/practice-session-contract";

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
  tags: true,
} as const;

function asIdList(raw: unknown): string[] {
  return normalizePracticeTestQuestionIds(raw);
}

function toJsonObject(value: unknown): object {
  return JSON.parse(JSON.stringify(value ?? {})) as object;
}

function pathwaySurfaceFromConfig(cfg: PracticeTestConfigJson): PracticeTestPathwayClientShell | null {
  const pid = cfg.pathwayId?.trim();
  if (!pid) return null;
  const p = getExamPathwayById(pid);
  if (!p) return null;
  return {
    id: p.id,
    countrySlug: p.countrySlug,
    roleTrack: p.roleTrack,
    examCode: p.examCode,
    shortName: p.shortName,
    examFamily: p.examFamily,
  };
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return runWithApiTelemetry(req, "GET /api/practice-tests/[id]", "content", async () => {
  const gate = await practiceTestRouteDeps.requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const limited = await practiceTestRouteDeps.enforcePracticeTestDetailProtection(req, gate.userId);
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

  const sessionContract = assessPracticeTestSessionHydrateContract({
    catMode: cfg.selectionMode === "cat",
    status: row.status,
    questionIds: ids,
    cursorIndex: row.cursorIndex,
    adaptiveState: row.adaptiveState ?? null,
    config: cfg,
    results: row.results,
  });
  if (!sessionContract.ok) {
    safeServerLog("practice_tests", "practice_test_get_session_contract_violation", {
      event: "practice_test_get_session_contract_violation",
      practiceTestId: id.slice(0, 16),
      code: sessionContract.violation.code,
    });
  }

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
          take: chunk.length,
        });
        acc.push(...part);
      }
      return acc;
    });
    const order = new Map(ids.map((qid, i) => [qid, i]));
    const sorted = [...qs].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    questions = sorted.map((q) => {
      const merged = mergeQuestionApiPayload({ ...q } as Record<string, unknown>, educationalLocale, questionOverlayBundle, {
        teachingExposure: "none",
      });
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
    pathwaySurface: pathwaySurfaceFromConfig(cfg),
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
  return runWithApiTelemetry(req, "PATCH /api/practice-tests/[id]", "content", async () => {
  const gate = await practiceTestRouteDeps.requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const mutateLimited = await practiceTestRouteDeps.enforcePracticeTestMutationProtection(req, gate.userId);
  if (mutateLimited) return mutateLimited;

  const launchCheck = validatePracticeExamPostLaunchRequest(req);
  if (!launchCheck.ok) {
    safeServerLog("practice_tests", "study_launch_route_contract_violation", {
      event: "study_launch_route_contract_violation",
      feature_surface: "practice_exams_resume",
      outcome: "rejected_invalid_route",
      expected: launchCheck.expected,
      received: launchCheck.received,
      userIdPrefix: gate.userId.slice(0, 8),
    });
    return NextResponse.json(
      {
        error: launchCheck.error,
        expected: launchCheck.expected,
        received: launchCheck.received,
        reason: launchCheck.reason,
        retryable: false,
      },
      { status: 403 },
    );
  }

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
  const requestedCursorIndex = parsed.data.cursorIndex ?? row.cursorIndex;
  const maxCursor = Math.max(0, ids.length - 1);
  const cursorIndex = Math.min(Math.max(requestedCursorIndex, 0), maxCursor);
  const elapsedMs = parsed.data.elapsedMs ?? row.elapsedMs ?? undefined;
  const cfg = practiceTestRouteDeps.parsePracticeTestConfigAtBoundary(row.config, {
    practiceTestId: id,
    surface: "practice_test_api_patch",
  });
  const invalidateHeavyReads = async () => invalidateLearnerPrivateReadCache(gate.userId);

  if (parsed.data.action === "save") {
    await practiceTestRouteDeps.updatePracticeTest({
      where: { id },
      data: {
        answers: merged as object,
        cursorIndex,
        ...(elapsedMs !== undefined ? { elapsedMs } : {}),
      },
    });
    await invalidateHeavyReads();
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
    await invalidateHeavyReads();
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
    await invalidateHeavyReads();
    return NextResponse.json({ ok: true });
  }

  if (parsed.data.action === "cat_advance") {
    if (cfg.selectionMode !== "cat") {
      return NextResponse.json({ error: "Not a CAT session" }, { status: 400 });
    }

    // One atomic step: score the current item (from `mergedAnswers` + `cursorIndex`), update adaptive
    // state, append or complete. There is no separate "commit answer only" action; the runner may use a
    // two-phase UI (submit lock, then advance) that still ends in this single PATCH.

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

    safeServerLog("cat_runner", "cat_advance_patch", {
      event: "cat_advance_patch",
      practiceTestId: id.slice(0, 16),
      kind: adv.kind,
      ...(adv.kind === "continue"
        ? { cursorIndex: adv.cursorIndex, questionCount: adv.questionIds.length }
        : {}),
    });

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
      await invalidateHeavyReads();
      return NextResponse.json({
        ok: true,
        catStudyReveal: true as const,
        studyFeedback: adv.studyFeedback,
      });
    }

    if (adv.kind === "completed") {
      const answeredCount = ids.filter((qid) => merged[qid] !== undefined).length;
      const resultsWithMeta = withCatSessionResultMeta(adv.results, cfg, answeredCount);
      let resultsFinal = resultsWithMeta;
      try {
        resultsFinal = await practiceTestRouteDeps.enrichPracticeTestResultsWithCatCoach(
          resultsWithMeta,
          adv.adaptiveState,
          cfg,
          gate.entitlement,
          { practiceTestId: id },
        );
      } catch (error) {
        safeServerLog("cat_runner", "cat_results_enrichment_failed", {
          event: "cat_results_enrichment_failed",
          practiceTestId: id.slice(0, 16),
          reason: error instanceof Error ? error.message : "unknown",
        });
      }
      await practiceTestRouteDeps.updatePracticeTest({
        where: { id },
        data: {
          status: PracticeTestStatus.COMPLETED,
          answers: merged as object,
          cursorIndex,
          completedAt: new Date(),
          results: toJsonObject(resultsFinal),
          adaptiveState: toJsonObject(adv.adaptiveState),
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
      try {
        practiceTestRouteDeps.capturePracticeTestCompletedAnalytics(gate.userId, gate.entitlement, cfg, resultsFinal);
        practiceTestRouteDeps.captureCatCoachGenerationAnalytics(gate.userId, gate.entitlement, cfg, resultsFinal);
      } catch (error) {
        safeServerLog("cat_runner", "cat_completion_analytics_failed", {
          event: "cat_completion_analytics_failed",
          practiceTestId: id.slice(0, 16),
          reason: error instanceof Error ? error.message : "unknown",
        });
      }
      await invalidateHeavyReads();
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
    await invalidateHeavyReads();
    return NextResponse.json({ ok: true, catAdvanced: true });
  }

  if (parsed.data.action === "complete") {
    if (ids.length === 0) {
      safeServerLog("cat_runner", "practice_test_complete_blocked_empty_session", {
        event: "practice_test_complete_blocked_empty_session",
        practiceTestId: id.slice(0, 16),
        selectionMode: cfg.selectionMode,
      });
      return NextResponse.json(
        {
          error: "Cannot complete a session with no questions.",
          code: "complete_no_questions",
          retryable: false,
        },
        { status: 400 },
      );
    }
    const answeredForComplete = ids.filter((qid) => merged[qid] !== undefined).length;
    if (answeredForComplete === 0) {
      safeServerLog("cat_runner", "practice_test_complete_blocked_no_answers", {
        event: "practice_test_complete_blocked_no_answers",
        practiceTestId: id.slice(0, 16),
        selectionMode: cfg.selectionMode,
      });
      return NextResponse.json(
        {
          error: "Cannot complete a session with no recorded answers.",
          code: "complete_no_answers",
          retryable: false,
        },
        { status: 400 },
      );
    }
    if (
      cfg.selectionMode === "cat" &&
      (cfg.catAdaptiveSessionType ?? "cat") === "cat" &&
      answeredForComplete < 2
    ) {
      safeServerLog("cat_runner", "cat_complete_blocked_insufficient_adaptive_answers", {
        event: "cat_complete_blocked_insufficient_adaptive_answers",
        practiceTestId: id.slice(0, 16),
        answeredCount: answeredForComplete,
      });
      return NextResponse.json(
        {
          error:
            "Strict adaptive (CAT) runs cannot be manually finalized this early. Continue the session from the CAT screen or refresh if the UI is out of sync.",
          code: "cat_complete_not_terminal",
          retryable: true,
        },
        { status: 400 },
      );
    }
    if (cfg.selectionMode === "cat") {
      try {
        const fin = await practiceTestRouteDeps.finalizeCatPracticeTest(ids, merged, gate.entitlement, row.adaptiveState);
        const answeredCount = ids.filter((qid) => merged[qid] !== undefined).length;
        const resultsWithMeta = withCatSessionResultMeta(fin.results, cfg, answeredCount);
        let resultsFinal = resultsWithMeta;
        try {
          resultsFinal = await practiceTestRouteDeps.enrichPracticeTestResultsWithCatCoach(
            resultsWithMeta,
            fin.adaptiveState,
            cfg,
            gate.entitlement,
            { practiceTestId: id },
          );
        } catch (error) {
          safeServerLog("cat_runner", "cat_results_enrichment_failed", {
            event: "cat_results_enrichment_failed",
            practiceTestId: id.slice(0, 16),
            reason: error instanceof Error ? error.message : "unknown",
          });
        }
        await practiceTestRouteDeps.updatePracticeTest({
          where: { id },
          data: {
            status: PracticeTestStatus.COMPLETED,
            answers: merged as object,
            cursorIndex,
            completedAt: new Date(),
            results: toJsonObject(resultsFinal),
            adaptiveState: toJsonObject(fin.adaptiveState),
            ...(elapsedMs !== undefined ? { elapsedMs } : {}),
          },
        });
        let topicStatsSynced = true;
        try {
          await practiceTestRouteDeps.recordTopicOutcomesFromPracticeTest(gate.userId, ids, merged, gate.entitlement);
        } catch {
          topicStatsSynced = false;
        }
        try {
          practiceTestRouteDeps.capturePracticeTestCompletedAnalytics(gate.userId, gate.entitlement, cfg, resultsFinal);
          practiceTestRouteDeps.captureCatCoachGenerationAnalytics(gate.userId, gate.entitlement, cfg, resultsFinal);
        } catch (error) {
          safeServerLog("cat_runner", "cat_completion_analytics_failed", {
            event: "cat_completion_analytics_failed",
            practiceTestId: id.slice(0, 16),
            reason: error instanceof Error ? error.message : "unknown",
          });
        }
        await invalidateHeavyReads();
        return NextResponse.json({ ok: true, results: resultsFinal, topicStatsSynced });
      } catch (error) {
        safeServerLog("cat_runner", "cat_complete_failed", {
          event: "cat_complete_failed",
          practiceTestId: id.slice(0, 16),
          reason: error instanceof Error ? error.message : "unknown",
        });
        return NextResponse.json(
          { error: `Unable to complete exam: ${error instanceof Error ? error.message : "Unexpected error"}` },
          { status: 400 },
        );
      }
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
    await invalidateHeavyReads();
    return NextResponse.json({ ok: true, results, topicStatsSynced });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  });
}
