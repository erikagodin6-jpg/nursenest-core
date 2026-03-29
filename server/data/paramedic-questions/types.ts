export interface ParamedicQuestion {
  stem: string;
  options: string[];
  correctAnswer: number;
  rationaleLong: string;
  learningObjective: string;
  blueprintCategory: string;
  subtopic: string;
  difficulty: number;
  cognitiveLevel: string;
  questionType: string;
  examTrap: string;
  clinicalPearls: string[];
  safetyNote: string;
  distractorRationales: string[];
}
