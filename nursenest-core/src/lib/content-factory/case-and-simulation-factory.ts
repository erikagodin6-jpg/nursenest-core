export type CaseFactoryProfession = "RN" | "RPN" | "NP" | "RT" | "Paramedic" | "MLT" | "OT" | "PT" | "Social Work" | "Psychotherapy";
export type SimulationFactoryLevel = "foundational" | "intermediate" | "advanced" | "expert";
export type SimulationFactoryDomain =
  | "medical-surgical"
  | "critical-care"
  | "emergency"
  | "mental-health"
  | "pediatrics"
  | "womens-health"
  | "community"
  | "np"
  | "allied-health";

export type CaseFactoryTarget = {
  readonly profession: CaseFactoryProfession;
  readonly targetCount: number;
  readonly requiredSections: readonly ["History", "Assessment", "Diagnostics", "Decision Points", "Outcomes", "Documentation", "Debrief"];
};

export type SimulationFactoryTarget = {
  readonly level: SimulationFactoryLevel;
  readonly domain: SimulationFactoryDomain;
  readonly targetCount: number;
};

export const CASE_STUDY_FACTORY_TARGETS: readonly CaseFactoryTarget[] = [
  "RN",
  "RPN",
  "NP",
  "RT",
  "Paramedic",
  "MLT",
  "OT",
  "PT",
  "Social Work",
  "Psychotherapy",
].map((profession) => ({
  profession: profession as CaseFactoryProfession,
  targetCount: 1000,
  requiredSections: ["History", "Assessment", "Diagnostics", "Decision Points", "Outcomes", "Documentation", "Debrief"],
}));

export const SIMULATION_FACTORY_TARGETS: readonly SimulationFactoryTarget[] = [
  "medical-surgical",
  "critical-care",
  "emergency",
  "mental-health",
  "pediatrics",
  "womens-health",
  "community",
  "np",
  "allied-health",
].flatMap((domain) =>
  (["foundational", "intermediate", "advanced", "expert"] as const).map((level) => ({
    level,
    domain: domain as SimulationFactoryDomain,
    targetCount: 140,
  })),
);

export function summarizeCaseSimulationTargets() {
  return {
    cases: CASE_STUDY_FACTORY_TARGETS.reduce((sum, item) => sum + item.targetCount, 0),
    simulations: SIMULATION_FACTORY_TARGETS.reduce((sum, item) => sum + item.targetCount, 0),
  };
}

export function validateCaseSimulationFactory(): readonly string[] {
  const totals = summarizeCaseSimulationTargets();
  const issues: string[] = [];
  if (totals.cases < 10000) issues.push("Case Study Factory target must be at least 10,000 cases");
  if (totals.simulations < 5000) issues.push("Simulation Factory target must be at least 5,000 simulations");
  for (const target of CASE_STUDY_FACTORY_TARGETS) {
    if (target.requiredSections.length !== 7) issues.push(`${target.profession} cases must include all required sections`);
  }
  return issues;
}
