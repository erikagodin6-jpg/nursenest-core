/**
 * User-facing copy for pathway CAT landing (marketing + shared naming).
 * Keeps "CAT" as the primary product identity; readiness config still drives rules (range, limits).
 */
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { catPathwayRegionalExamLine, catPathwayShortCatLabel } from "@/lib/exam-pathways/cat-pathway-labels";
import type { PathwayReadinessPublicCopy } from "@/lib/exam-pathways/pathway-readiness-config";

export function pathwayCatLandingTitle(pathway: ExamPathwayDefinition): string {
  return catPathwayShortCatLabel(pathway);
}

export function pathwayCatLandingSubtitle(
  pathway: ExamPathwayDefinition,
  publicCopy: PathwayReadinessPublicCopy,
): string {
  const line = catPathwayRegionalExamLine(pathway);
  return `Computerized adaptive testing (CAT) for ${line}. ${publicCopy.subtitle}`;
}

export function pathwayCatMetadataDescription(
  pathway: ExamPathwayDefinition,
  publicCopy: PathwayReadinessPublicCopy,
): string {
  return `${catPathwayShortCatLabel(pathway)} — ${publicCopy.subtitle} Sign in to run a session scoped to ${pathway.displayName}.`;
}
