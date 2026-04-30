import type { ReactNode } from "react";

export function LearnerStudyHero({
  eyebrow,
  title,
  subtitle,
  stats,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  stats?: ReactNode;
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
      data-nn-learner-study-hero
    >
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{eyebrow}</p>
      ) : null}
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-[1.65rem]">{title}</h2>
      {subtitle ? <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{subtitle}</p> : null}
      {stats ? <div className="mt-4 border-t border-border pt-4">{stats}</div> : null}
    </header>
  );
}
