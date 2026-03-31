"use client";

import Image from "next/image";
import { ArrowRight, BookOpen, Brain, CalendarCheck, ClipboardList } from "lucide-react";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import type { NursenestMarketingRegion } from "@/lib/marketing/home-hero-gateway-config";
import { HUB, rnQuestions } from "@/lib/marketing/marketing-entry-routes";
import { MARKETING_SCREENSHOT_SOURCES } from "@/lib/marketing-assets.generated";
import { PH } from "@/lib/observability/posthog-conversion-events";

const PLATFORM_STEPS: {
  icon: typeof ClipboardList;
  title: string;
  body: string;
}[] = [
  {
    icon: ClipboardList,
    title: "Pathway-scoped question bank",
    body: "Items filter by your subscription tier and country—RN, PN, NP, or allied—so you never drill the wrong scope.",
  },
  {
    icon: Brain,
    title: "Rationales on every scored item",
    body: "After you submit, see why the key is correct and why distractors fail. Built for remediation, not vibes.",
  },
  {
    icon: CalendarCheck,
    title: "Study planner + dashboard",
    body: "A structured plan for today, weak-topic shortcuts, and continue-where-you-left-off—inside /app after sign-in.",
  },
  {
    icon: BookOpen,
    title: "Readiness & weak areas",
    body: "A 0–100 readiness estimate from your sessions and mocks, plus topic-level miss signals—honest when data is thin.",
  },
];

const SCREENSHOT_KEYS: { id: keyof typeof MARKETING_SCREENSHOT_SOURCES; label: string }[] = [
  { id: "screenshot6", label: "Practice UI — topic context and scoring" },
  { id: "screenshot9", label: "Learner hub — continue, weak areas, next steps" },
  { id: "screenshot11", label: "Exams & history — timed attempts" },
];

export function HomeValueConversionSection({ region }: { region: NursenestMarketingRegion }) {
  const { locale } = useMarketingI18n();
  const loc = (path: string) => withMarketingLocale(locale, path);

  return (
    <section
      className="border-t border-[var(--theme-card-border)] bg-gradient-to-b from-primary/[0.06] via-[var(--theme-card-bg)] to-[var(--theme-muted-surface)]"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-value-platform-screens"
      aria-labelledby="value-platform-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="value-platform-heading"
            className="text-2xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-3xl"
          >
            One platform for your exam—not a random question feed
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--theme-body-text)] sm:text-lg">
            NurseNest ties <strong className="font-semibold text-[var(--theme-heading-text)]">practice questions</strong>,{" "}
            <strong className="font-semibold text-[var(--theme-heading-text)]">lessons</strong>,{" "}
            <strong className="font-semibold text-[var(--theme-heading-text)]">timed mocks</strong>, and{" "}
            <strong className="font-semibold text-[var(--theme-heading-text)]">readiness tracking</strong> to the license track
            you select (US/Canada, RN/PN/NP). Server-side gates mean your bank always matches your plan.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <MarketingTrackedLink
            href={loc("/signup")}
            event={PH.marketingHomeHeroPrimaryCta}
            eventProps={{ region, surface: "value_section" }}
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-md transition hover:brightness-110"
          >
            Start free — unlock full prep at checkout
            <ArrowRight className="ml-2 h-5 w-5" />
          </MarketingTrackedLink>
          <MarketingTrackedLink
            href={loc(HUB.pricing)}
            event={PH.marketingHomeExploreHubClick}
            eventProps={{ hub: "pricing" }}
            className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-primary/30 bg-card px-8 py-3 text-base font-semibold text-[var(--theme-heading-text)] hover:bg-[var(--theme-muted-surface)]"
          >
            Compare plans & pricing
          </MarketingTrackedLink>
          <MarketingTrackedLink
            href={loc(rnQuestions(region))}
            event={PH.marketingHomeHeroSecondaryCta}
            eventProps={{ region, destination: "rn_questions", surface: "value_section" }}
            className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-[var(--theme-card-border)] px-8 py-3 text-base font-medium text-[var(--theme-body-text)] hover:border-primary/35"
          >
            Try sample questions first
          </MarketingTrackedLink>
        </div>

        <div className="mt-14">
          <h3 className="text-center text-sm font-bold uppercase tracking-wider text-primary">How NurseNest works</h3>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-[var(--theme-muted-text)]">
            Four loops you will actually use in the app—no feature laundry list.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLATFORM_STEPS.map((step) => (
              <li
                key={step.title}
                className="rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 text-left shadow-[var(--shadow-card)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" aria-hidden />
                </div>
                <p className="mt-3 text-sm font-bold text-[var(--theme-heading-text)]">{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]">{step.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16">
          <h3 className="text-center text-lg font-bold text-[var(--theme-heading-text)] sm:text-xl">Inside the product</h3>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-[var(--theme-muted-text)]">
            Real UI captures from the live app (content updates as we ship).
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {SCREENSHOT_KEYS.map(({ id, label }) => {
              const bundle = MARKETING_SCREENSHOT_SOURCES[id];
              if (!bundle) return null;
              return (
                <figure key={id} className="overflow-hidden rounded-2xl border border-[var(--theme-card-border)] bg-card shadow-[var(--shadow-card)]">
                  <div className="relative aspect-[16/10] w-full bg-[var(--theme-muted-surface)]">
                    <Image
                      src={bundle.fallback}
                      alt={label}
                      width={bundle.width}
                      height={bundle.height}
                      className="h-full w-full object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <figcaption className="border-t border-[var(--theme-card-border)] px-3 py-2.5 text-center text-xs font-medium text-[var(--theme-muted-text)]">
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
