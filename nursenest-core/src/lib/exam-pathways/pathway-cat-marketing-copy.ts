/**
 * User-facing copy for pathway practice-session landing (marketing + shared naming).
 * Derives CAT vs LOFT vs linear wording from {@link @/lib/testing/testing-model}.
 */
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { catPathwayShortCatLabel } from "@/lib/exam-pathways/cat-pathway-labels";
import type { PathwayReadinessPublicCopy } from "@/lib/exam-pathways/pathway-readiness-config";
import {
  getPathwaySimulationDisplayCopy,
  isLoftTestingModel,
  getTestingModelForPathway,
} from "@/lib/testing/testing-model";

export function pathwayCatLandingTitle(pathway: ExamPathwayDefinition): string {
  return getPathwaySimulationDisplayCopy(pathway).landingTitle;
}

export function pathwayCatLandingSubtitle(
  pathway: ExamPathwayDefinition,
  publicCopy: PathwayReadinessPublicCopy,
): string {
  const display = getPathwaySimulationDisplayCopy(pathway);
  return `${display.landingSubtitleLead} ${publicCopy.subtitle}`;
}

export function pathwayCatMetadataDescription(
  pathway: ExamPathwayDefinition,
  publicCopy: PathwayReadinessPublicCopy,
): string {
  const display = getPathwaySimulationDisplayCopy(pathway);
  if (isLoftTestingModel(getTestingModelForPathway(pathway))) {
    return `${display.shortLabel} — ${publicCopy.subtitle} Sign in to run a session scoped to ${pathway.displayName}.`;
  }
  return `${catPathwayShortCatLabel(pathway)} — ${publicCopy.subtitle} Sign in to run a session scoped to ${pathway.displayName}.`;
}
