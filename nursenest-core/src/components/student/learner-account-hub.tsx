import Link from "next/link";
import { LEARNER_ACCOUNT_NAV_GROUPS } from "@/lib/learner/learner-account-nav-groups";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

/**
 * Account landing: legacy `/profile` was a single hub before deep pages.
 * This restores **hub-first IA** while deep analytics stay on `/app/account/overview`.
 */
export function LearnerAccountHub({ t }: { t: LearnerMarketingT }) {
  return (
    <div className="space-y-8" data-testid="learner-account-hub">
      <div className="nn-learner-page-hero space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          {t("learner.account.shell.kicker")}
        </p>
        <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)] md:text-3xl">{t("learner.account.shell.title")}</h1>
        <p className="max-w-2xl text-sm text-[var(--semantic-text-secondary)]">{t("learner.account.shell.subtitle")}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            href="/app"
            className="inline-flex items-center rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_55%,var(--semantic-surface))]"
          >
            {t("learner.account.shell.backToDashboard")}
          </Link>
          <Link
            href="/app/account/overview"
            className="inline-flex items-center rounded-lg border border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] px-3 py-2 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_16%,var(--semantic-surface))]"
          >
            {t("learner.account.menu.dashboardOverview")}
          </Link>
        </div>
      </div>

      <section className="space-y-2" aria-labelledby="account-hub-tools-heading">
        <h2 id="account-hub-tools-heading" className="text-base font-bold text-[var(--semantic-text-primary)]">
          {t("learner.account.toolsGrid.title")}
        </h2>
        <p className="max-w-2xl text-sm text-[var(--semantic-text-secondary)]">{t("learner.account.toolsGrid.subtitle")}</p>
      </section>

      <div className="space-y-8">
        {LEARNER_ACCOUNT_NAV_GROUPS.map((group) => (
          <section key={group.sectionKey} className="space-y-3" aria-label={t(group.sectionKey)}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">{t(group.sectionKey)}</h3>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex h-full flex-col rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-sm transition hover:border-[color-mix(in_srgb,var(--semantic-info)_25%,var(--semantic-border-soft))] hover:shadow-md"
                  >
                    <span className="text-sm font-semibold text-[var(--semantic-text-primary)]">{t(item.key)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
