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

/**
 * Simplified three-step loop for fast homepage scanning.
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
      className="nn-section-block scroll-mt-20 border-b border-[var(--border)] bg-[var(--section-bg)]"
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

        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.testId} className="nn-card-system nn-card-system-pad nn-card-system--interactive relative">
              <div className="mb-1 flex items-center gap-3">
                <span className="nn-card-system__icon text-sm font-bold tabular-nums text-[var(--theme-primary)]">
                  {i + 1}
                </span>
                <s.icon className="h-6 w-6 text-[color-mix(in_srgb,var(--theme-primary)_85%,var(--theme-heading-text))]" aria-hidden />
              </div>
              <p className="nn-card-system__eyebrow">{formatTitleCase(`Step ${i + 1}`, locale)}</p>
              <h3 className="nn-card-system__title">{formatTitleCase(s.title, locale)}</h3>
              <p className="nn-card-system__description">{formatSentenceCase(s.body, locale)}</p>
              <MarketingTrackedLink
                href={s.href}
                event={PH.marketingHomeExploreHubClick}
                eventProps={{ surface: "how_it_works", step: i + 1, region }}
                className="nn-card-system__cta underline-offset-4 hover:underline"
                data-testid={s.testId}
              >
                {formatTitleCase(s.label, locale)}
              </MarketingTrackedLink>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
