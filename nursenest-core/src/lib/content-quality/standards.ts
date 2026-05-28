/** Word-count targets for published premium content (validation / reporting — not padding). */

export const RATIONALE_MIN_WORDS = 120;
export const RATIONALE_STRONG_MIN_WORDS = 160;
export const RATIONALE_PREFERRED_MAX_WORDS = 300;

export const LESSON_MIN_WORDS = 500;
export const LESSON_STRONG_MIN_WORDS = 700;
export const LESSON_PREFERRED_MAX_WORDS = 1400;

export type ContentQualityTier = "missing" | "thin" | "acceptable" | "strong";

export type ActivityDepthTrack =
  | "foundational_lesson"
  | "ecg_foundational"
  | "ecg_advanced"
  | "clinical_scenario_foundational"
  | "clinical_scenario_rn_advanced"
  | "clinical_scenario_np_advanced"
  | "clinical_skill"
  | "med_calc_foundational"
  | "med_calc_timed"
  | "med_calc_advanced_safety"
  | "labs_workstation"
  | "flashcard_deck"
  | "prioritization_delegation"
  | "np_case_management";

export type ActivityDepthStandard = {
  track: ActivityDepthTrack;
  label: string;
  minimumInteractions: number;
  idealInteractions: number;
  minimumQuestions: number;
  idealQuestions: number;
  minimumFlashcards: number;
  idealFlashcards: number;
  minimumRationaleWords: number;
  minimumRemediationPrompts: number;
  minimumBranchingPoints: number;
  requiredElements: readonly string[];
  tierNotes: string;
};

export const ACTIVITY_DEPTH_STANDARDS: Record<ActivityDepthTrack, ActivityDepthStandard> = {
  foundational_lesson: {
    track: "foundational_lesson",
    label: "Foundational lesson",
    minimumInteractions: 10,
    idealInteractions: 18,
    minimumQuestions: 10,
    idealQuestions: 20,
    minimumFlashcards: 10,
    idealFlashcards: 24,
    minimumRationaleWords: RATIONALE_MIN_WORDS,
    minimumRemediationPrompts: 3,
    minimumBranchingPoints: 0,
    requiredElements: ["retrieval checks", "rationales", "misconception repair", "clinical transfer", "confidence calibration"],
    tierNotes: "Use guided progression and bedside transfer prompts without advanced specialty assumptions.",
  },
  ecg_foundational: {
    track: "ecg_foundational",
    label: "Foundational ECG rhythm",
    minimumInteractions: 15,
    idealInteractions: 25,
    minimumQuestions: 15,
    idealQuestions: 25,
    minimumFlashcards: 12,
    idealFlashcards: 30,
    minimumRationaleWords: RATIONALE_MIN_WORDS,
    minimumRemediationPrompts: 4,
    minimumBranchingPoints: 1,
    requiredElements: ["waveform identification", "interval measurement", "static strip", "moving strip", "bedside escalation"],
    tierNotes: "Keep rhythm recognition entry-level unless the learner selects advanced ECG.",
  },
  ecg_advanced: {
    track: "ecg_advanced",
    label: "Advanced ECG rhythm",
    minimumInteractions: 25,
    idealInteractions: 40,
    minimumQuestions: 25,
    idealQuestions: 40,
    minimumFlashcards: 20,
    idealFlashcards: 40,
    minimumRationaleWords: RATIONALE_STRONG_MIN_WORDS,
    minimumRemediationPrompts: 6,
    minimumBranchingPoints: 4,
    requiredElements: ["pause-and-measure", "waveform annotation", "telemetry progression", "ACLS decision logic", "deterioration path"],
    tierNotes: "Appropriate for advanced RN/new-grad ICU/ACLS-adjacent learning, not foundational RN prep.",
  },
  clinical_scenario_foundational: {
    track: "clinical_scenario_foundational",
    label: "Foundational clinical scenario",
    minimumInteractions: 8,
    idealInteractions: 15,
    minimumQuestions: 8,
    idealQuestions: 18,
    minimumFlashcards: 10,
    idealFlashcards: 20,
    minimumRationaleWords: RATIONALE_MIN_WORDS,
    minimumRemediationPrompts: 3,
    minimumBranchingPoints: 2,
    requiredElements: ["evolving vitals", "priority decision", "reassessment", "rationale review", "safety cue"],
    tierNotes: "Scenario must evolve; no static case cards.",
  },
  clinical_scenario_rn_advanced: {
    track: "clinical_scenario_rn_advanced",
    label: "Advanced RN scenario",
    minimumInteractions: 15,
    idealInteractions: 30,
    minimumQuestions: 15,
    idealQuestions: 30,
    minimumFlashcards: 14,
    idealFlashcards: 32,
    minimumRationaleWords: RATIONALE_STRONG_MIN_WORDS,
    minimumRemediationPrompts: 5,
    minimumBranchingPoints: 5,
    requiredElements: ["delegation", "escalation", "competing priorities", "deterioration", "outcome change"],
    tierNotes: "High-cognitive-load but nursing-focused; difficulty must not become provider-only decision-making.",
  },
  clinical_scenario_np_advanced: {
    track: "clinical_scenario_np_advanced",
    label: "Advanced NP scenario",
    minimumInteractions: 20,
    idealInteractions: 45,
    minimumQuestions: 20,
    idealQuestions: 50,
    minimumFlashcards: 18,
    idealFlashcards: 40,
    minimumRationaleWords: RATIONALE_STRONG_MIN_WORDS,
    minimumRemediationPrompts: 6,
    minimumBranchingPoints: 8,
    requiredElements: ["differential diagnosis", "diagnostics", "management planning", "follow-up", "prescribing safety"],
    tierNotes: "Highest complexity; include longitudinal reasoning and systems-level integration.",
  },
  clinical_skill: {
    track: "clinical_skill",
    label: "Clinical skill",
    minimumInteractions: 10,
    idealInteractions: 24,
    minimumQuestions: 10,
    idealQuestions: 24,
    minimumFlashcards: 10,
    idealFlashcards: 24,
    minimumRationaleWords: RATIONALE_MIN_WORDS,
    minimumRemediationPrompts: 4,
    minimumBranchingPoints: 2,
    requiredElements: ["sequencing", "safety checkpoint", "communication", "documentation", "what went wrong"],
    tierNotes: "No passive skills pages; every skill should feel competency-based.",
  },
  med_calc_foundational: {
    track: "med_calc_foundational",
    label: "Medication calculation drill",
    minimumInteractions: 10,
    idealInteractions: 20,
    minimumQuestions: 10,
    idealQuestions: 20,
    minimumFlashcards: 8,
    idealFlashcards: 18,
    minimumRationaleWords: 90,
    minimumRemediationPrompts: 3,
    minimumBranchingPoints: 0,
    requiredElements: ["unit conversion", "dose safety", "rationale", "setup method", "error trap"],
    tierNotes: "Prioritize safety logic and calculation setup over rote answer checking.",
  },
  med_calc_timed: {
    track: "med_calc_timed",
    label: "Timed medication calculation drill",
    minimumInteractions: 20,
    idealInteractions: 35,
    minimumQuestions: 20,
    idealQuestions: 35,
    minimumFlashcards: 10,
    idealFlashcards: 25,
    minimumRationaleWords: 90,
    minimumRemediationPrompts: 4,
    minimumBranchingPoints: 0,
    requiredElements: ["timing", "unit conversion", "safety range", "confidence check", "mistake replay"],
    tierNotes: "Timed mode should still teach after answers; speed is never the only goal.",
  },
  med_calc_advanced_safety: {
    track: "med_calc_advanced_safety",
    label: "Advanced medication safety drill",
    minimumInteractions: 25,
    idealInteractions: 45,
    minimumQuestions: 25,
    idealQuestions: 45,
    minimumFlashcards: 16,
    idealFlashcards: 35,
    minimumRationaleWords: RATIONALE_MIN_WORDS,
    minimumRemediationPrompts: 5,
    minimumBranchingPoints: 2,
    requiredElements: ["high-alert medication", "hold parameter", "contraindication", "double-check", "escalation"],
    tierNotes: "Use high-alert safety reasoning without teaching unsafe titration outside scope.",
  },
  labs_workstation: {
    track: "labs_workstation",
    label: "Labs workstation lesson",
    minimumInteractions: 12,
    idealInteractions: 25,
    minimumQuestions: 12,
    idealQuestions: 30,
    minimumFlashcards: 10,
    idealFlashcards: 28,
    minimumRationaleWords: RATIONALE_MIN_WORDS,
    minimumRemediationPrompts: 4,
    minimumBranchingPoints: 3,
    requiredElements: ["trend interpretation", "escalation", "medication implication", "pattern recognition", "deterioration cue"],
    tierNotes: "Tie every lab to bedside meaning, not isolated reference-range memorization.",
  },
  flashcard_deck: {
    track: "flashcard_deck",
    label: "Flashcard deck",
    minimumInteractions: 10,
    idealInteractions: 30,
    minimumQuestions: 10,
    idealQuestions: 30,
    minimumFlashcards: 10,
    idealFlashcards: 40,
    minimumRationaleWords: 70,
    minimumRemediationPrompts: 2,
    minimumBranchingPoints: 0,
    requiredElements: ["active recall", "rationale", "weak-area tag", "spaced repetition", "transfer prompt"],
    tierNotes: "Avoid definition-only cards; cards should reinforce clinical transfer and safety.",
  },
  prioritization_delegation: {
    track: "prioritization_delegation",
    label: "Prioritization & delegation activity",
    minimumInteractions: 15,
    idealInteractions: 30,
    minimumQuestions: 15,
    idealQuestions: 30,
    minimumFlashcards: 12,
    idealFlashcards: 28,
    minimumRationaleWords: RATIONALE_STRONG_MIN_WORDS,
    minimumRemediationPrompts: 5,
    minimumBranchingPoints: 5,
    requiredElements: ["patient ranking", "delegation sorting", "escalation event", "reassessment prompt", "retention flashcards"],
    tierNotes: "Must feel like an unfolding assignment, not a static priority quiz.",
  },
  np_case_management: {
    track: "np_case_management",
    label: "NP case management activity",
    minimumInteractions: 20,
    idealInteractions: 45,
    minimumQuestions: 20,
    idealQuestions: 50,
    minimumFlashcards: 18,
    idealFlashcards: 40,
    minimumRationaleWords: RATIONALE_STRONG_MIN_WORDS,
    minimumRemediationPrompts: 6,
    minimumBranchingPoints: 8,
    requiredElements: ["diagnostic uncertainty", "test selection", "treatment plan", "safety net", "follow-up adjustment"],
    tierNotes: "Should model advanced practice accountability and longitudinal management.",
  },
} as const;

export const ACTIVITY_DEPTH_REQUIRED_QUESTION_TYPES = [
  "multiple choice",
  "SATA",
  "matrix/grid",
  "prioritization ranking",
  "drag-and-drop sequencing",
  "delegation sorting",
  "hotspot",
  "next best action",
  "confidence scoring",
  "branching decision",
] as const;

export const ACTIVITY_DEPTH_GLOBAL_REQUIRED_ELEMENTS = [
  "active recall",
  "rationale reveal",
  "confidence calibration",
  "remediation recommendation",
  "transfer/application prompt",
  "retention checkpoint",
] as const;
