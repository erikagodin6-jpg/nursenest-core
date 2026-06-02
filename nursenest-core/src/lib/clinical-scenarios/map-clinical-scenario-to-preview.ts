import type { ClinicalNursingScenario, ClinicalNursingScenarioStage } from "@prisma/client";
import type { ClinicalScenarioPreviewModel } from "@/components/clinical-scenarios/clinical-scenario-unfolding-preview";
import { scenarioEffectiveIsPremium } from "@/lib/clinical-scenarios/clinical-scenario-premium";

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
    isPremium: scenarioEffectiveIsPremium(row),
    stages: row.stages.map(mapStage),
  };
}

/**
 * Free learners must not receive premium stages 2+ in the HTML payload (defense in depth beside UI gating).
 */
export function redactPremiumStagesForFreeLearner(
  model: ClinicalScenarioPreviewModel,
  opts: { premiumUnlocked: boolean; allowStaffFullPreview: boolean },
): ClinicalScenarioPreviewModel {
  if (opts.allowStaffFullPreview) return model;
  if (!model.isPremium) return model;
  if (opts.premiumUnlocked) return model;
  if (model.stages.length <= 1) return model;
  return { ...model, stages: [model.stages[0]!] };
}
