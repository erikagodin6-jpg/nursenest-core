"use client";

import { BookOpenCheck, ClipboardCheck } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";

type Props = {
  /** Default: homepage / pricing. Compact: tighter padding for exam hubs. */
  variant?: "default" | "compact";
  /** Exam pathway hubs: adds a scoped clinical line above the badges. */
  examHub?: boolean;
};

/**
 * Shared credibility band: built-for-nurses line plus exam-aligned and evidence-based signals.
 * Tone is clinical and explicit—no pass-rate hype or vague superlatives.
 */
export function MarketingTrustSignalsStrip({ variant = "default", examHub = false }: Props) {
  const { t } = useMarketingI18n();
  const pad = variant === "compact" ? "py-3 px-3 sm:px-4" : "py-4 px-4 sm:px-5";
  const gap = variant === "compact" ? "gap-2" : "gap-2.5";

  return (
    <div
      className={`rounded-xl border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--theme-primary)_4%,var(--theme-card-bg))] ${pad}`}
      data-testid="marketing-trust-signals-strip"
    >
      {examHub ? (
        <p className="nn-marketing-body-sm mb-3 text-pretty text-[var(--theme-body-text)]">{t("components.trustSignals.examHubIntro")}</p>
      ) : null}
      <p className="nn-marketing-caption font-medium uppercase tracking-wide text-[var(--theme-muted-text)]">
        {t("components.trustSignals.builtFor")}
      </p>
      <ul className={`mt-3 flex flex-wrap ${gap}`} aria-label={t("components.trustSignals.badgesAria")}>
        <li className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] px-3 py-1.5 text-sm text-[var(--theme-body-text)]">
          <ClipboardCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          {t("components.trustSignals.badgeExamAligned")}
        </li>
        <li className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] px-3 py-1.5 text-sm text-[var(--theme-body-text)]">
          <BookOpenCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          {t("components.trustSignals.badgeEvidenceBased")}
        </li>
      </ul>
    </div>
  );
}
