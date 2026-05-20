import type { ReactNode } from "react";

export function LearnerStudyHero({
  title,
  subtitle,
  pathwayLabel,
  children,
}: {
  title: string;
  subtitle?: string;
  pathwayLabel?: string;
  children?: ReactNode;
}) {
  return (
    <header className="space-y-2" data-nn-learner-study-hero>
      <h1 className="text-2xl font-semibold text-[var(--semantic-text-primary)]">{title}</h1>
      {subtitle ? <p className="text-sm text-[var(--semantic-text-secondary)]">{subtitle}</p> : null}
      {pathwayLabel ? <p className="text-xs font-medium text-[var(--semantic-brand)]">{pathwayLabel}</p> : null}
      {children}
    </header>
  );
}
