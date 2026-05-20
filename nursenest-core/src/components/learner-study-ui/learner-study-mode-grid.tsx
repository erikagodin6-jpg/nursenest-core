import type { ReactNode } from "react";

export function LearnerStudyModeGrid({
  children,
  label,
  className,
}: {
  children: ReactNode;
  label?: ReactNode;
  className?: string;
}) {
  return (
    <div className={["space-y-3", className].filter(Boolean).join(" ")} data-nn-learner-study-mode-grid>
      {label ? <p className="text-sm font-medium text-foreground">{label}</p> : null}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
    </div>
  );
}
