export type QuizQuestion = { question: string; options: string[]; correct: number; rationale: string };

export type MedicationEntry =
  | { name: string; type: string; action: string; sideEffects: string; contra: string; pearl: string }
  | { name: string; dose: string; route: string; purpose: string };

export type LessonContent = {
  title: string;
  cellular: { title: string; content: string } | string;
  riskFactors?: string[];
  diagnostics?: string[];
  management?: string[];
  nursingActions?: string[];
  assessmentFindings?: string[];
  signs: { left: string[]; right: string[] } | string[];
  medications: MedicationEntry[];
  pearls: string[];
  lifespan?: { title: string; content: string };
  quiz: QuizQuestion[];
  preTest?: QuizQuestion[];
  postTest?: QuizQuestion[];
  image?: string;
};
