"use client";

import { X, Loader2, AlertCircle } from "lucide-react";
import type { CoachResponse, CoachIntent, CoachContext } from "@/lib/coach/study-coach-actions";
import type { CoachStatus } from "@/lib/coach/use-study-coach";

/**
 * CoachResponsePanel renders the Study Coach response inline.
 * Shared across review, lesson, and dashboard surfaces.
 * Structured and calm, never chatbot-like.
 */
export function CoachResponsePanel({
  status,
  response,
  error,
  onFollowUp,
  onClose,
}: {
  status: CoachStatus;
  response: CoachResponse | null;
  error: string | null;
  onFollowUp?: (intent: CoachIntent, context: CoachContext) => void;
  onClose: () => void;
}) {
  if (status === "idle") return null;

  return (
    <div className="nn-coach-panel" role="region" aria-label="Study Coach">
      <div className="nn-coach-panel__header">
        {status === "success" && response ? (
          <h4 className="nn-coach-panel__title">{response.title}</h4>
        ) : status === "loading" ? (
          <h4 className="nn-coach-panel__title">Thinking...</h4>
        ) : (
          <h4 className="nn-coach-panel__title">Study Coach</h4>
        )}
        <button
          type="button"
          onClick={onClose}
          className="nn-coach-panel__close"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="nn-coach-panel__body">
        {status === "loading" && (
          <div className="nn-coach-panel__loading">
            <Loader2 className="h-5 w-5 animate-spin text-[var(--semantic-brand)]" />
            <p className="text-sm text-[var(--semantic-text-secondary)]">
              Working on it...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="nn-coach-panel__error">
            <AlertCircle className="h-4 w-4 text-[var(--semantic-danger)]" />
            <p className="text-sm text-[var(--semantic-text-secondary)]">
              {error || "Something went wrong. Please try again."}
            </p>
          </div>
        )}

        {status === "success" && response && (
          <>
            <div className="nn-coach-panel__content">
              {response.content.split("\n").map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return null;
                return (
                  <p key={i} className="nn-coach-panel__line">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {response.followUp && response.followUp.length > 0 && onFollowUp && (
              <div className="nn-coach-panel__follow-ups">
                {response.followUp.map((f) => (
                  <button
                    key={f.intent}
                    type="button"
                    className="nn-coach-follow-up-btn"
                    onClick={() => onFollowUp(f.intent, {})}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
