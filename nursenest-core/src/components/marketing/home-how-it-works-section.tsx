"use client";

import { BookOpen, ClipboardList, Flag } from "lucide-react";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB, rnQuestions } from "@/lib/marketing/marketing-entry-routes";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { PRIMARY_CTA, SECONDARY_CTA, TERTIARY_CTA } from "@/lib/copy/cta-copy";

const STEP_COLORS = [
  { bg: "var(--semantic-info)", soft: "var(--semantic-info-soft)", contrast: "var(--semantic-info-contrast)" },
  { bg: "var(--semantic-brand)", soft: "var(--semantic-brand-soft)", contrast: "var(--semantic-brand-contrast)" },
  { bg: "var(--semantic-success)", soft: "var(--semantic-success-soft)", contrast: "var(--semantic-success-contrast)" },
] as const;

/**
 * Premium three-step flow section.
 * Distinct primary-tinted background differentiates it visually from white card sections.
 * Step numbers are large colored circles for clear scanability.
 */
export function HomeHowItWorksSection() {
  const { locale } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);

  const questionsHref = loc(rnQuestions(region));

  const steps = [
    {
      icon: BookOpen,
      title: "Learn",
      body: "Study focused lessons mapped to your exact nursing pathway.",
      href: loc(HUB.examLessons),
      label: TERTIARY_CTA,
      testId: "how-step-learn",
    },
    {
      icon: ClipboardList,
      title: "Practice",
      body: "Train with exam-style questions and full rationales on every item.",
      href: questionsHref,
      label: SECONDARY_CTA,
      testId: "how-step-practice",
    },
    {
      icon: Flag,
      title: "Pass",
      body: "Use CAT and readiness tracking to close weak areas before exam day.",
      href: loc(HUB.practiceExams),
      label: PRIMARY_CTA,
      testId: "how-step-pass",
    },
  ] as const;

  return (
    <section
      id="home-how-it-works"
      className="nn-section-block scroll-mt-20 border-y border-[var(--accent-surface-c-border)]"
      style={{ background: "var(--accent-surface-c)" }}
      aria-labelledby="home-how-heading"
      data-testid="section-how-it-works"
    >
      <div className="nn-section-shell">
        <header className="mx-auto mb-12 max-w-2xl text-center">
          <h2 id="home-how-heading" className="nn-marketing-h2 text-balance">
            {formatTitleCase("How It Works", locale)}
          </h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-xl text-pretty text-[var(--theme-muted-text)]">
            {formatSentenceCase("A simple three-step loop to build confidence and readiness faster.", locale)}
          </p>
        </header>

        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const color = STEP_COLORS[i];
            return (
              <li
                key={s.testId}
                className="relative flex flex-col rounded-2xl border bg-[var(--bg-card)] p-6 shadow-[var(--elevation-rest)]"
                style={{ borderColor: `color-mix(in srgb, ${color.bg} 22%, var(--border-subtle))` }}
              >
                {/* Step number + icon row */}
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      background: `color-mix(in srgb, ${color.bg} 18%, var(--bg-card))`,
                      color: color.bg,
                      border: `1.5px solid color-mix(in srgb, ${color.bg} 35%, var(--border-subtle))`,
                    }}
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <Icon
                    className="h-5 w-5"
                    style={{ color: color.bg }}
                    aria-hidden
                  />
                </div>

                <h3 className="nn-marketing-h3 mb-2" style={{ color: "var(--palette-heading)" }}>
                  {formatTitleCase(s.title, locale)}
                </h3>
                <p className="nn-marketing-body-sm flex-grow text-[var(--theme-muted-text)]">
                  {formatSentenceCase(s.body, locale)}
                </p>

                <MarketingTrackedLink
                  href={s.href}
                  event={PH.marketingHomeExploreHubClick}
                  eventProps={{ surface: "how_it_works", step: i + 1, region }}
                  className="mt-4 inline-flex items-center text-sm font-semibold transition-colors hover:underline"
                  style={{ color: color.bg }}
                  data-testid={s.testId}
                >
                  {formatTitleCase(s.label, locale)}
                  <span className="ml-1 text-xs">→</span>
                </MarketingTrackedLink>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
