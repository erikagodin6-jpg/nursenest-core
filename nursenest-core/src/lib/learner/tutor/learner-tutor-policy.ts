import "server-only";

/**
 * Integrated Study Assistant shell (dock + intent registry).
 *
 * - **Default:** off until you explicitly enable (`AI_TUTOR_SURFACE_ENABLED=true`).
 * - **Override:** set `AI_TUTOR_SURFACE_ENABLED=false` to force-hide even when other AI flags are on.
 *
 * Model-backed behavior stays behind per-action work; this flag only controls the **UX shell**.
 */
export function isLearnerTutorShellEnabled(): boolean {
  if (process.env.AI_TUTOR_SURFACE_ENABLED === "false") return false;
  return process.env.AI_TUTOR_SURFACE_ENABLED === "true";
}
