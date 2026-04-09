import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Brain,
  ClipboardList,
  Crosshair,
  GraduationCap,
  LayoutList,
  ListTodo,
  PlayCircle,
  Zap,
  Target,
} from "lucide-react";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

export type QuickActionGuided = {
  continueLesson?: { title: string; href: string } | null;
  hasWeakAreas?: boolean;
};

const ACTIONS: {
  href: string;
  labelKey: string;
  icon: typeof Crosshair;
  tone: "brand" | "success" | "info" | "warning" | "danger";
}[] = [
  { href: "/app/practice-tests", labelKey: "learner.profile.quickLinks.catPractice", icon: Crosshair, tone: "warning" },
  { href: "/app/exams", labelKey: "nav.practiceExams", icon: GraduationCap, tone: "brand" },
  { href: "/app/questions", labelKey: "nav.questionBank", icon: LayoutList, tone: "info" },
  { href: "/app/lessons", labelKey: "learner.profile.quickLinks.lessons", icon: BookOpen, tone: "success" },
  { href: "/app/flashcards", labelKey: "learner.profile.quickLinks.flashcards", icon: Brain, tone: "success" },
  { href: "/app/study-plan", labelKey: "learner.profile.quickLinks.studyPlanner", icon: ListTodo, tone: "info" },
  { href: "/app/account/report-card", labelKey: "learner.account.nav.reportCard", icon: BarChart3, tone: "brand" },
  { href: "/app/account/readiness", labelKey: "learner.account.nav.readiness", icon: Target, tone: "success" },
  { href: "/app/account/review-queue", labelKey: "learner.account.nav.reviewQueue", icon: ClipboardList, tone: "warning" },
];

const TONE: Record<(typeof ACTIONS)[number]["tone"], string> = {
  brand:
    "border-[color-mix(in_srgb,var(--semantic-brand)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_16%,var(--semantic-surface))]",
  success:
    "border-[color-mix(in_srgb,var(--semantic-success)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] text-[var(--semantic-success)] hover:bg-[color-mix(in_srgb,var(--semantic-success)_16%,var(--semantic-surface))]",
  info: "border-[color-mix(in_srgb,var(--semantic-info)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] text-[var(--semantic-info)] hover:bg-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-surface))]",
  warning:
    "border-[color-mix(in_srgb,var(--semantic-warning)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] text-[var(--semantic-warning-contrast)] hover:bg-[color-mix(in_srgb,var(--semantic-warning)_14%,var(--semantic-surface))]",
  danger:
    "border-[color-mix(in_srgb,var(--semantic-danger)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))] text-[var(--semantic-danger)] hover:bg-[color-mix(in_srgb,var(--semantic-danger)_14%,var(--semantic-surface))]",
};

export function QuickActionPanel({
  t,
  id = "quick-actions",
  guided,
}: {
  t: LearnerMarketingT;
  id?: string;
  guided?: QuickActionGuided | null;
}) {
  return (
    <section
      className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_04%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)] sm:p-5"
      aria-labelledby={`${id}-heading`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Zap className="h-4 w-4 shrink-0 text-[var(--semantic-chart-4)]" aria-hidden strokeWidth={2} />
        <h2 id={`${id}-heading`} className="text-sm font-semibold text-[var(--semantic-text-primary)]">
          {t("learner.dashboard.quickActions.title")}
        </h2>
      </div>
      <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{t("learner.dashboard.quickActions.subtitle")}</p>
      <ul className="mt-4 flex list-none flex-wrap gap-2">
        {guided?.continueLesson?.href ? (
          <li key="guided-continue">
            <Link
              href={guided.continueLesson.href}
              aria-label={`${t("learner.dashboard.quickActions.continueLearningShort")}: ${guided.continueLesson.title}`}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold shadow-sm transition-colors ${TONE.success}`}
            >
              <PlayCircle className="h-3.5 w-3.5 shrink-0 opacity-90" strokeWidth={2} aria-hidden />
              {t("learner.dashboard.quickActions.continueLearningShort")}
            </Link>
          </li>
        ) : null}
        {guided?.hasWeakAreas ? (
          <li key="guided-weak">
            <Link
              href="/app#dashboard-weak-areas"
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold shadow-sm transition-colors ${TONE.warning}`}
            >
              <Crosshair className="h-3.5 w-3.5 shrink-0 opacity-90" strokeWidth={2} aria-hidden />
              {t("learner.dashboard.quickActions.reviewWeakAreas")}
            </Link>
          </li>
        ) : null}
        <li key="guided-new-test">
          <Link
            href="/app/practice-tests/start"
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold shadow-sm transition-colors ${TONE.brand}`}
          >
            <GraduationCap className="h-3.5 w-3.5 shrink-0 opacity-90" strokeWidth={2} aria-hidden />
            {t("learner.dashboard.quickActions.startNewTest")}
          </Link>
        </li>
        {ACTIONS.map(({ href, labelKey, icon: Icon, tone }) => (
          <li key={href}>
            <Link
              href={href}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold shadow-sm transition-colors ${TONE[tone]}`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0 opacity-90" strokeWidth={2} aria-hidden />
              {t(labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
