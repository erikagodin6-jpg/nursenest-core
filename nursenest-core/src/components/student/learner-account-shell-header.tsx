"use client";

import Link from "next/link";
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
      <Link
        href="/app"
        className="shrink-0 touch-manipulation rounded-full border border-border bg-card px-4 py-2 text-center text-sm font-semibold text-foreground hover:bg-muted/80 lg:self-end"
      >
        {t("learner.account.shell.backToDashboard")}
      </Link>
    </div>
  );
}
