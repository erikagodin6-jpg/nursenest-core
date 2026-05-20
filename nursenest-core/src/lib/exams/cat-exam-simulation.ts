import { CountryCode, ExamFamily } from "@prisma/client";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildMappingQualityWarnings } from "@/lib/exams/cat-blueprint-mapping-quality";
import {
  CAT_BLUEPRINT_LOG_POOL_PRACTICE_MAPPED,
  getCatBlueprintQualityThresholds,
} from "@/lib/exams/cat-blueprint-thresholds";
import type { CatPresentationMode } from "@/lib/exams/cat-types";
import {
  AANP_NP_US_EXAM_CONFIG,
  ANCC_NP_US_EXAM_CONFIG,
  NCLEX_PN_US_EXAM_CONFIG,
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
 * Structured log for ops: every exam-simulation create; practice CAT when pool mapping is thin.
 * Includes non-blocking `mappingQualityWarnings` (exam sim pool under 0.90, practice pool under 0.85).
 */
export function logCatBlueprintPoolReady(params: {
  presentationMode: CatPresentationMode;
  examConfigId: string;
  poolSize: number;
  poolMappedFraction: number;
  userId: string;
}): void {
  const practiceThin = params.poolMappedFraction < CAT_BLUEPRINT_LOG_POOL_PRACTICE_MAPPED;
  const shouldLog = params.presentationMode === "exam_simulation" || practiceThin;
  if (!shouldLog) return;

  const warnings = buildMappingQualityWarnings({
    poolMappedFraction: params.poolMappedFraction,
    sessionMappedFraction: 1,
    scoredCount: 0,
    presentationMode: params.presentationMode,
  });
  if (params.presentationMode !== "exam_simulation" && practiceThin) {
    warnings.push({
      code: "practice_pool_mapping_low",
      detail: `Practice CAT pool NCLEX/AANP blueprint tagging is ${(params.poolMappedFraction * 100).toFixed(1)}% (log threshold ${CAT_BLUEPRINT_LOG_POOL_PRACTICE_MAPPED * 100}%). Consider backfilling nclex_client_needs_category or blueprint ids.`,
    });
  }

  console.info(
    JSON.stringify({
      tag: "nursenest_cat_blueprint",
      event: "pool_ready",
      presentationMode: params.presentationMode,
      examConfigId: params.examConfigId,
      poolSize: params.poolSize,
      poolMappedFraction: params.poolMappedFraction,
      userId: params.userId,
      qualityThresholds: getCatBlueprintQualityThresholds(),
      mappingQualityWarnings: warnings,
    }),
  );
}

export type ExamSimulationNpBoard = "AANP" | "ANCC";

export function examSimulationConfigForPathway(
  pathway: ExamPathwayDefinition | null,
  opts?: { npBoard?: ExamSimulationNpBoard },
): ExamConfig {
  if (pathway?.examFamily === ExamFamily.NP) {
    return opts?.npBoard === "ANCC" ? ANCC_NP_US_EXAM_CONFIG : AANP_NP_US_EXAM_CONFIG;
  }
  if (pathway?.examFamily === ExamFamily.NCLEX_PN) {
    return NCLEX_PN_US_EXAM_CONFIG;
  }
  if (pathway?.countryCode === CountryCode.CA) return NCLEX_RN_CA_EXAM_CONFIG;
  return NCLEX_RN_US_EXAM_CONFIG;
}

/**
 * Exam simulation CAT: NCLEX-RN/PN (US/CA) or NP tracks (fixed-length AANP/ANCC blueprint). Unset pathway defaults to NCLEX-RN US.
 */
export function pathwaySupportsCatExamSimulation(pathway: ExamPathwayDefinition | null): boolean {
  if (!pathway) return true;
  return (
    pathway.examFamily === ExamFamily.NCLEX_RN ||
    pathway.examFamily === ExamFamily.NCLEX_PN ||
    pathway.examFamily === ExamFamily.NP
  );
}

/** @deprecated Use `pathwaySupportsCatExamSimulation` */
export function pathwaySupportsNclexRnExamSimulation(pathway: ExamPathwayDefinition | null): boolean {
  return pathwaySupportsCatExamSimulation(pathway);
}

/** Fixed NCLEX-RN simulation bounds (ignores CAT_RELAX_* env overrides). */
export function nclexRnSimulationBoundsFromConfig(cfg: ExamConfig): { min: number; max: number } {
  return { min: cfg.minQuestions, max: cfg.maxQuestions };
}

/** Default when pathway is unknown or config omits override (NCLEX-style). */
export const NCLEX_EXAM_SIMULATION_TIME_LIMIT_SEC = 5 * 60 * 60;

export function examSimulationTimeLimitSecForConfig(cfg: ExamConfig): number {
  return cfg.examSimulationTimeLimitSec ?? NCLEX_EXAM_SIMULATION_TIME_LIMIT_SEC;
}

export function defaultExamSimulationTimeLimitSec(pathway: ExamPathwayDefinition | null): number {
  return examSimulationTimeLimitSecForConfig(examSimulationConfigForPathway(pathway));
}
