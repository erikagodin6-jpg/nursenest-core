/**
 * Region-aware measurement system selection (clinical display).
 * US uses customary US clinical units; most other regions (CA, UK, AU, …) use SI / international conventions.
 */

export type MeasurementSystem = "US" | "SI";

/**
 * Map ISO-like country codes to display system. Extend when adding markets (e.g. UK → SI).
 */
export function getMeasurementSystemForCountry(country: string | null | undefined): MeasurementSystem {
  const c = (country ?? "").trim().toUpperCase();
  if (c === "US") return "US";
  return "SI";
}

/**
 * Learner question bank / practice: derive display system from selected pathway’s country.
 * Defaults to US when pathway or map is unknown (primary market; avoids silent SI for undetermined state).
 */
export function resolveMeasurementSystemForLearnerPathway(
  pathwayId: string | null | undefined,
  countryByPathwayId: Record<string, string> | undefined,
): MeasurementSystem {
  const pid = pathwayId?.trim();
  if (!pid || !countryByPathwayId) return "US";
  const cc = countryByPathwayId[pid];
  if (!cc) return "US";
  return getMeasurementSystemForCountry(cc);
}
