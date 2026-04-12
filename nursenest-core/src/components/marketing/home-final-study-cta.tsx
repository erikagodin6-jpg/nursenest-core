"use client";

import { ArrowRight } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { MARKETING_PRIMARY_CTA_CLASS } from "@/lib/theme/marketing-hero-pattern";
import { formatEyebrow, formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { PRIMARY_CTA } from "@/lib/copy/cta-copy";

/**
 * Closing conversion block with one clear primary action.
 */
export function HomeFinalStudyCta() {
  const { locale } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);

  return (
    <section
      className="nn-section-block border-t border-[var(--footer-border)] bg-[var(--hero-branded-wash)]"
      aria-labelledby="home-final-cta-heading"
      data-testid="section-final-study-cta"
    >
      <div className="nn-section-shell">
        <div className="text-center">
          <p className="nn-marketing-caption mb-3 font-semibold uppercase tracking-widest text-[color-mix(in_srgb,var(--palette-accent,var(--theme-accent))_78%,var(--theme-heading-text))]">
            {formatEyebrow("Ready To Start", locale)}
          </p>
          <h2 id="home-final-cta-heading" className="nn-marketing-h2 text-balance">
            {formatTitleCase("Start your exam prep with a system built for your license.", locale)}
          </h2>
          <p className="nn-marketing-body-sm mx-auto mt-2 max-w-lg text-pretty text-[var(--theme-muted-text)]">
            {formatSentenceCase(
              "Get pathway-scoped practice, rationales, and readiness tracking in one place.",
              locale,
            )}
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <MarketingTrackedLink
            href={loc(HUB.signup)}
            event={PH.marketingHomeFinalCta}
            eventProps={{ choice: "signup", region, surface: "final" }}
            className={`${MARKETING_PRIMARY_CTA_CLASS} rounded-xl shadow-[var(--shadow-card)] sm:min-w-[240px]`}
            data-testid="button-final-signup-primary"
          >
            <span className="whitespace-nowrap">{formatTitleCase(PRIMARY_CTA, locale)}</span>
            <ArrowRight className="ml-2 h-5 w-5 shrink-0" aria-hidden />
          </MarketingTrackedLink>
        </div>
      </div>
    </section>
  );
}
