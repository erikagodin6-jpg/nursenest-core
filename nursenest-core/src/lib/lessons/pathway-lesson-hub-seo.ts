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
  return `Clinical lessons for ${exam} (${place}): exam-style reasoning, safety focus, and pathway-matched practice. Preview on the web; full lesson depth unlocks with a plan that includes this track.`;
}

export function pathwayLessonTopicClusterMetaTitle(pathway: ExamPathwayDefinition, topicLabel: string): string {
  return `${topicLabel} · ${pathway.shortName} lessons (${pathwayCountryLabel(pathway)}) | NurseNest`;
}

function truncateMetaDescription(text: string, maxLen = 158): string {
  const t = text.trim();
  if (t.length <= maxLen) return t;
  const slice = t.slice(0, maxLen - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const base = lastSpace > 48 ? slice.slice(0, lastSpace) : slice;
  return `${base}…`;
}

/**
 * SERP-focused meta for topic lesson clusters (lesson-level topic intent).
 * Keeps length within common snippet limits while adding question-bank + CAT vocabulary.
 */
export function pathwayLessonTopicClusterMetaDescription(
  pathway: ExamPathwayDefinition,
  topicLabel: string,
): string {
  const place = pathway.countrySlug === "canada" ? "Canadian" : "US";
  const exam = pathway.displayName;
  const topic = topicLabel.trim();
  const raw = `${topic} lessons for ${pathway.shortName} (${exam}, ${place} scope): guided readings, clinical reasoning, and links to pathway-matched practice questions plus CAT-style adaptive study.`;
  return truncateMetaDescription(raw);
}
