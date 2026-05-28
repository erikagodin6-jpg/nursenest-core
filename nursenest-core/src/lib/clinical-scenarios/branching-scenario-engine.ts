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
  /** Correct priority rank (1 = first) for ranking interactions. */
  rankOrder: number | null;
  /** Correct sequence position (1 = first) for ordered-response interactions. */
  sequenceOrder: number | null;
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

export type ScenarioDecisionRecord = {
  stageOrder: number;
  questionStem: string;
  pickedLabel: string;
  isCorrect: boolean;
  trajectory: ConsequenceTrajectory;
  effect: ConsequenceEffect;
  atMs: number;
};

export type BranchingEngineState = {
  currentOrderIndex: number;
  /** Per-stage orderIndex → option ids hidden for that stage (e.g. best option removed). */
  hiddenOptionIdsByStageOrder: Record<number, Set<string>>;
  trajectoryPath: PatientTrajectory[];
  /** Option rationales the learner saw at each committed step. */
  rationaleTrail: string[];
  incorrectCount: number;
  /** Delay-weighted error burden (delay wrong answers count extra). */
  incorrectWeight: number;
  /** Labels of incorrect picks for debrief. */
  mistakeLabels: string[];
  /** Prepended to `scenarioText` for stages after a deteriorating branch. */
  deteriorationBannerByStageOrder: Record<number, string>;
  /** Committed decisions for timeline replay and performance report. */
  decisionTrail: ScenarioDecisionRecord[];
};

export function initialBranchingEngineState(startOrderIndex = 0): BranchingEngineState {
  return {
    currentOrderIndex: startOrderIndex,
    hiddenOptionIdsByStageOrder: {},
    trajectoryPath: [],
    rationaleTrail: [],
    incorrectCount: 0,
    incorrectWeight: 0,
    mistakeLabels: [],
    deteriorationBannerByStageOrder: {},
    decisionTrail: [],
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
    const consSource =
      o.consequenceMap && typeof o.consequenceMap === "object"
        ? o.consequenceMap
        : o.consequence && typeof o.consequence === "object"
          ? o.consequence
          : {};
    const cons = consSource as Record<string, unknown>;
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
    let nextStageOrder: number | null =
      typeof o.nextStageOrder === "number" && Number.isFinite(o.nextStageOrder)
        ? Math.floor(o.nextStageOrder)
        : typeof o.nextStageId === "string" && /^\d+$/.test(o.nextStageId)
          ? Number.parseInt(o.nextStageId, 10)
          : null;
    const nsm = o.nextStageMap;
    if (nextStageOrder == null && typeof nsm === "number" && Number.isFinite(nsm)) {
      nextStageOrder = Math.floor(nsm);
    } else if (nextStageOrder == null && typeof nsm === "string" && /^\d+$/.test(nsm)) {
      nextStageOrder = Number.parseInt(nsm, 10);
    }
    const rankOrder =
      typeof o.rankOrder === "number" && Number.isFinite(o.rankOrder) ? Math.floor(o.rankOrder) : null;
    const sequenceOrder =
      typeof o.sequenceOrder === "number" && Number.isFinite(o.sequenceOrder)
        ? Math.floor(o.sequenceOrder)
        : null;
    out.push({ id, label, isCorrect, rationale, trajectory, effect, nextStageOrder, rankOrder, sequenceOrder });
  }
  return out;
}

export type StageQuestionFormat = "mcq" | "sata" | "ranking" | "sequencing";

/** Infer interaction format from option metadata (no schema change required). */
export function inferStageQuestionFormat(options: ParsedBranchingOption[]): StageQuestionFormat {
  if (!options.length) return "mcq";
  if (options.every((o) => o.sequenceOrder != null)) return "sequencing";
  if (options.every((o) => o.rankOrder != null)) return "ranking";
  const correctCount = options.filter((o) => o.isCorrect).length;
  if (correctCount >= 2) return "sata";
  return "mcq";
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
      (o.consequenceMap && typeof o.consequenceMap === "object") ||
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

function cloneHiddenMap(map: Record<number, Set<string>>): Record<number, Set<string>> {
  const out: Record<number, Set<string>> = {};
  for (const k of Object.keys(map)) {
    out[Number(k)] = new Set(map[Number(k)]!);
  }
  return out;
}

/** Shown as a prefix on the next stage after a `deteriorates` trajectory choice. */
export const BRANCHING_DETERIORATION_BANNER =
  "Clinical update: the patient's condition has worsened since your last decision — reassess vitals, monitoring, and escalation thresholds urgently.";

/**
 * Narrative text for a stage, including optional deterioration prefix from prior choices.
 */
export function narrativeScenarioText(stage: BranchingStageView, state: BranchingEngineState): string {
  const banner = state.deteriorationBannerByStageOrder[stage.orderIndex];
  if (!banner?.trim()) return stage.scenarioText;
  return `${banner.trim()}\n\n${stage.scenarioText}`;
}

/**
 * Branching commit: applies limit/unlock/delay semantics and trajectory-linked banners.
 */
export function applyChoiceToBranchingState(args: {
  state: BranchingEngineState;
  stages: BranchingStageView[];
  picked: ParsedBranchingOption;
  stage?: BranchingStageView;
}): BranchingEngineState {
  const { state, stages, picked, stage } = args;
  const nextOrder =
    picked.nextStageOrder != null && Number.isFinite(picked.nextStageOrder)
      ? picked.nextStageOrder
      : state.currentOrderIndex + 1;

  const hidden = cloneHiddenMap(state.hiddenOptionIdsByStageOrder);
  const deterioration = { ...state.deteriorationBannerByStageOrder };

  const nextStage = stages.find((s) => s.orderIndex === nextOrder);

  if (picked.effect === "limit" && nextStage) {
    const hide = ensureHiddenSet(hidden, nextOrder);
    hide.add(nextStage.correctOptionId);
  }

  if (picked.effect === "unlock" && nextStage) {
    const set = ensureHiddenSet(hidden, nextOrder);
    set.delete(nextStage.correctOptionId);
  }

  if (picked.trajectory === "deteriorates") {
    const prev = deterioration[nextOrder] ?? "";
    deterioration[nextOrder] = prev ? `${prev}\n${BRANCHING_DETERIORATION_BANNER}` : BRANCHING_DETERIORATION_BANNER;
  }

  let consequenceStr = trajectoryToConsequenceString(picked.trajectory);
  if (!picked.isCorrect && picked.effect === "delay") {
    consequenceStr = "patient deteriorates";
  }
  const traj = patientTrajectoryFromConsequence(consequenceStr);

  const wrongWeightBump = !picked.isCorrect ? (picked.effect === "delay" ? 2 : 1) : 0;
  const mistakeLabels = !picked.isCorrect ? [...state.mistakeLabels, picked.label] : [...state.mistakeLabels];

  const rationaleTrail = [...state.rationaleTrail, picked.rationale || ""].filter((s) => s.trim().length > 0);

  const decisionTrail: ScenarioDecisionRecord[] = [
    ...state.decisionTrail,
    {
      stageOrder: state.currentOrderIndex,
      questionStem: stage?.questionStem ?? "",
      pickedLabel: picked.label,
      isCorrect: picked.isCorrect,
      trajectory: picked.trajectory,
      effect: picked.effect,
      atMs: Date.now(),
    },
  ];

  return {
    currentOrderIndex: nextOrder,
    hiddenOptionIdsByStageOrder: hidden,
    trajectoryPath: [...state.trajectoryPath, traj],
    rationaleTrail,
    incorrectCount: state.incorrectCount + (picked.isCorrect ? 0 : 1),
    incorrectWeight: state.incorrectWeight + wrongWeightBump,
    mistakeLabels,
    deteriorationBannerByStageOrder: deterioration,
    decisionTrail,
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
