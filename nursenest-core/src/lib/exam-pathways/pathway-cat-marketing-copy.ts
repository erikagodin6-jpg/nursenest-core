/**
 * User-facing copy for pathway practice-session landing (marketing + shared naming).
 * CAT pathways use adaptive copy; LOFT pathways (CNPLE) use linear simulation copy.
 */
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { catPathwayRegionalExamLine, catPathwayShortCatLabel } from "@/lib/exam-pathways/cat-pathway-labels";
import type { PathwayReadinessPublicCopy } from "@/lib/exam-pathways/pathway-readiness-config";

const LOFT_PATHWAY_IDS = new Set(["ca-np-cnple"]);

export function pathwayCatLandingTitle(pathway: ExamPathwayDefinition): string {
  if (LOFT_PATHWAY_IDS.has(pathway.id)) {
    return `${pathway.shortName} simulation`;
  }
  return catPathwayShortCatLabel(pathway);
}

export function pathwayCatLandingSubtitle(
  pathway: ExamPathwayDefinition,
  publicCopy: PathwayReadinessPublicCopy,
): string {
  const line = catPathwayRegionalExamLine(pathway);
  if (LOFT_PATHWAY_IDS.has(pathway.id)) {
    return `CNPLE-style simulation (linear fixed-length, not CAT) for ${line}. ${publicCopy.subtitle}`;
  }
  return `Computerized adaptive testing (CAT) for ${line}. ${publicCopy.subtitle}`;
}

export function pathwayCatMetadataDescription(
  pathway: ExamPathwayDefinition,
  publicCopy: PathwayReadinessPublicCopy,
): string {
  if (LOFT_PATHWAY_IDS.has(pathway.id)) {
    return `${pathway.shortName} simulation — ${publicCopy.subtitle} Sign in to run a session scoped to ${pathway.displayName}.`;
  }
  return `${catPathwayShortCatLabel(pathway)} — ${publicCopy.subtitle} Sign in to run a session scoped to ${pathway.displayName}.`;
}
