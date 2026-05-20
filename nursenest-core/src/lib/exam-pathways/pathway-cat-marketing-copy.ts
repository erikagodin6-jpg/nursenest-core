/**
 * User-facing copy for pathway practice-session landing (marketing + shared naming).
 * Derives CAT vs LOFT vs linear wording from {@link @/lib/testing/testing-model}.
 */
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { catPathwayShortCatLabel } from "@/lib/exam-pathways/cat-pathway-labels";
import type { PathwayReadinessPublicCopy } from "@/lib/exam-pathways/pathway-readiness-config";
import {
  getPathwaySimulationDisplayCopy,
  getTestingModelForPathway,
} from "@/lib/testing/testing-model-display";
import { isLoftTestingModel } from "@/lib/testing/testing-model-pathway-map";
import {
  validateTestingModelMarketingLanguage,
} from "@/lib/testing/testing-marketing-governance";

function assertPathwayMarketingCopy(pathway: ExamPathwayDefinition, text: string): string {
  const audit = validateTestingModelMarketingLanguage(pathway.id, text);
  if (!audit.ok) {
    const messages = [
      ...audit.violations.map((v) => v.message),
      ...(audit.cnpleAudit && !audit.cnpleAudit.ok
        ? audit.cnpleAudit.violations.map((i) => i.message)
        : []),
    ];
    throw new Error(
      `Marketing psychometric audit failed for ${pathway.id}: ${messages.join(" ")}`,
    );
  }
  return text;
}

export function pathwayCatLandingTitle(pathway: ExamPathwayDefinition): string {
  return assertPathwayMarketingCopy(
    pathway,
    getPathwaySimulationDisplayCopy(pathway).landingTitle,
  );
}

export function pathwayCatLandingSubtitle(
  pathway: ExamPathwayDefinition,
  publicCopy: PathwayReadinessPublicCopy,
): string {
  const display = getPathwaySimulationDisplayCopy(pathway);
  return assertPathwayMarketingCopy(
    pathway,
    `${display.landingSubtitleLead} ${publicCopy.subtitle}`,
  );
}

export function pathwayCatMetadataDescription(
  pathway: ExamPathwayDefinition,
  publicCopy: PathwayReadinessPublicCopy,
): string {
  const display = getPathwaySimulationDisplayCopy(pathway);
  if (isLoftTestingModel(getTestingModelForPathway(pathway))) {
    return assertPathwayMarketingCopy(
      pathway,
      `${display.shortLabel} — ${publicCopy.subtitle} Sign in to run a session scoped to ${pathway.displayName}.`,
    );
  }
  return assertPathwayMarketingCopy(
    pathway,
    `${catPathwayShortCatLabel(pathway)} — ${publicCopy.subtitle} Sign in to run a session scoped to ${pathway.displayName}.`,
  );
}
