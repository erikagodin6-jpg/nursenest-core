/** Quiz item shape used across monolith lesson bundles (MCQ / SATA metadata). */
export type QuizQuestion = {
  question: string;
  options: string[];
  /** Zero-based index of the correct option */
  correct: number;
  rationale: string | string[];
};

export type MedicationEntry =
  | {
      name: string;
      type: string;
      action: string;
      sideEffects: string | string[];
      contra: string | string[];
      pearl: string;
    }
  | { name: string; dose: string; route: string; purpose: string };

export type LessonContent = {
  title: string;
  cellular: { title: string; content: string; image?: string } | string;
  riskFactors?: string[];
  diagnostics?: string[];
  management?: string[];
  nursingActions?: string[];
  assessmentFindings?: string[];
  signs?: { left: string[]; right: string[] } | string[];
  medications?: MedicationEntry[];
  pearls?: string[];
  lifespan?: { title: string; content: string };
  /** Some generated bundles use sparse arrays; renderers should skip empty slots. */
  quiz?: Array<QuizQuestion | undefined>;
  preTest?: Array<QuizQuestion | undefined>;
  postTest?: Array<QuizQuestion | undefined>;
  image?: string;
};
