import type { ClinicalNursingScenario, ClinicalNursingScenarioStage } from "@prisma/client";
import type { ClinicalScenarioPreviewModel } from "@/components/clinical-scenarios/clinical-scenario-unfolding-preview";

function clinicalScenarioIsPremiumFromReferences(referencesJson: unknown): boolean {
  if (!Array.isArray(referencesJson)) return false;
  return referencesJson.some(
    (row) => row && typeof row === "object" && (row as { isPremium?: unknown }).isPremium === true,
  );
}

function mapStage(s: ClinicalNursingScenarioStage) {
  return {
    id: s.id,
    orderIndex: s.orderIndex,
    scenarioText: s.scenarioText,
    vitals: s.vitals,
    assessmentFindings: s.assessmentFindings,
    labUpdates: s.labUpdates,
    questionStem: s.questionStem,
    optionsJson: s.optionsJson,
    correctOptionId: s.correctOptionId,
    rationale: s.rationale,
    whyWrongByOptionId: s.whyWrongByOptionId,
    clinicalJudgmentFocus: s.clinicalJudgmentFocus,
    consequencesByOptionId: s.consequencesByOptionId,
    nextStageOrder: s.nextStageOrder,
  };
}

export function mapClinicalNursingScenarioToPreview(
  row: ClinicalNursingScenario & { stages: ClinicalNursingScenarioStage[] },
): ClinicalScenarioPreviewModel {
  return {
    id: row.id,
    title: row.title,
    pathwayId: row.pathwayId,
    canonicalCategoryId: row.canonicalCategoryId,
    tierFocus: row.tierFocus,
    difficulty: row.difficulty,
    patientAgeContext: row.patientAgeContext,
    presentingConcern: row.presentingConcern,
    briefHistory: row.briefHistory,
    medicationsAllergies: row.medicationsAllergies,
    initialVitals: row.initialVitals,
    assessmentFindings: row.assessmentFindings,
    labsDiagnostics: row.labsDiagnostics,
    publishStatus: row.publishStatus,
    isPremium: clinicalScenarioIsPremiumFromReferences(row.referencesJson),
    stages: row.stages.map(mapStage),
  };
}
