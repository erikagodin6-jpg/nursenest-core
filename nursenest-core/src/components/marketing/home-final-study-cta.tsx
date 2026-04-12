"use client";

import { ArrowRight, CheckCircle } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { MARKETING_PRIMARY_CTA_CLASS, MARKETING_SECONDARY_CTA_CLASS } from "@/lib/theme/marketing-hero-pattern";
import { formatEyebrow, formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/lib/copy/cta-copy";
import { defaultNursingExamMarketingHub } from "@/lib/marketing/marketing-exam-navigation";

const TRUST_POINTS = [
  "No credit card required",
  "Pathway-scoped questions",
  "Full rationales included",
] as const;

/**
 * Closing conversion block — branded wash to bookend the hero, one primary + one secondary action.
 * Trust microcopy reinforces the no-risk start.
 */
export function HomeFinalStudyCta() {
  const { locale } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);

  return (
    <section
      className="nn-section-block border-t border-[var(--header-nav-border)] bg-[var(--hero-branded-wash)]"
      aria-labelledby="home-final-cta-heading"
      data-testid="section-final-study-cta"
    >
      <div className="nn-section-shell">
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="nn-marketing-caption mb-3 font-bold uppercase tracking-widest"
            style={{ color: "color-mix(in srgb, var(--palette-accent, var(--theme-accent)) 78%, var(--theme-heading-text))" }}
          >
            {formatEyebrow("Ready to start", locale)}
          </p>
          <h2 id="home-final-cta-heading" className="nn-marketing-h2 text-balance">
            {formatTitleCase("Start your exam prep with a system built for your license.", locale)}
          </h2>
          <p className="nn-marketing-body-sm mx-auto mt-3 max-w-lg text-pretty text-[var(--theme-muted-text)]">
            {formatSentenceCase(
              "Get pathway-scoped practice, rationales, and readiness tracking in one place.",
              locale,
            )}
          </p>

          {/* Trust microcopy row */}
          <ul className="mx-auto mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-1.5 text-xs font-medium text-[var(--theme-muted-text)]">
                <CheckCircle className="h-3.5 w-3.5 text-[var(--semantic-success)]" aria-hidden />
                {formatSentenceCase(point, locale)}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <MarketingTrackedLink
            href={loc(HUB.signup)}
            event={PH.marketingHomeFinalCta}
            eventProps={{ choice: "signup", region, surface: "final" }}
            className={`${MARKETING_PRIMARY_CTA_CLASS} rounded-xl shadow-[var(--shadow-card)] sm:min-w-[220px]`}
            data-testid="button-final-signup-primary"
          >
            <span className="whitespace-nowrap">{formatTitleCase(PRIMARY_CTA, locale)}</span>
            <ArrowRight className="ml-2 h-5 w-5 shrink-0" aria-hidden />
          </MarketingTrackedLink>
          <MarketingTrackedLink
            href={loc(defaultNursingExamMarketingHub(region))}
            event={PH.marketingHomeFinalCta}
            eventProps={{ choice: "exam_hub", region, surface: "final" }}
            className={`${MARKETING_SECONDARY_CTA_CLASS} rounded-xl border border-[var(--border-subtle)]`}
          >
            {formatTitleCase(SECONDARY_CTA, locale)}
          </MarketingTrackedLink>
        </div>
      </div>
    </section>
  );
}
