import { PRE_NURSING_MODULE_REGISTRY } from "@/content/pre-nursing/pre-nursing-registry";

export type PreNursingLearningMode = "learn" | "review" | "practice" | "master";

export type PreNursingCategory = {
  slug: string;
  title: string;
  description: string;
  readinessLabel: string;
  lessonSlugs: readonly string[];
  systems?: readonly string[];
  terminologyTracks?: readonly string[];
  pathophysiologyTracks?: readonly string[];
  pharmacologyTracks?: readonly string[];
  questionFocus: readonly string[];
  studyPearl: string;
  hintExample: string;
};

export const PRE_NURSING_LEARNING_FLOW: readonly {
  mode: PreNursingLearningMode;
  label: string;
  description: string;
}[] = [
  { mode: "learn", label: "Learn", description: "Start with a college-level lesson and clear definitions." },
  { mode: "review", label: "Review", description: "Use flashcards to reinforce structures, functions, terms, and formulas." },
  { mode: "practice", label: "Practice", description: "Answer foundational questions with hints, study tips, and related lessons." },
  { mode: "master", label: "Master", description: "Track readiness, revisit weak areas, and build confidence for nursing school." },
];

export const PRE_NURSING_LESSON_QUALITY_STANDARD = [
  "Learning Objectives",
  "Core Concepts",
  "Visual Explanations",
  "Key Definitions",
  "Clinical Connections",
  "Knowledge Checks",
  "Study Tips",
  "Common Mistakes",
  "Summary",
  "Flashcard Links",
  "Practice Question Links",
  "Related Lessons",
] as const;

export const PRE_NURSING_QUESTION_REQUIREMENTS = [
  "Hint",
  "Correct Answer",
  "Why Correct",
  "Why Incorrect",
  "Study Tip",
  "Related Lesson",
  "Clinical Pearl or Study Pearl when applicable",
] as const;

export const PRE_NURSING_MARKETING_SCREENSHOTS = [
  "Lesson Page",
  "Flashcards",
  "Practice Questions",
  "Readiness Dashboard",
  "Study Progress",
] as const;

export const PRE_NURSING_PATHWAY_PROGRESSION = [
  "Pre-Nursing",
  "Nursing School",
  "RN / RPN",
  "NP / Advanced Practice",
  "Allied Health",
] as const;

export const PRE_NURSING_CATEGORIES: readonly PreNursingCategory[] = [
  {
    slug: "anatomy-physiology",
    title: "Anatomy & Physiology",
    description: "Body systems, normal function, and the relationships that make disease concepts easier later.",
    readinessLabel: "Anatomy Readiness",
    lessonSlugs: ["anatomy-physiology", "physiology", "oxygenation"],
    systems: [
      "Cardiovascular",
      "Respiratory",
      "Neurological",
      "Endocrine",
      "Renal",
      "Gastrointestinal",
      "Musculoskeletal",
      "Immune",
      "Integumentary",
      "Reproductive",
    ],
    questionFocus: ["structure-function relationships", "normal physiology", "system interactions"],
    studyPearl: "Understanding normal physiology makes pathophysiology easier to learn.",
    hintExample: "Think about the primary function of this organ or body system.",
  },
  {
    slug: "medical-terminology",
    title: "Medical Terminology",
    description: "Decode prefixes, suffixes, roots, procedures, diseases, diagnostics, and body-system vocabulary.",
    readinessLabel: "Terminology Readiness",
    lessonSlugs: ["terminology", "medical-terminology"],
    terminologyTracks: ["Prefixes", "Suffixes", "Root Words", "Body Systems", "Procedures", "Diseases", "Diagnostics"],
    questionFocus: ["word decoding", "term meaning", "body-system vocabulary"],
    studyPearl: "Mastering prefixes and suffixes can help decode unfamiliar medical terms.",
    hintExample: "Review the meaning of the root word before choosing the full term.",
  },
  {
    slug: "pathophysiology-foundations",
    title: "Pathophysiology Foundations",
    description: "Beginner-friendly disease-process reasoning before advanced clinical content.",
    readinessLabel: "Physiology Readiness",
    lessonSlugs: ["pathophysiology", "inflammation", "cellular-injury", "fluids-electrolytes", "infection-control"],
    pathophysiologyTracks: [
      "Inflammation",
      "Infection",
      "Immunity",
      "Shock",
      "Fluid Balance",
      "Electrolytes",
      "Acid-Base Balance",
      "Cellular Injury",
      "Disease Processes",
    ],
    questionFocus: ["cause and effect", "early warning concepts", "normal versus abnormal patterns"],
    studyPearl: "Focus on relationships between systems rather than memorizing isolated facts.",
    hintExample: "Consider which body system regulates this process.",
  },
  {
    slug: "pharmacology-foundations",
    title: "Pharmacology Foundations",
    description: "Medication safety, routes, drug class basics, adverse effects, and calculation foundations.",
    readinessLabel: "Pharmacology Foundations Readiness",
    lessonSlugs: ["pharmacology"],
    pharmacologyTracks: [
      "Medication Safety",
      "Routes",
      "Drug Class Basics",
      "Dosage Concepts",
      "Medication Administration Principles",
      "Common Drug Categories",
      "Medication Errors",
      "Adverse Effects",
      "Medication Calculations",
    ],
    questionFocus: ["safe administration", "drug-class recognition", "dosage concepts"],
    studyPearl: "Medication safety starts with understanding purpose, route, dose, timing, and expected effects.",
    hintExample: "Ask what the medication is intended to do before focusing on details.",
  },
  {
    slug: "chemistry",
    title: "Chemistry",
    description: "Atoms, bonds, solutions, pH, concentration, and the science language used in nursing prerequisites.",
    readinessLabel: "Chemistry Readiness",
    lessonSlugs: ["chemistry", "science-foundations"],
    questionFocus: ["basic chemistry", "solutions", "pH", "concentration"],
    studyPearl: "Chemistry becomes easier when formulas are tied to real substances and body processes.",
    hintExample: "Identify the unit or relationship being tested before solving.",
  },
  {
    slug: "biology",
    title: "Biology",
    description: "Cell biology, metabolism, genetics basics, membranes, and organism-level foundations.",
    readinessLabel: "Biology Readiness",
    lessonSlugs: ["cell-biology", "science-foundations", "atp-pathway"],
    questionFocus: ["cell structure", "energy processes", "biological organization"],
    studyPearl: "Cell processes are the foundation for understanding organs, infection, and medication effects.",
    hintExample: "Start at the cellular level, then connect the concept to the whole body.",
  },
  {
    slug: "microbiology",
    title: "Microbiology",
    description: "Microbes, infection prevention, immune response, transmission, and basic pathogen concepts.",
    readinessLabel: "Microbiology Readiness",
    lessonSlugs: ["microbiology", "infection-control"],
    questionFocus: ["transmission", "microbe types", "infection prevention"],
    studyPearl: "Microbiology is not just organisms; it is how organisms spread and how the body responds.",
    hintExample: "Think about how the organism enters, spreads, or is interrupted.",
  },
  {
    slug: "health-assessment-foundations",
    title: "Health Assessment Foundations",
    description: "Observation, vital signs, basic assessment vocabulary, data gathering, and normal findings.",
    readinessLabel: "Assessment Readiness",
    lessonSlugs: ["health-assessment", "diagnostics"],
    questionFocus: ["normal findings", "basic assessment", "data collection"],
    studyPearl: "Good assessment begins with knowing what normal looks and sounds like.",
    hintExample: "Separate what you observe from what you interpret.",
  },
  {
    slug: "dosage-calculation-foundations",
    title: "Dosage Calculation Foundations",
    description: "Units, conversions, ratio reasoning, medication math setup, and calculation confidence.",
    readinessLabel: "Dosage Readiness",
    lessonSlugs: ["pharmacology", "chemistry"],
    questionFocus: ["unit conversion", "formula setup", "dose reasonableness"],
    studyPearl: "Dimensional analysis works because units guide the setup before numbers are calculated.",
    hintExample: "Write the desired unit first, then cancel units step by step.",
  },
  {
    slug: "healthcare-ethics",
    title: "Healthcare Ethics",
    description: "Foundational ethics, legal basics, privacy, professionalism, and safe student decision-making.",
    readinessLabel: "Ethics Readiness",
    lessonSlugs: ["ethics-legal", "healthcare-structure", "cultural-competency"],
    questionFocus: ["privacy", "professional boundaries", "ethical principles"],
    studyPearl: "Ethics questions often ask what protects dignity, safety, privacy, and trust.",
    hintExample: "Look for the option that preserves safety and respect without overstepping role boundaries.",
  },
  {
    slug: "communication-documentation",
    title: "Communication & Documentation",
    description: "Therapeutic communication basics, documentation habits, handoff language, and team communication.",
    readinessLabel: "Communication Readiness",
    lessonSlugs: ["communication", "human-factors", "research-reading"],
    questionFocus: ["clear communication", "documentation purpose", "handoff basics"],
    studyPearl: "Clear documentation tells the next person what happened, what changed, and what needs follow-up.",
    hintExample: "Choose the response that is clear, objective, and respectful.",
  },
  {
    slug: "study-skills",
    title: "Study Skills for Nursing School",
    description: "Time management, retrieval practice, note-taking, exam habits, and confidence-building routines.",
    readinessLabel: "Study Skills Readiness",
    lessonSlugs: ["study-strategies", "research-statistics"],
    questionFocus: ["learning strategy", "study planning", "self-monitoring"],
    studyPearl: "Short, repeated retrieval sessions usually beat long rereading sessions.",
    hintExample: "Choose the strategy that makes you actively recall and explain the concept.",
  },
];

export function preNursingTotalLessonCount(): number {
  return PRE_NURSING_MODULE_REGISTRY.reduce((total, module) => total + module.lessons, 0);
}

export function preNursingCategoryCount(): number {
  return PRE_NURSING_CATEGORIES.length;
}
