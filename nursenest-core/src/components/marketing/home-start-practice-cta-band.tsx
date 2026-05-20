"use client";

import { ArrowRight } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { MARKETING_PRIMARY_CTA_CLASS } from "@/lib/theme/marketing-hero-pattern";
import { formatTitleCase } from "@/lib/format/text-case";

export type HomeStartPracticeCtaBandPlacement = "after_screenshots" | "mid_page";

/**
 * Repeatable homepage primary CTA — direct link to public question bank (one click from marketing).
 */
export function HomeStartPracticeCtaBand({ placement }: { placement: HomeStartPracticeCtaBandPlacement }) {
  const { locale, t } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);
  const isMid = placement === "mid_page";

  return (
    <div
      className={
        isMid
          ? "rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,var(--page-bg))] px-5 py-6 text-center sm:px-8 sm:py-7"
          : "mt-4 border-t border-[var(--header-nav-border)] pt-5 text-center sm:mt-5 sm:pt-6"
      }
      role="region"
      aria-label={t("pages.home.ctaBand.ariaLabel")}
      data-testid={`home-start-practice-band-${placement}`}
    >
      <MarketingTrackedLink
        href={loc(HUB.questionBank)}
        event={PH.marketingHomeQuickEntryClick}
        eventProps={{ region, surface: placement, destination: "question_bank" }}
        className={`${MARKETING_PRIMARY_CTA_CLASS} nn-motion-standard mx-auto inline-flex rounded-xl shadow-[var(--shadow-card)]`}
        data-testid={`button-start-practice-${placement}`}
      >
        {formatTitleCase(t("pages.home.hero.primaryCta"), locale)}
        <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
      </MarketingTrackedLink>
      <p className="nn-marketing-caption mx-auto mt-3 max-w-md text-pretty font-medium text-[var(--palette-text)]">
        {t("pages.home.ctaBand.microcopy")}
      </p>
    </div>
  );
}
