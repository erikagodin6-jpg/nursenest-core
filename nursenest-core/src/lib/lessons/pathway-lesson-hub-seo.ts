/**
 * Pathway lesson hub — marketing headings + meta (H1 / title / description).
 *
 * List integrity elsewhere:
 * - Route resolves one `pathway.id` per URL (`resolveExamPathwayFromMarketingHubSegment`).
 * - Rows omit unusable links via `pathwayLessonHasRenderableHubSlug` (pathway-lesson-types).
 * - Public `/lessons` index filters by `pathwayMatchesMarketingRegion` (nursing-tier-public-labels).
 */
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/** Country label for visible copy and meta. */
export function pathwayCountryLabel(pathway: ExamPathwayDefinition): "Canada" | "United States" {
  return pathway.countrySlug === "canada" ? "Canada" : "United States";
}

/**
 * Tier + exam + country-aware headline for pathway lesson hubs (H1 + SEO alignment).
 * Uses shortName so US vs Canada RN (both “NCLEX-RN”) stay distinct.
 */
export function pathwayLessonHubH1(pathway: ExamPathwayDefinition): string {
  const place = pathwayCountryLabel(pathway);
  const sn = pathway.shortName;
  switch (pathway.roleTrack) {
    case "rn":
      return `NCLEX-RN clinical lessons · ${place} · ${sn}`;
    case "lpn":
      return `NCLEX-PN (LPN) clinical lessons · ${place} · ${sn}`;
    case "rpn":
      return `REx-PN (RPN) clinical lessons · ${place} · ${sn}`;
    case "np":
      return `Nurse practitioner exam review lessons · ${place} · ${sn}`;
    case "allied":
      return `Allied health exam prep lessons · ${place} · ${sn}`;
    default:
      return `Clinical lessons · ${pathway.displayName}`;
  }
}

export function pathwayLessonHubMetaTitle(pathway: ExamPathwayDefinition): string {
  return `${pathwayLessonHubH1(pathway)} | NurseNest`;
}

export function pathwayLessonHubMetaDescription(pathway: ExamPathwayDefinition): string {
  const place = pathway.countrySlug === "canada" ? "Canada" : "the United States";
  const exam = pathway.displayName;
  return `Indexable clinical lessons for ${exam} (${place}): exam-style reasoning, safety focus, and links to pathway-matched practice. Preview on the web; full lesson depth unlocks with a matching plan.`;
}

export function pathwayLessonTopicClusterMetaTitle(pathway: ExamPathwayDefinition, topicLabel: string): string {
  return `${topicLabel} · ${pathway.shortName} lessons (${pathwayCountryLabel(pathway)}) | NurseNest`;
}

export function pathwayLessonTopicClusterMetaDescription(
  pathway: ExamPathwayDefinition,
  topicLabel: string,
): string {
  const place = pathway.countrySlug === "canada" ? "Canadian" : "US";
  return `Lessons tagged “${topicLabel}” for ${pathway.displayName} (${place} exam scope). Read previews here; subscribe for full lesson depth and pathway-matched questions.`;
}
