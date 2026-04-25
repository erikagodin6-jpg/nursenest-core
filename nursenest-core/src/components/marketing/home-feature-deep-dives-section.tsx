"use client";

import { ArrowRight } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB, rnQuestions } from "@/lib/marketing/marketing-entry-routes";
import { publicMarketingCatHrefForOffering } from "@/lib/marketing/marketing-exam-navigation";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

function safe(value: any, fallback: any) {
  return value ?? fallback;
}

function safeCall(fn: any, fallback: any) {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export function HomeFeatureDeepDivesSection() {
  let locale = "en";
  let region = "CA";

  try {
    locale = safe(useMarketingI18n()?.locale, "en");
  } catch {}

  try {
    region = safe(useNursenestRegion()?.region, "CA");
  } catch {}

  const loc = (path: string) => {
    try {
      return withMarketingLocale(locale, path);
    } catch {
      return path;
    }
  };

  const pricingHref = safeCall(() => loc(HUB.pricing), "/pricing");
  const questionsHref = safeCall(() => loc(rnQuestions(region)), "/lessons");
  const catHref = safeCall(
    () => loc(publicMarketingCatHrefForOffering(region, "rn")),
    "/lessons"
  );

  const features = [
    {
      title: "Personalized Study Plan",
      desc: "Daily tasks built from your weak areas and readiness score.",
    },
    {
      title: "Smart Review System",
      desc: "Focus on exactly what you got wrong and why.",
    },
    {
      title: "CAT Exam Simulation",
      desc: "Adaptive testing with real readiness scoring.",
    },
  ];

  return (
    <section className="border-b border-[var(--border)] bg-[var(--page-bg)] py-12">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <h2 className="text-2xl font-bold">The full readiness system</h2>

        <p className="mt-3 text-[var(--theme-muted-text)]">
          Practice, test, review, and improve — all connected.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border p-5">
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <MarketingTrackedLink
            href={pricingHref}
            event={PH.marketingHomeExploreHubClick}
            eventProps={{ region }}
            className={MARKETING_PRIMARY_CTA_CLASS}
          >
            View pricing
            <ArrowRight className="ml-2 h-4 w-4" />
          </MarketingTrackedLink>

          <MarketingTrackedLink
            href={questionsHref}
            event={PH.marketingHomeExploreHubClick}
            eventProps={{ region }}
            className={MARKETING_SECONDARY_CTA_CLASS}
          >
            Try practice questions
          </MarketingTrackedLink>
        </div>
      </div>
    </section>
  );
}