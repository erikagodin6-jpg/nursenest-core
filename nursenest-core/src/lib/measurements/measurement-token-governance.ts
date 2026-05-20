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
import { parseMeasurementTokenV2, TOKEN_V2_RE } from "@/lib/measurements/measurement-token-v2";
import { renderParsedTokenV2 } from "@/lib/measurements/render-measurement-token-v2";

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
  if (category === "electrolytes" && (unitKey === "mmol/l" || unitKey === "meq/l")) {
    const cr = categoryRaw.toLowerCase();
    const kind: MeasurementKind =
      cr === "sodium" ? "sodium" : cr === "creatinine" ? "creatinine" : "potassium";
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
  const re = new RegExp(TOKEN_V2_RE.source, TOKEN_V2_RE.flags);

  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    const parsedV2 = parseMeasurementTokenV2(match[0]);
    if ("error" in parsedV2) {
      errors.push(parsedV2.error);
      segments.push({ type: "text", value: match[0] });
    } else if (parsedV2.type === "literal") {
      const rendered = renderParsedTokenV2(parsedV2, renderedSystem, instructionalSystem, options);
      segments.push({
        type: "rendered",
        value: rendered,
        measurement: {
          category: parsedV2.category,
          kind: "potassium",
          valueSi: 0,
          authoredSystem: instructionalSystem,
        },
      });
    } else {
      const authored = {
        ...parsedV2.measurement,
        authoredSystem: parsedV2.measurement.authoredSystem ?? instructionalSystem,
      };
      const rendered = renderParsedTokenV2(
        { ...parsedV2, measurement: authored } as typeof parsedV2,
        renderedSystem,
        instructionalSystem,
        options,
      );
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
  const re = new RegExp(TOKEN_V2_RE.source, TOKEN_V2_RE.flags);
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const parsed = parseMeasurementTokenV2(match[0]);
    if ("error" in parsed) errors.push(parsed.error);
  }
  return errors;
}

export { CANONICAL_TOKEN_RE, LEGACY_TOKEN_RE };
