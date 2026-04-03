"use client";

import { ArrowRight } from "lucide-react";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import type { NursenestMarketingRegion } from "@/lib/marketing/home-hero-gateway-config";
import { HUB, rnQuestions } from "@/lib/marketing/marketing-entry-routes";
import { MARKETING_SCREENSHOT_SOURCES } from "@/lib/marketing-assets.generated";
import { MARKETING_SCREENSHOT_TRIPLE_SIZES, marketingScreenshotBundleDisplaySrc } from "@/lib/marketing-image-delivery";
import { MarketingCdnScreenshot } from "@/components/marketing/marketing-cdn-screenshot";
import { PH } from "@/lib/observability/posthog-conversion-events";

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

const SCREENSHOT_KEYS: { id: keyof typeof MARKETING_SCREENSHOT_SOURCES; label: string }[] = [
  { id: "screenshot6", label: "Practice UI: topic context and scoring" },
  { id: "screenshot9", label: "Learner hub: continue, weak areas, next steps" },
  { id: "screenshot11", label: "Exams and history: timed attempts" },
];

export function HomeValueConversionSection({ region }: { region: NursenestMarketingRegion }) {
  const { locale } = useMarketingI18n();
  const loc = (path: string) => withMarketingLocale(locale, path);

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

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <MarketingTrackedLink
            href={loc("/signup")}
            event={PH.marketingHomeHeroPrimaryCta}
            eventProps={{ region, surface: "value_section" }}
            className="nn-btn-primary inline-flex min-h-[48px] w-full min-w-[min(100%,16rem)] items-center justify-center px-8 py-3 text-base font-semibold sm:w-auto"
          >
            Start free, unlock full prep at checkout
            <ArrowRight className="ml-2 h-5 w-5" />
          </MarketingTrackedLink>
          <MarketingTrackedLink
            href={loc(HUB.pricing)}
            event={PH.marketingHomeExploreHubClick}
            eventProps={{ hub: "pricing" }}
            className="nn-btn-secondary inline-flex min-h-[48px] w-full items-center justify-center px-8 py-3 text-base font-semibold sm:w-auto"
          >
            Compare plans & pricing
          </MarketingTrackedLink>
        </div>
        <p className="mt-4 text-center">
          <MarketingTrackedLink
            href={loc(rnQuestions(region))}
            event={PH.marketingHomeHeroSecondaryCta}
            eventProps={{ region, destination: "rn_questions", surface: "value_section" }}
            className="nn-link-quiet text-sm"
          >
            Try sample questions first
          </MarketingTrackedLink>
        </p>

        <div className="mt-14">
          <p className="nn-marketing-eyebrow text-center">How NurseNest works</p>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-[var(--theme-muted-text)]">
            Four loops we use when we dogfood the app. Intentionally not a feature grid.
          </p>
          <div className="nn-marketing-card mx-auto mt-8 max-w-4xl divide-y divide-[var(--border-subtle)]">
            {PLATFORM_STEPS.map((step, i) => (
              <div key={step.title} className="nn-marketing-card-pad flex gap-4 sm:gap-5">
                <span
                  className="shrink-0 tabular-nums text-sm font-bold text-[var(--theme-muted-text)]"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 text-left">
                  <h3 className="text-sm font-semibold text-[var(--theme-heading-text)] sm:text-base">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--theme-body-text)]">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 md:pl-[4%]">
          <h3 className="nn-marketing-h2 max-w-xl text-left text-xl sm:text-2xl">Inside the product</h3>
          <p className="mt-2 max-w-prose text-left text-sm text-[var(--theme-muted-text)]">
            Screenshots from the live app. They can lag a release or two; the UI moves faster than marketing crops.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-12">
            {SCREENSHOT_KEYS.map(({ id, label }, idx) => {
              const bundle = MARKETING_SCREENSHOT_SOURCES[id];
              if (!bundle) return null;
              const col =
                idx === 0 ? "md:col-span-7" : idx === 1 ? "md:col-span-5" : "md:col-span-10 md:col-start-2";
              return (
                <figure key={id} className={`nn-marketing-card overflow-hidden ${col}`}>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg-inset)]">
                    <MarketingCdnScreenshot
                      src={marketingScreenshotBundleDisplaySrc(bundle)}
                      srcSet={bundle.srcSet}
                      sizes={MARKETING_SCREENSHOT_TRIPLE_SIZES}
                      alt={label}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                  </div>
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
