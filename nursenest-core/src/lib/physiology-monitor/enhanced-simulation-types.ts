/**
 * Enhanced Simulation Types — Phase 2
 *
 * Extends the base SimulationDefinition with richer educational scaffolding:
 *   - Key lab values with clinical interpretation
 *   - Imaging findings
 *   - Branching decision points (correct vs incorrect pathways)
 *   - Post-simulation debrief points
 *   - Evidence-based clinical references
 *   - Longitudinal phase structure for multi-phase cases
 *
 * Quality target: UWorld Clinical Cases + NCLEX NGN + Academic Teaching Hospital Orientation
 */

import type { SimulationDefinition, SimulationProfession, SimulationDifficulty, NgnQuestionFormat } from "./simulation-catalog";
import type { MonitorMode } from "./physiology-state";

// ─── Enhanced types ───────────────────────────────────────────────────────────

export interface KeyLab {
  test: string;
  result: string;
  /** Clinical interpretation of this specific result in context. */
  interpretation: string;
}

export interface ImagingFinding {
  modality: "CXR" | "CT" | "MRI" | "Echo" | "Ultrasound" | "PFT" | "EEG" | "ECG" | "ABG" | "Other";
  finding: string;
  clinical_significance: string;
}

export interface DecisionPoint {
  step: number;
  situation: string;
  /** The evidence-based correct action. */
  correctAction: string;
  /** Why the correct action is correct. */
  correctRationale: string;
  /** A plausible but incorrect alternative action. */
  incorrectAction: string;
  /** What happens if the incorrect action is taken. */
  incorrectConsequence: string;
}

export interface LongitudinalPhase {
  phaseLabel: string;
  /** Clinical time frame (e.g. "Hours 0–4", "Day 2", "Discharge day") */
  timeframe: string;
  patientStatus: string;
  keyObjective: string;
  /** How the monitor changes in this phase. */
  monitorChanges: string;
}

export interface EnhancedSimulationDefinition {
  // ── Base fields (mirrors SimulationDefinition) ───────────────────────
  id: string;
  title: string;
  profession: SimulationProfession[];
  specialty: string[];
  conditionKey: string;
  pathwayId: string;
  difficulty: SimulationDifficulty;
  estimatedMinutes: number;
  monitorMode: MonitorMode;
  openingStage?: "early" | "developing" | "severe";
  defaultOverlay: boolean;
  showInterventions: boolean;
  patientBrief: string;
  sbar: { situation: string; background: string; assessment: string; recommendation: string };
  learningObjectives: string[];
  criticalActions: Array<{
    timeLimitTicks: number;
    description: string;
    interventionKey: string | null;
    isHarmIfMissed: boolean;
  }>;
  documentationPrompts: string[];
  ngnFormats: NgnQuestionFormat[];
  primaryNcjmmDomains: string[];
  tags: string[];

  // ── Enhanced fields ──────────────────────────────────────────────────
  /** Whether this is a single-episode or longitudinal multi-phase case. */
  caseStructure: "single" | "longitudinal";
  /** Key laboratory values relevant to this scenario. */
  keyLabs: KeyLab[];
  /** Imaging or diagnostic findings (optional). */
  imagingFindings?: ImagingFinding[];
  /** Branching clinical decision points with correct and incorrect pathways. */
  decisionPoints: DecisionPoint[];
  /** Key teaching points for post-simulation debrief. */
  debriefPoints: string[];
  /** Evidence-based clinical references (guideline + year). */
  clinicalReferences: string[];
  /** For longitudinal cases: the phases of the patient journey. */
  phases?: LongitudinalPhase[];
}

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getEnhancedSimulation(catalog: EnhancedSimulationDefinition[], id: string): EnhancedSimulationDefinition | null {
  return catalog.find((s) => s.id === id) ?? null;
}

export function getEnhancedByProfession(catalog: EnhancedSimulationDefinition[], profession: SimulationProfession): EnhancedSimulationDefinition[] {
  return catalog.filter((s) => s.profession.includes(profession));
}

export function getLongitudinalSimulations(catalog: EnhancedSimulationDefinition[]): EnhancedSimulationDefinition[] {
  return catalog.filter((s) => s.caseStructure === "longitudinal");
}
