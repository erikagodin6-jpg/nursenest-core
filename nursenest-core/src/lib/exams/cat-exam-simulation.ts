import { CountryCode, ExamFamily } from "@prisma/client";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { CatPresentationMode } from "@/lib/exams/cat-types";
import {
  NCLEX_RN_CA_EXAM_CONFIG,
  NCLEX_RN_US_EXAM_CONFIG,
  type ExamConfig,
} from "@/lib/exams/exam-config";

/**
 * Gate NCLEX-style exam simulation CAT. Set `CAT_EXAM_SIMULATION_ENABLED=1` on the server.
 * `NEXT_PUBLIC_CAT_EXAM_SIMULATION=1` exposes the option in the practice-test hub (build-time).
 */
export function isCatExamSimulationFeatureEnabled(): boolean {
  const server = process.env.CAT_EXAM_SIMULATION_ENABLED === "1" || process.env.CAT_EXAM_SIMULATION_ENABLED === "true";
  const pub =
    process.env.NEXT_PUBLIC_CAT_EXAM_SIMULATION === "1" || process.env.NEXT_PUBLIC_CAT_EXAM_SIMULATION === "true";
  return server || pub;
}

/**
 * Structured log for ops: prioritize NCLEX client-needs backfill where pool mapping is thin.
 * Emits on every exam-simulation create and when practice CAT pool mapping is below ~85%.
 */
export function logCatBlueprintPoolReady(params: {
  presentationMode: CatPresentationMode;
  examConfigId: string;
  poolSize: number;
  poolMappedFraction: number;
  userId: string;
}): void {
  const thin = params.poolMappedFraction < 0.85;
  if (params.presentationMode !== "exam_simulation" && !thin) return;
  console.info(
    JSON.stringify({
      tag: "nursenest_cat_blueprint",
      event: "pool_ready",
      presentationMode: params.presentationMode,
      examConfigId: params.examConfigId,
      poolSize: params.poolSize,
      poolMappedFraction: params.poolMappedFraction,
      userId: params.userId,
    }),
  );
}

export function examSimulationConfigForPathway(pathway: ExamPathwayDefinition | null): ExamConfig {
  if (pathway?.countryCode === CountryCode.CA) return NCLEX_RN_CA_EXAM_CONFIG;
  return NCLEX_RN_US_EXAM_CONFIG;
}

/** Exam simulation CAT is defined for NCLEX-RN pathways (US/CA share the same program). */
export function pathwaySupportsNclexRnExamSimulation(pathway: ExamPathwayDefinition | null): boolean {
  if (!pathway) return true;
  return pathway.examFamily === ExamFamily.NCLEX_RN;
}

/** Fixed NCLEX-RN simulation bounds (ignores CAT_RELAX_* env overrides). */
export function nclexRnSimulationBoundsFromConfig(cfg: ExamConfig): { min: number; max: number } {
  return { min: cfg.minQuestions, max: cfg.maxQuestions };
}

/** Suggested timed limit: 5 hours, matching common NCLEX allotments (product default). */
export const NCLEX_EXAM_SIMULATION_TIME_LIMIT_SEC = 5 * 60 * 60;
