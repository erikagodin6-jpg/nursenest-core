import { HIDDEN_NP_ACADEMY_STATUS, type HiddenNpAcademyStatus } from "./np-advanced-practice-academies";

export type NpDiagnosticWorkflow = HiddenNpAcademyStatus & {
  readonly id: string;
  readonly chiefConcern: string;
  readonly supports: readonly ["Decision Trees", "Prioritization", "Diagnostic Testing", "Management Planning"];
  readonly differentiatesLifeThreats: boolean;
};

export const NP_DIAGNOSTIC_REASONING_WORKFLOWS: readonly NpDiagnosticWorkflow[] = [
  "Chest Pain",
  "Shortness Of Breath",
  "Syncope",
  "Headache",
  "Abdominal Pain",
  "Fatigue",
  "Depression",
  "Anxiety",
  "Fever",
  "Weight Loss",
].map((chiefConcern) => ({
  id: chiefConcern.toLowerCase().replaceAll(" ", "-"),
  chiefConcern,
  supports: ["Decision Trees", "Prioritization", "Diagnostic Testing", "Management Planning"],
  differentiatesLifeThreats: true,
  ...HIDDEN_NP_ACADEMY_STATUS,
})) as readonly NpDiagnosticWorkflow[];

export function validateNpDiagnosticReasoningEngine(): readonly string[] {
  const issues: string[] = [];
  for (const workflow of NP_DIAGNOSTIC_REASONING_WORKFLOWS) {
    if (workflow.supports.length !== 4) issues.push(`${workflow.id} missing required workflow supports`);
    if (!workflow.differentiatesLifeThreats) issues.push(`${workflow.id} must prioritize life threats`);
    if (workflow.published || workflow.visibleInNavigation || workflow.launchReady || workflow.indexable || !workflow.adminOnly) {
      issues.push(`${workflow.id} must remain hidden development content`);
    }
  }
  return issues;
}
