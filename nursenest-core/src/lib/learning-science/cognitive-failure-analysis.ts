import type { AuthorityConcept, CognitiveSkill } from "@/lib/learning-science/authority-taxonomy";
import type { RetentionEvent } from "@/lib/learning-science/adaptive-retention-engine";

export type CognitiveFailureType =
  | "recognition_without_understanding"
  | "look_alike_confusion"
  | "unsafe_prioritization"
  | "overconfidence"
  | "poor_transfer"
  | "weak_pattern_recognition"
  | "memorization_without_reasoning"
  | "fatigue_pattern"
  | "slow_processing_under_pressure";

export type CognitiveFailureAnalysis = {
  conceptId: string;
  failureType: CognitiveFailureType;
  severity: "low" | "moderate" | "high" | "critical";
  explanation: string;
  likelyCause: string;
  remediationFocus: readonly string[];
  educatorInsight: string;
  learnerInsight: string;
};

export type LearnerCognitiveProfile = {
  dominantFailureModes: readonly CognitiveFailureType[];
  strongestSkills: readonly CognitiveSkill[];
  weakestSkills: readonly CognitiveSkill[];
  transferReadiness: number;
  confidenceCalibration: number;
  prioritizationSafety: number;
  patternRecognitionStrength: number;
};

export function analyzeCognitiveFailure(input: {
  concept: AuthorityConcept;
  events: readonly RetentionEvent[];
}): readonly CognitiveFailureAnalysis[] {
  const { concept, events } = input;

  const analyses: CognitiveFailureAnalysis[] = [];

  const highConfidenceMisses = events.filter(
    (event) => event.outcome === "incorrect" && event.confidence === "high",
  );

  if (highConfidenceMisses.length > 0) {
    analyses.push({
      conceptId: concept.id,
      failureType: "overconfidence",
      severity: highConfidenceMisses.length >= 2 ? "critical" : "high",
      explanation:
        "The learner commits to incorrect answers confidently, indicating a stable but inaccurate mental model rather than simple uncertainty.",
      likelyCause:
        "Pattern familiarity without ruling-out reasoning. The learner recognizes superficial features and stops analyzing too early.",
      remediationFocus: [
        "Force comparison between look-alikes",
        "Require written explanation of why distractors are wrong",
        "Delay answer reveal until confidence rating is submitted",
      ],
      educatorInsight:
        "This learner is at risk of repeating the same error clinically because they do not perceive uncertainty.",
      learnerInsight:
        "You are answering too quickly based on familiarity. Slow down and identify the ruling-out clue before committing.",
    });
  }

  const repeatedMisconceptions = concept.highRiskMisconceptions.filter((misconception) =>
    events.some((event) => event.misconception?.includes(misconception.split(" ")[0] ?? "")),
  );

  if (repeatedMisconceptions.length > 0) {
    analyses.push({
      conceptId: concept.id,
      failureType: "look_alike_confusion",
      severity: repeatedMisconceptions.length >= 2 ? "high" : "moderate",
      explanation:
        "The learner confuses clinically similar concepts because they are memorizing labels rather than discriminating between defining clues.",
      likelyCause:
        "Weak differential reasoning and insufficient interleaving between similar concepts.",
      remediationFocus: [
        "Interleave similar conditions side-by-side",
        "Highlight distinguishing clues visually",
        "Use retrieval drills that ask what rules OUT the wrong option",
      ],
      educatorInsight:
        "The learner may perform adequately in isolated drills but fails when similar concepts appear together.",
      learnerInsight:
        "You know the names, but you are not yet separating the look-alikes consistently.",
    });
  }

  if (concept.requiredCognitiveSkills.includes("clinical_transfer")) {
    analyses.push({
      conceptId: concept.id,
      failureType: "poor_transfer",
      severity: "moderate",
      explanation:
        "The learner can recognize the concept in isolation but struggles to apply it when patient context changes.",
      likelyCause:
        "Knowledge was encoded as fact recall instead of bedside decision-making.",
      remediationFocus: [
        "Case simulations",
        "Changing patient variables",
        "Escalation and instability scenarios",
      ],
      educatorInsight:
        "Transfer failure is common in learners trained primarily with static flashcards or isolated MCQs.",
      learnerInsight:
        "You need to practice this concept in changing patient situations, not just recognize the term.",
    });
  }

  return analyses;
}

export function buildLearnerCognitiveProfile(input: {
  analyses: readonly CognitiveFailureAnalysis[];
}): LearnerCognitiveProfile {
  const { analyses } = input;

  const dominantFailureModes = analyses
    .filter((analysis) => analysis.severity === "critical" || analysis.severity === "high")
    .map((analysis) => analysis.failureType);

  const weakestSkills: CognitiveSkill[] = [];

  if (analyses.some((analysis) => analysis.failureType === "look_alike_confusion")) {
    weakestSkills.push("discrimination", "pattern_recognition");
  }

  if (analyses.some((analysis) => analysis.failureType === "poor_transfer")) {
    weakestSkills.push("clinical_transfer");
  }

  if (analyses.some((analysis) => analysis.failureType === "overconfidence")) {
    weakestSkills.push("metacognition");
  }

  return {
    dominantFailureModes,
    strongestSkills: ["recognition"],
    weakestSkills,
    transferReadiness: analyses.some((analysis) => analysis.failureType === "poor_transfer") ? 0.42 : 0.76,
    confidenceCalibration: analyses.some((analysis) => analysis.failureType === "overconfidence") ? 0.31 : 0.8,
    prioritizationSafety: analyses.some((analysis) => analysis.failureType === "unsafe_prioritization") ? 0.36 : 0.84,
    patternRecognitionStrength: analyses.some((analysis) => analysis.failureType === "look_alike_confusion") ? 0.48 : 0.83,
  };
}
