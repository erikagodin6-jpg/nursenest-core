/**
 * Phase 13 — strategic governance & privacy **policy identifiers** (no PII; no legal advice text).
 *
 * Implementations map these ids to retention, DPA, and opt-in flows.
 *
 * See reports/phase-13-strategic-intelligence.md
 */

export const AnonymizationStrategyId = {
  kAnonymityCohort: "anon.k_anonymity_cohort",
  differentialPrivacyLite: "anon.dp_lite",
  aggregateOnlyPublicBenchmark: "anon.aggregate_public_benchmark",
} as const;

export type AnonymizationStrategyId =
  (typeof AnonymizationStrategyId)[keyof typeof AnonymizationStrategyId];

export const ResearchParticipationClass = {
  none: "research.none",
  optInAggregatesOnly: "research.opt_in_aggregates_only",
  optInLimitedIdentifiers: "research.opt_in_limited_identifiers",
} as const;

export type ResearchParticipationClass =
  (typeof ResearchParticipationClass)[keyof typeof ResearchParticipationClass];

export type StrategicAuditEventKind =
  | "strategic_analytics.export_started"
  | "strategic_analytics.export_completed"
  | "strategic_analytics.cross_scope_denied"
  | "strategic_analytics.benchmark_tile_published";
