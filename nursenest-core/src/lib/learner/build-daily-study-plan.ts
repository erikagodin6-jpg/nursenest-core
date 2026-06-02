import {
  computeNextActions,
  readinessTone,
  type LearnerState,
  type NextAction,
} from "./study-orchestrator";

export type DailyStudyPlan = {
  estimatedMinutes: number;
  focusArea: string;
  readinessMessage: string;
  actions: NextAction[];
  lowOverwhelmMode: boolean;
};

function estimateActionMinutes(action: NextAction): number {
  switch (action.type) {
    case "lesson":
      return 15;

    case "practice":
      return action.questionCount >= 15 ? 22 : 16;

    case "cat-mini":
      return 30;

    case "review":
      return 12;

    case "flashcards":
      return 10;

    default:
      return 10;
  }
}

export function buildDailyStudyPlan(state: LearnerState): DailyStudyPlan {
  const actions = computeNextActions(state);

  const estimatedMinutes = actions.reduce((total, action) => {
    return total + estimateActionMinutes(action);
  }, 0);

  const focusArea = actions[0]?.focusArea ?? "Core REx-PN readiness";

  const readinessMessage = readinessTone(state.readinessScore ?? 0);

  return {
    estimatedMinutes,
    focusArea,
    readinessMessage,
    actions,
    lowOverwhelmMode: estimatedMinutes <= 45,
  };
}
