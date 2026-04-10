/**
 * Canonical values are stored in **SI** internally (mmol/L glucose, µmol/L creatinine, °C, kg, cm, …).
 * {@link formatMeasurementFromSi} converts + labels for US vs SI displays.
 */
import type { MeasurementSystem } from "@/lib/measurements/measurement-system";

export type MeasurementKind =
  | "glucose"
  | "creatinine"
  | "hemoglobin"
  | "potassium"
  | "temperature"
  | "weight"
  | "height";

/** Conversion / formatting constants (clinical rounding). */
const GLUCOSE_MMOL_TO_MGDL = 18.0182;
const CREAT_UMOL_TO_MGDL = 88.4;
const HGB_GL_TO_GDL = 0.1;
const LB_PER_KG = 2.20462;
const CM_PER_IN = 2.54;

function roundTo(n: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

/**
 * Format a single value already expressed in **canonical SI** units for the target display system.
 */
export function formatMeasurementFromSi(
  valueSi: number,
  kind: MeasurementKind,
  system: MeasurementSystem,
  options?: { decimals?: number; dual?: boolean },
): string {
  const dual = options?.dual === true;
  const primary = formatMeasurementFromSiPrimary(valueSi, kind, system, options?.decimals);
  if (!dual) return primary;
  const other: MeasurementSystem = system === "US" ? "SI" : "US";
  const secondary = formatMeasurementFromSiPrimary(valueSi, kind, other, options?.decimals);
  return `${primary} (≈ ${secondary})`;
}

function formatMeasurementFromSiPrimary(
  valueSi: number,
  kind: MeasurementKind,
  system: MeasurementSystem,
  decimalsOverride?: number,
): string {
  switch (kind) {
    case "glucose": {
      if (system === "US") {
        const mg = roundTo(valueSi * GLUCOSE_MMOL_TO_MGDL, decimalsOverride ?? 0);
        return `${mg} mg/dL`;
      }
      const v = roundTo(valueSi, decimalsOverride ?? 1);
      return `${v} mmol/L`;
    }
    case "creatinine": {
      if (system === "US") {
        const mgdl = roundTo(valueSi / CREAT_UMOL_TO_MGDL, decimalsOverride ?? 2);
        return `${mgdl} mg/dL`;
      }
      const umol = roundTo(valueSi, decimalsOverride ?? 0);
      return `${umol} µmol/L`;
    }
    case "hemoglobin": {
      if (system === "US") {
        const gdl = roundTo(valueSi * HGB_GL_TO_GDL, decimalsOverride ?? 1);
        return `${gdl} g/dL`;
      }
      const gl = roundTo(valueSi, decimalsOverride ?? 0);
      return `${gl} g/L`;
    }
    case "potassium": {
      const v = roundTo(valueSi, decimalsOverride ?? 1);
      return `${v} mmol/L`;
    }
    case "temperature": {
      if (system === "US") {
        const f = roundTo((valueSi * 9) / 5 + 32, decimalsOverride ?? 1);
        return `${f}°F`;
      }
      const c = roundTo(valueSi, decimalsOverride ?? 1);
      return `${c}°C`;
    }
    case "weight": {
      if (system === "US") {
        const lb = roundTo(valueSi * LB_PER_KG, decimalsOverride ?? 1);
        return `${lb} lb`;
      }
      const kg = roundTo(valueSi, decimalsOverride ?? 1);
      return `${kg} kg`;
    }
    case "height": {
      if (system === "US") {
        const totalIn = valueSi / CM_PER_IN;
        const ft = Math.floor(totalIn / 12);
        const inch = roundTo(totalIn - ft * 12, decimalsOverride ?? 0);
        return `${ft}'${inch}"`;
      }
      const cm = roundTo(valueSi, decimalsOverride ?? 0);
      return `${cm} cm`;
    }
    default:
      return String(valueSi);
  }
}

/**
 * Convenience: format using a partial exam context shape.
 */
export function formatMeasurementFromSiWithContext(
  valueSi: number,
  kind: MeasurementKind,
  ctx: { measurementSystem: MeasurementSystem },
  options?: { decimals?: number; dual?: boolean },
): string {
  return formatMeasurementFromSi(valueSi, kind, ctx.measurementSystem, options);
}

/** Spec name: canonical SI numeric + kind + exam context → formatted string with units. */
export function formatMeasurement(
  valueSi: number,
  kind: MeasurementKind,
  examContext: { measurementSystem: MeasurementSystem },
  options?: { decimals?: number; dual?: boolean },
): string {
  return formatMeasurementFromSiWithContext(valueSi, kind, examContext, options);
}
