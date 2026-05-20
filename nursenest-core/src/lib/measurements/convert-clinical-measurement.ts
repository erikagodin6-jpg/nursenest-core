/**
 * Medically-governed clinical measurement conversion and display formatting.
 *
 * All numeric values are normalized to SI before conversion (`valueSi`).
 */
import type {
  ClinicalMeasurementRenderResult,
  ClinicalMeasurementSystem,
  MeasurementCategory,
  MeasurementKind,
} from "@/lib/measurements/measurement-domain";

export type ConvertClinicalMeasurementOptions = {
  /** Show approximate equivalent in the other system when pedagogically safe. */
  showEducationalEquivalent?: boolean;
  decimalsOverride?: number;
};

/** Categories that must not show automatic dual equivalents (dosage / hemodynamic safety). */
const HIGH_RISK_DUAL_BLOCK: ReadonlySet<MeasurementCategory> = new Set([
  "drug_dosage",
  "hemodynamics",
  "abg",
  "pediatric_dosing",
]);

/** Categories where cross-system conversion is display-only with strict rounding. */
const STRICT_ROUNDING_CATEGORIES: ReadonlySet<MeasurementCategory> = new Set([
  "glucose",
  "electrolytes",
  "hematology",
  "drug_dosage",
  "abg",
  "pediatric_dosing",
]);

const GLUCOSE_MMOL_TO_MGDL = 18.0182;
const CREAT_UMOL_TO_MGDL = 88.4;
const HGB_GL_TO_GDL = 0.1;
const SODIUM_MMOL_SAME = true;
const LB_PER_KG = 2.20462;
const CM_PER_IN = 2.54;

const DISPLAY_RANGES: Partial<
  Record<MeasurementKind, { si: [number, number]; conventional: [number, number] }>
> = {
  glucose: { si: [1, 40], conventional: [20, 700] },
  potassium: { si: [2, 8], conventional: [2, 8] },
  sodium: { si: [120, 170], conventional: [120, 170] },
  temperature: { si: [32, 43], conventional: [90, 110] },
};

function roundTo(n: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

function formatNumeric(n: number, decimals: number): string {
  if (decimals <= 0) return String(Math.round(n));
  return roundTo(n, decimals).toFixed(decimals);
}

function kindForCategory(category: MeasurementCategory, explicitKind?: MeasurementKind): MeasurementKind {
  if (explicitKind) return explicitKind;
  switch (category) {
    case "glucose":
      return "glucose";
    case "electrolytes":
      return "potassium";
    case "hematology":
      return "hemoglobin";
    case "temperature":
      return "temperature";
    case "weight":
    case "pediatric_dosing":
      return "weight";
    case "height":
      return "height";
    default:
      return "glucose";
  }
}

function precisionDecimals(
  kind: MeasurementKind,
  system: ClinicalMeasurementSystem,
  category: MeasurementCategory,
): number {
  if (STRICT_ROUNDING_CATEGORIES.has(category)) {
    switch (kind) {
      case "glucose":
        return system === "conventional" ? 0 : 1;
      case "potassium":
      case "sodium":
        return 1;
      case "creatinine":
        return system === "conventional" ? 2 : 0;
      case "hemoglobin":
        return system === "conventional" ? 1 : 0;
      case "temperature":
        return 1;
      default:
        break;
    }
  }
  switch (kind) {
    case "glucose":
      return system === "conventional" ? 0 : 1;
    case "creatinine":
      return system === "conventional" ? 2 : 0;
    case "hemoglobin":
      return system === "conventional" ? 1 : 0;
    case "potassium":
    case "sodium":
      return 1;
    case "temperature":
      return 1;
    case "weight":
      return 1;
    case "height":
      return system === "conventional" ? 0 : 0;
    default:
      return 1;
  }
}

function valueInRenderedPrimaryUnit(
  valueSi: number,
  kind: MeasurementKind,
  system: ClinicalMeasurementSystem,
): number {
  switch (kind) {
    case "glucose":
      return system === "conventional" ? valueSi * GLUCOSE_MMOL_TO_MGDL : valueSi;
    case "creatinine":
      return system === "conventional" ? valueSi / CREAT_UMOL_TO_MGDL : valueSi;
    case "hemoglobin":
      return system === "conventional" ? valueSi * HGB_GL_TO_GDL : valueSi;
    case "potassium":
    case "sodium":
      return valueSi;
    case "temperature":
      return system === "conventional" ? (valueSi * 9) / 5 + 32 : valueSi;
    case "weight":
      return system === "conventional" ? valueSi * LB_PER_KG : valueSi;
    case "height":
      return system === "conventional" ? valueSi / CM_PER_IN : valueSi;
    default:
      return valueSi;
  }
}

function formatPrimaryString(
  valueSi: number,
  kind: MeasurementKind,
  system: ClinicalMeasurementSystem,
  decimals: number,
): string {
  switch (kind) {
    case "glucose": {
      if (system === "conventional") {
        return `${formatNumeric(valueSi * GLUCOSE_MMOL_TO_MGDL, decimals)} mg/dL`;
      }
      return `${formatNumeric(valueSi, decimals)} mmol/L`;
    }
    case "creatinine": {
      if (system === "conventional") {
        return `${formatNumeric(valueSi / CREAT_UMOL_TO_MGDL, decimals)} mg/dL`;
      }
      return `${formatNumeric(valueSi, decimals)} µmol/L`;
    }
    case "hemoglobin": {
      if (system === "conventional") {
        return `${formatNumeric(valueSi * HGB_GL_TO_GDL, decimals)} g/dL`;
      }
      return `${formatNumeric(valueSi, decimals)} g/L`;
    }
    case "potassium":
    case "sodium": {
      const label = kind === "sodium" ? "mEq/L" : "mmol/L";
      return `${formatNumeric(valueSi, decimals)} ${label}`;
    }
    case "temperature": {
      if (system === "conventional") {
        return `${formatNumeric((valueSi * 9) / 5 + 32, decimals)}°F`;
      }
      return `${formatNumeric(valueSi, decimals)}°C`;
    }
    case "weight": {
      if (system === "conventional") {
        return `${formatNumeric(valueSi * LB_PER_KG, decimals)} lb`;
      }
      return `${formatNumeric(valueSi, decimals)} kg`;
    }
    case "height": {
      if (system === "conventional") {
        const totalIn = valueSi / CM_PER_IN;
        const ft = Math.floor(totalIn / 12);
        const inch = roundTo(totalIn - ft * 12, decimals);
        return `${ft}'${inch}"`;
      }
      return `${formatNumeric(valueSi, decimals)} cm`;
    }
    default:
      return formatNumeric(valueSi, decimals);
  }
}

function assertDisplayRange(
  valueSi: number,
  kind: MeasurementKind,
  system: ClinicalMeasurementSystem,
): string | null {
  const range = DISPLAY_RANGES[kind];
  if (!range) return null;
  const primary = valueInRenderedPrimaryUnit(valueSi, kind, system);
  const [lo, hi] = system === "conventional" ? range.conventional : range.si;
  if (primary < lo || primary > hi) {
    return `Value ${primary} outside expected ${kind} display range [${lo}, ${hi}]`;
  }
  return null;
}

/**
 * Convert a canonical SI value into a governed display result for the target system.
 */
export function convertClinicalMeasurement(args: {
  valueSi: number;
  category: MeasurementCategory;
  authoredSystem: ClinicalMeasurementSystem;
  renderedSystem: ClinicalMeasurementSystem;
  kind?: MeasurementKind;
  options?: ConvertClinicalMeasurementOptions;
}): ClinicalMeasurementRenderResult {
  const kind = kindForCategory(args.category, args.kind);
  const decimals =
    args.options?.decimalsOverride ?? precisionDecimals(kind, args.renderedSystem, args.category);
  const conversionApplied = args.authoredSystem !== args.renderedSystem;

  const rangeWarning = assertDisplayRange(args.valueSi, kind, args.renderedSystem);
  const highRisk = HIGH_RISK_DUAL_BLOCK.has(args.category);
  const dualRequested = args.options?.showEducationalEquivalent === true && !highRisk;

  const displayPrimary = formatPrimaryString(args.valueSi, kind, args.renderedSystem, decimals);
  const renderedPrimaryValue = roundTo(
    valueInRenderedPrimaryUnit(args.valueSi, kind, args.renderedSystem),
    decimals,
  );

  let displaySecondary: string | null = null;
  let dualShown = false;
  if (dualRequested && args.renderedSystem !== args.authoredSystem) {
    const other: ClinicalMeasurementSystem =
      args.renderedSystem === "si" ? "conventional" : "si";
    const secDecimals = precisionDecimals(kind, other, args.category);
    displaySecondary = formatPrimaryString(args.valueSi, kind, other, secDecimals);
    dualShown = true;
  } else if (dualRequested && args.renderedSystem === args.authoredSystem) {
    const other: ClinicalMeasurementSystem =
      args.renderedSystem === "si" ? "conventional" : "si";
    displaySecondary = formatPrimaryString(
      args.valueSi,
      kind,
      other,
      precisionDecimals(kind, other, args.category),
    );
    dualShown = true;
  }

  const conversionBlocked = Boolean(rangeWarning) || (highRisk && conversionApplied);

  return {
    category: args.category,
    kind,
    authoredSystem: args.authoredSystem,
    renderedSystem: args.renderedSystem,
    originalValueSi: args.valueSi,
    renderedPrimaryValue,
    convertedValue: conversionApplied ? renderedPrimaryValue : null,
    displayPrimary,
    displaySecondary,
    dualShown,
    conversionApplied,
    conversionBlocked,
    blockReason: rangeWarning ?? (highRisk && conversionApplied ? "High-risk category" : null),
  };
}

export function formatRangeFromSi(args: {
  lowSi: number;
  highSi: number;
  category: MeasurementCategory;
  authoredSystem: ClinicalMeasurementSystem;
  renderedSystem: ClinicalMeasurementSystem;
  kind?: MeasurementKind;
  options?: ConvertClinicalMeasurementOptions;
}): string {
  const low = convertClinicalMeasurement({
    valueSi: args.lowSi,
    category: args.category,
    authoredSystem: args.authoredSystem,
    renderedSystem: args.renderedSystem,
    kind: args.kind,
    options: { ...args.options, showEducationalEquivalent: false },
  });
  const high = convertClinicalMeasurement({
    valueSi: args.highSi,
    category: args.category,
    authoredSystem: args.authoredSystem,
    renderedSystem: args.renderedSystem,
    kind: args.kind,
    options: { ...args.options, showEducationalEquivalent: false },
  });
  const range = `${low.displayPrimary}–${high.displayPrimary}`;
  if (args.options?.showEducationalEquivalent && low.displaySecondary && high.displaySecondary) {
    return `${range} (≈ ${low.displaySecondary}–${high.displaySecondary})`;
  }
  return range;
}
