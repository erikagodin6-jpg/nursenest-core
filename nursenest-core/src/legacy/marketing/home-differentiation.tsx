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
  {
    icon: Brain,
    title: "Clinical Reasoning Engine",
    description:
      "Every question builds clinical judgment — not rote memorization. Rationales explain the reasoning behind each answer so you learn to think like a clinician.",
  },
  {
    icon: Target,
    title: "Adaptive Difficulty",
    description:
      "Our CAT-style practice engine mirrors real licensure exams. Questions adjust to your performance in real time, targeting weak areas for maximum efficiency.",
  },
  {
    icon: Layers,
    title: "Integrated Study System",
    description:
      "Questions, flashcards, lessons, mock exams, and analytics in one platform. No juggling multiple apps or paying for separate tools.",
  },
  {
    icon: Users,
    title: "Multi-Discipline Coverage",
    description:
      "Purpose-built content for RPN/LPN, RN, NP, and allied health professions — not generic content repurposed across exams.",
  },
  {
    icon: BarChart3,
    title: "Readiness Analytics",
    description:
      "Real-time performance tracking with domain-level insights, percentile comparisons, and targeted study recommendations.",
  },
  {
    icon: RefreshCw,
    title: "Spaced Repetition Built In",
    description:
      "Smart flashcard scheduling surfaces weak concepts at optimal intervals. Retention rates improve without extra effort.",
  },
];

function WhyNurseNestGrid({ headline, subtitle, context = "general" }: WhyNurseNestGridProps) {
  const { t } = useMarketingI18n();
  const defaultHeadline =
    context === "np"
      ? "Why NurseNest for Nurse Practitioner Exam Prep"
      : context === "allied"
        ? "Why NurseNest for Allied Health Exam Prep"
        : context === "certification"
          ? "Why NurseNest for Certification Exam Prep"
          : "Why NurseNest Works Better";

  const defaultSubtitle =
    "NurseNest is a clinical learning system — not a study app. Every feature is designed to build the clinical reasoning skills tested on modern healthcare exams.";

  return (
    <section
      className="border-t border-gray-100"
      style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
      data-testid="section-why-nursenest-grid"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5 shadow-[var(--shadow-card)]">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {t("components.competitiveDifferentiation.clinicalLearningSystem")}
            </span>
          </div>
          <h2 className="mb-3 font-bold text-[var(--theme-heading-text)]" style={{ fontSize: "var(--text-section)" }} data-testid="text-why-grid-heading">
            {headline || defaultHeadline}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-500 lg:text-lg" data-testid="text-why-grid-subtitle">
            {subtitle || defaultSubtitle}
          </p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GRID_ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-100/80 bg-white p-7 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
              data-testid={`card-why-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="nn-theme-gradient-br mb-4 flex h-11 w-11 items-center justify-center rounded-xl shadow-sm">
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-2 font-bold text-[var(--theme-heading-text)]" style={{ fontSize: "var(--text-card-title)" }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">{item.description}</p>
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

const COMPARISON_ROWS = [
  {
    feature: "Question Bank Size",
    nursenest: "Thousands of exam-style questions across all tiers and disciplines",
    typical: "Limited question banks, often under 2,000 questions",
  },
  {
    feature: "Flashcards Included",
    nursenest: "Thousands of flashcards organized into spaced-repetition decks",
    typical: "Flashcards sold separately or unavailable",
  },
  {
    feature: "Multi-Discipline Coverage",
    nursenest: "Dedicated content for RPN, RN, NP, and allied health professions",
    typical: "Single-exam focus with no expansion path",
  },
  {
    feature: "Adaptive Mock Exams",
    nursenest: "CAT-adaptive exams that mirror real licensure testing",
    typical: "Static practice tests with fixed difficulty",
  },
  {
    feature: "Clinical Lessons",
    nursenest: "In-depth lessons with pre/post tests and detailed rationales",
    typical: "No integrated lesson content",
  },
  {
    feature: "Readiness Analytics",
    nursenest: "Domain-level insights with percentile tracking and study recommendations",
    typical: "Basic score tracking without targeted feedback",
  },
  {
    feature: "Study Plan Generator",
    nursenest: "Personalized weekly plans based on weak areas and exam date",
    typical: "Generic study schedules not tied to performance",
  },
  {
    feature: "Clinical Judgment Training",
    nursenest: "NGN-style case studies, bowtie items, and clinical reasoning exercises",
    typical: "Traditional MCQ-only format",
  },
];

function ComparisonTable({ headline, subtitle }: ComparisonTableProps) {
  const { t } = useMarketingI18n();
  return (
    <section
      className="border-t border-gray-100"
      style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
      data-testid="section-comparison-table"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="nn-accent-soft-ring mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 shadow-[var(--shadow-card)]">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {t("components.competitiveDifferentiation.platformComparison")}
            </span>
          </div>
          <h2 className="mb-3 font-bold text-[var(--theme-heading-text)]" style={{ fontSize: "var(--text-section)" }} data-testid="text-comparison-table-heading">
            {headline || "How NurseNest Compares"}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-500 lg:text-lg" data-testid="text-comparison-table-subtitle">
            {subtitle || "See how a modern clinical learning system stacks up against typical study platforms."}
          </p>
        </div>

        <div className="hidden overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[var(--shadow-card)] md:block">
          <table className="w-full text-sm" data-testid="table-platform-comparison">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="w-[200px] px-6 py-4 text-left font-semibold text-gray-700">{t("components.competitiveDifferentiation.feature")}</th>
                <th className="bg-primary/5 px-6 py-4 text-left font-bold text-primary">NurseNest</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-500">{t("components.competitiveDifferentiation.typicalPlatforms")}</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 last:border-0" data-testid={`row-comparison-${idx}`}>
                  <td className="px-6 py-4 font-semibold text-gray-800">{row.feature}</td>
                  <td className="bg-primary/[0.02] px-6 py-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-gray-700">{row.nursenest}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" />
                      <span className="text-gray-500">{row.typical}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 md:hidden">
          {COMPARISON_ROWS.map((row, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-[var(--shadow-card)]"
              data-testid={`card-comparison-mobile-${idx}`}
            >
              <h4 className="mb-3 text-sm font-bold text-[var(--theme-heading-text)]">{row.feature}</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <span className="mb-0.5 block text-xs font-semibold text-primary">NurseNest</span>
                    <span className="text-sm text-gray-700">{row.nursenest}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" />
                  <div>
                    <span className="mb-0.5 block text-xs font-semibold text-gray-400">{t("components.competitiveDifferentiation.typicalPlatforms2")}</span>
                    <span className="text-sm text-gray-500">{row.typical}</span>
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
