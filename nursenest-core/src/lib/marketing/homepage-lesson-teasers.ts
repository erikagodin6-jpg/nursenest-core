import { buildExamPathwayPath, listPublicExamPathways } from "@/lib/exam-pathways/exam-product-registry";

export type HomepageLessonTeaser = {
  id: string;
  title: string;
  shortLabel: string;
  lessonsHref: string;
};

/**
 * Small, static-derived list for the marketing homepage (no DB, no large JSON imports).
 * Uses the in-memory pathway registry only.
 */
export function getHomepageLessonTeasers(): HomepageLessonTeaser[] {
  return listPublicExamPathways()
    .filter((p) => p.status === "active")
    .slice(0, 6)
    .map((p) => ({
      id: p.id,
      title: p.displayName,
      shortLabel: p.shortName,
      lessonsHref: buildExamPathwayPath(p, "lessons"),
    }));
}
