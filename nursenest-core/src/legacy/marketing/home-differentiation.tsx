"use client";

import {
  CheckCircle2,
  XCircle,
  Shield,
  Brain,
  Target,
  Layers,
  Users,
  BarChart3,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";

interface WhyNurseNestGridProps {
  headline?: string;
  subtitle?: string;
  context?: "general" | "nursing" | "np" | "allied" | "certification";
}

const GRID_ITEMS = [
  { id: "clinicalReasoning", icon: Brain },
  { id: "adaptiveDifficulty", icon: Target },
  { id: "integratedStudy", icon: Layers },
  { id: "multiDiscipline", icon: Users },
  { id: "readinessAnalytics", icon: BarChart3 },
  { id: "spacedRepetition", icon: RefreshCw },
] as const;

function WhyNurseNestGrid({ headline, subtitle, context = "general" }: WhyNurseNestGridProps) {
  const { t } = useMarketingI18n();
  const defaultHeadline =
    context === "np"
      ? t("components.homeDifferentiation.defaultHeadline.np")
      : context === "allied"
        ? t("components.homeDifferentiation.defaultHeadline.allied")
        : context === "certification"
          ? t("components.homeDifferentiation.defaultHeadline.certification")
          : t("components.homeDifferentiation.defaultHeadline.general");

  const defaultSubtitle = t("components.homeDifferentiation.defaultSubtitle");

  return (
    <section className="border-t border-gray-100 py-16 md:py-24" data-testid="section-why-nursenest-grid">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl md:mx-0 md:max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5 shadow-[var(--shadow-card)]">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="nn-marketing-label nn-marketing-label--accent">
              {t("components.competitiveDifferentiation.clinicalLearningSystem")}
            </span>
          </div>
          <h2 className="mb-4 nn-marketing-h2" data-testid="text-why-grid-heading">
            {headline || defaultHeadline}
          </h2>
          <p className="nn-marketing-body leading-relaxed text-muted-foreground" data-testid="text-why-grid-subtitle">
            {subtitle || defaultSubtitle}
          </p>
        </div>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {GRID_ITEMS.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-100/80 bg-white p-7 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              data-testid={`card-why-${item.id}`}
            >
              <div className="nn-theme-gradient-br mb-4 flex h-11 w-11 items-center justify-center rounded-xl shadow-sm">
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-2 nn-marketing-h3">{t(`components.homeDifferentiation.grid.${item.id}.title`)}</h3>
              <p className="nn-marketing-body-sm leading-relaxed text-gray-500">{t(`components.homeDifferentiation.grid.${item.id}.description`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface ComparisonTableProps {
  headline?: string;
  subtitle?: string;
}

const COMPARISON_ROW_IDS = [
  "questionBankSize",
  "flashcardsIncluded",
  "multiDisciplineCoverage",
  "adaptiveMockExams",
  "clinicalLessons",
  "readinessAnalytics",
  "studyPlanGenerator",
  "clinicalJudgmentTraining",
] as const;

function ComparisonTable({ headline, subtitle }: ComparisonTableProps) {
  const { t } = useMarketingI18n();
  const defaultHeadline = t("components.homeDifferentiation.comparison.defaultHeadline");
  const defaultSubtitle = t("components.homeDifferentiation.comparison.defaultSubtitle");

  return (
    <section
      className="border-t border-gray-100"
      style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
      data-testid="section-comparison-table"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl text-left md:mx-0">
          <div className="nn-accent-soft-ring mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 shadow-[var(--shadow-card)]">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="nn-marketing-label nn-marketing-label--accent">
              {t("components.competitiveDifferentiation.platformComparison")}
            </span>
          </div>
          <h2 className="mb-3 nn-marketing-h2" data-testid="text-comparison-table-heading">
            {headline || defaultHeadline}
          </h2>
          <p className="max-w-2xl nn-marketing-body text-gray-500" data-testid="text-comparison-table-subtitle">
            {subtitle || defaultSubtitle}
          </p>
        </div>

        <div className="hidden overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[var(--shadow-card)] md:block">
          <table className="w-full text-sm" data-testid="table-platform-comparison">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="min-w-[220px] px-6 py-4 text-left font-semibold text-gray-700">
                  {t("components.competitiveDifferentiation.feature")}
                </th>
                <th className="bg-primary/5 px-6 py-4 text-left nn-marketing-body-sm font-semibold text-primary">NurseNest</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-500">
                  {t("components.competitiveDifferentiation.typicalPlatforms")}
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROW_IDS.map((rowId, idx) => (
                <tr key={rowId} className="border-b border-gray-100 last:border-0" data-testid={`row-comparison-${idx}`}>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {t(`components.homeDifferentiation.comparison.${rowId}.feature`)}
                  </td>
                  <td className="bg-primary/[0.02] px-6 py-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-gray-700">{t(`components.homeDifferentiation.comparison.${rowId}.nursenest`)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" />
                      <span className="text-gray-500">{t(`components.homeDifferentiation.comparison.${rowId}.typical`)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 md:hidden">
          {COMPARISON_ROW_IDS.map((rowId, idx) => (
            <div
              key={rowId}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-[var(--shadow-card)]"
              data-testid={`card-comparison-mobile-${idx}`}
            >
              <h4 className="mb-3 nn-marketing-h4">{t(`components.homeDifferentiation.comparison.${rowId}.feature`)}</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <span className="mb-0.5 block text-xs font-semibold text-primary">NurseNest</span>
                    <span className="text-sm text-gray-700">{t(`components.homeDifferentiation.comparison.${rowId}.nursenest`)}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" />
                  <div>
                    <span className="mb-0.5 block text-xs font-semibold text-gray-400">
                      {t("components.competitiveDifferentiation.typicalPlatforms2")}
                    </span>
                    <span className="text-sm text-gray-500">{t(`components.homeDifferentiation.comparison.${rowId}.typical`)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomeDifferentiation() {
  return (
    <>
      <WhyNurseNestGrid />
      <ComparisonTable />
    </>
  );
}
