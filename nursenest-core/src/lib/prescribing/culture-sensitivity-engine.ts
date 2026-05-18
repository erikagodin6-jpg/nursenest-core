export type SensitivityInterpretation = "S" | "I" | "R";

export interface CultureSensitivityEntry {
  antibiotic: string;
  interpretation: SensitivityInterpretation;
}

export interface CultureScenario {
  id: string;
  organism: string;
  specimen: string;
  entries: CultureSensitivityEntry[];
  stewardshipPearl: string;
}

export interface CultureInterpretationResult {
  recommendedAgents: string[];
  avoidAgents: string[];
  reasoning: string[];
}

export const CULTURE_SCENARIOS: CultureScenario[] = [
  {
    id: "mrsa-soft-tissue",
    organism: "MRSA",
    specimen: "Wound culture",
    entries: [
      {
        antibiotic: "cefazolin",
        interpretation: "R"
      },
      {
        antibiotic: "vancomycin",
        interpretation: "S"
      },
      {
        antibiotic: "TMP-SMX",
        interpretation: "S"
      }
    ],
    stewardshipPearl:
      "Once MRSA is identified, unnecessary gram negative coverage should be reassessed."
  },
  {
    id: "esbl-uti",
    organism: "ESBL E. coli",
    specimen: "Urine culture",
    entries: [
      {
        antibiotic: "ceftriaxone",
        interpretation: "R"
      },
      {
        antibiotic: "ciprofloxacin",
        interpretation: "R"
      },
      {
        antibiotic: "ertapenem",
        interpretation: "S"
      }
    ],
    stewardshipPearl:
      "Reserve carbapenems for resistant organisms and narrow when clinically safe."
  }
];

export function interpretCultureScenario(
  scenario: CultureScenario
): CultureInterpretationResult {
  const recommendedAgents = scenario.entries
    .filter((entry) => entry.interpretation === "S")
    .map((entry) => entry.antibiotic);

  const avoidAgents = scenario.entries
    .filter((entry) => entry.interpretation === "R")
    .map((entry) => entry.antibiotic);

  return {
    recommendedAgents,
    avoidAgents,
    reasoning: [
      `Confirmed organism: ${scenario.organism}.`,
      "Avoid maintaining resistant agents once susceptibilities are available.",
      scenario.stewardshipPearl
    ]
  };
}
