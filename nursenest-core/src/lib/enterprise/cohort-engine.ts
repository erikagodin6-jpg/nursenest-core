import { HIDDEN_ENTERPRISE_VISIBILITY } from "@/lib/enterprise/enterprise-visibility";

export type EnterpriseCohortKind =
  | "rn_class"
  | "rpn_intake"
  | "fnp_cohort"
  | "new_graduate_program"
  | "critical_care_orientation";

export type EnterpriseCohort = Readonly<{
  id: string;
  name: string;
  kind: EnterpriseCohortKind;
  institutionId: string;
  programId: string;
  learnerIds: readonly string[];
  facultyIds: readonly string[];
  benchmarkGroup: string | null;
  visibility: typeof HIDDEN_ENTERPRISE_VISIBILITY;
}>;

export type CohortProgressSignal = Readonly<{
  learnerId: string;
  completionPct: number;
  readinessScore: number;
  simulationCompletionPct: number;
  clinicalSkillsCompletionPct: number;
}>;

export type CohortProgressReport = Readonly<{
  cohortId: string;
  enrollmentCount: number;
  averageCompletionPct: number;
  averageReadinessScore: number;
  averageSimulationCompletionPct: number;
  averageClinicalSkillsCompletionPct: number;
  strugglingLearnerIds: readonly string[];
}>;

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function buildCohortProgressReport(cohort: EnterpriseCohort, signals: readonly CohortProgressSignal[]): CohortProgressReport {
  return {
    cohortId: cohort.id,
    enrollmentCount: cohort.learnerIds.length,
    averageCompletionPct: average(signals.map((signal) => signal.completionPct)),
    averageReadinessScore: average(signals.map((signal) => signal.readinessScore)),
    averageSimulationCompletionPct: average(signals.map((signal) => signal.simulationCompletionPct)),
    averageClinicalSkillsCompletionPct: average(signals.map((signal) => signal.clinicalSkillsCompletionPct)),
    strugglingLearnerIds: signals
      .filter((signal) => signal.readinessScore < 70 || signal.completionPct < 50)
      .map((signal) => signal.learnerId),
  };
}
