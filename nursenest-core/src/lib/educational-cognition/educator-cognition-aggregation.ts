import "server-only";

import type { DurableLearnerCognitionEnvelope } from "@/lib/educational-cognition/cognition-snapshot-types";
import { getDurableCognitionStore } from "@/lib/educational-cognition/learner-cognition-persistence";
import { getCachedPersistenceHealth } from "@/lib/educational-cognition/cognition-persistence-observability";

/** Educator-safe aggregate — no raw envelopes or learner identifiers. */
export type EducatorCognitionAggregateSummary = {
  learnerCount: number;
  avgReadinessMomentum: number;
  persistentWeakCompetencyRate: number;
  avgRemediationContinuity: number;
  avgGraphTraversalDepth: number;
  repairFrequency: number;
  persistenceDegradedRate: number;
  recommendationAdherenceProxy: number;
  continuityInterruptionRate: number;
  ontologyMigrationImpactRate: number;
  competencyProgressionVelocity: number;
};

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/**
 * Aggregates bounded cognition signals for educator dashboards (cohort-level).
 */
export function aggregateEducatorCognitionSummaries(
  envelopes: Iterable<DurableLearnerCognitionEnvelope>,
): EducatorCognitionAggregateSummary {
  let count = 0;
  let momentumSum = 0;
  let weakRateSum = 0;
  let remediationSum = 0;
  let graphDepthSum = 0;
  let repairCount = 0;
  let adherenceSum = 0;
  let interruptionCount = 0;
  let ontologyMigrationCount = 0;
  let progressionSum = 0;

  for (const e of envelopes) {
    count += 1;
    momentumSum += e.snapshot.readinessMomentum ?? 0;
    const weak = e.snapshot.competencyStates.filter((c) => c.persistentWeak).length;
    weakRateSum += e.snapshot.competencyStates.length
      ? weak / e.snapshot.competencyStates.length
      : 0;
    remediationSum += e.longitudinal?.remediationContinuityCount ?? 0;
    graphDepthSum += e.graphContinuity?.remediationPathwayIds.length ?? 0;
    if (e.repairReport?.repaired) repairCount += 1;
    adherenceSum += e.longitudinal?.adaptiveRecommendationCount ?? 0;
    if (e.graphContinuity?.interruptedTraversalTopicSlug) interruptionCount += 1;
    if (e.migrationPath && e.migrationPath !== "current") ontologyMigrationCount += 1;
    progressionSum += (e.snapshot.readinessTrajectory.at(-1) ?? 0) - (e.snapshot.readinessTrajectory[0] ?? 0);
  }

  const health = getCachedPersistenceHealth();
  const degradedRate =
    health?.mode === "degraded" || health?.mode === "memory_only" ? 1 : 0;

  if (count === 0) {
    return {
      learnerCount: 0,
      avgReadinessMomentum: 0,
      persistentWeakCompetencyRate: 0,
      avgRemediationContinuity: 0,
      avgGraphTraversalDepth: 0,
      repairFrequency: 0,
      persistenceDegradedRate: degradedRate,
      recommendationAdherenceProxy: 0,
      continuityInterruptionRate: 0,
      ontologyMigrationImpactRate: 0,
      competencyProgressionVelocity: 0,
    };
  }

  return {
    learnerCount: count,
    avgReadinessMomentum: momentumSum / count,
    persistentWeakCompetencyRate: weakRateSum / count,
    avgRemediationContinuity: remediationSum / count,
    avgGraphTraversalDepth: graphDepthSum / count,
    repairFrequency: repairCount / count,
    persistenceDegradedRate: degradedRate,
    recommendationAdherenceProxy: clamp01(adherenceSum / (count * 8)),
    continuityInterruptionRate: interruptionCount / count,
    ontologyMigrationImpactRate: ontologyMigrationCount / count,
    competencyProgressionVelocity: progressionSum / count,
  };
}

/** Process-local cohort snapshot for staff tooling (no PII). */
export function aggregateEducatorCognitionFromProcessStore(): EducatorCognitionAggregateSummary {
  return aggregateEducatorCognitionSummaries(getDurableCognitionStore().values());
}
