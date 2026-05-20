// Demo screenshot component - NOT real learner data.
// These profiles are hardcoded for marketing screenshots only.

export interface DemoProfile {
  id: string;
  name: string;
  initials: string;
  track: string;
  institution: string;
  examDate: string;
  studyWindow: string;
  readinessScore: number;
  predictedPassProbability: number;
  adaptiveDifficultyLevel: number;
  studyStreak: number;
  questionsCompleted: number;
  totalStudyHours: number;
  overallAccuracy: number;
  catSimulationsCompleted: number;
  flashcardsReviewed: number;
  lessonsCompleted: number;
  strongestAreas: string[];
  weakestAreas: string[];
  categoryBreakdown: {
    name: string;
    score: number;
    questions: number;
    status: string;
    trend: "up" | "down" | "flat";
  }[];
  questionTypePerformance: {
    type: string;
    score: number;
    attempts: number;
    confidence: string;
  }[];
  growthTrend: number[];
  recommendations: {
    label: string;
    priority: "High Priority" | "Moderate Priority" | "Quick Win";
  }[];
  studyBehaviour: {
    averageSessionLength: string;
    peakStudyWindow: string;
    weeklyConsistency: number;
    dailyAverageQuestions: number;
    reviewCompletionRate: number;
  };
  confidenceMatrix: {
    category: string;
    confidence: number;
    performance: number;
  }[];
  weeklyActivity: number[];
}

export const demoProfiles: DemoProfile[] = [
  {
    id: "demo-rn-olivia",
    name: "Olivia Martin",
    initials: "OM",
    track: "RN / NCLEX-RN",
    institution: "NurseNest Demo Learner",
    examDate: "2026-04-28",
    studyWindow: "Last 30 days",
    readinessScore: 78,
    predictedPassProbability: 84,
    adaptiveDifficultyLevel: 7.4,
    studyStreak: 18,
    questionsCompleted: 1284,
    totalStudyHours: 42.6,
    overallAccuracy: 73,
    catSimulationsCompleted: 6,
    flashcardsReviewed: 932,
    lessonsCompleted: 27,
    strongestAreas: [
      "Infection Control",
      "Fluid & Electrolyte Balance",
      "Cardiac Assessment",
      "Safety & Risk Reduction",
    ],
    weakestAreas: [
      "Pharmacology Calculations",
      "Delegation / Prioritization",
      "Endocrine Disorders",
      "Pediatric Respiratory Care",
    ],
    categoryBreakdown: [
      { name: "Pharmacology", score: 62, questions: 214, status: "Needs Review", trend: "down" },
      { name: "Medical-Surgical", score: 81, questions: 338, status: "Strong", trend: "up" },
      { name: "Maternity", score: 72, questions: 104, status: "Improving", trend: "up" },
      { name: "Pediatrics", score: 74, questions: 126, status: "Improving", trend: "up" },
      { name: "Mental Health", score: 77, questions: 96, status: "Stable", trend: "flat" },
      { name: "Fundamentals", score: 79, questions: 201, status: "Strong", trend: "up" },
      { name: "Leadership / Prioritization", score: 59, questions: 98, status: "Focus Area", trend: "down" },
      { name: "Critical Thinking / NGN", score: 69, questions: 107, status: "Moderate", trend: "up" },
    ],
    questionTypePerformance: [
      { type: "Multiple Choice", score: 78, attempts: 486, confidence: "High" },
      { type: "SATA", score: 64, attempts: 188, confidence: "Needs repetition" },
      { type: "Bowtie", score: 68, attempts: 42, confidence: "Moderate" },
      { type: "Case Study", score: 72, attempts: 33, confidence: "Improving" },
      { type: "Drag and Drop", score: 75, attempts: 28, confidence: "Moderate" },
      { type: "Matrix / Cloze", score: 67, attempts: 19, confidence: "Developing" },
      { type: "Prioritization", score: 61, attempts: 74, confidence: "Needs focus" },
    ],
    growthTrend: [58, 61, 64, 68, 71, 74, 76, 78],
    recommendations: [
      { label: "Focus on Pharmacology and Prioritization over the next 5 sessions", priority: "High Priority" },
      { label: "Complete 2 NGN case studies in Pediatrics", priority: "Moderate Priority" },
      { label: "Review high-miss endocrine flashcards", priority: "High Priority" },
      { label: "Repeat moderate-difficulty SATA set", priority: "Quick Win" },
      { label: "Schedule a 75-question adaptive readiness check", priority: "Moderate Priority" },
    ],
    studyBehaviour: {
      averageSessionLength: "26 min",
      peakStudyWindow: "7:00 PM - 9:00 PM",
      weeklyConsistency: 89,
      dailyAverageQuestions: 43,
      reviewCompletionRate: 76,
    },
    confidenceMatrix: [
      { category: "Med-Surg", confidence: 82, performance: 81 },
      { category: "Fundamentals", confidence: 76, performance: 79 },
      { category: "Mental Health", confidence: 74, performance: 77 },
      { category: "Pediatrics", confidence: 68, performance: 74 },
      { category: "Maternity", confidence: 65, performance: 72 },
      { category: "Critical Thinking", confidence: 58, performance: 69 },
      { category: "Pharmacology", confidence: 52, performance: 62 },
      { category: "Leadership", confidence: 48, performance: 59 },
    ],
    weeklyActivity: [38, 42, 35, 48, 44, 51, 39, 45, 50, 47, 43, 52, 46, 40, 55, 48, 44, 42, 50, 53, 47, 38, 49, 51, 46, 43, 48, 52],
  },
  {
    id: "demo-rpn-aisha",
    name: "Aisha Chen",
    initials: "AC",
    track: "RPN / REx-PN",
    institution: "NurseNest Demo Learner",
    examDate: "2026-05-15",
    studyWindow: "Last 30 days",
    readinessScore: 82,
    predictedPassProbability: 89,
    adaptiveDifficultyLevel: 6.8,
    studyStreak: 24,
    questionsCompleted: 968,
    totalStudyHours: 38.2,
    overallAccuracy: 76,
    catSimulationsCompleted: 4,
    flashcardsReviewed: 714,
    lessonsCompleted: 22,
    strongestAreas: ["Wound Care", "Medication Administration", "Vital Signs", "Documentation"],
    weakestAreas: ["Pharmacology", "Mental Health Assessment", "IV Therapy", "Delegation"],
    categoryBreakdown: [
      { name: "Pharmacology", score: 68, questions: 178, status: "Improving", trend: "up" },
      { name: "Medical-Surgical", score: 84, questions: 256, status: "Strong", trend: "up" },
      { name: "Maternity", score: 76, questions: 88, status: "Stable", trend: "flat" },
      { name: "Pediatrics", score: 79, questions: 102, status: "Strong", trend: "up" },
      { name: "Mental Health", score: 71, questions: 82, status: "Improving", trend: "up" },
      { name: "Fundamentals", score: 86, questions: 162, status: "Mastered", trend: "up" },
      { name: "Leadership / Prioritization", score: 65, questions: 64, status: "Moderate", trend: "up" },
      { name: "Critical Thinking / NGN", score: 73, questions: 36, status: "Improving", trend: "up" },
    ],
    questionTypePerformance: [
      { type: "Multiple Choice", score: 82, attempts: 412, confidence: "High" },
      { type: "SATA", score: 70, attempts: 156, confidence: "Moderate" },
      { type: "Case Study", score: 74, attempts: 28, confidence: "Improving" },
      { type: "Drag and Drop", score: 78, attempts: 22, confidence: "High" },
      { type: "Prioritization", score: 66, attempts: 58, confidence: "Developing" },
    ],
    growthTrend: [62, 65, 68, 70, 73, 76, 79, 82],
    recommendations: [
      { label: "Continue Pharmacology review with spaced repetition", priority: "High Priority" },
      { label: "Complete mental health assessment practice set", priority: "Moderate Priority" },
      { label: "Review IV therapy calculations flashcards", priority: "High Priority" },
      { label: "Take a 50-question adaptive readiness check", priority: "Quick Win" },
    ],
    studyBehaviour: {
      averageSessionLength: "32 min",
      peakStudyWindow: "8:00 AM - 10:00 AM",
      weeklyConsistency: 94,
      dailyAverageQuestions: 36,
      reviewCompletionRate: 82,
    },
    confidenceMatrix: [
      { category: "Fundamentals", confidence: 88, performance: 86 },
      { category: "Med-Surg", confidence: 80, performance: 84 },
      { category: "Pediatrics", confidence: 74, performance: 79 },
      { category: "Maternity", confidence: 72, performance: 76 },
      { category: "Mental Health", confidence: 64, performance: 71 },
      { category: "Pharmacology", confidence: 58, performance: 68 },
      { category: "Leadership", confidence: 56, performance: 65 },
    ],
    weeklyActivity: [32, 36, 40, 38, 42, 35, 44, 40, 38, 45, 42, 36, 48, 44, 40, 38, 46, 42, 50, 44, 38, 42, 46, 48, 40, 44, 42, 46],
  },
  {
    id: "demo-np-marcus",
    name: "Marcus Rivera",
    initials: "MR",
    track: "NP / AANP-FNP",
    institution: "NurseNest Demo Learner",
    examDate: "2026-06-10",
    studyWindow: "Last 30 days",
    readinessScore: 71,
    predictedPassProbability: 76,
    adaptiveDifficultyLevel: 8.2,
    studyStreak: 12,
    questionsCompleted: 1562,
    totalStudyHours: 56.4,
    overallAccuracy: 68,
    catSimulationsCompleted: 8,
    flashcardsReviewed: 1248,
    lessonsCompleted: 34,
    strongestAreas: ["Primary Care Assessment", "Health Promotion", "Chronic Disease Management", "Diagnostic Ordering"],
    weakestAreas: ["Advanced Pharmacology", "Dermatology", "Women's Health", "Psychiatric Prescribing"],
    categoryBreakdown: [
      { name: "Advanced Pharmacology", score: 56, questions: 312, status: "Needs Review", trend: "up" },
      { name: "Primary Care", score: 82, questions: 286, status: "Strong", trend: "up" },
      { name: "Women's Health", score: 64, questions: 148, status: "Focus Area", trend: "flat" },
      { name: "Pediatrics", score: 72, questions: 168, status: "Improving", trend: "up" },
      { name: "Psychiatric / Mental Health", score: 61, questions: 124, status: "Needs Review", trend: "down" },
      { name: "Geriatrics", score: 78, questions: 196, status: "Strong", trend: "up" },
      { name: "Diagnostics & Imaging", score: 74, questions: 142, status: "Improving", trend: "up" },
      { name: "Professional Practice", score: 76, questions: 186, status: "Stable", trend: "flat" },
    ],
    questionTypePerformance: [
      { type: "Multiple Choice", score: 74, attempts: 624, confidence: "Moderate" },
      { type: "SATA", score: 58, attempts: 246, confidence: "Needs repetition" },
      { type: "Case Study", score: 66, attempts: 86, confidence: "Developing" },
      { type: "Bowtie", score: 62, attempts: 54, confidence: "Moderate" },
      { type: "Drag and Drop", score: 71, attempts: 38, confidence: "Moderate" },
      { type: "Prioritization", score: 64, attempts: 92, confidence: "Needs focus" },
    ],
    growthTrend: [52, 55, 58, 61, 64, 66, 69, 71],
    recommendations: [
      { label: "Intensive Advanced Pharmacology review over next 7 sessions", priority: "High Priority" },
      { label: "Complete Women's Health case study series", priority: "High Priority" },
      { label: "Review psychiatric prescribing guidelines flashcards", priority: "Moderate Priority" },
      { label: "Practice 3 SATA sets in diagnostics", priority: "Quick Win" },
      { label: "Schedule a full-length adaptive simulation exam", priority: "Moderate Priority" },
    ],
    studyBehaviour: {
      averageSessionLength: "38 min",
      peakStudyWindow: "9:00 PM - 11:00 PM",
      weeklyConsistency: 78,
      dailyAverageQuestions: 52,
      reviewCompletionRate: 68,
    },
    confidenceMatrix: [
      { category: "Primary Care", confidence: 80, performance: 82 },
      { category: "Geriatrics", confidence: 74, performance: 78 },
      { category: "Prof. Practice", confidence: 72, performance: 76 },
      { category: "Diagnostics", confidence: 66, performance: 74 },
      { category: "Pediatrics", confidence: 64, performance: 72 },
      { category: "Women's Health", confidence: 54, performance: 64 },
      { category: "Psych/MH", confidence: 50, performance: 61 },
      { category: "Adv. Pharm", confidence: 44, performance: 56 },
    ],
    weeklyActivity: [48, 52, 44, 56, 50, 42, 58, 54, 46, 60, 52, 48, 62, 56, 50, 44, 58, 52, 64, 56, 48, 52, 58, 60, 54, 50, 56, 62],
  },
];
