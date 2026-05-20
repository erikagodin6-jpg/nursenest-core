import type { CognitionReliabilityTier } from "@/lib/educational-cognition/cognition-snapshot-types";

export type CognitionReliabilityWeights = {
  adaptiveConfidence: number;
  readinessWeight: number;
  remediationPriority: number;
  tutoringConfidence: number;
  dashboardWeight: number;
};

const WEIGHTS: Record<CognitionReliabilityTier, CognitionReliabilityWeights> = {
  ephemeral: {
    adaptiveConfidence: 0.35,
    readinessWeight: 0.4,
    remediationPriority: 0.35,
    tutoringConfidence: 0.3,
    dashboardWeight: 0.45,
  },
  inferred: {
    adaptiveConfidence: 0.65,
    readinessWeight: 0.75,
    remediationPriority: 0.7,
    tutoringConfidence: 0.6,
    dashboardWeight: 0.75,
  },
  persisted: {
    adaptiveConfidence: 0.85,
    readinessWeight: 0.9,
    remediationPriority: 0.85,
    tutoringConfidence: 0.8,
    dashboardWeight: 0.9,
  },
  validated: {
    adaptiveConfidence: 1,
    readinessWeight: 1,
    remediationPriority: 1,
    tutoringConfidence: 0.95,
    dashboardWeight: 1,
  },
};

export function cognitionReliabilityWeights(tier: CognitionReliabilityTier): CognitionReliabilityWeights {
  return WEIGHTS[tier];
}

/** Caps remediation / graph CTA count by reliability — prevents overconfident sequencing on weak data. */
export function maxGraphStepsForReliability(tier: CognitionReliabilityTier, baseCap: number): number {
  const w = WEIGHTS[tier].remediationPriority;
  return Math.max(1, Math.min(baseCap, Math.round(baseCap * w)));
}

export function shouldSuppressPassOutlook(tier: CognitionReliabilityTier): boolean {
  return tier === "ephemeral" || tier === "inferred";
}

export function inferReliabilityFromPersistSource(args: {
  fromDatabase: boolean;
  fingerprintMatch: boolean;
  hasUserId: boolean;
}): CognitionReliabilityTier {
  if (!args.hasUserId) return "ephemeral";
  if (args.fromDatabase && args.fingerprintMatch) return "validated";
  if (args.fromDatabase) return "persisted";
  return "inferred";
}
