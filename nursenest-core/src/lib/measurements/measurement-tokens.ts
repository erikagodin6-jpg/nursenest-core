/**
 * Lesson body tokens `{{token_id}}` → region-aware clinical strings (single source of truth).
 * Add new tokens here; do not duplicate lesson rows per region.
 */
import type { MeasurementSystem } from "@/lib/measurements/measurement-system";
import { formatMeasurementFromSi } from "@/lib/measurements/format-measurement";

export type MeasurementTokenId =
  | "glucose_normal"
  | "glucose_normal_fasting_si"
  | "glucose_elevated_example"
  | "creatinine_normal"
  | "creatinine_normal_male_si"
  | "hemoglobin_normal_female_si"
  | "potassium_normal_si"
  | "temperature_fever"
  | "temperature_fever_si"
  | "temperature_normal_si";

type TokenDef =
  | { type: "single"; kind: import("./format-measurement").MeasurementKind; valueSi: number }
  | { type: "range"; kind: import("./format-measurement").MeasurementKind; lowSi: number; highSi: number };

const TOKEN_REGISTRY: Partial<Record<MeasurementTokenId, TokenDef>> = {
  /** Typical fasting glucose band (SI) — educational; not a diagnostic cut point. */
  glucose_normal: { type: "range", kind: "glucose", lowSi: 3.9, highSi: 5.5 },
  glucose_normal_fasting_si: { type: "range", kind: "glucose", lowSi: 3.9, highSi: 5.5 },
  glucose_elevated_example: { type: "single", kind: "glucose", valueSi: 8.0 },
  creatinine_normal: { type: "single", kind: "creatinine", valueSi: 88 },
  creatinine_normal_male_si: { type: "single", kind: "creatinine", valueSi: 88 },
  hemoglobin_normal_female_si: { type: "single", kind: "hemoglobin", valueSi: 130 },
  potassium_normal_si: { type: "range", kind: "potassium", lowSi: 3.5, highSi: 5.1 },
  temperature_fever: { type: "single", kind: "temperature", valueSi: 38.5 },
  temperature_fever_si: { type: "single", kind: "temperature", valueSi: 38.5 },
  temperature_normal_si: { type: "range", kind: "temperature", lowSi: 36.1, highSi: 37.2 },
};

const TOKEN_RE = /\{\{\s*([a-z0-9_]+)\s*\}\}/gi;

function formatRangeSi(
  lowSi: number,
  highSi: number,
  kind: import("./format-measurement").MeasurementKind,
  system: MeasurementSystem,
  dual: boolean,
): string {
  const a = formatMeasurementFromSi(lowSi, kind, system, { dual: false });
  const b = formatMeasurementFromSi(highSi, kind, system, { dual: false });
  const range = `${a.replace(/\s+/g, " ")}–${b.replace(/\s+/g, " ")}`;
  if (!dual) return range;
  const other: MeasurementSystem = system === "US" ? "SI" : "US";
  const a2 = formatMeasurementFromSi(lowSi, kind, other, { dual: false });
  const b2 = formatMeasurementFromSi(highSi, kind, other, { dual: false });
  return `${range} (≈ ${a2.replace(/\s+/g, " ")}–${b2.replace(/\s+/g, " ")})`;
}

/**
 * Replace `{{token_id}}` in plain text with formatted values. Unknown tokens left unchanged.
 */
export function resolveMeasurementTokens(
  text: string,
  measurementSystem: MeasurementSystem,
  options?: { dual?: boolean },
): string {
  const dual = options?.dual === true;
  return text.replace(TOKEN_RE, (full, id: string) => {
    const def = TOKEN_REGISTRY[id as MeasurementTokenId];
    if (!def) return full;
    if (def.type === "single") {
      return formatMeasurementFromSi(def.valueSi, def.kind, measurementSystem, { dual });
    }
    return formatRangeSi(def.lowSi, def.highSi, def.kind, measurementSystem, dual);
  });
}

export function listKnownMeasurementTokenIds(): MeasurementTokenId[] {
  return Object.keys(TOKEN_REGISTRY) as MeasurementTokenId[];
}
