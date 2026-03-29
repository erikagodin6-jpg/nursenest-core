// Demo screenshot component - NOT real learner data.
// These profiles are hardcoded for marketing screenshots only.

export interface MockResultProfile {
  id: string;
  label: string;
  name: string;
  initials: string;
  track: string;
  institution: string;
  examTitle: string;
  examDate: string;
  examId: string;
  examMode: string;
  difficultyLabel: string;
  categoryTier: string;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  skipped: number;
  score: number;
  percentile: number;
  readinessScore: number;
  timeUsed: string;
  passed: boolean;
  badges: string[];
  domainBreakdown: {
    domain: string;
    correctPct: number;
    avgTime: string;
    benchmark: number;
    status: "above" | "at" | "below";
  }[];
  aiSummary: string;
  scoreTrend: { week: string; score: number }[];
  categoryPerformance: { category: string; score: number; color: string }[];
  readinessDonut: { label: string; value: number; color: string }[];
  stats: {
    studyStreak: number;
    totalQuestions: number;
    questionsThisWeek: number;
    strongestSubject: string;
    weakestSubject: string;
    avgExamTime: string;
    confidenceScore: number;
  };
  recentActivity: {
    date: string;
    action: string;
    detail: string;
    type: "exam" | "study" | "milestone" | "review";
  }[];
  recommendations: {
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }[];
  nextBestLessons: { title: string; category: string; estimatedTime: string }[];
}

export const mockResultProfiles: MockResultProfile[] = [
  {
    id: "high-performer",
    label: "High Performer",
    name: "Sarah Mitchell",
    initials: "SM",
    track: "RN / NCLEX-RN",
    institution: "NurseNest Demo",
    examTitle: "NCLEX-RN Adaptive Readiness Exam",
    examDate: "Mar 10, 2026",
    examId: "NRN-2026-0412",
    examMode: "Adaptive CAT",
    difficultyLabel: "Above Average",
    categoryTier: "Tier 3 — Advanced",
    totalQuestions: 145,
    correct: 126,
    incorrect: 14,
    skipped: 5,
    score: 87,
    percentile: 94,
    readinessScore: 91,
    timeUsed: "2h 48m",
    passed: true,
    badges: ["Above Average", "Exam Ready", "Top 10%", "Pharmacology Pro", "Critical Thinker"],
    domainBreakdown: [
      { domain: "Management of Care", correctPct: 92, avgTime: "1:12", benchmark: 78, status: "above" },
      { domain: "Safety & Infection Control", correctPct: 89, avgTime: "1:05", benchmark: 75, status: "above" },
      { domain: "Health Promotion", correctPct: 85, avgTime: "1:18", benchmark: 72, status: "above" },
      { domain: "Psychosocial Integrity", correctPct: 88, avgTime: "1:10", benchmark: 74, status: "above" },
      { domain: "Basic Care & Comfort", correctPct: 91, avgTime: "0:58", benchmark: 76, status: "above" },
      { domain: "Pharmacological Therapies", correctPct: 84, avgTime: "1:22", benchmark: 70, status: "above" },
      { domain: "Reduction of Risk Potential", correctPct: 86, avgTime: "1:15", benchmark: 73, status: "above" },
      { domain: "Physiological Adaptation", correctPct: 83, avgTime: "1:25", benchmark: 71, status: "above" },
    ],
    aiSummary: "Sarah demonstrates exceptional clinical reasoning across all NCLEX-RN domains. Her strongest performance is in Management of Care (92%) and Basic Care & Comfort (91%), both well above national benchmarks. Time management is efficient with an average of 1:12 per question. Recommend maintaining current study pace with targeted review of Physiological Adaptation to push above 85%. Overall, Sarah is exam-ready with a high probability of first-attempt pass.",
    scoreTrend: [
      { week: "W1", score: 72 }, { week: "W2", score: 75 }, { week: "W3", score: 78 },
      { week: "W4", score: 80 }, { week: "W5", score: 83 }, { week: "W6", score: 85 },
      { week: "W7", score: 86 }, { week: "W8", score: 87 },
    ],
    categoryPerformance: [
      { category: "Med-Surg", score: 90, color: "#8b5cf6" },
      { category: "Pharmacology", score: 84, color: "#06b6d4" },
      { category: "Pediatrics", score: 88, color: "#10b981" },
      { category: "Maternity", score: 86, color: "#f59e0b" },
      { category: "Mental Health", score: 88, color: "#ec4899" },
      { category: "Fundamentals", score: 91, color: "#6366f1" },
    ],
    readinessDonut: [
      { label: "Mastered", value: 62, color: "#10b981" },
      { label: "Proficient", value: 25, color: "#8b5cf6" },
      { label: "Developing", value: 10, color: "#f59e0b" },
      { label: "Needs Review", value: 3, color: "#ef4444" },
    ],
    stats: {
      studyStreak: 28,
      totalQuestions: 2847,
      questionsThisWeek: 186,
      strongestSubject: "Management of Care",
      weakestSubject: "Physiological Adaptation",
      avgExamTime: "2h 45m",
      confidenceScore: 89,
    },
    recentActivity: [
      { date: "Mar 10", action: "Completed Exam", detail: "NCLEX-RN Readiness — 87% score", type: "exam" },
      { date: "Mar 9", action: "Study Session", detail: "Pharmacology review — 42 questions", type: "study" },
      { date: "Mar 8", action: "Milestone", detail: "Reached 28-day study streak!", type: "milestone" },
      { date: "Mar 7", action: "Weak Area Review", detail: "Physiological Adaptation — 35 questions", type: "review" },
      { date: "Mar 6", action: "Completed Exam", detail: "Practice CAT #5 — 85% score", type: "exam" },
    ],
    recommendations: [
      { title: "Review Physiological Adaptation", description: "Focus on fluid & electrolyte imbalances and acid-base disorders", priority: "medium" },
      { title: "Complete NGN Case Studies", description: "Practice 3 bowtie items in advanced pharmacology", priority: "low" },
      { title: "Take Final Readiness Exam", description: "Schedule full-length 145-question adaptive simulation", priority: "low" },
    ],
    nextBestLessons: [
      { title: "Acid-Base Balance Mastery", category: "Physiological Adaptation", estimatedTime: "25 min" },
      { title: "Advanced Pharmacokinetics", category: "Pharmacology", estimatedTime: "30 min" },
      { title: "NGN Clinical Judgment Practice", category: "Critical Thinking", estimatedTime: "20 min" },
    ],
  },
  {
    id: "borderline-pass",
    label: "Borderline Pass",
    name: "James Rodriguez",
    initials: "JR",
    track: "RN / NCLEX-RN",
    institution: "NurseNest Demo",
    examTitle: "NCLEX-RN Practice Readiness",
    examDate: "Mar 8, 2026",
    examId: "NRN-2026-0398",
    examMode: "Standard Timed",
    difficultyLabel: "Standard",
    categoryTier: "Tier 2 — Intermediate",
    totalQuestions: 130,
    correct: 89,
    incorrect: 34,
    skipped: 7,
    score: 68,
    percentile: 52,
    readinessScore: 65,
    timeUsed: "3h 12m",
    passed: true,
    badges: ["Borderline Pass", "Improving", "Steady Effort"],
    domainBreakdown: [
      { domain: "Management of Care", correctPct: 72, avgTime: "1:28", benchmark: 78, status: "below" },
      { domain: "Safety & Infection Control", correctPct: 74, avgTime: "1:15", benchmark: 75, status: "at" },
      { domain: "Health Promotion", correctPct: 70, avgTime: "1:32", benchmark: 72, status: "at" },
      { domain: "Psychosocial Integrity", correctPct: 66, avgTime: "1:35", benchmark: 74, status: "below" },
      { domain: "Basic Care & Comfort", correctPct: 75, avgTime: "1:10", benchmark: 76, status: "at" },
      { domain: "Pharmacological Therapies", correctPct: 58, avgTime: "1:45", benchmark: 70, status: "below" },
      { domain: "Reduction of Risk Potential", correctPct: 64, avgTime: "1:38", benchmark: 73, status: "below" },
      { domain: "Physiological Adaptation", correctPct: 62, avgTime: "1:42", benchmark: 71, status: "below" },
    ],
    aiSummary: "James is performing at the borderline passing threshold. While Safety & Infection Control (74%) and Basic Care & Comfort (75%) are near benchmark, Pharmacological Therapies (58%) and Physiological Adaptation (62%) need significant improvement. Time per question averages 1:28, slightly above target. Recommend intensive pharmacology drills and prioritization practice over the next 2 weeks to strengthen readiness.",
    scoreTrend: [
      { week: "W1", score: 54 }, { week: "W2", score: 58 }, { week: "W3", score: 60 },
      { week: "W4", score: 62 }, { week: "W5", score: 64 }, { week: "W6", score: 66 },
      { week: "W7", score: 67 }, { week: "W8", score: 68 },
    ],
    categoryPerformance: [
      { category: "Med-Surg", score: 70, color: "#8b5cf6" },
      { category: "Pharmacology", score: 58, color: "#06b6d4" },
      { category: "Pediatrics", score: 66, color: "#10b981" },
      { category: "Maternity", score: 72, color: "#f59e0b" },
      { category: "Mental Health", score: 66, color: "#ec4899" },
      { category: "Fundamentals", score: 75, color: "#6366f1" },
    ],
    readinessDonut: [
      { label: "Mastered", value: 28, color: "#10b981" },
      { label: "Proficient", value: 32, color: "#8b5cf6" },
      { label: "Developing", value: 25, color: "#f59e0b" },
      { label: "Needs Review", value: 15, color: "#ef4444" },
    ],
    stats: {
      studyStreak: 14,
      totalQuestions: 1562,
      questionsThisWeek: 98,
      strongestSubject: "Basic Care & Comfort",
      weakestSubject: "Pharmacological Therapies",
      avgExamTime: "3h 10m",
      confidenceScore: 62,
    },
    recentActivity: [
      { date: "Mar 8", action: "Completed Exam", detail: "Practice Readiness — 68% score", type: "exam" },
      { date: "Mar 7", action: "Study Session", detail: "Pharmacology — 28 questions", type: "study" },
      { date: "Mar 6", action: "Weak Area Review", detail: "Prioritization drills — 20 questions", type: "review" },
      { date: "Mar 5", action: "Study Session", detail: "Med-Surg review — 35 questions", type: "study" },
      { date: "Mar 4", action: "Milestone", detail: "Reached 14-day study streak", type: "milestone" },
    ],
    recommendations: [
      { title: "Intensive Pharmacology Review", description: "Focus on drug classifications, dosage calculations, and adverse effects", priority: "high" },
      { title: "Prioritization Practice", description: "Complete 50 delegation and prioritization questions", priority: "high" },
      { title: "Physiological Adaptation Drills", description: "Review fluid balance and hemodynamic monitoring", priority: "medium" },
    ],
    nextBestLessons: [
      { title: "Pharmacology Drug Classes Review", category: "Pharmacology", estimatedTime: "35 min" },
      { title: "Delegation & Prioritization", category: "Management of Care", estimatedTime: "25 min" },
      { title: "Fluid & Electrolyte Balance", category: "Physiological Adaptation", estimatedTime: "30 min" },
    ],
  },
  {
    id: "needs-improvement",
    label: "Needs Improvement",
    name: "Taylor Kim",
    initials: "TK",
    track: "RN / NCLEX-RN",
    institution: "NurseNest Demo",
    examTitle: "NCLEX-RN Diagnostic Assessment",
    examDate: "Mar 5, 2026",
    examId: "NRN-2026-0371",
    examMode: "Diagnostic",
    difficultyLabel: "Standard",
    categoryTier: "Tier 1 — Foundational",
    totalQuestions: 100,
    correct: 52,
    incorrect: 40,
    skipped: 8,
    score: 52,
    percentile: 24,
    readinessScore: 42,
    timeUsed: "2h 55m",
    passed: false,
    badges: ["Needs Focus", "Early Stage", "Growth Potential"],
    domainBreakdown: [
      { domain: "Management of Care", correctPct: 55, avgTime: "1:48", benchmark: 78, status: "below" },
      { domain: "Safety & Infection Control", correctPct: 58, avgTime: "1:35", benchmark: 75, status: "below" },
      { domain: "Health Promotion", correctPct: 54, avgTime: "1:52", benchmark: 72, status: "below" },
      { domain: "Psychosocial Integrity", correctPct: 50, avgTime: "1:55", benchmark: 74, status: "below" },
      { domain: "Basic Care & Comfort", correctPct: 60, avgTime: "1:30", benchmark: 76, status: "below" },
      { domain: "Pharmacological Therapies", correctPct: 42, avgTime: "2:05", benchmark: 70, status: "below" },
      { domain: "Reduction of Risk Potential", correctPct: 48, avgTime: "1:58", benchmark: 73, status: "below" },
      { domain: "Physiological Adaptation", correctPct: 46, avgTime: "2:02", benchmark: 71, status: "below" },
    ],
    aiSummary: "Taylor is in the early stages of exam preparation. All domains are below national benchmarks, with Pharmacological Therapies (42%) and Physiological Adaptation (46%) as the most critical areas. Time management needs attention — averaging 1:48 per question. A structured 6-week study plan focusing on fundamentals first, then building toward clinical application, is strongly recommended. Daily 30-question practice sessions with spaced repetition will accelerate improvement.",
    scoreTrend: [
      { week: "W1", score: 38 }, { week: "W2", score: 42 }, { week: "W3", score: 44 },
      { week: "W4", score: 46 }, { week: "W5", score: 48 }, { week: "W6", score: 50 },
      { week: "W7", score: 51 }, { week: "W8", score: 52 },
    ],
    categoryPerformance: [
      { category: "Med-Surg", score: 52, color: "#8b5cf6" },
      { category: "Pharmacology", score: 42, color: "#06b6d4" },
      { category: "Pediatrics", score: 48, color: "#10b981" },
      { category: "Maternity", score: 54, color: "#f59e0b" },
      { category: "Mental Health", score: 50, color: "#ec4899" },
      { category: "Fundamentals", score: 60, color: "#6366f1" },
    ],
    readinessDonut: [
      { label: "Mastered", value: 8, color: "#10b981" },
      { label: "Proficient", value: 18, color: "#8b5cf6" },
      { label: "Developing", value: 34, color: "#f59e0b" },
      { label: "Needs Review", value: 40, color: "#ef4444" },
    ],
    stats: {
      studyStreak: 5,
      totalQuestions: 624,
      questionsThisWeek: 45,
      strongestSubject: "Basic Care & Comfort",
      weakestSubject: "Pharmacological Therapies",
      avgExamTime: "3h 05m",
      confidenceScore: 38,
    },
    recentActivity: [
      { date: "Mar 5", action: "Completed Exam", detail: "Diagnostic Assessment — 52% score", type: "exam" },
      { date: "Mar 4", action: "Study Session", detail: "Fundamentals review — 20 questions", type: "study" },
      { date: "Mar 3", action: "Study Session", detail: "Basic Care — 18 questions", type: "study" },
      { date: "Mar 2", action: "Weak Area Review", detail: "Pharmacology basics — 15 questions", type: "review" },
      { date: "Mar 1", action: "Milestone", detail: "Started 6-week study plan", type: "milestone" },
    ],
    recommendations: [
      { title: "Build Pharmacology Foundation", description: "Start with drug class fundamentals and common medications", priority: "high" },
      { title: "Fundamentals Reinforcement", description: "Review nursing process, vital signs, and basic assessment", priority: "high" },
      { title: "Daily Practice Routine", description: "Complete 30 questions daily with rationale review", priority: "high" },
    ],
    nextBestLessons: [
      { title: "Nursing Process Fundamentals", category: "Fundamentals", estimatedTime: "20 min" },
      { title: "Common Drug Classes Overview", category: "Pharmacology", estimatedTime: "35 min" },
      { title: "Basic Assessment Skills", category: "Health Promotion", estimatedTime: "25 min" },
    ],
  },
  {
    id: "pediatric-focus",
    label: "Pediatric Focus",
    name: "Emily Nguyen",
    initials: "EN",
    track: "RN / NCLEX-RN",
    institution: "NurseNest Demo",
    examTitle: "Pediatric Nursing Specialty Exam",
    examDate: "Mar 7, 2026",
    examId: "PED-2026-0088",
    examMode: "Specialty Focus",
    difficultyLabel: "Advanced",
    categoryTier: "Tier 3 — Specialty",
    totalQuestions: 85,
    correct: 68,
    incorrect: 14,
    skipped: 3,
    score: 80,
    percentile: 82,
    readinessScore: 78,
    timeUsed: "1h 52m",
    passed: true,
    badges: ["Pediatric Specialist", "Above Average", "Quick Responder"],
    domainBreakdown: [
      { domain: "Growth & Development", correctPct: 88, avgTime: "1:02", benchmark: 76, status: "above" },
      { domain: "Pediatric Pharmacology", correctPct: 74, avgTime: "1:25", benchmark: 72, status: "above" },
      { domain: "Respiratory Disorders", correctPct: 82, avgTime: "1:08", benchmark: 74, status: "above" },
      { domain: "Cardiac Conditions", correctPct: 78, avgTime: "1:18", benchmark: 73, status: "above" },
      { domain: "GI & Nutrition", correctPct: 85, avgTime: "1:00", benchmark: 75, status: "above" },
      { domain: "Infectious Diseases", correctPct: 80, avgTime: "1:12", benchmark: 74, status: "above" },
      { domain: "Neurological Conditions", correctPct: 76, avgTime: "1:22", benchmark: 72, status: "above" },
      { domain: "Emergency Pediatrics", correctPct: 72, avgTime: "1:30", benchmark: 70, status: "above" },
    ],
    aiSummary: "Emily shows strong pediatric nursing competency with particular strength in Growth & Development (88%) and GI & Nutrition (85%). Pediatric Pharmacology (74%) and Emergency Pediatrics (72%) are areas for continued focus. Her time efficiency is excellent, averaging 1:08 per question. She is well-positioned for pediatric specialty certification with targeted review in emergency protocols.",
    scoreTrend: [
      { week: "W1", score: 64 }, { week: "W2", score: 68 }, { week: "W3", score: 72 },
      { week: "W4", score: 74 }, { week: "W5", score: 76 }, { week: "W6", score: 78 },
      { week: "W7", score: 79 }, { week: "W8", score: 80 },
    ],
    categoryPerformance: [
      { category: "Growth/Dev", score: 88, color: "#8b5cf6" },
      { category: "Ped Pharm", score: 74, color: "#06b6d4" },
      { category: "Respiratory", score: 82, color: "#10b981" },
      { category: "Cardiac", score: 78, color: "#f59e0b" },
      { category: "GI/Nutrition", score: 85, color: "#ec4899" },
      { category: "Emergency", score: 72, color: "#6366f1" },
    ],
    readinessDonut: [
      { label: "Mastered", value: 45, color: "#10b981" },
      { label: "Proficient", value: 30, color: "#8b5cf6" },
      { label: "Developing", value: 18, color: "#f59e0b" },
      { label: "Needs Review", value: 7, color: "#ef4444" },
    ],
    stats: {
      studyStreak: 21,
      totalQuestions: 1846,
      questionsThisWeek: 142,
      strongestSubject: "Growth & Development",
      weakestSubject: "Emergency Pediatrics",
      avgExamTime: "1h 50m",
      confidenceScore: 76,
    },
    recentActivity: [
      { date: "Mar 7", action: "Completed Exam", detail: "Pediatric Specialty — 80% score", type: "exam" },
      { date: "Mar 6", action: "Study Session", detail: "Pediatric pharmacology — 30 questions", type: "study" },
      { date: "Mar 5", action: "Milestone", detail: "Completed pediatric case study series", type: "milestone" },
      { date: "Mar 4", action: "Weak Area Review", detail: "Emergency protocols — 22 questions", type: "review" },
      { date: "Mar 3", action: "Study Session", detail: "Respiratory disorders — 28 questions", type: "study" },
    ],
    recommendations: [
      { title: "Emergency Pediatrics Deep Dive", description: "Focus on pediatric emergency triage, resuscitation protocols", priority: "medium" },
      { title: "Pediatric Pharmacology Drills", description: "Weight-based dosage calculations and age-specific medications", priority: "medium" },
      { title: "Case Study Practice", description: "Complete 5 complex pediatric case studies", priority: "low" },
    ],
    nextBestLessons: [
      { title: "Pediatric Emergency Triage", category: "Emergency Pediatrics", estimatedTime: "30 min" },
      { title: "Weight-Based Dosing Calculations", category: "Pediatric Pharmacology", estimatedTime: "25 min" },
      { title: "Cardiac Defects in Neonates", category: "Cardiac Conditions", estimatedTime: "20 min" },
    ],
  },
  {
    id: "nclex-rn-demo",
    label: "NCLEX RN Demo",
    name: "Olivia Martin",
    initials: "OM",
    track: "RN / NCLEX-RN",
    institution: "NurseNest Demo",
    examTitle: "NCLEX-RN Full Practice Simulation",
    examDate: "Mar 11, 2026",
    examId: "NRN-2026-0425",
    examMode: "Adaptive CAT",
    difficultyLabel: "Progressive",
    categoryTier: "Tier 2 — Intermediate",
    totalQuestions: 135,
    correct: 101,
    incorrect: 28,
    skipped: 6,
    score: 75,
    percentile: 68,
    readinessScore: 73,
    timeUsed: "3h 02m",
    passed: true,
    badges: ["On Track", "Steady Progress", "Improving"],
    domainBreakdown: [
      { domain: "Management of Care", correctPct: 78, avgTime: "1:22", benchmark: 78, status: "at" },
      { domain: "Safety & Infection Control", correctPct: 80, avgTime: "1:10", benchmark: 75, status: "above" },
      { domain: "Health Promotion", correctPct: 72, avgTime: "1:28", benchmark: 72, status: "at" },
      { domain: "Psychosocial Integrity", correctPct: 74, avgTime: "1:25", benchmark: 74, status: "at" },
      { domain: "Basic Care & Comfort", correctPct: 82, avgTime: "1:02", benchmark: 76, status: "above" },
      { domain: "Pharmacological Therapies", correctPct: 66, avgTime: "1:38", benchmark: 70, status: "below" },
      { domain: "Reduction of Risk Potential", correctPct: 70, avgTime: "1:30", benchmark: 73, status: "below" },
      { domain: "Physiological Adaptation", correctPct: 68, avgTime: "1:35", benchmark: 71, status: "below" },
    ],
    aiSummary: "Olivia is making consistent progress toward NCLEX-RN readiness. Her strengths in Safety & Infection Control (80%) and Basic Care & Comfort (82%) provide a solid foundation. Pharmacological Therapies (66%) remains the primary area for improvement. Her adaptive difficulty has been steadily increasing, indicating genuine learning gains. With focused pharmacology review and 2-3 more adaptive simulations, she should cross the high-readiness threshold.",
    scoreTrend: [
      { week: "W1", score: 58 }, { week: "W2", score: 62 }, { week: "W3", score: 65 },
      { week: "W4", score: 68 }, { week: "W5", score: 70 }, { week: "W6", score: 72 },
      { week: "W7", score: 74 }, { week: "W8", score: 75 },
    ],
    categoryPerformance: [
      { category: "Med-Surg", score: 76, color: "#8b5cf6" },
      { category: "Pharmacology", score: 66, color: "#06b6d4" },
      { category: "Pediatrics", score: 74, color: "#10b981" },
      { category: "Maternity", score: 72, color: "#f59e0b" },
      { category: "Mental Health", score: 74, color: "#ec4899" },
      { category: "Fundamentals", score: 82, color: "#6366f1" },
    ],
    readinessDonut: [
      { label: "Mastered", value: 35, color: "#10b981" },
      { label: "Proficient", value: 30, color: "#8b5cf6" },
      { label: "Developing", value: 22, color: "#f59e0b" },
      { label: "Needs Review", value: 13, color: "#ef4444" },
    ],
    stats: {
      studyStreak: 18,
      totalQuestions: 1842,
      questionsThisWeek: 124,
      strongestSubject: "Basic Care & Comfort",
      weakestSubject: "Pharmacological Therapies",
      avgExamTime: "3h 00m",
      confidenceScore: 71,
    },
    recentActivity: [
      { date: "Mar 11", action: "Completed Exam", detail: "Full Practice Simulation — 75% score", type: "exam" },
      { date: "Mar 10", action: "Study Session", detail: "Pharmacology drills — 38 questions", type: "study" },
      { date: "Mar 9", action: "Weak Area Review", detail: "Risk Potential — 25 questions", type: "review" },
      { date: "Mar 8", action: "Milestone", detail: "Reached 18-day study streak", type: "milestone" },
      { date: "Mar 7", action: "Study Session", detail: "Med-Surg review — 32 questions", type: "study" },
    ],
    recommendations: [
      { title: "Pharmacology Intensive", description: "Complete 100-question pharmacology focused set over next 3 days", priority: "high" },
      { title: "Risk Reduction Practice", description: "Review lab values, diagnostic procedures, and safety protocols", priority: "medium" },
      { title: "Adaptive Simulation", description: "Take another full-length CAT to track improvement", priority: "medium" },
    ],
    nextBestLessons: [
      { title: "High-Risk Medications Review", category: "Pharmacology", estimatedTime: "30 min" },
      { title: "Lab Values Interpretation", category: "Reduction of Risk", estimatedTime: "25 min" },
      { title: "Delegation Scenarios", category: "Management of Care", estimatedTime: "20 min" },
    ],
  },
  {
    id: "rpn-demo",
    label: "RPN Demo",
    name: "Aisha Chen",
    initials: "AC",
    track: "RPN / REx-PN",
    institution: "NurseNest Demo",
    examTitle: "REx-PN Readiness Assessment",
    examDate: "Mar 9, 2026",
    examId: "RPN-2026-0156",
    examMode: "Adaptive CAT",
    difficultyLabel: "Standard",
    categoryTier: "Tier 2 — Intermediate",
    totalQuestions: 110,
    correct: 88,
    incorrect: 18,
    skipped: 4,
    score: 80,
    percentile: 78,
    readinessScore: 82,
    timeUsed: "2h 15m",
    passed: true,
    badges: ["Above Average", "Consistent", "On Track"],
    domainBreakdown: [
      { domain: "Professional Practice", correctPct: 84, avgTime: "1:08", benchmark: 76, status: "above" },
      { domain: "Foundations of Practice", correctPct: 86, avgTime: "1:02", benchmark: 78, status: "above" },
      { domain: "Collaborative Practice", correctPct: 82, avgTime: "1:12", benchmark: 74, status: "above" },
      { domain: "Health Assessment", correctPct: 78, avgTime: "1:18", benchmark: 75, status: "above" },
      { domain: "Pharmacology", correctPct: 72, avgTime: "1:28", benchmark: 72, status: "at" },
      { domain: "Clinical Judgment", correctPct: 76, avgTime: "1:22", benchmark: 73, status: "above" },
    ],
    aiSummary: "Aisha demonstrates strong RPN competency with above-benchmark performance in most domains. Foundations of Practice (86%) and Professional Practice (84%) are clear strengths. Pharmacology (72%) is at benchmark but has room for improvement. Her study consistency (94% weekly) is exemplary. Recommend targeted pharmacology review and continued clinical judgment practice to solidify readiness for the REx-PN.",
    scoreTrend: [
      { week: "W1", score: 62 }, { week: "W2", score: 66 }, { week: "W3", score: 70 },
      { week: "W4", score: 73 }, { week: "W5", score: 76 }, { week: "W6", score: 78 },
      { week: "W7", score: 79 }, { week: "W8", score: 80 },
    ],
    categoryPerformance: [
      { category: "Prof. Practice", score: 84, color: "#8b5cf6" },
      { category: "Foundations", score: 86, color: "#06b6d4" },
      { category: "Collaborative", score: 82, color: "#10b981" },
      { category: "Assessment", score: 78, color: "#f59e0b" },
      { category: "Pharmacology", score: 72, color: "#ec4899" },
      { category: "Clinical Judgment", score: 76, color: "#6366f1" },
    ],
    readinessDonut: [
      { label: "Mastered", value: 48, color: "#10b981" },
      { label: "Proficient", value: 28, color: "#8b5cf6" },
      { label: "Developing", value: 16, color: "#f59e0b" },
      { label: "Needs Review", value: 8, color: "#ef4444" },
    ],
    stats: {
      studyStreak: 24,
      totalQuestions: 1248,
      questionsThisWeek: 108,
      strongestSubject: "Foundations of Practice",
      weakestSubject: "Pharmacology",
      avgExamTime: "2h 12m",
      confidenceScore: 78,
    },
    recentActivity: [
      { date: "Mar 9", action: "Completed Exam", detail: "REx-PN Readiness — 80% score", type: "exam" },
      { date: "Mar 8", action: "Study Session", detail: "Pharmacology review — 32 questions", type: "study" },
      { date: "Mar 7", action: "Milestone", detail: "Completed all foundation modules", type: "milestone" },
      { date: "Mar 6", action: "Weak Area Review", detail: "IV therapy calculations — 18 questions", type: "review" },
      { date: "Mar 5", action: "Study Session", detail: "Clinical judgment — 26 questions", type: "study" },
    ],
    recommendations: [
      { title: "Pharmacology Review", description: "Focus on medication administration and common drug interactions", priority: "medium" },
      { title: "Clinical Judgment Practice", description: "Complete 3 case-based clinical judgment scenarios", priority: "medium" },
      { title: "Full-Length Practice Exam", description: "Take another adaptive readiness simulation", priority: "low" },
    ],
    nextBestLessons: [
      { title: "Medication Administration Safety", category: "Pharmacology", estimatedTime: "25 min" },
      { title: "Clinical Judgment Framework", category: "Clinical Judgment", estimatedTime: "20 min" },
      { title: "Wound Care Assessment", category: "Foundations", estimatedTime: "15 min" },
    ],
  },
  {
    id: "np-demo",
    label: "NP Demo",
    name: "Marcus Rivera",
    initials: "MR",
    track: "NP / AANP-FNP",
    institution: "NurseNest Demo",
    examTitle: "FNP Certification Practice Exam",
    examDate: "Mar 12, 2026",
    examId: "FNP-2026-0074",
    examMode: "Standard Timed",
    difficultyLabel: "Advanced",
    categoryTier: "Tier 3 — Advanced",
    totalQuestions: 150,
    correct: 108,
    incorrect: 36,
    skipped: 6,
    score: 72,
    percentile: 64,
    readinessScore: 71,
    timeUsed: "3h 28m",
    passed: true,
    badges: ["Improving", "Steady Effort", "Advanced Track"],
    domainBreakdown: [
      { domain: "Assessment & Diagnosis", correctPct: 78, avgTime: "1:18", benchmark: 76, status: "above" },
      { domain: "Clinical Management", correctPct: 74, avgTime: "1:25", benchmark: 74, status: "at" },
      { domain: "Pharmacology / Prescribing", correctPct: 62, avgTime: "1:42", benchmark: 72, status: "below" },
      { domain: "Health Promotion", correctPct: 76, avgTime: "1:15", benchmark: 73, status: "above" },
      { domain: "Professional Practice", correctPct: 80, avgTime: "1:08", benchmark: 75, status: "above" },
      { domain: "Research & EBP", correctPct: 72, avgTime: "1:20", benchmark: 70, status: "above" },
    ],
    aiSummary: "Marcus is progressing well in his FNP certification preparation. Professional Practice (80%) and Assessment & Diagnosis (78%) are above benchmark. Pharmacology / Prescribing (62%) remains the primary challenge — advanced pharmacokinetics and psychiatric prescribing need focused attention. His breadth of knowledge is strong but depth in pharmacology needs reinforcement. Recommend intensive prescribing scenarios and drug interaction practice.",
    scoreTrend: [
      { week: "W1", score: 52 }, { week: "W2", score: 56 }, { week: "W3", score: 60 },
      { week: "W4", score: 64 }, { week: "W5", score: 66 }, { week: "W6", score: 69 },
      { week: "W7", score: 71 }, { week: "W8", score: 72 },
    ],
    categoryPerformance: [
      { category: "Assessment", score: 78, color: "#8b5cf6" },
      { category: "Clinical Mgmt", score: 74, color: "#06b6d4" },
      { category: "Pharmacology", score: 62, color: "#10b981" },
      { category: "Health Promo", score: 76, color: "#f59e0b" },
      { category: "Prof. Practice", score: 80, color: "#ec4899" },
      { category: "Research/EBP", score: 72, color: "#6366f1" },
    ],
    readinessDonut: [
      { label: "Mastered", value: 30, color: "#10b981" },
      { label: "Proficient", value: 28, color: "#8b5cf6" },
      { label: "Developing", value: 26, color: "#f59e0b" },
      { label: "Needs Review", value: 16, color: "#ef4444" },
    ],
    stats: {
      studyStreak: 12,
      totalQuestions: 2156,
      questionsThisWeek: 156,
      strongestSubject: "Professional Practice",
      weakestSubject: "Pharmacology / Prescribing",
      avgExamTime: "3h 25m",
      confidenceScore: 68,
    },
    recentActivity: [
      { date: "Mar 12", action: "Completed Exam", detail: "FNP Practice Exam — 72% score", type: "exam" },
      { date: "Mar 11", action: "Study Session", detail: "Advanced pharmacology — 45 questions", type: "study" },
      { date: "Mar 10", action: "Weak Area Review", detail: "Psychiatric prescribing — 20 questions", type: "review" },
      { date: "Mar 9", action: "Study Session", detail: "Assessment & Diagnosis — 38 questions", type: "study" },
      { date: "Mar 8", action: "Milestone", detail: "Completed 2000+ total questions", type: "milestone" },
    ],
    recommendations: [
      { title: "Advanced Pharmacology Deep Dive", description: "Focus on prescribing protocols, drug interactions, and pharmacokinetics", priority: "high" },
      { title: "Prescribing Scenarios", description: "Complete 30 prescribing case studies with rationales", priority: "high" },
      { title: "Clinical Management Review", description: "Practice differential diagnosis and treatment planning", priority: "medium" },
    ],
    nextBestLessons: [
      { title: "Advanced Pharmacokinetics", category: "Pharmacology", estimatedTime: "35 min" },
      { title: "Psychiatric Prescribing Guidelines", category: "Clinical Management", estimatedTime: "30 min" },
      { title: "EBP in Primary Care", category: "Research & EBP", estimatedTime: "20 min" },
    ],
  },
];
