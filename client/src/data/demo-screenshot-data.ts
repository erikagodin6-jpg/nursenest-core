// Demo screenshot data - NOT real learner data.
// All data is hardcoded for marketing screenshots only.

export const examReviewData = {
  sessionType: "Adaptive Readiness Check",
  score: 74,
  totalQuestions: 75,
  correctAnswers: 56,
  timeUsed: "1h 32m",
  avgTimePerQuestion: "1m 13s",
  difficultyMix: "High Adaptive",
  readinessInterpretation: "Borderline but improving",
  percentileRank: 72,
  passReadiness: "Approaching",
  categoryResults: [
    { name: "Medical-Surgical", correct: 18, total: 22, pct: 82 },
    { name: "Pharmacology", correct: 8, total: 14, pct: 57 },
    { name: "Maternity", correct: 6, total: 8, pct: 75 },
    { name: "Pediatrics", correct: 7, total: 9, pct: 78 },
    { name: "Mental Health", correct: 5, total: 6, pct: 83 },
    { name: "Fundamentals", correct: 5, total: 6, pct: 83 },
    { name: "Leadership", correct: 4, total: 7, pct: 57 },
    { name: "Critical Thinking", correct: 3, total: 3, pct: 100 },
  ],
  questionTypeResults: [
    { type: "Multiple Choice", correct: 24, total: 30, pct: 80 },
    { type: "SATA", correct: 12, total: 20, pct: 60 },
    { type: "Prioritization", correct: 6, total: 10, pct: 60 },
    { type: "Case Study", correct: 5, total: 6, pct: 83 },
    { type: "Bowtie", correct: 4, total: 5, pct: 80 },
    { type: "Drag and Drop", correct: 5, total: 4, pct: 100 },
  ],
  commonMisses: [
    "Delegation and prioritization of care",
    "Insulin onset and peak timing",
    "Pediatric respiratory priority interventions",
    "Anticoagulant reversal agents",
    "Electrolyte imbalance interventions",
  ],
  reviewNext: [
    { label: "Delegation & Prioritization", type: "lesson" },
    { label: "Insulin Administration", type: "flashcards" },
    { label: "Pediatric Respiratory Care", type: "lesson" },
    { label: "Anticoagulant Pharmacology", type: "flashcards" },
  ],
  confidenceBreakdown: [
    { label: "Confident & Correct", pct: 58, color: "#6ee7b7" },
    { label: "Confident & Incorrect", pct: 12, color: "#fbbf24" },
    { label: "Unsure & Correct", pct: 18, color: "#93c5fd" },
    { label: "Unsure & Incorrect", pct: 12, color: "#fca5a5" },
  ],
  timeDistribution: [
    { range: "< 30s", count: 8 },
    { range: "30-60s", count: 22 },
    { range: "1-2 min", count: 28 },
    { range: "2-3 min", count: 12 },
    { range: "> 3 min", count: 5 },
  ],
};

export const flashcardMasteryData = {
  deckTitle: "Pharmacology Essentials",
  totalCards: 240,
  mastered: 156,
  inProgress: 58,
  needsReview: 26,
  retentionEstimate: 82,
  reviewStreak: 12,
  dueToday: 34,
  studySessions: 48,
  avgSessionCards: 18,
  topicMastery: [
    { topic: "Cardiac Medications", mastered: 28, total: 32, pct: 88 },
    { topic: "Antibiotics", mastered: 22, total: 28, pct: 79 },
    { topic: "Pain Management", mastered: 20, total: 24, pct: 83 },
    { topic: "Insulin & Diabetes", mastered: 14, total: 22, pct: 64 },
    { topic: "Anticoagulants", mastered: 16, total: 20, pct: 80 },
    { topic: "Electrolyte Meds", mastered: 12, total: 18, pct: 67 },
    { topic: "Respiratory Meds", mastered: 18, total: 22, pct: 82 },
    { topic: "Psych Medications", mastered: 10, total: 16, pct: 63 },
    { topic: "Pediatric Dosing", mastered: 8, total: 18, pct: 44 },
    { topic: "GI Medications", mastered: 8, total: 12, pct: 67 },
  ],
  weakConcepts: [
    "Insulin onset/peak/duration",
    "Anticoagulant reversal agents",
    "Pediatric dosage calculations",
    "Antiarrhythmic classifications",
    "SSRI discontinuation syndrome",
  ],
  retentionTrend: [68, 71, 74, 72, 76, 78, 80, 82],
  recommendedNext: "Endocrine & Metabolic Deck",
};

export const studyPlanData = {
  weekNumber: 6,
  totalWeeks: 12,
  targetReadiness: 85,
  currentReadiness: 78,
  estimatedHoursThisWeek: 14,
  completedThisWeek: 8.5,
  nextMilestone: "Reach 82% readiness before full CAT simulation",
  weekFocus: "Pharmacology & Prioritization Intensive",
  dailyPlan: [
    { day: "Monday", tasks: ["40 Pharmacology questions", "Insulin flashcard review"], completed: true, hours: 2.0 },
    { day: "Tuesday", tasks: ["Pediatrics case study", "20 SATA questions"], completed: true, hours: 1.5 },
    { day: "Wednesday", tasks: ["Endocrine flashcard drill", "Leadership drill set"], completed: true, hours: 2.0 },
    { day: "Thursday", tasks: ["Mixed adaptive session (50 Qs)", "Review missed items"], completed: false, hours: 2.5 },
    { day: "Friday", tasks: ["Pharmacology calculations", "Maternity review"], completed: false, hours: 2.0 },
    { day: "Saturday", tasks: ["Mini readiness check (25 Qs)", "Weak area flashcards"], completed: false, hours: 2.0 },
    { day: "Sunday", tasks: ["Rest day / light review"], completed: false, hours: 1.0 },
  ],
  highYieldTopics: [
    { topic: "Pharmacology Calculations", urgency: "high" },
    { topic: "Delegation Rules", urgency: "high" },
    { topic: "Endocrine Disorders", urgency: "medium" },
    { topic: "Pediatric Respiratory", urgency: "medium" },
    { topic: "Anticoagulant Safety", urgency: "medium" },
  ],
  weeklyMix: {
    questions: 180,
    flashcards: 120,
    lessons: 4,
    caseStudies: 2,
    simulations: 1,
  },
};

export const lessonRationaleData = {
  questionStem: "A client with heart failure is prescribed furosemide (Lasix) 40mg IV. Which assessment finding should the nurse report to the provider immediately?",
  choices: [
    { letter: "A", text: "Urine output of 200 mL in the first hour", correct: false },
    { letter: "B", text: "Serum potassium level of 2.8 mEq/L", correct: true },
    { letter: "C", text: "Blood pressure of 118/72 mmHg", correct: false },
    { letter: "D", text: "Weight loss of 1 kg since yesterday", correct: false },
  ],
  rationale: "Furosemide is a loop diuretic that inhibits sodium and chloride reabsorption in the ascending loop of Henle. A significant side effect is hypokalemia. A potassium level of 2.8 mEq/L is critically low (normal: 3.5-5.0 mEq/L) and can lead to cardiac dysrhythmias, muscle weakness, and respiratory failure. This requires immediate provider notification.",
  incorrectExplanations: [
    { letter: "A", text: "Increased urine output is the expected therapeutic effect of furosemide and does not require immediate reporting." },
    { letter: "C", text: "This blood pressure is within normal range and indicates appropriate hemodynamic response." },
    { letter: "D", text: "Weight loss of 1 kg reflects fluid loss of approximately 1 liter, which is a desired outcome in heart failure management." },
  ],
  clinicalPearl: "Remember 'Loop Loses K+' - Loop diuretics cause potassium wasting. Always monitor electrolytes, especially K+ and Mg2+, when administering loop diuretics. Teach patients to eat potassium-rich foods (bananas, oranges, potatoes).",
  category: "Physiological Integrity",
  subcategory: "Pharmacological Therapies",
  cognitiveSkill: "Priority Setting",
  difficulty: "Moderate",
  estimatedTime: "1.5 min",
  linkedLesson: "Heart Failure Essentials",
  linkedFlashcards: ["Loop Diuretics", "RAAS Pathway", "Pulmonary Edema"],
  examBlueprint: "Physiological Integrity - Pharmacological Therapies",
};

export const catExamData = {
  currentQuestion: 23,
  totalEstimate: 75,
  timeElapsed: "28:14",
  timeRemaining: "1:31:46",
  flaggedCount: 3,
  questionStem: "A nurse is caring for a 4-year-old child admitted with acute epiglottitis. Which nursing intervention is the highest priority?",
  choices: [
    { letter: "A", text: "Inspect the throat using a tongue depressor" },
    { letter: "B", text: "Place the child in a supine position" },
    { letter: "C", text: "Maintain the child in an upright position and prepare for possible intubation" },
    { letter: "D", text: "Administer a nebulized bronchodilator treatment" },
  ],
  sataQuestion: {
    stem: "A nurse is assessing a client who is receiving heparin therapy. Which findings indicate potential complications? Select all that apply.",
    choices: [
      { text: "Petechiae on the trunk", selected: true },
      { text: "Black, tarry stools", selected: true },
      { text: "Blood pressure 128/78 mmHg", selected: false },
      { text: "Bleeding from the gums", selected: true },
      { text: "Heart rate 82 bpm", selected: false },
      { text: "Hematuria", selected: true },
    ],
  },
};

export const ngnCaseStudyData = {
  patientName: "Mrs. Rodriguez",
  age: 68,
  sex: "Female",
  admissionDiagnosis: "Acute exacerbation of COPD",
  allergies: "Penicillin (rash)",
  codeStatus: "Full Code",
  vitals: {
    temp: "38.2 C (100.8 F)",
    hr: "108 bpm",
    rr: "28/min",
    bp: "142/88 mmHg",
    spo2: "88% on 2L NC",
    pain: "3/10",
  },
  labs: [
    { name: "pH", value: "7.32", flag: "Low" },
    { name: "PaCO2", value: "52 mmHg", flag: "High" },
    { name: "PaO2", value: "58 mmHg", flag: "Low" },
    { name: "HCO3", value: "26 mEq/L", flag: "Normal" },
    { name: "WBC", value: "14,200/uL", flag: "High" },
    { name: "BNP", value: "180 pg/mL", flag: "Normal" },
  ],
  nursingNotes: [
    { time: "0800", note: "Patient reports increased dyspnea over past 3 days. Using accessory muscles. Productive cough with yellow-green sputum. Barrel chest noted." },
    { time: "0830", note: "O2 increased to 3L NC per protocol. SpO2 improved to 91%. Positioned in high Fowler's. Pursed-lip breathing encouraged." },
    { time: "0900", note: "Albuterol/ipratropium nebulizer administered. Patient reports slight improvement. Wheezing audible bilaterally." },
  ],
  providerOrders: [
    "Methylprednisolone 125mg IV q6h",
    "Albuterol/Ipratropium neb q4h",
    "Azithromycin 500mg IV daily",
    "ABG in 2 hours",
    "Chest X-ray stat",
    "I&O monitoring",
    "Incentive spirometry q2h while awake",
  ],
};

export const premiumPlanData = {
  planName: "NurseNest Premium",
  monthlyPrice: 29.99,
  yearlyPrice: 199.99,
  features: [
    { name: "Practice Questions", free: "50", premium: "27,000+" },
    { name: "Flashcard Decks", free: "3 decks", premium: "140+ decks" },
    { name: "Adaptive Sessions", free: "1 / week", premium: "Unlimited" },
    { name: "Lessons & Rationales", free: "Basic", premium: "Full Library" },
    { name: "CAT Simulations", free: "None", premium: "Unlimited" },
    { name: "NGN Case Studies", free: "Preview", premium: "Full Access" },
    { name: "Study Plan", free: "None", premium: "Personalized" },
    { name: "Performance Analytics", free: "Basic", premium: "Advanced" },
    { name: "Mastery Tracking", free: "None", premium: "Full" },
    { name: "Spaced Repetition", free: "None", premium: "Included" },
    { name: "Downloadable Packs", free: "None", premium: "Included" },
    { name: "Priority Support", free: "None", premium: "Included" },
  ],
  stats: {
    passRate: "94%",
    avgScoreImprovement: "+18%",
    studentsEnrolled: "12,400+",
    satisfaction: "4.8/5",
  },
};

export const heatmapData = {
  systems: [
    { name: "Cardiovascular", exposure: 88, accuracy: 81, confidence: 79, mastery: 78, urgency: "low" },
    { name: "Respiratory", exposure: 82, accuracy: 76, confidence: 72, mastery: 73, urgency: "low" },
    { name: "Neurological", exposure: 74, accuracy: 71, confidence: 68, mastery: 66, urgency: "medium" },
    { name: "Endocrine", exposure: 62, accuracy: 58, confidence: 52, mastery: 48, urgency: "high" },
    { name: "Renal / Urinary", exposure: 68, accuracy: 72, confidence: 66, mastery: 64, urgency: "medium" },
    { name: "Pharmacology", exposure: 86, accuracy: 62, confidence: 54, mastery: 52, urgency: "high" },
    { name: "Maternity", exposure: 56, accuracy: 72, confidence: 65, mastery: 62, urgency: "medium" },
    { name: "Pediatrics", exposure: 64, accuracy: 74, confidence: 68, mastery: 66, urgency: "medium" },
    { name: "Leadership", exposure: 48, accuracy: 59, confidence: 48, mastery: 44, urgency: "high" },
    { name: "Mental Health", exposure: 58, accuracy: 77, confidence: 74, mastery: 72, urgency: "low" },
  ],
};

export const studentOverviewData = {
  tier: "Premium",
  examPath: "NCLEX-RN",
  monthlyProgress: {
    questionsThisMonth: 486,
    questionsLastMonth: 412,
    readinessChange: +4,
    streakDays: 18,
  },
  completedContent: {
    questions: 1284,
    flashcards: 932,
    lessons: 27,
    caseStudies: 8,
    catSimulations: 6,
  },
  savedWeakAreas: ["Pharmacology", "Delegation", "Endocrine"],
  upcomingMilestones: [
    { label: "Reach 80% readiness", progress: 93 },
    { label: "Complete Pharmacology deck", progress: 65 },
    { label: "Finish 50 SATA questions", progress: 78 },
  ],
  resumeCard: {
    lastSession: "Adaptive Session - Pharmacology Focus",
    lastSessionDate: "2 hours ago",
    dueFlashcards: 34,
    recommendedQuiz: "Leadership & Prioritization Drill",
    weeklyTarget: 180,
    weeklyCompleted: 126,
  },
};

export const sessionComparisonData = {
  sessions: [
    { id: 1, date: "Mar 1", score: 68, questions: 50, time: "52 min", difficulty: 6.8, topCategory: "Med-Surg", weakCategory: "Pharmacology" },
    { id: 2, date: "Mar 6", score: 72, questions: 50, time: "48 min", difficulty: 7.1, topCategory: "Fundamentals", weakCategory: "Leadership" },
    { id: 3, date: "Mar 11", score: 76, questions: 50, time: "45 min", difficulty: 7.4, topCategory: "Med-Surg", weakCategory: "Pharmacology" },
  ],
  categoryTrends: [
    { category: "Med-Surg", s1: 72, s2: 78, s3: 84 },
    { category: "Pharmacology", s1: 56, s2: 60, s3: 64 },
    { category: "Pediatrics", s1: 68, s2: 72, s3: 78 },
    { category: "Leadership", s1: 54, s2: 58, s3: 62 },
    { category: "Mental Health", s1: 74, s2: 76, s3: 80 },
  ],
};

export const coachRecommendations = [
  { title: "Priority: Pharmacology Intensive", description: "Your pharmacology scores have dropped 4% this week. Complete 2 targeted drills to recover.", type: "urgent", action: "Start Drill" },
  { title: "SATA Confidence Builder", description: "Your SATA accuracy is 64% but improving. Try 20 moderate-difficulty SATA questions.", type: "practice", action: "Begin Set" },
  { title: "Endocrine Flashcard Review", description: "12 endocrine flashcards are overdue for spaced repetition review.", type: "review", action: "Review Now" },
  { title: "NGN Case Study Practice", description: "You haven't completed a case study in 5 days. Try a pediatric respiratory scenario.", type: "practice", action: "Open Case" },
  { title: "Weekly Readiness Check", description: "Schedule your weekly 25-question mini assessment to track progress.", type: "milestone", action: "Take Check" },
  { title: "Study Break Reminder", description: "You've studied 2.5 hours today. Consider a 15-minute break for better retention.", type: "wellness", action: "Dismiss" },
];

export const streakData = {
  currentStreak: 18,
  longestStreak: 24,
  totalStudyDays: 42,
  monthlyActivity: [
    1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1
  ],
  weeklyHours: [8.2, 9.4, 7.8, 10.2, 9.6, 11.4, 8.8, 10.8],
  consistencyScore: 89,
  avgDailyMinutes: 62,
  bestDay: "Wednesday",
  bestTime: "7:00 PM - 9:00 PM",
  milestones: [
    { days: 7, reached: true, label: "1 Week" },
    { days: 14, reached: true, label: "2 Weeks" },
    { days: 21, reached: false, label: "3 Weeks" },
    { days: 30, reached: false, label: "1 Month" },
    { days: 60, reached: false, label: "2 Months" },
  ],
};
