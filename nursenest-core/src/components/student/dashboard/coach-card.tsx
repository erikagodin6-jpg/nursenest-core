"use client";

import { Compass, ListChecks, CalendarRange } from "lucide-react";
import { useStudyCoach } from "@/lib/coach/use-study-coach";
import { CoachResponsePanel } from "@/components/study/coach-response-panel";
import type { CoachIntent, CoachContext } from "@/lib/coach/study-coach-types";

/**
 * DashboardCoachCard: concise guidance card on the learner dashboard.
 *
 * Shows three focused actions that tie into the next-best-action system:
 * "What to Study Next", "Focus Areas to Review", "Build a Quick Review"
 *
 * Renders as a quiet card, visually consistent with other dashboard sections.
 */
export function DashboardCoachCard({
  weakTopics,
  examTarget,
  daysUntilExam,
}: {
  weakTopics?: string[];
  examTarget?: string;
  daysUntilExam?: number | null;
}) {
  const coach = useStudyCoach();

  const context: CoachContext = {
    weakTopics,
    examTarget,
    daysUntilExam: daysUntilExam ?? undefined,
  };

  function handleAction(intent: CoachIntent) {
    coach.ask(intent, context);
  }

  function handleFollowUp(intent: CoachIntent, ctx: CoachContext) {
    coach.ask(intent, ctx);
  }

  const actions = [
    { intent: "what_next" as CoachIntent, label: "What to Study Next", Icon: Compass },
    { intent: "weak_summary" as CoachIntent, label: "Focus Areas to Review", Icon: ListChecks },
    { intent: "quick_plan" as CoachIntent, label: "Build a Quick Review", Icon: CalendarRange },
  ];

  return (
    <div className="nn-coach-card">
      <div className="nn-coach-card__header">
        <Compass className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
        <h3 className="nn-coach-card__title">Study Coach</h3>
      </div>

      {coach.status === "idle" && (
        <div className="nn-coach-card__actions">
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
        followUpBaseContext={context}
      />
    </div>
  );
}
