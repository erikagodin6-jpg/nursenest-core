/**
 * Canonical exam labels for admin blog SEO tooling (AI prompts + campaign targetExam).
 * Not learner-facing marketing copy; keeps naming aligned with US/CA product tracks.
 */
export const ADMIN_BLOG_TARGET_EXAM_OPTIONS: readonly { value: string; label: string }[] = [
  { value: "NCLEX-RN", label: "NCLEX-RN (US/CAN RN)" },
  { value: "NCLEX-PN", label: "NCLEX-PN (US PN)" },
  { value: "REx-PN", label: "REx-PN (Canada PN)" },
  { value: "NP-US", label: "NP — US board tracks" },
  { value: "CNPLE", label: "CNPLE / NP (Canada)" },
  { value: "Allied", label: "Allied health" },
] as const;
