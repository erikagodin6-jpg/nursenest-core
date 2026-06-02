"use client";

import { ArrowRight, CheckCircle } from "lucide-react";
import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/navigation/canonical-destinations";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

function safeLocale(l?: string) {
  return l || "en";
}

function safeRegion(r?: string) {
  return r || "CA";
}

function safePath(locale: string, path: string) {
  try {
    return withMarketingLocale(locale, path);
  } catch {
    return path;
  }
}

export function HomeFinalStudyCta() {
  const ctx = useMarketingI18n();
  const locale = safeLocale(ctx.locale);
  const t = ctx.t;
  const region = safeRegion(useNursenestRegion().region);

  const loc = (p: string) => safePath(locale, p);

  const trust = [
    "No credit card required",
    "Cancel anytime",
    "Study at your own pace",
  ];

  return (
    <section
      className="nn-home-final-cta-band border-t border-[var(--header-nav-border)] py-[var(--nn-rhythm-section-y)] sm:py-[calc(var(--nn-rhythm-section-y)+0.25rem)]"
      aria-labelledby="home-final-cta-heading"
    >
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <h2 id="home-final-cta-heading" className="nn-marketing-h2 text-balance">
          {safeHomepageMarketingT(t, "pages.home.finalCta.headline", "Start preparing with confidence")}
        </h2>

        <p className="nn-marketing-body mx-auto mt-3 max-w-xl text-pretty text-[var(--theme-muted-text)]">
          {safeHomepageMarketingT(
            t,
            "pages.home.finalCta.subheading",
            "Practice questions, lessons, and readiness tools designed for real exams."
          )}
        </p>

        <ul className="nn-marketing-body-sm mt-6 space-y-2 text-[var(--theme-muted-text)]">
          {trust.map((item) => (
            <li key={item} className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-[var(--nn-rhythm-btn-group-gap)] sm:flex-row sm:justify-center">
          <MarketingTrackedLink
            href={loc(HUB.questionBank)}
            event={PH.marketingHomeFinalCta}
            eventProps={{ region }}
            className={`${MARKETING_PRIMARY_CTA_CLASS} rounded-xl`}
          >
            {safeHomepageMarketingT(t, "pages.home.hero.primaryCta", "Start Practice Questions")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </MarketingTrackedLink>

          <MarketingTrackedLink
            href={loc(HUB.examLessons)}
            event={PH.marketingHomeFinalCta}
            eventProps={{ region }}
            className={`${MARKETING_SECONDARY_CTA_CLASS} rounded-xl`}
          >
            {safeHomepageMarketingT(t, "pages.home.hero.secondaryCta", "Browse Lessons")}
          </MarketingTrackedLink>
        </div>

        <p className="nn-marketing-body-sm mt-6 text-[var(--theme-muted-text)]">
          {safeHomepageMarketingT(t, "pages.home.finalCta.pricingLead", "See Full Pricing")}{" "}
          <MarketingTrackedLink
            href={loc(HUB.pricing)}
            event={PH.marketingHomeFinalCta}
            eventProps={{ region }}
            className="font-semibold underline"
          >
            {safeHomepageMarketingT(t, "pages.home.finalCta.pricingLink", "here")}
          </MarketingTrackedLink>
        </p>
      </div>
    </section>
  );
}
