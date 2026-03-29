/**
 * Canonical Pre-Nursing module list (order + metadata) recovered from `client/src/pages/pre-nursing.tsx`.
 * Titles/descriptions resolve via `pre-nursing-strings-en.json` (`preNursing.mod.*`).
 */
export type PreNursingModuleMeta = {
  slug: string;
  titleKey: string;
  subtitleKey: string;
  lessons: number;
};

export const PRE_NURSING_MODULE_REGISTRY: readonly PreNursingModuleMeta[] = [
  { slug: "study-strategies", titleKey: "preNursing.mod.studyStrategies", subtitleKey: "preNursing.mod.studyStrategiesDesc", lessons: 4 },
  { slug: "terminology", titleKey: "preNursing.mod.terminology", subtitleKey: "preNursing.mod.terminologyDesc", lessons: 3 },
  { slug: "medical-terminology", titleKey: "preNursing.mod.medicalTerminology", subtitleKey: "preNursing.mod.medicalTerminologyDesc", lessons: 4 },
  { slug: "chemistry", titleKey: "preNursing.mod.chemistry", subtitleKey: "preNursing.mod.chemistryDesc", lessons: 4 },
  { slug: "cell-biology", titleKey: "preNursing.mod.cellBiology", subtitleKey: "preNursing.mod.cellBiologyDesc", lessons: 4 },
  { slug: "science-foundations", titleKey: "preNursing.mod.scienceFoundations", subtitleKey: "preNursing.mod.scienceFoundationsDesc", lessons: 6 },
  { slug: "microbiology", titleKey: "preNursing.mod.microbiology", subtitleKey: "preNursing.mod.microbiologyDesc", lessons: 4 },
  { slug: "anatomy-physiology", titleKey: "preNursing.mod.anatomyPhysiology", subtitleKey: "preNursing.mod.anatomyPhysiologyDesc", lessons: 7 },
  { slug: "physiology", titleKey: "preNursing.mod.physiology", subtitleKey: "preNursing.mod.physiologyDesc", lessons: 4 },
  { slug: "pathophysiology", titleKey: "preNursing.mod.pathophysiology", subtitleKey: "preNursing.mod.pathophysiologyDesc", lessons: 3 },
  { slug: "infection-control", titleKey: "preNursing.mod.infectionControl", subtitleKey: "preNursing.mod.infectionControlDesc", lessons: 4 },
  { slug: "fluids-electrolytes", titleKey: "preNursing.mod.fluidsElectrolytes", subtitleKey: "preNursing.mod.fluidsElectrolytesDesc", lessons: 4 },
  { slug: "pharmacology", titleKey: "preNursing.mod.pharmacology", subtitleKey: "preNursing.mod.pharmacologyDesc", lessons: 3 },
  { slug: "communication", titleKey: "preNursing.mod.communication", subtitleKey: "preNursing.mod.communicationDesc", lessons: 4 },
  { slug: "ethics-legal", titleKey: "preNursing.mod.ethicsLegal", subtitleKey: "preNursing.mod.ethicsLegalDesc", lessons: 4 },
  { slug: "research-statistics", titleKey: "preNursing.mod.researchStatistics", subtitleKey: "preNursing.mod.researchStatisticsDesc", lessons: 5 },
  { slug: "health-assessment", titleKey: "preNursing.mod.healthAssessment", subtitleKey: "preNursing.mod.healthAssessmentDesc", lessons: 4 },
  { slug: "nutrition-foundations", titleKey: "preNursing.mod.nutritionFoundations", subtitleKey: "preNursing.mod.nutritionFoundationsDesc", lessons: 4 },
  { slug: "cultural-competency", titleKey: "preNursing.mod.culturalCompetency", subtitleKey: "preNursing.mod.culturalCompetencyDesc", lessons: 4 },
  { slug: "inflammation", titleKey: "preNursing.mod.inflammation", subtitleKey: "preNursing.mod.inflammationDesc", lessons: 4 },
  { slug: "cellular-injury", titleKey: "preNursing.mod.cellularInjury", subtitleKey: "preNursing.mod.cellularInjuryDesc", lessons: 5 },
  { slug: "oxygenation", titleKey: "preNursing.mod.oxygenation", subtitleKey: "preNursing.mod.oxygenationDesc", lessons: 5 },
  { slug: "diagnostics", titleKey: "preNursing.mod.diagnostics", subtitleKey: "preNursing.mod.diagnosticsDesc", lessons: 4 },
  { slug: "healthcare-structure", titleKey: "preNursing.mod.healthcareStructure", subtitleKey: "preNursing.mod.healthcareStructureDesc", lessons: 4 },
  { slug: "research-reading", titleKey: "preNursing.mod.researchReading", subtitleKey: "preNursing.mod.researchReadingDesc", lessons: 4 },
  { slug: "human-factors", titleKey: "preNursing.mod.humanFactors", subtitleKey: "preNursing.mod.humanFactorsDesc", lessons: 4 },
  { slug: "atp-pathway", titleKey: "preNursing.mod.atpPathway", subtitleKey: "preNursing.mod.atpPathwayDesc", lessons: 5 },
] as const;
