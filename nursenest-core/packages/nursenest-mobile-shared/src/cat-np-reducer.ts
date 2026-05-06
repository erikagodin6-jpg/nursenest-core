/**
 * NP CAT via `POST /api/cat/np/answer` — server returns next metadata shell or completion.
 * Full stems: `GET /api/questions/[id]` (omit rationale until session complete + analysis).
 */

export type NpCatPhase =
  | { kind: "idle" }
  | { kind: "active"; practiceTestId: string; sessionComplete: false }
  | { kind: "complete"; practiceTestId: string; sessionComplete: true }
  | { kind: "error"; message: string };

export type NpCatServerEvent =
  | { type: "reset" }
  | { type: "session_created"; practiceTestId: string }
  | {
      type: "answer_response";
      practiceTestId: string;
      body: {
        sessionComplete?: boolean;
        nextQuestion?: { id: string } | null;
        error?: string;
      };
    };

export function reduceNpCatPhase(state: NpCatPhase, event: NpCatServerEvent): NpCatPhase {
  switch (event.type) {
    case "reset":
      return { kind: "idle" };
    case "session_created":
      return { kind: "active", practiceTestId: event.practiceTestId, sessionComplete: false };
    case "answer_response": {
      const b = event.body;
      if (b.error) return { kind: "error", message: String(b.error) };
      if (b.sessionComplete) {
        return { kind: "complete", practiceTestId: event.practiceTestId, sessionComplete: true };
      }
      return { kind: "active", practiceTestId: event.practiceTestId, sessionComplete: false };
    }
    default:
      return state;
  }
}
