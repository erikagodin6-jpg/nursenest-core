/**
 * Client-side UI phases for CAT **exam / test** mode (not study mode).
 * Server scoring + advance remains a single `cat_advance` PATCH; this models explicit
 * submit → lock → advance UX and in-flight guards.
 *
 * `completed` is set only while the runner is still mounted and the server has returned
 * `catCompleted` (brief handoff before results layout replaces the question shell).
 *
 * Next vs finish is **never** inferred from `idx` / `total` on the client. After each
 * successful `cat_advance`, branch strictly on `catAdvanced` | `catCompleted` | `catStudyReveal`.
 */
export type CatExamUiPhase = "answering" | "submitted_locked" | "advancing" | "completed";

/** Legal explicit transitions (excluding no-op `from === to`). */
const LEGAL_CAT_EXAM_UI_TRANSITIONS: Record<CatExamUiPhase, readonly CatExamUiPhase[]> = {
  answering: ["submitted_locked"],
  submitted_locked: ["advancing", "answering"],
  advancing: ["answering", "completed", "submitted_locked"],
  completed: [],
};

export class CatExamIllegalPhaseTransitionError extends Error {
  readonly phase_from: CatExamUiPhase;
  readonly phase_to: CatExamUiPhase;

  constructor(from: CatExamUiPhase, to: CatExamUiPhase) {
    super(`Illegal CAT exam UI phase transition: ${from} → ${to}`);
    this.name = "CatExamIllegalPhaseTransitionError";
    this.phase_from = from;
    this.phase_to = to;
  }
}

/**
 * Enforces the FSM. Call only when `from !== to`.
 * @throws CatExamIllegalPhaseTransitionError when the edge is not allowed.
 */
export function assertCatExamPhaseTransition(from: CatExamUiPhase, to: CatExamUiPhase): void {
  if (from === to) return;
  const allowed = LEGAL_CAT_EXAM_UI_TRANSITIONS[from];
  if (!allowed.includes(to)) {
    throw new CatExamIllegalPhaseTransitionError(from, to);
  }
}

export function catExamOptionsInteractionLocked(phase: CatExamUiPhase): boolean {
  return phase !== "answering";
}

export function catExamCanChangeAnswer(phase: CatExamUiPhase): boolean {
  return phase === "answering";
}

export function catExamCanLockAnswer(phase: CatExamUiPhase, hasMeaningfulAnswer: boolean): boolean {
  return phase === "answering" && hasMeaningfulAnswer;
}

/** Only from submitted_locked may the client call `cat_advance` in exam mode. */
export function catExamCanRequestCatAdvance(phase: CatExamUiPhase): boolean {
  return phase === "submitted_locked";
}

export function catExamFooterPrimaryBusy(phase: CatExamUiPhase, controlsBusy: boolean): boolean {
  return controlsBusy || phase === "advancing" || phase === "completed";
}

/** True if a PATCH response should be ignored (navigation, item change, or unmount). */
export function catExamCatAdvanceResponseIsStale(args: {
  advanceIdx: number;
  advanceQuestionId: string;
  currentIdx: number;
  currentQuestionId: string | undefined;
}): boolean {
  if (args.currentIdx !== args.advanceIdx) return true;
  if (!args.currentQuestionId || args.currentQuestionId !== args.advanceQuestionId) return true;
  return false;
}
