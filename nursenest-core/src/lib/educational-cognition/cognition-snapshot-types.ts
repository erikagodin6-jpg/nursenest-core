import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

/** Current persisted cognition envelope schema version. */
export const COGNITION_SNAPSHOT_VERSION = 2 as const;

export type CognitionSnapshotVersion = typeof COGNITION_SNAPSHOT_VERSION | 1;

/** Reliability tier — influences adaptive weighting and tutoring confidence. */
export type CognitionReliabilityTier = "ephemeral" | "inferred" | "persisted" | "validated";

export type PersistedGraphContinuity = {
  currentTopicSlug: string | null;
  remediationPathwayIds: string[];
  glossaryContinuityKeys: string[];
  interpretationContinuityKeys: string[];
  lastGraphStepId: string | null;
  lastGraphHref: string | null;
  /** 0–1 reasoning momentum at last traversal. */
  reasoningMomentum?: number;
  interruptedTraversalTopicSlug?: string | null;
  remediationReturnHref?: string | null;
  dashboardContinuationHref?: string | null;
  adaptiveAnchorHref?: string | null;
  graphCheckpointAt?: string | null;
  graphVersion?: string;
};

export type CognitionHydrationState = "full" | "partial" | "degraded" | "fresh";

export type CognitionHydrationProvenance = {
  mode: CognitionHydrationState;
  fromDatabase: boolean;
  fingerprintMatch: boolean;
  warnings: string[];
  hydratedAt: string;
};

export type CognitionContinuityLineage = {
  graphVersion: string | null;
  lastCheckpointAt: string | null;
  remediationReturnHref: string | null;
  adaptiveAnchorHref: string | null;
};

export type CognitionEnvelopeGovernanceMetadata = {
  cognitionSchemaVersion: number;
  envelopeVersion: number;
  ontologyRevision: string;
  graphVersion: string;
  migrationPath: string | null;
  hydrationState: CognitionHydrationState;
  reliabilityTier: CognitionReliabilityTier;
};

export type CognitionIntegrityTier = "valid" | "repaired" | "degraded" | "corrupted";

export type CognitionEnvelopeRepairReport = {
  repaired: boolean;
  repairOperations: string[];
  unrecoverableReferences: string[];
  integrityTier: CognitionIntegrityTier;
  repairedAt: string;
};

export type LongitudinalCognitionHistory = {
  competencyVolatilitySamples: Array<{ at: string; volatility: string; competencyId: string }>;
  timingTrajectorySamples: Array<{ at: string; riskBand: string }>;
  readinessMomentumSamples: Array<{ at: string; score: number }>;
  remediationContinuityCount: number;
  adaptiveRecommendationCount: number;
  measurementHistoryKeys: string[];
};

export type DurableLearnerCognitionEnvelope = {
  cognitionSnapshotVersion: CognitionSnapshotVersion;
  cognitionReliability: CognitionReliabilityTier;
  updatedAt: string;
  pathwayId: string | null;
  snapshot: RnLearnerStateSnapshot;
  stateFingerprint: string;
  staleAfterMs?: number;
  graphContinuity?: PersistedGraphContinuity;
  longitudinal?: LongitudinalCognitionHistory;
  telemetryCorrelationId?: string | null;
  ontologyRevision?: string;
  integrityTier?: CognitionIntegrityTier;
  integrityChecksum?: string;
  repairReport?: CognitionEnvelopeRepairReport;
  migrationPath?: string | null;
  /** Lineage envelope version (monotonic with cognitionSchemaVersion). */
  envelopeVersion?: number;
  hydrationProvenance?: CognitionHydrationProvenance;
  continuityLineage?: CognitionContinuityLineage;
  governance?: CognitionEnvelopeGovernanceMetadata;
};
