/**
 * CAT-aligned **linear** practice runner — explicit UI / navigation modes.
 *
 * ## Modes (user-facing)
 *
 * - **`linear_exam`**: `linearDeliveryMode === "exam"` — CAT-style exam chrome, no per-item rationale
 *   column during delivery, **Previous disabled**, options locked after commit.
 * - **`linear_tutor`**: `linearDeliveryMode === "practice"` with **no** post-submit review navigation
 *   (`linearAllowReviewNavigation !== true`) — same CAT exam board as linear exam; per-item rationales
 *   render inline below options when policy is `after_each`, **Previous disabled** until/unless review nav is enabled.
 * - **`linear_tutor_review_nav`**: practice delivery + **`linearAllowReviewNavigation === true`** —
 *   same surfaces, **Previous** allowed only for **already-committed** earlier items (server + client).
 *
 * ## Legacy (`legacy_linear`)
 *
 * Rows **without** `linearDeliveryMode` on stored config still hit the legacy branch in
 * `practice-test-runner-client` (free navigation, no `linear_commit`). Presentation uses the same
 * CAT exam board shell as linear engine runs (`QuestionCard` + detached footer).
 * Migrating those rows to engine-backed delivery is **not** automatic without a config default on read
 * or a **data backfill** that sets `linearDeliveryMode` + rationale flags to match each row’s intent.
 *
 * **Resume contract:** `practice-session-contract.ts` rejects `linearAllowReviewNavigation` without
 * `linearDeliveryMode` (`legacy_linear_review_nav_unsafe`) so the API does not resume an ambiguous
 * review-nav shape on top of legacy free navigation.
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
