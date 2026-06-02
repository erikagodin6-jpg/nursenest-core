"use client";

import { Lightbulb, HelpCircle, BookCheck } from "lucide-react";
import { useStudyCoach } from "@/lib/coach/use-study-coach";
import { CoachResponsePanel } from "./coach-response-panel";
import type { CoachIntent, CoachContext } from "@/lib/coach/study-coach-types";

/**
 * CoachReviewHelper: inline guidance actions on the smart review screen.
 *
 * Appears below a question's rationale with focused actions:
 * "Explain This More Clearly", "Why Was This Wrong?", "Quiz Me on This"
 *
 * Quiet, structured, and visually integrated into the review row.
 */
export function CoachReviewHelper({
  stem,
  topic,
  subtopic,
  rationale,
  wasCorrect,
}: {
  stem: string;
  topic?: string | null;
  subtopic?: string | null;
  rationale?: string | null;
  wasCorrect: boolean;
}) {
  const coach = useStudyCoach();

  const baseContext: CoachContext = {
    content: stem,
    topic: topic ?? undefined,
    subtopic: subtopic ?? undefined,
    rationale: rationale ?? undefined,
    wasCorrect,
  };

  function handleAction(intent: CoachIntent) {
    coach.ask(intent, baseContext);
  }

  function handleFollowUp(intent: CoachIntent, ctx: CoachContext) {
    coach.ask(intent, ctx);
  }

  const actions = wasCorrect
    ? [
        { intent: "explain_simply" as CoachIntent, label: "Explain This More Clearly", Icon: Lightbulb },
        { intent: "quiz_concept" as CoachIntent, label: "Quiz Me on This", Icon: BookCheck },
      ]
    : [
        { intent: "why_wrong" as CoachIntent, label: "Why Was This Wrong?", Icon: HelpCircle },
        { intent: "explain_simply" as CoachIntent, label: "Explain This More Clearly", Icon: Lightbulb },
        { intent: "quiz_concept" as CoachIntent, label: "Quiz Me on This", Icon: BookCheck },
      ];

  return (
    <div className="nn-coach-inline">
      {coach.status === "idle" && (
        <div className="nn-coach-inline__actions">
          <span className="nn-coach-inline__label">Study Coach</span>
          <div className="nn-coach-inline__buttons">
            {actions.map(({ intent, label, Icon }) => (
              <button
                key={intent}
                type="button"
                className="nn-coach-action-btn"
                onClick={() => handleAction(intent)}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <CoachResponsePanel
        status={coach.status}
        response={coach.response}
        error={coach.error}
        onFollowUp={handleFollowUp}
        onClose={coach.reset}
        followUpBaseContext={baseContext}
      />
    </div>
  );
}
