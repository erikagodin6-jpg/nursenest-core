import type { PathwayLessonSectionKind } from "@/lib/lessons/pathway-lesson-types";

/**
 * Semantic roles for lesson section cards.
 * Each role maps to a coordinated color family via CSS custom properties.
 * CSS classes defined in globals.css: `.nn-lesson-section-card[data-lsc-role]`
 * Token extensions (violet, teal, cyan) in semantic-status-tokens.css.
 *
 * Mapping logic (one place, not per-component):
 *   info         blue    — summary, intro, key concepts
 *   warning      amber   — signs and symptoms, clinical presentation
 *   concept      violet  — pathophysiology, mechanism, clinical meaning
 *   action       teal    — nursing care, interventions, priorities
 *   diagnostic   cyan    — assessment, labs, diagnostics
 *   danger       rose    — complications, red flags, risks
 *   success      green   — medications, treatment, management
 *   education    emerald — patient teaching, discharge, client education
 *   application  purple  — clinical scenario, case study
 *   review       brand   — takeaways, exam tips, exam focus
 *   cta          muted   — next steps, practice, related links
 */
export type LessonSectionRole =
  | "info"
  | "warning"
  | "concept"
  | "action"
  | "diagnostic"
  | "danger"
  | "success"
  | "education"
  | "application"
  | "review"
  | "cta";

/**
 * Maps each role to its `--lesson-*` CSS custom property name.
 * These tokens are defined per-theme in `theme-palettes.css` with exact colors,
 * and have derived fallbacks in `globals.css` `:where([data-theme])` for legacy themes.
 */
export const ROLE_LESSON_TOKEN: Record<LessonSectionRole, string> = {
  info: "--lesson-summary",
  warning: "--lesson-signs-symptoms",
  concept: "--lesson-key-concepts",
  action: "--lesson-interventions",
  diagnostic: "--lesson-diagnostics",
  danger: "--lesson-red-flags",
  success: "--lesson-medications",
  education: "--lesson-patient-teaching",
  application: "--lesson-clinical-pearls",
  review: "--lesson-exam-tips",
  cta: "--lesson-notes",
};

const KIND_TO_ROLE: Record<PathwayLessonSectionKind, LessonSectionRole> = {
  // Premium spine sections
  introduction: "info",
  pathophysiology_overview: "concept",
  signs_symptoms: "warning",
  red_flags: "danger",
  labs_diagnostics: "diagnostic",
  nursing_assessment_interventions: "action",
  // clinical_pearls gets "application" (purple/chart-5) to visually distinguish
  // it from "takeaways" which stays "review" (brand). Both are high-value but
  // clinical pearls = practitioner insights; takeaways = exam summary.
  clinical_pearls: "application",
  client_education: "education",
  tier_specific_relevance: "review",
  country_specific_notes: "info",
  related_next_steps: "cta",

  // Legacy / five-block catalog kinds
  clinical_meaning: "concept",
  exam_relevance: "review",
  core_concept: "info",
  clinical_scenario: "application",
  takeaways: "review",
  intro: "info",
  core: "info",
  clinical_application: "action",
  exam_tips: "review",
  exam_focus: "review",
};

/**
 * Chip/eyebrow labels — short enough to fit inline without wrapping.
 * These are visible to learners as a content-type cue above the heading.
 */
const ROLE_CHIP_LABELS: Record<LessonSectionRole, string> = {
  info: "Key Concepts",
  warning: "Signs & Symptoms",
  concept: "Pathophysiology",
  action: "Nursing Care",
  diagnostic: "Assessment",
  danger: "Red Flags",
  success: "Treatment",
  education: "Patient Teaching",
  application: "Clinical Scenario",
  review: "Key Takeaways",
  cta: "Next Steps",
};

/**
 * Kind-level chip label overrides.
 * Applied AFTER the role-derived label, so specific kinds can show a precise label
 * even when they share a visual role with other kinds.
 *
 * Example: clinical_pearls and clinical_scenario both use "application" role (purple)
 * but should show different labels.
 */
const KIND_CHIP_LABEL_OVERRIDES: Partial<Record<PathwayLessonSectionKind, string>> = {
  clinical_pearls: "Clinical Pearls",
  exam_relevance: "Exam Relevance",
  exam_tips: "Exam Tips",
  exam_focus: "Exam Focus",
  tier_specific_relevance: "Exam focus",
  country_specific_notes: "Regional Notes",
};

export type LessonSectionTheme = {
  role: LessonSectionRole;
  /** Short label shown in the colored chip above the section heading. */
  chipLabel: string;
  /** Value for `data-lsc-role` attribute on `.nn-lesson-section-card`. */
  dataRole: LessonSectionRole;
  /** CSS custom property name for the lesson section background (e.g. `--lesson-summary`). */
  lessonToken: string;
};

/**
 * Returns the semantic theme for a lesson section.
 * Drives the card background tint, border, and chip color — all via CSS custom properties.
 * Falls back to "info" for unknown or missing kinds.
 */
export function getLessonSectionTheme(
  kind: PathwayLessonSectionKind | undefined | null,
): LessonSectionTheme {
  const role: LessonSectionRole = (kind != null && KIND_TO_ROLE[kind]) || "info";
  const roleChipLabel = ROLE_CHIP_LABELS[role];
  const kindChipLabel = kind != null ? KIND_CHIP_LABEL_OVERRIDES[kind] : undefined;
  return {
    role,
    chipLabel: kindChipLabel ?? roleChipLabel,
    dataRole: role,
    lessonToken: ROLE_LESSON_TOKEN[role],
  };
}
