/**
 * Legacy programmatic SEO slugs (`/{slug}` → `/seo/[slug]`) → canonical exam hub paths.
 * Only add mappings that are unambiguous; country-specific NCLEX pages stay on programmatic URLs until merged.
 */
export const PROGRAMMATIC_SLUG_TO_PATHWAY_PATH: Record<string, string> = {
  "rex-pn-practice-questions": "/canada/rpn/rex-pn",
  "rex-pn-exam-prep": "/canada/rpn/rex-pn",
};
