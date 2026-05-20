import type { MeasurementCategory } from "@/lib/measurements/measurement-domain";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import {
  resolveMeasurementCognitionInput,
  type LiveVitalsReading,
  type MeasurementReliabilityTier,
  type ResolvedMeasurementCognitionInput,
} from "@/lib/educational-cognition/resolve-measurement-cognition-input";

export type GovernedMeasurementSource = ResolvedMeasurementCognitionInput & {
  sourceLabel: string;
  governanceWarnings: string[];
};

const BLOCKED_LIVE_CATEGORIES = new Set<MeasurementCategory>([]);

export function governMeasurementCognitionInput(args: {
  learnerState: RnLearnerStateSnapshot;
  liveReadings?: LiveVitalsReading[];
  clinicianValidated?: boolean;
}): GovernedMeasurementSource {
  const warnings: string[] = [];
  const filteredLive = args.liveReadings?.filter((r) => {
    if (!Number.isFinite(r.valueSi)) {
      warnings.push("dropped_non_finite_reading");
      return false;
    }
    if (BLOCKED_LIVE_CATEGORIES.has(r.category)) {
      warnings.push(`blocked_category:${r.category}`);
      return false;
    }
    return true;
  });

  const resolved = resolveMeasurementCognitionInput({
    ...args,
    liveReadings: filteredLive,
  });

  if (resolved.stale) warnings.push("stale_measurement");
  if (resolved.reliabilityTier === "default") warnings.push("catalog_default_only");

  const tierRank: Record<MeasurementReliabilityTier, number> = {
    default: 0,
    inferred: 1,
    device: 2,
    "clinician-validated": 3,
  };
  const minTier: MeasurementReliabilityTier =
    tierRank[resolved.reliabilityTier] >= tierRank.device ? resolved.reliabilityTier : "inferred";

  return {
    ...resolved,
    reliabilityTier: minTier,
    sourceLabel: resolved.provenance,
    governanceWarnings: warnings,
  };
}
