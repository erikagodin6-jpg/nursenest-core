/**
 * Legacy `{{token_id}}` registry — canonical SI values for lesson authoring.
 */
import type { AuthoredMeasurement } from "@/lib/measurements/measurement-domain";

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
  | { type: "single"; measurement: AuthoredMeasurement }
  | {
      type: "range";
      measurement: AuthoredMeasurement & { lowSi: number; highSi: number };
    };

export const LEGACY_MEASUREMENT_TOKEN_REGISTRY: Partial<Record<MeasurementTokenId, TokenDef>> = {
  glucose_normal: {
    type: "range",
    measurement: {
      category: "glucose",
      kind: "glucose",
      valueSi: 4.7,
      authoredSystem: "si",
      lowSi: 3.9,
      highSi: 5.5,
    },
  },
  glucose_normal_fasting_si: {
    type: "range",
    measurement: {
      category: "glucose",
      kind: "glucose",
      valueSi: 4.7,
      authoredSystem: "si",
      lowSi: 3.9,
      highSi: 5.5,
    },
  },
  glucose_elevated_example: {
    type: "single",
    measurement: {
      category: "glucose",
      kind: "glucose",
      valueSi: 8.0,
      authoredSystem: "si",
    },
  },
  creatinine_normal: {
    type: "single",
    measurement: {
      category: "electrolytes",
      kind: "creatinine",
      valueSi: 88,
      authoredSystem: "si",
    },
  },
  creatinine_normal_male_si: {
    type: "single",
    measurement: {
      category: "electrolytes",
      kind: "creatinine",
      valueSi: 88,
      authoredSystem: "si",
    },
  },
  hemoglobin_normal_female_si: {
    type: "single",
    measurement: {
      category: "hematology",
      kind: "hemoglobin",
      valueSi: 130,
      authoredSystem: "si",
    },
  },
  potassium_normal_si: {
    type: "range",
    measurement: {
      category: "electrolytes",
      kind: "potassium",
      valueSi: 4.3,
      authoredSystem: "si",
      lowSi: 3.5,
      highSi: 5.1,
    },
  },
  temperature_fever: {
    type: "single",
    measurement: {
      category: "temperature",
      kind: "temperature",
      valueSi: 38.5,
      authoredSystem: "si",
    },
  },
  temperature_fever_si: {
    type: "single",
    measurement: {
      category: "temperature",
      kind: "temperature",
      valueSi: 38.5,
      authoredSystem: "si",
    },
  },
  temperature_normal_si: {
    type: "range",
    measurement: {
      category: "temperature",
      kind: "temperature",
      valueSi: 36.6,
      authoredSystem: "si",
      lowSi: 36.1,
      highSi: 37.2,
    },
  },
};

export function listKnownMeasurementTokenIds(): MeasurementTokenId[] {
  return Object.keys(LEGACY_MEASUREMENT_TOKEN_REGISTRY) as MeasurementTokenId[];
}
