"use client";

import { ArrowRight, CheckCircle } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/navigation/canonical-destinations";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

function safeT(t: ((k: string) => string) | undefined, key: string, fallback: string) {
  try {
    const v = t?.(key);
    return typeof v === "string" && v.trim() ? v : fallback;
  } catch {
    return fallback;
  }
}

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
  let locale = "en";
  let t: ((k: string) => string) | undefined;

  try {
    const ctx = useMarketingI18n();
    locale = safeLocale(ctx.locale);
    t = ctx.t;
  } catch {}

  let region = "CA";
  try {
    region = safeRegion(useNursenestRegion().region);
  } catch {}

  const loc = (p: string) => safePath(locale, p);

  const trust = [
    "No credit card required",
    "Cancel anytime",
    "Study at your own pace",
  ];

  return (
    <section
      className="border-t border-[var(--header-nav-border)] bg-[var(--hero-branded-wash)] py-12"
      aria-labelledby="home-final-cta-heading"
    >
      <div className="mx-auto max-w-2xl text-center px-4">
        <h2 className="text-2xl font-bold">
          {safeT(t, "pages.home.finalCta.headline", "Start preparing with confidence")}
        </h2>

        <p className="mt-3 text-[var(--theme-muted-text)]">
          {safeT(
            t,
            "pages.home.finalCta.subheading",
            "Practice questions, lessons, and readiness tools designed for real exams."
          )}
        </p>

        <ul className="mt-6 space-y-2 text-sm text-[var(--theme-muted-text)]">
          {trust.map((item) => (
            <li key={item} className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <MarketingTrackedLink
            href={loc(HUB.questionBank)}
            event={PH.marketingHomeFinalCta}
            eventProps={{ region }}
            className={`${MARKETING_PRIMARY_CTA_CLASS} rounded-xl`}
          >
            {safeT(t, "pages.home.hero.primaryCta", "Start practice questions")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </MarketingTrackedLink>

          <MarketingTrackedLink
            href={loc(HUB.examLessons)}
            event={PH.marketingHomeFinalCta}
            eventProps={{ region }}
            className={`${MARKETING_SECONDARY_CTA_CLASS} rounded-xl`}
          >
            {safeT(t, "pages.home.hero.secondaryCta", "Browse lessons")}
          </MarketingTrackedLink>
        </div>

        <p className="mt-6 text-sm text-[var(--theme-muted-text)]">
          {safeT(t, "pages.home.finalCta.pricingLead", "See full pricing")}{" "}
          <MarketingTrackedLink
            href={loc(HUB.pricing)}
            event={PH.marketingHomeFinalCta}
            eventProps={{ region }}
            className="font-semibold underline"
          >
            {safeT(t, "pages.home.finalCta.pricingLink", "here")}
          </MarketingTrackedLink>
        </p>
      </div>
    </section>
  );
}