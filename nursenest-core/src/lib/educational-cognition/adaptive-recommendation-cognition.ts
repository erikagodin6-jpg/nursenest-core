import {
  buildAdaptiveRecommendations,
  type AdaptiveLearnerRecommendations,
} from "@/lib/learner/adaptive-recommendations";

type AdaptiveRecommendationArgs = Parameters<typeof buildAdaptiveRecommendations>[0] & {
  userId?: string;
  entitlement?: unknown;
};

export async function buildGovernedAdaptiveRecommendations(
  args: AdaptiveRecommendationArgs,
): Promise<AdaptiveLearnerRecommendations> {
  return buildAdaptiveRecommendations(args);
}
