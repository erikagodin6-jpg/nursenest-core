import type { PersonalLearningTwin } from "@/lib/moat/learner-model-engine";

export type ReadinessForecast = Readonly<{
  currentReadiness: number;
  projected30DayReadiness: number;
  projected60DayReadiness: number;
  projected90DayReadiness: number;
  probabilityOfSuccess: number;
  weakAreas: readonly string[];
  estimatedStudyHours: number;
  interventionRequired: boolean;
  interventionPlan: readonly string[];
}>;

function clamp(value: number, min = 0, max = 1): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function projected(current: number, learningVelocity: number, days: number): number {
  return clamp(current + learningVelocity * (days / 30));
}

export function buildReadinessForecast(args: {
  twin: PersonalLearningTwin;
  currentReadiness: number;
  weeklyStudyHours: number;
}): ReadinessForecast {
  const learningVelocity =
    args.twin.learningSpeed === "fast"
      ? 0.08
      : args.twin.learningSpeed === "steady"
        ? 0.05
        : args.twin.learningSpeed === "slow"
          ? 0.025
          : 0.015;
  const consistencyModifier = clamp(args.weeklyStudyHours / 12, 0.4, 1.3);
  const adjustedVelocity = learningVelocity * consistencyModifier;
  const currentReadiness = clamp(args.currentReadiness);
  const projected30DayReadiness = projected(currentReadiness, adjustedVelocity, 30);
  const projected60DayReadiness = projected(currentReadiness, adjustedVelocity, 60);
  const projected90DayReadiness = projected(currentReadiness, adjustedVelocity, 90);
  const riskPenalty =
    args.twin.forgottenAreas.length * 0.02 +
    args.twin.misunderstoodAreas.length * 0.03 +
    (args.twin.overallClinicalJudgment < 0.65 ? 0.08 : 0);
  const probabilityOfSuccess = clamp(projected30DayReadiness * 0.65 + args.twin.overallKnowledge * 0.35 - riskPenalty);
  const weakAreaCount = Math.max(args.twin.weakAreas.length, 1);
  const estimatedStudyHours = Math.ceil((1 - currentReadiness) * 60 + weakAreaCount * 3);
  const interventionRequired =
    probabilityOfSuccess < 0.7 ||
    args.twin.overallRetention < 0.65 ||
    args.twin.overallClinicalJudgment < 0.65 ||
    args.twin.misunderstoodAreas.length > 0;

  return {
    currentReadiness,
    projected30DayReadiness,
    projected60DayReadiness,
    projected90DayReadiness,
    probabilityOfSuccess,
    weakAreas: args.twin.weakAreas,
    estimatedStudyHours,
    interventionRequired,
    interventionPlan: [
      args.twin.misunderstoodAreas.length > 0 ? "Repair confidence/accuracy mismatches first." : null,
      args.twin.forgottenAreas.length > 0 ? "Schedule spaced retrieval for decaying topics." : null,
      args.twin.overallClinicalJudgment < 0.65 ? "Add simulation and clinical judgment practice before more recall." : null,
      args.twin.weakAreas.length > 0 ? "Start the next study block with the top weak area." : null,
    ].filter((item): item is string => Boolean(item)),
  };
}
