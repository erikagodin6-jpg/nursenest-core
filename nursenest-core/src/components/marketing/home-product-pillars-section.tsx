"use client";

import { ArrowRight, BookOpen, ClipboardList, Layers } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";

const PILLARS = [
  { id: "cat" as const, icon: Layers, hrefKey: "cat" as const },
  { id: "questions" as const, icon: ClipboardList, hrefKey: "questions" as const },
  { id: "lessons" as const, icon: BookOpen, hrefKey: "lessons" as const },
] as const;

function pillarHref(loc: (p: string) => string, key: (typeof PILLARS)[number]["hrefKey"]): string {
  switch (key) {
    case "cat":
      return loc(HUB.practiceExams);
    case "questions":
      return loc(HUB.questionBank);
    case "lessons":
      return loc(HUB.examLessons);
    default:
      return loc(HUB.questionBank);
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
      className="border-b border-[var(--border-subtle)] bg-[var(--theme-page-bg)] py-12 md:py-16"
      aria-labelledby="home-product-pillars-heading"
      data-testid="section-product-pillars"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <h2 id="home-product-pillars-heading" className="nn-marketing-h2 text-balance text-[var(--theme-heading-text)]">
            {t("home.conversion.pillars.title")}
          </h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-xl text-pretty text-[var(--theme-muted-text)]">
            {t("home.conversion.pillars.sub")}
          </p>
        </header>

        <ul className="grid gap-5 md:grid-cols-3">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            const href = pillarHref(loc, p.hrefKey);
            return (
              <li key={p.id}>
                <MarketingTrackedLink
                  href={href}
                  event={PH.marketingHomeExploreHubClick}
                  eventProps={{ surface: "product_pillars", pillar: p.id }}
                  className="nn-card-soft nn-student-card-lift group flex h-full min-h-[13rem] flex-col p-6 transition-[border-color,box-shadow]"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--theme-primary)_22%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--theme-primary)_8%,var(--theme-card-bg))]">
                    <Icon className="h-5 w-5 text-[var(--theme-primary)]" aria-hidden strokeWidth={2} />
                  </div>
                  <h3 className="nn-marketing-h3 text-balance text-[var(--theme-heading-text)]">
                    {t(`home.conversion.pillars.${p.id}Title`)}
                  </h3>
                  <p className="nn-marketing-body-sm mt-2 flex-1 text-pretty text-[var(--theme-muted-text)]">
                    {t(`home.conversion.pillars.${p.id}Body`)}
                  </p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-[var(--nn-aesthetic-accent)]">
                    {t(`home.conversion.pillars.${p.id}Cta`)}
                    <ArrowRight className="ml-1.5 h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </MarketingTrackedLink>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
