import { NextRequest, NextResponse } from "next/server";
import { ExamFamily, PracticeTestStatus } from "@prisma/client";
import { z } from "zod";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { enforcePracticeTestsListProtection } from "@/lib/http/api-protection";
import { prisma } from "@/lib/db";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { readinessConfigForPathwayId } from "@/lib/exam-pathways/pathway-readiness-config";
import {
  listPathwaysCompatibleWithSubscription,
  pathwayAllowsCatAdaptiveStart,
} from "@/lib/exam-pathways/pathway-entitlements";
import { assessCatPracticeReadinessForPathway } from "@/lib/practice-tests/cat-practice-readiness";
import {
  resolveCatPostExamTimedLimitSec,
  resolveCatSelectionBasisForPost,
} from "@/lib/practice-tests/cat-practice-post-helpers";
import { createCatPracticeTestPayload } from "@/lib/practice-tests/cat-session";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";
import { resolveCatPathwayIdForCatPost } from "@/lib/practice-tests/resolve-cat-pathway-for-post";
import { configFromInput, pickPracticeQuestionIds } from "@/lib/practice-tests/pick-question-ids";
import { parsePracticeTestConfigAtBoundary } from "@/lib/practice-tests/practice-test-config-boundary";
import type { PracticeTestConfigJson } from "@/lib/practice-tests/types";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";
import { examContextAnalyticsProps } from "@/lib/exam-context/global-exam-context";
import { captureLearnerProductEvent } from "@/lib/observability/learner-product-analytics";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const createSchema = z
  .object({
    title: z.string().max(120).optional(),
    questionCount: z.number().int().min(5).max(150),
    topicNames: z.array(z.string().min(1).max(200)).max(30).optional().default([]),
    difficultyMin: z.union([z.number().int().min(1).max(5), z.null()]).optional(),
    difficultyMax: z.union([z.number().int().min(1).max(5), z.null()]).optional(),
    selectionMode: z.enum(["random", "targeted", "weak", "cat"]),
    /** Pool strategy when `selectionMode` is `cat`. */
    catSelectionBasis: z.enum(["random", "targeted", "weak"]).optional(),
    /** Exam simulation uses pathway-specific bounds (NCLEX-RN 75–145, AANP-style NP 75–150) and blueprint balancing. */
    catPresentationMode: z.enum(["practice", "exam_simulation"]).optional().default("practice"),
    /**
     * CAT only: Study Mode (rationales after each item) vs Test Mode (rationales after completion).
     * Ignored for non-CAT; exam simulation coerces to Test Mode on the server.
     */
    catExamFeedbackMode: z.enum(["study", "test"]).optional().default("test"),
    pathwayId: z.union([z.string().min(2).max(80), z.null()]).optional(),
    timedMode: z.boolean(),
    /** Timed exam simulation: up to 5h NCLEX default or 3h AANP-style NP when pathway is NP (overridable). */
    timeLimitSec: z.union([z.number().int().min(120).max(18_000), z.null()]).optional(),
    /** Linear sessions: per-question lock + practice rationales vs exam-style deferred rationales. */
    linearDeliveryMode: z.enum(["practice", "exam"]).optional(),
    /** Linear sessions: rationale timing controls (mirrors tutor vs exam behavior). */
    linearRationaleVisibility: z.enum(["after_each", "end_of_exam"]).optional(),
  })
  .refine((d) => d.selectionMode !== "cat" || d.catPresentationMode !== "practice" || d.questionCount <= 200, {
    message: "CAT maximum question cap is 200.",
    path: ["questionCount"],
  })
  .refine((d) => d.selectionMode !== "cat" || d.catPresentationMode !== "exam_simulation" || d.questionCount <= 150, {
    message: "Exam simulation maximum is 150.",
    path: ["questionCount"],
  })
  .refine((d) => d.selectionMode !== "cat" || d.questionCount >= 10, {
    message: "Adaptive (CAT) mode needs at least 10 as the maximum question cap input.",
    path: ["questionCount"],
  })
  .refine(
    (d) => {
      if (d.selectionMode !== "cat" || d.catPresentationMode !== "exam_simulation" || d.questionCount <= 145) {
        return true;
      }
      const p = d.pathwayId?.trim() ? getExamPathwayById(d.pathwayId.trim()) : null;
      return p?.examFamily === ExamFamily.NP;
    },
    {
      message: "NCLEX-RN exam simulation maximum is 145. Pass pathwayId for an NP track for up to 150 (AANP-style simulator).",
      path: ["questionCount"],
    },
  )
  .refine((d) => d.catPresentationMode !== "exam_simulation" || d.selectionMode === "cat", {
    message: "Exam simulation requires adaptive (CAT) mode.",
    path: ["catPresentationMode"],
  })
  .refine((d) => d.selectionMode === "cat" || d.questionCount <= 100, {
    message: "Linear practice tests support up to 100 questions.",
    path: ["questionCount"],
  });

function linearConfigFingerprint(config: PracticeTestConfigJson) {
  return JSON.stringify({
    questionCount: config.questionCount,
    topicNames: [...(config.topicNames ?? [])].sort((a, b) => a.localeCompare(b)),
    difficultyMin: config.difficultyMin ?? null,
    difficultyMax: config.difficultyMax ?? null,
    selectionMode: config.selectionMode,
    pathwayId: config.pathwayId ?? null,
    timedMode: config.timedMode,
    timeLimitSec: config.timedMode ? config.timeLimitSec ?? null : null,
    linearDeliveryMode: config.linearDeliveryMode ?? "practice",
    linearRationaleVisibility:
      config.linearRationaleVisibility ??
      ((config.linearDeliveryMode ?? "practice") === "exam" ? "end_of_exam" : "after_each"),
  });
}

export async function GET(req: NextRequest) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const rl = await enforcePracticeTestsListProtection(req, gate.userId);
  if (rl) return rl;

  setSentryServerContext({ route: "/api/practice-tests", feature: SERVER_FEATURE.practiceTest, userId: gate.userId });

  const rows = await prisma.practiceTest.findMany({
    where: { userId: gate.userId },
    orderBy: { updatedAt: "desc" },
    take: 40,
    select: {
      id: true,
      title: true,
      status: true,
      config: true,
      questionIds: true,
      timedMode: true,
      timeLimitSec: true,
      elapsedMs: true,
      startedAt: true,
      completedAt: true,
      results: true,
      updatedAt: true,
    },
  });

  const list = rows.map((r) => {
    const ids = Array.isArray(r.questionIds) ? r.questionIds.filter((x): x is string => typeof x === "string") : [];
    const cfg =
      r.config != null ? parsePracticeTestConfigAtBoundary(r.config, { practiceTestId: r.id, surface: "practice_tests_list" }) : null;
    const res = r.results as { accuracyPct?: number; scoreCorrect?: number; scoreTotal?: number } | null;
    const maxCap = cfg?.catMaxQuestions ?? cfg?.questionCount ?? ids.length;
    return {
      id: r.id,
      title: r.title,
      status: r.status,
      questionCount: cfg?.selectionMode === "cat" ? maxCap : ids.length,
      selectionMode: cfg?.selectionMode ?? null,
      catPresentationMode: cfg?.catPresentationMode ?? "practice",
      catExamFeedbackMode: cfg?.selectionMode === "cat" ? (cfg?.catExamFeedbackMode ?? "test") : null,
      timedMode: r.timedMode,
      timeLimitSec: r.timeLimitSec,
      elapsedMs: r.elapsedMs,
      startedAt: r.startedAt.toISOString(),
      completedAt: r.completedAt?.toISOString() ?? null,
      accuracyPct: res?.accuracyPct ?? null,
      scoreCorrect: res?.scoreCorrect ?? null,
      scoreTotal: res?.scoreTotal ?? null,
      updatedAt: r.updatedAt.toISOString(),
    };
  });

  return NextResponse.json({ tests: list });
}

export async function POST(req: Request) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/practice-tests", feature: SERVER_FEATURE.practiceTest, userId: gate.userId });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const isQuestionCountIssue = firstIssue?.path?.includes("questionCount");
    const issueMessage =
      typeof firstIssue?.message === "string" && firstIssue.message.trim().length > 0
        ? firstIssue.message
        : "Invalid request payload.";
    return NextResponse.json(
      {
        error: issueMessage,
        code: isQuestionCountIssue
          ? PRACTICE_TEST_CAT_CREATE_CODE.cat_invalid_question_count
          : "invalid_request_payload",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const isDev = process.env.NODE_ENV !== "production";
  const topicNames = d.topicNames ?? [];
  const difficultyMin = d.difficultyMin ?? null;
  const difficultyMax = d.difficultyMax ?? null;

  const timeLimitSec = d.timedMode
    ? (d.timeLimitSec ?? Math.min(14_400, Math.max(300, d.questionCount * 90)))
    : null;

  if (d.selectionMode === "cat") {
    if (isDev) {
      safeServerLog("practice_tests", "CAT_START_ATTEMPT_DEV", {
        userIdPrefix: gate.userId.slice(0, 8),
        pathwayId: d.pathwayId?.trim() || undefined,
        questionCount: d.questionCount,
        catPresentationMode: d.catPresentationMode,
        selectionMode: d.selectionMode,
      });
    }
    const compatible = listPathwaysCompatibleWithSubscription(gate.entitlement);
    const catEligible = compatible.filter(pathwayAllowsCatAdaptiveStart);
    const resolvedPathway = resolveCatPathwayIdForCatPost(d.pathwayId, catEligible);
    if (!resolvedPathway.ok) {
      if (resolvedPathway.code === PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_ambiguous) {
        safeServerLog("practice_tests", "CAT_PATHWAY_AMBIGUOUS", {
          userIdPrefix: gate.userId.slice(0, 8),
          catEligibleCount: catEligible.length,
          compatibleCount: compatible.length,
        });
        return NextResponse.json(
          {
            error:
              "Choose which exam pathway you want to practice and pass pathwayId, or open CAT from a pathway-specific page (your account has more than one adaptive track).",
            code: PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_ambiguous,
          },
          { status: 400 },
        );
      }
      safeServerLog("practice_tests", "CAT_PATHWAY_REQUIRED", {
        userIdPrefix: gate.userId.slice(0, 8),
        catEligibleCount: catEligible.length,
        compatibleCount: compatible.length,
      });
      return NextResponse.json(
        {
          error:
            catEligible.length === 0 && compatible.length > 0
              ? "No adaptive (CAT) sessions are available for your current pathways yet. Use lessons and the question bank on each pathway hub, or join a waitlist where offered."
              : "Choose an exam pathway for adaptive practice. If your profile is missing country or tier, update Account settings or Billing.",
          code: PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_required,
        },
        { status: 400 },
      );
    }
    const pathwayIdForCat = resolvedPathway.pathwayId;
    if (pathwayIdForCat && !getExamPathwayById(pathwayIdForCat)) {
      safeServerLog("practice_tests", "CAT_INVALID_PATHWAY", {
        pathwayIdPrefix: pathwayIdForCat.slice(0, 14),
        userIdPrefix: gate.userId.slice(0, 8),
      });
      return NextResponse.json(
        {
          error: "Unknown exam pathway id. Refresh the page and pick a pathway from the list.",
          code: PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_found,
        },
        { status: 400 },
      );
    }
    if (pathwayIdForCat && !catEligible.some((p) => p.id === pathwayIdForCat)) {
      const inCompatible = compatible.some((p) => p.id === pathwayIdForCat);
      const p = getExamPathwayById(pathwayIdForCat);
      if (!inCompatible) {
        safeServerLog("practice_tests", "CAT_WRONG_TIER", {
          pathwayIdPrefix: pathwayIdForCat.length > 14 ? `${pathwayIdForCat.slice(0, 14)}…` : pathwayIdForCat,
          userIdPrefix: gate.userId.slice(0, 8),
        });
        return NextResponse.json(
          {
            error:
              "That pathway is not included with your subscription. Pick a track that matches your plan and region, or review Account → Billing.",
            code: PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_entitled,
          },
          { status: 400 },
        );
      }
      safeServerLog("practice_tests", "CAT_PATHWAY_UPCOMING", {
        pathwayIdPrefix: pathwayIdForCat.length > 14 ? `${pathwayIdForCat.slice(0, 14)}…` : pathwayIdForCat,
        userIdPrefix: gate.userId.slice(0, 8),
      });
      return NextResponse.json(
        {
          error:
            p && !pathwayAllowsCatAdaptiveStart(p)
              ? "Adaptive practice is not open for this track yet. Use the question bank and lessons, or pick another active pathway your plan includes."
              : "That pathway is not available for adaptive practice. Pick another track from the list.",
          code: PRACTICE_TEST_CAT_CREATE_CODE.pathway_track_not_ready,
        },
        { status: 400 },
      );
    }
    const catReadiness = await assessCatPracticeReadinessForPathway(gate.userId, gate.entitlement, pathwayIdForCat);
    if (!catReadiness.ok) {
      const logKey =
        catReadiness.code === PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid
          ? "CAT_POOL_TOO_SMALL"
          : catReadiness.code === PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_found
            ? "CAT_INVALID_PATHWAY"
            : catReadiness.code === PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_entitled
              ? "CAT_WRONG_TIER"
              : catReadiness.code === PRACTICE_TEST_CAT_CREATE_CODE.pathway_track_not_ready
                ? "CAT_PATHWAY_WAITLIST"
                : "CAT_SESSION_BLOCKED";
      safeServerLog("practice_tests", logKey, {
        code: catReadiness.code,
        pathwayIdPrefix: pathwayIdForCat.length > 14 ? `${pathwayIdForCat.slice(0, 14)}…` : pathwayIdForCat,
        userIdPrefix: gate.userId.slice(0, 8),
      });
      return NextResponse.json(
        { error: catReadiness.message, code: catReadiness.code },
        { status: 400 },
      );
    }
    const basis = resolveCatSelectionBasisForPost(d.catPresentationMode, d.catSelectionBasis);
    const simPathway = getExamPathwayById(pathwayIdForCat) ?? null;
    const readinessConfig = readinessConfigForPathwayId(pathwayIdForCat);
    const pathwayCap =
      d.catPresentationMode === "exam_simulation" && simPathway?.examFamily !== ExamFamily.NP
        ? 145
        : 150;
    if (d.questionCount > pathwayCap) {
      return NextResponse.json(
        {
          error:
            pathwayCap === 145
              ? "RN/RPN readiness exam simulation allows up to 145 questions."
              : "NP readiness exam simulation allows up to 150 questions.",
          code: PRACTICE_TEST_CAT_CREATE_CODE.cat_invalid_question_count,
        },
        { status: 400 },
      );
    }
    const configuredCount = readinessConfig?.maxQuestions ?? d.questionCount;
    const enforcedQuestionCount = Math.min(configuredCount, pathwayCap);
    const enforcedTimedMode =
      readinessConfig?.mode === "production_ready" || readinessConfig?.mode === "simulation"
        ? true
        : d.timedMode;
    const examTimedLimit = resolveCatPostExamTimedLimitSec({
      timedMode: enforcedTimedMode,
      timeLimitSec: readinessConfig ? readinessConfig.timeLimitMinutes * 60 : d.timeLimitSec,
      questionCount: enforcedQuestionCount,
      catPresentationMode: d.catPresentationMode,
      pathway: simPathway,
    });
    const existingInProgress = await prisma.practiceTest.findFirst({
      where: {
        userId: gate.userId,
        status: PracticeTestStatus.IN_PROGRESS,
        AND: [
          { config: { path: ["selectionMode"], equals: "cat" } },
          { config: { path: ["pathwayId"], equals: pathwayIdForCat } },
          { config: { path: ["catPresentationMode"], equals: d.catPresentationMode } },
        ],
      },
      select: { id: true },
      orderBy: { updatedAt: "desc" },
    });
    if (existingInProgress) {
      return NextResponse.json({ id: existingInProgress.id, resumed: true as const }, { status: 200 });
    }
    const cat = await createCatPracticeTestPayload(
      gate.userId,
      gate.entitlement,
      basis,
      {
        questionCount: enforcedQuestionCount,
        topicNames,
        difficultyMin,
        difficultyMax,
        pathwayId: pathwayIdForCat,
      },
      enforcedTimedMode,
      examTimedLimit,
      d.catPresentationMode,
      d.catExamFeedbackMode,
    );
    if (!cat.ok) {
      safeServerLog("practice_tests", "cat_create_rejected", {
        code: String(cat.code ?? PRACTICE_TEST_CAT_CREATE_CODE.cat_create_failed),
        pathwayIdPrefix: pathwayIdForCat.length > 14 ? `${pathwayIdForCat.slice(0, 14)}…` : pathwayIdForCat,
        userIdPrefix: gate.userId.slice(0, 8),
      });
      return NextResponse.json(
        { error: cat.message, code: cat.code ?? PRACTICE_TEST_CAT_CREATE_CODE.cat_create_failed },
        { status: 400 },
      );
    }

    const row = await prisma.practiceTest.create({
      data: {
        userId: gate.userId,
        title: d.title?.trim() || null,
        config: cat.config as object,
        questionIds: cat.questionIds,
        adaptiveState: cat.adaptiveState as object,
        status: PracticeTestStatus.IN_PROGRESS,
        timedMode: enforcedTimedMode,
        timeLimitSec: examTimedLimit,
        cursorIndex: 0,
      },
    });

    captureLearnerProductEvent(gate.userId, gate.entitlement, PH.learnerCatExamStarted, {
      pathway_id: pathwayIdForCat,
      exam_simulation: d.catPresentationMode === "exam_simulation",
      cat_exam_feedback_mode: cat.config.catExamFeedbackMode ?? "test",
      question_cap: enforcedQuestionCount,
      timed: enforcedTimedMode,
      ...examContextAnalyticsProps(buildGlobalExamContext(pathwayIdForCat, "en")),
    });
    if (isDev) {
      safeServerLog("practice_tests", "CAT_START_VALIDATION_DEV", {
        userIdPrefix: gate.userId.slice(0, 8),
        pathwayId: pathwayIdForCat,
        requestedQuestionCount: d.questionCount,
        configuredQuestionCount: configuredCount,
        enforcedQuestionCount,
        pathwayCap,
        catPresentationMode: d.catPresentationMode,
      });
    }
    if (isDev) {
      safeServerLog("practice_tests", "CAT_START_SUCCESS_DEV", {
        userIdPrefix: gate.userId.slice(0, 8),
        pathwayId: pathwayIdForCat,
        questionCap: enforcedQuestionCount,
        returnedQuestionCount: cat.questionIds.length,
        practiceTestId: row.id,
      });
    }

    return NextResponse.json(
      { id: row.id, questionCount: cat.questionIds.length, config: cat.config, adaptive: true },
      { status: 201 },
    );
  }

  const linearMode = d.linearDeliveryMode;
  const linearRationaleVisibility =
    d.linearRationaleVisibility ??
    (linearMode === "exam" ? "end_of_exam" : "after_each");
  const resolvedLinearMode = linearRationaleVisibility === "after_each" ? "practice" : "exam";
  const config = configFromInput(
    {
      questionCount: d.questionCount,
      topicNames,
      difficultyMin,
      difficultyMax,
      selectionMode: d.selectionMode,
      pathwayId: d.pathwayId?.trim() || null,
    },
    d.timedMode,
    timeLimitSec,
    {
      linearDeliveryMode: linearMode ?? resolvedLinearMode,
      linearRationaleVisibility,
    },
  );

  const requestedLinearFingerprint = linearConfigFingerprint(config);
  const existingLinearInProgress = await prisma.practiceTest.findMany({
    where: {
      userId: gate.userId,
      status: PracticeTestStatus.IN_PROGRESS,
    },
    select: { id: true, config: true },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });
  const resumeLinear = existingLinearInProgress.find((candidate) => {
    const candidateConfig = parsePracticeTestConfigAtBoundary(candidate.config, {
      practiceTestId: candidate.id,
      surface: "practice_test_linear_resume_match",
    });
    if (candidateConfig.selectionMode === "cat") return false;
    return linearConfigFingerprint(candidateConfig) === requestedLinearFingerprint;
  });
  if (resumeLinear) {
    return NextResponse.json({ id: resumeLinear.id, resumed: true as const }, { status: 200 });
  }

  const picked = await pickPracticeQuestionIds(gate.userId, gate.entitlement, {
    questionCount: d.questionCount,
    topicNames,
    difficultyMin,
    difficultyMax,
    selectionMode: d.selectionMode,
    pathwayId: d.pathwayId?.trim() || null,
  });

  if (!picked.ok) {
    return NextResponse.json({ error: picked.message, code: "pool_too_small" }, { status: 400 });
  }

  const row = await prisma.practiceTest.create({
    data: {
      userId: gate.userId,
      title: d.title?.trim() || null,
      config: config as object,
      questionIds: picked.ids,
      status: PracticeTestStatus.IN_PROGRESS,
      timedMode: d.timedMode,
      timeLimitSec,
      ...(config.linearDeliveryMode
        ? {
            adaptiveState: {
              linearEngine: { committedQuestionIds: [] as string[] },
            } as object,
          }
        : {}),
    },
  });

  captureLearnerProductEvent(gate.userId, gate.entitlement, PH.learnerLinearPracticeTestStarted, {
    pathway_id: d.pathwayId?.trim() || undefined,
    selection_mode: d.selectionMode,
    question_count: d.questionCount,
    timed: d.timedMode,
    ...examContextAnalyticsProps(buildGlobalExamContext(d.pathwayId?.trim() || null, "en")),
  });

  return NextResponse.json({ id: row.id, questionCount: picked.ids.length, config }, { status: 201 });
}
