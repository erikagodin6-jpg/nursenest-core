#!/usr/bin/env node
/**
 * Shared lesson-index verify mode resolution (build gate + verify runner).
 * Keep semantics aligned with `verify-normalized-lesson-indexes.runner.mts`.
 */

function isTruthyEnv(value) {
  return /^(1|true|yes)$/i.test(String(value ?? "").trim());
}

/**
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {"deep" | "light" | "changed-only"}
 */
export function getLessonVerifyMode(env = process.env) {
  const explicit = String(env.NN_LESSON_INDEX_VERIFY_MODE ?? "").trim().toLowerCase();
  if (explicit === "manifest" || explicit === "light") return "light";
  if (explicit === "deep") return "deep";
  if (explicit === "changed-only") return "changed-only";
  if (explicit) {
    console.warn(
      `[lesson-index-verify-mode] WARN: unknown NN_LESSON_INDEX_VERIFY_MODE=${JSON.stringify(explicit)} — defaulting to deep`,
    );
    return "deep";
  }

  if (isTruthyEnv(env.NN_DEEP_LESSON_VERIFY)) return "deep";
  if (isTruthyEnv(env.NN_VERIFY_CHANGED_PATHWAYS_ONLY)) return "changed-only";
  if (isTruthyEnv(env.NN_SKIP_HEAVY_LESSON_VERIFY)) return "light";
  return "deep";
}
