/**
 * Practice session contract matrix (CAT vs linear engine vs legacy linear).
 *
 * ## Allowed combinations (high level)
 *
 * | Surface | selectionMode | linearDeliveryMode | linearRationale | review nav | adaptiveState |
 * |---------|---------------|--------------------|-----------------|------------|----------------|
 * | CAT adaptive | cat | — | CAT feedback modes | N/A (CAT rules) | CAT adaptive JSON |
 * | linear_exam | non-cat | exam | end_of_exam | **false only** | `linearEngine.committedQuestionIds[]` |
 * | linear_tutor | non-cat | practice | after_each (typical) | false | same |
 * | linear_tutor_review_nav | non-cat | practice | after_each (typical) | **true** | same |
 * | legacy_linear | non-cat | **absent** | inferred client-side | **must not be true without engine** | not required |
 *
 * **Resume:** Never infer exam vs tutor from weak signals. Missing `linearDeliveryMode` + `linearAllowReviewNavigation` is treated as unsafe legacy and fails this contract.
 * Any persisted `adaptiveState.linearEngine` (or commits) without `config.linearDeliveryMode` fails — we do not coerce that into exam vs tutor.
 */

import { isValidPracticeTestTerminalResultsPayload } from "@/lib/practice-tests/cat-advance-contract";
import { assessCatPracticeHydrateInvariants } from "@/lib/practice-tests/cat-session-surface-invariants";
import { getLinearCommittedQuestionIds } from "@/lib/practice-tests/practice-linear-engine";
import type { PracticeTestConfigJson } from "@/lib/practice-tests/types";

function adaptiveStateHasStrayLinearEngineBlob(adaptiveState: unknown): boolean {
  if (!adaptiveState || typeof adaptiveState !== "object" || Array.isArray(adaptiveState)) return false;
  const le = (adaptiveState as { linearEngine?: unknown }).linearEngine;
  return le !== undefined && le !== null;
}

export type PracticeSessionContractViolation = {
  code: string;
  message: string;
};

export type PracticeSessionHydrateContractResult =
  | { ok: true }
  | { ok: false; violation: PracticeSessionContractViolation };

/** JSON body fields returned by GET/PATCH when the session contract fails (stable shape for clients). */
export function sessionContractErrorJsonBody(violation: PracticeSessionContractViolation) {
  return {
    error: violation.message,
    code: violation.code,
    retryable: false as const,
    sessionContractError: violation,
  };
}

/**
 * True when a practice-test hydrate payload must not be treated as a healthy session.
 * Runner and tests share this so removing the runner guard breaks a unit test.
 */
export function hydratePayloadHasBlockingSessionContractError(payload: {
  sessionContractError?: { code?: string; message?: string } | null;
}): boolean {
  const e = payload.sessionContractError;
  return Boolean(e && typeof e.message === "string" && e.message.trim().length > 0);
}

export function assessPracticeTestSessionHydrateContract(input: {
  catMode: boolean;
  status: string;
  questionIds: string[];
  cursorIndex?: number;
  adaptiveState: unknown;
  config: PracticeTestConfigJson | null;
  results?: unknown;
}): PracticeSessionHydrateContractResult {
  const cat = assessCatPracticeHydrateInvariants({
    catMode: input.catMode,
    status: input.status,
    questionIds: input.questionIds,
    adaptiveState: input.adaptiveState,
    config: input.config,
    cursorIndex: input.cursorIndex,
    results: input.results,
  });
  if (!cat.ok) {
    return { ok: false, violation: { code: cat.code, message: cat.message } };
  }

  const cfg = input.config;
  if (!cfg) {
    return { ok: true };
  }

  if (cfg.linearDeliveryMode === "exam" && cfg.linearAllowReviewNavigation === true) {
    return {
      ok: false,
      violation: {
        code: "linear_exam_review_nav_forbidden",
        message:
          "This session mixes exam delivery with review navigation, which the platform does not support. Start a new linear session from the hub.",
      },
    };
  }

  if (cfg.selectionMode !== "cat" && !cfg.linearDeliveryMode && cfg.linearAllowReviewNavigation === true) {
    return {
      ok: false,
      violation: {
        code: "legacy_linear_review_nav_unsafe",
        message:
          "This older practice session has review navigation enabled without the linear exam engine metadata needed to resume safely. Start a new session from the hub.",
      },
    };
  }

  if (
    !input.catMode &&
    cfg.selectionMode !== "cat" &&
    !cfg.linearDeliveryMode &&
    (getLinearCommittedQuestionIds(input.adaptiveState).length > 0 || adaptiveStateHasStrayLinearEngineBlob(input.adaptiveState))
  ) {
    return {
      ok: false,
      violation: {
        code: "linear_engine_metadata_without_delivery_mode",
        message:
          "This row stores linear engine progress in adaptiveState but the saved configuration is missing linearDeliveryMode, so we cannot resume exam vs tutor rules safely. Start a new session from the hub.",
      },
    };
  }

  const inProgress = input.status === "IN_PROGRESS";
  if (!input.catMode && cfg.selectionMode !== "cat" && cfg.linearDeliveryMode && inProgress) {
    const raw = input.adaptiveState;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return {
        ok: false,
        violation: {
          code: "linear_engine_resume_missing_adaptive_state",
          message:
            "This linear session is missing persisted progress state. We cannot resume lock/submit rules safely — start a new session from the hub.",
        },
      };
    }
    const le = (raw as { linearEngine?: unknown }).linearEngine;
    if (!le || typeof le !== "object" || Array.isArray(le)) {
      return {
        ok: false,
        violation: {
          code: "linear_engine_resume_missing_linear_engine",
          message:
            "This linear session is missing engine metadata (committed items). We cannot resume safely — start a new session from the hub.",
        },
      };
    }
    const cids = (le as { committedQuestionIds?: unknown }).committedQuestionIds;
    if (!Array.isArray(cids)) {
      return {
        ok: false,
        violation: {
          code: "linear_engine_resume_committed_ids_invalid",
          message:
            "This linear session has corrupt commit metadata. Start a new session from the hub.",
        },
      };
    }
    const committed = getLinearCommittedQuestionIds(raw);
    for (const qid of committed) {
      if (!input.questionIds.includes(qid)) {
        return {
          ok: false,
          violation: {
            code: "linear_engine_resume_committed_unknown_ids",
            message:
              "This linear session references answers outside its question list. Start a new session from the hub.",
          },
        };
      }
    }

    const cur = input.cursorIndex;
    if (
      typeof cur !== "number" ||
      !Number.isInteger(cur) ||
      cur < 0 ||
      cur >= input.questionIds.length
    ) {
      return {
        ok: false,
        violation: {
          code: "linear_engine_in_progress_cursor_invalid",
          message:
            "The server cursor does not match this linear session's question list. Return to Practice tests — we will not guess the active item.",
        },
      };
    }
  }

  if (input.status === "COMPLETED") {
    if (input.results === undefined || input.results === null) {
      return {
        ok: false,
        violation: {
          code: "completed_missing_results",
          message:
            "This session is marked complete but has no score summary. Return to Practice tests — we will not show a fake results screen.",
        },
      };
    }
    if (!isValidPracticeTestTerminalResultsPayload(input.results)) {
      return {
        ok: false,
        violation: {
          code: "completed_results_invalid",
          message:
            "This session is marked complete but the score summary is unreadable or incomplete. Return to Practice tests or contact support.",
        },
      };
    }
    const res = input.results as Record<string, unknown>;
    const incorrect = res.incorrectQuestionIds;
    if (Array.isArray(incorrect)) {
      for (const q of incorrect) {
        if (typeof q === "string" && q.length > 0 && !input.questionIds.includes(q)) {
          return {
            ok: false,
            violation: {
              code: "completed_results_question_mismatch",
              message:
                "This session's results reference questions that are not part of the attempt. Return to Practice tests — we will not show an inconsistent score.",
            },
          };
        }
      }
    }
    if (!input.catMode && input.questionIds.length > 0) {
      const scoreTotal = res.scoreTotal;
      if (typeof scoreTotal === "number" && Number.isFinite(scoreTotal) && scoreTotal > input.questionIds.length) {
        return {
          ok: false,
          violation: {
            code: "completed_score_total_exceeds_session",
            message:
              "This session's score total does not match its question list. Return to Practice tests — we will not show an inconsistent score.",
          },
        };
      }
    }
  }

  return { ok: true };
}

/**
 * Normalize POST /api/practice-tests linear fields so exam delivery never persists tutor-only review navigation.
 */
export function normalizeLinearPracticeCreateContract(input: {
  linearDeliveryMode?: "practice" | "exam" | null;
  linearRationaleVisibility?: "after_each" | "end_of_exam" | null;
  linearAllowReviewNavigation?: boolean | null;
}): {
  linearDeliveryMode: "practice" | "exam";
  linearRationaleVisibility: "after_each" | "end_of_exam";
  linearAllowReviewNavigation: boolean;
} {
  const linearMode = input.linearDeliveryMode ?? null;
  const linearRationaleVisibility =
    input.linearRationaleVisibility ?? (linearMode === "exam" ? "end_of_exam" : "after_each");
  const resolvedLinearMode = linearRationaleVisibility === "after_each" ? "practice" : "exam";
  const effectiveDelivery = linearMode ?? resolvedLinearMode;
  const linearAllowReviewNavigation =
    effectiveDelivery === "practice" && input.linearAllowReviewNavigation === true;
  return {
    linearDeliveryMode: effectiveDelivery,
    linearRationaleVisibility,
    linearAllowReviewNavigation,
  };
}
