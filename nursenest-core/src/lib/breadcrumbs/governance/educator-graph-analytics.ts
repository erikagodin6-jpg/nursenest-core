/**
 * Educator-safe graph analytics — aggregated metrics only, no raw cognition envelopes.
 */

export type EducatorGraphMetricSummary = {
  glossaryTraversalCount: number;
  remediationAbandonmentRate: number;
  reasoningChainAvgDepth: number;
  focusAreaProgressionVelocity: number;
  ontologyConflictRate: number;
  graphNextStepCompletionRate: number;
  pathwayContinuationRecoveryRate: number;
  semanticRouteEngagementScore: number;
  continuityInterruptionRate: number;
};

export type EducatorGraphAnalyticsInput = {
  glossaryTraversals?: number;
  remediationStarts?: number;
  remediationAbandons?: number;
  reasoningChainDepths?: readonly number[];
  focusAreaViews?: number;
  focusAreaCompletions?: number;
  ontologyConflicts?: number;
  graphNextSteps?: number;
  graphNextStepCompletions?: number;
  pathwayContinuations?: number;
  pathwayRecoveries?: number;
  semanticRouteViews?: number;
  continuityInterruptions?: number;
};

export function aggregateEducatorGraphMetrics(
  input: EducatorGraphAnalyticsInput,
): EducatorGraphMetricSummary {
  const remediationStarts = input.remediationStarts ?? 0;
  const remediationAbandons = input.remediationAbandons ?? 0;
  const depths = input.reasoningChainDepths ?? [];
  const focusViews = input.focusAreaViews ?? 0;
  const focusCompletions = input.focusAreaCompletions ?? 0;
  const nextSteps = input.graphNextSteps ?? 0;
  const nextCompletions = input.graphNextStepCompletions ?? 0;
  const continuations = input.pathwayContinuations ?? 0;
  const recoveries = input.pathwayRecoveries ?? 0;
  const routeViews = input.semanticRouteViews ?? 0;
  const interruptions = input.continuityInterruptions ?? 0;
  const conflicts = input.ontologyConflicts ?? 0;

  return {
    glossaryTraversalCount: input.glossaryTraversals ?? 0,
    remediationAbandonmentRate:
      remediationStarts > 0 ? Math.round((remediationAbandons / remediationStarts) * 100) / 100 : 0,
    reasoningChainAvgDepth:
      depths.length > 0 ? Math.round((depths.reduce((a, b) => a + b, 0) / depths.length) * 10) / 10 : 0,
    focusAreaProgressionVelocity:
      focusViews > 0 ? Math.round((focusCompletions / focusViews) * 100) / 100 : 0,
    ontologyConflictRate: routeViews > 0 ? Math.round((conflicts / routeViews) * 100) / 100 : 0,
    graphNextStepCompletionRate: nextSteps > 0 ? Math.round((nextCompletions / nextSteps) * 100) / 100 : 0,
    pathwayContinuationRecoveryRate:
      continuations > 0 ? Math.round((recoveries / continuations) * 100) / 100 : 0,
    semanticRouteEngagementScore: Math.min(100, routeViews),
    continuityInterruptionRate:
      routeViews > 0 ? Math.round((interruptions / routeViews) * 100) / 100 : 0,
  };
}
