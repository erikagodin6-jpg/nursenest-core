export const SEMANTIC_LESSON_SECTION_TOKENS = {
  pathophysiology: {
    accent: "--lesson-pathophysiology-accent",
    soft: "--lesson-pathophysiology-soft",
    contrast: "--lesson-pathophysiology-contrast",
  },
  diagnostics: {
    accent: "--lesson-diagnostics-accent",
    soft: "--lesson-diagnostics-soft",
    contrast: "--lesson-diagnostics-contrast",
  },
  symptoms: {
    accent: "--lesson-symptoms-accent",
    soft: "--lesson-symptoms-soft",
    contrast: "--lesson-symptoms-contrast",
  },
  redFlags: {
    accent: "--lesson-red-flags-accent",
    soft: "--lesson-red-flags-soft",
    contrast: "--lesson-red-flags-contrast",
  },
  interventions: {
    accent: "--lesson-interventions-accent",
    soft: "--lesson-interventions-soft",
    contrast: "--lesson-interventions-contrast",
  },
  teaching: {
    accent: "--lesson-teaching-accent",
    soft: "--lesson-teaching-soft",
    contrast: "--lesson-teaching-contrast",
  },
  medications: {
    accent: "--lesson-medications-accent",
    soft: "--lesson-medications-soft",
    contrast: "--lesson-medications-contrast",
  },
  pearls: {
    accent: "--lesson-pearls-accent",
    soft: "--lesson-pearls-soft",
    contrast: "--lesson-pearls-contrast",
  },
  examFocus: {
    accent: "--lesson-exam-focus-accent",
    soft: "--lesson-exam-focus-soft",
    contrast: "--lesson-exam-focus-contrast",
  },
  nextSteps: {
    accent: "--lesson-next-steps-accent",
    soft: "--lesson-next-steps-soft",
    contrast: "--lesson-next-steps-contrast",
  },
} as const;

export type SemanticLessonSectionTokenKey = keyof typeof SEMANTIC_LESSON_SECTION_TOKENS;
