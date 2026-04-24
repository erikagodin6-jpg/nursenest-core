/**
 * Client-side CAT session guards (no engine changes).
 * Hydration and advance responses must never collapse corrupt server state into a silent "done" UX.
 */

import type { PracticeTestConfigJson } from "@/lib/practice-tests/types";
import { parseAdaptiveState } from "@/lib/exams/cat-engine";
import { isValidPracticeTestTerminalResultsPayload } from "@/lib/practice-tests/cat-advance-contract";

export type CatHydrateInvariantResult =
  | { ok: true }
  | {
      ok: false;
      code:
        | "cat_in_progress_no_questions"
        | "cat_adaptive_state_corrupt"
        | "cat_config_session_pick_salt_missing"
        | "cat_in_progress_cursor_invalid"
        | "cat_completed_terminal_invalid"
        | "linear_engine_in_progress_no_questions"
        | "linear_engine_session_pick_salt_missing"
        | "legacy_linear_in_progress_no_questions";
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
  /** Server cursor; when missing, callers should pass the same default they apply before rendering (usually 0). */
  cursorIndex?: number;
  /** Raw results from GET — used only to reject fake terminal COMPLETED payloads for CAT. */
  results?: unknown;
}): CatHydrateInvariantResult {
  const cfg = input.config ?? null;
  const cursor =
    typeof input.cursorIndex === "number" && Number.isInteger(input.cursorIndex) ? input.cursorIndex : 0;

  if (input.catMode && input.status === "COMPLETED") {
    if (input.questionIds.length === 0 || !isValidPracticeTestTerminalResultsPayload(input.results)) {
      return {
        ok: false,
        code: "cat_completed_terminal_invalid",
        message:
          "This adaptive session is marked complete but the score summary is missing or unreadable. We will not show results from this snapshot — return to Practice tests or retry load, or contact support.",
      };
    }
  }

  if (input.catMode && input.status === "IN_PROGRESS" && input.questionIds.length === 0) {
    return {
      ok: false,
      code: "cat_in_progress_no_questions",
      message:
        "This adaptive session is missing question data on load. Return to Practice tests and start a new session, or contact support — we will not fabricate items client-side.",
    };
  }

  if (!input.catMode && cfg?.selectionMode !== "cat" && Boolean(cfg?.linearDeliveryMode) && input.status === "IN_PROGRESS") {
    if (input.questionIds.length === 0) {
      return {
        ok: false,
        code: "linear_engine_in_progress_no_questions",
        message:
          "This linear exam session has no questions on load. Return to Practice tests and start a new session — we will not treat this as a finished exam.",
      };
    }
    if (!saltLooksValid(cfg?.sessionPickSalt)) {
      return {
        ok: false,
        code: "linear_engine_session_pick_salt_missing",
        message:
          "This linear session is missing secure shuffle metadata (session pick salt). Return to Practice tests and start a new session, or contact support — we will not guess item order.",
      };
    }
  }

  if (
    !input.catMode &&
    cfg &&
    cfg.selectionMode !== "cat" &&
    !cfg.linearDeliveryMode &&
    input.status === "IN_PROGRESS" &&
    input.questionIds.length === 0
  ) {
    return {
      ok: false,
      code: "legacy_linear_in_progress_no_questions",
      message:
        "This practice session has no questions on load. Return to Practice tests and start a new session — we will not run an empty exam.",
    };
  }

  if (input.catMode && input.status === "IN_PROGRESS" && input.questionIds.length > 0) {
    if (cursor < 0 || cursor >= input.questionIds.length) {
      return {
        ok: false,
        code: "cat_in_progress_cursor_invalid",
        message:
          "The server cursor does not match this adaptive session’s question list. Stay on this screen and retry load, or return to Practice tests — we will not guess which item is current.",
      };
    }
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
