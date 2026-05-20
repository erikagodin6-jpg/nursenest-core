/**
 * Canonical clinical measurement domain model.
 *
 * Storage and authoring are always SI-normalized (`valueSi`).
 * `instructionalSystem` is pathway-native pedagogy; `renderedSystem` is the learner override.
 */

/** Canonical display systems (lowercase — domain vocabulary). */
export type ClinicalMeasurementSystem = "si" | "conventional";

/** Regional / market instructional context (not the same as exam country). */
export type MeasurementContext = "canada" | "us" | "global";

/**
 * Clinical measurement taxonomy for governance, hints, and analytics.
 * Maps to {@link MeasurementKind} for numeric conversion (see `categoryToMeasurementKind`).
 */
export type MeasurementCategory =
  | "glucose"
  | "electrolytes"
  | "hematology"
  | "hemodynamics"
  | "temperature"
  | "weight"
  | "height"
  | "drug_dosage"
  | "abg"
  | "pediatric_dosing";

/** Legacy runtime type used across exam shells — prefer bridging via helpers below. */
export type MeasurementSystem = "US" | "SI";

/** SI-normalized unit families used by the conversion engine. */
export type MeasurementKind =
  | "glucose"
  | "sodium"
  | "potassium"
  | "creatinine"
  | "hemoglobin"
  | "temperature"
  | "weight"
  | "height";

export type AuthoredMeasurement = {
  category: MeasurementCategory;
  kind: MeasurementKind;
  /** Canonical SI storage value (mmol/L, µmol/L, °C, kg, cm, …). */
  valueSi: number;
  /** System the content was authored for (pathway instructional default or explicit token unit). */
  authoredSystem: ClinicalMeasurementSystem;
  /** Optional high/low for ranges. */
  lowSi?: number;
  highSi?: number;
};

export type ClinicalMeasurementRenderResult = {
  category: MeasurementCategory;
  kind: MeasurementKind;
  authoredSystem: ClinicalMeasurementSystem;
  renderedSystem: ClinicalMeasurementSystem;
  /** SI value before display formatting. */
  originalValueSi: number;
  /** Numeric value in the rendered system's primary unit (e.g. mg/dL, mmol/L). */
  renderedPrimaryValue: number;
  /** Set when a cross-system conversion was applied. */
  convertedValue: number | null;
  displayPrimary: string;
  /** Approximate equivalent — only when pedagogically allowed. */
  displaySecondary: string | null;
  dualShown: boolean;
  conversionApplied: boolean;
  conversionBlocked: boolean;
  blockReason: string | null;
};

export type MeasurementRenderContext = {
  pathwayId: string | null;
  measurementContext: MeasurementContext;
  /** Pathway-native instructional system (never overridden by learner toggle). */
  instructionalSystem: ClinicalMeasurementSystem;
  /** Active learner-facing system (preference override). */
  renderedSystem: ClinicalMeasurementSystem;
  /** Legacy alias for rendered system. */
  legacyRenderedSystem: MeasurementSystem;
  preferenceApplied: boolean;
};

const CATEGORY_TO_KIND: Record<MeasurementCategory, MeasurementKind | null> = {
  glucose: "glucose",
  electrolytes: "potassium",
  hematology: "hemoglobin",
  hemodynamics: null,
  temperature: "temperature",
  weight: "weight",
  height: "height",
  drug_dosage: null,
  abg: null,
  pediatric_dosing: "weight",
};

export function categoryToMeasurementKind(category: MeasurementCategory): MeasurementKind | null {
  return CATEGORY_TO_KIND[category] ?? null;
}

export function clinicalToLegacySystem(system: ClinicalMeasurementSystem): MeasurementSystem {
  return system === "conventional" ? "US" : "SI";
}

export function legacyToClinicalSystem(system: MeasurementSystem): ClinicalMeasurementSystem {
  return system === "US" ? "conventional" : "si";
}

export function measurementContextFromCountry(country: string | null | undefined): MeasurementContext {
  const c = (country ?? "").trim().toUpperCase();
  if (c === "US") return "us";
  if (c === "CA") return "canada";
  return "global";
}
