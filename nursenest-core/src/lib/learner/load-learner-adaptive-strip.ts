import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { buildCountdownCopy } from "@/lib/learner/exam-timeline";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";

export type LearnerAdaptiveStripModel = {
  countdownPrimary: string;
  countdownSecondary: string | null;
  weakAreasShort: string | null;
  nextActionShort: string;
  /** Relative link — tier-safe destinations only. */
  nextActionHref: string;
  plannerHref: string;
};

function shortWeakAreas(topics: string[]): string | null {
  if (!topics.length) return null;
  const t = topics.slice(0, 2).join(", ");
  return topics.length > 2 ? `${t} +${topics.length - 2}` : t;
}

/**
 * Compact nav strip: exam countdown + weak-area hint + one next step (subscriber-only).
 */
export async function loadLearnerAdaptiveStrip(
  userId: string,
  entitlement: AccessScope,
): Promise<LearnerAdaptiveStripModel | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        examDate: true,
        examDatePlanType: true,
      },
    });
    if (!user) return null;

    const countdown = buildCountdownCopy({
      examDatePlanType: user.examDatePlanType,
      examDate: user.examDate,
    });

    let weakShort: string | null = null;
    let firstTopic: string | null = null;
    let topicCode: string | null = null;
    try {
      const perf = await loadUnifiedTopicPerformance(userId, entitlement, 4);
      const names = perf.weakTopics.map((w) => w.topic).filter(Boolean);
      weakShort = shortWeakAreas(names);
      const top = perf.weakTopics[0];
      firstTopic = top?.topic ?? perf.recommendedQuizTopic ?? null;
      topicCode = top ? normalizeTopicKey(top.topic) : firstTopic ? normalizeTopicKey(firstTopic) : null;
    } catch {
      weakShort = null;
    }

    const nextActionHref = firstTopic
      ? `/app/questions?preset=topic_drill&topic=${encodeURIComponent(firstTopic)}${
          topicCode && topicCode.length > 1 ? `&topicCode=${encodeURIComponent(topicCode)}` : ""
        }`
      : "/app/lessons";
    const nextActionShort = firstTopic ? `Priority review: ${firstTopic}` : "Open lessons";

    return {
      countdownPrimary: countdown.primary,
      countdownSecondary: countdown.secondary,
      weakAreasShort: weakShort,
      nextActionShort,
      nextActionHref,
      plannerHref: "/app/study-plan",
    };
  } catch {
    return null;
  }
}
