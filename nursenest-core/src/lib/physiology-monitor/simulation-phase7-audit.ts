import { CLEARANCE_DEFINITIONS, type ClearanceId } from "@/lib/physiology-monitor/competency-clearance";
import { SIMULATION_CATALOG, type NgnQuestionFormat, type SimulationDefinition, type SimulationProfession } from "@/lib/physiology-monitor/simulation-catalog";

export type SimulationAuditStatus = "ready" | "partial" | "gap";

export type SimulationProfessionAudit = {
  profession: SimulationProfession;
  actual: number;
  target: number;
  gap: number;
  status: SimulationAuditStatus;
  difficulties: Record<string, number>;
  specialties: Record<string, number>;
  conditions: string[];
  ncjmmDomains: Record<string, number>;
  ngnFormats: Record<NgnQuestionFormat, number>;
};

export type SimulationContentAuditRow = {
  id: string;
  title: string;
  professions: SimulationProfession[];
  difficulty: string;
  specialty: string[];
  condition: string;
  ncjmmDomains: string[];
  ngnFormats: NgnQuestionFormat[];
  clearanceMappings: ClearanceId[];
  remediationMappings: string[];
  completeness: {
    patientHistory: boolean;
    assessment: boolean;
    evolvingCues: boolean;
    clinicalDecisions: boolean;
    consequences: boolean;
    deteriorationPathway: boolean;
    recoveryPathway: boolean;
    documentation: boolean;
    sbarHandoff: boolean;
    debrief: boolean;
    remediationMapping: boolean;
  };
};

export type SimulationContentAuditReport = {
  generatedAt: string;
  totalSimulations: number;
  targetTotal: number;
  totalGap: number;
  byProfession: Record<SimulationProfession, SimulationProfessionAudit>;
  clearanceCoverage: Record<ClearanceId, { requiredSimulationCount: number; mappedSimulationCount: number; missingSimulationIds: string[] }>;
  gapSummary: string[];
  rows: SimulationContentAuditRow[];
};

export const PHASE7_SIMULATION_TARGETS: Record<SimulationProfession, number> = {
  RN: 75,
  RPN: 50,
  NP: 50,
  RT: 50,
  NEW_GRAD: 50,
};

const NGN_FORMATS: NgnQuestionFormat[] = ["bowtie", "matrix", "sata", "prioritization", "cloze"];

function increment(map: Record<string, number>, key: string): void {
  map[key] = (map[key] ?? 0) + 1;
}

function statusFor(actual: number, target: number): SimulationAuditStatus {
  if (actual >= target) return "ready";
  if (actual > 0) return "partial";
  return "gap";
}

function isMappedToRemediation(sim: SimulationDefinition): boolean {
  return sim.conditionKey.trim().length > 0 && sim.tags.length > 0;
}

function clearanceMappingsForSimulation(sim: SimulationDefinition): ClearanceId[] {
  return CLEARANCE_DEFINITIONS.filter((clearance) => clearance.requiredSimulationsPassed.includes(sim.id)).map((clearance) => clearance.id);
}

function remediationMappingsForSimulation(sim: SimulationDefinition): string[] {
  const mappings = [`simulation:${sim.conditionKey}`];
  for (const format of sim.ngnFormats) mappings.push(`ngn:${format}`);
  for (const domain of sim.primaryNcjmmDomains) mappings.push(`ncjmm:${domain}`);
  return [...new Set(mappings)];
}

function rowForSimulation(sim: SimulationDefinition): SimulationContentAuditRow {
  const hasSbar = Boolean(sim.sbar?.situation && sim.sbar?.background && sim.sbar?.assessment && sim.sbar?.recommendation);
  const hasCriticalAction = sim.criticalActions.length > 0;
  const hasHarmAction = sim.criticalActions.some((action) => action.isHarmIfMissed);

  return {
    id: sim.id,
    title: sim.title,
    professions: sim.profession,
    difficulty: sim.difficulty,
    specialty: sim.specialty,
    condition: sim.conditionKey,
    ncjmmDomains: sim.primaryNcjmmDomains,
    ngnFormats: sim.ngnFormats,
    clearanceMappings: clearanceMappingsForSimulation(sim),
    remediationMappings: remediationMappingsForSimulation(sim),
    completeness: {
      patientHistory: sim.patientBrief.trim().length >= 40,
      assessment: hasSbar && sim.sbar.assessment.trim().length >= 20,
      evolvingCues: sim.openingStage != null || hasCriticalAction,
      clinicalDecisions: hasCriticalAction,
      consequences: hasHarmAction,
      deteriorationPathway: sim.openingStage === "developing" || sim.openingStage === "severe" || hasHarmAction,
      recoveryPathway: sim.criticalActions.some((action) => action.interventionKey != null),
      documentation: sim.documentationPrompts.length > 0,
      sbarHandoff: hasSbar,
      debrief: sim.learningObjectives.length > 0,
      remediationMapping: isMappedToRemediation(sim),
    },
  };
}

function emptyProfessionAudit(profession: SimulationProfession): SimulationProfessionAudit {
  const ngnFormats = Object.fromEntries(NGN_FORMATS.map((format) => [format, 0])) as Record<NgnQuestionFormat, number>;
  return {
    profession,
    actual: 0,
    target: PHASE7_SIMULATION_TARGETS[profession],
    gap: PHASE7_SIMULATION_TARGETS[profession],
    status: "gap",
    difficulties: {},
    specialties: {},
    conditions: [],
    ncjmmDomains: {},
    ngnFormats,
  };
}

export function buildSimulationContentAuditReport(
  simulations: readonly SimulationDefinition[] = SIMULATION_CATALOG,
  generatedAt = new Date().toISOString(),
): SimulationContentAuditReport {
  const byProfession = Object.fromEntries(
    (Object.keys(PHASE7_SIMULATION_TARGETS) as SimulationProfession[]).map((profession) => [profession, emptyProfessionAudit(profession)]),
  ) as Record<SimulationProfession, SimulationProfessionAudit>;

  const rows = simulations.map(rowForSimulation);

  for (const sim of simulations) {
    for (const profession of sim.profession) {
      const audit = byProfession[profession];
      audit.actual += 1;
      increment(audit.difficulties, sim.difficulty);
      for (const specialty of sim.specialty) increment(audit.specialties, specialty);
      for (const domain of sim.primaryNcjmmDomains) increment(audit.ncjmmDomains, domain);
      for (const format of sim.ngnFormats) audit.ngnFormats[format] = (audit.ngnFormats[format] ?? 0) + 1;
      audit.conditions = [...new Set([...audit.conditions, sim.conditionKey])].sort();
    }
  }

  for (const audit of Object.values(byProfession)) {
    audit.gap = Math.max(0, audit.target - audit.actual);
    audit.status = statusFor(audit.actual, audit.target);
  }

  const simulationIds = new Set(simulations.map((sim) => sim.id));
  const clearanceCoverage = Object.fromEntries(
    CLEARANCE_DEFINITIONS.map((clearance) => {
      const missingSimulationIds = clearance.requiredSimulationsPassed.filter((id) => !simulationIds.has(id));
      return [
        clearance.id,
        {
          requiredSimulationCount: clearance.requiredSimulationsPassed.length,
          mappedSimulationCount: clearance.requiredSimulationsPassed.length - missingSimulationIds.length,
          missingSimulationIds,
        },
      ];
    }),
  ) as SimulationContentAuditReport["clearanceCoverage"];

  const targetTotal = Object.values(PHASE7_SIMULATION_TARGETS).reduce((sum, target) => sum + target, 0);
  const totalGap = Math.max(0, targetTotal - simulations.length);
  const gapSummary = Object.values(byProfession)
    .filter((audit) => audit.gap > 0)
    .map((audit) => `${audit.profession}: ${audit.actual}/${audit.target} authored simulations (${audit.gap} remaining)`);

  return {
    generatedAt,
    totalSimulations: simulations.length,
    targetTotal,
    totalGap,
    byProfession,
    clearanceCoverage,
    gapSummary,
    rows,
  };
}

