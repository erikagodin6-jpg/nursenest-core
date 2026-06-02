/**
 * Simulation Composer — Authoring Tools
 *
 * Enables rapid simulation authoring by composing from existing pathways
 * and condition patterns rather than starting from scratch.
 *
 * Reduces authoring overhead dramatically:
 *   - Pathway composer: select pathway → get full staged scenario
 *   - Condition mapper: validate condition keys exist in pattern registry
 *   - Intervention validator: confirm intervention keys are in catalog
 *   - NGN cue builder: generate starter cue sets from pathway data
 *   - Documentation prompt builder: generate prompts from pathway stage data
 *   - Simulation exporter: produces SimulationDefinition-compatible JSON
 *   - Replay timeline validator: checks that a session's events are coherent
 */

import { getDeteriorationPattern, DETERIORATION_PATTERNS } from "./deterioration-patterns";
import { getIntervention, INTERVENTION_CATALOG } from "./intervention-catalog";
import { getClinicalPathway, CLINICAL_PATHWAYS, type PathwayId } from "./clinical-pathways";
import { getSimulation, SIMULATION_CATALOG, type SimulationDefinition, type SimulationProfession, type SimulationDifficulty } from "./simulation-catalog";
import type { ScoringEvent } from "./monitor-engine";
import type { PhysiologySnapshot } from "./physiology-state";

// ─── Validation types ─────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ComposerOutput {
  simulation: Omit<SimulationDefinition, "id">;
  validationResult: ValidationResult;
}

// ─── Composer inputs ──────────────────────────────────────────────────────────

export interface SimulationComposerInput {
  title: string;
  profession: SimulationProfession[];
  conditionKey: string;
  pathwayId: PathwayId;
  difficulty: SimulationDifficulty;
  estimatedMinutes?: number;
  openingStage?: "early" | "developing" | "severe";
  patientBrief?: string;
  customLearningObjectives?: string[];
  includeDefaultObjectives?: boolean;
  showInterventions?: boolean;
  defaultOverlay?: boolean;
}

// ─── Main composer ────────────────────────────────────────────────────────────

export function composeSimulation(input: SimulationComposerInput): ComposerOutput {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate condition key
  const pattern = getDeteriorationPattern(input.conditionKey);
  if (!pattern) {
    errors.push(`Condition key "${input.conditionKey}" not found in deterioration-patterns.ts.`);
    errors.push(`Available keys: ${DETERIORATION_PATTERNS.map((p) => p.key).join(", ")}`);
  }

  // Validate pathway
  const pathway = getClinicalPathway(input.pathwayId);
  if (!pathway) {
    errors.push(`Pathway "${input.pathwayId}" not found in clinical-pathways.ts.`);
  }

  // Warn if condition is not in pathway's conditionKeys
  if (pathway && !pathway.conditionKeys.includes(input.conditionKey)) {
    warnings.push(`Condition "${input.conditionKey}" is not listed in pathway "${input.pathwayId}".conditionKeys. Consider adding it.`);
  }

  // Build learning objectives from pathway
  const defaultObjectives: string[] = pathway
    ? [
        `Recognise ${pattern?.label ?? input.conditionKey} through vital sign trends and ECG changes`,
        `Apply the evidence-based treatment bundle from the ${pathway.name} pathway`,
        `Escalate appropriately within the expected time window`,
        `Reassess and document patient response to interventions`,
      ]
    : [];

  const learningObjectives = input.includeDefaultObjectives !== false
    ? [...defaultObjectives, ...(input.customLearningObjectives ?? [])]
    : (input.customLearningObjectives ?? defaultObjectives);

  // Build critical actions from pathway stage data
  const criticalActions: SimulationDefinition["criticalActions"] = [];
  if (pathway && pattern) {
    const stageDef = pattern.stages[input.openingStage ?? "early"];
    const pathwayStage = pathway.stages[input.openingStage ?? "early"];

    let tickOffset = 0;
    for (const intKey of pathwayStage.optimalInterventions.slice(0, 3)) {
      const intervention = getIntervention(intKey);
      if (!intervention) {
        warnings.push(`Intervention key "${intKey}" from pathway not found in intervention-catalog.ts.`);
        continue;
      }
      criticalActions.push({
        timeLimitTicks: tickOffset + pathwayStage.harmIfMissedTicks,
        description: `Apply ${intervention.label}`,
        interventionKey: intKey,
        isHarmIfMissed: pathwayStage.harmIfMissedTicks <= 3,
      });
      tickOffset += 2;
    }
  }

  // Build documentation prompts from pathway
  const documentationPrompts: string[] = pathway
    ? pathway.documentationPrompts
        .filter((p) => p.required)
        .map((p) => p.prompt)
    : [];

  // Build NGN formats from pathway cue sets
  const ngnFormats: SimulationDefinition["ngnFormats"] = pathway
    ? pathway.ngnCueSets.map((cs) => cs.format)
    : ["sata", "bowtie"];

  // Build SBAR from pattern
  const sbar: SimulationDefinition["sbar"] = {
    situation: pattern
      ? `${pattern.description.slice(0, 120)}`
      : "Patient presenting with acute deterioration.",
    background: `Previous medical history relevant to ${pattern?.label ?? input.conditionKey}.`,
    assessment: pathway
      ? pathway.stages[input.openingStage ?? "early"].recognitionCues.join(", ")
      : "Assessment pending.",
    recommendation: pathway
      ? pathway.stages[input.openingStage ?? "early"].optimalInterventions.join(", ").replace(/_/g, " ")
      : "Initiate appropriate management.",
  };

  const simulation: Omit<SimulationDefinition, "id"> = {
    title: input.title,
    profession: input.profession,
    specialty: pattern?.tags ?? [],
    conditionKey: input.conditionKey,
    pathwayId: input.pathwayId,
    difficulty: input.difficulty,
    estimatedMinutes: input.estimatedMinutes ?? 20,
    monitorMode: input.profession.includes("RT") ? "rt" : input.profession.includes("NP") ? "np" : "general",
    openingStage: input.openingStage,
    defaultOverlay: input.defaultOverlay ?? false,
    showInterventions: input.showInterventions ?? true,
    patientBrief: input.patientBrief ?? `Patient presenting with ${pattern?.label ?? input.conditionKey}.`,
    sbar,
    learningObjectives,
    criticalActions,
    documentationPrompts,
    ngnFormats,
    primaryNcjmmDomains: ["recognize_cues", "take_action"],
    tags: pattern?.tags ?? [],
  };

  return {
    simulation,
    validationResult: { valid: errors.length === 0, errors, warnings },
  };
}

// ─── Condition registry validator ─────────────────────────────────────────────

export function validateConditionKey(key: string): ValidationResult {
  const pattern = getDeteriorationPattern(key);
  if (!pattern) {
    return {
      valid: false,
      errors: [`Condition key "${key}" not found.`],
      warnings: [],
    };
  }

  const warnings: string[] = [];
  const stages = ["early", "developing", "severe", "critical"] as const;

  for (const stage of stages) {
    const stageDef = pattern.stages[stage];
    for (const intKey of Object.keys(stageDef.vitalDeltas)) {
      // Vital deltas don't need validation against catalog, just sanity
      if (typeof stageDef.vitalDeltas[intKey as keyof typeof stageDef.vitalDeltas] !== "number") {
        warnings.push(`Stage "${stage}" vitalDelta for "${intKey}" is not a number.`);
      }
    }
  }

  return { valid: true, errors: [], warnings };
}

// ─── Intervention bundle validator ────────────────────────────────────────────

export function validateInterventionBundle(keys: string[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const key of keys) {
    const intervention = getIntervention(key);
    if (!intervention) {
      errors.push(`Intervention key "${key}" not found in intervention-catalog.ts.`);
    }
  }

  if (keys.length > 6) {
    warnings.push("More than 6 interventions in a bundle may overwhelm learners — consider splitting into stages.");
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ─── NGN cue builder ─────────────────────────────────────────────────────────

export interface GeneratedNgnCueSet {
  format: "bowtie" | "sata" | "matrix" | "prioritization" | "cloze";
  stem: string;
  correctCues: string[];
  distractors: string[];
}

export function generateNgnCueSets(conditionKey: string, pathwayId: PathwayId): GeneratedNgnCueSet[] {
  const pathway = getClinicalPathway(pathwayId);
  const pattern = getDeteriorationPattern(conditionKey);

  if (!pathway || !pattern) return [];

  // Pull from pathway's pre-authored cue sets
  const pathwayCueSets = pathway.ngnCueSets.map((cs) => ({
    format: cs.format,
    stem: cs.stemTemplate
      .replace("{conditionLabel}", pattern.label)
      .replace("{stage}", "early")
      .replace("{vital}", "vital signs"),
    correctCues: cs.correctCues,
    distractors: cs.distractors,
  }));

  // Add a generic SATA from stage recognition cues
  const earlyCues = pathway.stages.early.recognitionCues;
  const criticalCues = pathway.stages.critical.recognitionCues;

  pathwayCueSets.push({
    format: "sata",
    stem: `Which findings in a patient with ${pattern.label} require IMMEDIATE escalation?`,
    correctCues: criticalCues.slice(0, 4),
    distractors: earlyCues.slice(0, 2),
  });

  return pathwayCueSets;
}

// ─── Documentation prompt builder ────────────────────────────────────────────

export function generateDocumentationPrompts(pathwayId: PathwayId): string[] {
  const pathway = getClinicalPathway(pathwayId);
  if (!pathway) return [];
  return pathway.documentationPrompts.map((p) => p.prompt);
}

// ─── Replay timeline validator ────────────────────────────────────────────────

export interface TimelineValidationResult extends ValidationResult {
  eventCount: number;
  hasRecognitionEvent: boolean;
  hasInterventionEvent: boolean;
  firstInterventionTimeSec: number | null;
  lastTickCovered: number;
}

export function validateReplayTimeline(
  history: PhysiologySnapshot[],
  events: ScoringEvent[],
  conditionKey: string,
): TimelineValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (history.length === 0) errors.push("History is empty — no snapshots recorded.");
  if (history.length < 3) warnings.push("History is very short (< 3 ticks) — limited replay data.");

  const recognitionEvents = events.filter((e) => e.type === "recognition");
  const interventionEvents = events.filter((e) => e.type === "intervention");

  if (recognitionEvents.length === 0) warnings.push("No recognition events recorded.");
  if (interventionEvents.length === 0) warnings.push("No intervention events recorded.");

  // Validate event ticks are within history range
  const maxTick = history[history.length - 1]?.tick ?? 0;
  for (const event of events) {
    if (event.tick > maxTick + 1) {
      errors.push(`Event at tick ${event.tick} is beyond history range (max ${maxTick}).`);
    }
  }

  // Validate condition key
  if (!getDeteriorationPattern(conditionKey)) {
    errors.push(`Condition key "${conditionKey}" not found — replay may be incomplete.`);
  }

  const firstInt = interventionEvents[0];

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    eventCount: events.length,
    hasRecognitionEvent: recognitionEvents.length > 0,
    hasInterventionEvent: interventionEvents.length > 0,
    firstInterventionTimeSec: firstInt ? firstInt.simSeconds : null,
    lastTickCovered: maxTick,
  };
}

// ─── Simulation gap analysis ──────────────────────────────────────────────────

export interface SimulationGapReport {
  totalAvailable: number;
  totalForProfession: Record<SimulationProfession, number>;
  conditionsWithoutSimulation: string[];
  duplicateConditionSims: Array<{ conditionKey: string; count: number }>;
  recommendations: string[];
}

export function analyseSimulationGaps(profession?: SimulationProfession): SimulationGapReport {
  const all = SIMULATION_CATALOG;
  const conditions = DETERIORATION_PATTERNS.map((p) => p.key);

  const professions: SimulationProfession[] = ["RN", "RPN", "NP", "RT", "NEW_GRAD"];
  const totalForProfession = Object.fromEntries(
    professions.map((p) => [p, all.filter((s) => s.profession.includes(p)).length]),
  ) as Record<SimulationProfession, number>;

  const conditionsWithSim = new Set(all.map((s) => s.conditionKey));
  const conditionsWithoutSimulation = conditions.filter((c) => !conditionsWithSim.has(c));

  const conditionCount = conditions.reduce<Record<string, number>>((acc, c) => {
    acc[c] = all.filter((s) => s.conditionKey === c).length;
    return acc;
  }, {});

  const duplicateConditionSims = Object.entries(conditionCount)
    .filter(([, count]) => count > 3)
    .map(([conditionKey, count]) => ({ conditionKey, count }));

  const recommendations: string[] = [];
  if (conditionsWithoutSimulation.length > 0) {
    recommendations.push(`Add simulations for: ${conditionsWithoutSimulation.slice(0, 5).join(", ")}`);
  }
  if (totalForProfession.RPN < 6) {
    recommendations.push("Add more RPN-specific simulations (< 6 currently).");
  }
  if (totalForProfession.RT < 6) {
    recommendations.push("Add more RT-specific simulations (< 6 currently).");
  }
  if (totalForProfession.NEW_GRAD < 6) {
    recommendations.push("Add more New Grad simulations (< 6 currently).");
  }

  return {
    totalAvailable: all.length,
    totalForProfession,
    conditionsWithoutSimulation,
    duplicateConditionSims,
    recommendations,
  };
}

// ─── Quick-export helper ──────────────────────────────────────────────────────

export function exportSimulationAsJson(id: string): string {
  const sim = getSimulation(id);
  if (!sim) throw new Error(`Simulation "${id}" not found.`);
  return JSON.stringify(sim, null, 2);
}
