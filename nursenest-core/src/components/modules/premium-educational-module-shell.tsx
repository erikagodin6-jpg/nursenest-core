import type { ReactNode } from "react";
import Link from "next/link";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";

type PremiumEducationalModuleShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
};

export function PremiumEducationalModuleShell({
  eyebrow,
  title,
  description,
  backHref = "/app",
  backLabel = "Back To Learner Home",
  children,
}: PremiumEducationalModuleShellProps) {
  return (
    <div
      className="nn-learner-ds-ambient min-h-screen bg-[var(--semantic-bg-base)] px-4 py-4 text-[var(--semantic-text-primary)] sm:px-6 lg:px-8"
      data-nn-premium-module-shell=""
      data-nn-premium-full-platform-convergence=""
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <header className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3 shadow-[var(--semantic-shadow-soft)] sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/app"
              className="inline-flex min-w-0 items-center gap-2 text-sm font-semibold text-[var(--semantic-text-primary)]"
              aria-label="NurseNest learner home"
            >
              <SiteBrandLogoMark variant="learner" />
              <span>NurseNest</span>
            </Link>
            <Link
              href={backHref}
              className="inline-flex min-h-9 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-bg-base)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-secondary)] transition hover:bg-[var(--semantic-surface-alt)]"
            >
              {backLabel}
            </Link>
          </div>
          <div className="mt-4 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
              {eyebrow}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{description}</p>
          </div>
        </header>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
