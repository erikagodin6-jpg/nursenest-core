"use client";

import { useMemo } from "react";
import { BookOpen, ClipboardList, Flag } from "lucide-react";

import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";

import { HUB, rnQuestions } from "@/lib/marketing/marketing-entry-routes";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";

import { PH } from "@/lib/observability/posthog-conversion-events";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

import { FadeUp, StaggerGroup, StaggerItem } from "@/lib/motion";

/**
 * Stable semantic color tokens (no runtime mutation)
 */
const STEP_COLORS = [
  {
    bg: "var(--semantic-info)",
    border: "color-mix(in srgb, var(--semantic-info) 35%, var(--border-subtle))",
    surface: "color-mix(in srgb, var(--semantic-info) 18%, var(--bg-card))",
  },
  {
    bg: "var(--semantic-brand)",
    border: "color-mix(in srgb, var(--semantic-brand) 35%, var(--border-subtle))",
    surface: "color-mix(in srgb, var(--semantic-brand) 18%, var(--bg-card))",
  },
  {
    bg: "var(--semantic-success)",
    border: "color-mix(in srgb, var(--semantic-success) 35%, var(--border-subtle))",
    surface: "color-mix(in srgb, var(--semantic-success) 18%, var(--bg-card))",
  },
] as const;

/**
 * Hard-safe translation accessor
 * Prevents crashes if keys are missing during production builds
 */
function safeT(t: (k: string) => string, key: string, fallback: string) {
  try {
    const val = t(key);
    return val && val !== key ? val : fallback;
  } catch {
    return fallback;
  }
}

export function HomeHowItWorksSection() {
  const { locale, t } = useMarketingI18n();
  const { region } = useNursenestRegion();

  const loc = (path: string) => withMarketingLocale(locale, path);

  /**
   * Memoized links (prevents rerender churn + avoids undefined region edge cases)
   */
  const links = useMemo(() => {
    return {
      lessons: loc(HUB.examLessons),
      questions: loc(rnQuestions(region)),
      exams: loc(HUB.practiceExams),
    };
  }, [locale, region]);

  /**
   * Steps are memoized and guarded
   */
  const steps = useMemo(
    () => [
      {
        icon: BookOpen,
        title: safeT(t, "pages.home.howItWorks.step1.title", "Learn"),
        body: safeT(t, "pages.home.howItWorks.step1.body", "Study core concepts efficiently"),
        href: links.lessons,
        label: safeT(t, "pages.home.howItWorks.step1.cta", "Start Learning"),
        testId: "how-step-learn",
      },
      {
        icon: ClipboardList,
        title: safeT(t, "pages.home.howItWorks.step2.title", "Practice"),
        body: safeT(t, "pages.home.howItWorks.step2.body", "Apply knowledge with exam-style questions"),
        href: links.questions,
        label: safeT(t, "pages.home.howItWorks.step2.cta", "Practice Questions"),
        testId: "how-step-practice",
      },
      {
        icon: Flag,
        title: safeT(t, "pages.home.howItWorks.step3.title", "Pass"),
        body: safeT(t, "pages.home.howItWorks.step3.body", "Build confidence for exam day"),
        href: links.exams,
        label: safeT(t, "pages.home.howItWorks.step3.cta", "Take Practice Exams"),
        testId: "how-step-pass",
      },
    ],
    [t, links]
  );

  return (
    <section
      id="home-how-it-works"
      aria-labelledby="home-how-heading"
      data-testid="section-how-it-works"
      className="nn-section-block scroll-mt-20 border-y border-[var(--accent-surface-c-border)]"
      style={{ background: "var(--accent-surface-c)" }}
    >
      <div className="nn-section-shell">
        {/* Header */}
        <FadeUp
          whenInView
          once
          viewMargin="-32px"
          className="mx-auto mb-9 max-w-2xl text-center md:mb-10"
        >
          <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            {formatSentenceCase(
              safeT(t, "pages.home.howItWorks.kicker", "How it works"),
              locale
            )}
          </p>

          <h2 id="home-how-heading" className="nn-marketing-h2 mt-2 text-balance">
            {formatTitleCase(
              safeT(t, "pages.home.howItWorks.title", "Simple, structured learning"),
              locale
            )}
          </h2>

          <p className="nn-marketing-body mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-[var(--theme-muted-text)]">
            {formatSentenceCase(
              safeT(
                t,
                "pages.home.howItWorks.subtitle",
                "A focused path from learning to exam readiness"
              ),
              locale
            )}
          </p>
        </FadeUp>

        {/* Steps */}
        <StaggerGroup
          as="ol"
          className="grid list-none gap-6 p-0 md:grid-cols-3"
          staggerMs={65}
          whenInView
          once
          viewMargin="-36px"
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            const color = STEP_COLORS[i];

            return (
              <StaggerItem
                as="li"
                key={step.testId}
                variant="softReveal"
                className="relative flex min-w-0 flex-col rounded-2xl border bg-[var(--bg-card)] p-6 shadow-[var(--shadow-elevated)]"
                style={{ borderColor: color.border }}
              >
                {/* Step indicator */}
                <div className="mb-4 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      background: color.surface,
                      color: color.bg,
                      border: `1.5px solid ${color.border}`,
                    }}
                  >
                    {i + 1}
                  </span>

                  <Icon className="h-5 w-5" style={{ color: color.bg }} />
                </div>

                <h3 className="nn-marketing-h3 mb-2 text-[var(--palette-heading)]">
                  {formatTitleCase(step.title, locale)}
                </h3>

                <p className="nn-marketing-body-sm flex-grow text-[var(--theme-muted-text)]">
                  {formatSentenceCase(step.body, locale)}
                </p>

                <MarketingTrackedLink
                  href={step.href}
                  event={PH.marketingHomeExploreHubClick}
                  eventProps={{
                    surface: "how_it_works",
                    step: i + 1,
                    region,
                  }}
                  data-testid={step.testId}
                  className="group nn-motion-standard mt-5 inline-flex items-center rounded-lg px-1 py-0.5 text-sm font-semibold transition-colors hover:bg-[color-mix(in_srgb,var(--theme-primary)_6%,var(--bg-card))]"
                  style={{ color: color.bg }}
                >
                  {formatTitleCase(step.label, locale)}
                  <span
                    aria-hidden
                    className="ml-1 text-xs transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </MarketingTrackedLink>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}