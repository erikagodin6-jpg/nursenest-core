/**
 * Token governance V2 — extended canonical grammar.
 *
 * Forms:
 * - Scalar:     [[potassium:6.1:mmol/L]]
 * - Range:      [[glucose:3.9-5.5:mmol/L]]
 * - Annotated:  [[potassium:6.1:mmol/L|critical]]
 * - Literal:    [[abg:7.28/52/28/24|panel]]  [[bp:82/48:mmHg|shock]]
 * - Trend (2):  [[potassium:5.2>6.1:mmol/L|trend]]
 * - Trend (n):  [[potassium:4.8,5.2,6.1:mmol/L|trend]]
 * - Trend (n):  [[potassium:4.8>5.2>6.1:mmol/L|trend]]
 */
import type { AuthoredMeasurement, MeasurementCategory } from "@/lib/measurements/measurement-domain";
import { parseCanonicalMeasurementToken } from "@/lib/measurements/measurement-token-governance";
import type { MeasurementTokenValidationError } from "@/lib/measurements/measurement-token-governance";

export type ParsedMeasurementTokenV2 =
  | { type: "scalar"; measurement: AuthoredMeasurement; annotation: string | null }
  | { type: "range"; measurement: AuthoredMeasurement; annotation: string | null }
  | {
      type: "trend";
      priorValueSi: number;
      currentValueSi: number;
      valuesSi: number[];
      measurement: AuthoredMeasurement;
      annotation: string | null;
    }
  | { type: "literal"; category: MeasurementCategory; displayLiteral: string; annotation: string | null }
  | { error: MeasurementTokenValidationError };

/** `[[category:payload[:unit][|annotation]]]` */
export const TOKEN_V2_RE =
  /\[\[\s*([a-z_]+)\s*:\s*([^|\]]+?)(?:\s*:\s*([^|\]]+?))?\s*(?:\|\s*([a-z_]+))?\s*\]\]/gi;

const LITERAL_CATEGORIES = new Set<MeasurementCategory>(["abg", "hemodynamics", "drug_dosage"]);

function categoryFromRaw(raw: string): MeasurementCategory | null {
  const k = raw.trim().toLowerCase();
  const map: Record<string, MeasurementCategory> = {
    glucose: "glucose",
    potassium: "electrolytes",
    sodium: "electrolytes",
    electrolytes: "electrolytes",
    creatinine: "electrolytes",
    lactate: "electrolytes",
    hemoglobin: "hematology",
    hematology: "hematology",
    abg: "abg",
    bp: "hemodynamics",
    blood_pressure: "hemodynamics",
    hemodynamics: "hemodynamics",
    temperature: "temperature",
    weight: "weight",
    height: "height",
    insulin: "drug_dosage",
    drug: "drug_dosage",
  };
  return map[k] ?? null;
}

function parseScalarPoints(
  categoryRaw: string,
  points: string[],
  unit: string | undefined,
): { valuesSi: number[]; measurement: AuthoredMeasurement } | { error: MeasurementTokenValidationError } {
  const valuesSi: number[] = [];
  let lastMeasurement: AuthoredMeasurement | null = null;
  for (const pt of points) {
    const parsed = parseCanonicalMeasurementToken(categoryRaw, pt.trim(), unit ?? "mmol/L");
    if ("error" in parsed) return { error: parsed.error };
    valuesSi.push(parsed.measurement.valueSi);
    lastMeasurement = parsed.measurement;
  }
  if (!lastMeasurement) {
    return {
      error: {
        code: "invalid_value",
        message: "Trend requires at least one numeric point",
        raw: categoryRaw,
      },
    };
  }
  return { valuesSi, measurement: lastMeasurement };
}

function parseRangeOrScalar(
  category: MeasurementCategory,
  payload: string,
  unit: string | undefined,
  annotation: string | null,
  categoryRaw: string,
): ParsedMeasurementTokenV2 {
  const chainedTrend = payload.match(/^([0-9.]+(?:\s*>\s*[0-9.]+)+)$/);
  if (chainedTrend) {
    const points = payload.split(/\s*>\s*/).filter(Boolean);
    const parsed = parseScalarPoints(categoryRaw, points, unit);
    if ("error" in parsed) return { error: parsed.error };
    const { valuesSi, measurement } = parsed;
    return {
      type: "trend",
      priorValueSi: valuesSi[0] ?? measurement.valueSi,
      currentValueSi: valuesSi[valuesSi.length - 1] ?? measurement.valueSi,
      valuesSi,
      measurement,
      annotation,
    };
  }

  const commaTrend = payload.match(/^([0-9.]+(?:\s*,\s*[0-9.]+)+)$/);
  if (commaTrend) {
    const points = payload.split(/\s*,\s*/).filter(Boolean);
    const parsed = parseScalarPoints(categoryRaw, points, unit);
    if ("error" in parsed) return { error: parsed.error };
    const { valuesSi, measurement } = parsed;
    return {
      type: "trend",
      priorValueSi: valuesSi[0] ?? measurement.valueSi,
      currentValueSi: valuesSi[valuesSi.length - 1] ?? measurement.valueSi,
      valuesSi,
      measurement,
      annotation,
    };
  }

  const trendMatch = payload.match(/^([0-9.]+)\s*>\s*([0-9.]+)$/);
  if (trendMatch) {
    const parsed = parseScalarPoints(categoryRaw, [trendMatch[1], trendMatch[2]], unit);
    if ("error" in parsed) return { error: parsed.error };
    const { valuesSi, measurement } = parsed;
    return {
      type: "trend",
      priorValueSi: valuesSi[0] ?? measurement.valueSi,
      currentValueSi: valuesSi[1] ?? measurement.valueSi,
      valuesSi,
      measurement,
      annotation,
    };
  }

  const rangeMatch = payload.match(/^([0-9.]+)\s*-\s*([0-9.]+)$/);
  if (rangeMatch) {
    const lo = parseCanonicalMeasurementToken(categoryRaw, rangeMatch[1], unit ?? "mmol/L");
    const hi = parseCanonicalMeasurementToken(categoryRaw, rangeMatch[2], unit ?? "mmol/L");
    if ("error" in lo || "error" in hi) {
      return {
        error: ("error" in lo ? lo.error : (hi as { error: MeasurementTokenValidationError }).error),
      };
    }
    return {
      type: "range",
      measurement: {
        ...hi.measurement,
        lowSi: lo.measurement.valueSi,
        highSi: hi.measurement.valueSi,
      },
      annotation,
    };
  }

  const scalar = parseCanonicalMeasurementToken(categoryRaw, payload, unit ?? "mmol/L");
  if ("error" in scalar) return { error: scalar.error };
  return { type: "scalar", measurement: scalar.measurement, annotation };
}

export function parseMeasurementTokenV2(rawToken: string): ParsedMeasurementTokenV2 {
  const inner = rawToken.replace(/^\[\[|\]\]$/g, "").trim();
  const parts = inner.split("|").map((p) => p.trim());
  const body = parts[0] ?? "";
  const annotation = parts[1] ?? null;
  const colon = body.indexOf(":");
  if (colon < 0) {
    return {
      error: {
        code: "invalid_value",
        message: "Token body must be category:payload",
        raw: rawToken,
      },
    };
  }
  const categoryRaw = body.slice(0, colon);
  const rest = body.slice(colon + 1);
  const category = categoryFromRaw(categoryRaw);
  if (!category) {
    return {
      error: {
        code: "unknown_category",
        message: `Unknown category ${categoryRaw}`,
        raw: rawToken,
      },
    };
  }

  if (LITERAL_CATEGORIES.has(category) && !rest.includes("mmol") && !rest.includes("mg")) {
    const sub = rest.split(":");
    const literal = sub.length > 1 ? `${sub[0]}:${sub[1]}` : sub[0];
    return {
      type: "literal",
      category,
      displayLiteral: literal.replace(/\//g, " / "),
      annotation,
    };
  }

  const sub = rest.split(":");
  const payload = sub[0]?.trim() ?? "";
  const unit = sub[1]?.trim();
  return parseRangeOrScalar(category, payload, unit, annotation, categoryRaw);
}

export function findMeasurementTokensV2(text: string): string[] {
  const found: string[] = [];
  const re = new RegExp(TOKEN_V2_RE.source, TOKEN_V2_RE.flags);
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    found.push(m[0]);
  }
  return found;
}
