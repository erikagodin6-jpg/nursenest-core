"use client";

import { ArrowRight } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { marketingExamHubPath } from "@/lib/marketing/country-exam-offerings";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { MARKETING_PRIMARY_CTA_CLASS, MARKETING_TERTIARY_LINK_CLASS } from "@/lib/theme/marketing-hero-pattern";

/**
 * Closing conversion block: start studying today — exam hub + signup.
 */
export function HomeFinalStudyCta() {
  const { t, locale } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);

  return (
    <section
      className="border-t border-[var(--border-subtle)] bg-[var(--nn-presentation-panel)] py-12 md:py-16"
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
            href={loc(marketingExamHubPath(region, "rn"))}
            event={PH.marketingHomeFinalCta}
            eventProps={{ choice: "exam_hub_rn", region, surface: "final" }}
            secondaryCapture={{
              event: PH.funnelHomeToExamHub,
              eventProps: { placement: "final_cta", pathway: "rn", region },
            }}
            className={`${MARKETING_PRIMARY_CTA_CLASS} sm:min-w-[220px]`}
            data-testid="button-final-start-rn-hub"
          >
            <span className="whitespace-nowrap">{t("home.conversion.final.ctaPrimary")}</span>
            <ArrowRight className="ml-2 h-5 w-5 shrink-0" aria-hidden />
          </MarketingTrackedLink>
          <MarketingTrackedLink
            href={loc(HUB.signup)}
            event={PH.marketingHomeFinalCta}
            eventProps={{ choice: "signup", region, surface: "final" }}
            className={MARKETING_TERTIARY_LINK_CLASS}
            data-testid="button-final-signup"
          >
            {t("home.conversion.final.ctaSecondary")}
          </MarketingTrackedLink>
        </div>
        <p className="nn-marketing-body-sm mx-auto mt-6 max-w-lg text-[var(--theme-muted-text)]">
          <MarketingTrackedLink
            href={loc(HUB.practiceExams)}
            event={PH.marketingHomeFinalCta}
            eventProps={{ choice: "practice_exams_overview", region, surface: "final" }}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Practice exams overview
          </MarketingTrackedLink>
          {" · "}
          <MarketingTrackedLink
            href={loc(HUB.questionBank)}
            event={PH.marketingHomeFinalCta}
            eventProps={{ choice: "question_bank_overview", region, surface: "final" }}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Question bank overview
          </MarketingTrackedLink>
        </p>
      </div>
    </section>
  );
}
