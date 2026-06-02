export type AdmissionExamSlug = "ati-teas" | "hesi-a2" | "casper";

export type AdmissionExamCategory = {
  title: string;
  topics: readonly string[];
};

export type AdmissionExamPracticeMode = {
  title: string;
  description: string;
};

export type AdmissionExamProduct = {
  slug: AdmissionExamSlug;
  title: string;
  shortTitle: string;
  canonicalPath: `/pre-nursing/${AdmissionExamSlug}`;
  overview: string;
  examBreakdown: readonly AdmissionExamCategory[];
  studyPlan: readonly string[];
  learningActivities: readonly string[];
  readinessDomains: readonly string[];
  practiceModes: readonly AdmissionExamPracticeMode[];
  hintsAndPearls: readonly string[];
  rationaleRequirements: readonly string[];
  feedsInto: readonly string[];
  screenshotAlt: string;
  supportsCatExams: boolean;
};

export type FutureAdmissionExam = {
  title: string;
  description: string;
};

export const ADMISSION_EXAM_ACTIVITY_REQUIREMENTS = [
  "Overview",
  "Exam breakdown",
  "Study plan",
  "Lessons",
  "Flashcards",
  "Practice Questions",
  "Readiness tracking",
] as const;

const STANDARD_RATIONALE_REQUIREMENTS = [
  "Correct Answer",
  "Why Correct",
  "Why Incorrect",
  "Study Tip",
  "Exam Strategy",
  "Related Lesson",
  "Learning Pearl",
] as const;

export const ADMISSION_EXAM_PRODUCTS: readonly AdmissionExamProduct[] = [
  {
    slug: "ati-teas",
    title: "ATI TEAS Admissions Prep",
    shortTitle: "ATI TEAS",
    canonicalPath: "/pre-nursing/ati-teas",
    overview:
      "A dedicated TEAS preparation pathway for future nursing and allied-health learners covering reading, math, science, and English language usage through lessons, flashcards, practice questions, study plans, and readiness tracking.",
    examBreakdown: [
      { title: "Reading", topics: ["Main Idea", "Supporting Details", "Inference", "Author Purpose", "Evidence"] },
      { title: "Mathematics", topics: ["Fractions", "Decimals", "Percentages", "Ratios", "Algebra", "Measurement"] },
      { title: "Science", topics: ["Biology", "Chemistry", "Anatomy", "Physiology", "Scientific Reasoning"] },
      { title: "English & Language Usage", topics: ["Grammar", "Punctuation", "Sentence Structure", "Vocabulary", "Writing Conventions"] },
    ],
    studyPlan: [
      "Start with a four-domain diagnostic to identify reading, math, science, and English priorities.",
      "Complete short lessons before flashcards so practice is tied to taught concepts.",
      "Use timed section drills after each domain review to build pace without guessing habits.",
      "Route weak areas into targeted flashcards, practice questions, and follow-up lessons.",
    ],
    learningActivities: [
      "Lessons",
      "Flashcards",
      "Practice Questions",
      "Readiness Tracking",
      "Study Plans",
      "Progress Analytics",
    ],
    readinessDomains: ["Reading Readiness", "Science Readiness", "Math Readiness", "English Readiness"],
    practiceModes: [
      { title: "Tutor Mode", description: "Immediate feedback with hints, rationales, study tips, and related lessons." },
      { title: "Timed Section Drills", description: "Domain-specific pacing practice for reading, math, science, and English." },
      { title: "Review Mode", description: "Post-attempt review that groups misses by concept and routes remediation." },
    ],
    hintsAndPearls: [
      "Eliminate clearly incorrect answers before calculating.",
      "Focus on unit conversions before solving the equation.",
      "Use the passage evidence before relying on memory or outside knowledge.",
    ],
    rationaleRequirements: STANDARD_RATIONALE_REQUIREMENTS,
    feedsInto: ["Pre-Nursing", "RN", "RPN", "Allied Health"],
    screenshotAlt: "ATI TEAS lesson, flashcard, practice question, and readiness dashboard preview",
    supportsCatExams: false,
  },
  {
    slug: "hesi-a2",
    title: "HESI A2 Admissions Prep",
    shortTitle: "HESI A2",
    canonicalPath: "/pre-nursing/hesi-a2",
    overview:
      "A complete HESI A2 preparation pathway for nursing-school admission that combines prerequisite science, reading, language, vocabulary, math, learning style, and personality profile preparation.",
    examBreakdown: [
      { title: "Math", topics: ["Fractions", "Ratios", "Conversions", "Word Problems", "Dosage Foundations"] },
      { title: "Reading Comprehension", topics: ["Main Idea", "Supporting Details", "Inference", "Purpose", "Tone"] },
      { title: "Vocabulary", topics: ["Word Parts", "Context Clues", "Healthcare Vocabulary", "Academic Language"] },
      { title: "Grammar", topics: ["Agreement", "Pronouns", "Punctuation", "Modifiers", "Sentence Clarity"] },
      { title: "Biology", topics: ["Cells", "Genetics", "Energy", "Organisms", "Scientific Reasoning"] },
      { title: "Chemistry", topics: ["Atoms", "Ions", "Bonding", "Solutions", "Acids and Bases"] },
      { title: "Anatomy & Physiology", topics: ["Homeostasis", "Cardiorespiratory", "Renal", "Neurologic", "Endocrine"] },
      { title: "Learning Style", topics: ["Study Habits", "Learning Preferences", "Reflection", "Academic Planning"] },
      { title: "Personality Profile", topics: ["Professional Traits", "Self-Awareness", "Communication", "Team Readiness"] },
    ],
    studyPlan: [
      "Use a diagnostic by HESI A2 section before choosing weekly study priorities.",
      "Pair prerequisite lessons with flashcards for vocabulary-heavy domains.",
      "Practice math and reading in timed mode after accuracy improves in tutor mode.",
      "Review performance reports to choose the next science, reading, or language lesson.",
    ],
    learningActivities: [
      "Lessons",
      "Flashcards",
      "Practice Questions",
      "Study Plans",
      "Readiness Tracking",
      "Timed Practice Exams",
      "Performance Reports",
    ],
    readinessDomains: ["Math Readiness", "A&P Readiness", "Chemistry Readiness", "Reading Readiness"],
    practiceModes: [
      { title: "Timed Mode", description: "Realistic pacing practice by HESI A2 section." },
      { title: "Tutor Mode", description: "Guided learning with hints, rationales, study tips, and related lessons." },
      { title: "Review Mode", description: "Structured review after practice exams with weak-area remediation." },
      { title: "Detailed Rationales", description: "Every item explains correct logic, distractors, exam strategy, and learning pearls." },
      { title: "Performance Reports", description: "Section-level readiness, missed concepts, and recommended next steps." },
    ],
    hintsAndPearls: [
      "Translate word problems into units before choosing an operation.",
      "Use prefixes and suffixes to decode unfamiliar health-science vocabulary.",
      "Master normal physiology first; it makes pathophysiology and nursing school easier.",
    ],
    rationaleRequirements: STANDARD_RATIONALE_REQUIREMENTS,
    feedsInto: ["Pre-Nursing", "RN", "RPN", "Allied Health"],
    screenshotAlt: "HESI A2 practice exam, science lesson, flashcards, and performance report preview",
    supportsCatExams: false,
  },
  {
    slug: "casper",
    title: "CASPER Situational Judgment Prep",
    shortTitle: "CASPER",
    canonicalPath: "/pre-nursing/casper",
    overview:
      "A professional judgment preparation ecosystem for admissions interviews and CASPER-style situational judgment scenarios with written response, video response, timed practice, structured rubrics, and communication coaching.",
    examBreakdown: [
      { title: "Professionalism", topics: ["Accountability", "Boundaries", "Reliability", "Respect"] },
      { title: "Ethics", topics: ["Fairness", "Confidentiality", "Competing Duties", "Integrity"] },
      { title: "Communication", topics: ["Clarity", "Active Listening", "Nonjudgmental Language", "De-escalation"] },
      { title: "Empathy", topics: ["Validation", "Perspective Taking", "Supportive Responses", "Emotional Awareness"] },
      { title: "Conflict Resolution", topics: ["Stakeholders", "Common Ground", "Escalation", "Follow-Up"] },
      { title: "Cultural Safety", topics: ["Humility", "Bias Awareness", "Power Dynamics", "Respectful Care"] },
      { title: "Equity & Inclusion", topics: ["Access Barriers", "Inclusive Language", "Advocacy", "Fair Process"] },
      { title: "Teamwork", topics: ["Collaboration", "Role Clarity", "Feedback", "Shared Goals"] },
      { title: "Leadership", topics: ["Initiative", "Accountability", "Prioritization", "Professional Influence"] },
      { title: "Patient Advocacy", topics: ["Safety", "Voice", "Escalation", "Patient-Centered Reasoning"] },
      { title: "Decision Making", topics: ["Options", "Risks", "Evidence", "Balanced Judgment"] },
      { title: "Professional Accountability", topics: ["Reflection", "Ownership", "Remediation", "Learning Mindset"] },
    ],
    studyPlan: [
      "Learn response frameworks before attempting timed scenarios.",
      "Practice written responses, then compare against evaluation criteria.",
      "Add video response practice for communication structure and professional presence.",
      "Review rubric trends across empathy, ethics, communication, and decision-making.",
    ],
    learningActivities: [
      "Lessons",
      "Flashcards",
      "Scenario Practice",
      "Practice Questions",
      "Written Responses",
      "Video Responses",
      "Timed Responses",
      "Interview Practice",
      "Study Plans",
      "Readiness Tracking",
    ],
    readinessDomains: ["Professional Judgment", "Communication", "Ethics", "Empathy", "Decision-Making"],
    practiceModes: [
      { title: "Written Response", description: "Scenario prompts with reflection questions, response frameworks, and feedback." },
      { title: "Video Response", description: "Optional speaking practice focused on structure, professionalism, and empathy." },
      { title: "Timed Response", description: "Time-boxed practice that simulates admissions pressure without rote scripts." },
      { title: "Interview Practice", description: "Professional communication prompts for admissions and program interviews." },
    ],
    hintsAndPearls: [
      "Demonstrate empathy before proposing a solution.",
      "Consider multiple stakeholder perspectives.",
      "Name uncertainty, then explain the safest next professional step.",
    ],
    rationaleRequirements: [
      "Suggested Response Framework",
      "Evaluation Criteria",
      "Feedback",
      "Professionalism Pearl",
      "Communication Pearl",
      "Ethics Pearl",
      "Related Lesson",
    ],
    feedsInto: ["Pre-Nursing", "RN", "RPN", "Allied Health"],
    screenshotAlt: "CASPER scenario practice, timed response, video response, and professional judgment dashboard preview",
    supportsCatExams: false,
  },
] as const;

export const FUTURE_ADMISSION_EXAMS: readonly FutureAdmissionExam[] = [
  {
    title: "NLN NEX",
    description: "Future entrance-exam support for programs using NLN Nursing Entrance Exam requirements.",
  },
  {
    title: "Wonderlic",
    description: "Future aptitude-prep support for programs that require Wonderlic-style entrance testing.",
  },
  {
    title: "Institution-specific entrance exams",
    description: "Future school-specific admissions prep that can map local prerequisites to NurseNest foundations.",
  },
] as const;

export const ADMISSIONS_SUBSCRIPTION_STRATEGY = {
  options: [
    {
      label: "Included with Pre-Nursing",
      projection:
        "Best for top-of-funnel growth and pathway retention. Conservative upside: higher Pre-Nursing conversion with lower standalone admissions revenue.",
    },
    {
      label: "Separate Admissions Prep products",
      projection:
        "Best for clear exam-specific packaging. Conservative upside: higher average order value from learners who only need TEAS, HESI A2, or CASPER.",
    },
  ],
  recommendation:
    "Package a starter admissions layer inside Pre-Nursing, then offer Admissions Prep Plus for full practice exams, video CASPER training, readiness reports, and analytics. This keeps the feeder pathway open while preserving a paid upgrade for high-intent applicants.",
} as const;

export function getAdmissionExamProductBySlug(slug: string): AdmissionExamProduct | undefined {
  return ADMISSION_EXAM_PRODUCTS.find((product) => product.slug === slug);
}
