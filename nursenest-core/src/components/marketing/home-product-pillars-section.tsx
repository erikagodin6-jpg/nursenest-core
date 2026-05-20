"use client";

import { ArrowRight, BookOpen, ClipboardList, Layers } from "lucide-react";

import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { HomeConversionCtaStrip } from "@/components/marketing/home-conversion-cta-strip";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  formatEyebrow,
  formatSentenceCase,
  formatTitleCase,
} from "@/lib/format/text-case";

const PILLARS = [
  { id: "cat", icon: Layers, hrefKey: "cat", label: "CAT" },
  { id: "questions", icon: ClipboardList, hrefKey: "questions", label: "Questions" },
  { id: "lessons", icon: BookOpen, hrefKey: "lessons", label: "Lessons" },
] as const;

type PillarHrefKey = (typeof PILLARS)[number]["hrefKey"];

function safeT(t: (key: string) => string, key: string, fallback: string): string {
  try {
    const value = t(key);
    return value && value !== key ? value : fallback;
  } catch {
    return fallback;
  }
}

function pillarHref(loc: (path: string) => string, key: PillarHrefKey): string {
  switch (key) {
    case "cat":
      return loc(HUB.practiceExams);
    case "questions":
      return loc(HUB.questionBank);
    case "lessons":
      return loc(HUB.examLessons);
  }
}

/**
 * Three core product pillars — CAT/practice exams, question bank, lessons — with clear entry links.
 */
export function HomeProductPillarsSection() {
  const { t, locale } = useMarketingI18n();
  const loc = (path: string) => withMarketingLocale(locale, path);

  return (
    <section
      className="nn-section-block border-b border-[var(--border)] bg-[var(--page-bg)]"
      aria-labelledby="home-product-pillars-heading"
      data-testid="section-product-pillars"
    >
      <div className="nn-section-shell">
        <header className="mx-auto mb-12 max-w-2xl text-center">
          <h2
            id="home-product-pillars-heading"
            className="nn-marketing-h2 text-balance text-[var(--theme-heading-text)]"
          >
            {safeT(
              t,
              "home.conversion.pillars.title",
              "Practice smarter with NurseNest",
            )}
          </h2>

          <p className="nn-marketing-body mx-auto mt-2 max-w-xl text-pretty text-[var(--theme-muted-text)]">
            {safeT(
              t,
              "home.conversion.pillars.sub",
              "Use lessons, questions, and adaptive practice to prepare with confidence.",
            )}
          </p>
        </header>

        <ul className="grid gap-5 md:grid-cols-3">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            const href = pillarHref(loc, pillar.hrefKey);

            return (
              <li key={pillar.id}>
                <MarketingTrackedLink
                  href={href}
                  event={PH.marketingHomeExploreHubClick}
                  eventProps={{
                    surface: "product_pillars",
                    pillar: pillar.id,
                  }}
                  className="nn-card-system nn-card-system-pad nn-card-system--interactive nn-student-card-lift group h-full min-h-[13rem]"
                >
                  <div className="nn-card-system__icon">
                    <Icon
                      className="h-5 w-5 text-[var(--theme-primary)]"
                      aria-hidden
                      strokeWidth={2}
                    />
                  </div>

                  <p className="nn-card-system__eyebrow">
                    {formatEyebrow(pillar.label, locale)}
                  </p>

                  <h3 className="nn-card-system__title">
                    {formatTitleCase(
                      safeT(
                        t,
                        `home.conversion.pillars.${pillar.id}Title`,
                        pillar.label,
                      ),
                      locale,
                    )}
                  </h3>

                  <p className="nn-card-system__description">
                    {formatSentenceCase(
                      safeT(
                        t,
                        `home.conversion.pillars.${pillar.id}Body`,
                        "Build exam readiness with focused study tools.",
                      ),
                      locale,
                    )}
                  </p>

                  <span className="nn-card-system__cta">
                    {formatTitleCase(
                      safeT(
                        t,
                        `home.conversion.pillars.${pillar.id}Cta`,
                        "Explore",
                      ),
                      locale,
                    )}
                    <ArrowRight
                      className="ml-1.5 h-4 w-4 transition group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </MarketingTrackedLink>
              </li>
            );
          })}
        </ul>

        <div className="mx-auto mt-12 max-w-5xl border-t border-[var(--border-subtle)] pt-10">
          <HomeConversionCtaStrip placement="after_pillars" />
        </div>
      </div>
    </section>
  );
}