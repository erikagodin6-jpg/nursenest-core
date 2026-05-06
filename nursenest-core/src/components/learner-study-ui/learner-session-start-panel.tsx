import type { ReactNode } from "react";

export function LearnerSessionStartPanel({
  primary,
  secondary,
  footnote,
  className,
}: {
  primary: ReactNode;
  secondary?: ReactNode;
  footnote?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "sticky bottom-0 z-10 mt-8 border-t border-border bg-background/90 pb-3 pt-4 backdrop-blur-sm supports-[backdrop-filter]:bg-background/75",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-nn-learner-session-start-panel
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">{primary}</div>
        {secondary ? <div className="flex flex-wrap items-center gap-2">{secondary}</div> : null}
      </div>
      {footnote ? <p className="mt-2 text-xs text-muted-foreground">{footnote}</p> : null}
    </div>
  );
}
