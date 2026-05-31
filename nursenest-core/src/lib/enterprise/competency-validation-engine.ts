export type CompetencyValidationEvidence = Readonly<{
  knowledge: number;
  application: number;
  simulationPerformance: number;
  clinicalJudgment: number;
  repeatedSuccessCount: number;
}>;

export type CompetencyValidationResult = Readonly<{
  validated: boolean;
  score: number;
  missingRequirements: readonly string[];
}>;

export function validateEnterpriseCompetency(evidence: CompetencyValidationEvidence): CompetencyValidationResult {
  const missingRequirements = [
    evidence.knowledge < 80 ? "Knowledge score must be at least 80%." : null,
    evidence.application < 80 ? "Application score must be at least 80%." : null,
    evidence.simulationPerformance < 80 ? "Simulation performance must be at least 80%." : null,
    evidence.clinicalJudgment < 80 ? "Clinical judgment must be at least 80%." : null,
    evidence.repeatedSuccessCount < 3 ? "Requires repeated success across at least 3 attempts." : null,
  ].filter((item): item is string => Boolean(item));
  const score = Math.round(
    evidence.knowledge * 0.2 +
      evidence.application * 0.25 +
      evidence.simulationPerformance * 0.25 +
      evidence.clinicalJudgment * 0.2 +
      Math.min(evidence.repeatedSuccessCount / 3, 1) * 10,
  );

  return {
    validated: missingRequirements.length === 0,
    score,
    missingRequirements,
  };
}
