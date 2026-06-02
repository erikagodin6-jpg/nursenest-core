export type LearningSciencePrincipleKey =
  | "spaced_repetition"
  | "retrieval_practice"
  | "interleaving"
  | "adaptive_review"
  | "error_correction"
  | "metacognition"
  | "long_term_retention";

export type LearningSciencePrinciple = {
  readonly key: LearningSciencePrincipleKey;
  readonly learnerBenefit: string;
  readonly requiredImplementation: string;
};

export const LEARNING_SCIENCE_PRINCIPLES: readonly LearningSciencePrinciple[] = [
  {
    key: "spaced_repetition",
    learnerBenefit: "Moves clinical patterns from short-term familiarity into durable recall.",
    requiredImplementation: "Schedule re-exposure based on performance, confidence, and clinical risk.",
  },
  {
    key: "retrieval_practice",
    learnerBenefit: "Strengthens recall by requiring the learner to produce an answer before viewing teaching.",
    requiredImplementation: "Use questions, flashcards, cases, and simulations before explanations are revealed.",
  },
  {
    key: "interleaving",
    learnerBenefit: "Builds discrimination between similar conditions, labs, rhythms, medications, or patient priorities.",
    requiredImplementation: "Mix related topics after foundational practice instead of blocking only one condition at a time.",
  },
  {
    key: "adaptive_review",
    learnerBenefit: "Targets effort where it changes outcomes most.",
    requiredImplementation: "Route misses to lessons, flashcards, questions, simulations, and report-card remediation.",
  },
  {
    key: "error_correction",
    learnerBenefit: "Turns mistakes into durable learning by explaining the learner trap.",
    requiredImplementation: "Name why the selected option was tempting and how to avoid the same reasoning error.",
  },
  {
    key: "metacognition",
    learnerBenefit: "Helps learners calibrate confidence and notice overconfidence or underconfidence.",
    requiredImplementation: "Track confidence, ask for reflection, and compare confidence against correctness.",
  },
  {
    key: "long_term_retention",
    learnerBenefit: "Supports performance weeks later, not just immediately after exposure.",
    requiredImplementation: "Revisit high-risk, weak, and decaying domains through scheduled adaptive loops.",
  },
] as const;

export function auditLearningScienceIntegration(): readonly string[] {
  const issues: string[] = [];
  const principles = new Set(LEARNING_SCIENCE_PRINCIPLES.map((item) => item.key));
  for (const key of [
    "spaced_repetition",
    "retrieval_practice",
    "interleaving",
    "adaptive_review",
    "error_correction",
    "metacognition",
    "long_term_retention",
  ] as const) {
    if (!principles.has(key)) issues.push(`missing learning science principle: ${key}`);
  }
  for (const principle of LEARNING_SCIENCE_PRINCIPLES) {
    if (principle.requiredImplementation.toLowerCase().includes("exposure only")) {
      issues.push(`${principle.key} cannot be exposure-only`);
    }
  }
  return issues;
}
