"use client";

import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { useMarketingI18n } from "@/lib/marketing-i18n";

export function LearnerAccountShellHeader() {
  const { t } = useMarketingI18n();

  return (
    <div className="flex flex-col gap-3 border-b border-border/60 pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.account.shell.kicker")}</p>
        <h2 className="text-lg font-bold tracking-tight text-[var(--theme-heading-text)]">{t("learner.account.shell.title")}</h2>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">{t("learner.account.shell.subtitle")}</p>
      </div>
      <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end lg:self-end">
        <Link
          href="/app"
          className="touch-manipulation rounded-full border border-border bg-card px-4 py-2 text-center text-sm font-semibold text-foreground hover:bg-muted/80"
        >
          {t("learner.account.shell.backToDashboard")}
        </Link>
        <SignOutButton className="touch-manipulation rounded-full border border-border bg-muted/20 px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35" />
      </div>
    </div>
  );
}
