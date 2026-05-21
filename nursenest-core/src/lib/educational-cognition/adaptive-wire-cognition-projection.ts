import "server-only";

import {
  buildAdaptiveRecommendationBundleWithLessons,
  pathwayMetadataForAdaptive,
} from "@/lib/adaptive-learning/adaptive-recommendation-engine";
import type { LessonRecommendationCandidate } from "@/lib/adaptive-learning/adaptive-learning-types";
import { buildLearnerFacingProgressSummary } from "@/lib/adaptive-learning/learner-analytics-summary";
import type { PerformanceProfile } from "@/lib/cat/types";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import {
  buildGovernedAdaptiveRecommendations,
  type GovernedAdaptiveRecommendations,
} from "@/lib/educational-cognition/adaptive-recommendation-cognition";
import type { AdaptiveWireBundleJson } from "@/lib/learner/build-learner-adaptive-wire-bundle";
import { buildTopicWeaknessSignalsFromLearnerPerformance } from "@/lib/learner/learner-performance-to-weakness-signals";
import type { TopicPerformanceSnapshot } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import type { ReadinessResult } from "@/lib/learner/readiness-score";
import type { RoleTrackSlug } from "@/lib/exam-pathways/types";
import { weakTopicSuggestsClinicalSkillsFocus } from "@/lib/clinical-skills/clinical-skills-adaptive-signals";
import { pathwayAllowsEcgLinkedLearning, weakTopicSuggestsEcgFocus } from "@/lib/ecg-module/ecg-linked-learning";
import { weakTopicSuggestsLabsFocus } from "@/lib/labs/labs-adaptive-signals";
import { weakTopicSuggestsMedCalcFocus } from "@/lib/med-calculations/med-calc-adaptive-signals";
import { weakTopicSuggestsScenarioFocus } from "@/lib/scenarios/scenario-adaptive-signals";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { maxGraphStepsForReliability } from "@/lib/educational-cognition/cognition-reliability";
import { loadDurableLearnerCognitionEnvelopeSync } from "@/lib/educational-cognition/learner-cognition-persistence";
import { resolveEducationalCognitionContext } from "@/lib/educational-cognition/resolve-educational-cognition-context";
import { emitGovernedServerGraphTelemetry } from "@/lib/educational-graph/governed-server-telemetry";

function studyNudgesFromRanked(
  pathwayId: string,
  rankedTopicKeys: string[],
): Pick<
  AdaptiveWireBundleJson,
  | "labsStudyNudge"
  | "scenariosStudyNudge"
  | "medCalcStudyNudge"
  | "clinicalSkillsStudyNudge"
  | "ecgStudyNudge"
> {
  const matchedLabsTopics = rankedTopicKeys.filter((k) => weakTopicSuggestsLabsFocus(k)).slice(0, 4);
  const matchedScenarioTopics = rankedTopicKeys.filter((k) => weakTopicSuggestsScenarioFocus(k)).slice(0, 4);
  const matchedMedCalcTopics = rankedTopicKeys.filter((k) => weakTopicSuggestsMedCalcFocus(k)).slice(0, 4);
  const matchedClinicalSkillsTopics = rankedTopicKeys
    .filter((k) => weakTopicSuggestsClinicalSkillsFocus(k))
    .slice(0, 4);
  const pathwayDef = getExamPathwayById(pathwayId);
  const ecgPathwayAllowed = pathwayDef ? pathwayAllowsEcgLinkedLearning(pathwayDef) : false;
  const matchedEcgTopics = rankedTopicKeys.filter((k) => weakTopicSuggestsEcgFocus(k)).slice(0, 4);

  return {
    labsStudyNudge:
      matchedLabsTopics.length > 0 ? { href: "/app/labs" as const, matchedTopicKeys: matchedLabsTopics } : null,
    scenariosStudyNudge:
      matchedScenarioTopics.length > 0
        ? { href: "/app/clinical-scenarios" as const, matchedTopicKeys: matchedScenarioTopics }
        : null,
    medCalcStudyNudge:
      matchedMedCalcTopics.length > 0
        ? { href: "/app/med-calculations" as const, matchedTopicKeys: matchedMedCalcTopics }
        : null,
    clinicalSkillsStudyNudge:
      matchedClinicalSkillsTopics.length > 0
        ? { href: "/app/clinical-skills" as const, matchedTopicKeys: matchedClinicalSkillsTopics }
        : null,
    ecgStudyNudge:
      ecgPathwayAllowed && matchedEcgTopics.length > 0
        ? { href: "/modules/ecg" as const, matchedTopicKeys: matchedEcgTopics }
        : null,
  };
}

function rationaleFromGoverned(governed: GovernedAdaptiveRecommendations): string[] {
  const lines: string[] = [];
  if (governed.cognition.graphPrimary) {
    lines.push(
      `Graph-guided next step: ${governed.cognition.graphPrimary.title} — ${governed.cognition.graphPrimary.reason}`,
    );
  }
  if (governed.trajectoryLines[0]) lines.push(governed.trajectoryLines[0]);
  if (governed.cognition.fatigueCapActive) {
    lines.push("Remediation fatigue cap active — fewer parallel CTAs to protect study momentum.");
  }
  return lines.slice(0, 4);
}

/**
 * Projects governed cognition + lesson engine into the adaptive wire bundle JSON shape.
 */
export async function projectAdaptiveWireBundleFromCognition(args: {
  userId: string;
  entitlement: AccessScope;
  pathwayId: string;
  roleTrack: RoleTrackSlug;
  readiness: ReadinessResult | null;
  topicPerformance: TopicPerformanceSnapshot | null;
  weakTopics: WeakTopicRow[];
  lessonCandidates: LessonRecommendationCandidate[];
  catOrPracticeProfile: PerformanceProfile | null;
}): Promise<AdaptiveWireBundleJson | null> {
  if (!args.entitlement.hasAccess) return null;
  if (!args.readiness) return null;

  const governed = await buildGovernedAdaptiveRecommendations({
    preferredPathwayId: args.pathwayId,
    examDatePlanType: null,
    examDate: null,
    readiness: args.readiness,
    weakTopics: args.weakTopics,
    topicTrends: args.topicPerformance?.trends ?? [],
    streakDays: 0,
    lessonPct: 0,
    lessonsCompleted: 0,
    lessonsTotal: 0,
    studyCadencePreference: null,
    continueLesson: null,
    recommendedQuizTopic: args.weakTopics[0]?.topic ?? null,
    mockCount: 0,
    practiceSessionCount: 0,
    userId: args.userId,
    entitlement: args.entitlement,
  });

  const cognitionCtx = resolveEducationalCognitionContext(args.pathwayId, {
    userId: args.userId,
    readinessResult: args.readiness,
    weakTopics: args.weakTopics,
    topicTrends: args.topicPerformance?.trends ?? [],
  });
  emitGovernedServerGraphTelemetry({
    userId: args.userId,
    entitlement: args.entitlement,
    event: "next_best_action_clicked",
    cognition: cognitionCtx,
    sourceSurface: "recommendation_engine",
    step: governed.cognition.primaryGraphStep ?? undefined,
    topicSlug: args.weakTopics[0]?.topic,
  });

  const envelope = loadDurableLearnerCognitionEnvelopeSync(args.userId);
  const reliability = envelope?.cognitionReliability ?? "inferred";
  const maxTopics = maxGraphStepsForReliability(reliability, 10);

  const weakSignals = buildTopicWeaknessSignalsFromLearnerPerformance({
    topicPerformance: args.topicPerformance,
    supplementalWeakTopicRows: args.weakTopics,
    catOrPracticeProfile: args.catOrPracticeProfile,
  });

  const recommendations = buildAdaptiveRecommendationBundleWithLessons(
    {
      pathwayId: args.pathwayId,
      roleTrack: args.roleTrack,
      linkedLearning: null,
      weakTopicSignals: weakSignals,
      nowMs: Date.now(),
    },
    args.lessonCandidates,
  );

  const rankedKeys = recommendations.rankedWeakTopics.map((r) => r.topicKey).slice(0, maxTopics);
  if (governed.cognition.graphPrimary && rankedKeys.length > 0) {
    rankedKeys[0] = governed.primaryNext.href.includes("topic=")
      ? decodeURIComponent(governed.primaryNext.href.split("topic=")[1]?.split("&")[0] ?? rankedKeys[0])
      : rankedKeys[0];
  }

  const narrowed = {
    ...recommendations,
    rankedWeakTopics: recommendations.rankedWeakTopics.slice(0, maxTopics),
    lessons: recommendations.lessons.slice(0, 5),
    flashcards: recommendations.flashcards.slice(0, 6),
    practiceCat: {
      ...recommendations.practiceCat,
      topicKeys: recommendations.practiceCat.topicKeys.slice(0, 8),
    },
  };

  const progressSummary = buildLearnerFacingProgressSummary(args.catOrPracticeProfile);
  const rationaleLines = rationaleFromGoverned(governed);
  if (rationaleLines.length === 0 && narrowed.usedEmptyFallback) {
    rationaleLines.push("Continue your plan — add graded practice to sharpen the next recommendations.");
  }

  return {
    pathwayId: args.pathwayId,
    roleTrack: args.roleTrack,
    recommendations: narrowed,
    progressSummary: {
      ...progressSummary,
      strongestSystems: progressSummary.strongestSystems.slice(0, 5),
      weakestSystems: progressSummary.weakestSystems.slice(0, 5),
    },
    rationaleLines,
    ...studyNudgesFromRanked(args.pathwayId, rankedKeys),
  };
}

export function pathwayRoleTrackForWire(pathwayId: string): RoleTrackSlug {
  return pathwayMetadataForAdaptive(pathwayId).roleTrack ?? "rn";
}
