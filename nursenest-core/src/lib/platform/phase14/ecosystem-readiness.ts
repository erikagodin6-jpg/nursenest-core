/**
 * Phase 14 — strategic **ecosystem readiness** risk categories (portfolio planning; no scoring engine).
 *
 * See reports/phase-14-governance-autonomous-network.md
 */

export const EcosystemReadinessRisk = {
  institutionScalingBlocker: "eco_risk.institution_scaling",
  partnershipReadinessGap: "eco_risk.partnership_readiness",
  governanceMaturityGap: "eco_risk.governance_maturity",
  platformStewardshipConcentration: "eco_risk.platform_stewardship",
  orgToolingDirection: "eco_risk.org_tooling_direction",
} as const;

export type EcosystemReadinessRisk = (typeof EcosystemReadinessRisk)[keyof typeof EcosystemReadinessRisk];
