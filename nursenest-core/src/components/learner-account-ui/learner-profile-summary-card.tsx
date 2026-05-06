import type { ReactNode } from "react";

export function LearnerProfileSummaryCard({
  title,
  subtitle,
  children,
  footer,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "nn-card nn-student-card-lift rounded-2xl border border-border bg-card p-6 text-foreground shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-nn-learner-profile-summary-card
    >
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
      {footer ? <div className="mt-6 border-t border-border pt-6">{footer}</div> : null}
    </section>
  );
}
