export interface CompetencyMetric {
  domain:
    | "stewardship"
    | "organism-coverage"
    | "renal-dosing"
    | "documentation"
    | "escalation-recognition";
  score: number;
  attempts: number;
  lastUpdatedIso: string;
}

export interface CompetencySnapshot {
  learnerId: string;
  metrics: CompetencyMetric[];
  overallScore: number;
  progressionTier:
    | "novice"
    | "advanced-beginner"
    | "competent"
    | "proficient";
}

export function calculateOverallCompetency(
  metrics: CompetencyMetric[]
): number {
  if (metrics.length === 0) {
    return 0;
  }

  const total = metrics.reduce(
    (sum, metric) => sum + metric.score,
    0
  );

  return Math.round(total / metrics.length);
}

export function determineProgressionTier(
  score: number
): CompetencySnapshot["progressionTier"] {
  if (score >= 90) {
    return "proficient";
  }

  if (score >= 75) {
    return "competent";
  }

  if (score >= 55) {
    return "advanced-beginner";
  }

  return "novice";
}
