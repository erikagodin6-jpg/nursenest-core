/**
 * CNPLE SEO cluster — authoritative knowledge graph for the Canadian NP exam prep lane.
 *
 * IMPORTANT: CCRNR and the CNPLE are independent regulatory bodies and exams.
 * NurseNest is an independent exam prep platform. Nothing here is endorsed by or affiliated
 * with CCRNR. All "blueprint", "domain", and "question type" language reflects NurseNest's
 * own study taxonomy and publicly available Canadian NP competency frameworks, not confirmed
 * official exam content or weighting.
 *
 * CNPLE uses LOFT (linear on-the-fly testing), not CAT. Target launch: July 2026.
 */

// ──────────────────────────────────────────────────────────────────────────────
// Canonical hub paths (match exam-pathways-data-segment-a + marketing-entry-routes)
// ──────────────────────────────────────────────────────────────────────────────

export const CNPLE_HUB = "/canada/np/cnple" as const;
export const CNPLE_LESSONS = "/canada/np/cnple/lessons" as const;
export const CNPLE_QUESTIONS = "/canada/np/cnple/questions" as const;
export const CNPLE_PRICING = "/canada/np/cnple/pricing" as const;
export const CNPLE_SIMULATION = "/canada/np/cnple/cat" as const;
export const CNPLE_FLASHCARDS_HUB = "/canada/np/cnple/flashcards" as const;

// ──────────────────────────────────────────────────────────────────────────────
// Secondary pillar slugs (self-canonical discovery + SEO cluster pages)
// ──────────────────────────────────────────────────────────────────────────────

export const CNPLE_CLUSTER = {
  /** Primary discovery / practice entry — highest-volume keyword cluster. */
  practiceQuestions: "/cnple-practice-questions",
  /** Top-of-funnel study guide — "how to study for CNPLE" intent. */
  studyGuide: "/cnple-study-guide",
  /** Simulation-intent: "CNPLE practice exam / mock exam" searchers. */
  simulationExam: "/cnple-simulation-exam",
  /** Flashcard-intent: "CNPLE flashcards / spaced repetition" searchers. */
  flashcards: "/cnple-flashcards",
  /** Case-study format: "CNPLE clinical cases" searchers. */
  caseStudies: "/cnple-case-studies",

  // ── Phase 2 — new exam uncertainty captures ──────────────────────────────
  /** "What is the CNPLE?" — highest-volume informational trigger. */
  whatIsCnple: "/what-is-the-cnple",
  /** "CNPLE vs CNPE" — comparison intent, captures regulatory-transition confusion. */
  cnpleVsCnpe: "/cnple-vs-cnpe",
  /** "LOFT testing explained" — unique first-mover content for format clarity. */
  loftTesting: "/cnple-loft-testing",
  /** "CNPLE blueprint" — captures blueprint/competency-framework searches. */
  blueprint: "/cnple-blueprint",
  /** "Canadian NP exam changes 2026" — captures regulatory-transition news searches. */
  canadaNpExamPrep: "/canada-np-exam-prep",

  // ── Domain cluster pages ──────────────────────────────────────────────────
  clinicalJudgment: "/cnple-clinical-judgment",
  prescribingQuestions: "/cnple-prescribing-questions",
  pharmacology: "/cnple-pharmacology",
  labInterpretation: "/cnple-lab-interpretation",
  differentialDiagnosis: "/cnple-differential-diagnosis",
  mentalHealth: "/cnple-mental-health",

  // ── Population cluster pages ──────────────────────────────────────────────
  pediatrics: "/cnple-pediatrics",
  geriatrics: "/cnple-geriatrics",
  womensHealth: "/cnple-womens-health",
  primaryCare: "/cnple-primary-care",
} as const;

export type CnpleClusterSlug = (typeof CNPLE_CLUSTER)[keyof typeof CNPLE_CLUSTER];

// ──────────────────────────────────────────────────────────────────────────────
// Knowledge graph — which cluster pages to internally link from each page.
// Used to build dense interlinking without guesswork.
// ──────────────────────────────────────────────────────────────────────────────

export type CnplePageLinks = {
  /** Canonical hub path — always link back. */
  hub: typeof CNPLE_HUB;
  /** Questions, lessons, simulation, pricing entry points. */
  studyLinks: {
    questions: typeof CNPLE_QUESTIONS;
    lessons: typeof CNPLE_LESSONS;
    simulation?: typeof CNPLE_SIMULATION;
    pricing: typeof CNPLE_PRICING;
  };
  /** Related cluster pages (3–5 for SEO signal density without over-linking). */
  clusterRelated: CnpleClusterSlug[];
};

const ALL_STUDY = {
  questions: CNPLE_QUESTIONS,
  lessons: CNPLE_LESSONS,
  simulation: CNPLE_SIMULATION,
  pricing: CNPLE_PRICING,
} as const;

const NO_SIM_STUDY = {
  questions: CNPLE_QUESTIONS,
  lessons: CNPLE_LESSONS,
  pricing: CNPLE_PRICING,
} as const;

/** Internal-link recommendations by page. Ordered: highest-authority first. */
export const CNPLE_PAGE_GRAPH: Record<CnpleClusterSlug, CnplePageLinks> = {
  [CNPLE_CLUSTER.practiceQuestions]: {
    hub: CNPLE_HUB,
    studyLinks: ALL_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.clinicalJudgment,
      CNPLE_CLUSTER.prescribingQuestions,
      CNPLE_CLUSTER.labInterpretation,
      CNPLE_CLUSTER.differentialDiagnosis,
      CNPLE_CLUSTER.studyGuide,
    ],
  },
  [CNPLE_CLUSTER.studyGuide]: {
    hub: CNPLE_HUB,
    studyLinks: ALL_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.practiceQuestions,
      CNPLE_CLUSTER.whatIsCnple,
      CNPLE_CLUSTER.loftTesting,
      CNPLE_CLUSTER.blueprint,
      CNPLE_CLUSTER.simulationExam,
    ],
  },
  [CNPLE_CLUSTER.simulationExam]: {
    hub: CNPLE_HUB,
    studyLinks: ALL_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.loftTesting,
      CNPLE_CLUSTER.practiceQuestions,
      CNPLE_CLUSTER.studyGuide,
      CNPLE_CLUSTER.clinicalJudgment,
    ],
  },
  [CNPLE_CLUSTER.flashcards]: {
    hub: CNPLE_HUB,
    studyLinks: NO_SIM_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.practiceQuestions,
      CNPLE_CLUSTER.pharmacology,
      CNPLE_CLUSTER.labInterpretation,
      CNPLE_CLUSTER.studyGuide,
    ],
  },
  [CNPLE_CLUSTER.caseStudies]: {
    hub: CNPLE_HUB,
    studyLinks: ALL_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.clinicalJudgment,
      CNPLE_CLUSTER.differentialDiagnosis,
      CNPLE_CLUSTER.loftTesting,
      CNPLE_CLUSTER.prescribingQuestions,
    ],
  },
  [CNPLE_CLUSTER.whatIsCnple]: {
    hub: CNPLE_HUB,
    studyLinks: ALL_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.loftTesting,
      CNPLE_CLUSTER.cnpleVsCnpe,
      CNPLE_CLUSTER.blueprint,
      CNPLE_CLUSTER.practiceQuestions,
      CNPLE_CLUSTER.studyGuide,
    ],
  },
  [CNPLE_CLUSTER.cnpleVsCnpe]: {
    hub: CNPLE_HUB,
    studyLinks: ALL_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.whatIsCnple,
      CNPLE_CLUSTER.loftTesting,
      CNPLE_CLUSTER.blueprint,
      CNPLE_CLUSTER.studyGuide,
    ],
  },
  [CNPLE_CLUSTER.loftTesting]: {
    hub: CNPLE_HUB,
    studyLinks: ALL_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.whatIsCnple,
      CNPLE_CLUSTER.simulationExam,
      CNPLE_CLUSTER.cnpleVsCnpe,
      CNPLE_CLUSTER.practiceQuestions,
    ],
  },
  [CNPLE_CLUSTER.blueprint]: {
    hub: CNPLE_HUB,
    studyLinks: ALL_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.whatIsCnple,
      CNPLE_CLUSTER.cnpleVsCnpe,
      CNPLE_CLUSTER.studyGuide,
      CNPLE_CLUSTER.clinicalJudgment,
      CNPLE_CLUSTER.prescribingQuestions,
    ],
  },
  [CNPLE_CLUSTER.canadaNpExamPrep]: {
    hub: CNPLE_HUB,
    studyLinks: ALL_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.practiceQuestions,
      CNPLE_CLUSTER.studyGuide,
      CNPLE_CLUSTER.whatIsCnple,
      CNPLE_CLUSTER.simulationExam,
      CNPLE_CLUSTER.cnpleVsCnpe,
    ],
  },
  [CNPLE_CLUSTER.clinicalJudgment]: {
    hub: CNPLE_HUB,
    studyLinks: ALL_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.differentialDiagnosis,
      CNPLE_CLUSTER.caseStudies,
      CNPLE_CLUSTER.prescribingQuestions,
      CNPLE_CLUSTER.labInterpretation,
      CNPLE_CLUSTER.practiceQuestions,
    ],
  },
  [CNPLE_CLUSTER.prescribingQuestions]: {
    hub: CNPLE_HUB,
    studyLinks: ALL_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.pharmacology,
      CNPLE_CLUSTER.clinicalJudgment,
      CNPLE_CLUSTER.geriatrics,
      CNPLE_CLUSTER.mentalHealth,
      CNPLE_CLUSTER.practiceQuestions,
    ],
  },
  [CNPLE_CLUSTER.pharmacology]: {
    hub: CNPLE_HUB,
    studyLinks: ALL_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.prescribingQuestions,
      CNPLE_CLUSTER.labInterpretation,
      CNPLE_CLUSTER.geriatrics,
      CNPLE_CLUSTER.mentalHealth,
      CNPLE_CLUSTER.practiceQuestions,
    ],
  },
  [CNPLE_CLUSTER.labInterpretation]: {
    hub: CNPLE_HUB,
    studyLinks: ALL_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.differentialDiagnosis,
      CNPLE_CLUSTER.clinicalJudgment,
      CNPLE_CLUSTER.pharmacology,
      CNPLE_CLUSTER.practiceQuestions,
    ],
  },
  [CNPLE_CLUSTER.differentialDiagnosis]: {
    hub: CNPLE_HUB,
    studyLinks: ALL_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.clinicalJudgment,
      CNPLE_CLUSTER.labInterpretation,
      CNPLE_CLUSTER.caseStudies,
      CNPLE_CLUSTER.primaryCare,
      CNPLE_CLUSTER.practiceQuestions,
    ],
  },
  [CNPLE_CLUSTER.mentalHealth]: {
    hub: CNPLE_HUB,
    studyLinks: ALL_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.prescribingQuestions,
      CNPLE_CLUSTER.pharmacology,
      CNPLE_CLUSTER.clinicalJudgment,
      CNPLE_CLUSTER.primaryCare,
    ],
  },
  [CNPLE_CLUSTER.pediatrics]: {
    hub: CNPLE_HUB,
    studyLinks: ALL_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.primaryCare,
      CNPLE_CLUSTER.prescribingQuestions,
      CNPLE_CLUSTER.differentialDiagnosis,
      CNPLE_CLUSTER.practiceQuestions,
    ],
  },
  [CNPLE_CLUSTER.geriatrics]: {
    hub: CNPLE_HUB,
    studyLinks: ALL_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.prescribingQuestions,
      CNPLE_CLUSTER.pharmacology,
      CNPLE_CLUSTER.primaryCare,
      CNPLE_CLUSTER.differentialDiagnosis,
      CNPLE_CLUSTER.practiceQuestions,
    ],
  },
  [CNPLE_CLUSTER.womensHealth]: {
    hub: CNPLE_HUB,
    studyLinks: ALL_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.prescribingQuestions,
      CNPLE_CLUSTER.primaryCare,
      CNPLE_CLUSTER.clinicalJudgment,
      CNPLE_CLUSTER.practiceQuestions,
    ],
  },
  [CNPLE_CLUSTER.primaryCare]: {
    hub: CNPLE_HUB,
    studyLinks: ALL_STUDY,
    clusterRelated: [
      CNPLE_CLUSTER.differentialDiagnosis,
      CNPLE_CLUSTER.prescribingQuestions,
      CNPLE_CLUSTER.clinicalJudgment,
      CNPLE_CLUSTER.geriatrics,
      CNPLE_CLUSTER.pediatrics,
    ],
  },
};

// ──────────────────────────────────────────────────────────────────────────────
// Shared disclaimer copy — reused across cluster pages to maintain consistent
// disclaimer posture without fabricating official information.
// ──────────────────────────────────────────────────────────────────────────────

export const CNPLE_DISCLAIMER =
  "NurseNest is an independent exam prep platform and is not affiliated with or endorsed by CCRNR. " +
  "Practice questions and study domains reflect NurseNest's clinical taxonomy, not confirmed official CNPLE blueprint percentages or item formats. " +
  "Always verify exam details and eligibility directly with your provincial college and CCRNR.";

export const CNPLE_FRESHNESS_LABEL = "Updated for 2026 CNPLE";

/** Shared regulator reference line included in Phase 10 E-E-A-T blocks. */
export const CNPLE_REGULATOR_REF =
  "CCRNR (Canadian Council of Registered Nurse Regulators) is the regulatory authority administering the CNPLE. " +
  "Confirm current eligibility rules, exam format, and scheduling at ccrnr.ca.";

// ──────────────────────────────────────────────────────────────────────────────
// Sitemap paths — all cluster pages that should be indexed
// ──────────────────────────────────────────────────────────────────────────────

export const CNPLE_SITEMAP_PATHS = [
  CNPLE_CLUSTER.practiceQuestions,
  CNPLE_CLUSTER.studyGuide,
  CNPLE_CLUSTER.simulationExam,
  CNPLE_CLUSTER.flashcards,
  CNPLE_CLUSTER.caseStudies,
  CNPLE_CLUSTER.whatIsCnple,
  CNPLE_CLUSTER.cnpleVsCnpe,
  CNPLE_CLUSTER.loftTesting,
  CNPLE_CLUSTER.blueprint,
  CNPLE_CLUSTER.canadaNpExamPrep,
  CNPLE_CLUSTER.clinicalJudgment,
  CNPLE_CLUSTER.prescribingQuestions,
  CNPLE_CLUSTER.pharmacology,
  CNPLE_CLUSTER.labInterpretation,
  CNPLE_CLUSTER.differentialDiagnosis,
  CNPLE_CLUSTER.mentalHealth,
  CNPLE_CLUSTER.pediatrics,
  CNPLE_CLUSTER.geriatrics,
  CNPLE_CLUSTER.womensHealth,
  CNPLE_CLUSTER.primaryCare,
] as const satisfies readonly CnpleClusterSlug[];
