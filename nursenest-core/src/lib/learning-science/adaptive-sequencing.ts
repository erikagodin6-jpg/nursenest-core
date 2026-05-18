import type { AuthorityConcept } from "@/lib/learning-science/authority-taxonomy";
import type { RetentionMemoryState } from "@/lib/learning-science/adaptive-retention-engine";

export type LearningSurface =
  | "lesson"
  | "retrieval_drill"
  | "flashcard"
  | "case_simulation"
  | "ecg_strip"
  | "cat_remediation"
  | "comparison_drill"
  | "confidence_review";

export type AdaptiveSequenceRecommendation = {
  conceptId: string;
  nextSurface: LearningSurface;
  reason: string;
  urgency: "routine" | "important" | "urgent";
  cognitiveGoal: string;
  learnerMessage: string;
};

export type MisconceptionRemediationPlan = {
  misconception: string;
  whyLearnersMissIt: string;
  remediationStrategy: readonly string[];
  comparisonTargets: readonly string[];
  transferScenario: string;
};

export function buildAdaptiveSequence(input: {
  concept: AuthorityConcept;
  state: RetentionMemoryState;
}): readonly AdaptiveSequenceRecommendation[] {
  const { concept, state } = input;

  const recommendations: AdaptiveSequenceRecommendation[] = [];

  if (state.overconfidenceMisses > 0) {
    recommendations.push({
      conceptId: concept.id,
      nextSurface: "confidence_review",
      urgency: "urgent",
      cognitiveGoal: "Repair dangerous overconfidence",
      reason: "Learner answered incorrectly with high confidence.",
      learnerMessage: "You were confident but incorrect. Slow down and compare the ruling-out clues before committing.",
    });
  }

  if (concept.requiredCognitiveSkills.includes("discrimination")) {
    recommendations.push({
      conceptId: concept.id,
      nextSurface: "comparison_drill",
      urgency: state.priority === "critical" ? "urgent" : "important",
      cognitiveGoal: "Strengthen look-alike differentiation",
      reason: "This concept has clinically dangerous look-alikes.",
      learnerMessage: `Compare ${concept.lookAlikes.slice(0, 3).join(", ")} side-by-side before moving forward.`,
    });
  }

  if (state.memoryStrength < 0.45) {
    recommendations.push({
      conceptId: concept.id,
      nextSurface: "lesson",
      urgency: "important",
      cognitiveGoal: "Rebuild foundational encoding",
      reason: "Memory strength is too weak for pure testing.",
      learnerMessage: "Return to guided teaching before continuing high-pressure questions.",
    });
  } else {
    recommendations.push({
      conceptId: concept.id,
      nextSurface: "retrieval_drill",
      urgency: "routine",
      cognitiveGoal: "Strengthen durable retrieval",
      reason: "Learner is ready for effortful recall.",
      learnerMessage: "Answer without hints before reviewing the explanation.",
    });
  }

  if (concept.requiredCognitiveSkills.includes("clinical_transfer")) {
    recommendations.push({
      conceptId: concept.id,
      nextSurface: "case_simulation",
      urgency: "important",
      cognitiveGoal: "Transfer knowledge to bedside decision-making",
      reason: "The learner must apply the concept in changing clinical contexts.",
      learnerMessage: "Apply this concept in a live patient scenario instead of isolated recall.",
    });
  }

  return recommendations;
}

export function buildMisconceptionPlan(concept: AuthorityConcept): readonly MisconceptionRemediationPlan[] {
  return concept.highRiskMisconceptions.map((misconception) => ({
    misconception,
    whyLearnersMissIt:
      "The learner recognizes superficial patterns but has not yet learned the ruling-out clues that separate similar conditions.",
    remediationStrategy: [
      "Force a prediction before showing the answer.",
      "Show the tempting wrong answer beside the correct clue.",
      "Require the learner to explain why the distractor is wrong.",
      "Repeat the concept later in a different patient context.",
    ],
    comparisonTargets: concept.lookAlikes,
    transferScenario:
      concept.transferContexts[0] ?? "Apply the same concept to a patient whose condition is worsening.",
  }));
}

export function chooseNextBestSurface(input: {
  state: RetentionMemoryState;
  concept: AuthorityConcept;
}): LearningSurface {
  const sequence = buildAdaptiveSequence(input);

  return [...sequence].sort((a, b) => {
    const urgencyWeight = {
      urgent: 3,
      important: 2,
      routine: 1,
    } as const;

    return urgencyWeight[b.urgency] - urgencyWeight[a.urgency];
  })[0]?.nextSurface ?? "retrieval_drill";
}
