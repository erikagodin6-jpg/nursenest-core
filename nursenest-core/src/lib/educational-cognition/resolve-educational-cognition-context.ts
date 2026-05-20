import type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";

export function resolveEducationalCognitionContext(
  pathwayId: string | null,
  input: { userId: string; weakTopics?: readonly string[] },
): EducationalCognitionContext {
  return {
    pathwayId,
    learnerState: {
      userId: input.userId,
      weakTopics: [...(input.weakTopics ?? [])],
      remediationFatigueScore: 0,
    },
    measurement: {
      learnerStateReason: input.weakTopics?.length ? "weak_topic_signal" : "baseline",
    },
  };
}
