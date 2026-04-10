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
} from "lucide-react";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

export type QuickActionGuided = {
  continueLesson?: { title: string; href: string } | null;
  hasWeakAreas?: boolean;
  catStartHref?: string | null;
};

/** Secondary navigation — direct links to key app areas. */
const SECONDARY_ACTIONS: {
  href: string;
  labelKey: string;
  icon: typeof BookOpen;
  tone: "brand" | "success" | "info" | "warning";
}[] = [
  { href: "/app/questions", labelKey: "nav.questionBank", icon: LayoutList, tone: "info" },
  { href: "/app/lessons", labelKey: "learner.profile.quickLinks.lessons", icon: BookOpen, tone: "success" },
  { href: "/app/flashcards", labelKey: "learner.profile.quickLinks.flashcards", icon: Brain, tone: "success" },
  { href: "/app/study-plan", labelKey: "learner.profile.quickLinks.studyPlanner", icon: ListTodo, tone: "info" },
  { href: "/app/account/report-card", labelKey: "learner.account.nav.reportCard", icon: BarChart3, tone: "brand" },
  { href: "/app/account/review-queue", labelKey: "learner.account.nav.reviewQueue", icon: ClipboardList, tone: "warning" },
];

const PILL_TONE: Record<(typeof SECONDARY_ACTIONS)[number]["tone"], string> = {
  brand:
    "border-[color-mix(in_srgb,var(--semantic-brand)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_16%,var(--semantic-surface))]",
  success:
    "border-[color-mix(in_srgb,var(--semantic-success)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] text-[var(--semantic-success)] hover:bg-[color-mix(in_srgb,var(--semantic-success)_16%,var(--semantic-surface))]",
  info:
    "border-[color-mix(in_srgb,var(--semantic-info)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] text-[var(--semantic-info)] hover:bg-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-surface))]",
  warning:
    "border-[color-mix(in_srgb,var(--semantic-warning)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] text-[var(--semantic-warning-contrast)] hover:bg-[color-mix(in_srgb,var(--semantic-warning)_14%,var(--semantic-surface))]",
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
  const resumeHref = guided?.continueLesson?.href ?? "/app/lessons";
  const resumeTitle = guided?.continueLesson?.title ?? null;
  const weakHref = guided?.hasWeakAreas ? "#dashboard-weak-areas" : "/app/questions";
  const catStartHref = guided?.catStartHref?.trim() || "/app/practice-tests/start";

  return (
    <section className="nn-surface-bubble rounded-2xl p-4 shadow-[var(--shadow-card)] sm:p-6" aria-labelledby={`${id}-heading`}>
      <div className="flex flex-wrap items-center gap-2">
        <Zap className="h-4 w-4 shrink-0 text-[var(--semantic-chart-4)]" aria-hidden strokeWidth={2} />
        <h2 id={`${id}-heading`} className="text-sm font-semibold text-[var(--semantic-text-primary)]">
          {t("learner.dashboard.quickActions.title")}
        </h2>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
        {t("learner.dashboard.quickActions.subtitle")}
      </p>

      {/* Primary action cards — 3 guided, visually distinct */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {/* Card 1: Resume / Start Lessons */}
        <Link
          href={resumeHref}
          className="group flex flex-col gap-1.5 rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] px-4 py-3.5 transition-[transform,background-color,box-shadow] duration-200 hover:bg-[color-mix(in_srgb,var(--semantic-success)_15%,var(--semantic-surface))] hover:shadow-[var(--semantic-shadow-soft)] motion-safe:hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-2">
            <PlayCircle
              className="h-4 w-4 shrink-0 text-[var(--semantic-success)] transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={2}
              aria-hidden
            />
            <span className="text-sm font-semibold text-[var(--semantic-success)]">
              {t("learner.dashboard.quickActions.continueLearningShort")}
            </span>
          </div>
          <p className="text-[11px] leading-snug text-[var(--semantic-text-secondary)] [overflow-wrap:anywhere]">
            {resumeTitle
              ? t("learner.dashboard.student.quick.resumeHint", { title: resumeTitle })
              : t("learner.dashboard.student.quick.reviewLessonsSub")}
          </p>
        </Link>

        {/* Card 2: Start CAT */}
        <Link
          href={catStartHref}
          className="group flex flex-col gap-1.5 rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] px-4 py-3.5 transition-[transform,background-color,box-shadow] duration-200 hover:bg-[color-mix(in_srgb,var(--semantic-brand)_16%,var(--semantic-surface))] hover:shadow-[var(--semantic-shadow-soft)] motion-safe:hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-2">
            <GraduationCap
              className="h-4 w-4 shrink-0 text-[var(--semantic-brand)] transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={2}
              aria-hidden
            />
            <span className="text-sm font-semibold text-[var(--semantic-brand)]">
              {t("learner.dashboard.student.quick.cat")}
            </span>
          </div>
          <p className="text-[11px] leading-snug text-[var(--semantic-text-secondary)]">
            {t("learner.dashboard.student.quick.catSub")}
          </p>
          <p className="text-[10px] leading-snug text-[var(--semantic-text-secondary)]">
            If you have more than one exam track, you’ll pick the pathway on the next screen.
          </p>
        </Link>

        {/* Card 3: Weak topics (when available) or Question bank */}
        <Link
          href={weakHref}
          className={`group flex flex-col gap-1.5 rounded-xl border px-4 py-3.5 transition-[transform,background-color,box-shadow] duration-200 hover:shadow-[var(--semantic-shadow-soft)] motion-safe:hover:-translate-y-0.5 ${
            guided?.hasWeakAreas
              ? "border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] hover:bg-[color-mix(in_srgb,var(--semantic-warning)_14%,var(--semantic-surface))]"
              : "border-[color-mix(in_srgb,var(--semantic-info)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] hover:bg-[color-mix(in_srgb,var(--semantic-info)_15%,var(--semantic-surface))]"
          }`}
        >
          <div className="flex items-center gap-2">
            {guided?.hasWeakAreas ? (
              <Crosshair
                className="h-4 w-4 shrink-0 text-[var(--semantic-warning-contrast)] transition-transform duration-200 group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden
              />
            ) : (
              <LayoutList
                className="h-4 w-4 shrink-0 text-[var(--semantic-info)] transition-transform duration-200 group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden
              />
            )}
            <span
              className={`text-sm font-semibold ${
                guided?.hasWeakAreas
                  ? "text-[var(--semantic-warning-contrast)]"
                  : "text-[var(--semantic-info)]"
              }`}
            >
              {guided?.hasWeakAreas
                ? t("learner.dashboard.quickActions.reviewWeakAreas")
                : t("learner.dashboard.student.quick.continueQuestions")}
            </span>
          </div>
          <p className="text-[11px] leading-snug text-[var(--semantic-text-secondary)]">
            {guided?.hasWeakAreas
              ? t("learner.dashboard.insight.weakHint")
              : t("learner.dashboard.student.quick.continueQuestionsSub")}
          </p>
        </Link>
      </div>

      {/* Secondary navigation pills */}
      <ul className="mt-4 flex list-none flex-wrap gap-2.5 border-t border-[var(--semantic-border-soft)] pt-3">
        {SECONDARY_ACTIONS.map(({ href, labelKey, icon: Icon, tone }) => (
          <li key={href}>
            <Link
              href={href}
              className={`nn-premium-action-chip group inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold ${PILL_TONE[tone]}`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0 opacity-90 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} aria-hidden />
              {t(labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
