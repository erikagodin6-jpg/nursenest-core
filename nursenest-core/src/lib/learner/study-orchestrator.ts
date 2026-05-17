export type FocusMode =
  | "mixed"
  | "respiratory"
  | "pharmacology"
  | "delegation"
  | "prioritization"
  | "fundamentals"
  | "cardiac"
  | "mental_health"
  | "maternal_newborn"
  | "pediatrics";

export type StudySessionType = "lesson" | "questions" | "cat" | "flashcards" | "review";

export type ReadinessTrend = "up" | "down" | "stable";

export type ReadinessDomain = {
  id: FocusMode;
  label: string;
  score: number;
  previousScore?: number;
  trend?: ReadinessTrend;
  highRisk?: boolean;
};

export type LearnerState = {
  userId: string;
  weakAreas?: string[];
  strongAreas?: string[];
  recentScores?: number[];
  lastSessionType?: StudySessionType;
  readinessScore?: number;
  readinessDomains?: ReadinessDomain[];
  preferredFocusMode?: FocusMode;
};

export type NextAction =
  | {
      type: "lesson";
      title: string;
      reason: string;
      focusArea: string;
      priority: number;
    }
  | {
      type: "practice";
      title: string;
      questionCount: number;
      reason: string;
      focusArea: string;
      priority: number;
    }
  | {
      type: "cat-mini";
      title: string;
      reason: string;
      focusArea: string;
      priority: number;
    }
  | {
      type: "review";
      title: string;
      topic: string;
      reason: string;
      focusArea: string;
      priority: number;
    }
  | {
      type: "flashcards";
      title: string;
      cardCount: number;
      reason: string;
      focusArea: string;
      priority: number;
    };

export function determineReadinessTrend(current: number, previous: number): ReadinessTrend {
  if (current > previous + 3) return "up";
  if (current < previous - 3) return "down";
  return "stable";
}

export function readinessTone(score: number): string {
  if (score >= 85) return "Exam-ready range — keep reinforcing weak spots.";
  if (score >= 72) return "Approaching readiness — use targeted practice to close gaps.";
  if (score >= 58) return "Building consistency — focus on one weak area at a time.";
  if (score >= 40) return "Foundation phase — prioritize safety-critical concepts.";
  return "Baseline building — start with guided fundamentals and short practice sets.";
}

function normalizeFocusLabel(value: string | undefined): string {
  const cleaned = value?.replace(/[_-]+/g, " ").trim();
  if (!cleaned) return "Core REx-PN readiness";
  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
}

function pickPriorityFocus(state: LearnerState): string {
  const highRiskDown = state.readinessDomains
    ?.filter((domain) => domain.highRisk || domain.trend === "down" || domain.score < 58)
    .sort((a, b) => a.score - b.score)[0];

  if (highRiskDown) return highRiskDown.label;
  if (state.weakAreas?.[0]) return state.weakAreas[0];
  if (state.preferredFocusMode && state.preferredFocusMode !== "mixed") return normalizeFocusLabel(state.preferredFocusMode);
  return "Core REx-PN readiness";
}

export function computeNextActions(state: LearnerState): NextAction[] {
  const focusArea = pickPriorityFocus(state);
  const weakArea = state.weakAreas?.[0] ?? focusArea;
  const readiness = state.readinessScore ?? 0;
  const actions: NextAction[] = [];

  if (state.lastSessionType === "cat") {
    actions.push({
      type: "review",
      title: "Review recent CAT mistakes",
      topic: weakArea,
      reason: "Convert recent exam-simulation errors into a focused remediation plan.",
      focusArea,
      priority: 105,
    });
  }

  if (state.weakAreas?.length || focusArea !== "Core REx-PN readiness") {
    actions.push({
      type: "lesson",
      title: `Review ${focusArea}`,
      reason: "Highest-value weak area based on recent readiness signals.",
      focusArea,
      priority: 100,
    });

    actions.push({
      type: "practice",
      title: `${focusArea} targeted questions`,
      questionCount: readiness >= 72 ? 15 : 10,
      reason: "Reinforce the same concept immediately after review.",
      focusArea,
      priority: 92,
    });
  } else {
    actions.push({
      type: "lesson",
      title: "Start core REx-PN fundamentals",
      reason: "Establish a safe baseline before moving into targeted remediation.",
      focusArea,
      priority: 82,
    });

    actions.push({
      type: "practice",
      title: "Mixed diagnostic practice",
      questionCount: 15,
      reason: "Build the first readiness signal for your study plan.",
      focusArea,
      priority: 74,
    });
  }

  if (readiness >= 72) {
    actions.push({
      type: "cat-mini",
      title: "Mini REx-PN simulation",
      reason: "You are ready to validate timing, stamina, and prioritization under exam conditions.",
      focusArea,
      priority: 95,
    });
  } else {
    actions.push({
      type: "flashcards",
      title: `${focusArea} recall set`,
      cardCount: 15,
      reason: "Short recall practice builds confidence without adding overload.",
      focusArea,
      priority: 68,
    });
  }

  return actions.sort((a, b) => b.priority - a.priority).slice(0, 3);
}
