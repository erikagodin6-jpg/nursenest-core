"use client";

import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { useMarketingI18n } from "@/lib/marketing-i18n";

export function LearnerAccountShellHeader() {
  const { t } = useMarketingI18n();

  return (
    <div className="nn-product-surface-accent flex min-w-0 flex-col gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_16%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_16%,var(--semantic-surface))] px-4 py-5 shadow-[var(--semantic-shadow-soft)] sm:px-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[color-mix(in_srgb,var(--semantic-chart-3)_72%,var(--semantic-text-muted))]">
          {t("learner.account.shell.kicker")}
        </p>
        <h2 className="text-lg font-bold tracking-tight text-[var(--semantic-text-primary)]">{t("learner.account.shell.title")}</h2>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("learner.account.shell.subtitle")}</p>
      </div>
      <div className="flex min-w-0 shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end lg:self-end">
        <Link
          href="/app"
          className="touch-manipulation rounded-full border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-brand))] bg-[var(--semantic-surface)] px-4 py-2 text-center text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_55%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)]"
        >
          {t("learner.account.shell.backToDashboard")}
        </Link>
        <SignOutButton className="touch-manipulation rounded-full border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-text-muted))] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_42%,var(--semantic-surface))] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_62%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_30%,transparent)]" />
      </div>
    </div>
  );
}
