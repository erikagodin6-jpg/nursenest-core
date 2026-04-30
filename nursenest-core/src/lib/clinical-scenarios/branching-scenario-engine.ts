import type { PatientTrajectory } from "@/lib/clinical-scenarios/clinical-scenario-trajectory";
import { patientTrajectoryFromConsequence } from "@/lib/clinical-scenarios/clinical-scenario-trajectory";

export type ConsequenceTrajectory = "improves" | "unchanged" | "deteriorates";
export type ConsequenceEffect = "unlock" | "limit" | "escalate" | "delay";

export type ParsedBranchingOption = {
  id: string;
  label: string;
  isCorrect: boolean;
  rationale: string;
  trajectory: ConsequenceTrajectory;
  effect: ConsequenceEffect;
  /** Next stage `orderIndex`; defaults to linear +1 when absent. */
  nextStageOrder: number | null;
};

export type BranchingStageView = {
  id: string;
  orderIndex: number;
  scenarioText: string;
  vitals: unknown;
  assessmentFindings: string;
  labUpdates: unknown | null;
  questionStem: string;
  optionsJson: unknown;
  correctOptionId: string;
  rationale: string;
  whyWrongByOptionId: unknown;
  clinicalJudgmentFocus: string;
  consequencesByOptionId: unknown;
  nextStageOrder: number | null;
};

export type BranchingEngineState = {
  currentOrderIndex: number;
  /** Per-stage orderIndex → option ids hidden for that stage (e.g. best option removed). */
  hiddenOptionIdsByStageOrder: Record<number, Set<string>>;
  trajectoryPath: PatientTrajectory[];
  /** Option rationales the learner saw at each committed step. */
  rationaleTrail: string[];
  incorrectCount: number;
};

export function initialBranchingEngineState(startOrderIndex = 0): BranchingEngineState {
  return {
    currentOrderIndex: startOrderIndex,
    hiddenOptionIdsByStageOrder: {},
    trajectoryPath: [],
    rationaleTrail: [],
    incorrectCount: 0,
  };
}

function trajectoryToConsequenceString(t: ConsequenceTrajectory): string {
  switch (t) {
    case "improves":
      return "patient improves";
    case "deteriorates":
      return "patient deteriorates";
    default:
      return "unchanged";
  }
}

export function parseBranchingOptions(raw: unknown): ParsedBranchingOption[] {
  if (!Array.isArray(raw)) return [];
  const out: ParsedBranchingOption[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    const id = typeof o.id === "string" ? o.id : "";
    const label =
      typeof o.label === "string" && o.label.trim()
        ? o.label
        : typeof o.text === "string" && o.text.trim()
          ? o.text
          : "";
    if (!id || !label) continue;
    const isCorrect = o.isCorrect === true;
    const rationale = typeof o.rationale === "string" ? o.rationale : "";
    const cons = o.consequence && typeof o.consequence === "object" ? (o.consequence as Record<string, unknown>) : {};
    const trajectoryRaw = typeof cons.trajectory === "string" ? cons.trajectory : "unchanged";
    const trajectory: ConsequenceTrajectory =
      trajectoryRaw === "improves" || trajectoryRaw === "deteriorates" || trajectoryRaw === "unchanged"
        ? trajectoryRaw
        : "unchanged";
    const effectRaw = typeof cons.effect === "string" ? cons.effect : "";
    const effect: ConsequenceEffect =
      effectRaw === "unlock" || effectRaw === "limit" || effectRaw === "escalate" || effectRaw === "delay"
        ? effectRaw
        : isCorrect
          ? "unlock"
          : trajectory === "deteriorates"
            ? "limit"
            : "delay";
    const nextStageOrder =
      typeof o.nextStageOrder === "number" && Number.isFinite(o.nextStageOrder)
        ? Math.floor(o.nextStageOrder)
        : typeof o.nextStageId === "string" && /^\d+$/.test(o.nextStageId)
          ? Number.parseInt(o.nextStageId, 10)
          : null;
    out.push({ id, label, isCorrect, rationale, trajectory, effect, nextStageOrder });
  }
  return out;
}

/** True when options carry structured branching fields (rationale / consequence / isCorrect). */
export function optionsJsonUsesBranchingEngine(raw: unknown): boolean {
  if (!Array.isArray(raw)) return false;
  return raw.some((row) => {
    if (!row || typeof row !== "object") return false;
    const o = row as Record<string, unknown>;
    return (
      typeof o.rationale === "string" ||
      (o.consequence && typeof o.consequence === "object") ||
      o.isCorrect === true ||
      o.isCorrect === false
    );
  });
}

export function stageHasBranchingOptions(stage: BranchingStageView | undefined): boolean {
  if (!stage) return false;
  return optionsJsonUsesBranchingEngine(stage.optionsJson);
}

function ensureHiddenSet(map: Record<number, Set<string>>, order: number): Set<string> {
  if (!map[order]) map[order] = new Set();
  return map[order]!;
}

/**
 * Wrong / delayed choices can remove the best (correct) option on the **next** stage (`limit` effect).
 */
export function applyChoiceToBranchingState(args: {
  state: BranchingEngineState;
  stages: BranchingStageView[];
  picked: ParsedBranchingOption;
}): BranchingEngineState {
  const { state, stages, picked } = args;
  const traj = patientTrajectoryFromConsequence(trajectoryToConsequenceString(picked.trajectory));
  const nextOrder =
    picked.nextStageOrder != null && Number.isFinite(picked.nextStageOrder)
      ? picked.nextStageOrder
      : state.currentOrderIndex + 1;

  const hidden = { ...state.hiddenOptionIdsByStageOrder };
  for (const k of Object.keys(hidden)) {
    hidden[Number(k)] = new Set(hidden[Number(k)]!);
  }

  if (!picked.isCorrect) {
    const nextStage = stages.find((s) => s.orderIndex === nextOrder);
    if (nextStage && picked.effect === "limit") {
      const hide = ensureHiddenSet(hidden, nextOrder);
      hide.add(nextStage.correctOptionId);
    }
  }

  const rationaleTrail = [...state.rationaleTrail, picked.rationale || ""].filter((s) => s.trim().length > 0);

  return {
    currentOrderIndex: nextOrder,
    hiddenOptionIdsByStageOrder: hidden,
    trajectoryPath: [...state.trajectoryPath, traj],
    rationaleTrail,
    incorrectCount: state.incorrectCount + (picked.isCorrect ? 0 : 1),
  };
}

export function visibleOptionsForStage(
  stage: BranchingStageView | undefined,
  hidden: Set<string> | undefined,
): ParsedBranchingOption[] {
  const all = parseBranchingOptions(stage?.optionsJson);
  if (!hidden?.size) return all;
  return all.filter((o) => !hidden.has(o.id));
}

export function aggregateTrajectoryLabel(path: PatientTrajectory[]): PatientTrajectory {
  if (!path.length) return "stable";
  if (path.some((p) => p === "deteriorating")) return "deteriorating";
  if (path.every((p) => p === "improving")) return "improving";
  if (path[path.length - 1] === "improving") return "improving";
  return "stable";
}
