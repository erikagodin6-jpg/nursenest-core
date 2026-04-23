/**
 * Runtime validation for persisted `PracticeTest.config` JSON at read boundaries.
 * Does not change how configs are written; coerces invalid rows to safe defaults and logs.
 */
import { z } from "zod";
import type { PracticeTestConfigJson } from "@/lib/practice-tests/types";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Safe linear defaults when JSON is missing or unusable — preserves “session can load” over strictness. */
export const DEFAULT_SAFE_PRACTICE_TEST_CONFIG: PracticeTestConfigJson = {
  questionCount: 25,
  topicNames: [],
  difficultyMin: null,
  difficultyMax: null,
  selectionMode: "random",
  pathwayId: null,
  timedMode: false,
  timeLimitSec: null,
};

const selectionModeZ = z.enum(["random", "targeted", "weak", "cat"]);
const linearDeliveryZ = z.enum(["practice", "exam"]);
const linearRationaleVisibilityZ = z.enum(["after_each", "end_of_exam"]);
const catSelectionBasisZ = z.enum(["random", "targeted", "weak"]);
const catPresentationZ = z.enum(["practice", "exam_simulation"]);
const catFeedbackZ = z.enum(["study", "test"]);
const catAdaptiveSessionTypeZ = z.enum(["cat", "practice"]);
const catEngineTypeZ = z.enum(["CAT", "SIMULATION"]);
const catEngineModeZ = z.enum(["production_ready", "beta", "mini_adaptive", "simulation", "unavailable"]);

/** Defaults on every field so partial persisted JSON still parses; unknown keys stripped. */
const practiceTestConfigSchema = z.object({
  questionCount: z.coerce.number().int().min(1).max(500).default(25),
  topicNames: z.array(z.string()).default([]),
  difficultyMin: z.union([z.null(), z.number()]).default(null),
  difficultyMax: z.union([z.null(), z.number()]).default(null),
  selectionMode: selectionModeZ.default("random"),
  pathwayId: z.preprocess(
    (v) => (v === "" || v === undefined ? null : v),
    z.union([z.null(), z.string().min(1).max(120)]).default(null),
  ),
  timedMode: z.boolean().default(false),
  timeLimitSec: z.union([z.null(), z.coerce.number().int().min(0).max(48 * 60 * 60)]).default(null),
  linearDeliveryMode: linearDeliveryZ.optional(),
  linearRationaleVisibility: linearRationaleVisibilityZ.optional(),
  catSelectionBasis: catSelectionBasisZ.optional(),
  catMinQuestions: z.coerce.number().int().min(1).max(500).optional(),
  catMaxQuestions: z.coerce.number().int().min(1).max(500).optional(),
  catPassingThreshold: z.coerce.number().min(-3).max(3).optional(),
  catEngineType: catEngineTypeZ.optional(),
  catEngineMode: catEngineModeZ.optional(),
  catWeakCategories: z.array(z.string()).optional(),
  catWeakPriorityByCanonical: z.record(z.coerce.number()).optional(),
  catPresentationMode: catPresentationZ.optional(),
  catExamFeedbackMode: catFeedbackZ.optional(),
  catAdaptiveSessionType: catAdaptiveSessionTypeZ.optional(),
  catExamConfigId: z.union([z.null(), z.string()]).optional(),
  sessionPickSalt: z.string().min(8).max(128).optional(),
});

function loosePickFromRaw(raw: unknown): Partial<PracticeTestConfigJson> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const o = raw as Record<string, unknown>;
  const out: Partial<PracticeTestConfigJson> = {};
  const sm = o.selectionMode;
  if (sm === "random" || sm === "targeted" || sm === "weak" || sm === "cat") {
    out.selectionMode = sm;
  }
  if (typeof o.pathwayId === "string" && o.pathwayId.length > 0) out.pathwayId = o.pathwayId;
  if (o.pathwayId === null) out.pathwayId = null;
  if (typeof o.questionCount === "number" && Number.isFinite(o.questionCount)) {
    out.questionCount = Math.max(1, Math.min(500, Math.floor(o.questionCount)));
  }
  const cast = o.catAdaptiveSessionType;
  if (cast === "cat" || cast === "practice") out.catAdaptiveSessionType = cast;
  return out;
}

export type PracticeTestConfigParseMeta = {
  practiceTestId?: string;
  surface?: string;
};

/**
 * Validates config at API / loader boundaries. On failure: logs, merges best-effort fields from raw, fills defaults.
 */
export function parsePracticeTestConfigAtBoundary(
  raw: unknown,
  meta?: PracticeTestConfigParseMeta,
): PracticeTestConfigJson {
  const parsed = practiceTestConfigSchema.safeParse(raw);
  if (parsed.success) {
    return parsed.data as PracticeTestConfigJson;
  }
  const issues = parsed.error.issues
    .slice(0, 12)
    .map((i) => `${i.path.join(".") || "root"}:${i.code}`)
    .join("|");
  safeServerLog("practice_test", "practice_test_config_invalid", {
    event: "practice_test_config_invalid",
    surface: meta?.surface,
    practiceTestId: meta?.practiceTestId?.slice(0, 16),
    zod_summary: issues.slice(0, 450),
  });
  return {
    ...DEFAULT_SAFE_PRACTICE_TEST_CONFIG,
    ...loosePickFromRaw(raw),
  };
}
