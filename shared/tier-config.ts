import { type Region, getPracticalNurseExamName } from "./constants";

export const NEXT_BUILD_PRIORITY = "pta" as const;

export const BUILD_PRIORITY_META = {
  pta: {
    label: "Physical Therapist Assistant (PTA)",
    slug: "physiotherapy-assistant",
    targetQuestions: 2500,
    targetMockExams: 5,
    targetCategories: 20,
    status: "in-progress" as const,
  },
} as const;

export type ExamTier = "free" | "rpn" | "rn" | "np" | "allied" | "newgrad" | "admin";

export interface TierDifficultyDistribution {
  easy: number;
  moderate: number;
  hard: number;
  very_hard: number;
}

export interface TierBlueprintCategory {
  id: string;
  label: string;
  weight: number;
}

export interface TierNavItem {
  label: string;
  key: string;
  path: string;
  icon?: string;
}

export interface TierUiConfig {
  tier: ExamTier;
  displayName: string;
  shortLabel: string;
  examPrepLabel: string;
  readinessLabel: string;
  testBankLabel: string;
  dashboardTitle: string;
  dashboardSubtitle: string;
  progressLabel: string;
  examNames: {
    practice: string;
    readiness: string;
    official: string;
    drill: string;
    review: string;
  };
  tone: string;
  ctaUpgrade: string;
  emptyStateMessage: string;
  recommendationLabel: string;
  difficultyDistribution: TierDifficultyDistribution;
  blueprintCategories: TierBlueprintCategory[];
  rationaleStyle: string;
  focusAreas: string[];
  navItems: TierNavItem[];
}

const freeTierConfig: TierUiConfig = {
  tier: "free",
  displayName: "Free Plan",
  shortLabel: "Free",
  examPrepLabel: "Free Practice",
  readinessLabel: "Quick Quiz",
  testBankLabel: "Preview Questions",
  dashboardTitle: "Welcome to NurseNest",
  dashboardSubtitle: "Explore free practice questions and sample lessons",
  progressLabel: "Preview Progress",
  examNames: {
    practice: "Sample Practice Quiz",
    readiness: "Free Readiness Check",
    official: "Preview Question Set",
    drill: "Quick Practice",
    review: "Sample Review",
  },
  tone: "welcoming, motivating, beginner-friendly",
  ctaUpgrade: "Upgrade for Full Access",
  emptyStateMessage: "Subscribe to unlock thousands of practice questions, full exams, and personalized study tools.",
  recommendationLabel: "Try These Free Resources",
  difficultyDistribution: { easy: 40, moderate: 40, hard: 15, very_hard: 5 },
  blueprintCategories: [
    { id: "foundations", label: "Nursing Foundations", weight: 0.30 },
    { id: "safety", label: "Safety & Infection Prevention", weight: 0.25 },
    { id: "health-assessment", label: "Health Assessment", weight: 0.25 },
    { id: "pharmacology", label: "Basic Pharmacology", weight: 0.20 },
  ],
  rationaleStyle: "concise and educational",
  focusAreas: ["Preview Topics", "Quick Wins", "Sample Content"],
  navItems: [
    { label: "Home", key: "Home", path: "/" },
    { label: "Lessons", key: "Lessons", path: "/lessons" },
    { label: "Free Practice", key: "FreePractice", path: "/test-bank" },
    { label: "Sample Exams", key: "SampleExams", path: "/mock-exams" },
    { label: "Pricing", key: "Pricing", path: "/pricing" },
  ],
};

const rpnTierConfig: TierUiConfig = {
  tier: "rpn",
  displayName: "RPN/LVN",
  shortLabel: "RPN",
  examPrepLabel: "RPN Exam Prep",
  readinessLabel: "RPN Readiness",
  testBankLabel: "RPN Test Bank",
  dashboardTitle: "Your RPN Readiness",
  dashboardSubtitle: "Practical nursing progress and safe care practice",
  progressLabel: "Practical Nursing Progress",
  examNames: {
    practice: "RPN Practice Exam",
    readiness: "Practical Nurse Readiness Exam",
    official: "Practical Nurse Foundations Exam",
    drill: "Medication Safety Drill",
    review: "Practical Nursing Mixed Review",
  },
  tone: "supportive, clear, practical, confidence-building",
  ctaUpgrade: "Upgrade to Full RPN Access",
  emptyStateMessage: "Start building your practical nursing foundations with targeted practice.",
  recommendationLabel: "Strengthen Your Foundations",
  difficultyDistribution: { easy: 20, moderate: 50, hard: 25, very_hard: 5 },
  blueprintCategories: [
    { id: "foundational-care", label: "Foundational Nursing Care", weight: 0.20 },
    { id: "health-assessment", label: "Health Assessment", weight: 0.15 },
    { id: "medication-safety", label: "Medication Safety", weight: 0.15 },
    { id: "predictable-conditions", label: "Predictable Conditions", weight: 0.15 },
    { id: "maternal-child", label: "Maternal-Child Basics", weight: 0.08 },
    { id: "mental-health", label: "Mental Health Basics", weight: 0.07 },
    { id: "safety-infection", label: "Safety & Infection Prevention", weight: 0.10 },
    { id: "chronic-conditions", label: "Common/Chronic Conditions", weight: 0.05 },
    { id: "escalation", label: "Escalation & Reporting", weight: 0.05 },
  ],
  rationaleStyle: "concise but educational, focus on safety and recognition, explain why the best answer is safest, briefly explain major distractors",
  focusAreas: [
    "Safe Care & Clinical Judgment",
    "Foundations Review",
    "Medication Safety Practice",
    "Practical Nurse Exam Focus Areas",
    "Predictable Patient Scenarios",
  ],
  navItems: [
    { label: "Dashboard", key: "Dashboard", path: "/dashboard" },
    { label: "Lessons", key: "Lessons", path: "/lessons" },
    { label: "Test Bank", key: "TestBank", path: "/test-bank" },
    { label: "Exams", key: "Exams", path: "/mock-exams" },
    { label: "Mock Exams", key: "MockExams", path: "/mock-exams" },
    { label: "Flashcards", key: "Flashcards", path: "/flashcard-study" },
    { label: "Progress", key: "Progress", path: "/study-plan" },
  ],
};

const rnTierConfig: TierUiConfig = {
  tier: "rn",
  displayName: "RN",
  shortLabel: "RN",
  examPrepLabel: "RN Exam Prep",
  readinessLabel: "RN Readiness",
  testBankLabel: "RN Test Bank",
  dashboardTitle: "Your RN Readiness",
  dashboardSubtitle: "Clinical judgment trends and prioritization performance",
  progressLabel: "Clinical Judgment Progress",
  examNames: {
    practice: "RN Readiness Exam",
    readiness: "Clinical Judgment Exam",
    official: "NCLEX-RN Readiness Exam",
    drill: "Prioritization Drill",
    review: "RN Mixed Systems Review",
  },
  tone: "professional, performance-driven, clinically rigorous",
  ctaUpgrade: "Upgrade to Full RN Access",
  emptyStateMessage: "Build your clinical judgment with advanced practice questions and priority-focused exams.",
  recommendationLabel: "Strengthen High-Yield Areas",
  difficultyDistribution: { easy: 10, moderate: 40, hard: 35, very_hard: 15 },
  blueprintCategories: [
    { id: "management-of-care", label: "Management of Care", weight: 0.18 },
    { id: "safety-infection", label: "Safety & Infection Control", weight: 0.12 },
    { id: "health-promotion", label: "Health Promotion & Maintenance", weight: 0.09 },
    { id: "psychosocial", label: "Psychosocial Integrity", weight: 0.09 },
    { id: "basic-care", label: "Basic Care & Comfort", weight: 0.09 },
    { id: "pharmacological", label: "Pharmacological Therapies", weight: 0.15 },
    { id: "risk-reduction", label: "Reduction of Risk Potential", weight: 0.12 },
    { id: "physiological-adaptation", label: "Physiological Adaptation", weight: 0.16 },
  ],
  rationaleStyle: "moderate to detailed, emphasize prioritization and patient safety, explain why competing options are attractive but incorrect, include subtle reasoning",
  focusAreas: [
    "Clinical Judgment Practice",
    "Prioritization Drills",
    "Management of Care",
    "Advanced Nursing Review",
    "Readiness Analytics",
  ],
  navItems: [
    { label: "Dashboard", key: "Dashboard", path: "/dashboard" },
    { label: "Lessons", key: "Lessons", path: "/lessons" },
    { label: "Test Bank", key: "TestBank", path: "/test-bank" },
    { label: "Exams", key: "Exams", path: "/mock-exams" },
    { label: "Mock Exams", key: "MockExams", path: "/mock-exams" },
    { label: "Flashcards", key: "Flashcards", path: "/flashcard-study" },
    { label: "Clinical Judgment", key: "ClinicalJudgment", path: "/case-simulations" },
    { label: "Progress", key: "Progress", path: "/study-plan" },
  ],
};

const npTierConfig: TierUiConfig = {
  tier: "np",
  displayName: "NP",
  shortLabel: "NP",
  examPrepLabel: "NP Board Prep",
  readinessLabel: "NP Board Readiness",
  testBankLabel: "NP Test Bank",
  dashboardTitle: "Your NP Board Readiness",
  dashboardSubtitle: "Diagnostic reasoning and prescribing confidence",
  progressLabel: "Board Readiness Progress",
  examNames: {
    practice: "NP Board Readiness Exam",
    readiness: "Diagnostic Reasoning Case Set",
    official: "NP Board Exam",
    drill: "Differential Diagnosis Drill",
    review: "Advanced Clinical Management Review",
  },
  tone: "advanced, graduate-level, analytical, expert-facing",
  ctaUpgrade: "Upgrade to Full NP Access",
  emptyStateMessage: "Master advanced clinical reasoning with board-level questions and diagnostic case sets.",
  recommendationLabel: "Strengthen Differential Diagnosis Skills",
  difficultyDistribution: { easy: 5, moderate: 25, hard: 40, very_hard: 30 },
  blueprintCategories: [
    { id: "advanced-assessment", label: "Advanced Assessment", weight: 0.12 },
    { id: "differential-diagnosis", label: "Diagnosis & Differential", weight: 0.15 },
    { id: "diagnostics-labs", label: "Diagnostics, Labs & Imaging", weight: 0.12 },
    { id: "pharmacotherapeutics", label: "Pharmacotherapeutics", weight: 0.15 },
    { id: "treatment-planning", label: "Treatment Planning", weight: 0.12 },
    { id: "follow-up-monitoring", label: "Follow-up & Monitoring", weight: 0.08 },
    { id: "health-promotion", label: "Health Promotion & Prevention", weight: 0.08 },
    { id: "chronic-disease", label: "Chronic Disease Management", weight: 0.10 },
    { id: "urgent-emergent", label: "Urgent/Emergent Recognition", weight: 0.08 },
  ],
  rationaleStyle: "detailed and advanced, explain diagnostic and management reasoning, discuss why the correct answer fits best clinically, explain contraindications and guideline reasoning",
  focusAreas: [
    "Diagnostic Reasoning Exams",
    "Advanced Clinical Cases",
    "Prescribing & Management Practice",
    "Differential Diagnosis Review",
    "Board Readiness Analytics",
  ],
  navItems: [
    { label: "Dashboard", key: "Dashboard", path: "/dashboard" },
    { label: "Lessons", key: "Lessons", path: "/lessons" },
    { label: "Test Bank", key: "TestBank", path: "/test-bank" },
    { label: "Exams", key: "Exams", path: "/mock-exams" },
    { label: "Mock Exams", key: "MockExams", path: "/mock-exams" },
    { label: "Flashcards", key: "Flashcards", path: "/flashcard-study" },
    { label: "Advanced Cases", key: "AdvancedCases", path: "/case-simulations" },
    { label: "Diagnostic Reasoning", key: "DiagnosticReasoning", path: "/simulators/clinical-skills" },
    { label: "Progress", key: "Progress", path: "/study-plan" },
  ],
};

const alliedTierConfig: TierUiConfig = {
  tier: "allied" as ExamTier,
  displayName: "Allied Health",
  shortLabel: "Allied",
  examPrepLabel: "Allied Health Exam Prep",
  readinessLabel: "Allied Health Readiness",
  testBankLabel: "Allied Health Test Bank",
  dashboardTitle: "Your Allied Health Readiness",
  dashboardSubtitle: "Allied health professional exam preparation",
  progressLabel: "Allied Health Progress",
  examNames: {
    practice: "Allied Health Practice Exam",
    readiness: "Allied Health Readiness Exam",
    official: "Allied Health Certification Exam",
    drill: "Allied Health Practice Drill",
    review: "Allied Health Review",
  },
  tone: "professional, supportive, practical",
  ctaUpgrade: "Upgrade to Full Allied Health Access",
  emptyStateMessage: "Start your allied health exam preparation with targeted practice questions.",
  recommendationLabel: "Strengthen Core Areas",
  difficultyDistribution: { easy: 15, moderate: 45, hard: 30, very_hard: 10 },
  blueprintCategories: [
    { id: "clinical-foundations", label: "Clinical Foundations", weight: 0.20 },
    { id: "patient-care", label: "Patient Care & Safety", weight: 0.20 },
    { id: "professional-practice", label: "Professional Practice", weight: 0.15 },
    { id: "diagnostic-procedures", label: "Diagnostic Procedures", weight: 0.15 },
    { id: "treatment-modalities", label: "Treatment Modalities", weight: 0.15 },
    { id: "ethics-communication", label: "Ethics & Communication", weight: 0.15 },
  ],
  rationaleStyle: "clear and practical, emphasize evidence-based practice and patient safety",
  focusAreas: [
    "Clinical Foundations",
    "Patient Care Practice",
    "Professional Standards",
    "Diagnostic Procedures",
    "Certification Readiness",
  ],
  navItems: [
    { label: "Dashboard", key: "Dashboard", path: "/dashboard" },
    { label: "Lessons", key: "Lessons", path: "/lessons" },
    { label: "Test Bank", key: "TestBank", path: "/test-bank" },
    { label: "Exams", key: "Exams", path: "/mock-exams" },
    { label: "Mock Exams", key: "MockExams", path: "/mock-exams" },
    { label: "Flashcards", key: "Flashcards", path: "/flashcard-study" },
    { label: "Progress", key: "Progress", path: "/study-plan" },
  ],
};

const adminTierConfig: TierUiConfig = {
  tier: "admin",
  displayName: "Admin",
  shortLabel: "Admin",
  examPrepLabel: "All Exam Tiers",
  readinessLabel: "Platform Overview",
  testBankLabel: "Full Question Bank",
  dashboardTitle: "Admin Dashboard",
  dashboardSubtitle: "Platform operations and content management",
  progressLabel: "Platform Metrics",
  examNames: {
    practice: "Practice Exam",
    readiness: "Readiness Exam",
    official: "Official Exam",
    drill: "Practice Drill",
    review: "Content Review",
  },
  tone: "operational, efficient, structured",
  ctaUpgrade: "",
  emptyStateMessage: "No content matching filters.",
  recommendationLabel: "Admin Actions",
  difficultyDistribution: { easy: 25, moderate: 25, hard: 25, very_hard: 25 },
  blueprintCategories: [],
  rationaleStyle: "full detail",
  focusAreas: [],
  navItems: [
    { label: "Dashboard", key: "Dashboard", path: "/dashboard" },
    { label: "Admin", key: "Admin", path: "/admin" },
    { label: "Exams", key: "Exams", path: "/mock-exams" },
    { label: "Question Bank", key: "QuestionBank", path: "/question-bank" },
    { label: "Lessons", key: "Lessons", path: "/lessons" },
    { label: "All Tools", key: "AllTools", path: "/simulators/osce" },
  ],
};

const newgradTierConfig: TierUiConfig = {
  tier: "newgrad",
  displayName: "New Grad Success Toolkit",
  shortLabel: "New Grad",
  examPrepLabel: "Career Prep",
  readinessLabel: "Career Readiness",
  testBankLabel: "Interview Question Bank",
  dashboardTitle: "Your Career Launch Dashboard",
  dashboardSubtitle: "Career tools, interview prep, and professional development resources",
  progressLabel: "Career Progress",
  examNames: {
    practice: "Interview Practice",
    readiness: "Career Readiness Assessment",
    official: "Professional Development",
    drill: "Quick Interview Drill",
    review: "Career Skills Review",
  },
  tone: "supportive, motivating, career-focused, practical",
  ctaUpgrade: "Upgrade to New Grad Success Toolkit",
  emptyStateMessage: "Subscribe to unlock the full interview question bank, resume templates, salary negotiation guides, and career planning frameworks.",
  recommendationLabel: "Recommended Career Resources",
  difficultyDistribution: { easy: 30, moderate: 40, hard: 20, very_hard: 10 },
  blueprintCategories: [
    { id: "interview-prep", label: "Interview Preparation", weight: 0.25 },
    { id: "resume-building", label: "Resume & Cover Letters", weight: 0.20 },
    { id: "workplace-skills", label: "Workplace Navigation", weight: 0.20 },
    { id: "career-planning", label: "Career Planning", weight: 0.15 },
    { id: "salary-negotiation", label: "Salary & Benefits", weight: 0.10 },
    { id: "professional-growth", label: "Professional Development", weight: 0.10 },
  ],
  rationaleStyle: "practical and actionable, focus on career success strategies",
  focusAreas: [
    "Interview Preparation",
    "Resume & Cover Letter Building",
    "Workplace Navigation",
    "Salary Negotiation",
    "Professional Development",
  ],
  navItems: [
    { label: "Career Hub", key: "CareerHub", path: "/newgrad" },
    { label: "Guides", key: "Guides", path: "/newgrad/guides" },
    { label: "Interview Prep", key: "InterviewPrep", path: "/newgrad/interview" },
    { label: "Resume Tools", key: "ResumeTools", path: "/newgrad/resume" },
    { label: "Career", key: "Career", path: "/newgrad/career" },
    { label: "Salary", key: "Salary", path: "/newgrad/salary" },
  ],
};

const TIER_CONFIGS: Record<ExamTier, TierUiConfig> = {
  free: freeTierConfig,
  rpn: rpnTierConfig,
  rn: rnTierConfig,
  np: npTierConfig,
  allied: alliedTierConfig,
  newgrad: newgradTierConfig,
  admin: adminTierConfig,
};

export function getTierConfig(tier: string | undefined, region?: Region): TierUiConfig {
  if (!tier || !(tier in TIER_CONFIGS)) return TIER_CONFIGS.free;
  const config = TIER_CONFIGS[tier as ExamTier];
  if (tier === "rpn" && region) {
    const examName = getPracticalNurseExamName(region);
    return {
      ...config,
      examNames: {
        ...config.examNames,
        readiness: `${examName} Readiness Exam`,
        official: `${examName} Foundations Exam`,
      },
      focusAreas: config.focusAreas.map(area =>
        area === "Practical Nurse Exam Focus Areas" ? `${examName} Focus Areas` : area
      ),
    };
  }
  return config;
}

export function getTierLabel(tier: string): string {
  const config = getTierConfig(tier);
  return config.displayName;
}

export function getAllowedContentTiers(userTier: string): string[] {
  switch (userTier) {
    case "admin": return ["rpn", "rn", "np", "allied", "newgrad", "free"];
    case "np": return ["np", "rn"];
    case "rn": return ["rn", "rpn"];
    case "rpn": return ["rpn"];
    case "allied": return ["allied"];
    case "newgrad": return ["newgrad"];
    case "free": return ["free"];
    default: return ["free"];
  }
}

export function getAllowedExamTiers(userTier: string): string[] {
  switch (userTier) {
    case "admin": return ["rpn", "rn", "np", "allied"];
    case "np": return ["np", "rn"];
    case "rn": return ["rn", "rpn"];
    case "rpn": return ["rpn"];
    case "allied": return ["allied"];
    default: return [];
  }
}

export function getTierDifficultyDistribution(tier: string): TierDifficultyDistribution {
  return getTierConfig(tier).difficultyDistribution;
}

export function canUserAccessTier(userTier: string, contentTier: string): boolean {
  if (userTier === "admin") return true;
  return getAllowedContentTiers(userTier).includes(contentTier);
}

export const TIER_GENERATION_PROMPTS: Record<string, { systemPrompt: string; focusAreas: string; rationaleGuidance: string; distractorStyle: string; stemStyle: string }> = {
  rpn: {
    systemPrompt: "You are an expert practical nursing exam question writer specializing in RPN/LVN licensure preparation. Write questions that test foundational nursing knowledge, safe patient care, and practical clinical judgment within the RPN scope of practice.",
    focusAreas: "Focus on: stable/predictable patient scenarios, direct recognition of common conditions, safe intervention selection, focused assessment skills, basic pharmacology (common medications, adverse effects, contraindications, monitoring), medication safety, escalation and reporting, and infection prevention. Questions should test safe practical nursing judgment, prioritization within predictable settings, and recognition of when to escalate to the RN or physician.",
    rationaleGuidance: "Write concise but educational rationales. Focus on safety, recognition, and nursing action. Explain why the best answer is the safest or most appropriate choice. Briefly explain why major distractors are incorrect. Keep language clear and practical.",
    distractorStyle: "Distractors should be plausible but somewhat more concrete and less abstract. Avoid overly nuanced or ambiguous choices. Each distractor should represent a common misconception or unsafe action.",
    stemStyle: "Stem length should be short to moderate. Use straightforward clinical scenarios with predictable patient presentations. Lab interpretation should be straightforward. Case complexity should be lower than RN-level.",
  },
  rn: {
    systemPrompt: "You are an expert registered nursing exam question writer specializing in NCLEX-RN preparation. Write questions that test broader clinical judgment, prioritization, delegation, and complex patient care reasoning at the RN level.",
    focusAreas: "Focus on: clinical judgment with unstable patients, prioritization of competing needs, delegation and scope decisions, interpretation of lab trends and vital sign changes, multi-step reasoning, management of care, pharmacological therapies with nuanced considerations, safety and infection control, psychosocial integrity, and physiological adaptation. Questions should require stronger interpretation of labs, symptoms, trends, and safest next action.",
    rationaleGuidance: "Write moderate to detailed rationales. Emphasize prioritization, patient safety, interpretation, and nursing judgment. Explain why competing options are attractive but ultimately incorrect. Include subtle reasoning where clinical judgment is needed. Discuss the prioritization framework used.",
    distractorStyle: "Distractors should be intentionally close and realistic. Increase ambiguity between answer choices to test true clinical judgment. Each distractor should represent a reasonable but suboptimal nursing action.",
    stemStyle: "Stem length moderate to long. Use scenario-based questions with more layered clinical situations. Include patients with multiple data points, changing conditions, or competing priorities. Require interpretation of trends rather than single data points.",
  },
  np: {
    systemPrompt: "You are an expert nurse practitioner board exam question writer specializing in AANP, ANCC, and CNPE preparation. Write questions that test advanced assessment, differential diagnosis, diagnostic reasoning, evidence-based management, pharmacotherapeutics, and advanced clinical decision-making at the graduate level.",
    focusAreas: "Focus on: advanced physical assessment findings, differential diagnosis between similar conditions, diagnostic workup selection and interpretation, pharmacotherapeutics (drug selection, dosing considerations, contraindications, drug interactions), treatment planning and management sequencing, follow-up monitoring, health promotion and prevention at the provider level, chronic disease management, urgent/emergent recognition, and guideline-informed clinical decisions. Include nuanced patient factors: age, comorbidities, contraindications, sequencing, follow-up planning.",
    rationaleGuidance: "Write detailed and advanced rationales. Explain diagnostic and management reasoning thoroughly. Discuss why the correct answer fits best clinically based on guidelines and evidence. Explain contraindications, alternative management approaches, and why each distractor fails logically at the provider level. Reference clinical guidelines where appropriate.",
    distractorStyle: "Distractors should reflect errors in diagnostic reasoning, inappropriate workups, incorrect prescribing, incomplete management, or missed red flags. Each distractor should be a plausible clinical decision that an NP might consider but is suboptimal.",
    stemStyle: "Use clinically dense, graduate-level case vignettes. Require synthesis rather than recall. Include advanced assessment findings, multiple comorbidities, medication lists, and lab panels. Questions must test clinical reasoning depth, not memorization alone.",
  },
};
