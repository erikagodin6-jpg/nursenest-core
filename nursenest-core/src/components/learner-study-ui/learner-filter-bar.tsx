import type { ReactNode } from "react";

export function LearnerFilterBar({
  title,
  description,
  children,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-border bg-muted/25 p-4 shadow-sm sm:p-5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-nn-learner-filter-bar
    >
      {title ? <p className="text-sm font-medium text-foreground">{title}</p> : null}
      {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      <div className={title || description ? "mt-3 space-y-2" : "space-y-2"}>{children}</div>
    </div>
  );
}
