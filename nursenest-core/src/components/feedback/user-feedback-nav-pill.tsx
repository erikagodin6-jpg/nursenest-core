"use client";

import { MessageCircle } from "lucide-react";
import { useUserFeedback } from "@/components/feedback/user-feedback-context";

/** Compact control for headers and toolbars (paired with {@link UserFeedbackDock}). */
export function UserFeedbackNavPill({ className = "" }: { className?: string }) {
  const { open } = useUserFeedback();

  return (
    <button
      type="button"
      onClick={open}
      className={`nn-focus-ring inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,var(--surface-strong))] px-3 py-2 text-xs font-semibold text-[var(--theme-heading-text)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] sm:text-sm ${className}`}
      aria-haspopup="dialog"
    >
      <MessageCircle className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
      <span className="hidden sm:inline">Feedback</span>
      <span className="sm:hidden">Help</span>
    </button>
  );
}
