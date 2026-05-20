import type { MeasurementCategory } from "@/lib/measurements/measurement-domain";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import {
  defaultMeasurementCatalogForState,
  type MeasurementCatalogItem,
} from "@/lib/educational-cognition/measurement-catalog-defaults";

export type MeasurementReliabilityTier = "default" | "inferred" | "device" | "clinician-validated";

export type MeasurementProvenance = "catalog_default" | "live_vitals_api" | "learner_state_tag";

export type ResolvedMeasurementCognitionInput = {
  catalogItems: MeasurementCatalogItem[];
  reliabilityTier: MeasurementReliabilityTier;
  provenance: MeasurementProvenance;
  confidenceScore: number;
  stale: boolean;
  observedAt: string | null;
};

export type LiveVitalsReading = {
  category: MeasurementCategory;
  kind?: string;
  valueSi: number;
  trendValuesSi?: number[];
  observedAt?: string;
  source?: "device" | "api";
};

const STALE_MS = 6 * 60 * 60 * 1000;

function confidenceFromTier(tier: MeasurementReliabilityTier): number {
  switch (tier) {
    case "clinician-validated":
      return 1;
    case "device":
      return 0.9;
    case "inferred":
      return 0.65;
    default:
      return 0.45;
  }
}

function isStale(observedAt: string | undefined): boolean {
  if (!observedAt) return false;
  return Date.now() - new Date(observedAt).getTime() > STALE_MS;
}

/**
 * Resolves measurement cognition input — catalog defaults, live vitals, or learner tags.
 */
export function resolveMeasurementCognitionInput(args: {
  learnerState: RnLearnerStateSnapshot;
  liveReadings?: LiveVitalsReading[];
  clinicianValidated?: boolean;
}): ResolvedMeasurementCognitionInput {
  const live = args.liveReadings?.filter((r) => Number.isFinite(r.valueSi)) ?? [];
  if (live.length > 0) {
    const newest = live.find((r) => r.observedAt) ?? live[0];
    const stale = isStale(newest?.observedAt);
    const tier: MeasurementReliabilityTier = args.clinicianValidated
      ? "clinician-validated"
      : newest?.source === "device"
        ? "device"
        : "inferred";
    return {
      catalogItems: live.map((r) => ({
        category: r.category,
        kind: r.kind,
        valueSi: r.valueSi,
        trendValuesSi: r.trendValuesSi,
      })),
      reliabilityTier: tier,
      provenance: "live_vitals_api",
      confidenceScore: confidenceFromTier(tier) * (stale ? 0.7 : 1),
      stale,
      observedAt: newest?.observedAt ?? new Date().toISOString(),
    };
  }

  const catalog = defaultMeasurementCatalogForState(args.learnerState);
  return {
    catalogItems: catalog,
    reliabilityTier: catalog.length > 0 ? "inferred" : "default",
    provenance: catalog.length > 0 ? "learner_state_tag" : "catalog_default",
    confidenceScore: confidenceFromTier(catalog.length > 0 ? "inferred" : "default"),
    stale: false,
    observedAt: null,
  };
}
