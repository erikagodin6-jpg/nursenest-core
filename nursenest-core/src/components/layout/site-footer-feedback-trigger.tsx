"use client";

import { useUserFeedbackOptional } from "@/components/feedback/user-feedback-context";

/** Renders nothing when the marketing/admin shell has not mounted {@link UserFeedbackProvider}. */
export function SiteFooterFeedbackTrigger() {
  const fb = useUserFeedbackOptional();
  if (!fb) return null;

  return (
    <li>
      <button
        type="button"
        onClick={fb.open}
        className="nn-footer-link break-words text-left leading-snug [overflow-wrap:anywhere]"
      >
        Send feedback
      </button>
    </li>
  );
}
