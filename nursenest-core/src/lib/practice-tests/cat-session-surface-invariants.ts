/**
 * Client-side CAT session guards (no engine changes).
 * Hydration and advance responses must never collapse corrupt server state into a silent "done" UX.
 */

import type { PracticeTestConfigJson } from "@/lib/practice-tests/types";
import { parseAdaptiveState } from "@/lib/exams/cat-engine";

export type CatHydrateInvariantResult =
  | { ok: true }
  | {
      ok: false;
      code:
        | "cat_in_progress_no_questions"
        | "cat_adaptive_state_corrupt"
        | "cat_config_session_pick_salt_missing";
      message: string;
    };

function saltLooksValid(s: unknown): boolean {
  return typeof s === "string" && s.trim().length >= 8;
}

/**
 * Block clearly corrupt hydrates before the runner wires timers / advance flows.
 */
export function assessCatPracticeHydrateInvariants(input: {
  catMode: boolean;
  status: string;
  questionIds: string[];
  adaptiveState?: unknown;
  config?: PracticeTestConfigJson | null;
}): CatHydrateInvariantResult {
  if (input.catMode && input.status === "IN_PROGRESS" && input.questionIds.length === 0) {
    return {
      ok: false,
      code: "cat_in_progress_no_questions",
      message:
        "This adaptive session is missing question data on load. Return to Practice tests and start a new session, or contact support — we will not fabricate items client-side.",
    };
  }

  if (input.catMode && input.status === "IN_PROGRESS" && input.questionIds.length > 0) {
    const cfg = input.config ?? null;
    if (!saltLooksValid(cfg?.sessionPickSalt)) {
      return {
        ok: false,
        code: "cat_config_session_pick_salt_missing",
        message:
          "This session is missing secure shuffle metadata (session pick salt). We cannot safely continue adaptive delivery. Return to Practice tests and start a new session, or contact support.",
      };
    }

    const raw = input.adaptiveState;
    if (raw === null || raw === undefined) {
      return {
        ok: false,
        code: "cat_adaptive_state_corrupt",
        message:
          "Adaptive scoring state is missing on load. Stay in this screen and retry, or return to Practice tests — we will not invent CAT state client-side.",
      };
    }
    if (parseAdaptiveState(raw) === null) {
      return {
        ok: false,
        code: "cat_adaptive_state_corrupt",
        message:
          "Adaptive scoring state could not be read (corrupt or unsupported version). Stay in this screen and retry, or contact support — we will not fabricate results.",
      };
    }
  }

  return { ok: true };
}
