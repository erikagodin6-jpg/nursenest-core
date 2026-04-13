"use client";

import type { ReactNode } from "react";
import { MessagesSquare } from "lucide-react";
import { useUserFeedbackOptional } from "@/components/feedback/user-feedback-context";

/**
 * Contextual “Send feedback” in account / help menus when {@link UserFeedbackProvider} is mounted.
 */
export function UserFeedbackAccountMenuItem({
  onActivate,
  className,
  children = "Send feedback",
}: {
  onActivate: () => void;
  className: string;
  children?: ReactNode;
}) {
  const fb = useUserFeedbackOptional();
  if (!fb) return null;

  return (
    <button
      type="button"
      role="menuitem"
      className={className}
      onClick={() => {
        fb.open();
        onActivate();
      }}
    >
      <span className="inline-flex items-center gap-2">
        <MessagesSquare className="h-4 w-4 shrink-0 opacity-80" aria-hidden strokeWidth={2} />
        <span>{children}</span>
      </span>
    </button>
  );
}
