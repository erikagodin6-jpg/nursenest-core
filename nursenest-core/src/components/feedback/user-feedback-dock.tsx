"use client";

import { MessageCirclePlus } from "lucide-react";
import { useUserFeedback } from "@/components/feedback/user-feedback-context";
import { UserFeedbackDialog } from "@/components/feedback/user-feedback-dialog";

/**
 * Floating entry + modal host. Keeps the affordance visible without covering content.
 */
export function UserFeedbackDock() {
  const { open } = useUserFeedback();

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="nn-focus-ring fixed bottom-5 left-5 z-[90] flex h-12 max-w-[min(100vw-2.5rem,14rem)] items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_40%,var(--surface-strong))] px-4 text-left text-sm font-semibold text-[var(--theme-heading-text)] shadow-[var(--shadow-elevated)] backdrop-blur-sm transition hover:border-[color-mix(in_srgb,var(--semantic-info)_40%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--semantic-panel-positive)_35%,var(--surface-strong))] sm:bottom-6 sm:left-6"
        aria-haspopup="dialog"
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_16%,transparent)] text-[var(--semantic-brand)]"
          aria-hidden
        >
          <MessageCirclePlus className="h-4 w-4" />
        </span>
        <span className="min-w-0 truncate">Feedback</span>
      </button>
      <UserFeedbackDialog />
    </>
  );
}
