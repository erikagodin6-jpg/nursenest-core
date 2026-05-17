import type { EmsScenarioRuntime } from "@/lib/paramedic/runtime/scenario-runtime";
import { calculateScenarioOperationalRisk } from "@/lib/paramedic/runtime/scenario-runtime";
import { INFERIOR_STEMI_RURAL_TRANSPORT_SCENARIO } from "./inferior-stemi-rural-transport";

export type ParamedicScenarioCatalogEntry = {
  scenario: EmsScenarioRuntime;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  readinessDomains: Array<
    | "ecg-recognition"
    | "transport-decision"
    | "reassessment"
    | "perfusion-assessment"
    | "airway"
    | "trauma"
    | "pharmacology"
  >;
  premium: boolean;
};

export const PARAMEDIC_SCENARIO_CATALOG: readonly ParamedicScenarioCatalogEntry[] = [
  {
    scenario: INFERIOR_STEMI_RURAL_TRANSPORT_SCENARIO,
    seo: {
      title: "Inferior STEMI EMS Scenario | Paramedic ECG and Transport Decision Practice",
      description:
        "Practice prehospital inferior STEMI recognition, hypotension, bradycardia, PCI transport decisions, and EMS reassessment in a rural transport scenario.",
      keywords: [
        "paramedic STEMI scenario",
        "inferior STEMI EMS",
        "paramedic ECG interpretation",
        "prehospital STEMI recognition",
        "EMS transport decision practice",
      ],
    },
    readinessDomains: [
      "ecg-recognition",
      "transport-decision",
      "reassessment",
      "perfusion-assessment",
      "pharmacology",
    ],
    premium: true,
  },
];

export function getParamedicScenarioBySlug(slug: string): ParamedicScenarioCatalogEntry | undefined {
  return PARAMEDIC_SCENARIO_CATALOG.find((entry) => entry.scenario.slug === slug);
}

export function getParamedicScenariosByCategory(
  category: EmsScenarioRuntime["category"],
): ParamedicScenarioCatalogEntry[] {
  return PARAMEDIC_SCENARIO_CATALOG.filter((entry) => entry.scenario.category === category);
}

export function getParamedicScenarioOperationalRisk(slug: string): number | null {
  const entry = getParamedicScenarioBySlug(slug);
  if (!entry) return null;
  return calculateScenarioOperationalRisk(entry.scenario);
}

export function calculateParamedicScenarioCatalogReadinessPercent(
  catalog: readonly ParamedicScenarioCatalogEntry[] = PARAMEDIC_SCENARIO_CATALOG,
): number {
  if (!catalog.length) return 0;

  let earned = 0;
  let possible = 0;

  for (const entry of catalog) {
    const scenario = entry.scenario;

    const stringChecks = [
      scenario.slug,
      scenario.title,
      entry.seo.title,
      entry.seo.description,
    ];

    for (const value of stringChecks) {
      possible += 1;
      if (value.trim().length >= 12) earned += 1;
    }

    const arrayChecks = [
      scenario.timeline,
      scenario.activeRisks,
      entry.seo.keywords,
      entry.readinessDomains,
      scenario.debrief?.strengths ?? [],
      scenario.debrief?.improvementAreas ?? [],
    ];

    for (const value of arrayChecks) {
      possible += 1;
      if (value.length >= 3) earned += 1;
    }

    possible += 1;
    if (scenario.patient.deteriorationRisk >= 1 && scenario.patient.instabilityLevel) earned += 1;

    possible += 1;
    if (scenario.transport.rationale.trim().length >= 40) earned += 1;

    possible += 1;
    if (calculateScenarioOperationalRisk(scenario) >= 1) earned += 1;
  }

  return Math.round((earned / possible) * 100);
}

export const PARAMEDIC_SCENARIO_CATALOG_READINESS_PERCENT = calculateParamedicScenarioCatalogReadinessPercent();
