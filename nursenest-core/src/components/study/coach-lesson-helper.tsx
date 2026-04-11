"use client";

import { Sparkles, ListOrdered, BookCheck } from "lucide-react";
import { useStudyCoach } from "@/lib/coach/use-study-coach";
import { CoachResponsePanel } from "./coach-response-panel";
import type { CoachIntent, CoachContext } from "@/lib/coach/study-coach-actions";

/**
 * CoachLessonHelper: structured helper panel on lesson pages.
 *
 * Sits below lesson content and offers:
 * "Simplify This", "Key Points Only", "Quick Check"
 *
 * Visually integrated into the lesson layout as a guidance strip.
 */
export function CoachLessonHelper({
  lessonTitle,
  lessonContent,
  topic,
}: {
  lessonTitle: string;
  lessonContent?: string;
  topic?: string | null;
}) {
  const coach = useStudyCoach();

  const baseContext: CoachContext = {
    content: lessonContent ?? lessonTitle,
    topic: topic ?? undefined,
  };

  function handleAction(intent: CoachIntent) {
    coach.ask(intent, baseContext);
  }

  function handleFollowUp(intent: CoachIntent) {
    coach.ask(intent, baseContext);
  }

  const actions = [
    { intent: "explain_simply" as CoachIntent, label: "Simplify This", Icon: Sparkles },
    { intent: "topic_review" as CoachIntent, label: "Key Points Only", Icon: ListOrdered },
    { intent: "quiz_concept" as CoachIntent, label: "Quick Check", Icon: BookCheck },
  ];

  return (
    <div className="nn-coach-lesson-strip">
      <div className="nn-coach-lesson-strip__header">
        <Sparkles className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
        <span className="nn-coach-lesson-strip__title">Study Coach</span>
      </div>

      {coach.status === "idle" && (
        <div className="nn-coach-lesson-strip__actions">
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
      )}

      <CoachResponsePanel
        status={coach.status}
        response={coach.response}
        error={coach.error}
        onFollowUp={handleFollowUp}
        onClose={coach.reset}
      />
    </div>
  );
}
