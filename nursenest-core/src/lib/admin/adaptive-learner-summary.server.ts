/**
 * Admin-only bounded summary of learner study signals — no stems, rationales, or full question payloads.
 * Call only from `requireAdmin` RSC routes or `/api/admin/*` handlers.
 */
import { extractSnapshotFromAdaptiveState } from "@/lib/cat/session-persistence";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import { resolveEntitlement, type AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { pathwayCatPoolSurfaceAvailable } from "@/lib/lessons/pathway-lesson-linked-learning-assets";
import { buildLearnerFacingProgressSummary } from "@/lib/adaptive-learning/learner-analytics-summary";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isAdaptiveLearningAdminFeatureEnabled } from "@/lib/admin/adaptive-learning-env.server";
import {
  loadSharedLearnerProgressBundle,
  extractPerformanceProfileFromAdaptiveJson,
  type SharedLearnerActivityRow,
} from "@/lib/learner/shared-learner-progress.server";

export { extractPerformanceProfileFromAdaptiveJson } from "@/lib/learner/shared-learner-progress.server";

const MAX_ACTIVITY_ITEMS = 12;

function pathwayLabel(id: string | null | undefined): string | null {
  if (!id?.trim()) return null;
  return EXAM_PATHWAYS.find((p) => p.id === id)?.displayName ?? id;
}

export type AdaptiveLearnerTopicRow = {
  topic: string;
  correctCount: number;
  wrongCount: number;
  wrongStreak: number;
  lastAttemptAt: string | null;
  /** Null when no attempts. */
  accuracyPct: number | null;
};

export type AdaptiveLearnerActivityRow = SharedLearnerActivityRow;

export type AdaptiveLearnerAdminSummary = {
  studying: {
    targetExamPathwayId: string | null;
    targetPathwayLabel: string | null;
    learnerPath: string | null;
    examFocus: string | null;
    studyGoal: string | null;
    dailyStudyMinutes: number | null;
    studyCadencePreference: string | null;
  };
  subscriptionAccess: {
    entitlement: AccessScope;
    paidSubscriptionActive: boolean;
  };
  weakestTopics: AdaptiveLearnerTopicRow[];
  recommendedNextSteps: string[];
  recentActivity: AdaptiveLearnerActivityRow[];
  adaptivePanel:
    | { visible: false }
    | {
        visible: true;
        sufficientSignals: boolean;
        canGenerateRecommendations: boolean;
        /** Non-clinical hints only. */
        readinessBand: string | null;
        readinessScore: number | null;
        nextFocusAreas: string[];
        systemSummary: ReturnType<typeof buildLearnerFacingProgressSummary>;
      };
};

function masteryFromCounts(correct: number, wrong: number): number {
  const t = correct + wrong;
  if (t <= 0) return 0;
  return correct / t;
}

function buildRecommendedSteps(input: {
  entitlement: AccessScope;
  paid: boolean;
  pathwayLabel: string | null;
  snapshot: ReturnType<typeof extractSnapshotFromAdaptiveState> | null;
  topics: AdaptiveLearnerTopicRow[];
}): string[] {
  const out: string[] = [];
  if (!input.entitlement.hasAccess) {
    out.push("Learner does not currently have paid access — question bank / CAT surfaces may be gated.");
  } else if (!input.paid) {
    out.push("No active paid subscription row — confirm trial, team license, or Stripe state if access looks wrong.");
  }
  if (input.pathwayLabel) {
    out.push(`Keep study scoped to pathway: ${input.pathwayLabel}.`);
  }
  if (input.snapshot?.nextFocusAreas?.length) {
    out.push(`Latest CAT-style snapshot suggests focus on: ${input.snapshot.nextFocusAreas.slice(0, 3).join(", ")}.`);
  }
  for (const t of input.topics.slice(0, 5)) {
    if (t.wrongCount > 0 || t.wrongStreak > 0) {
      out.push(`Topic “${t.topic}” shows misses — suggest targeted bank review (counts only; no item text).`);
    }
  }
  return out.slice(0, 10);
}

export async function loadAdaptiveLearnerAdminSummary(userId: string): Promise<AdaptiveLearnerAdminSummary | null> {
  if (!isDatabaseUrlConfigured() || !userId.trim()) return null;

  try {
    const [entitlement, user, paidSub, shared] = await Promise.all([
      resolveEntitlement(userId),
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          targetExamPathwayId: true,
          learnerPath: true,
          examFocus: true,
          studyGoal: true,
          dailyStudyMinutes: true,
          studyCadencePreference: true,
        },
      }),
      prisma.subscription.findFirst({
        where: { userId, status: { in: ["ACTIVE", "GRACE"] } },
        select: { id: true },
      }),
      loadSharedLearnerProgressBundle(userId),
    ]);

    if (!user) return null;
    if (!shared) return null;

    const paidSubscriptionActive = Boolean(paidSub);
    const topicRows = shared.topicRows;
    const weakestTopics: AdaptiveLearnerTopicRow[] = topicRows.map((r) => {
      const acc = masteryFromCounts(r.correctCount, r.wrongCount);
      return {
        topic: r.topic,
        correctCount: r.correctCount,
        wrongCount: r.wrongCount,
        wrongStreak: r.wrongStreak,
        lastAttemptAt: r.lastAttemptAt?.toISOString() ?? null,
        accuracyPct: r.correctCount + r.wrongCount > 0 ? Math.round(acc * 1000) / 10 : null,
      };
    });

    const snapshot = shared.adaptiveSnapshot;

    const systemSummary = buildLearnerFacingProgressSummary(shared.mergedPerformanceProfile);
    const pathwayId = user.targetExamPathwayId?.trim() ?? null;
    const poolOk = pathwayId ? pathwayCatPoolSurfaceAvailable(pathwayId) : false;
    const topicSignalCount = topicRows.filter((t) => t.correctCount + t.wrongCount > 0).length;
    const sufficientSignals =
      Boolean(snapshot) ||
      systemSummary.hasMeaningfulPracticeHistory ||
      topicSignalCount >= 2 ||
      (topicSignalCount >= 1 && Boolean(pathwayId));

    const envOn = isAdaptiveLearningAdminFeatureEnabled();
    const canGenerateRecommendations =
      envOn && entitlement.hasAccess && sufficientSignals && Boolean(pathwayId) && poolOk;

    const label = pathwayLabel(user.targetExamPathwayId);
    const recommendedNextSteps = buildRecommendedSteps({
      entitlement,
      paid: paidSubscriptionActive,
      pathwayLabel: label,
      snapshot,
      topics: weakestTopics,
    });

    const trimmedActivity = shared.recentActivity.slice(0, MAX_ACTIVITY_ITEMS);

    const adaptivePanel:
      | { visible: false }
      | {
          visible: true;
          sufficientSignals: boolean;
          canGenerateRecommendations: boolean;
          readinessBand: string | null;
          readinessScore: number | null;
          nextFocusAreas: string[];
          systemSummary: ReturnType<typeof buildLearnerFacingProgressSummary>;
        } = !envOn
      ? { visible: false }
      : {
          visible: true,
          sufficientSignals,
          canGenerateRecommendations,
          readinessBand: snapshot?.readinessBand ?? null,
          readinessScore: snapshot?.readinessScore ?? null,
          nextFocusAreas: snapshot?.nextFocusAreas ?? [],
          systemSummary,
        };

    return {
      studying: {
        targetExamPathwayId: user.targetExamPathwayId,
        targetPathwayLabel: label,
        learnerPath: user.learnerPath,
        examFocus: user.examFocus,
        studyGoal: user.studyGoal,
        dailyStudyMinutes: user.dailyStudyMinutes,
        studyCadencePreference: user.studyCadencePreference,
      },
      subscriptionAccess: {
        entitlement,
        paidSubscriptionActive,
      },
      weakestTopics,
      recommendedNextSteps,
      recentActivity: trimmedActivity,
      adaptivePanel,
    };
  } catch {
    return null;
  }
}
