export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

export interface PerioperativeLesson {
  title: string;
  slug: string;
  domain: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  content: string;
  checkpointQuestions: QuizQuestion[];
  commonMistakes: string[];
  examTrapWarning: string;
  clinicalReasoning: string;
  relatedFlashcardTopics: string[];
}
