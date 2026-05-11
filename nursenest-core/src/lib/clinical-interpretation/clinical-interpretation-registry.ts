/**
 * Clinical Interpretation SEO + learning ecosystem — registry (single source of truth).
 *
 * - URLs are **planned canonical paths** under `/clinical-interpretation` (marketing App Router) once UI ships post-Figma.
 * - Do **not** emit these URLs in sitemaps until {@link ClinicalInterpretationEntry.status} is `"published"`.
 * - Tier/product naming stays aligned with NurseNest entitlements; free vs premium is **content layering**, not a second auth system.
 */

export type ClinicalInterpretationId =
  | "abg-interpretation"
  | "ecg-interpretation"
  | "chest-xray-interpretation"
  | "lab-values-explained"
  | "critical-lab-values-nclex"
  | "electrolyte-interpretation"
  | "fluid-overload-vs-dehydration"
  | "sepsis-interpretation"
  | "hemodynamic-interpretation";

export type ClinicalInterpretationCategory =
  | "acid_base"
  | "cardiac_rhythm"
  | "imaging"
  | "laboratory"
  | "critical_care"
  | "fluids_electrolytes"
  | "infection_sepsis"
  | "perfusion_shock";

export type ClinicalInterpretationDifficulty = "beginner" | "intermediate" | "advanced";

export type ExamRelevanceTag =
  | "nclex_rn"
  | "nclex_pn"
  | "np"
  | "new_grad"
  | "clinical_practice";

export type ClinicalInterpretationStatus =
  /** Design + IA frozen in Figma; no public SEO surface yet */
  | "figma_pending"
  /** Copy/interactives in progress; still noindex */
  | "draft"
  /** Reviewed, indexable when wired to routes + metadata */
  | "published";

export type ClinicalInterpretationSchemaProfile = {
  /** FAQ JSON-LD allowed when FAQ sections exist and clinical claims are reviewed */
  faqEligible: boolean;
  /** LearningResource / Article-style structured data */
  learningResourceEligible: boolean;
};

export type ClinicalInterpretationSegmentation = {
  /** Topics surfaced without subscription (SEO + trust + useful frameworks) */
  freeHighlights: string[];
  /** Subscriber-advanced layers (drills, adaptive engines, progressive cases) */
  premiumHighlights: string[];
};

export type ClinicalInterpretationRelatedLinks = {
  /** Pathway-scoped lesson slugs for in-app deep links (see `buildAppLessonsReviewLessonHref`) */
  lessonSlugs: string[];
  /** Bidirectional topic keys / topic slugs for practice + flashcards query builders */
  topicSlugs: string[];
  /** Stable learner tool routes (never invent paths — must exist in app) */
  appToolHrefs: readonly string[];
  /** Marketing-safe destinations for CTAs (hubs, modules) */
  marketingHrefs: readonly string[];
  /** Internal SEO targets (blogs, programmatic guides) — optional */
  marketingArticlePaths?: readonly string[];
};

export type ClinicalInterpretationEntry = {
  id: ClinicalInterpretationId;
  slug: string;
  category: ClinicalInterpretationCategory;
  /** Unique SEO title (≤ ~60 chars recommended) */
  seoTitle: string;
  /** Unique meta description (≤ ~155 chars recommended) */
  metaDescription: string;
  h1: string;
  segmentation: ClinicalInterpretationSegmentation;
  difficulty: ClinicalInterpretationDifficulty;
  examRelevance: ExamRelevanceTag[];
  related: ClinicalInterpretationRelatedLinks;
  schema: ClinicalInterpretationSchemaProfile;
  status: ClinicalInterpretationStatus;
  /** Primary keyword phrases for internal linking + editorial QA */
  targetQueries: string[];
};

/** Planned canonical path segments (hub + detail). Base URL joins site origin at render time. */
export const CLINICAL_INTERPRETATION_HUB_PATH = "/clinical-interpretation" as const;

export function clinicalInterpretationGuidePath(slug: string): string {
  const s = slug.trim();
  if (!s || s.includes("..")) return CLINICAL_INTERPRETATION_HUB_PATH;
  return `${CLINICAL_INTERPRETATION_HUB_PATH}/${encodeURIComponent(s)}`;
}

export function isClinicalInterpretationIndexable(entry: ClinicalInterpretationEntry): boolean {
  return entry.status === "published";
}

export function clinicalInterpretationRobotsDirective(
  entry: ClinicalInterpretationEntry,
): "index,follow" | "noindex,follow" {
  return isClinicalInterpretationIndexable(entry) ? "index,follow" : "noindex,follow";
}

const LABS_HUB = "/app/labs";
const MED_CALC = "/app/med-calculations";
const ECG_MODULE = "/modules/ecg";
const LAB_VALUES_MODULE = "/modules/lab-values";
const CLINICAL_SCENARIOS_APP = "/app/clinical-scenarios";
const PRACTICE_TESTS = "/app/practice-tests";
const FLASHCARDS = "/app/flashcards";
const REPORT_CARD = "/app/account/report";
const LAB_DRILLS = "/app/lab-drills";

/** Default RN NCLEX pathway for link examples (callers replace with session pathway). */
export const DEFAULT_INTERPRETATION_PATHWAY_ID = "us-rn-nclex-rn" as const;

export const CLINICAL_INTERPRETATION_REGISTRY: readonly ClinicalInterpretationEntry[] = [
  {
    id: "abg-interpretation",
    slug: "abg-interpretation",
    category: "acid_base",
    seoTitle: "ABG Interpretation for Nurses | Acid–Base & Oxygenation Clinical Guide",
    metaDescription:
      "Learn nursing ABG interpretation: acidosis vs alkalosis, respiratory vs metabolic compensation, oxygenation clues, and safety-focused next steps aligned to bedside assessment.",
    h1: "Arterial Blood Gas (ABG) Interpretation for Nurses",
    segmentation: {
      freeHighlights: [
        "pH / PaCO₂ / HCO₃⁻ orientation and primary disorder naming",
        "Respiratory vs metabolic patterns and expected compensation (introductory)",
        "PaO₂ / SaO₂ / A–a gradient basics with hypoxemia framing",
        "Worked examples with plain-language nursing implications",
      ],
      premiumHighlights: [
        "Mixed disorders and advanced compensation logic",
        "Ventilator-linked ABG cases with evolving ICU trajectories",
        "Adaptive interpretation drills with progressive complexity",
        "Remediation loops tied to CAT-style prioritization practice",
      ],
    },
    difficulty: "intermediate",
    examRelevance: ["nclex_rn", "new_grad", "clinical_practice"],
    related: {
      lessonSlugs: ["abg-interpretation-rn"],
      topicSlugs: ["abg-acid-base", "fluids-electrolytes"],
      appToolHrefs: [LABS_HUB, MED_CALC, PRACTICE_TESTS, FLASHCARDS, REPORT_CARD],
      marketingHrefs: [LAB_VALUES_MODULE],
    },
    schema: { faqEligible: true, learningResourceEligible: true },
    status: "figma_pending",
    targetQueries: ["ABG interpretation", "arterial blood gas nursing", "acid base interpretation", "PaCO2 HCO3"],
  },
  {
    id: "ecg-interpretation",
    slug: "ecg-interpretation",
    category: "cardiac_rhythm",
    seoTitle: "ECG Interpretation for Nurses | Rhythm Recognition & Clinical Reasoning",
    metaDescription:
      "Build ECG interpretation skill for acute care: intervals, axis essentials, ischemia patterns, arrhythmia recognition, and escalation thinking — mapped to nursing assessment priorities.",
    h1: "ECG Interpretation for Nurses",
    segmentation: {
      freeHighlights: [
        "Waveform anatomy and rate/rhythm fundamentals",
        "Normal sinus rhythm and common benign variants (intro)",
        "Beginner arrhythmia patterns with nursing implications",
        "Sample strips with systematic interpretation checklist",
      ],
      premiumHighlights: [
        "Telemetry drill tracks with timed interpretation sets",
        "STEMI localization and advanced ischemia mimics (pathway-scoped)",
        "Adaptive rhythm ladder with difficulty progression",
        "Scenario-linked deterioration cues for inpatient telemetry",
      ],
    },
    difficulty: "intermediate",
    examRelevance: ["nclex_rn", "nclex_pn", "new_grad", "clinical_practice"],
    related: {
      lessonSlugs: ["ecg-interpretation-rn"],
      topicSlugs: ["cardiovascular", "electrolytes-volume"],
      appToolHrefs: [PRACTICE_TESTS, FLASHCARDS, CLINICAL_SCENARIOS_APP, REPORT_CARD],
      marketingHrefs: [ECG_MODULE],
    },
    schema: { faqEligible: true, learningResourceEligible: true },
    status: "figma_pending",
    targetQueries: ["ECG interpretation", "telemetry nursing", "QRS complex", "nursing ECG interpretation"],
  },
  {
    id: "chest-xray-interpretation",
    slug: "chest-x-ray-interpretation-for-nurses",
    category: "imaging",
    seoTitle: "Chest X-Ray Interpretation for Nurses | Bedside Recognition & Safety Checks",
    metaDescription:
      "Nursing-focused chest X-ray interpretation: normal landmarks, infiltrates, effusions, pneumothorax cues, line/tube signals, and when to escalate — without radiology overreach.",
    h1: "Chest X-Ray Interpretation for Nurses",
    segmentation: {
      freeHighlights: [
        "Normal anatomy checklist for rapid orientation",
        "Infiltrate vs atelectasis patterns (introductory)",
        "Pleural effusion and pneumothorax recognition basics",
        "Pulmonary edema patterns linked to assessment findings",
      ],
      premiumHighlights: [
        "ICU chest film workflows: devices, lines, and complications",
        "Progressive case sets with evolving respiratory status",
        "Advanced pattern libraries with differential reasoning cards",
        "Interpretation simulations with structured nursing priorities",
      ],
    },
    difficulty: "intermediate",
    examRelevance: ["nclex_rn", "new_grad", "clinical_practice"],
    related: {
      lessonSlugs: ["imaging-interpretation-np"],
      topicSlugs: ["respiratory", "abg-acid-base"],
      appToolHrefs: [CLINICAL_SCENARIOS_APP, PRACTICE_TESTS, REPORT_CARD],
      marketingHrefs: [],
    },
    schema: { faqEligible: true, learningResourceEligible: true },
    status: "figma_pending",
    targetQueries: ["chest xray interpretation", "CXR nursing", "pleural effusion x ray", "pulmonary edema chest x ray"],
  },
  {
    id: "lab-values-explained",
    slug: "lab-values-explained",
    category: "laboratory",
    seoTitle: "Lab Values Explained for Nurses | Interpretation, Patterns & Next Steps",
    metaDescription:
      "Understand common nursing labs beyond reference ranges: pattern recognition, trends, clinical significance, prioritization, and escalation hooks tied to bedside judgment.",
    h1: "Lab Values Explained for Nurses",
    segmentation: {
      freeHighlights: [
        "Why labs matter for nursing assessment and communication",
        "Normal-range orientation without memorization-only framing",
        "Introductory pattern pairs (renal, hepatic, inflammatory cues)",
        "Safe nursing implications and repeat/urgency thinking",
      ],
      premiumHighlights: [
        "Multi-lab trend interpretation and deterioration signatures",
        "Differential reasoning drills across combined abnormalities",
        "Critical-care pattern libraries with remediation loops",
        "Labs workstation progression tied to flashcards and CAT-style drills",
      ],
    },
    difficulty: "beginner",
    examRelevance: ["nclex_rn", "nclex_pn", "np", "new_grad"],
    related: {
      lessonSlugs: ["lab-interpretation-np"],
      topicSlugs: ["fluids-electrolytes", "renal-gu", "cardiovascular"],
      appToolHrefs: [LABS_HUB, LAB_DRILLS, PRACTICE_TESTS, FLASHCARDS, REPORT_CARD],
      marketingHrefs: [LAB_VALUES_MODULE],
    },
    schema: { faqEligible: true, learningResourceEligible: true },
    status: "figma_pending",
    targetQueries: ["lab values nursing", "nursing lab interpretation", "critical labs explained", "lab trends nursing"],
  },
  {
    id: "critical-lab-values-nclex",
    slug: "critical-lab-values-nclex",
    category: "critical_care",
    seoTitle: "Critical Lab Values for NCLEX | Recognition, Actions & Patient Safety",
    metaDescription:
      "Critical lab values nursing students must recognize: thresholds, immediate assessments, escalation and communication patterns, and NCLEX-style prioritization frames.",
    h1: "Critical Lab Values for NCLEX",
    segmentation: {
      freeHighlights: [
        "Threshold-based recognition with safety-first framing",
        "Immediate nursing actions and reassessment cadence",
        "Communication and escalation prompts",
        "Starter NCLEX-style prioritization examples",
      ],
      premiumHighlights: [
        "Rapid-response style simulations with multi-step deterioration",
        "Adaptive prioritization drills and timed recognition sets",
        "ICU-oriented deterioration arcs with trend interpretation",
        "Weak-area remediation tied to practice tests and report card signals",
      ],
    },
    difficulty: "intermediate",
    examRelevance: ["nclex_rn", "nclex_pn"],
    related: {
      lessonSlugs: [],
      topicSlugs: ["fluids-electrolytes", "electrolytes-volume", "renal-gu"],
      appToolHrefs: [LABS_HUB, PRACTICE_TESTS, FLASHCARDS, REPORT_CARD],
      marketingHrefs: [LAB_VALUES_MODULE],
    },
    schema: { faqEligible: true, learningResourceEligible: true },
    status: "figma_pending",
    targetQueries: ["critical lab values", "critical labs NCLEX", "nursing critical values", "lab prioritization"],
  },
  {
    id: "electrolyte-interpretation",
    slug: "electrolyte-interpretation",
    category: "fluids_electrolytes",
    seoTitle: "Electrolyte Interpretation for Nurses | Causes, ECG Links & Priorities",
    metaDescription:
      "Electrolyte interpretation for bedside nurses: sodium and potassium disturbances, ECG correlations, neuromuscular and cardiac risk signals, and escalation judgment.",
    h1: "Electrolyte Interpretation for Nurses",
    segmentation: {
      freeHighlights: [
        "Na⁺ / K⁺ directional framing with symptom clusters",
        "ECG implication overview for emergent electrolyte threats",
        "Dehydration vs dilution basics as context for labs",
        "NCLEX-friendly prioritization examples",
      ],
      premiumHighlights: [
        "Complex combined electrolyte patterns with renal/endocrine integration",
        "Telemetry-linked drills for hyperkalemia/hypokalemia arcs",
        "ICU trend interpretation with adaptive difficulty",
        "Cross-links to ABG and fluid assessment mastery tracks",
      ],
    },
    difficulty: "intermediate",
    examRelevance: ["nclex_rn", "np", "clinical_practice"],
    related: {
      lessonSlugs: [],
      topicSlugs: ["fluids-electrolytes", "electrolytes-volume", "abg-acid-base"],
      appToolHrefs: [LABS_HUB, PRACTICE_TESTS, FLASHCARDS, REPORT_CARD],
      marketingHrefs: [LAB_VALUES_MODULE],
    },
    schema: { faqEligible: true, learningResourceEligible: true },
    status: "figma_pending",
    targetQueries: ["electrolyte interpretation", "hyperkalemia nursing", "hyponatremia nursing", "ECG electrolytes"],
  },
  {
    id: "fluid-overload-vs-dehydration",
    slug: "fluid-overload-vs-dehydration-assessment",
    category: "fluids_electrolytes",
    seoTitle: "Fluid Overload vs Dehydration | Nursing Assessment & Interpretation Guide",
    metaDescription:
      "Compare fluid overload vs dehydration with bedside assessment cues, intake/output interpretation, hemodynamic context, lab correlations, and escalation priorities for nurses.",
    h1: "Fluid Overload vs Dehydration Assessment",
    segmentation: {
      freeHighlights: [
        "Clinical signs vs symptoms framing for volume states",
        "I/O interpretation basics and pitfall avoidance",
        "Lab correlates (renal panel, surrogates) without overfitting",
        "Safety-focused monitoring cadence",
      ],
      premiumHighlights: [
        "Shock spectrum integration and progression scenarios",
        "Hemodynamic reasoning with fluid responsiveness concepts (pathway-scoped)",
        "ICU case arcs with ventilator and electrolyte coupling",
        "Adaptive drills tying fluids to sepsis and cardiac modules",
      ],
    },
    difficulty: "beginner",
    examRelevance: ["nclex_rn", "nclex_pn", "new_grad"],
    related: {
      lessonSlugs: [],
      topicSlugs: ["fluids-electrolytes", "electrolytes-volume"],
      appToolHrefs: [LABS_HUB, MED_CALC, CLINICAL_SCENARIOS_APP, REPORT_CARD],
      marketingHrefs: [],
    },
    schema: { faqEligible: true, learningResourceEligible: true },
    status: "figma_pending",
    targetQueries: ["fluid overload vs dehydration", "dehydration assessment nursing", "fluid overload nursing", "I and O nursing"],
  },
  {
    id: "sepsis-interpretation",
    slug: "sepsis-interpretation",
    category: "infection_sepsis",
    seoTitle: "Sepsis Interpretation for Nurses | Screening, Labs & Escalation Reasoning",
    metaDescription:
      "Interpret sepsis clinically as a nurse: screening constructs, lactate and hemodynamic signals, trend interpretation, antibiotic and escalation mindfulness, and team communication.",
    h1: "Sepsis Interpretation for Nurses",
    segmentation: {
      freeHighlights: [
        "SIRS vs sepsis framing with modern screening orientation",
        "Lactate basics and reassessment logic",
        "Nursing assessment priorities and escalation triggers",
        "Introductory case examples with documentation cues",
      ],
      premiumHighlights: [
        "Septic shock progression simulations",
        "Vasopressor and perfusion interpretation tracks (advanced)",
        "Multi-modal labs + telemetry deterioration sets",
        "NGN-style judgment cases with branching rationale",
      ],
    },
    difficulty: "advanced",
    examRelevance: ["nclex_rn", "new_grad", "clinical_practice"],
    related: {
      lessonSlugs: [],
      topicSlugs: ["sepsis", "sepsis-infection"],
      appToolHrefs: [LABS_HUB, PRACTICE_TESTS, CLINICAL_SCENARIOS_APP, REPORT_CARD],
      marketingHrefs: [],
    },
    schema: { faqEligible: true, learningResourceEligible: true },
    status: "figma_pending",
    targetQueries: ["sepsis interpretation", "lactate sepsis nursing", "septic shock nursing assessment", "qSOFA nursing"],
  },
  {
    id: "hemodynamic-interpretation",
    slug: "hemodynamic-interpretation",
    category: "perfusion_shock",
    seoTitle: "Hemodynamic Interpretation for Nurses | Perfusion, Shock & Monitoring Basics",
    metaDescription:
      "Hemodynamic interpretation essentials for nurses: MAP, preload/afterload intuition, shock categories, vasopressor context, and invasive monitoring literacy — scoped to nursing judgment.",
    h1: "Hemodynamic Interpretation for Nurses",
    segmentation: {
      freeHighlights: [
        "MAP and perfusion basics tied to assessment endpoints",
        "Preload/afterload intuition without engineering overload",
        "Shock category orientation with nursing priorities",
        "Worked comparisons of cold vs warm shock presentations",
      ],
      premiumHighlights: [
        "Advanced ICU hemodynamics literacy pathways",
        "Vasoactive infusion interpretation scenarios",
        "Invasive monitoring guided cases where clinically appropriate",
        "Cross-linked sepsis and fluid assessment mastery circuits",
      ],
    },
    difficulty: "advanced",
    examRelevance: ["nclex_rn", "np", "new_grad", "clinical_practice"],
    related: {
      lessonSlugs: [],
      topicSlugs: ["shock", "cardiovascular"],
      appToolHrefs: [CLINICAL_SCENARIOS_APP, PRACTICE_TESTS, REPORT_CARD],
      marketingHrefs: [ECG_MODULE],
    },
    schema: { faqEligible: true, learningResourceEligible: true },
    status: "figma_pending",
    targetQueries: ["hemodynamic interpretation", "MAP nursing", "shock nursing assessment", "vasopressor nursing"],
  },
] as const;

export function getClinicalInterpretationBySlug(slug: string): ClinicalInterpretationEntry | undefined {
  const key = slug.trim();
  return CLINICAL_INTERPRETATION_REGISTRY.find((e) => e.slug === key);
}

export function getClinicalInterpretationById(id: ClinicalInterpretationId): ClinicalInterpretationEntry | undefined {
  return CLINICAL_INTERPRETATION_REGISTRY.find((e) => e.id === id);
}