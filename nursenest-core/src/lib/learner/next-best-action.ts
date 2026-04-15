import "server-only";

import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import type { TodayGoalProgress } from "@/lib/learner/load-today-goal-progress";
import type { ExplainableAction } from "@/lib/insights/types";
import type { StudySettings } from "@/lib/learner/study-settings";

/**
 * Next-best-action resolution for the dashboard primary CTA.
 *
 * Priority order:
 *   1. Insight engine recommendation (if the insight engine produced one)
 *   2. Continue last lesson (if there's one in progress)
 *   3. Weak topic practice (if weak areas detected)
 *   4. Practice questions fallback
 *
 * Returns a single action with title, subtitle, href, and reasoning.
 * Optional `i18n` keys are resolved in the learner UI so copy stays in bundles.
 */

export type NextBestActionI18n = {
  titleKey: string;
  subtitleKey: string;
  reasoningKey: string;
  params?: Record<string, string | number>;
};

export type NextBestAction = {
  title: string;
  subtitle: string;
  href: string;
  kind: ExplainableAction["kind"] | "fallback";
  reasoning: string;
  i18n?: NextBestActionI18n;
};

export function getNextBestAction(
  snapshot: PremiumDashboardSnapshot | null,
  studySnap: LearnerStudySnapshot | null,
  todayGoal: TodayGoalProgress | null,
  studySettings: StudySettings,
): NextBestAction {
  if (!studySettings.enableAdaptivePlan) {
    if (todayGoal && todayGoal.credits < todayGoal.target) {
      return {
        title: "Start a Manual Study Session",
        subtitle: "Choose a lesson, question set, or exam practice block",
        href: "/app/questions",
        kind: "fallback",
        reasoning: "Adaptive planning is off, so manual study entry points are shown instead.",
        i18n: {
          titleKey: "learner.dashboard.nextAction.manualSession.title",
          subtitleKey: "learner.dashboard.nextAction.manualSession.subtitle",
          reasoningKey: "learner.dashboard.nextAction.manualSession.reasoning",
        },
      };
    }
    return {
      title: "Manual Study Hub",
      subtitle: "Open question practice, lessons, or exams directly",
      href: "/app/questions",
      kind: "fallback",
      reasoning: "Adaptive planning is disabled in your study settings.",
      i18n: {
        titleKey: "learner.dashboard.nextAction.manualHub.title",
        subtitleKey: "learner.dashboard.nextAction.manualHub.subtitle",
        reasoningKey: "learner.dashboard.nextAction.manualHub.reasoning",
      },
    };
  }

  // 1. Insight engine primary recommendation (dynamic copy from engine)
  const primary = snapshot?.insights?.recommendations.primary;
  if (primary) {
    return {
      title: primary.title,
      subtitle: primary.what,
      href: primary.href,
      kind: primary.kind,
      reasoning: primary.why,
    };
  }

  // 2. Continue last lesson
  if (snapshot?.continueLesson) {
    return {
      title: "Continue Your Lesson",
      subtitle: `Pick up where you left off: ${snapshot.continueLesson.title}`,
      href: snapshot.continueLesson.href,
      kind: "continue",
      reasoning: "You have an unfinished lesson",
      i18n: {
        titleKey: "learner.dashboard.nextAction.continueLesson.title",
        subtitleKey: "learner.dashboard.nextAction.continueLesson.subtitle",
        reasoningKey: "learner.dashboard.nextAction.continueLesson.reasoning",
        params: { lessonTitle: snapshot.continueLesson.title },
      },
    };
  }

  // 3. Weak topic practice
  const topWeak = studySnap?.topWeak;
  if (topWeak) {
    return {
      title: `Strengthen ${topWeak.topic}`,
      subtitle: "Practice questions on your weakest topic",
      href: "/app/questions",
      kind: "quiz",
      reasoning: `Your accuracy in ${topWeak.topic} needs work`,
      i18n: {
        titleKey: "learner.dashboard.nextAction.weakTopic.title",
        subtitleKey: "learner.dashboard.nextAction.weakTopic.subtitle",
        reasoningKey: "learner.dashboard.nextAction.weakTopic.reasoning",
        params: { topic: topWeak.topic },
      },
    };
  }

  // 4. Today's goal incomplete
  if (todayGoal && todayGoal.credits < todayGoal.target) {
    let subtitleKey = "learner.dashboard.nextAction.todayGoal.subtitleDefault";
    if (!todayGoal.breakdown.hasLessonTouch) {
      subtitleKey = "learner.dashboard.nextAction.todayGoal.subtitleLesson";
    } else if (!todayGoal.breakdown.hasExamActivity) {
      subtitleKey = "learner.dashboard.nextAction.todayGoal.subtitleExam";
    } else if (!todayGoal.breakdown.hasPracticeCompleted) {
      subtitleKey = "learner.dashboard.nextAction.todayGoal.subtitlePractice";
    }
    return {
      title: "Finish Today's Goal",
      subtitle: "Complete a study activity",
      href: "/app/questions",
      kind: "quiz",
      reasoning: `${todayGoal.credits}/${todayGoal.target} daily credits so far`,
      i18n: {
        titleKey: "learner.dashboard.nextAction.todayGoal.title",
        subtitleKey,
        reasoningKey: "learner.dashboard.nextAction.todayGoal.reasoning",
        params: { credits: todayGoal.credits, target: todayGoal.target },
      },
    };
  }

  // 5. Fallback
  return {
    title: "Start a Session",
    subtitle: "Practice questions or review a lesson",
    href: "/app/questions",
    kind: "fallback",
    reasoning: "A good time to practice",
    i18n: {
      titleKey: "learner.dashboard.nextAction.fallback.title",
      subtitleKey: "learner.dashboard.nextAction.fallback.subtitle",
      reasoningKey: "learner.dashboard.nextAction.fallback.reasoning",
    },
  };
}

/**
 * Build a dashboard model with derived display values.
 * Keeps components free of business logic.
 */
export type DashboardModel = {
  nextAction: NextBestAction;
  secondaryActions: ExplainableAction[];
  todayTasks: { label: string; href: string; reason: string }[];
};

export function buildDashboardModel(
  snapshot: PremiumDashboardSnapshot | null,
  studySnap: LearnerStudySnapshot | null,
  todayGoal: TodayGoalProgress | null,
  studySettings: StudySettings,
): DashboardModel {
  const nextAction = getNextBestAction(snapshot, studySnap, todayGoal, studySettings);

  const secondaryActions = studySettings.enableAdaptivePlan
    ? (snapshot?.insights?.recommendations.secondary ?? [])
    : [];

  const todayTasks = studySettings.enableAdaptivePlan
    ? (snapshot?.insights?.dailyPlan.todayTasks ?? [])
    : [];

  return { nextAction, secondaryActions, todayTasks };
}
