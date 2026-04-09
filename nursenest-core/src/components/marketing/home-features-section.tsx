"use client";

import { LayoutDashboard, MonitorSmartphone, Sparkles, Stethoscope } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";

const ICONS = [Sparkles, Stethoscope, LayoutDashboard, MonitorSmartphone] as const;
const IDS = ["adaptive", "rationales", "readiness", "mobile"] as const;

/**
 * Four-column feature grid: adaptive exams, rationales, readiness, mobile-friendly.
 */
export function HomeFeaturesSection() {
  const { t } = useMarketingI18n();

  return (
    <section
      className="nn-section-soft border-b border-[var(--border-subtle)] py-12 md:py-16"
      aria-labelledby="home-features-heading"
      data-testid="section-features"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <h2 id="home-features-heading" className="nn-marketing-h2 text-balance">
            {t("home.conversion.features.title")}
          </h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-xl text-pretty text-[var(--theme-muted-text)]">
            {t("home.conversion.features.sub")}
          </p>
        </header>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {IDS.map((id, i) => {
            const Icon = ICONS[i]!;
            return (
              <li key={id} className="nn-card-soft p-5">
                <div className="nn-accent-icon-wrap mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Icon className="nn-accent-icon h-5 w-5" aria-hidden />
                </div>
                <h3 className="nn-marketing-h4 text-[var(--theme-heading-text)]">{t(`home.conversion.features.${id}Title`)}</h3>
                <p className="nn-marketing-body-sm mt-2 text-pretty text-[var(--theme-muted-text)]">
                  {t(`home.conversion.features.${id}Body`)}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
