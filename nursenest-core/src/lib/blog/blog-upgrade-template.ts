export const BLOG_UPGRADE_MIN_WORD_COUNT = 1200;
export const BLOG_UPGRADE_MAX_WORD_COUNT = 1800;

/**
 * Standardized long-form template for clinically accurate, exam-focused blog upgrades.
 * The page title renders as H1 in route UI; section headings below are H2/H3 guidance.
 */
export const BLOG_UPGRADE_SECTION_ORDER = [
  "Introduction",
  "Definition and Overview",
  "Core Clinical Concepts",
  "Pathophysiology",
  "Assessment, Labs, and Symptoms",
  "Interventions and Management",
  "NCLEX Clinical Pearls",
  "Practice Questions",
  "Conclusion",
] as const;

export type BlogUpgradeSectionName = (typeof BLOG_UPGRADE_SECTION_ORDER)[number];

export type BlogUpgradeTemplateSpec = {
  minWordCount: number;
  maxWordCount: number;
  sectionOrder: readonly BlogUpgradeSectionName[];
  requiresPracticeQuestionsMin: number;
  requiresPracticeQuestionsMax: number;
};

export const BLOG_UPGRADE_TEMPLATE: BlogUpgradeTemplateSpec = {
  minWordCount: BLOG_UPGRADE_MIN_WORD_COUNT,
  maxWordCount: BLOG_UPGRADE_MAX_WORD_COUNT,
  sectionOrder: BLOG_UPGRADE_SECTION_ORDER,
  requiresPracticeQuestionsMin: 2,
  requiresPracticeQuestionsMax: 3,
};

