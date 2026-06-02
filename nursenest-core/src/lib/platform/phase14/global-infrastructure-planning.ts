/**
 * Phase 14 — multi-region / global infrastructure **planning dimensions** (documentation drivers; no infra changes).
 *
 * See reports/phase-14-governance-autonomous-network.md
 */

export const GlobalInfraConcern = {
  cdnRegionalLatency: "global.cdn_regional_latency",
  i18nContentDelivery: "global.i18n_content_delivery",
  regionalCacheStrategy: "global.regional_cache_strategy",
  multiRegionDatabase: "global.multi_region_database",
  failoverDisasterRecovery: "global.failover_dr",
  institutionalDataResidency: "global.institutional_data_residency",
  learnerPerformanceVariance: "global.learner_performance_variance",
} as const;

export type GlobalInfraConcern = (typeof GlobalInfraConcern)[keyof typeof GlobalInfraConcern];
