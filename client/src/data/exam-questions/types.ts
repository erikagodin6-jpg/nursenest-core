export type QuestionType = "mcq" | "sata" | "ordered" | "fill-in-blank" | "hot-spot" | "bowtie" | "matrix" | "highlight" | "trend" | "image_based" | "drag_drop" | "case_study";

export interface ExamQuestion {
  q: string;
  o: string[];
  a: number;
  ca?: number[];
  co?: number[];
  cv?: string;
  hc?: string;
  ht?: string;
  r: string;
  t?: QuestionType;
  s: string;
  dr?: string[];
  image?: string;
}

export interface BowtieQuestion {
  id: string;
  scenario: string;
  centerOptions: string[];
  centerCorrect: number;
  leftFindings: string[];
  leftCorrect: number[];
  leftSelectCount: number;
  rightActions: string[];
  rightCorrect: number[];
  rightSelectCount: number;
  rationale: {
    condition: string;
    findings: string;
    actions: string;
  };
  bodySystem: string;
  tier: string;
}

export interface MatrixQuestion {
  id: string;
  stem: string;
  scenario?: string;
  rows: { id: string; label: string }[];
  columns: { id: string; label: string }[];
  correctCells: Record<string, string[]>;
  selectionMode: "single" | "multi";
  rationale: string;
  bodySystem: string;
  tier: string;
  difficulty: Difficulty;
  tags?: string[];
}

export interface HighlightQuestion {
  id: string;
  stem: string;
  passage: string;
  highlightSpans: {
    spanId: string;
    start: number;
    end: number;
    text: string;
  }[];
  correctSpanIds: string[];
  maxSelections: number;
  rationale: string;
  bodySystem: string;
  tier: string;
  difficulty: Difficulty;
  tags?: string[];
}

export interface TrendQuestion {
  id: string;
  stem: string;
  scenario?: string;
  timepoints: {
    timeLabel: string;
    vitals?: Record<string, string>;
    labs?: Record<string, string>;
    nurseNotes?: string;
    medications?: string[];
  }[];
  interpretationQuestion: string;
  options: string[];
  correctAnswer: number;
  rationale: string;
  bodySystem: string;
  tier: string;
  difficulty: Difficulty;
  tags?: string[];
}

export interface ImageBasedQuestion {
  id: string;
  stem: string;
  imageDescription: string;
  imageType: "ecg" | "xray" | "wound" | "skin" | "lab_result" | "assessment" | "other";
  clinicalFindings: string[];
  options: string[];
  correctAnswer: number;
  rationale: string;
  bodySystem: string;
  tier: string;
  difficulty: Difficulty;
  tags?: string[];
}

export interface DragDropQuestion {
  id: string;
  stem: string;
  scenario?: string;
  items: { id: string; label: string }[];
  correctOrder: string[];
  categories?: { id: string; label: string }[];
  correctCategorization?: Record<string, string[]>;
  mode: "order" | "categorize";
  rationale: string;
  bodySystem: string;
  tier: string;
  difficulty: Difficulty;
  tags?: string[];
}

export interface CaseStudySubQuestion {
  id: string;
  questionType: "multiple_choice" | "multiple_response" | "fill_blank" | "priority" | "matrix" | "highlight";
  questionText: string;
  answerOptions?: string[];
  correctAnswer: number | number[] | string | Record<string, string[]>;
  rationale: string;
  points: number;
}

export interface CaseStudyQuestion {
  id: string;
  patientProfile: {
    name: string;
    age: number;
    gender: string;
    chiefComplaint: string;
    history: string;
  };
  vitals?: Record<string, string>;
  labs?: Record<string, string>;
  medications?: string[];
  nurseNotes?: string;
  questions: CaseStudySubQuestion[];
  overallRationale: string;
  bodySystem: string;
  tier: string;
  difficulty: Difficulty;
  tags?: string[];
}

export type AdvancedQuestion = MatrixQuestion | HighlightQuestion | TrendQuestion | ImageBasedQuestion | DragDropQuestion | CaseStudyQuestion;

export type Difficulty = 1 | 2 | 3;
export type BloomLevel = "recall" | "understanding" | "application" | "analysis";
export type BankCourse = "anatomy" | "pre-nursing" | "bls" | "pals" | "acls" | "nrp" | "tncc" | "enpc" | "rn";

export interface BankQuestion {
  id: string;
  course: BankCourse;
  topic: string;
  subtopic: string;
  stem: string;
  options: string[];
  correctAnswer?: number;
  correctAnswers?: number[];
  correctOrder?: number[];
  type: QuestionType;
  rationaleCorrect: string;
  rationaleIncorrect: string[];
  difficulty: Difficulty;
  bloomLevel: BloomLevel;
  clinicalCorrelation: string;
  references: string[];
  tags: string[];
  estimatedTimeSeconds: number;
}

export interface ExamForm {
  examId: string;
  title: string;
  course: BankCourse;
  timeLimitMinutes: number;
  passMark: number;
  blueprintSummary: Record<string, number>;
  sections: { topic: string; n: number }[];
  questionIds: string[];
}
