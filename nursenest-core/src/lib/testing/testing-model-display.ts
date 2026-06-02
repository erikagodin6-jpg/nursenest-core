import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  catPathwayExamCodeLabel,
  catPathwayRegionalExamLine,
  catPathwayShortCatLabel,
} from "@/lib/exam-pathways/cat-pathway-labels";
import { getTestingModelDefinition } from "@/lib/testing/testing-model-definitions";
import {
  CNPLE_PATHWAY_ID,
  getTestingModelForPathwayId,
} from "@/lib/testing/testing-model-pathway-map";
import type { TestingModel } from "@/lib/testing/testing-model-types";

export type PathwaySimulationDisplayCopy = {
  shortLabel: string;
  regionalLine: string;
  landingTitle: string;
  landingSubtitleLead: string;
};

export function getTestingModelForPathway(
  pathway: ExamPathwayDefinition | null | undefined,
): TestingModel {
  if (!pathway) return "LINEAR";
  if (pathway.examCode === "cnple" || pathway.id === CNPLE_PATHWAY_ID) return "LOFT";
  return getTestingModelForPathwayId(pathway.id);
}

export function getPathwaySimulationDisplayCopy(
  pathway: ExamPathwayDefinition,
): PathwaySimulationDisplayCopy {
  const regionalLine = catPathwayRegionalExamLine(pathway);
  const def = getTestingModelDefinition(getTestingModelForPathway(pathway));
  if (def.model === "LOFT") {
    const exam = catPathwayExamCodeLabel(pathway);
    return {
      shortLabel: `${exam} simulation`,
      regionalLine,
      landingTitle: `${exam} simulation`,
      landingSubtitleLead: `Blueprint-balanced LOFT licensing simulation (linear fixed-length) for ${regionalLine}.`,
    };
  }
  if (def.model === "CAT") {
    const cat = catPathwayShortCatLabel(pathway);
    return {
      shortLabel: cat,
      regionalLine,
      landingTitle: cat,
      landingSubtitleLead: `Computerized adaptive testing (CAT) for ${regionalLine}.`,
    };
  }
  return {
    shortLabel: `${catPathwayExamCodeLabel(pathway)} practice`,
    regionalLine,
    landingTitle: `${catPathwayExamCodeLabel(pathway)} practice exam`,
    landingSubtitleLead: `Linear practice exams for ${regionalLine}.`,
  };
}
