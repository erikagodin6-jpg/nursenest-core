/**
 * Curated programmatic study SEO pages: `{ pathwayId, lessonSlug }` pairs.
 * URLs: `/{country}/{role}/{exam}/study/{lessonSlug}` (see {@link marketingProgrammaticStudySeoPath} in `lesson-routes.ts`).
 *
 * Keep this list bounded; sitemap and loaders verify the lesson still exists and meets quality gates.
 */
export type ProgrammaticStudySeoRegistryEntry = {
  pathwayId: string;
  lessonSlug: string;
};

/** Hard cap for sitemap emission (see {@link collectProgrammaticStudySeoUrls}). */
export const MAX_PROGRAMMATIC_STUDY_SEO_SITEMAP_URLS = 160;

export function getProgrammaticStudySeoRegistry(): ProgrammaticStudySeoRegistryEntry[] {
  return [
    // US RN NCLEX-RN — pharmacology + cardio + respiratory + metabolic
    { pathwayId: "us-rn-nclex-rn", lessonSlug: "ace-inhibitors-nclex-rn" },
    { pathwayId: "us-rn-nclex-rn", lessonSlug: "beta-blockers-indications-and-nursing-monitoring-nclex-rn" },
    { pathwayId: "us-rn-nclex-rn", lessonSlug: "insulin-types-administration-and-hypoglycemia-response-nclex-rn" },
    { pathwayId: "us-rn-nclex-rn", lessonSlug: "metformin-nclex-rn" },
    { pathwayId: "us-rn-nclex-rn", lessonSlug: "heparin-and-aptt-monitoring-nclex-rn" },
    { pathwayId: "us-rn-nclex-rn", lessonSlug: "heart-failure-nclex-rn" },
    { pathwayId: "us-rn-nclex-rn", lessonSlug: "copd-nclex-rn" },
    { pathwayId: "us-rn-nclex-rn", lessonSlug: "asthma-nclex-rn" },
    { pathwayId: "us-rn-nclex-rn", lessonSlug: "sepsis-nclex-rn" },
    { pathwayId: "us-rn-nclex-rn", lessonSlug: "community-acquired-pneumonia-nclex-rn" },
    { pathwayId: "us-rn-nclex-rn", lessonSlug: "diabetes-mellitus-type-1-and-type-2-nursing-management-nclex-rn" },
    { pathwayId: "us-rn-nclex-rn", lessonSlug: "acute-coronary-syndrome-nclex-rn" },
    { pathwayId: "us-rn-nclex-rn", lessonSlug: "stroke-and-transient-ischemic-attack-nclex-rn" },
    { pathwayId: "us-rn-nclex-rn", lessonSlug: "acute-kidney-injury-prerenal-intrarenal-and-postrenal-patterns-nclex-rn" },
    // Canada RN NCLEX-RN
    { pathwayId: "ca-rn-nclex-rn", lessonSlug: "ace-inhibitors-nclex-rn" },
    { pathwayId: "ca-rn-nclex-rn", lessonSlug: "heart-failure-nclex-rn" },
    { pathwayId: "ca-rn-nclex-rn", lessonSlug: "copd-nclex-rn" },
    // Allied core (bundled catalog slugs)
    { pathwayId: "us-allied-core", lessonSlug: "allied-pharmacology-basics" },
    { pathwayId: "us-allied-core", lessonSlug: "allied-lab-values" },
    { pathwayId: "us-allied-core", lessonSlug: "allied-emergency-response" },
    { pathwayId: "us-allied-core", lessonSlug: "allied-human-anatomy" },
    { pathwayId: "us-allied-core", lessonSlug: "allied-patient-assessment" },
    { pathwayId: "ca-allied-core", lessonSlug: "allied-infection-control" },
    { pathwayId: "ca-allied-core", lessonSlug: "allied-medication-safety" },
  ];
}

export function programmaticStudySeoRegistryKey(entry: ProgrammaticStudySeoRegistryEntry): string {
  return `${entry.pathwayId}::${entry.lessonSlug}`;
}
