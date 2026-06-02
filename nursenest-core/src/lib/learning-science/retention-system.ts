export type RetentionCheckKind =
  | "retrieval"
  | "application"
  | "discrimination"
  | "confidence"
  | "error_correction"
  | "clinical_transfer";

export type RetentionCheck = {
  id: string;
  kind: RetentionCheckKind;
  prompt: string;
  options: readonly string[];
  correctAnswer: string;
  rationale: string;
  misconceptionTargeted: string;
  confidencePrompt?: string;
  transferPrompt?: string;
};

export type LearningSciencePattern = {
  id: string;
  name: string;
  purpose: string;
  learnerAction: string;
  sitewideUse: readonly string[];
};

export const LEARNING_SCIENCE_PATTERNS: readonly LearningSciencePattern[] = [
  {
    id: "retrieval-practice",
    name: "Retrieval practice",
    purpose: "Force recall before re-reading so the learner strengthens memory pathways instead of passively recognizing familiar text.",
    learnerAction: "Answer from memory before seeing the explanation.",
    sitewideUse: ["lessons", "ECG modules", "flashcards", "practice questions", "case simulations"],
  },
  {
    id: "spaced-repetition",
    name: "Spaced repetition",
    purpose: "Bring weak concepts back after a delay instead of showing all practice immediately in one sitting.",
    learnerAction: "Revisit missed or low-confidence concepts at expanding intervals.",
    sitewideUse: ["flashcards", "weak-topic review", "lesson checkpoints", "daily review"],
  },
  {
    id: "interleaving",
    name: "Interleaving",
    purpose: "Mix similar concepts so learners must discriminate, not memorize a single isolated pattern.",
    learnerAction: "Compare look-alike conditions, rhythms, medications, and clinical presentations.",
    sitewideUse: ["question bank", "ECG rhythm drills", "pharmacology", "maternal-child", "mental health", "adult health"],
  },
  {
    id: "desirable-difficulty",
    name: "Desirable difficulty",
    purpose: "Use productive struggle before hints so learning is durable without becoming discouraging.",
    learnerAction: "Try, commit, receive targeted feedback, then retry a nearby example.",
    sitewideUse: ["lessons", "case studies", "practice tests", "simulation"],
  },
  {
    id: "metacognition",
    name: "Metacognition and calibration",
    purpose: "Ask learners how confident they are so the platform can identify lucky guesses and overconfidence.",
    learnerAction: "Rate confidence after answering and review mismatches between confidence and correctness.",
    sitewideUse: ["questions", "CAT insights", "flashcards", "ECG interpretation", "case simulation"],
  },
  {
    id: "error-correction",
    name: "Error correction",
    purpose: "Turn wrong answers into explicit misconception repair, not generic rationales.",
    learnerAction: "Name why the wrong answer was tempting and what clue rules it out.",
    sitewideUse: ["rationales", "lesson checkpoints", "weak-topic remediation", "clinical judgment cases"],
  },
  {
    id: "transfer",
    name: "Clinical transfer",
    purpose: "Move from fact recall to bedside judgment by changing the patient context after the learner answers.",
    learnerAction: "Apply the same concept to a new clinical scenario.",
    sitewideUse: ["case simulations", "NGN-style items", "ECG", "pharmacology", "prioritization"],
  },
] as const;

export function buildDefaultRetentionChecks(input: {
  lessonId: string;
  title: string;
  correctDiagnosticClue: string;
  commonMistake: string;
  nursingPriority: string;
  differentiator: string;
}): readonly RetentionCheck[] {
  return [
    {
      id: `${input.lessonId}-retrieval`,
      kind: "retrieval",
      prompt: `Before reading further: which clue is most important for recognizing ${input.title}?`,
      options: [input.correctDiagnosticClue, input.commonMistake, "The learner's subjective confidence only", "The length of the explanation"],
      correctAnswer: input.correctDiagnosticClue,
      rationale: `The key retention target is the diagnostic clue, not passive familiarity with the label ${input.title}.`,
      misconceptionTargeted: input.commonMistake,
      confidencePrompt: "How confident were you before seeing the answer?",
    },
    {
      id: `${input.lessonId}-discrimination`,
      kind: "discrimination",
      prompt: "Which comparison best prevents a look-alike mistake?",
      options: [input.differentiator, input.commonMistake, "Choose the fastest answer", "Ignore the patient and treat the monitor"],
      correctAnswer: input.differentiator,
      rationale: "Durable exam readiness comes from discrimination between similar choices, not isolated memorization.",
      misconceptionTargeted: input.commonMistake,
    },
    {
      id: `${input.lessonId}-clinical-transfer`,
      kind: "clinical_transfer",
      prompt: "The same concept appears in a new patient scenario. What should the nurse prioritize first?",
      options: [input.nursingPriority, input.correctDiagnosticClue, input.commonMistake, "Skip assessment and continue the lesson"],
      correctAnswer: input.nursingPriority,
      rationale: "Clinical transfer connects the concept to patient safety and nursing action.",
      misconceptionTargeted: "Memorizing the term without knowing what to do for the patient.",
      transferPrompt: "Now explain how this would change if the patient became hypotensive or had chest pain.",
    },
  ];
}
