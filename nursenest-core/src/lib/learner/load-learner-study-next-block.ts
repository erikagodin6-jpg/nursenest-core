import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { buildLearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import { buildCountdownCopy } from "@/lib/learner/exam-timeline";
import { loadLearnerRequestUser } from "@/lib/learner/load-learner-request-user";
import { loadTodayGoalProgress, TODAY_GOAL_CREDIT_TARGET } from "@/lib/learner/load-today-goal-progress";
import { loadStudyStreakDays } from "@/lib/learner/premium-dashboard-snapshot";
import { buildSmartStudyNextRecommendations } from "@/lib/learner/smart-study-next-engine";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import type { StudyNextRecommendation } from "@/lib/learner/study-next-types";
import { coerceSafeLearnerNavHref } from "@/lib/learner/safe-app-href";

export type RetentionWeakDrillLink = { label: string; href: string };

function weakTopicDrillHref(topic: string, topicCode?: string | null): string {
  const q = new URLSearchParams();
  q.set("preset", "topic_drill");
  q.set("topic", topic);
  const code = (topicCode ?? normalizeTopicKey(topic)).trim();
  if (code.length > 1) q.set("topicCode", code);
  return `/app/questions?${q.toString()}`;
}

export type LearnerStudyNextBlockModel = {
  countdownPrimary: string;
  countdownSecondary: string | null;
  plannerHref: string;
  primary: StudyNextRecommendation;
  secondary: StudyNextRecommendation[];
  /** Consecutive UTC days with study signals (see {@link loadStudyStreakDays}). */
  streakDays: number;
  /** Soft daily goal credits (exam + practice + lesson touch), same as dashboard. */
  todayGoalCredits: number;
  todayGoalTarget: number;
  /** Next pathway lesson or closest “resume” recommendation. */
  continueWhere: { title: string; href: string } | null;
  /** Top weak topics → question-bank drill presets. */
  weakDrills: RetentionWeakDrillLink[];
};

/**
 * Subscriber dashboard strip: bounded snapshot + deterministic recommendations + exam countdown.
 */
export async function loadLearnerStudyNextBlock(
  userId: string,
  entitlement: AccessScope,
): Promise<LearnerStudyNextBlockModel | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) return null;

  const [user, streakDays, todayGoal] = await Promise.all([
    loadLearnerRequestUser(userId),
    loadStudyStreakDays(userId),
    loadTodayGoalProgress(userId),
  ]);
  if (!user) return null;

  const snapshot = await buildLearnerStudySnapshot(userId, entitlement, user.learnerPath);
  if (!snapshot) return null;

  const actions = await buildSmartStudyNextRecommendations(userId, snapshot, {
    maxTotal: 3,
  });
  if (actions.length === 0) return null;

  const countdown = buildCountdownCopy({
    examDatePlanType: user.examDatePlanType,
    examDate: user.examDate,
  });

  const primaryRaw = actions[0]!;
  const primary: StudyNextRecommendation = {
    ...primaryRaw,
    href: coerceSafeLearnerNavHref(primaryRaw.href),
  };
  const secondary: StudyNextRecommendation[] = actions.slice(1).map((r) => ({
    ...r,
    href: coerceSafeLearnerNavHref(r.href),
  }));

  let continueWhere: { title: string; href: string } | null = null;
  if (snapshot.pathwayNext) {
    continueWhere = {
      title: snapshot.pathwayNext.title,
      href: coerceSafeLearnerNavHref(snapshot.pathwayNext.href),
    };
  } else if (primary.type === "continue_pathway_lesson" || primary.type === "weak_topic_lesson") {
    continueWhere = {
      title: primary.title.replace(/^(Continue|Lesson):\s*/i, "").trim() || primary.title,
      href: primary.href,
    };
  }

  const weakDrills: RetentionWeakDrillLink[] = snapshot.weakTopics.slice(0, 4).map((w) => ({
    label: w.topic.trim(),
    href: coerceSafeLearnerNavHref(weakTopicDrillHref(w.topic, w.normalizedTopic ?? null)),
  }));

  if (
    continueWhere &&
    primary.type === "continue_pathway_lesson" &&
    continueWhere.href === primary.href
  ) {
    continueWhere = null;
  }

  const credits = todayGoal?.credits ?? 0;
  const target = todayGoal?.target ?? TODAY_GOAL_CREDIT_TARGET;

  return {
    countdownPrimary: countdown.primary,
    countdownSecondary: countdown.secondary,
    plannerHref: "/app/study-plan",
    primary,
    secondary,
    streakDays,
    todayGoalCredits: credits,
    todayGoalTarget: target,
    continueWhere,
    weakDrills,
  };
}
