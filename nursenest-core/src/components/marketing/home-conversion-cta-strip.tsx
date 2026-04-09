"use client";

import { ArrowRight } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  MARKETING_PRIMARY_CTA_COMPACT_CLASS,
  MARKETING_SECONDARY_CTA_COMPACT_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

export type HomeConversionCtaStripPlacement =
  | "after_exam_paths"
  | "after_pillars"
  | "after_platform_preview"
  | "after_how_it_works";

/**
 * Repeated homepage CTAs with consistent labels (start practicing, try free questions, explore lessons).
 */
export function HomeConversionCtaStrip({ placement }: { placement: HomeConversionCtaStripPlacement }) {
  const { t, locale } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);

  return (
    <div
      className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center"
      role="group"
      aria-label={t("home.conversion.inlineCta.aria")}
      data-testid={`home-cta-strip-${placement}`}
    >
      <MarketingTrackedLink
        href={loc(HUB.signup)}
        event={PH.marketingHomeHeroSecondaryCta}
        eventProps={{ region, destination: "signup", surface: "inline_cta", placement }}
        className={`${MARKETING_PRIMARY_CTA_COMPACT_CLASS} rounded-xl`}
      >
        {t("home.conversion.ctaStartPracticing")}
        <ArrowRight className="ml-1.5 h-4 w-4 shrink-0" aria-hidden />
      </MarketingTrackedLink>
      <MarketingTrackedLink
        href={loc(HUB.questionBank)}
        event={PH.marketingHomeHeroSecondaryCta}
        eventProps={{ region, destination: "question_bank", surface: "inline_cta", placement }}
        className={`${MARKETING_SECONDARY_CTA_COMPACT_CLASS} rounded-xl border border-[var(--border-subtle)]`}
      >
        {t("home.conversion.ctaTryFreeBank")}
      </MarketingTrackedLink>
      <MarketingTrackedLink
        href={loc(HUB.examLessons)}
        event={PH.marketingHomeHeroSecondaryCta}
        eventProps={{ region, destination: "lessons", surface: "inline_cta", placement }}
        className={`${MARKETING_SECONDARY_CTA_COMPACT_CLASS} rounded-xl border border-[var(--border-subtle)]`}
      >
        {t("home.conversion.ctaExploreLessons")}
      </MarketingTrackedLink>
    </div>
  );
}
