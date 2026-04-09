"use client";

import { ArrowRight } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { MARKETING_PRIMARY_CTA_CLASS, MARKETING_TERTIARY_LINK_CLASS } from "@/lib/theme/marketing-hero-pattern";

/**
 * Closing conversion block: exam prep headline — signup primary, pathway + resource links.
 */
export function HomeFinalStudyCta() {
  const { t, locale } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);

  return (
    <section
      className="border-t border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--theme-primary)_6%,var(--nn-presentation-panel))] py-12 md:py-16"
      aria-labelledby="home-final-cta-heading"
      data-testid="section-final-study-cta"
    >
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <h2 id="home-final-cta-heading" className="nn-marketing-h2 text-balance">
          {t("home.conversion.final.title")}
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-2 max-w-lg text-pretty text-[var(--theme-muted-text)]">
          {t("home.conversion.final.sub")}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
          <MarketingTrackedLink
            href={loc(HUB.signup)}
            event={PH.marketingHomeFinalCta}
            eventProps={{ choice: "signup", region, surface: "final" }}
            className={`${MARKETING_PRIMARY_CTA_CLASS} rounded-xl shadow-[var(--shadow-card)] sm:min-w-[240px]`}
            data-testid="button-final-signup-primary"
          >
            <span className="whitespace-nowrap">{t("home.conversion.final.ctaPrimary")}</span>
            <ArrowRight className="ml-2 h-5 w-5 shrink-0" aria-hidden />
          </MarketingTrackedLink>
          <MarketingTrackedLink
            href="#home-exam-paths"
            event={PH.marketingHomeFinalCta}
            eventProps={{ choice: "exam_paths_anchor", region, surface: "final" }}
            className={MARKETING_TERTIARY_LINK_CLASS}
            data-testid="button-final-choose-exam"
          >
            {t("home.conversion.final.ctaSecondary")}
          </MarketingTrackedLink>
        </div>
        <p className="nn-marketing-body-sm mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[var(--theme-muted-text)]">
          <MarketingTrackedLink
            href={loc(HUB.practiceExams)}
            event={PH.marketingHomeFinalCta}
            eventProps={{ choice: "practice_exams_overview", region, surface: "final" }}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            {t("home.conversion.final.linkPracticeExams")}
          </MarketingTrackedLink>
          <span className="text-[var(--theme-muted-text)]" aria-hidden>
            ·
          </span>
          <MarketingTrackedLink
            href={loc(HUB.questionBank)}
            event={PH.marketingHomeFinalCta}
            eventProps={{ choice: "question_bank_overview", region, surface: "final" }}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            {t("home.conversion.final.linkQuestionBank")}
          </MarketingTrackedLink>
          <span className="text-[var(--theme-muted-text)]" aria-hidden>
            ·
          </span>
          <MarketingTrackedLink
            href={loc(HUB.examLessons)}
            event={PH.marketingHomeFinalCta}
            eventProps={{ choice: "lessons_overview", region, surface: "final" }}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            {t("home.conversion.final.linkExploreLessons")}
          </MarketingTrackedLink>
        </p>
      </div>
    </section>
  );
}
