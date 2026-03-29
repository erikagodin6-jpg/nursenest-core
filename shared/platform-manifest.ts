export interface TierGoal {
  label: string;
  shortLabel: string;
  goalQuestions: number;
  exams: string[];
  countries: string[];
  route: string;
}

export interface CertGoal {
  label: string;
  goalQuestions: number;
  route: string;
}

export interface AlliedCareerGoal {
  label: string;
  goalQuestions: number;
  route: string;
  tier: "major" | "mid";
}

export const NURSING_TIERS: Record<string, TierGoal> = {
  rpn: {
    label: "RPN / PN / LVN",
    shortLabel: "RPN",
    goalQuestions: 12000,
    exams: ["REx-PN", "NCLEX-PN", "Canadian PN Licensing", "US PN/LVN Licensing"],
    countries: ["Canada", "United States"],
    route: "/rex-pn",
  },
  rn: {
    label: "Registered Nurse (RN)",
    shortLabel: "RN",
    goalQuestions: 18000,
    exams: ["NCLEX-RN", "Canadian RN Licensing", "UK NMC CBT", "Australia RN Prep", "International RN"],
    countries: ["Canada", "United States", "United Kingdom", "Australia", "New Zealand", "Ireland"],
    route: "/nclex-rn",
  },
  np: {
    label: "Nurse Practitioner (NP)",
    shortLabel: "NP",
    goalQuestions: 15000,
    exams: ["AANP-FNP", "ANCC-FNP", "AGPCNP-AANP", "AGPCNP-ANCC", "AGACNP", "PMHNP", "PNP", "WHNP", "ENP", "CNPE"],
    countries: ["Canada", "United States"],
    route: "/np-exam-practice-questions",
  },
};

export const CERTIFICATION_GOALS: CertGoal[] = [
  { label: "BLS", goalQuestions: 2000, route: "/nursing-certifications" },
  { label: "ACLS", goalQuestions: 3500, route: "/nursing-certifications" },
  { label: "PALS", goalQuestions: 2500, route: "/nursing-certifications" },
  { label: "NRP", goalQuestions: 1500, route: "/nursing-certifications" },
  { label: "TNCC", goalQuestions: 2000, route: "/nursing-certifications" },
  { label: "ENPC", goalQuestions: 1500, route: "/nursing-certifications" },
  { label: "Critical Care (CCRN)", goalQuestions: 3000, route: "/nursing-certifications" },
  { label: "Emergency Nursing (CEN)", goalQuestions: 2500, route: "/nursing-certifications" },
  { label: "Oncology Nursing", goalQuestions: 2000, route: "/nursing-certifications" },
  { label: "Pediatric Nursing", goalQuestions: 2000, route: "/nursing-certifications" },
  { label: "Perioperative Nursing", goalQuestions: 1500, route: "/nursing-certifications" },
];

export const PRE_NURSING_GOAL = {
  goalQuestions: 5000,
  subjects: [
    "Anatomy", "Physiology", "Microbiology", "Chemistry",
    "Medical Terminology", "Nutrition", "Psychology", "Statistics",
  ],
  route: "/lessons",
};

export const NEW_GRAD_GOAL = {
  goalScenarios: 3000,
  sections: [
    "Interview Preparation",
    "Workplace Scenarios",
    "Delegation Practice",
    "Professional Communication",
    "Career Advancement",
  ],
  route: "/newgrad",
};

export const ALLIED_HEALTH_CAREERS: AlliedCareerGoal[] = [
  { label: "Respiratory Therapist (RRT)", goalQuestions: 5000, route: "/allied-health/rrt", tier: "major" },
  { label: "Surgical Technologist", goalQuestions: 3000, route: "/allied-health/surgical-technologist", tier: "major" },
  { label: "Medical Lab Technologist (MLT)", goalQuestions: 5000, route: "/allied-health/mlt", tier: "major" },
  { label: "Radiology / Imaging", goalQuestions: 3000, route: "/allied-health/imaging", tier: "major" },
  { label: "Pharmacy Technician", goalQuestions: 4000, route: "/allied-health/pharmacy-tech", tier: "major" },
  { label: "Paramedic", goalQuestions: 4000, route: "/allied-health/paramedic", tier: "major" },
  { label: "OTA", goalQuestions: 2500, route: "/allied-health/occupational-therapy-assistant", tier: "mid" },
  { label: "PTA", goalQuestions: 2500, route: "/allied-health/physiotherapy-assistant", tier: "major" },
  { label: "Social Worker", goalQuestions: 3500, route: "/allied-health/social-work", tier: "mid" },
  { label: "Addictions Counsellor", goalQuestions: 2000, route: "/allied-health/addictions-counsellor", tier: "mid" },
  { label: "Psychotherapist", goalQuestions: 2000, route: "/allied-health/psychotherapy", tier: "mid" },
];

export const SUPPORTED_COUNTRIES = [
  { name: "Canada", flag: "CA" },
  { name: "United States", flag: "US" },
  { name: "United Kingdom", flag: "GB" },
  { name: "Australia", flag: "AU" },
  { name: "New Zealand", flag: "NZ" },
  { name: "Ireland", flag: "IE" },
  { name: "India", flag: "IN" },
  { name: "Philippines", flag: "PH" },
  { name: "Saudi Arabia", flag: "SA" },
  { name: "UAE", flag: "AE" },
];

export const SUPPORTED_LANGUAGES = [
  "English", "French", "Spanish", "Portuguese", "Tagalog",
  "Hindi", "Arabic", "Chinese", "Korean", "Japanese",
  "German", "Thai", "Turkish", "Indonesian", "Vietnamese",
  "Italian", "Russian", "Polish", "Tamil", "Filipino",
];

export const PLATFORM_FEATURES = [
  {
    key: "adaptiveTesting",
    headline: "Adaptive Testing Engine",
    description: "Exams that adjust difficulty as you improve, targeting your weak areas for maximum efficiency.",
    route: "/study",
  },
  {
    key: "explanationEngine",
    headline: "Detailed Explanations",
    description: "In-depth clinical explanations for every question with rationales, distractor analysis, and exam tips.",
    route: "/test-bank",
  },
  {
    key: "studyGuides",
    headline: "Study Guide System",
    description: "Structured lessons covering every exam topic with pathophysiology, nursing interventions, and clinical pearls.",
    route: "/lessons",
  },
  {
    key: "flashcards",
    headline: "Smart Flashcards",
    description: "Spaced repetition flashcards to help you memorize faster and retain more for exam day.",
    route: "/flashcards",
  },
  {
    key: "readinessPredictor",
    headline: "Exam Readiness Predictor",
    description: "Know when you are ready to pass your exam with performance analytics and score projections.",
    route: "/analytics",
  },
  {
    key: "aiTutor",
    headline: "Step-by-Step Tutor",
    description: "Ask questions and get detailed, step-by-step explanations tailored to your learning level.",
    route: "/lessons",
  },
  {
    key: "clinicalSimulator",
    headline: "Clinical Scenario Simulator",
    description: "Practice real clinical decision-making with interactive patient cases and prioritization exercises.",
    route: "/clinical-scenarios",
  },
  {
    key: "globalQuestionBanks",
    headline: "Global Question Banks",
    description: "Thousands of exam-style questions across multiple countries and licensing bodies.",
    route: "/test-bank",
  },
  {
    key: "multiLanguage",
    headline: "Multi-Language Learning",
    description: "Study in English, French, Spanish, and 17 more languages with full platform translation.",
    route: "/languages",
  },
  {
    key: "mockExams",
    headline: "Mock Exams",
    description: "Realistic exam simulations with timed conditions, performance analytics, and detailed score reports.",
    route: "/mock-exam",
  },
];
