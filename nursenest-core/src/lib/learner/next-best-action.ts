import "server-only";

import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import type { TodayGoalProgress } from "@/lib/learner/load-today-goal-progress";
import type { ExplainableAction } from "@/lib/insights/types";

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
 */

export type NextBestAction = {
  title: string;
  subtitle: string;
  href: string;
  kind: ExplainableAction["kind"] | "fallback";
  reasoning: string;
};

export function getNextBestAction(
  snapshot: PremiumDashboardSnapshot | null,
  studySnap: LearnerStudySnapshot | null,
  todayGoal: TodayGoalProgress | null,
): NextBestAction {
  // 1. Insight engine primary recommendation
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
    };
  }

  // 4. Today's goal incomplete
  if (todayGoal && todayGoal.credits < todayGoal.target) {
    const missing: string[] = [];
    if (!todayGoal.breakdown.hasLessonTouch) missing.push("a lesson");
    if (!todayGoal.breakdown.hasExamActivity) missing.push("exam practice");
    if (!todayGoal.breakdown.hasPracticeCompleted) missing.push("a practice session");
    const hint = missing.length > 0 ? `Try ${missing[0]} to earn a credit` : "Complete a study activity";
    return {
      title: "Finish Today's Goal",
      subtitle: hint,
      href: "/app/questions",
      kind: "quiz",
      reasoning: `${todayGoal.credits}/${todayGoal.target} daily credits so far`,
    };
  }

  // 5. Fallback
  return {
    title: "Start a Session",
    subtitle: "Practice questions or review a lesson",
    href: "/app/questions",
    kind: "fallback",
    reasoning: "A good time to practice",
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
): DashboardModel {
  const nextAction = getNextBestAction(snapshot, studySnap, todayGoal);

  const secondaryActions = snapshot?.insights?.recommendations.secondary ?? [];

  const todayTasks = snapshot?.insights?.dailyPlan.todayTasks ?? [];

  return { nextAction, secondaryActions, todayTasks };
}
