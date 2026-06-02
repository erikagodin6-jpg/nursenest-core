export type PreNursingMasteryState =
  | "introduced"
  | "practicing"
  | "developing"
  | "strong"
  | "mastered";

export type PreNursingConfidenceLevel =
  | "very-unsure"
  | "unsure"
  | "neutral"
  | "confident"
  | "very-confident";

export type PreNursingInteractionSource =
  | "lesson-checkpoint"
  | "mini-assessment"
  | "flashcard-review"
  | "guided-calculation"
  | "simulation"
  | "readiness-exam";

export type PreNursingMasteryEvent = {
  learnerId?: string;
  conceptId: string;
  source: PreNursingInteractionSource;
  selectedOptionId?: string;
  correct: boolean;
  confidence?: PreNursingConfidenceLevel;
  responseLatencyMs?: number;
  remediationRecommended?: boolean;
  misconceptionTag?: string;
  weakAreaTags?: string[];
  previousMasteryState?: PreNursingMasteryState;
  resultingMasteryState?: PreNursingMasteryState;
  createdAt: string;
};

export function createPreNursingMasteryEvent(
  event: Omit<PreNursingMasteryEvent, "createdAt">,
): PreNursingMasteryEvent {
  return {
    ...event,
    createdAt: new Date().toISOString(),
  };
}

export function inferPreNursingMasteryState(input: {
  correct: boolean;
  confidence?: PreNursingConfidenceLevel;
}): PreNursingMasteryState {
  if (!input.correct) return "practicing";

  switch (input.confidence) {
    case "very-confident":
      return "mastered";
    case "confident":
      return "strong";
    case "neutral":
      return "developing";
    default:
      return "developing";
  }
}
