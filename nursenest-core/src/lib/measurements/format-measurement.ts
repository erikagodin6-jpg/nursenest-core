/**
 * Back-compat formatting API — delegates to {@link convertClinicalMeasurement}.
 */
import { convertClinicalMeasurement } from "@/lib/measurements/convert-clinical-measurement";
import {
  clinicalToLegacySystem,
  legacyToClinicalSystem,
  type MeasurementKind,
  type MeasurementSystem,
} from "@/lib/measurements/measurement-domain";

export type { MeasurementKind } from "@/lib/measurements/measurement-domain";

function kindToCategory(kind: MeasurementKind): import("./measurement-domain").MeasurementCategory {
  switch (kind) {
    case "glucose":
      return "glucose";
    case "potassium":
    case "sodium":
    case "creatinine":
      return "electrolytes";
    case "hemoglobin":
      return "hematology";
    case "temperature":
      return "temperature";
    case "weight":
      return "weight";
    case "height":
      return "height";
    default:
      return "glucose";
  }
}

export function formatMeasurementFromSi(
  valueSi: number,
  kind: MeasurementKind,
  system: MeasurementSystem,
  options?: { decimals?: number; dual?: boolean },
): string {
  const rendered = legacyToClinicalSystem(system);
  const result = convertClinicalMeasurement({
    valueSi,
    category: kindToCategory(kind),
    kind,
    authoredSystem: "si",
    renderedSystem: rendered,
    options: {
      decimalsOverride: options?.decimals,
      showEducationalEquivalent: options?.dual === true,
    },
  });
  if (result.dualShown && result.displaySecondary) {
    return `${result.displayPrimary} (≈ ${result.displaySecondary})`;
  }
  return result.displayPrimary;
}

export function formatMeasurementFromSiWithContext(
  valueSi: number,
  kind: MeasurementKind,
  ctx: { measurementSystem: MeasurementSystem },
  options?: { decimals?: number; dual?: boolean },
): string {
  return formatMeasurementFromSi(valueSi, kind, ctx.measurementSystem, options);
}

export function formatMeasurement(
  valueSi: number,
  kind: MeasurementKind,
  examContext: { measurementSystem: MeasurementSystem },
  options?: { decimals?: number; dual?: boolean },
): string {
  return formatMeasurementFromSiWithContext(valueSi, kind, examContext, options);
}

/** @internal re-export for token layer */
export { clinicalToLegacySystem, legacyToClinicalSystem };
