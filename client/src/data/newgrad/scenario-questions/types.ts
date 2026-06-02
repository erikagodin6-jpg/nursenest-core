export interface ScenarioQuestion {
  id: string;
  formatType: "scenario" | "behavioral" | "situational" | "star";
  categoryGroup: string;
  subcategory: string;
  scenarioPrompt: string;
  question: string;
  exampleAnswer: string;
  feedback: string;
  starBreakdown?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface InterviewSimulationSet {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  questions: ScenarioQuestion[];
}

export interface MockInterviewTest {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  timeLimit: number;
  supportsRandomization: boolean;
  questions: ScenarioQuestion[];
}
