import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import type { CoachingModel } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import { planRemediationV3 } from "@/lib/learner/rn-coaching-intelligence/remediation-planner-v3";
import { governStudyPlanCopy } from "@/lib/measurements/measurement-surface-convergence";

export type StudyPlanBlockKind = "lesson" | "flashcards" | "drill" | "practice" | "rest" | "reassessment";

export type GovernedStudyPlanBlock = {
  dayOffset: number;
  kind: StudyPlanBlockKind;
  title: string;
  reason: string;
  href: string;
  competencyId?: string;
  spacedReinforcement: boolean;
};

export type GovernedRnStudyPlan = {
  generatedAt: string;
  coachingModel: CoachingModel;
  headline: string;
  fatigueAware: boolean;
  weakTopicContinuity: string[];
  blocks: GovernedStudyPlanBlock[];
};

/**
 * Derives a fatigue-aware, non-repetitive study sequence from learner-state intelligence.
 */
export function buildGovernedRnStudyPlan(args: {
  learnerState: RnLearnerStateSnapshot;
  coachingModel: CoachingModel;
  pathwayId: string | null;
  remediationUserId?: string | null;
  maxBlocks?: number;
}): GovernedRnStudyPlan {
  const maxBlocks = args.maxBlocks ?? 8;
  const weak = args.learnerState.competencyStates
    .filter((c) => c.persistentWeak || c.masteryScore < 55)
    .sort((a, b) => a.masteryScore - b.masteryScore);

  const weakLabels = weak.map((c) => c.competencyId.replace(/_/g, " "));
  const remediation = planRemediationV3({
    coachingModel: args.coachingModel,
    sessionKind: "practice_exam",
    pathwayId: args.pathwayId,
    weakTopicLabels: weakLabels,
    learnerState: args.learnerState,
    remediationUserId: args.remediationUserId,
    maxItems: maxBlocks,
    sourceSurface: "study_plan",
  });

  const seenHref = new Set<string>();
  const blocks: GovernedStudyPlanBlock[] = [];
  let dayOffset = 0;

  const fatigueAware =
    args.learnerState.remediationFatigueScore >= 0.45 || args.learnerState.pacingProfile === "volatile";

  for (const step of remediation) {
    if (blocks.length >= maxBlocks) break;
    if (seenHref.has(step.href)) continue;
    seenHref.add(step.href);

    if (fatigueAware && blocks.length > 0 && blocks.length % 3 === 0) {
      blocks.push({
        dayOffset,
        kind: "rest",
        title: "Light review day",
        reason: "Spacing reinforcement after focused remediation reduces fatigue.",
        href: "/app/dashboard",
        spacedReinforcement: true,
      });
      dayOffset += 1;
    }

    blocks.push({
      dayOffset,
      kind:
        step.kind === "flashcards"
          ? "flashcards"
          : step.kind === "drill"
            ? "drill"
            : step.kind === "readiness_reassessment"
              ? "reassessment"
              : step.kind === "lesson" || step.kind === "mechanism"
                ? "lesson"
                : "practice",
      title: governStudyPlanCopy(step.title, args.pathwayId),
      reason: governStudyPlanCopy(step.reason, args.pathwayId),
      href: step.href,
      competencyId: step.graphStep?.title?.split(":")[0]?.trim(),
      spacedReinforcement: dayOffset > 0,
    });
    dayOffset += fatigueAware ? 2 : 1;
  }

  const weakTopicContinuity = weak.slice(0, 3).map((c) => c.competencyId.replace(/_/g, " "));

  const rawHeadline =
    weakTopicContinuity.length > 0
      ? `Stabilize ${weakTopicContinuity[0]} before expanding to new domains`
      : "Maintain mixed practice to hold readiness momentum";

  return {
    generatedAt: new Date().toISOString(),
    coachingModel: args.coachingModel,
    headline: governStudyPlanCopy(rawHeadline, args.pathwayId),
    fatigueAware,
    weakTopicContinuity,
    blocks,
  };
}
