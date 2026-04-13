import type { ReactNode } from "react";
import type { LearnerNoteTone } from "@/components/learner-ui/learner-surface-tone";

/**
 * Supportive inset copy — variants align to info / success / danger semantics.
 */
export function LearnerNotePanel({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: LearnerNoteTone;
  children: ReactNode;
  className?: string;
}) {
  const dataTone = tone === "neutral" ? undefined : tone;
  return (
    <aside
      data-nn-ls-note-tone={dataTone}
      className={`nn-ls-note ${className}`.trim()}
      role="note"
    >
      {children}
    </aside>
  );
}
