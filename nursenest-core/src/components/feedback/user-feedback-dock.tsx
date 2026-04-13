"use client";

import { MessagesSquare } from "lucide-react";
import { useUserFeedback } from "@/components/feedback/user-feedback-context";
import { UserFeedbackDialog } from "@/components/feedback/user-feedback-dialog";
import { useGlobalFeedbackKeyboardShortcut } from "@/components/feedback/use-global-feedback-keyboard";

/**
 * Primary global entry: soft glass pill, lower-left (keeps lower-right clear for optional tutor dock).
 * Mobile: icon-only circle with full phrase in aria-label. Desktop: icon + short label.
 */
export function UserFeedbackDock() {
  const { open } = useUserFeedback();
  useGlobalFeedbackKeyboardShortcut(open);

  return (
    <>
      <button
        type="button"
        id="nn-global-feedback-trigger"
        onClick={open}
        className="nn-global-feedback-fab"
        aria-haspopup="dialog"
        aria-label="Send feedback or report a bug. Keyboard shortcut: Alt Shift F."
        aria-keyshortcuts="Alt+Shift+F"
      >
        <span className="nn-global-feedback-fab__icon" aria-hidden>
          <MessagesSquare className="h-[1.05rem] w-[1.05rem] sm:h-[1.1rem] sm:w-[1.1rem]" strokeWidth={2} />
        </span>
        <span className="nn-global-feedback-fab__label">Feedback</span>
      </button>
      <UserFeedbackDialog />
    </>
  );
}
