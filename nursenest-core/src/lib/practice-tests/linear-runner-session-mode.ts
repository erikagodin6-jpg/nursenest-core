/**
 * CAT-aligned **linear** practice runner — explicit UI / navigation modes.
 *
 * ## Modes (user-facing)
 *
 * - **`linear_exam`**: `linearDeliveryMode === "exam"` — CAT-style exam chrome, no per-item rationale
 *   column during delivery, **Previous disabled**, options locked after commit.
 * - **`linear_tutor`**: `linearDeliveryMode === "practice"` with **no** post-submit review navigation
 *   (`linearAllowReviewNavigation !== true`) — tutor column / rationales per config, **Previous disabled**
 *   until/unless review nav is enabled.
 * - **`linear_tutor_review_nav`**: practice delivery + **`linearAllowReviewNavigation === true`** —
 *   same tutor surfaces, **Previous** allowed only for **already-committed** earlier items (server + client).
 *
 * ## Legacy (`legacy_linear`)
 *
 * Rows **without** `linearDeliveryMode` on stored config still hit the legacy branch in
 * `practice-test-runner-client` (free navigation, `PracticeQuestionCard`, different chrome).
 * Migrating those sessions to the CAT-aligned shell is **not** automatic: you would need a
 * deterministic config default on read (risking behavior change) or a **data backfill** that sets
 * `linearDeliveryMode` + rationale flags to match each row’s intent. Until then, keep the legacy
 * branch for hydrated sessions missing `linearDeliveryMode`.
 */

import type { LinearDeliveryMode } from "@/lib/practice-tests/types";

export type LinearEngineRunnerUiKind =
  /** CAT or non-linear — linear mode resolver does not apply. */
  | "inactive"
  /** Stored test predates `linearDeliveryMode`; separate renderer in the runner. */
  | "legacy_linear"
  | "linear_exam"
  | "linear_tutor"
  | "linear_tutor_review_nav";

export function resolveLinearEngineRunnerUiKind(args: {
  catMode: boolean;
  linearDeliveryMode?: LinearDeliveryMode | null;
  linearAllowReviewNavigation: boolean;
}): LinearEngineRunnerUiKind {
  if (args.catMode) return "inactive";
  const ld = args.linearDeliveryMode;
  if (!ld) return "legacy_linear";
  if (ld === "exam") return "linear_exam";
  if (args.linearAllowReviewNavigation) return "linear_tutor_review_nav";
  return "linear_tutor";
}
