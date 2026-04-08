import type { ReactNode } from "react";
import Link from "next/link";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

export function ProgressCardShell({
  title,
  subtitle,
  actionHref,
  actionLabel,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-border/60 bg-[var(--bg-card)] shadow-sm ${className}`.trim()}
    >
      <div className="flex flex-col gap-2 border-b border-border/60 bg-gradient-to-r from-primary/[0.05] via-transparent to-role-success/[0.04] px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-[var(--theme-heading-text)]">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{subtitle}</p> : null}
        </div>
        {actionHref && actionLabel ? (
          <Link
            href={actionHref}
            className="shrink-0 text-sm font-semibold text-primary underline-offset-2 hover:underline sm:pt-0.5"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function ProgressMeter({
  value,
  max = 100,
  ariaLabel,
}: {
  value: number;
  max?: number;
  ariaLabel?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      <div className="h-full rounded-full bg-role-success transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function StatBlock({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/10 px-3 py-3 text-center sm:px-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold tabular-nums text-[var(--theme-heading-text)] sm:text-2xl">{value}</p>
      {hint ? <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function ResponsiveStatRow({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{children}</div>;
}

export function PathwayLessonCard({
  title,
  badge,
  pct,
  completed,
  inProgress,
  notStarted,
  total,
  t,
}: {
  title: string;
  badge: string;
  pct: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  total: number;
  t: LearnerMarketingT;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-border/55 bg-muted/10 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="inline-flex rounded-md bg-primary/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
            {badge}
          </span>
          <h3 className="mt-2 text-sm font-semibold text-[var(--theme-heading-text)]">{title}</h3>
        </div>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {total > 0 ? `${pct}%` : t("learner.progressPage.pathwayNoLessons")}
        </span>
      </div>
      {total > 0 ? (
        <div className="mt-3">
          <ProgressMeter value={pct} ariaLabel={title} />
        </div>
      ) : null}
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] sm:text-xs">
        <div className="rounded-lg bg-[var(--bg-card)] py-2">
          <dt className="font-medium text-muted-foreground">{t("learner.progressPage.lessonsCompleted")}</dt>
          <dd className="mt-0.5 tabular-nums font-semibold text-foreground">{completed}</dd>
        </div>
        <div className="rounded-lg bg-[var(--bg-card)] py-2">
          <dt className="font-medium text-muted-foreground">{t("learner.progressPage.lessonsInProgress")}</dt>
          <dd className="mt-0.5 tabular-nums font-semibold text-foreground">{inProgress}</dd>
        </div>
        <div className="rounded-lg bg-[var(--bg-card)] py-2">
          <dt className="font-medium text-muted-foreground">{t("learner.progressPage.lessonsNotStarted")}</dt>
          <dd className="mt-0.5 tabular-nums font-semibold text-foreground">{notStarted}</dd>
        </div>
      </dl>
    </div>
  );
}
