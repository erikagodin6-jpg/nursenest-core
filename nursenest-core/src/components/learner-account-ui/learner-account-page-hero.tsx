import type { ReactNode } from "react";

export function LearnerAccountPageHero({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={[
        "nn-study-card rounded-2xl border border-border bg-card p-6 text-foreground shadow-sm sm:p-7",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-nn-learner-account-page-hero
    >
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{eyebrow}</p>
      ) : null}
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
      {description ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
      {actions ? <div className="mt-4 flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
