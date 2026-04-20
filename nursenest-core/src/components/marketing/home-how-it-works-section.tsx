"use client";

import { BookOpen, ClipboardList, Flag } from "lucide-react";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB, rnQuestions } from "@/lib/marketing/marketing-entry-routes";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { FadeUp, StaggerGroup, StaggerItem } from "@/lib/motion";

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
  const { locale, t } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);

  const questionsHref = loc(rnQuestions(region));

  const steps = [
    {
      icon: BookOpen,
      title: t("pages.home.howItWorks.step1.title"),
      body: t("pages.home.howItWorks.step1.body"),
      href: loc(HUB.examLessons),
      label: t("pages.home.howItWorks.step1.cta"),
      testId: "how-step-learn",
    },
    {
      icon: ClipboardList,
      title: t("pages.home.howItWorks.step2.title"),
      body: t("pages.home.howItWorks.step2.body"),
      href: questionsHref,
      label: t("pages.home.howItWorks.step2.cta"),
      testId: "how-step-practice",
    },
    {
      icon: Flag,
      title: t("pages.home.howItWorks.step3.title"),
      body: t("pages.home.howItWorks.step3.body"),
      href: loc(HUB.practiceExams),
      label: t("pages.home.howItWorks.step3.cta"),
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
        <FadeUp whenInView once viewMargin="-32px" className="mx-auto mb-9 max-w-2xl text-center md:mb-10">
          <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            {formatSentenceCase(t("pages.home.howItWorks.kicker"), locale)}
          </p>
          <h2 id="home-how-heading" className="nn-marketing-h2 mt-2 text-balance">
            {formatTitleCase(t("pages.home.howItWorks.title"), locale)}
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-[var(--theme-muted-text)]">
            {formatSentenceCase(t("pages.home.howItWorks.subtitle"), locale)}
          </p>
        </FadeUp>

        <StaggerGroup
          as="ol"
          className="grid list-none gap-6 p-0 md:grid-cols-3"
          staggerMs={65}
          whenInView
          once
          viewMargin="-36px"
        >
          {steps.map((s, i) => {
            const Icon = s.icon;
            const color = STEP_COLORS[i];
            return (
              <StaggerItem
                as="li"
                key={s.testId}
                variant="softReveal"
                className="relative flex min-w-0 flex-col rounded-2xl border bg-[var(--bg-card)] p-6 shadow-[var(--shadow-elevated)]"
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
                  className="group nn-motion-standard mt-5 inline-flex items-center rounded-lg px-1 py-0.5 text-sm font-semibold transition-colors hover:bg-[color-mix(in_srgb,var(--theme-primary)_6%,var(--bg-card))]"
                  style={{ color: color.bg }}
                  data-testid={s.testId}
                >
                  {formatTitleCase(s.label, locale)}
                  <span className="ml-1 text-xs transition-transform group-hover:translate-x-0.5" aria-hidden>
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
