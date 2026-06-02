/**
 * Lesson ↔ Blog bidirectional linking system.
 *
 * For each lesson, provides:
 *   - 2-3 related blog topics it should be linked FROM
 *   - Anchor text suggestions for natural internal links
 *
 * For each blog, provides:
 *   - 2-4 lessons it MUST link to
 *   - Anchor text templates
 *   - Question bank and CAT exam link templates
 *
 * This drives both:
 *   1. Blog content generation (AI knows what to link)
 *   2. Lesson page "Related articles" sections
 */

// ── Types ────────────────────────────────────────────────────────────────────

export type LessonBlogLink = {
  lessonSlug: string;
  lessonTitle: string;
  /** Blog topics that should link TO this lesson (2-3 per lesson). */
  relatedBlogTopics: string[];
  /** Anchor text suggestions for linking to this lesson from blogs. */
  anchorTextSuggestions: string[];
};

export type BlogLinkingRules = {
  /** Minimum lessons each blog must link to. */
  minLessonLinks: number;
  /** Maximum lessons each blog should link to. */
  maxLessonLinks: number;
  /** Must link to question bank? */
  requireQuestionBankLink: boolean;
  /** Must link to CAT exam? */
  requireCatLink: boolean;
  /** Anchor text templates for question bank links. */
  questionBankAnchors: string[];
  /** Anchor text templates for CAT exam links. */
  catExamAnchors: string[];
  /** Anchor text templates for lesson links. */
  lessonAnchors: string[];
  /** Anchor text templates for pricing links. */
  pricingAnchors: string[];
};

// ── Lesson → Blog mapping ────────────────────────────────────────────────────

export const LESSON_BLOG_LINKS: LessonBlogLink[] = [
  {
    lessonSlug: "clinical-judgment-prioritization-gold",
    lessonTitle: "Clinical Judgment & Prioritization",
    relatedBlogTopics: [
      "Clinical Judgment on the NCLEX: Why It Matters",
      "NCLEX Prioritization and Delegation Questions Explained",
      "How to Think Like a Nurse: Clinical Reasoning for the NCLEX",
    ],
    anchorTextSuggestions: [
      "practice clinical judgment questions",
      "study clinical judgment and prioritization",
      "master NCLEX prioritization",
      "clinical judgment lesson",
    ],
  },
  {
    lessonSlug: "sepsis-early-recognition-gold",
    lessonTitle: "Sepsis: Early Recognition & Response",
    relatedBlogTopics: [
      "Sepsis NCLEX Questions: Signs, Screening, and Interventions",
      "How to Remember Sepsis Criteria for the NCLEX",
      "Infection Control NCLEX Review: Standard Precautions and Beyond",
    ],
    anchorTextSuggestions: [
      "study sepsis recognition",
      "review sepsis nursing care",
      "practice sepsis questions",
      "sepsis early recognition lesson",
    ],
  },
  {
    lessonSlug: "fluids-electrolytes-emergencies-gold",
    lessonTitle: "Fluids & Electrolyte Emergencies",
    relatedBlogTopics: [
      "Fluid and Electrolyte NCLEX Questions Made Simple",
      "How to Remember Electrolyte Imbalances for the NCLEX",
      "IV Fluid Therapy: What Nurses Need to Know for the NCLEX",
    ],
    anchorTextSuggestions: [
      "practice fluid and electrolyte questions",
      "study electrolyte imbalances",
      "review IV fluid therapy",
      "fluids and electrolytes lesson",
    ],
  },
  {
    lessonSlug: "acute-coronary-syndrome-gold",
    lessonTitle: "Acute Coronary Syndrome",
    relatedBlogTopics: [
      "Cardiac NCLEX Questions: ACS, Heart Failure, and Arrhythmias",
      "Acute Coronary Syndrome Nursing Care for the NCLEX",
      "Cardiovascular Nursing Review for Exam Prep",
    ],
    anchorTextSuggestions: [
      "review acute coronary syndrome",
      "study cardiac nursing for the NCLEX",
      "practice ACS questions",
      "ACS lesson",
    ],
  },
  {
    lessonSlug: "high-alert-medications-gold",
    lessonTitle: "High-Alert Medications",
    relatedBlogTopics: [
      "NCLEX High-Alert Medications You Must Know",
      "Pharmacology Review: Drug Safety on the NCLEX",
      "How to Remember Medication Side Effects for the NCLEX",
    ],
    anchorTextSuggestions: [
      "study high-alert medications",
      "review medication safety",
      "practice pharmacology questions",
      "high-alert medications lesson",
    ],
  },
  {
    lessonSlug: "stroke-increased-icp-gold",
    lessonTitle: "Stroke & Increased ICP",
    relatedBlogTopics: [
      "Stroke NCLEX Questions: Assessment and Interventions",
      "Increased ICP Nursing Care for the NCLEX",
      "Neurological NCLEX Review: Stroke, Seizures, and More",
    ],
    anchorTextSuggestions: [
      "study stroke nursing care",
      "review increased ICP management",
      "practice neuro questions",
      "stroke and ICP lesson",
    ],
  },
  {
    lessonSlug: "shock-gold",
    lessonTitle: "Shock: Types, Assessment & Interventions",
    relatedBlogTopics: [
      "Shock NCLEX Review: All Types Explained",
      "How to Differentiate Types of Shock on the NCLEX",
      "Emergency Nursing NCLEX Questions",
    ],
    anchorTextSuggestions: [
      "study types of shock",
      "review shock nursing interventions",
      "practice shock questions",
      "shock lesson",
    ],
  },
  {
    lessonSlug: "canadian-rpn-high-yield-gold",
    lessonTitle: "Canadian RPN High-Yield Review",
    relatedBlogTopics: [
      "REx-PN Study Guide for Canadian RPNs",
      "REx-PN vs NCLEX-PN: What You Need to Know",
      "Top REx-PN Study Tips and Common Mistakes",
    ],
    anchorTextSuggestions: [
      "review RPN high-yield topics",
      "study for the REx-PN",
      "practice RPN exam questions",
      "Canadian RPN review lesson",
    ],
  },
  {
    lessonSlug: "ob-emergencies-gold",
    lessonTitle: "OB Emergencies",
    relatedBlogTopics: [
      "Maternal Newborn NCLEX Questions Explained",
      "OB Emergencies Every Nurse Should Know for the NCLEX",
      "Pregnancy Complications: NCLEX Review Guide",
    ],
    anchorTextSuggestions: [
      "study OB emergencies",
      "review maternal nursing for the NCLEX",
      "practice maternity questions",
      "OB emergencies lesson",
    ],
  },
  {
    lessonSlug: "pediatric-triage-emergencies-gold",
    lessonTitle: "Pediatric Triage & Emergencies",
    relatedBlogTopics: [
      "Pediatric NCLEX Questions: What You Need to Know",
      "Pediatric Triage on the NCLEX: Assessment and Priorities",
      "Child Development NCLEX Review Guide",
    ],
    anchorTextSuggestions: [
      "study pediatric emergencies",
      "review pediatric triage",
      "practice pediatric nursing questions",
      "pediatric triage lesson",
    ],
  },
  {
    lessonSlug: "renal-dialysis-acute-complications-gold",
    lessonTitle: "Renal & Dialysis Acute Complications",
    relatedBlogTopics: [
      "Renal and Dialysis NCLEX Questions Explained",
      "Kidney Disease Nursing Review for the NCLEX",
      "Fluid Balance and Renal Failure on the NCLEX",
    ],
    anchorTextSuggestions: [
      "study renal complications",
      "review dialysis nursing care",
      "practice renal questions",
      "renal and dialysis lesson",
    ],
  },
  {
    lessonSlug: "copd-gold-standard",
    lessonTitle: "COPD Management",
    relatedBlogTopics: [
      "COPD NCLEX Questions: Assessment and Interventions",
      "Respiratory Nursing Review for the NCLEX",
      "Oxygen Therapy on the NCLEX: What Nurses Must Know",
    ],
    anchorTextSuggestions: [
      "study COPD management",
      "review respiratory nursing",
      "practice COPD questions",
      "COPD lesson",
    ],
  },
];

// ── Blog → Lesson linking rules ──────────────────────────────────────────────

export const BLOG_LINKING_RULES: BlogLinkingRules = {
  minLessonLinks: 2,
  maxLessonLinks: 4,
  requireQuestionBankLink: true,
  requireCatLink: false,

  questionBankAnchors: [
    "practice questions",
    "try free practice questions",
    "test your knowledge",
    "practice with real exam-style questions",
    "try a practice quiz",
  ],

  catExamAnchors: [
    "take a practice exam",
    "test your readiness with an adaptive exam",
    "try a full-length practice test",
    "measure your readiness",
    "take a CAT-style practice exam",
  ],

  lessonAnchors: [
    "study {{topic}} in depth",
    "review the {{topic}} lesson",
    "learn more about {{topic}}",
    "explore the {{topic}} study guide",
    "start the {{topic}} lesson",
  ],

  pricingAnchors: [
    "unlock full access",
    "see pricing",
    "start your free trial",
    "get unlimited practice",
    "upgrade your study plan",
  ],
};

// ── CTA templates by strategy ────────────────────────────────────────────────

export type CtaPosition = "early" | "mid" | "final";

export type CtaTemplate = {
  position: CtaPosition;
  text: string;
  href: string;
};

/**
 * Returns CTA templates for a blog post based on strategy.
 * Route placeholders ({{locale}}, {{region}}, etc.) should be resolved by the caller.
 */
export function getCtaTemplates(
  strategy: "soft_trial" | "readiness_check" | "unlock_full" | "study_plan",
): CtaTemplate[] {
  switch (strategy) {
    case "soft_trial":
      return [
        { position: "early", text: "Try free practice questions to test what you know.", href: "/{{locale}}/{{region}}/{{profession}}/{{exam}}/questions" },
        { position: "mid", text: "Want to practice this topic? Start a quick quiz.", href: "/{{locale}}/{{region}}/{{profession}}/{{exam}}/questions" },
        { position: "final", text: "Ready to study smarter? Start your free trial and access all lessons, questions, and practice exams.", href: "/{{locale}}/{{region}}/{{profession}}/{{exam}}/pricing" },
      ];
    case "readiness_check":
      return [
        { position: "early", text: "Wondering if you're ready? Track your readiness score.", href: "/{{locale}}/{{region}}/{{profession}}/{{exam}}/cat" },
        { position: "mid", text: "Take a practice test to measure where you stand.", href: "/{{locale}}/{{region}}/{{profession}}/{{exam}}/cat" },
        { position: "final", text: "Check your exam readiness now with an adaptive practice test.", href: "/{{locale}}/{{region}}/{{profession}}/{{exam}}/cat" },
      ];
    case "unlock_full":
      return [
        { position: "early", text: "Try a few practice questions for free.", href: "/{{locale}}/{{region}}/{{profession}}/{{exam}}/questions" },
        { position: "mid", text: "Unlock detailed rationales and track your progress.", href: "/{{locale}}/{{region}}/{{profession}}/{{exam}}/pricing" },
        { position: "final", text: "Get unlimited access to all questions, lessons, and practice exams. Start your free trial.", href: "/{{locale}}/{{region}}/{{profession}}/{{exam}}/pricing" },
      ];
    case "study_plan":
      return [
        { position: "early", text: "Get a personalized study plan built for your exam date.", href: "/{{locale}}/{{region}}/{{profession}}/{{exam}}/lessons" },
        { position: "mid", text: "Follow a structured study path with adaptive recommendations.", href: "/{{locale}}/{{region}}/{{profession}}/{{exam}}/lessons" },
        { position: "final", text: "Start your exam prep today with a clear study plan, practice questions, and readiness tracking.", href: "/{{locale}}/{{region}}/{{profession}}/{{exam}}/pricing" },
      ];
  }
}

// ── Language strategy ────────────────────────────────────────────────────────

export type TranslationPriority = {
  region: string;
  targetLocale: string;
  /** Only translate top N blogs by priority. */
  maxBlogs: number;
  /** Criteria for selection. */
  criteria: string;
};

export const TRANSLATION_PRIORITIES: TranslationPriority[] = [
  { region: "philippines", targetLocale: "tl", maxBlogs: 5, criteria: "Top 5 transactional-intent blogs only. Prioritize study plans and practice question posts." },
  { region: "india", targetLocale: "hi", maxBlogs: 3, criteria: "Top 3 highest-intent blogs only. Prioritize the main guide and study plan posts." },
  { region: "canada", targetLocale: "fr", maxBlogs: 5, criteria: "Top 5 RPN/REx-PN blogs only. French Canadian audience for practical nursing." },
];
