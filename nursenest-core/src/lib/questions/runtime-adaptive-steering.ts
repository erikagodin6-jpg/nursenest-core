export type RuntimeAdaptiveSteeringInput = {
  currentTheta?: number | null;
  recentDifficultyAverage?: number | null;
  recentIncorrectStreak?: number | null;
  recentCorrectStreak?: number | null;
  fatigueRisk?: number | null;
  blueprintDeficitDomains?: string[] | null;
  exposurePressure?: number | null;
  candidateDifficulty?: number | null;
  candidateBodySystem?: string | null;
};

export type RuntimeAdaptiveSteeringResult = {
  adjustedDifficultyTarget: number;
  shouldThrottleExposure: boolean;
  shouldReduceDifficulty: boolean;
  shouldIncreaseDifficulty: boolean;
  recommendedBlueprintDomains: string[];
  steeringConfidence: "low" | "moderate" | "high";
  recommendations: string[];
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Number(value.toFixed(2))));
}

export function calculateRuntimeAdaptiveSteering(
  input: RuntimeAdaptiveSteeringInput,
): RuntimeAdaptiveSteeringResult {
  const recommendations: string[] = [];

  const theta = input.currentTheta ?? 0;
  const fatigueRisk = clamp(input.fatigueRisk ?? 0, 0, 1);
  const exposurePressure = clamp(input.exposurePressure ?? 0, 0, 1);

  let targetDifficulty = clamp(0.5 + theta * 0.12, 0.15, 0.95);

  const incorrectStreak = input.recentIncorrectStreak ?? 0;
  const correctStreak = input.recentCorrectStreak ?? 0;

  let shouldReduceDifficulty = false;
  let shouldIncreaseDifficulty = false;

  if (incorrectStreak >= 3 || fatigueRisk >= 0.7) {
    targetDifficulty -= 0.12;
    shouldReduceDifficulty = true;
    recommendations.push("Reduce difficulty to stabilize learner confidence.");
  }

  if (correctStreak >= 4 && fatigueRisk < 0.4) {
    targetDifficulty += 0.08;
    shouldIncreaseDifficulty = true;
    recommendations.push("Increase difficulty to maintain adaptive precision.");
  }

  if (exposurePressure >= 0.65) {
    recommendations.push("Throttle high-exposure items in current session.");
  }

  if ((input.blueprintDeficitDomains ?? []).length > 0) {
    recommendations.push("Prioritize underrepresented blueprint domains.");
  }

  if (
    typeof input.candidateDifficulty === "number" &&
    Math.abs(input.candidateDifficulty - targetDifficulty) > 0.35
  ) {
    recommendations.push("Candidate difficulty is outside stable adaptive range.");
  }

  targetDifficulty = clamp(targetDifficulty, 0.1, 0.98);

  return {
    adjustedDifficultyTarget: targetDifficulty,
    shouldThrottleExposure: exposurePressure >= 0.65,
    shouldReduceDifficulty,
    shouldIncreaseDifficulty,
    recommendedBlueprintDomains: input.blueprintDeficitDomains ?? [],
    steeringConfidence:
      fatigueRisk < 0.35 && incorrectStreak < 3 ? "high" : fatigueRisk < 0.7 ? "moderate" : "low",
    recommendations,
  };
}
