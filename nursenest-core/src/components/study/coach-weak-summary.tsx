"use client";

import { ListChecks } from "lucide-react";
import { useStudyCoach } from "@/lib/coach/use-study-coach";
import { CoachResponsePanel } from "./coach-response-panel";
import type { CoachIntent, CoachContext } from "@/lib/coach/study-coach-actions";

/**
 * CoachWeakSummary: generates a structured review summary of weak topics.
 *
 * Can be placed on the dashboard, readiness page, or after practice tests.
 * Only renders when there are weak topics to summarize.
 */
export function CoachWeakSummary({
  weakTopics,
  examTarget,
  daysUntilExam,
}: {
  weakTopics: string[];
  examTarget?: string;
  daysUntilExam?: number | null;
}) {
  const coach = useStudyCoach();

  if (weakTopics.length === 0) return null;

  const context: CoachContext = {
    weakTopics,
    examTarget,
    daysUntilExam: daysUntilExam ?? undefined,
  };

  function handleSummarize() {
    coach.ask("weak_summary", context);
  }

  function handleFollowUp(intent: CoachIntent) {
    coach.ask(intent, context);
  }

  return (
    <div className="nn-coach-weak-summary">
      {coach.status === "idle" && (
        <button
          type="button"
          className="nn-coach-action-btn nn-coach-action-btn--wide"
          onClick={handleSummarize}
        >
          <ListChecks className="h-3.5 w-3.5" aria-hidden />
          Summarize My Weak Areas
        </button>
      )}

      <CoachResponsePanel
        status={coach.status}
        response={coach.response}
        error={coach.error}
        onFollowUp={(intent: CoachIntent, _ctx: CoachContext) =>
          handleFollowUp(intent)
        }
        onClose={coach.reset}
      />
    </div>
  );
}
