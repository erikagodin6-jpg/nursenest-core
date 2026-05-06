/**
 * Pure state machine for RN/RPN CAT delivered via `PATCH /api/practice-tests/[id]` (`cat_advance`).
 * Server owns selection; client only tracks phase from JSON bodies.
 */

export type CatPracticePhase =
  | { kind: "idle" }
  | { kind: "running"; practiceTestId: string; awaitingReveal: boolean }
  | { kind: "study_reveal"; practiceTestId: string }
  | { kind: "completed"; practiceTestId: string; results: unknown }
  | { kind: "error"; message: string };

export type CatPracticeServerEvent =
  | { type: "reset" }
  | { type: "session_loaded"; practiceTestId: string; status: string; selectionMode?: string }
  | {
      type: "patch_cat_advance_response";
      practiceTestId: string;
      body: {
        ok?: boolean;
        catAdvanced?: boolean;
        catCompleted?: boolean;
        catStudyReveal?: boolean;
        results?: unknown;
        error?: string;
      };
    };

export function reduceCatPracticePhase(
  state: CatPracticePhase,
  event: CatPracticeServerEvent,
): CatPracticePhase {
  switch (event.type) {
    case "reset":
      return { kind: "idle" };
    case "session_loaded": {
      if (event.selectionMode && event.selectionMode !== "cat") {
        return { kind: "error", message: "Not a CAT practice session" };
      }
      if (event.status === "COMPLETED") {
        return { kind: "completed", practiceTestId: event.practiceTestId, results: null };
      }
      return { kind: "running", practiceTestId: event.practiceTestId, awaitingReveal: false };
    }
    case "patch_cat_advance_response": {
      const b = event.body;
      if (!b?.ok && b?.error) {
        return { kind: "error", message: String(b.error) };
      }
      if (b.catCompleted) {
        return { kind: "completed", practiceTestId: event.practiceTestId, results: b.results ?? null };
      }
      if (b.catStudyReveal) {
        return { kind: "study_reveal", practiceTestId: event.practiceTestId };
      }
      if (b.catAdvanced) {
        return { kind: "running", practiceTestId: event.practiceTestId, awaitingReveal: false };
      }
      return state;
    }
    default:
      return state;
  }
}
