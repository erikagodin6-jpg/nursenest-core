import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ShellProps = {
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"section">, "className" | "children">;

type DivShellProps = {
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "children">;

export function LearnerWorkspaceShell({ children, className = "", ...rest }: DivShellProps) {
  return (
    <div
      {...rest}
      className={`nn-learner-workspace-shell ${className}`.trim()}
      data-nn-learner-workspace-shell=""
    >
      {children}
    </div>
  );
}

export function LearnerStudyShell({ children, className = "", ...rest }: DivShellProps) {
  return (
    <div
      {...rest}
      className={`nn-learner-study-shell ${className}`.trim()}
      data-nn-learner-study-shell=""
    >
      {children}
    </div>
  );
}

export function LearnerDashboardShell({ children, className = "", ...rest }: DivShellProps) {
  return (
    <div
      {...rest}
      className={`nn-learner-dashboard-shell ${className}`.trim()}
      data-nn-learner-dashboard-shell=""
    >
      {children}
    </div>
  );
}

export function LearnerSkeletonShell({ children, className = "", ...rest }: DivShellProps) {
  return (
    <div
      {...rest}
      className={`nn-learner-skeleton-shell ${className}`.trim()}
      data-nn-learner-skeleton-shell=""
    >
      {children}
    </div>
  );
}

export function LearnerWorkspaceSection({
  children,
  className = "",
  ...rest
}: ShellProps) {
  return (
    <section
      {...rest}
      className={`nn-learner-workspace-section ${className}`.trim()}
      data-nn-learner-workspace-section=""
    >
      {children}
    </section>
  );
}

export function LearnerSectionHeader({
  eyebrow,
  title,
  description,
  action,
  className = "",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header className={`nn-learner-section-header ${className}`.trim()}>
      <div className="min-w-0">
        {eyebrow ? <p className="nn-learner-section-header__eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {description ? <p className="nn-learner-section-header__description">{description}</p> : null}
      </div>
      {action ? <div className="nn-learner-section-header__action">{action}</div> : null}
    </header>
  );
}

export function LearnerRecoveryCard({
  title,
  description,
  primaryAction,
  secondaryAction,
  className = "",
}: {
  title: ReactNode;
  description: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`nn-learner-recovery-card ${className}`.trim()} role="status">
      <div className="nn-learner-recovery-card__icon" aria-hidden />
      <div className="nn-learner-recovery-card__copy">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {primaryAction || secondaryAction ? (
        <div className="nn-learner-recovery-card__actions">
          {primaryAction}
          {secondaryAction}
        </div>
      ) : null}
    </section>
  );
}
