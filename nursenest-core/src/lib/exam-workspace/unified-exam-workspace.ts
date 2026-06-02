export const UNIFIED_EXAM_WORKSPACE_ATTR = "data-nn-unified-exam-workspace" as const;
export const UNIFIED_EXAM_WORKSPACE_MODE_ATTR = "data-nn-exam-workspace-mode" as const;
/** Soft gradient canvas + white card surfaces (flashcards, practice, CAT, qbank). */
export const LEARNER_EXAM_LAYOUT_REFINEMENT_ATTR = "data-nn-learner-exam-layout-refinement" as const;

export function learnerExamLayoutRefinementProps(): Record<
  typeof LEARNER_EXAM_LAYOUT_REFINEMENT_ATTR,
  ""
> {
  return { [LEARNER_EXAM_LAYOUT_REFINEMENT_ATTR]: "" };
}
export const CANONICAL_LEARNER_SURFACE_ATTR = "data-nn-canonical-learner-surface" as const;
export const CANONICAL_LEARNER_SURFACE_VERSION = "flashcards-v1" as const;

export const UNIFIED_EXAM_WORKSPACE_MODES = [
  "practice",
  "cat",
  "flashcards",
  "review",
  "readiness",
  "learning",
  "practice-exam",
  "loft",
  "simulation",
  "si-conversation",
  "ngn-case-study",
  "remediation",
] as const;

export type UnifiedExamWorkspaceMode = (typeof UNIFIED_EXAM_WORKSPACE_MODES)[number];

export const CANONICAL_LEARNER_SURFACE_PROGRAMS = [
  "RN",
  "RPN",
  "LPN",
  "New Grad Nurse",
  "NCLEX-RN",
  "NCLEX-PN",
  "NGN Prep",
  "FNP",
  "AGNP",
  "PMHNP",
  "PNP",
  "WHNP",
  "ECG",
  "Paramedic",
  "Respiratory Therapy",
  "Pharmacy Tech",
  "Medical Assistant",
  "HESI",
  "TEAS",
  "PSW/CNA",
  "Healthcare Foundations",
] as const;

export const CANONICAL_LEARNER_SURFACE_INTERACTIONS = [
  "mcq",
  "sata",
  "matrix-grid",
  "bow-tie",
  "ordered-response",
  "highlight",
  "hotspot",
  "trend",
  "cloze",
  "drag-and-drop",
  "ngn-case-study",
  "standalone-interactive",
  "si-conversation",
  "simulation",
] as const;

export type CanonicalLearnerSurfaceProgram =
  (typeof CANONICAL_LEARNER_SURFACE_PROGRAMS)[number];
export type CanonicalLearnerSurfaceInteraction =
  (typeof CANONICAL_LEARNER_SURFACE_INTERACTIONS)[number];

export type UnifiedExamWorkspacePhase =
  | "loading"
  | "answering"
  | "submitted"
  | "reviewing"
  | "paused"
  | "completed"
  | "error";

export type UnifiedExamRationaleState =
  | "locked"
  | "available"
  | "hidden"
  | "review";

export type UnifiedExamWorkspaceNavigation = {
  canGoPrevious: boolean;
  canGoNext: boolean;
  canSubmit: boolean;
  canFinish: boolean;
  canPause: boolean;
};

export function normalizeUnifiedExamWorkspaceMode(
  mode: string | null | undefined,
): UnifiedExamWorkspaceMode {
  return UNIFIED_EXAM_WORKSPACE_MODES.includes(mode as UnifiedExamWorkspaceMode)
    ? (mode as UnifiedExamWorkspaceMode)
    : "practice";
}

export function deriveUnifiedExamRationaleState(args: {
  mode: UnifiedExamWorkspaceMode;
  answered: boolean;
  submitted: boolean;
  visible?: boolean;
}): UnifiedExamRationaleState {
  if (args.mode === "cat" && !args.submitted) return "locked";
  if (!args.answered && !args.submitted) return "locked";
  if (args.visible === false) return "hidden";
  return args.submitted || args.answered ? "available" : "locked";
}
