import { isAlliedGlobalPathwayId } from "@/lib/allied/allied-global-pathway";
import { clinicalToLegacySystem } from "@/lib/measurements/measurement-domain";
import type { MeasurementSystem } from "@/lib/measurements/measurement-domain";
import type { MeasurementPreference } from "@/lib/measurements/measurement-preference";
import { getPathwayInstructionalSystem } from "@/lib/measurements/pathway-measurement-policy";
import { resolveRenderedMeasurementSystem } from "@/lib/measurements/resolve-measurement-context";

export type { MeasurementSystem } from "@/lib/measurements/measurement-domain";

/**
 * Map ISO-like country codes to display system. Extend when adding markets (e.g. UK → SI).
 * @deprecated Prefer {@link resolveRenderedMeasurementSystem} for pathway-aware semantics.
 */
export function getMeasurementSystemForCountry(country: string | null | undefined): MeasurementSystem {
  const c = (country ?? "").trim().toUpperCase();
  if (c === "US") return "US";
  return "SI";
}

/**
 * Learner display system: pathway **instructional** default + learner preference override.
 * Instructional metadata is never mutated — only rendering changes.
 */
export function resolveMeasurementSystemForLearnerPathway(
  pathwayId: string | null | undefined,
  countryByPathwayId: Record<string, string> | undefined,
  preference?: MeasurementPreference | null,
): MeasurementSystem {
  const pid = pathwayId?.trim();
  const country = pid && countryByPathwayId ? countryByPathwayId[pid] : null;
  if (pid && isAlliedGlobalPathwayId(pid)) {
    return resolveRenderedMeasurementSystem({
      pathwayId: pid,
      countryCode: null,
      preference,
    });
  }
  return resolveRenderedMeasurementSystem({
    pathwayId: pid ?? null,
    countryCode: country,
    preference,
  });
}

/** Instructional (pathway-native) system as legacy `US` | `SI`. */
export function getInstructionalLegacySystem(
  pathwayId: string | null | undefined,
  countryCode?: string | null,
): MeasurementSystem {
  return clinicalToLegacySystem(getPathwayInstructionalSystem(pathwayId, countryCode));
}
