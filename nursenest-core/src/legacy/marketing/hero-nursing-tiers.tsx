"use client";

import Link from "next/link";
import { NURSING_TIERS } from "@shared/platform-manifest";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import { ArrowRight, Target } from "lucide-react";
import { MARKETING_PRIMARY_CTA_CLASS } from "@/lib/theme/marketing-hero-pattern";

function ProgressBar({ current, goal }: { current: number; goal: number }) {
  const pct = Math.min(100, Math.round((current / goal) * 100));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-inset)]">
      <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${pct}%` }} data-testid="progress-bar-fill" />
    </div>
  );
}

function formatK(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

export default function HeroNursingTiers() {
  const { t } = useMarketingI18n();
  const currentCounts: Record<string, number> = { rpn: 0, rn: 0, np: 0 };

  return (
    <section
      className="border-t border-[var(--divider)] bg-[var(--bg-page)]"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-nursing-tiers"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2
            className="nn-marketing-h2"
            data-testid="text-nursing-tiers-heading"
          >
            Nursing Exam Question Banks
          </h2>
          <p className="nn-marketing-lead text-[var(--theme-muted-text)]">
            Full question banks for every nursing tier, from practical nursing through nurse practitioner certification.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {Object.entries(NURSING_TIERS).map(([key, tier]) => {
            const current = currentCounts[key] || 0;

            return (
              <div
                key={key}
                className="nn-marketing-card overflow-hidden transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]"
                data-testid={`tier-card-${key}`}
              >
                <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-inset)] px-6 py-5">
                  <h3 className="nn-marketing-h3 text-[var(--theme-primary)]">{tier.label}</h3>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-bold tabular-nums text-[var(--theme-heading-text)]">{formatK(tier.goalQuestions)}+</span>
                    <span className="text-sm text-[var(--theme-muted-text)]">{t("components.heroNursingTiers.questionsGoal")}</span>
                  </div>
                  {current > 0 && (
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-xs text-[var(--theme-muted-text)]">
                        <span>{current.toLocaleString()} available</span>
                        <span>{Math.round((current / tier.goalQuestions) * 100)}%</span>
                      </div>
                      <ProgressBar current={current} goal={tier.goalQuestions} />
                    </div>
                  )}
                </div>

                <div className="space-y-4 px-6 py-5">
                  <div>
                    <p className="nn-marketing-label mb-2">{t("components.heroNursingTiers.majorExams")}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tier.exams.map((exam) => (
                        <span
                          key={exam}
                          className="inline-flex rounded-md border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2 py-1 text-xs font-medium text-[var(--theme-body-text)]"
                        >
                          {exam}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ul className="space-y-1 text-xs leading-relaxed text-[var(--theme-muted-text)]">
                    <li>{t("components.heroNursingTiers.mockExams")}</li>
                    <li>{t("components.heroNursingTiers.studyGuides")}</li>
                    <li>
                      {tier.countries.length} {tier.countries.length === 1 ? "country" : "countries"}
                    </li>
                    <li>{t("components.heroNursingTiers.20Languages")}</li>
                  </ul>

                  <Link
                    href={mapLegacyMarketingHref(tier.route)}
                    className={`${MARKETING_PRIMARY_CTA_CLASS} w-full gap-2 no-underline`}
                    data-testid={`button-tier-${key}`}
                  >
                    <Target className="h-4 w-4" />
                    Start {tier.shortLabel} Prep
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
