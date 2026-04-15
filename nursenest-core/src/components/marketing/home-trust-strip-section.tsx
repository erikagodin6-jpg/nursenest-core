"use client";

import { BadgeCheck, BarChart3, BookOpen, ClipboardCheck, Globe2, Layers3, Sparkles } from "lucide-react";
import { BrandTrustInline } from "@/components/brand/brand-trust-inline";
import { formatEyebrow, formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { FadeUp } from "@/lib/motion";

type Props = {
  lessonCount: number;
  questionCount: number;
  registeredLearners: number;
};

function formatCount(n: number, locale: string): string {
  if (n <= 0) return "";
  return n.toLocaleString(locale.replace(/_/g, "-"));
}

/**
 * Credibility + product-trait pills after the sample question (hero already shows live counts).
 */
export function HomeTrustStripSection({ lessonCount, questionCount, registeredLearners }: Props) {
  const { locale, t } = useMarketingI18n();
  const lessons = formatCount(lessonCount, locale);
  const questions = formatCount(questionCount, locale);
  const learners = formatCount(registeredLearners, locale);

  const pills = [
    { icon: BadgeCheck, label: t("pages.home.trustStrip.pill.examScoped"), iconClass: "text-[var(--semantic-success)]" },
    ...(questions
      ? [{ icon: BarChart3, label: t("pages.home.trustStrip.pill.questionsCount", { count: questions }), iconClass: "text-[var(--semantic-chart-1)]" }]
      : [{ icon: BarChart3, label: t("pages.home.trustStrip.pill.questionsLarge"), iconClass: "text-[var(--semantic-chart-1)]" }]),
    { icon: Layers3, label: t("pages.home.trustStrip.pill.adaptiveCat"), iconClass: "text-[var(--semantic-info)]" },
    { icon: ClipboardCheck, label: t("pages.home.trustStrip.pill.rationaleEveryItem"), iconClass: "text-[var(--semantic-brand)]" },
    {
      icon: BookOpen,
      label: lessons
        ? t("pages.home.trustStrip.pill.lessonsCount", { count: lessons })
        : t("pages.home.trustStrip.pill.lessonsLarge"),
      iconClass: "text-[var(--semantic-warning)]",
    },
    { icon: Sparkles, label: t("pages.home.trustStrip.updatedNclex"), iconClass: "text-[var(--semantic-chart-3)]" },
  ] as const;

  return (
    <section
      className="nn-section-enter border-b border-[var(--border-subtle)] py-10 sm:py-11"
      style={{ background: "var(--accent-surface-a)" }}
      aria-labelledby="home-trust-strip-heading"
      data-testid="section-home-trust-strip"
    >
      <div className="nn-section-shell">
        <FadeUp whenInView once viewMargin="-24px" className="mx-auto max-w-5xl">
        <div
          className="rounded-2xl border bg-[var(--bg-card)] px-5 py-6 shadow-[var(--shadow-elevated)] sm:px-7 sm:py-7"
          style={{ borderColor: "color-mix(in srgb, var(--theme-primary) 14%, var(--border-subtle))" }}
        >
          <div className="mb-4 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-4">
            <Globe2 className="nn-icon-md shrink-0 text-[var(--semantic-info)]" aria-hidden />
            <h2
              id="home-trust-strip-heading"
              className="nn-marketing-h2 max-w-[min(100%,42rem)] text-balance text-[var(--palette-heading)]"
            >
              {formatTitleCase(t("pages.home.trustStrip.heading"), locale)}
            </h2>
          </div>
          <p className="nn-marketing-body mx-auto mb-6 max-w-2xl text-center text-pretty leading-relaxed text-[var(--palette-text-muted)]">
            {formatSentenceCase(t("pages.home.trustStrip.subheading"), locale)}
          </p>
          <BrandTrustInline variant="prep" className="mb-5 justify-center text-center" />
          {learners ? (
            <p className="nn-marketing-caption mb-5 text-center text-[var(--palette-text-muted)]">
              {formatSentenceCase(t("pages.home.trustStrip.learnersLine", { count: learners }), locale)}
            </p>
          ) : null}
          <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {pills.map((pill) => {
              const Icon = pill.icon;
              return (
                <li
                  key={pill.label}
                  className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--pill-border))] bg-[var(--pill-bg)] px-3.5 py-1.5 text-sm font-semibold text-[var(--pill-fg)] shadow-[var(--elevation-rest)]"
                >
                  <Icon className={`h-4 w-4 shrink-0 ${pill.iconClass}`} aria-hidden />
                  {formatEyebrow(pill.label, locale)}
                </li>
              );
            })}
          </ul>
        </div>
        </FadeUp>
      </div>
    </section>
  );
}
