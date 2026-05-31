import type { PersonalLearningTwin } from "@/lib/moat/learner-model-engine";
import type { RemediationRecommendation } from "@/lib/moat/intelligent-remediation-engine";
import type { ReadinessForecast } from "@/lib/moat/readiness-forecast-engine";

export type PersonalStudyCoachPlan = Readonly<{
  summary: string;
  weaknessExplanation: string;
  studyPlan: readonly string[];
  nextActivities: readonly string[];
  mistakeExplanationPrompts: readonly string[];
  growthMessage: string;
  encouragement: string;
}>;

export function buildPersonalStudyCoachPlan(args: {
  twin: PersonalLearningTwin;
  remediation: readonly RemediationRecommendation[];
  forecast: ReadinessForecast;
}): PersonalStudyCoachPlan {
  const topWeakArea = args.twin.weakAreas[0] ?? args.twin.nextBestTopics[0] ?? "your next priority";
  const readinessPct = Math.round(args.forecast.currentReadiness * 100);
  const projectedPct = Math.round(args.forecast.projected30DayReadiness * 100);

  return {
    summary: `Current readiness is ${readinessPct}%, with a 30-day projection of ${projectedPct}% if study consistency holds.`,
    weaknessExplanation:
      args.twin.misunderstoodAreas.length > 0
        ? `${args.twin.misunderstoodAreas[0]} looks like a misunderstanding, not just a memory gap.`
        : `${topWeakArea} is the best next place to study because it has the highest priority signal.`,
    studyPlan: args.remediation.map((item) => `Study ${item.topic}: ${item.activitySequence.join(" -> ")}`),
    nextActivities: args.remediation.flatMap((item) => item.assetIds).slice(0, 8),
    mistakeExplanationPrompts: [
      "What cue did I miss?",
      "Why was the correct answer safer or more urgent?",
      "What would happen clinically if this issue were missed?",
      "Which activity should I complete next to repair this gap?",
    ],
    growthMessage:
      args.twin.improvementTrend === "improving"
        ? "Your trajectory is improving. Keep the study loop focused and measurable."
        : "The next gains will come from targeted remediation rather than more random practice.",
    encouragement: "Small, targeted sessions compound. Repair the highest-risk gap first, then reassess.",
  };
}
