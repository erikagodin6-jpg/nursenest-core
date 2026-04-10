"use client";

import { BookOpenCheck, ClipboardCheck, Layers } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";

type Props = {
  /** Default: homepage / pricing. Compact: tighter padding for exam hubs. */
  variant?: "default" | "compact";
  /** Exam pathway hubs: adds a scoped clinical line above the badges. */
  examHub?: boolean;
  /** Homepage hero: regional usage line + three credibility badges (adaptive CAT, exam-style, rationales). */
  homeHeroTrust?: boolean;
};

/**
 * Shared credibility band: built-for-nurses line plus exam-aligned and evidence-based signals.
 * Tone is clinical and explicit—no pass-rate hype or vague superlatives.
 */
export function MarketingTrustSignalsStrip({
  variant = "default",
  examHub = false,
  homeHeroTrust = false,
}: Props) {
  const { t } = useMarketingI18n();
  const pad = variant === "compact" ? "py-3 px-3 sm:px-4" : "py-4 px-4 sm:px-5";
  const gap = variant === "compact" ? "gap-2" : "gap-2.5";

  return (
    {/* nn-trust-surface: secondary-family tint that clearly differs from primary-tinted surfaces */}
    <div
      className={`nn-trust-surface rounded-xl ${pad}`}
      data-testid="marketing-trust-signals-strip"
    >
      {examHub ? (
        <p className="nn-marketing-body-sm mb-3 text-pretty text-[var(--theme-body-text)]">{t("components.trustSignals.examHubIntro")}</p>
      ) : null}
      {homeHeroTrust ? (
        <p className="nn-marketing-body-sm mb-3 text-pretty text-[var(--theme-body-text)]">{t("components.trustSignals.usageLine")}</p>
      ) : null}
      <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--accent-surface-b-text)]">
        {t("components.trustSignals.builtFor")}
      </p>
      <ul className={`mt-3 flex flex-wrap ${gap}`} aria-label={t("components.trustSignals.badgesAria")}>
        <li className="nn-accent-surface-a inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium">
          <ClipboardCheck className="h-4 w-4 shrink-0 text-[var(--text-accent)]" aria-hidden />
          <span className="text-[var(--theme-heading-text)]">{t("components.trustSignals.badgeExamAligned")}</span>
        </li>
        {homeHeroTrust ? (
          <li className="nn-accent-surface-a inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium">
            <Layers className="h-4 w-4 shrink-0 text-[var(--text-accent)]" aria-hidden />
            <span className="text-[var(--theme-heading-text)]">{t("components.trustSignals.badgeAdaptiveExamStyle")}</span>
          </li>
        ) : null}
        <li className="nn-accent-surface-a inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium">
          <BookOpenCheck className="h-4 w-4 shrink-0 text-[var(--text-accent)]" aria-hidden />
          <span className="text-[var(--theme-heading-text)]">{t("components.trustSignals.badgeEvidenceBased")}</span>
        </li>
      </ul>
    </div>
  );
}
