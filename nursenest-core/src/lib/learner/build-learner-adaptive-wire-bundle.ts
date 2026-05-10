import {
  buildAdaptiveRecommendationBundleWithLessons,
  pathwayMetadataForAdaptive,
} from "@/lib/adaptive-learning/adaptive-recommendation-engine";
import type { LessonRecommendationCandidate, TopicWeaknessSignalInput } from "@/lib/adaptive-learning/adaptive-learning-types";
import { buildLearnerFacingProgressSummary } from "@/lib/adaptive-learning/learner-analytics-summary";
import { composePostMissStudyPlan } from "@/lib/adaptive-learning/post-miss-orchestration";
import type { PerformanceProfile } from "@/lib/cat/types";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import {
  buildTopicWeaknessSignalsFromLearnerPerformance,
  bumpTopicWeaknessSignal,
} from "@/lib/learner/learner-performance-to-weakness-signals";
import {
  loadLearnerDashboard,
  loadPathwayLessonProgressBundle,
  type PathwayLessonDashboardRow,
} from "@/lib/learner/load-learner-dashboard";
import { loadSharedLearnerProgressBundle } from "@/lib/learner/shared-learner-progress.server";
import { buildVisibleLessonScopeForLearner } from "@/lib/learner/learner-visible-lesson-scope";
import { pathwayLessonRowsToAdaptiveCandidates } from "@/lib/learner/pathway-lessons-to-adaptive-candidates";
import type { TopicPerformanceSnapshot } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import { deriveCanonicalStudyTopicSlug } from "@/lib/lessons/pathway-lesson-linked-learning-assets";
import type { PathwayLessonLinkedLearningSignals } from "@/lib/lessons/pathway-lesson-types";
import type { RoleTrackSlug } from "@/lib/exam-pathways/types";
import { weakTopicSuggestsLabsFocus } from "@/lib/labs/labs-adaptive-signals";
import { weakTopicSuggestsMedCalcFocus } from "@/lib/med-calculations/med-calc-adaptive-signals";
import { weakTopicSuggestsScenarioFocus } from "@/lib/scenarios/scenario-adaptive-signals";

export type AdaptiveWireBundleJson = {
  pathwayId: string;
  roleTrack: RoleTrackSlug;
  /** Bounded recommendation payload for `/app` islands. */
  recommendations: ReturnType<typeof buildAdaptiveRecommendationBundleWithLessons>;
  progressSummary: ReturnType<typeof buildLearnerFacingProgressSummary>;
  /** Non-sensitive deterministic hints (no stems). */
  rationaleLines: string[];
  /** When weak-topic signals match lab interpretation domains, deep-link the Labs workstation. */
  labsStudyNudge: { href: "/app/labs"; matchedTopicKeys: string[] } | null;
  /** When weak-topic signals match clinical judgment / prioritization, deep-link scenarios. */
  scenariosStudyNudge: { href: "/app/clinical-scenarios"; matchedTopicKeys: string[] } | null;
  /** When weak-topic signals match dosing / pharmacology math, deep-link med calculations. */
  medCalcStudyNudge: { href: "/app/med-calculations"; matchedTopicKeys: string[] } | null;
};

function linkedLearningForTopWeak(
  pathwayId: string,
  rankedTopicKeys: readonly string[],
  candidates: LessonRecommendationCandidate[],
): PathwayLessonLinkedLearningSignals | null {
  const keys = rankedTopicKeys.map((k) => k.trim()).filter(Boolean);
  if (keys.length === 0) return null;
  for (const want of keys) {
    for (const c of candidates) {
      const lessonKey = deriveCanonicalStudyTopicSlug({
        topicSlug: c.topicSlug,
        topic: c.bodySystem,
        slug: c.slug,
      });
      if (lessonKey === want && c.linkedLearningSignals) return c.linkedLearningSignals;
    }
  }
  return null;
}

export type AdaptiveWireEngineContext = {
  pathwayId: string;
  roleTrack: RoleTrackSlug;
  weakSignals: TopicWeaknessSignalInput[];
  lessonCandidates: LessonRecommendationCandidate[];
  linkedLearning: PathwayLessonLinkedLearningSignals | null;
};

async function loadAdaptiveWireEngineContext(
  userId: string,
  entitlement: AccessScope,
  options?: {
    source?: string;
    topicPerformance?: TopicPerformanceSnapshot | null;
    supplementalWeakTopicRows?: WeakTopicRow[] | null;
    catOrPracticeProfile?: PerformanceProfile | null;
    pathwayLessonRows?: PathwayLessonDashboardRow[] | null;
    pathwayIdOverride?: string | null;
  } | null,
): Promise<AdaptiveWireEngineContext | null> {
  const bundle = await loadPathwayLessonProgressBundle(userId, entitlement, {
    source: options?.source ?? "adaptive-wire-bundle",
  });
  if (!bundle) return null;

  const visibleLessonScope = await buildVisibleLessonScopeForLearner(userId, entitlement, {
    learnerPath: bundle.user.learnerPath,
    pathwayLessonRows: bundle.pathwayLessonRows,
  });

  const dashboard = await loadLearnerDashboard(userId, entitlement, {
    source: options?.source ?? "adaptive-wire-bundle",
    userProfile: bundle.user,
    visibleLessonScope,
    pathwayRowsForScope: bundle.pathwayLessonRows,
    pathwayMetadataRowCount: bundle.pathwayLessonRows.length,
    pathwayProgressRowCount: bundle.pathwayProgressScoped.length,
  });
  if (!dashboard) return null;

  const pathwayId =
    (options?.pathwayIdOverride?.trim() || dashboard.learnerPath?.trim() || bundle.user.learnerPath?.trim() || "") ||
    "";
  if (!pathwayId) return null;

  const meta = pathwayMetadataForAdaptive(pathwayId);
  const roleTrack: RoleTrackSlug = meta.roleTrack ?? "rn";

  const topicPerformance = options?.topicPerformance ?? dashboard.topicPerformance;
  const weakSignals = buildTopicWeaknessSignalsFromLearnerPerformance({
    topicPerformance: topicPerformance ?? null,
    supplementalWeakTopicRows: options?.supplementalWeakTopicRows ?? dashboard.weakTopics,
    catOrPracticeProfile: options?.catOrPracticeProfile ?? null,
  });

  let lessonRows = options?.pathwayLessonRows ?? bundle.pathwayLessonRows;
  const overridePid = options?.pathwayIdOverride?.trim();
  if (overridePid) {
    lessonRows = lessonRows.filter((r) => r.pathwayId === overridePid);
  }
  const lessonCandidates = pathwayLessonRowsToAdaptiveCandidates(pathwayId, lessonRows, 120);

  const rankedPreview = buildAdaptiveRecommendationBundleWithLessons(
    {
      pathwayId,
      roleTrack,
      linkedLearning: null,
      weakTopicSignals: weakSignals,
      nowMs: Date.now(),
    },
    lessonCandidates,
  ).rankedWeakTopics;

  const linkedLearning = linkedLearningForTopWeak(
    pathwayId,
    rankedPreview.map((r) => r.topicKey),
    lessonCandidates,
  );

  return { pathwayId, roleTrack, weakSignals, lessonCandidates, linkedLearning };
}

function narrowRecommendationsForApi(
  bundle: ReturnType<typeof buildAdaptiveRecommendationBundleWithLessons>,
): typeof bundle {
  return {
    ...bundle,
    rankedWeakTopics: bundle.rankedWeakTopics.slice(0, 10),
    lessons: bundle.lessons.slice(0, 5),
    flashcards: bundle.flashcards.slice(0, 6),
    practiceCat: {
      ...bundle.practiceCat,
      topicKeys: bundle.practiceCat.topicKeys.slice(0, 8),
    },
  };
}

/**
 * Loads the same bounded dashboard aggregates as `/api/learner/readiness`, then runs the adaptive engine.
 * Returns `null` when bundle/dashboard unavailable — **never throws** for empty analytics.
 */
export async function loadLearnerAdaptiveWireBundle(
  userId: string,
  entitlement: AccessScope,
  options?: {
    source?: string;
    topicPerformance?: TopicPerformanceSnapshot | null;
    supplementalWeakTopicRows?: WeakTopicRow[] | null;
    catOrPracticeProfile?: PerformanceProfile | null;
    pathwayLessonRows?: PathwayLessonDashboardRow[] | null;
    pathwayIdOverride?: string | null;
  } | null,
): Promise<AdaptiveWireBundleJson | null> {
  if (!userId || !entitlement.hasAccess) return null;

  const hasMeaningfulExplicitCatProfile =
    options != null &&
    "catOrPracticeProfile" in options &&
    options.catOrPracticeProfile !== undefined;
  const resolvedCatOrPracticeProfile = hasMeaningfulExplicitCatProfile
    ? options.catOrPracticeProfile ?? null
    : (await loadSharedLearnerProgressBundle(userId))?.mergedPerformanceProfile ?? null;

  const ctx = await loadAdaptiveWireEngineContext(userId, entitlement, {
    ...options,
    catOrPracticeProfile: resolvedCatOrPracticeProfile,
  });
  if (!ctx) return null;

  const { pathwayId, roleTrack, weakSignals, lessonCandidates, linkedLearning } = ctx;

  const recommendations = narrowRecommendationsForApi(
    buildAdaptiveRecommendationBundleWithLessons(
      {
        pathwayId,
        roleTrack,
        linkedLearning,
        weakTopicSignals: weakSignals,
        nowMs: Date.now(),
      },
      lessonCandidates,
    ),
  );

  const progressSummary = buildLearnerFacingProgressSummary(resolvedCatOrPracticeProfile);

  const rationaleLines: string[] = [];
  if (recommendations.usedEmptyFallback) {
    if (recommendations.fallbackReason === "no_weak_signals") {
      rationaleLines.push("Keep practicing — topic-level weakness signals will appear as you answer more questions.");
    } else if (recommendations.fallbackReason === "all_topics_mastered") {
      rationaleLines.push("Recent topic signals look strong — rotate formats (lessons, bank, timed sets) to stay sharp.");
    } else if (recommendations.fallbackReason === "no_lesson_candidates") {
      rationaleLines.push("Weak topics are visible; lesson matches for this pathway will appear when inventory aligns.");
    } else {
      rationaleLines.push("Continue your plan — add graded practice to sharpen the next recommendations.");
    }
  } else {
    rationaleLines.push("Focus the next study block on your highest-urgency topics, then revisit with mixed review.");
    if (recommendations.practiceCat.suggestStudyModeReview) {
      rationaleLines.push("CAT-style practice is available for your pathway — use study mode when you want rationales between items.");
    }
  }

  const matchedLabsTopics = recommendations.rankedWeakTopics
    .map((w) => w.topicKey)
    .filter((k) => weakTopicSuggestsLabsFocus(k))
    .slice(0, 4);
  const labsStudyNudge =
    matchedLabsTopics.length > 0 ? { href: "/app/labs" as const, matchedTopicKeys: matchedLabsTopics } : null;

  const matchedScenarioTopics = recommendations.rankedWeakTopics
    .map((w) => w.topicKey)
    .filter((k) => weakTopicSuggestsScenarioFocus(k))
    .slice(0, 4);
  const scenariosStudyNudge =
    matchedScenarioTopics.length > 0
      ? { href: "/app/clinical-scenarios" as const, matchedTopicKeys: matchedScenarioTopics }
      : null;

  const matchedMedCalcTopics = recommendations.rankedWeakTopics
    .map((w) => w.topicKey)
    .filter((k) => weakTopicSuggestsMedCalcFocus(k))
    .slice(0, 4);
  const medCalcStudyNudge =
    matchedMedCalcTopics.length > 0
      ? { href: "/app/med-calculations" as const, matchedTopicKeys: matchedMedCalcTopics }
      : null;

  return {
    pathwayId,
    roleTrack,
    recommendations,
    progressSummary: {
      ...progressSummary,
      strongestSystems: progressSummary.strongestSystems.slice(0, 5),
      weakestSystems: progressSummary.weakestSystems.slice(0, 5),
    },
    rationaleLines: rationaleLines.slice(0, 4),
    labsStudyNudge,
    scenariosStudyNudge,
    medCalcStudyNudge,
  };
}

export function buildPracticePostMissPlanServer(args: {
  pathwayId: string;
  roleTrack: RoleTrackSlug;
  weakTopicSignals: TopicWeaknessSignalInput[];
  lessonCandidates: LessonRecommendationCandidate[];
  linkedLearning: PathwayLessonLinkedLearningSignals | null;
  nowMs: number;
}) {
  return composePostMissStudyPlan({
    trigger: "practice_miss",
    pathwayId: args.pathwayId,
    roleTrack: args.roleTrack,
    linkedLearning: args.linkedLearning,
    weakTopicSignals: args.weakTopicSignals,
    lessonCandidates: args.lessonCandidates,
    nowMs: args.nowMs,
  });
}

/**
 * Practice-test post-miss: merges server weakness ledger with an optional fresh miss topic key.
 */
export async function buildPracticeAdaptivePostMissPayload(
  userId: string,
  entitlement: AccessScope,
  args: { pathwayId: string; missedTopicKey?: string | null },
): Promise<ReturnType<typeof composePostMissStudyPlan> | null> {
  if (!userId || !entitlement.hasAccess) return null;
  const nowMs = Date.now();
  const sharedProgress = await loadSharedLearnerProgressBundle(userId);
  const ctx = await loadAdaptiveWireEngineContext(userId, entitlement, {
    source: "adaptive-post-miss",
    pathwayIdOverride: args.pathwayId,
    catOrPracticeProfile: sharedProgress?.mergedPerformanceProfile ?? null,
  });
  if (!ctx) return null;

  let weak = ctx.weakSignals;
  if (args.missedTopicKey?.trim()) {
    weak = bumpTopicWeaknessSignal(weak, args.missedTopicKey, nowMs);
  }

  const rankedPreview = buildAdaptiveRecommendationBundleWithLessons(
    {
      pathwayId: ctx.pathwayId,
      roleTrack: ctx.roleTrack,
      linkedLearning: null,
      weakTopicSignals: weak,
      nowMs,
    },
    ctx.lessonCandidates,
  ).rankedWeakTopics;

  const linkedLearning = linkedLearningForTopWeak(
    ctx.pathwayId,
    rankedPreview.map((r) => r.topicKey),
    ctx.lessonCandidates,
  );

  return composePostMissStudyPlan({
    trigger: "practice_miss",
    pathwayId: ctx.pathwayId,
    roleTrack: ctx.roleTrack,
    linkedLearning,
    weakTopicSignals: weak,
    lessonCandidates: ctx.lessonCandidates,
    nowMs,
  });
}
