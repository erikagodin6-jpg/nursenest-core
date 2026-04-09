"use client";

import { ArrowRight } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { marketingExamHubPath } from "@/lib/marketing/country-exam-offerings";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { HomeConversionCtaStrip } from "@/components/marketing/home-conversion-cta-strip";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";

const ORDER = ["rn", "pn", "np", "allied"] as const;

/**
 * Prominent exam selection: four large cards linking to pathway hubs (not programmatic SEO landings).
 */
export function HomeExamSelectionSection() {
  const { t, locale } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);

  const cards = ORDER.map((id) => {
    const href = loc(marketingExamHubPath(region, id));
    const titleKey =
      id === "pn"
        ? region === "US"
          ? "home.conversion.examCard.pnTitleUS"
          : "home.conversion.examCard.pnTitleCA"
        : id === "np"
          ? region === "US"
            ? "home.conversion.examCard.npTitleUS"
            : "home.conversion.examCard.npTitleCA"
          : id === "rn"
            ? "home.conversion.examCard.rnTitle"
            : "home.conversion.examCard.alliedTitle";
    const descKey =
      id === "pn"
        ? region === "US"
          ? "home.conversion.examCard.pnDescUS"
          : "home.conversion.examCard.pnDescCA"
        : id === "np"
          ? region === "US"
            ? "home.conversion.examCard.npDescUS"
            : "home.conversion.examCard.npDescCA"
          : id === "rn"
            ? "home.conversion.examCard.rnDesc"
            : "home.conversion.examCard.alliedDesc";
    const ctaKey =
      id === "rn"
        ? "home.conversion.examCard.ctaRn"
        : id === "pn"
          ? "home.conversion.examCard.ctaPn"
          : id === "np"
            ? "home.conversion.examCard.ctaNp"
            : "home.conversion.examCard.ctaAllied";

    return { id, href, titleKey, descKey, ctaKey };
  });

  return (
    <section
      id="home-exam-paths"
      className="nn-section-soft scroll-mt-20 border-b border-[var(--border-subtle)] py-12 md:py-16"
      aria-labelledby="home-exam-selection-heading"
      data-testid="section-exam-selection"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <h2 id="home-exam-selection-heading" className="nn-marketing-h2 text-balance">
            {t("home.conversion.examSelectionTitle")}
          </h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-xl text-pretty text-[var(--theme-muted-text)]">
            {t("home.conversion.examSelectionSub")}
          </p>
          <p className="nn-marketing-caption mx-auto mt-3 max-w-lg text-pretty text-[var(--theme-muted-text)]">
            {t("home.conversion.examSelectionFreeHint")}
          </p>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <li key={c.id}>
              <MarketingTrackedLink
                href={c.href}
                event={PH.marketingHomePathwayCardPrimary}
                eventProps={{ pathway: c.id, region, surface: "exam_selection" }}
                secondaryCapture={{
                  event: PH.funnelHomeToExamHub,
                  eventProps: { placement: "exam_selection_grid", pathway: c.id, region },
                }}
                data-nn-marketing-region={region}
                data-nn-exam-card-id={c.id}
                className="nn-card-soft nn-student-card-lift group flex h-full min-h-[12rem] flex-col p-5 transition hover:border-[color-mix(in_srgb,var(--theme-primary)_40%,var(--border-subtle))]"
              >
                <span className="nn-marketing-h3 text-balance">{t(c.titleKey)}</span>
                <span className="nn-marketing-body-sm mt-2 flex-1 text-[var(--theme-muted-text)]">{t(c.descKey)}</span>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-[var(--nn-aesthetic-accent)]">
                  {t(c.ctaKey)}
                  <ArrowRight className="ml-1.5 h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </MarketingTrackedLink>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-10 max-w-5xl border-t border-[var(--border-subtle)] pt-10">
          <HomeConversionCtaStrip placement="after_exam_paths" />
        </div>
      </div>
    </section>
  );
}
