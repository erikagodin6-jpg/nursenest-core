import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { buildCountdownCopy } from "@/lib/learner/exam-timeline";
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
    try {
      const perf = await loadUnifiedTopicPerformance(userId, entitlement, 4);
      const names = perf.weakTopics.map((w) => w.topic).filter(Boolean);
      weakShort = shortWeakAreas(names);
      firstTopic = perf.weakTopics[0]?.topic ?? perf.recommendedQuizTopic ?? null;
    } catch {
      weakShort = null;
    }

    const nextActionHref = firstTopic
      ? `/app/questions?topic=${encodeURIComponent(firstTopic)}`
      : "/app/lessons";
    const nextActionShort = firstTopic ? `Quiz: ${firstTopic}` : "Open lessons";

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
