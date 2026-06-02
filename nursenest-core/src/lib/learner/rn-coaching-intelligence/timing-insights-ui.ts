import type { TimingIntelligenceV2Result } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { ReadinessReliability } from "@/lib/learner/rn-coaching-intelligence/coaching-types";

export type TimingInsightCard = {
  id: string;
  title: string;
  detail: string;
  tone: "supportive" | "neutral" | "focus";
};

/**
 * Converts Timing V2 cognitive profile into learner-safe, non-punitive insight cards.
 * Suppresses low-confidence inferences when reliability is low or sample is tiny.
 */
export function buildTimingInsightCards(args: {
  timing: TimingIntelligenceV2Result | null | undefined;
  reliability?: ReadinessReliability;
  minSignals?: number;
}): TimingInsightCard[] {
  const { timing, reliability = "moderate", minSignals = 6 } = args;
  if (!timing || timing.signals.length < minSignals) return [];
  if (reliability === "low" && timing.signals.length < 12) {
    return timing.coachingNarratives.slice(0, 1).map((detail, i) => ({
      id: `timing-narrative-${i}`,
      title: "Pacing note",
      detail,
      tone: "neutral",
    }));
  }

  const cards: TimingInsightCard[] = [];
  const c = timing.cognitive;

  if (c.fatigueDetected || c.lateSessionAccuracyDrop) {
    cards.push({
      id: "fatigue",
      title: "Late-session pacing",
      detail:
        "Accuracy or pacing softened toward the end of this session. Shorter timed blocks can help you finish strong.",
      tone: "supportive",
    });
  }

  if (c.sataHesitation) {
    cards.push({
      id: "sata-hesitation",
      title: "SATA pacing",
      detail:
        "Select-all-that-apply items took extra time — practice evaluating each option independently before moving on.",
      tone: "focus",
    });
  }

  if (c.matrixHesitation) {
    cards.push({
      id: "matrix-hesitation",
      title: "Matrix-style items",
      detail:
        "Matrix or bowtie-style stems showed hesitation — map assessment data to actions before selecting cells.",
      tone: "focus",
    });
  }

  if (c.answerChangeRisk) {
    cards.push({
      id: "answer-changes",
      title: "Answer changes",
      detail:
        "Several misses followed answer changes — use a brief safety check before committing on prioritization stems.",
      tone: "focus",
    });
  }

  if (timing.rapidGuessTopics.length && c.confidenceInstability < 0.5) {
    cards.push({
      id: "rapid-guess",
      title: "Fast responses",
      detail: `Quick responses in ${timing.rapidGuessTopics[0]} may benefit from a stabilization pause before submit.`,
      tone: "supportive",
    });
  }

  if (c.confidenceInstability >= 0.35 && reliability !== "low") {
    cards.push({
      id: "confidence-mismatch",
      title: "Confidence vs accuracy",
      detail:
        "Self-rated confidence did not always match outcomes — reinforce with flashcards, then repeat under time pressure.",
      tone: "supportive",
    });
  }

  for (const detail of timing.coachingNarratives) {
    if (cards.length >= 4) break;
    if (cards.some((x) => x.detail === detail)) continue;
    cards.push({
      id: `narr-${cards.length}`,
      title: "Study pacing",
      detail,
      tone: "neutral",
    });
  }

  return cards.slice(0, 4);
}
