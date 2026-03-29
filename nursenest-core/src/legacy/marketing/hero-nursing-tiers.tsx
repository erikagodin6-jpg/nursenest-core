"use client";

import Link from "next/link";
import { NURSING_TIERS } from "@shared/platform-manifest";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Globe,
  Languages,
  Target,
} from "lucide-react";

function ProgressBar({ current, goal }: { current: number; goal: number }) {
  const pct = Math.min(100, Math.round((current / goal) * 100));
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
      <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary/75 transition-all duration-700" style={{ width: `${pct}%` }} data-testid="progress-bar-fill" />
    </div>
  );
}

function formatK(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

/** All tiers use the active theme accent (no per-tier fixed hues). */
const TIER_SURFACE = {
  border: "border-primary/25",
  bg: "bg-primary/[0.08]",
  accent: "text-primary",
} as const;

export default function HeroNursingTiers() {
  const { t } = useMarketingI18n();
  const currentCounts: Record<string, number> = { rpn: 0, rn: 0, np: 0 };

  return (
    <section
      className="bg-white"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-nursing-tiers"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-2 font-bold text-[var(--theme-heading-text)]" style={{ fontSize: "var(--text-section)" }} data-testid="text-nursing-tiers-heading">
            Nursing Exam Question Banks
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-500 lg:text-lg">
            Comprehensive question banks for every nursing tier — from practical nursing through nurse practitioner certification.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {Object.entries(NURSING_TIERS).map(([key, tier]) => {
            const current = currentCounts[key] || 0;

            return (
              <div
                key={key}
                className={`overflow-hidden rounded-2xl border ${TIER_SURFACE.border} shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]`}
                data-testid={`tier-card-${key}`}
              >
                <div className={`${TIER_SURFACE.bg} px-6 py-5`}>
                  <h3 className={`text-lg font-bold ${TIER_SURFACE.accent}`}>{tier.label}</h3>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[var(--theme-heading-text)]">{formatK(tier.goalQuestions)}+</span>
                    <span className="text-sm text-gray-500">{t("components.heroNursingTiers.questionsGoal")}</span>
                  </div>
                  {current > 0 && (
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                        <span>{current.toLocaleString()} available</span>
                        <span>{Math.round((current / tier.goalQuestions) * 100)}%</span>
                      </div>
                      <ProgressBar current={current} goal={tier.goalQuestions} />
                    </div>
                  )}
                </div>

                <div className="space-y-4 px-6 py-5">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">{t("components.heroNursingTiers.majorExams")}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tier.exams.map((exam) => (
                        <span key={exam} className="inline-flex rounded-md border border-gray-100 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600">
                          {exam}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-lg bg-gray-50 p-2.5">
                      <ClipboardCheck className="mx-auto mb-1 h-4 w-4 text-gray-400" />
                      <div className="text-xs text-gray-500">{t("components.heroNursingTiers.mockExams")}</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-2.5">
                      <BookOpen className="mx-auto mb-1 h-4 w-4 text-gray-400" />
                      <div className="text-xs text-gray-500">{t("components.heroNursingTiers.studyGuides")}</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-2.5">
                      <Globe className="mx-auto mb-1 h-4 w-4 text-gray-400" />
                      <div className="text-xs text-gray-500">{tier.countries.length} Countries</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-2.5">
                      <Languages className="mx-auto mb-1 h-4 w-4 text-gray-400" />
                      <div className="text-xs text-gray-500">{t("components.heroNursingTiers.20Languages")}</div>
                    </div>
                  </div>

                  <Link
                    href={mapLegacyMarketingHref(tier.route)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white no-underline transition-all hover:brightness-110"
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
