"use client";

import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import type { NursenestMarketingRegion } from "@/lib/marketing/home-hero-gateway-config";
import { HUB, rnQuestions } from "@/lib/marketing/marketing-entry-routes";
import { buildHomepageHeroSlidesAtIndices } from "@/lib/marketing-assets";
import { MarketingChainScreenshot } from "@/components/marketing/marketing-screenshot-stack";
import { MARKETING_SCREENSHOT_TRIPLE_SIZES } from "@/lib/marketing-image-delivery";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
  MARKETING_TERTIARY_LINK_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

const PLATFORM_STEPS: { title: string; body: string }[] = [
  {
    title: "Pathway-scoped question bank",
    body: "Your tier and country (RN, PN, NP, allied) gate what you see, so you are not half asleep in the wrong scope.",
  },
  {
    title: "Rationales on scored items",
    body: "Submit, then read why the keyed answer holds and each distractor does not. Remediation-first, not motivational posters.",
  },
  {
    title: "Planner and dashboard",
    body: "Today’s block, weak-topic jumps, resume where you stopped, all in /app once you are signed in.",
  },
  {
    title: "Readiness and weak areas",
    body: "Rough 0–100 readiness from recent sessions and mocks, plus topic misses. If the sample is thin, we say so.",
  },
];

/** 0-based indices into `buildHomepageHeroSlides` → screenshots 6, 9, 11 (aligned with legacy bundle picks). */
const VALUE_SLIDE_INDICES = [5, 8, 10] as const;
const VALUE_SLIDE_LABELS = [
  "Practice UI: topic context and scoring",
  "Learner hub: continue, weak areas, next steps",
  "Exams and history: timed attempts",
] as const;

export function HomeValueConversionSection({ region }: { region: NursenestMarketingRegion }) {
  const { locale, t } = useMarketingI18n();
  const loc = (path: string) => withMarketingLocale(locale, path);
  const heroSlides = useMemo(() => buildHomepageHeroSlidesAtIndices(t, [...VALUE_SLIDE_INDICES]), [t]);

  return (
    <section
      className="border-t border-[var(--divider)] bg-[var(--bg-section-alt)]"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-value-platform-screens"
      aria-labelledby="value-platform-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="value-platform-heading" className="nn-marketing-h2 text-balance">
            One platform for your exam, not a random question feed
          </h2>
          <p className="nn-marketing-lead mx-auto text-pretty">
            NurseNest ties <strong className="font-semibold text-[var(--theme-heading-text)]">practice questions</strong>,{" "}
            <strong className="font-semibold text-[var(--theme-heading-text)]">lessons</strong>,{" "}
            <strong className="font-semibold text-[var(--theme-heading-text)]">timed mocks</strong>, and{" "}
            <strong className="font-semibold text-[var(--theme-heading-text)]">readiness tracking</strong> to the license track
            you select (US/Canada, RN/PN/NP). Server-side gates mean your bank always matches your plan.
          </p>
        </div>

        <div className="nn-marketing-cta-group mx-auto mt-10 max-w-xl">
          <MarketingTrackedLink
            href={loc("/signup")}
            event={PH.marketingHomeHeroPrimaryCta}
            eventProps={{ region, surface: "value_section" }}
            className={`${MARKETING_PRIMARY_CTA_CLASS} min-w-[min(100%,16rem)]`}
          >
            Start free, unlock full prep at checkout
            <ArrowRight className="ml-2 h-5 w-5" />
          </MarketingTrackedLink>
          <MarketingTrackedLink
            href={loc(HUB.pricing)}
            event={PH.marketingHomeExploreHubClick}
            eventProps={{ hub: "pricing" }}
            className={MARKETING_SECONDARY_CTA_CLASS}
          >
            Compare plans & pricing
          </MarketingTrackedLink>
        </div>
        <p className="mt-4 text-center">
          <MarketingTrackedLink
            href={loc(rnQuestions(region))}
            event={PH.marketingHomeHeroSecondaryCta}
            eventProps={{ region, destination: "rn_questions", surface: "value_section" }}
            className={`${MARKETING_TERTIARY_LINK_CLASS} w-full sm:w-auto`}
          >
            Try sample questions first
          </MarketingTrackedLink>
        </p>

        <div className="mt-14">
          <p className="nn-marketing-eyebrow text-center">How NurseNest works</p>
          <p className="nn-marketing-body-sm mx-auto mt-2 max-w-xl text-center text-[var(--theme-muted-text)]">
            Four loops we use when we dogfood the app. Intentionally not a feature grid.
          </p>
          <div className="nn-marketing-card mx-auto mt-8 max-w-4xl divide-y divide-[var(--border-subtle)]">
            {PLATFORM_STEPS.map((step, i) => (
              <div key={step.title} className="nn-marketing-card-pad flex gap-4 sm:gap-5">
                <span
                  className="nn-marketing-h4 shrink-0 tabular-nums text-[var(--theme-muted-text)]"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 text-left">
                  <h3 className="nn-marketing-h4">{step.title}</h3>
                  <p className="nn-marketing-body-sm mt-1.5">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 md:pl-[4%]">
          <h3 className="nn-marketing-h3 max-w-xl text-left">Inside the product</h3>
          <p className="nn-marketing-caption mt-2 max-w-prose text-left sm:text-sm">
            Screenshots from the live app. They can lag a release or two; the UI moves faster than marketing crops.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-12">
            {VALUE_SLIDE_INDICES.map((_, idx) => {
              const slide = heroSlides[idx];
              const label = VALUE_SLIDE_LABELS[idx];
              if (!slide) return null;
              const col =
                idx === 0 ? "md:col-span-7" : idx === 1 ? "md:col-span-5" : "md:col-span-10 md:col-start-2";
              return (
                <figure key={slide.objectKey} className={`nn-marketing-card overflow-hidden ${col}`}>
                  <MarketingChainScreenshot
                    objectKey={slide.objectKey}
                    publicUrl={slide.publicUrl}
                    alt={label}
                    sizes={MARKETING_SCREENSHOT_TRIPLE_SIZES}
                    fit="contain"
                    className="border-0 bg-[var(--bg-inset)] shadow-none"
                    rounded="rounded-none"
                  />
                  <figcaption className="border-t border-[var(--border-subtle)] px-3 py-2.5 text-left text-xs font-medium text-[var(--theme-muted-text)]">
                    {label}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
