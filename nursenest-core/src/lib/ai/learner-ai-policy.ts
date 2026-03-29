/**
 * Learner-facing AI features are opt-in (separate from any future admin tools).
 * Set AI_STUDY_PLAN_ENABLED=true with AI_INTEGRATIONS_OPENAI_API_KEY.
 */
export function isStudyPlanAiEnabled(): boolean {
  return process.env.AI_STUDY_PLAN_ENABLED === "true";
}
