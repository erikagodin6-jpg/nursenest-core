import { loadUnifiedTopicPerformance, type TopicPerformanceSnapshot } from "@/lib/learner/topic-performance";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import type { LearnerCoachingContextPayload } from "@/lib/learner/rn-coaching-intelligence/coaching-orchestration";

export async function loadLearnerCoachingContext(
  userId: string,
  entitlement: AccessScope,
): Promise<LearnerCoachingContextPayload> {
  const snap: TopicPerformanceSnapshot = await loadUnifiedTopicPerformance(userId, entitlement, 12);
  return {
    topicTrends: snap.trends,
    weakTopics: snap.weakTopics,
    strongTopics: snap.strongTopics,
    recentSessionCount: snap.weakTopics.reduce((n, w) => n + (w.attempted ?? 0), 0),
    source: snap.source,
  };
}
