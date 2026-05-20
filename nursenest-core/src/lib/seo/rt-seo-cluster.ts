/**
 * Respiratory Therapy SEO cluster — authoritative knowledge graph for the RT exam prep lane.
 *
 * The NBRC (National Board for Respiratory Care) administers two credentials:
 * - TMC (Therapist Multiple-Choice) exam leading to CRT (Certified Respiratory Therapist)
 * - CSE (Clinical Simulation Examination) required for RRT (Registered Respiratory Therapist)
 *
 * NurseNest is an independent prep platform and is not affiliated with NBRC or any state regulatory board.
 */

export const RT_HUB = "/allied-health/respiratory-therapy" as const;
export const RT_EXAM_PREP = "/allied-health/respiratory-therapy/exam-prep" as const;
export const RT_PRACTICE_QUESTIONS = "/allied-health/respiratory-therapy/practice-questions" as const;
export const RT_VENTILATION = "/allied-health/respiratory-therapy/ventilation" as const;
export const RT_ABGS = "/allied-health/respiratory-therapy/abgs" as const;
export const RT_OXYGEN_THERAPY = "/allied-health/respiratory-therapy/oxygen-therapy" as const;

export const RT_CLUSTER = {
  hub: RT_HUB,
  examPrep: RT_EXAM_PREP,
  practiceQuestions: RT_PRACTICE_QUESTIONS,
  ventilation: RT_VENTILATION,
  abgs: RT_ABGS,
  oxygenTherapy: RT_OXYGEN_THERAPY,
} as const;

export type RtClusterPath = (typeof RT_CLUSTER)[keyof typeof RT_CLUSTER];

export const RT_RELATED_LINKS: readonly { href: string; label: string }[] = [
  { href: RT_HUB, label: "Respiratory Therapy Hub" },
  { href: RT_EXAM_PREP, label: "Exam Prep" },
  { href: RT_PRACTICE_QUESTIONS, label: "Practice Questions" },
  { href: RT_VENTILATION, label: "Mechanical Ventilation" },
  { href: RT_ABGS, label: "ABG Interpretation" },
  { href: RT_OXYGEN_THERAPY, label: "Oxygen Therapy" },
  { href: "/allied-health", label: "Allied Health Hub" },
];

export const RT_SITEMAP_PATHS: readonly RtClusterPath[] = [
  RT_HUB,
  RT_EXAM_PREP,
  RT_PRACTICE_QUESTIONS,
  RT_VENTILATION,
  RT_ABGS,
  RT_OXYGEN_THERAPY,
];

export const RT_DISCLAIMER =
  "NurseNest is an independent exam prep platform and is not affiliated with or endorsed by the National Board for Respiratory Care (NBRC). " +
  "Practice questions and study domains reflect NurseNest's clinical taxonomy, not confirmed official NBRC blueprint percentages or item formats. " +
  "Always verify exam details and eligibility directly with your state regulatory board and NBRC.";

export const RT_FRESHNESS_LABEL = "Updated for 2026 NBRC Exams";
