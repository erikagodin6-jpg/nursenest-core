/**
 * Quizlet-style study tools rollout gate (client + server).
 * Default: off — routes stay staff-only preview; hidden from primary nav and public sitemap.
 */
export function isStudyToolsPubliclyEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_STUDY_TOOLS === "true";
}
