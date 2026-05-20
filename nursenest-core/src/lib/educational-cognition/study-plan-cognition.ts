import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import {
  buildPersonalizedWeakAreaStudyPlan,
  type PersonalizedWeakAreaStudyPlanPublic,
} from "@/lib/learner/personalized-weak-area-study-plan";
import type { TopicPerformanceSnapshot } from "@/lib/learner/topic-performance";

export async function buildCognitionIntegratedStudyPlan(args: {
  userId: string;
  entitlement: AccessScope;
  learnerPath: string | null;
  topicPerformance: TopicPerformanceSnapshot;
  readinessResult?: unknown;
}): Promise<{ publicPlan: PersonalizedWeakAreaStudyPlanPublic } | null> {
  const publicPlan = await buildPersonalizedWeakAreaStudyPlan({
    userId: args.userId,
    entitlement: args.entitlement,
    learnerPath: args.learnerPath,
    topicPerformance: args.topicPerformance,
  });
  return publicPlan ? { publicPlan } : null;
}
