import type { ReactNode } from "react";

/**
 * Semantic shell for post-answer rationale columns (practice runner can compose sections inside).
 * Avoids `text-white` on light surfaces — use foreground tokens only.
 */
export function LearnerRationalePanel({
  title = "Rationale & review",
  children,
  className,
  hideTitle = false,
}: {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  /** When true, omit the header row (caller supplies its own chrome, e.g. rationale review board). */
  hideTitle?: boolean;
}) {
  return (
    <aside
      className={[
        "flex min-h-0 flex-col rounded-2xl border border-border bg-card p-4 text-foreground shadow-sm sm:p-5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-nn-learner-rationale-panel
    >
      {hideTitle ? null : (
        <div className="mb-3 flex items-center gap-2 border-b border-border pb-2">
          <h3 className="m-0 text-sm font-semibold text-foreground">{title}</h3>
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-auto text-sm text-muted-foreground">{children}</div>
    </aside>
  );
}
