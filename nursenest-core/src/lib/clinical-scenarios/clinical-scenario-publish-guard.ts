import type { ClinicalNursingScenario, ClinicalNursingScenarioStage } from "@prisma/client";
import { optionsJsonUsesBranchingEngine } from "@/lib/clinical-scenarios/branching-scenario-engine";

/** Published multi-stage simulations must stay bounded for learner UX and authoring QA. */
export const CLINICAL_SCENARIO_PUBLISH_MIN_STAGES = 3;
export const CLINICAL_SCENARIO_PUBLISH_MAX_STAGES = 6;

export type ClinicalScenarioPublishGuardFailure = {
  ok: false;
  code: "stage_count" | "stage_order" | "branching_options";
  message: string;
};

export type ClinicalScenarioPublishGuardSuccess = { ok: true };

export function validateClinicalScenarioReadyToPublish(
  row: ClinicalNursingScenario & { stages: ClinicalNursingScenarioStage[] },
): ClinicalScenarioPublishGuardSuccess | ClinicalScenarioPublishGuardFailure {
  const stages = [...row.stages].sort((a, b) => a.orderIndex - b.orderIndex);
  const n = stages.length;
  if (n < CLINICAL_SCENARIO_PUBLISH_MIN_STAGES || n > CLINICAL_SCENARIO_PUBLISH_MAX_STAGES) {
    return {
      ok: false,
      code: "stage_count",
      message: `Approved clinical scenarios must have between ${CLINICAL_SCENARIO_PUBLISH_MIN_STAGES} and ${CLINICAL_SCENARIO_PUBLISH_MAX_STAGES} stages (found ${n}).`,
    };
  }
  for (let i = 0; i < n; i++) {
    if (stages[i]!.orderIndex !== i) {
      return {
        ok: false,
        code: "stage_order",
        message: "Stage orderIndex values must be contiguous starting at 0 (0, 1, 2, …).",
      };
    }
  }
  for (const s of stages) {
    if (!optionsJsonUsesBranchingEngine(s.optionsJson)) {
      return {
        ok: false,
        code: "branching_options",
        message:
          "Every stage must use structured branching options (rationale / consequence trajectory / isCorrect) so consequences and analytics stay consistent.",
      };
    }
  }
  return { ok: true };
}
