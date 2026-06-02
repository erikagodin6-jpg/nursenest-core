import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { PlatformProof } from "@shared/lesson-stats";
import { NURSING_TIERS } from "@shared/platform-manifest";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Globe,
  Languages,
  Target,
} from "lucide-react";

function ProgressBar({ current, goal }: { current: number; goal: number }) {
  const { t } = useI18n();
  const pct = Math.min(100, Math.round((current / goal) * 100));
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-700"
        style={{ width: `${pct}%` }}
        data-testid="progress-bar-fill"
      />
    </div>
  );
}

function formatK(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

const TIER_COLORS: Record<string, { border: string; bg: string; accent: string }> = {
  rpn: { border: "border-emerald-200", bg: "bg-emerald-50", accent: "text-emerald-700" },
  rn: { border: "border-blue-200", bg: "bg-blue-50", accent: "text-blue-700" },
  np: { border: "border-violet-200", bg: "bg-violet-50", accent: "text-violet-700" },
};

export default function HeroNursingTiers() {
  const { data: proof } = useQuery<PlatformProof>({
    queryKey: ["/api/public/platform-proof"],
    staleTime: 15 * 60 * 1000,
  });

  const currentCounts: Record<string, number> = {
    rpn: proof?.rpnQuestions ?? 0,
    rn: proof?.rnQuestions ?? 0,
    np: proof?.npQuestions ?? 0,
  };

  return (
    <section
      className="bg-white"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-nursing-tiers"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            className="font-bold text-gray-900 mb-2"
            style={{ fontSize: "var(--text-section)" }}
            data-testid="text-nursing-tiers-heading"
          >
            Nursing Exam Question Banks
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base lg:text-lg">
            Comprehensive question banks for every nursing tier — from practical nursing through nurse practitioner certification.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(NURSING_TIERS).map(([key, tier]) => {
            const colors = TIER_COLORS[key] || TIER_COLORS.rn;
            const current = currentCounts[key] || 0;

            return (
              <div
                key={key}
                className={`rounded-2xl border ${colors.border} shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200`}
                data-testid={`tier-card-${key}`}
              >
                <div className={`${colors.bg} px-6 py-5`}>
                  <h3 className={`text-lg font-bold ${colors.accent}`}>{tier.label}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-extrabold text-gray-900">
                      {formatK(tier.goalQuestions)}+
                    </span>
                    <span className="text-sm text-gray-500">{t("components.heroNursingTiers.questionsGoal")}</span>
                  </div>
                  {current > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>{current.toLocaleString()} available</span>
                        <span>{Math.round((current / tier.goalQuestions) * 100)}%</span>
                      </div>
                      <ProgressBar current={current} goal={tier.goalQuestions} />
                    </div>
                  )}
                </div>

                <div className="px-6 py-5 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t("components.heroNursingTiers.majorExams")}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tier.exams.map((exam) => (
                        <span key={exam} className="inline-flex px-2 py-1 rounded-md bg-gray-50 border border-gray-100 text-xs font-medium text-gray-600">
                          {exam}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <ClipboardCheck className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <div className="text-xs text-gray-500">{t("components.heroNursingTiers.mockExams")}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <BookOpen className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <div className="text-xs text-gray-500">{t("components.heroNursingTiers.studyGuides")}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <Globe className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <div className="text-xs text-gray-500">{tier.countries.length} Countries</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <Languages className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <div className="text-xs text-gray-500">{t("components.heroNursingTiers.20Languages")}</div>
                    </div>
                  </div>

                  <Link
                    href={tier.route}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:brightness-110 transition-all no-underline"
                    data-testid={`button-tier-${key}`}
                  >
                    <Target className="w-4 h-4" />
                    Start {tier.shortLabel} Prep
                    <ArrowRight className="w-4 h-4" />
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
