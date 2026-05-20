/**
 * Pathway-native instructional measurement semantics.
 *
 * Learner preference overrides **rendering** only — never these instructional defaults.
 */
import { isAlliedGlobalPathwayId } from "@/lib/allied/allied-global-pathway";
import type { ClinicalMeasurementSystem, MeasurementContext } from "@/lib/measurements/measurement-domain";

export type PathwayMeasurementPolicy = {
  pathwayId: string;
  instructionalSystem: ClinicalMeasurementSystem;
  measurementContext: MeasurementContext;
  /** Short label for educational hints (e.g. "NCLEX-RN"). */
  examLabel?: string;
};

/** Explicit instructional defaults — extend when adding pathways. */
const PATHWAY_POLICY: Record<string, PathwayMeasurementPolicy> = {
  "us-rn-nclex-rn": {
    pathwayId: "us-rn-nclex-rn",
    instructionalSystem: "conventional",
    measurementContext: "us",
    examLabel: "NCLEX-RN",
  },
  "us-lpn-nclex-pn": {
    pathwayId: "us-lpn-nclex-pn",
    instructionalSystem: "conventional",
    measurementContext: "us",
    examLabel: "NCLEX-PN",
  },
  "ca-rn-nclex-rn": {
    pathwayId: "ca-rn-nclex-rn",
    instructionalSystem: "si",
    measurementContext: "canada",
    examLabel: "Canadian RN (NCLEX)",
  },
  "ca-rpn-rex-pn": {
    pathwayId: "ca-rpn-rex-pn",
    instructionalSystem: "si",
    measurementContext: "canada",
    examLabel: "REx-PN",
  },
  "ca-np-cnple": {
    pathwayId: "ca-np-cnple",
    instructionalSystem: "si",
    measurementContext: "canada",
    examLabel: "CNPLE",
  },
};

const US_NCLEX_PREFIX = /^us-.*nclex/i;
const CA_NCLEX_PREFIX = /^ca-.*nclex/i;

export function getPathwayMeasurementPolicy(
  pathwayId: string | null | undefined,
  countryCode?: string | null,
): PathwayMeasurementPolicy {
  const pid = pathwayId?.trim() ?? "";
  if (pid && PATHWAY_POLICY[pid]) {
    return PATHWAY_POLICY[pid];
  }

  if (pid && isAlliedGlobalPathwayId(pid)) {
    return {
      pathwayId: pid,
      instructionalSystem: "si",
      measurementContext: "global",
      examLabel: "Allied health",
    };
  }

  const country = (countryCode ?? "").trim().toUpperCase();
  if (pid && US_NCLEX_PREFIX.test(pid)) {
    return {
      pathwayId: pid,
      instructionalSystem: "conventional",
      measurementContext: "us",
      examLabel: "NCLEX",
    };
  }
  if (pid && CA_NCLEX_PREFIX.test(pid)) {
    return {
      pathwayId: pid,
      instructionalSystem: "si",
      measurementContext: "canada",
      examLabel: "NCLEX (Canada)",
    };
  }
  if (country === "US") {
    return {
      pathwayId: pid || "unknown",
      instructionalSystem: "conventional",
      measurementContext: "us",
    };
  }
  if (country === "CA") {
    return {
      pathwayId: pid || "unknown",
      instructionalSystem: "si",
      measurementContext: "canada",
    };
  }

  return {
    pathwayId: pid || "unknown",
    instructionalSystem: country === "US" ? "conventional" : "si",
    measurementContext: country === "US" ? "us" : country === "CA" ? "canada" : "global",
  };
}

export function getPathwayInstructionalSystem(
  pathwayId: string | null | undefined,
  countryCode?: string | null,
): ClinicalMeasurementSystem {
  return getPathwayMeasurementPolicy(pathwayId, countryCode).instructionalSystem;
}
