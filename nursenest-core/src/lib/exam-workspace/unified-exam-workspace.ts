export const UNIFIED_EXAM_WORKSPACE_ATTR = "data-nn-unified-exam-workspace" as const;
export const UNIFIED_EXAM_WORKSPACE_MODE_ATTR = "data-nn-exam-workspace-mode" as const;

export const UNIFIED_EXAM_WORKSPACE_MODES = [
  "practice",
  "cat",
  "flashcards",
  "review",
  "readiness",
  "learning",
] as const;

export type UnifiedExamWorkspaceMode = (typeof UNIFIED_EXAM_WORKSPACE_MODES)[number];

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
