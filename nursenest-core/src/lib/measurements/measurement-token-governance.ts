/**
 * Canonical measurement token parsing, validation, and rendering.
 *
 * Supported authoring forms:
 * - Legacy: `{{token_id}}` (registry in measurement-tokens-registry.ts)
 * - Canonical: `[[category:value:unit]]` e.g. `[[glucose:5.6:mmol/L]]`
 */
import {
  convertClinicalMeasurement,
  formatRangeFromSi,
  type ConvertClinicalMeasurementOptions,
} from "@/lib/measurements/convert-clinical-measurement";
import type {
  AuthoredMeasurement,
  ClinicalMeasurementSystem,
  MeasurementCategory,
  MeasurementKind,
} from "@/lib/measurements/measurement-domain";
import { categoryToMeasurementKind } from "@/lib/measurements/measurement-domain";

export type MeasurementTokenValidationError = {
  code: "unknown_category" | "unknown_unit" | "invalid_value" | "unsupported_conversion";
  message: string;
  raw: string;
};

const CANONICAL_TOKEN_RE = /\[\[\s*([a-z_]+)\s*:\s*([0-9.]+)\s*:\s*([^\]]+?)\s*\]\]/gi;
const LEGACY_TOKEN_RE = /\{\{\s*([a-z0-9_]+)\s*\}\}/gi;

type UnitSpec = {
  siUnit: string;
  conventionalUnit?: string;
  /** Multiply parsed value to get valueSi when token unit is siUnit. */
  toSi: (value: number) => number;
  kind: MeasurementKind;
};

const UNIT_SPECS: Record<string, UnitSpec> = {
  "mmol/l": { siUnit: "mmol/l", toSi: (v) => v, kind: "glucose" },
  "mg/dl": { siUnit: "mmol/l", conventionalUnit: "mg/dl", toSi: (v) => v / 18, kind: "glucose" },
  "µmol/l": { siUnit: "µmol/l", toSi: (v) => v, kind: "creatinine" },
  "umol/l": { siUnit: "µmol/l", toSi: (v) => v, kind: "creatinine" },
  "g/l": { siUnit: "g/l", toSi: (v) => v, kind: "hemoglobin" },
  "g/dl": { siUnit: "g/l", conventionalUnit: "g/dl", toSi: (v) => v * 10, kind: "hemoglobin" },
  "mmol/l_k": { siUnit: "mmol/l", toSi: (v) => v, kind: "potassium" },
  "meq/l": { siUnit: "mmol/l", toSi: (v) => v, kind: "sodium" },
  "c": { siUnit: "c", toSi: (v) => v, kind: "temperature" },
  "°c": { siUnit: "c", toSi: (v) => v, kind: "temperature" },
  "f": { siUnit: "c", conventionalUnit: "f", toSi: (v) => ((v - 32) * 5) / 9, kind: "temperature" },
  "°f": { siUnit: "c", conventionalUnit: "f", toSi: (v) => ((v - 32) * 5) / 9, kind: "temperature" },
  kg: { siUnit: "kg", toSi: (v) => v, kind: "weight" },
  lb: { siUnit: "kg", conventionalUnit: "lb", toSi: (v) => v / 2.20462, kind: "weight" },
  cm: { siUnit: "cm", toSi: (v) => v, kind: "height" },
};

const CATEGORY_ALIASES: Record<string, MeasurementCategory> = {
  glucose: "glucose",
  potassium: "electrolytes",
  sodium: "electrolytes",
  electrolytes: "electrolytes",
  creatinine: "electrolytes",
  hemoglobin: "hematology",
  hematology: "hematology",
  temperature: "temperature",
  weight: "weight",
  height: "height",
};

function normalizeUnit(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, "");
}

function systemFromUnit(unit: string): ClinicalMeasurementSystem {
  const u = normalizeUnit(unit);
  if (u === "mg/dl" || u === "g/dl" || u === "f" || u === "°f" || u === "lb") {
    return "conventional";
  }
  return "si";
}

export function parseCanonicalMeasurementToken(
  categoryRaw: string,
  valueRaw: string,
  unitRaw: string,
): { measurement: AuthoredMeasurement } | { error: MeasurementTokenValidationError } {
  const category = CATEGORY_ALIASES[categoryRaw.trim().toLowerCase()];
  if (!category) {
    return {
      error: {
        code: "unknown_category",
        message: `Unknown measurement category: ${categoryRaw}`,
        raw: `${categoryRaw}:${valueRaw}:${unitRaw}`,
      },
    };
  }

  const value = Number.parseFloat(valueRaw);
  if (!Number.isFinite(value)) {
    return {
      error: {
        code: "invalid_value",
        message: `Invalid numeric value: ${valueRaw}`,
        raw: `${categoryRaw}:${valueRaw}:${unitRaw}`,
      },
    };
  }

  const unitKey = normalizeUnit(unitRaw);
  let spec = UNIT_SPECS[unitKey];
  if (!spec && category === "electrolytes" && (unitKey === "mmol/l" || unitKey === "meq/l")) {
    const kind: MeasurementKind =
      categoryRaw.toLowerCase() === "sodium" ? "sodium" : "potassium";
    spec = { siUnit: "mmol/l", toSi: (v) => v, kind };
  }
  if (!spec) {
    const kind = categoryToMeasurementKind(category);
    if (!kind) {
      return {
        error: {
          code: "unsupported_conversion",
          message: `Category ${category} does not support numeric tokens`,
          raw: `${categoryRaw}:${valueRaw}:${unitRaw}`,
        },
      };
    }
    return {
      error: {
        code: "unknown_unit",
        message: `Unknown unit: ${unitRaw}`,
        raw: `${categoryRaw}:${valueRaw}:${unitRaw}`,
      },
    };
  }

  const authoredSystem = systemFromUnit(unitRaw);
  return {
    measurement: {
      category,
      kind: spec.kind,
      valueSi: spec.toSi(value),
      authoredSystem,
    },
  };
}

export function renderAuthoredMeasurement(
  measurement: AuthoredMeasurement,
  renderedSystem: ClinicalMeasurementSystem,
  options?: ConvertClinicalMeasurementOptions,
): string {
  if (measurement.lowSi != null && measurement.highSi != null) {
    return formatRangeFromSi({
      lowSi: measurement.lowSi,
      highSi: measurement.highSi,
      category: measurement.category,
      authoredSystem: measurement.authoredSystem,
      renderedSystem,
      kind: measurement.kind,
      options,
    });
  }
  return convertClinicalMeasurement({
    valueSi: measurement.valueSi,
    category: measurement.category,
    authoredSystem: measurement.authoredSystem,
    renderedSystem,
    kind: measurement.kind,
    options,
  }).displayPrimary;
}

export type TokenRenderSegment =
  | { type: "text"; value: string }
  | { type: "rendered"; value: string; measurement: AuthoredMeasurement };

/**
 * Resolve canonical `[[category:value:unit]]` tokens with provenance segments.
 */
export function resolveCanonicalTokensWithProvenance(
  text: string,
  renderedSystem: ClinicalMeasurementSystem,
  instructionalSystem: ClinicalMeasurementSystem,
  options?: ConvertClinicalMeasurementOptions,
): { output: string; segments: TokenRenderSegment[]; errors: MeasurementTokenValidationError[] } {
  const errors: MeasurementTokenValidationError[] = [];
  const segments: TokenRenderSegment[] = [];
  let lastIndex = 0;
  const re = new RegExp(CANONICAL_TOKEN_RE.source, CANONICAL_TOKEN_RE.flags);

  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    const parsed = parseCanonicalMeasurementToken(match[1], match[2], match[3]);
    if ("error" in parsed) {
      errors.push(parsed.error);
      segments.push({ type: "text", value: match[0] });
    } else {
      const authored = {
        ...parsed.measurement,
        authoredSystem: parsed.measurement.authoredSystem ?? instructionalSystem,
      };
      const rendered = renderAuthoredMeasurement(authored, renderedSystem, options);
      segments.push({ type: "rendered", value: rendered, measurement: authored });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }
  const output = segments.map((s) => s.value).join("");
  return { output, segments, errors };
}

export function lintMeasurementTokensInText(text: string): MeasurementTokenValidationError[] {
  const errors: MeasurementTokenValidationError[] = [];
  const re = new RegExp(CANONICAL_TOKEN_RE.source, CANONICAL_TOKEN_RE.flags);
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const parsed = parseCanonicalMeasurementToken(match[1], match[2], match[3]);
    if ("error" in parsed) errors.push(parsed.error);
  }
  return errors;
}

export { CANONICAL_TOKEN_RE, LEGACY_TOKEN_RE };
