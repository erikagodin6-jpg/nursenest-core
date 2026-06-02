import type { CohortProgressReport } from "@/lib/enterprise/cohort-engine";

export type FacultyLearnerPerformance = Readonly<{
  learnerId: string;
  progressPct: number;
  readinessScore: number;
  weakAreas: readonly string[];
  examReadiness: number;
  simulationCompletionPct: number;
  clinicalSkillsCompletionPct: number;
  medicationMathPerformance: number;
  labInterpretationPerformance: number;
  ecgPerformance: number;
}>;

export type FacultyDashboard = Readonly<{
  cohortReport: CohortProgressReport;
  learners: readonly FacultyLearnerPerformance[];
  riskLearnerIds: readonly string[];
  topWeakAreas: readonly string[];
}>;

export function buildFacultyDashboard(args: {
  cohortReport: CohortProgressReport;
  learners: readonly FacultyLearnerPerformance[];
}): FacultyDashboard {
  const weakAreaCounts = new Map<string, number>();
  for (const learner of args.learners) {
    for (const area of learner.weakAreas) weakAreaCounts.set(area, (weakAreaCounts.get(area) ?? 0) + 1);
  }

  return {
    cohortReport: args.cohortReport,
    learners: args.learners,
    riskLearnerIds: args.learners
      .filter((learner) => learner.readinessScore < 70 || learner.simulationCompletionPct < 60)
      .map((learner) => learner.learnerId),
    topWeakAreas: Array.from(weakAreaCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([area]) => area),
  };
}
