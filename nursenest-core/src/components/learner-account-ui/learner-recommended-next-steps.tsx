import type { ReactNode } from "react";

export function LearnerRecommendedNextSteps({
  title,
  subtitle,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      className="nn-card nn-student-card-lift rounded-2xl border border-border bg-card p-6 text-foreground shadow-sm"
      data-nn-learner-recommended-next-steps
    >
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </section>
  );
}
