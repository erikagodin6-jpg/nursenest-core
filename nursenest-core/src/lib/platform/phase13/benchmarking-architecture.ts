/**
 * Phase 13 — benchmarking **aggregation contracts** (no cross-institution row joins).
 *
 * All cohort/institution metrics must be computed inside a single `institutionKey` boundary
 * with k-anonymity / minimum cell sizes enforced upstream of publication.
 *
 * See reports/phase-13-strategic-intelligence.md
 */

export const BenchmarkingDomain = {
  pathwayReadiness: "bench.pathway_readiness",
  cohortPerformance: "bench.cohort_performance",
  institutionalOutcome: "bench.institutional_outcome",
  weakTopicPopulationCluster: "bench.weak_topic_cluster",
  blueprintDomainPerformance: "bench.blueprint_domain",
  progressionVelocity: "bench.progression_velocity",
  remediationEffectiveness: "bench.remediation_effectiveness",
} as const;

export type BenchmarkingDomain = (typeof BenchmarkingDomain)[keyof typeof BenchmarkingDomain];

/** Aggregate bucket only — never attach stable learner identifiers. */
export type BenchmarkAggregateBucket = {
  domain: BenchmarkingDomain;
  pathwayId: string;
  institutionKey: string;
  /** Minimum cohort size policy id (implementation supplies thresholds). */
  cellSizePolicyId: string;
  /** Opaque period key (e.g. ISO week) — no raw timestamps of individuals. */
  periodKey: string;
  /** Aggregated scalar or histogram ref — values computed server-side. */
  metricRef: string;
};
