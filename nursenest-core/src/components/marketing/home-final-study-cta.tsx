"use client";

import { ArrowRight, CheckCircle } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/navigation/canonical-destinations";
import { FadeUp } from "@/lib/motion";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { MARKETING_PRIMARY_CTA_CLASS, MARKETING_SECONDARY_CTA_CLASS } from "@/lib/theme/marketing-hero-pattern";
import { formatEyebrow, formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

/**
 * Closing conversion block — same value prop as hero; primary Practice, secondary Lessons.
 */
export function HomeFinalStudyCta() {
  const { locale, t } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);

  const trustKeys = ["pages.home.finalCta.trust0", "pages.home.finalCta.trust1", "pages.home.finalCta.trust2"] as const;

  return (
    <section
      className="nn-section-block border-t border-[var(--header-nav-border)] bg-[var(--hero-branded-wash)]"
      aria-labelledby="home-final-cta-heading"
      data-testid="section-final-study-cta"
    >
      <div className="nn-section-shell">
        <FadeUp whenInView once viewMargin="-28px" className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--theme-primary)_14%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--bg-card)_88%,var(--hero-branded-wash))] px-6 py-10 text-center shadow-[var(--shadow-elevated)] sm:px-10 sm:py-12">
            <p
              className="nn-marketing-caption mb-3 font-bold uppercase tracking-widest"
              style={{
                color:
                  "color-mix(in srgb, var(--palette-accent, var(--theme-accent)) 78%, var(--theme-heading-text))",
              }}
            >
              {formatEyebrow(t("pages.home.finalCta.eyebrow"), locale)}
            </p>
            <h2 id="home-final-cta-heading" className="nn-marketing-h2 text-balance">
              {formatTitleCase(t("pages.home.finalCta.headline"), locale)}
            </h2>
            <p className="nn-marketing-body-sm mx-auto mt-3 max-w-lg text-pretty leading-relaxed text-[var(--theme-muted-text)]">
              {formatSentenceCase(t("pages.home.finalCta.subheading"), locale)}
            </p>

            <ul className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {trustKeys.map((key) => (
                <li key={key} className="flex items-center gap-1.5 text-xs font-medium text-[var(--theme-muted-text)]">
                  <CheckCircle className="h-3.5 w-3.5 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                  {formatSentenceCase(t(key), locale)}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <MarketingTrackedLink
                href={loc(HUB.questionBank)}
                event={PH.marketingHomeFinalCta}
                eventProps={{ choice: "question_bank", region, surface: "final" }}
                className={`${MARKETING_PRIMARY_CTA_CLASS} nn-motion-standard rounded-xl shadow-[var(--shadow-card)] sm:min-w-[220px]`}
                data-testid="button-final-start-practice"
              >
                <span className="whitespace-nowrap">{formatTitleCase(t("pages.home.hero.primaryCta"), locale)}</span>
                <ArrowRight className="ml-2 h-5 w-5 shrink-0" aria-hidden />
              </MarketingTrackedLink>
              <MarketingTrackedLink
                href={loc(HUB.examLessons)}
                event={PH.marketingHomeFinalCta}
                eventProps={{ choice: "lessons", region, surface: "final" }}
                className={`${MARKETING_SECONDARY_CTA_CLASS} nn-motion-standard rounded-xl border border-[var(--border-subtle)]`}
                data-testid="button-final-browse-lessons"
              >
                {formatTitleCase(t("pages.home.hero.secondaryCta"), locale)}
              </MarketingTrackedLink>
            </div>

            <p className="nn-marketing-caption mx-auto mt-6 max-w-md text-pretty text-[var(--theme-muted-text)]">
              {formatSentenceCase(t("pages.home.finalCta.pricingLead"), locale)}{" "}
              <MarketingTrackedLink
                href={loc(HUB.pricing)}
                event={PH.marketingHomeFinalCta}
                eventProps={{ choice: "pricing", region, surface: "final" }}
                className="font-semibold text-[var(--text-accent)] underline decoration-[color-mix(in_srgb,var(--text-accent)_45%,transparent)] underline-offset-4 transition-colors hover:text-[var(--theme-heading-text)] hover:decoration-[var(--text-accent)]"
              >
                {formatTitleCase(t("pages.home.finalCta.pricingLink"), locale)}
              </MarketingTrackedLink>
              {formatSentenceCase(t("pages.home.finalCta.pricingTail"), locale)}
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
