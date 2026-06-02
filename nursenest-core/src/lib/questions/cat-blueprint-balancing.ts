export type CatBlueprintDimension =
  | "exam"
  | "tier"
  | "topic"
  | "bodySystem"
  | "cognitiveLevel"
  | "difficulty";

export type CatBlueprintBalancingInput = {
  questionId?: string | null;
  baseWeight: number;
  exam?: string | null;
  tier?: string | null;
  topic?: string | null;
  bodySystem?: string | null;
  cognitiveLevel?: string | null;
  difficulty?: number | null;
  sessionSeenTopics?: string[] | null;
  sessionSeenBodySystems?: string[] | null;
  sessionSeenCognitiveLevels?: string[] | null;
  sessionSeenQuestionIds?: string[] | null;
  targetBodySystemDistribution?: Record<string, number> | null;
  currentBodySystemDistribution?: Record<string, number> | null;
  targetCognitiveDistribution?: Record<string, number> | null;
  currentCognitiveDistribution?: Record<string, number> | null;
};

export type CatBlueprintBalancingResult = {
  adjustedWeight: number;
  diversityBoost: number;
  repetitionPenalty: number;
  blueprintPenalty: number;
  recommended: boolean;
  reasons: string[];
};

function normalize(value: string | null | undefined): string {
  return String(value ?? "").trim().toLowerCase();
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Number(value.toFixed(2))));
}

function countSeen(values: string[] | null | undefined, candidate: string): number {
  if (!candidate) return 0;
  return (values ?? []).map(normalize).filter((value) => value === candidate).length;
}

function distributionDelta(
  key: string,
  target: Record<string, number> | null | undefined,
  current: Record<string, number> | null | undefined,
): number {
  if (!key || !target || !current) return 0;
  const targetValue = target[key] ?? target[normalize(key)] ?? 0;
  const currentValue = current[key] ?? current[normalize(key)] ?? 0;
  return targetValue - currentValue;
}

export function balanceCatBlueprintDiversity(
  input: CatBlueprintBalancingInput,
): CatBlueprintBalancingResult {
  const reasons: string[] = [];
  const topic = normalize(input.topic);
  const bodySystem = normalize(input.bodySystem);
  const cognitiveLevel = normalize(input.cognitiveLevel);

  let diversityBoost = 0;
  let repetitionPenalty = 0;
  let blueprintPenalty = 0;

  if (input.sessionSeenQuestionIds?.includes(String(input.questionId ?? ""))) {
    repetitionPenalty += 0.75;
    reasons.push("Question already seen in session.");
  }

  const topicRepeats = countSeen(input.sessionSeenTopics, topic);
  if (topicRepeats >= 2) {
    repetitionPenalty += 0.16;
    reasons.push("Topic is already heavily represented in this CAT session.");
  } else if (topic && topicRepeats === 0) {
    diversityBoost += 0.06;
    reasons.push("Adds topic diversity.");
  }

  const bodyRepeats = countSeen(input.sessionSeenBodySystems, bodySystem);
  if (bodyRepeats >= 3) {
    repetitionPenalty += 0.18;
    reasons.push("Body system is over-represented in this session.");
  } else if (bodySystem && bodyRepeats === 0) {
    diversityBoost += 0.07;
    reasons.push("Adds body-system diversity.");
  }

  const cognitiveRepeats = countSeen(input.sessionSeenCognitiveLevels, cognitiveLevel);
  if (cognitiveRepeats >= 4) {
    repetitionPenalty += 0.12;
    reasons.push("Cognitive level is over-represented in this session.");
  }

  const bodyDelta = distributionDelta(
    bodySystem,
    input.targetBodySystemDistribution,
    input.currentBodySystemDistribution,
  );
  if (bodyDelta > 0.08) {
    diversityBoost += Math.min(0.16, bodyDelta);
    reasons.push("Helps restore target body-system blueprint balance.");
  } else if (bodyDelta < -0.08) {
    blueprintPenalty += Math.min(0.18, Math.abs(bodyDelta));
    reasons.push("Would worsen body-system blueprint imbalance.");
  }

  const cognitiveDelta = distributionDelta(
    cognitiveLevel,
    input.targetCognitiveDistribution,
    input.currentCognitiveDistribution,
  );
  if (cognitiveDelta > 0.08) {
    diversityBoost += Math.min(0.12, cognitiveDelta);
    reasons.push("Helps restore target cognitive-level balance.");
  } else if (cognitiveDelta < -0.08) {
    blueprintPenalty += Math.min(0.14, Math.abs(cognitiveDelta));
    reasons.push("Would worsen cognitive-level imbalance.");
  }

  const difficulty = input.difficulty ?? null;
  if (typeof difficulty === "number") {
    if (difficulty < 0.15 || difficulty > 0.95) {
      blueprintPenalty += 0.07;
      reasons.push("Extreme difficulty should be used sparingly in adaptive flow.");
    } else if (difficulty >= 0.35 && difficulty <= 0.8) {
      diversityBoost += 0.03;
      reasons.push("Difficulty is within stable adaptive range.");
    }
  }

  diversityBoost = clamp(diversityBoost, 0, 0.3);
  repetitionPenalty = clamp(repetitionPenalty, 0, 0.9);
  blueprintPenalty = clamp(blueprintPenalty, 0, 0.35);

  const adjustedWeight = clamp(
    input.baseWeight * (1 + diversityBoost - repetitionPenalty - blueprintPenalty),
    0,
    1.35,
  );

  return {
    adjustedWeight,
    diversityBoost,
    repetitionPenalty,
    blueprintPenalty,
    recommended: adjustedWeight >= 0.45 && repetitionPenalty < 0.7,
    reasons,
  };
}
