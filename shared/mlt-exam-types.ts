export type MltExamMode = "canada_realistic" | "usa_cat" | "adaptive_practice" | "practice_exam";

export type AdaptivePracticeSubMode = "quick_quiz" | "weak_area_drill" | "mixed_discipline" | "image_drill";

export type PracticeExamMode = "timed" | "tutor" | "review";

export interface MltExamConfig {
  mode: MltExamMode;
  country: "US" | "CA";
  subMode?: AdaptivePracticeSubMode;
  practiceMode?: PracticeExamMode;
  totalQuestions?: number;
  timeLimit?: number;
  topics?: string[];
  difficulties?: string[];
  noBacktracking?: boolean;
  strictMode?: boolean;
  redoIncorrect?: boolean;
}

export interface AbilityEstimate {
  theta: number;
  standardError: number;
  confidence: number;
  history: number[];
}

export interface QuestionResponse {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  responseTimeMs: number;
  difficulty: string;
  category: string;
  flagged?: boolean;
}

export interface CATParameters {
  minQuestions: number;
  maxQuestions: number;
  timeLimit: number;
  stabilityThreshold: number;
  exposureMax: number;
  contentTargets: Record<string, number>;
  abilityCapPerQuestion: number;
  rapidGuessThresholdMs: number;
  noBacktracking: boolean;
}

export const DEFAULT_CAT_PARAMS: CATParameters = {
  minQuestions: 60,
  maxQuestions: 130,
  timeLimit: 150,
  stabilityThreshold: 0.3,
  exposureMax: 0.25,
  contentTargets: {
    "Hematology": 25,
    "Clinical Chemistry": 25,
    "Microbiology": 20,
    "Immunohematology/Blood Banking": 15,
    "Urinalysis & Body Fluids": 10,
    "Laboratory Operations": 5,
  },
  abilityCapPerQuestion: 0.5,
  rapidGuessThresholdMs: 3000,
  noBacktracking: true,
};

export const CANADA_EXAM_CONFIG = {
  totalQuestions: 120,
  timeLimit: 180,
  blueprintWeights: {
    "Hematology & Coagulation": 25,
    "Clinical Chemistry": 20,
    "Microbiology": 20,
    "Transfusion Science": 15,
    "Histotechnology": 10,
    "Quality Management": 10,
  },
};

export interface ExamSessionState {
  sessionId: string;
  mode: MltExamMode;
  country: "US" | "CA";
  subMode?: AdaptivePracticeSubMode;
  practiceMode?: PracticeExamMode;
  currentIndex: number;
  totalQuestions: number;
  timeLimit: number;
  startedAt: string;
  ability: AbilityEstimate;
  responses: QuestionResponse[];
  questionIds: string[];
  flaggedIds: string[];
  coverageAchieved: Record<string, number>;
  weakAreaMap: Record<string, number>;
  strongAreaMap: Record<string, number>;
  stabilityScore: number;
  completed: boolean;
  catParams?: CATParameters;
}

export interface ExamResultReport {
  sessionId: string;
  mode: MltExamMode;
  country: "US" | "CA";
  totalQuestions: number;
  correctCount: number;
  score: number;
  timeSpent: number;
  abilityEstimate: number;
  passed: boolean;
  categoryBreakdown: Record<string, { total: number; correct: number; percentage: number }>;
  difficultyProgression: { index: number; difficulty: string; correct: boolean; ability: number }[];
  weakAreas: string[];
  strongAreas: string[];
  recommendations: string[];
  abilityBand?: string;
}

export interface SimulationProfile {
  type: "strong" | "average" | "weak";
  baseAccuracy: number;
  difficultyModifier: Record<string, number>;
}

export const SIMULATION_PROFILES: Record<string, SimulationProfile> = {
  strong: {
    type: "strong",
    baseAccuracy: 0.85,
    difficultyModifier: { easy: 0.95, medium: 0.85, hard: 0.70 },
  },
  average: {
    type: "average",
    baseAccuracy: 0.65,
    difficultyModifier: { easy: 0.80, medium: 0.60, hard: 0.40 },
  },
  weak: {
    type: "weak",
    baseAccuracy: 0.45,
    difficultyModifier: { easy: 0.60, medium: 0.40, hard: 0.20 },
  },
};
