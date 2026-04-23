import Link from "next/link";
import type { ReactNode } from "react";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { LessonsPageShell } from "@/components/pathway-lessons/lessons-page-shell";
import { LessonHubSurfaceChips } from "@/components/pathway-lessons/lesson-hub-surface-chips";
import type { BreadcrumbCrumb, BreadcrumbSchemaItem } from "@/lib/seo/breadcrumb-types";

export type MarketingLessonsHubRetryableErrorShellProps = {
  title: string;
  subtitle: string;
  toolbar: ReactNode;
  backLabel: string;
  backHref: string;
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
  surfaceChips: { label: string; href: string }[];
  /** Primary user-facing title inside the card */
  errorTitle: string;
  errorBody: string;
  /** Optional technical detail (short) */
  errorDetail?: string;
  retryHref: string;
  retryLabel?: string;
  secondaryHref: string;
  secondaryLabel: string;
  /** Optional support / contact link (tertiary). */
  supportHref?: string;
  supportLabel?: string;
};

/**
 * Shared marketing lessons hub shell for **retryable** failures (list load error, verify pipeline invariant, etc.).
 * Keeps nav, breadcrumbs, and study surface chips so users are not stranded on a blank marketing page.
 */
export function MarketingLessonsHubRetryableErrorShell(props: MarketingLessonsHubRetryableErrorShellProps) {
  const {
    title,
    subtitle,
    toolbar,
    backLabel,
    backHref,
    crumbs,
    schemaItems,
    surfaceChips,
    errorTitle,
    errorBody,
    errorDetail,
    retryHref,
    retryLabel = "Retry",
    secondaryHref,
    secondaryLabel,
    supportHref,
    supportLabel = "Contact support",
  } = props;

  return (
    <LessonsPageShell title={title} subtitle={subtitle} toolbar={toolbar} backLink={{ label: backLabel, href: backHref }}>
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />
      <LessonHubSurfaceChips links={surfaceChips} />
      <div
        className="mt-6 rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5"
        data-testid="marketing-hub-load-error"
      >
        <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{errorTitle}</p>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">{errorBody}</p>
        {errorDetail ? <p className="mt-3 text-xs text-[var(--theme-muted-text)]">{errorDetail}</p> : null}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href={retryHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            {retryLabel}
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-card"
          >
            {secondaryLabel}
          </Link>
          {supportHref ? (
            <Link
              href={supportHref}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full px-2 text-sm font-semibold text-[var(--semantic-brand)] underline-offset-4 hover:underline"
            >
              {supportLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </LessonsPageShell>
  );
}
