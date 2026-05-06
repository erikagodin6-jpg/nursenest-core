import { safeServerLog } from "@/lib/observability/safe-server-log";

const SCOPE = "ai_clinical_intelligence";

/** Duration of a tutoring recommendation round-trip (provider or stub). */
export function logAiTutorRecommendationMs(meta: {
  durationMs: number;
  pathwayId: string;
  providerKind: string;
  recommendationCount: number;
}): void {
  safeServerLog(SCOPE, "ai_tutor_recommendation_ms", {
    durationMs: meta.durationMs,
    pathwayId: meta.pathwayId,
    providerKind: meta.providerKind,
    recommendationCount: meta.recommendationCount,
  });
}

export function logAiTutorFallbackUsed(meta: { pathwayId: string; providerKind: string }): void {
  safeServerLog(SCOPE, "ai_tutor_fallback_used", {
    pathwayId: meta.pathwayId,
    providerKind: meta.providerKind,
    fallbackUsed: true,
  });
}

/** Simulation tick timing — call from simulation engine when built; stub tests may invoke. */
export function logSimulationTickMs(meta: { simulationId: string; pathwayId: string; tickMs: number }): void {
  safeServerLog(SCOPE, "simulation_tick_ms", {
    simulationId: meta.simulationId,
    pathwayId: meta.pathwayId,
    tickMs: meta.tickMs,
  });
}
