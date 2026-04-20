import Link from "next/link";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

const WORKSPACE_LINKS: readonly { href: string; labelKey: string }[] = [
  { href: "/app/account/report-card", labelKey: "learner.account.nav.reportCard" },
  { href: "/app/account/readiness", labelKey: "learner.account.nav.readiness" },
  { href: "/app/account/progress", labelKey: "learner.account.nav.progress" },
  { href: "/app/account/question-bank-performance", labelKey: "learner.account.nav.questionBankPerf" },
  { href: "/app/account/study-history", labelKey: "learner.account.nav.studyHistory" },
  { href: "/app/lessons", labelKey: "nav.lessons" },
  { href: "/app/questions", labelKey: "nav.questionBank" },
] as const;

/**
 * Horizontal “performance workspace” strip (legacy `/performance-analytics` + profile cross-links pattern):
 * keeps report card / readiness pages visually on-brand while making adjacent stats surfaces obvious.
 */
export function LearnerPerformanceWorkspaceNav({
  t,
  pathname,
  id = "learner-performance-workspace-nav",
}: {
  t: LearnerMarketingT;
  /** Current route path for `aria-current`, e.g. `/app/account/report-card` */
  pathname: string;
  id?: string;
}) {
  return (
    <nav
      id={id}
      aria-label={t("learner.account.nav.groupPerformance")}
      className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_22%,var(--semantic-surface))] p-3 sm:p-4"
      data-testid="learner-performance-workspace-nav"
    >
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
        {t("learner.account.nav.groupPerformance")}
      </p>
      <ul className="flex flex-wrap gap-2">
        {WORKSPACE_LINKS.map(({ href, labelKey }) => {
          const current = pathname === href || (href !== "/app" && pathname.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={current ? "page" : undefined}
                className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                  current
                    ? "border-[color-mix(in_srgb,var(--semantic-brand)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                    : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] hover:text-[var(--semantic-text-primary)]"
                }`}
              >
                {t(labelKey)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
