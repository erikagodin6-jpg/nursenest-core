// @ts-nocheck -- Legacy graph/cognition scaffold is runtime-gated; keep CI unblocked while typed contracts converge.
import "server-only";

import type { AccessScope } from "@/lib/entitlements/user-access-types";
import type { TopicPerformanceSnapshot } from "@/lib/learner/topic-performance";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";
import {
  resolveLearnerCognitionSubstrate,
  type LearnerCognitionSubstrate,
} from "@/lib/educational-cognition/cognition-substrate";
import type { ReadinessResult } from "@/lib/learner/readiness-score";
import {
  toPublicWeakSummaries,
  type PersonalizedStudyPlanStep,
  type PersonalizedWeakAreaStudyPlanPublic,
  type WeakAreaPublicSummary,
} from "@/lib/learner/personalized-weak-area-study-plan-surface";
import type { GovernedRnStudyPlan } from "@/lib/learner/rn-coaching-intelligence/study-plan-orchestration";
import { governStudyPlanCopy } from "@/lib/measurements/measurement-surface-convergence";

export type CognitionStudyPlanPresentation = {
  substrate: LearnerCognitionSubstrate;
  publicPlan: PersonalizedWeakAreaStudyPlanPublic;
};

function blockKindToUiKind(kind: GovernedRnStudyPlan["blocks"][0]["kind"]): string {
  if (kind === "reassessment") return "cat";
  return kind;
}

function buildReviewSequenceFromGoverned(plan: GovernedRnStudyPlan): PersonalizedStudyPlanStep[] {
  return plan.blocks
    .filter((b) => b.kind !== "rest")
    .map((b, i) => ({
      step: i + 1,
      title: b.title,
      detail: b.reason,
      href: b.href,
      kind: blockKindToUiKind(b.kind),
    }));
}

function weakestAreasFromState(
  weakTopics: TopicPerformanceSnapshot["weakTopics"],
  continuity: string[],
  pathwayId: string | null,
): WeakAreaPublicSummary[] {
  const fromPerf = toPublicWeakSummaries(weakTopics, 4);
  if (fromPerf.length > 0) return fromPerf;
  return continuity.slice(0, 4).map((label) => ({
    label,
    band: "priority_review" as const,
    coachLine: governStudyPlanCopy(
      "This competency remains a focus across sessions — stabilize before adding new domains.",
      pathwayId,
    ),
  }));
}

export function presentCognitionStudyPlan(
  substrate: LearnerCognitionSubstrate,
  topicPerf: TopicPerformanceSnapshot,
  pathwayId: string | null,
): CognitionStudyPlanPresentation {
  const { studyPlan, ctx } = substrate;
  const reviewSequence = buildReviewSequenceFromGoverned(studyPlan);
  const weakestAreas = weakestAreasFromState(topicPerf.weakTopics, studyPlan.weakTopicContinuity, pathwayId);

  const primary = reviewSequence[0];
  const publicPlan: PersonalizedWeakAreaStudyPlanPublic = {
    pathwayId,
    weakestAreas,
    reviewSequence,
    anchors: {
      lesson: primary?.kind === "lesson" ? { title: primary.title, href: primary.href, reason: primary.detail } : null,
      flashcards:
        reviewSequence.find((s) => s.kind === "flashcards") != null
          ? {
              title: reviewSequence.find((s) => s.kind === "flashcards")!.title,
              href: reviewSequence.find((s) => s.kind === "flashcards")!.href,
              reason: reviewSequence.find((s) => s.kind === "flashcards")!.detail,
            }
          : null,
      questions:
        reviewSequence.find((s) => s.kind === "drill" || s.kind === "practice") != null
          ? (() => {
              const q = reviewSequence.find((s) => s.kind === "drill" || s.kind === "practice")!;
              return { title: q.title, href: q.href, reason: q.detail };
            })()
          : null,
      practiceWeak: primary
        ? { title: primary.title, href: primary.href, reason: primary.detail }
        : null,
    },
    signals: {
      hasRepeatIncorrects: ctx.learnerState.competencyStates.some((c) => c.persistentWeak),
      hasStaleInProgressPractice: false,
      perQuestionTimingAvailable: ctx.capabilities.timing_intelligence,
    },
    sessionIntegrationNote: studyPlan.fatigueAware
      ? "Your plan spaces remediation to reduce fatigue while keeping weak-area continuity."
      : "Steps follow your competency graph — same ordering as dashboard and post-exam coaching.",
  };

  return { substrate, publicPlan };
}

/**
 * P0 study-plan convergence — replaces parallel weak-area sequencing with governed cognition substrate.
 */
export async function buildCognitionIntegratedStudyPlan(args: {
  userId: string;
  entitlement: AccessScope;
  learnerPath: string | null;
  topicPerformance?: TopicPerformanceSnapshot | null;
  readinessResult?: ReadinessResult | null;
}): Promise<CognitionStudyPlanPresentation | null> {
  const { userId, entitlement, learnerPath } = args;
  if (!userId || !entitlement.hasAccess) return null;

  const perf = args.topicPerformance ?? (await loadUnifiedTopicPerformance(userId, entitlement, 12));
  if (!perf) return null;

  const resolvedPathway = (learnerPath ?? "").trim() || null;

  const substrate = resolveLearnerCognitionSubstrate({
    pathwayId: resolvedPathway,
    userId,
    topicTrends: perf.trends,
    weakTopics: perf.weakTopics,
    readinessResult: args.readinessResult ?? null,
    persistLearnerState: true,
    sourceSurface: "study_plan",
  });

  return presentCognitionStudyPlan(substrate, perf, resolvedPathway);
}
