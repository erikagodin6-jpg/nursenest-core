import type { RnCompetencyId } from "@/lib/educational-graph/rn-competency-ontology";
import type { ClinicalJudgmentPattern } from "@/lib/learner/rn-coaching-intelligence/coaching-types";

export type PacingProfile = "fast" | "balanced" | "deliberate" | "volatile";
export type HesitationProfile = "low" | "moderate" | "high";
export type CompetencyVolatility = "stable" | "improving" | "declining" | "plateau" | "volatile";

export type RnCompetencyMasteryState = {
  competencyId: RnCompetencyId | string;
  masteryScore: number;
  volatility: CompetencyVolatility;
  sessionEvidenceCount: number;
  persistentWeak: boolean;
  remediationResponsive: boolean | null;
  lastUpdatedAt: string;
};

export type TimingCognitionRef = {
  riskBand: "low" | "moderate" | "elevated" | "high";
  fatigueTrajectory: boolean;
  hesitationClusterCount: number;
  unstablePatientRecognition: boolean;
};

export type RnLearnerStateSnapshot = {
  version: 1;
  updatedAt: string;
  pathwayId: string | null;
  /** Last N session readiness scores (0–100). */
  readinessTrajectory: number[];
  pacingProfile: PacingProfile;
  hesitationProfile: HesitationProfile;
  /** Recurring clinical reasoning patterns (bounded). */
  reasoningPatterns: ClinicalJudgmentPattern[];
  /** Measurement / interpretation weakness tags (e.g. potassium_trend, abg). */
  measurementWeaknesses: string[];
  /** Compatibility alias for focus-area surfaces that predate measurementWeaknesses. */
  focusAreaSlugs?: string[];
  competencyStates: RnCompetencyMasteryState[];
  /** 0–1 — high means rotate modalities / reduce CTAs. */
  remediationFatigueScore: number;
  /** 0–1 — confidence self-rating instability across recent sessions. */
  confidenceInstability: number;
  /** 0–1 — readiness score variance across trajectory. */
  readinessMomentum: number;
  /** Timing V2 cognition signals (non-punitive, governance-safe). */
  timingCognition?: TimingCognitionRef;
};

export const EMPTY_LEARNER_STATE = (pathwayId: string | null = null): RnLearnerStateSnapshot => ({
  version: 1,
  updatedAt: new Date().toISOString(),
  pathwayId,
  readinessTrajectory: [],
  pacingProfile: "balanced",
  hesitationProfile: "moderate",
  reasoningPatterns: [],
  measurementWeaknesses: [],
  competencyStates: [],
  remediationFatigueScore: 0,
  confidenceInstability: 0,
  readinessMomentum: 0,
});
