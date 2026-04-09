"use client";

import { Check, Shield } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";

type Props = {
  questionCount: number;
};

function formatQ(n: number, locale: string): string {
  if (n <= 0) return "";
  return n.toLocaleString(locale.replace(/_/g, "-"));
}

/**
 * Trust band: scope-aligned stats, honest proof line, vs-generic comparison, then testimonials follow in page order.
 */
export function HomeTrustProofSection({ questionCount }: Props) {
  const { t, locale } = useMarketingI18n();
  const q = formatQ(questionCount, locale);

  const compareKeys = ["one", "two", "three"] as const;

  return (
    <section
      className="nn-section-soft border-b border-[var(--border-subtle)] py-12 md:py-16"
      aria-labelledby="home-trust-proof-heading"
      data-testid="section-trust-proof"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <h2 id="home-trust-proof-heading" className="nn-marketing-h2 text-balance">
            {t("home.conversion.proof.title")}
          </h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-xl text-pretty text-[var(--theme-muted-text)]">
            {t("home.conversion.proof.sub")}
          </p>
        </header>

        <div className="mx-auto mb-10 max-w-3xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--nn-presentation-ribbon)] px-5 py-5 sm:px-8 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <div>
              <p className="nn-marketing-h3 tabular-nums text-[var(--theme-heading-text)]">{q || "—"}</p>
              <p className="nn-marketing-caption mt-1 text-[var(--theme-muted-text)]">{t("home.conversion.proof.statQuestionsLabel")}</p>
            </div>
            <p className="nn-marketing-body-sm max-w-md flex-1 text-pretty text-[var(--theme-body-text)]">
              {q ? t("home.conversion.proof.statLine", { count: q }) : t("home.conversion.proof.statFallback")}
            </p>
          </div>
          <p className="nn-marketing-body-sm mt-4 flex items-start gap-2 border-t border-[var(--border-subtle)] pt-4 text-[var(--theme-muted-text)]">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            {t("home.conversion.proof.passRatesHonest")}
          </p>
        </div>

        <div className="mb-10">
          <h3 className="nn-marketing-h3 mb-4 text-center text-[var(--theme-heading-text)]">{t("home.conversion.proof.compareTitle")}</h3>
          <ul className="mx-auto grid max-w-3xl gap-3">
            {compareKeys.map((k) => (
              <li
                key={k}
                className="flex gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] px-4 py-3 text-left"
              >
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                <span className="nn-marketing-body-sm text-[var(--theme-body-text)]">{t(`home.conversion.proof.compare${k}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
