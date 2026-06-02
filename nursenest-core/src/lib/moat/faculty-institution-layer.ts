export type InstitutionRole = "school" | "hospital" | "residency_program" | "preceptor" | "faculty" | "clinical_educator";

export type CohortCompetencySignal = Readonly<{
  learnerId: string;
  competencyId: string;
  readiness: number;
  mastery: number;
  risk: number;
}>;

export type InstitutionCohortView = Readonly<{
  cohortId: string;
  role: InstitutionRole;
  learnerCount: number;
  averageReadiness: number;
  averageMastery: number;
  riskLearnerIds: readonly string[];
  weakCompetencies: readonly string[];
  masteryCompetencies: readonly string[];
  hiddenUntilEnabled: true;
}>;

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function buildInstitutionCohortView(args: {
  cohortId: string;
  role: InstitutionRole;
  signals: readonly CohortCompetencySignal[];
}): InstitutionCohortView {
  const learnerIds = Array.from(new Set(args.signals.map((signal) => signal.learnerId)));
  const byCompetency = new Map<string, CohortCompetencySignal[]>();
  for (const signal of args.signals) {
    byCompetency.set(signal.competencyId, [...(byCompetency.get(signal.competencyId) ?? []), signal]);
  }

  return {
    cohortId: args.cohortId,
    role: args.role,
    learnerCount: learnerIds.length,
    averageReadiness: average(args.signals.map((signal) => signal.readiness)),
    averageMastery: average(args.signals.map((signal) => signal.mastery)),
    riskLearnerIds: Array.from(new Set(args.signals.filter((signal) => signal.risk >= 0.65).map((signal) => signal.learnerId))),
    weakCompetencies: Array.from(byCompetency.entries())
      .filter(([, values]) => {
        return average(values.map((signal) => signal.mastery)) < 0.75 || values.some((signal) => signal.risk >= 0.65);
      })
      .map(([competencyId]) => competencyId),
    masteryCompetencies: Array.from(byCompetency.entries())
      .filter(([, values]) => average(values.map((signal) => signal.mastery)) >= 0.85)
      .map(([competencyId]) => competencyId),
    hiddenUntilEnabled: true,
  };
}
