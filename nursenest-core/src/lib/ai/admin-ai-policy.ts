/**
 * Admin AI batch tools — opt-in kill switch (server-only).
 * Set AI_ADMIN_GENERATION_ENABLED=true and AI_INTEGRATIONS_OPENAI_API_KEY.
 */
export function isAdminAiGenerationEnabled(): boolean {
  return process.env.AI_ADMIN_GENERATION_ENABLED === "true";
}
