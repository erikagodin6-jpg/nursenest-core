"use client";

import { MessagesSquare } from "lucide-react";
import { useUserFeedback } from "@/components/feedback/user-feedback-context";

/**
 * Secondary, quiet control in the learner shell header (pairs with the global FAB).
 * Reads as tertiary nav — not a loud support widget.
 */
export function UserFeedbackNavPill({ className = "" }: { className?: string }) {
  const { open } = useUserFeedback();

  return (
    <button
      type="button"
      onClick={open}
      className={`nn-global-feedback-header-trigger ${className}`}
      aria-haspopup="dialog"
      aria-label="Send feedback or report a bug"
    >
      <MessagesSquare className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden strokeWidth={2} />
      <span className="hidden sm:inline">Feedback</span>
      <span className="sm:hidden">Help</span>
    </button>
  );
}
