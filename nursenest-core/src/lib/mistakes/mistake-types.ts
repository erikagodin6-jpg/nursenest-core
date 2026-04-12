/**
 * Mistake Notebook — shared types.
 *
 * Persistence: LearnerNote (scope=QUESTION_BANK, contextId="mistake:{questionId}").
 * Source data: PracticeTest.results.incorrectQuestionIds (already stored on completion).
 * No Prisma migration required.
 */

export type MistakeReason =
  | "knowledge_gap"
  | "misread_question"
  | "rushed"
  | "second_guessed"
  | "prioritization_issue"
  | "sata_strategy"
  | "case_study_reasoning";

export const MISTAKE_REASONS: MistakeReason[] = [
  "knowledge_gap",
  "misread_question",
  "rushed",
  "second_guessed",
  "prioritization_issue",
  "sata_strategy",
  "case_study_reasoning",
];

export const MISTAKE_REASON_LABELS: Record<MistakeReason, string> = {
  knowledge_gap: "Knowledge Gap",
  misread_question: "Misread Question",
  rushed: "Rushed",
  second_guessed: "Second-Guessed",
  prioritization_issue: "Prioritization",
  sata_strategy: "SATA Strategy",
  case_study_reasoning: "Case Study Reasoning",
};

export const MISTAKE_REASON_DESCRIPTIONS: Record<MistakeReason, string> = {
  knowledge_gap: "I didn't know the concept",
  misread_question: "I misread or misunderstood the question",
  rushed: "I moved too fast and didn't read carefully",
  second_guessed: "My first instinct was right but I changed it",
  prioritization_issue: "I struggled to rank nursing priorities",
  sata_strategy: "I had trouble with Select-All-That-Apply",
  case_study_reasoning: "I lost track of the clinical reasoning chain",
};

/** Color identity for each reason — maps to semantic CSS variables */
export const MISTAKE_REASON_ROLE: Record<MistakeReason, string> = {
  knowledge_gap: "info",
  misread_question: "warning",
  rushed: "warning",
  second_guessed: "concept",
  prioritization_issue: "action",
  sata_strategy: "diagnostic",
  case_study_reasoning: "application",
};

/** Study tips shown in pattern card for each reason */
export const MISTAKE_REASON_STUDY_TIPS: Record<MistakeReason, string> = {
  knowledge_gap:
    "Focus on lesson sections for these topics. Use spaced repetition flashcards to anchor the concept.",
  misread_question:
    "Slow down on the stem. Underline the key phrase and restate it before reading options.",
  rushed:
    "Practice 1-question-per-minute pacing. Flag and come back rather than guessing under pressure.",
  second_guessed:
    "Trust your initial read. Only change an answer if you find a concrete reason — not just anxiety.",
  prioritization_issue:
    "Apply ABC then Maslow. When in doubt, choose the patient who is least stable.",
  sata_strategy:
    "Treat each option as True/False independently. Avoid the 'pick 3' trap — read every option.",
  case_study_reasoning:
    "Read the full scenario before the question. Identify what changed and why it matters.",
};

/** Body stored in LearnerNote.body for a mistake tag */
export type MistakeTagBody = {
  reason: MistakeReason | null;
  note: string;
};

/** A single missed question with optional user tag */
export type MistakeEntry = {
  questionId: string;
  /** First 200 chars of question stem for display (no DB re-fetch needed for listing) */
  stemPreview: string;
  topic: string | null;
  bodySystem: string | null;
  questionType: string | null;
  /** Full rationale for the review expand panel */
  rationale: string | null;
  options: unknown;
  correctAnswer: unknown;
  /** Number of times this question was missed across all practice sessions */
  missCount: number;
  lastMissedAt: string;
  /** User-assigned reason tag (null = untagged) */
  reason: MistakeReason | null;
  /** User's personal annotation note */
  note: string;
  /** True when user has explicitly tagged this entry */
  tagged: boolean;
  /** Source session IDs (practice test IDs where this was missed) */
  sourceIds: string[];
};

export type MistakePattern = {
  reason: MistakeReason;
  count: number;
  pct: number;
  topTopics: string[];
  studyTip: string;
};

export type MistakeTopicSummary = {
  topic: string;
  missCount: number;
  bodySystem: string | null;
};

export type MistakeNotebookData = {
  entries: MistakeEntry[];
  totalMisses: number;
  taggedCount: number;
  topTopics: MistakeTopicSummary[];
  topBodySystems: { bodySystem: string; count: number }[];
  patterns: MistakePattern[];
  reasonCounts: Partial<Record<MistakeReason, number>>;
  hasHistoricalData: boolean;
};
