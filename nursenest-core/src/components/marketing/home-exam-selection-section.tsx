"use client";

import { ArrowRight, Stethoscope, HeartPulse, Award, Dna } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { marketingExamHubPath } from "@/lib/marketing/country-exam-offerings";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { formatEyebrow, formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { getPathwayHubCta } from "@/lib/copy/cta-copy";
import type { LucideIcon } from "lucide-react";

type ExamCard = {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  accentColor: string;
  titleKey: string;
  descKey: string;
  pathwayLabel: string;
  metaKey: string;
  href: string;
  featured?: boolean;
};

/**
 * Prominent exam selection: four rich pathway cards — RN, LPN/RPN, NP, Allied.
 * Each card has a colored top accent and semantic icon for immediate visual differentiation.
 * Section uses white background so cards elevate clearly from the page.
 */
export function HomeExamSelectionSection() {
  const { t, locale } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);

  const cards: ExamCard[] = [
    {
      id: "rn",
      icon: Stethoscope,
      iconColor: "text-[var(--semantic-info)]",
      accentColor: "var(--semantic-info)",
      titleKey: "home.conversion.examCard.rnTitle",
      descKey: "home.conversion.examCard.rnDesc",
      pathwayLabel: "RN",
      metaKey: "home.conversion.examCard.metaRn",
      href: loc(marketingExamHubPath(region, "rn")),
      featured: true,
    },
    {
      id: "pn",
      icon: HeartPulse,
      iconColor: "text-[var(--semantic-warning)]",
      accentColor: "var(--semantic-warning)",
      titleKey: region === "US" ? "home.conversion.examCard.pnTitleUS" : "home.conversion.examCard.pnTitleCA",
      descKey: region === "US" ? "home.conversion.examCard.pnDescUS" : "home.conversion.examCard.pnDescCA",
      pathwayLabel: "PN",
      metaKey: region === "US" ? "home.conversion.examCard.metaPnUS" : "home.conversion.examCard.metaPnCA",
      href: loc(marketingExamHubPath(region, "pn")),
    },
    {
      id: "np",
      icon: Award,
      iconColor: "text-[var(--semantic-brand)]",
      accentColor: "var(--semantic-brand)",
      titleKey: region === "US" ? "home.conversion.examCard.npTitleUS" : "home.conversion.examCard.npTitleCA",
      descKey: region === "US" ? "home.conversion.examCard.npDescUS" : "home.conversion.examCard.npDescCA",
      pathwayLabel: "NP",
      metaKey: region === "US" ? "home.conversion.examCard.metaNpUS" : "home.conversion.examCard.metaNpCA",
      href: loc(marketingExamHubPath(region, "np")),
    },
    {
      id: "allied",
      icon: Dna,
      iconColor: "text-[var(--semantic-success)]",
      accentColor: "var(--semantic-success)",
      titleKey: "home.conversion.examCard.alliedTitle",
      descKey: "home.conversion.examCard.alliedDesc",
      pathwayLabel: "Allied Health",
      metaKey: "home.conversion.examCard.metaAllied",
      href: loc(marketingExamHubPath(region, "allied")),
    },
  ];

  return (
    <section
      id="home-exam-paths"
      className="nn-section-block scroll-mt-20 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]"
      aria-labelledby="home-exam-selection-heading"
      data-testid="section-exam-selection"
    >
      <div className="nn-section-shell">
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <h2 id="home-exam-selection-heading" className="nn-marketing-h2 text-balance">
            {formatTitleCase("Choose Your Exam Hub", locale)}
          </h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-xl text-pretty text-[var(--theme-muted-text)]">
            {formatSentenceCase(t("home.conversion.examSelectionSub"), locale)}
          </p>
        </header>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <li key={c.id} className={c.featured ? "sm:col-span-2 lg:col-span-1" : undefined}>
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
                  className="nn-card-system nn-card-system--interactive nn-student-card-lift group relative h-full min-h-[14rem] overflow-hidden"
                  style={{ paddingTop: "1.625rem" }}
                >
                  {/* Top accent stripe */}
                  <div
                    className="absolute inset-x-0 top-0 h-[3px]"
                    style={{ background: `color-mix(in srgb, ${c.accentColor} 90%, white)` }}
                    aria-hidden
                  />
                  <div className="nn-card-system-pad pt-0">
                    {/* Icon badge — colored per pathway */}
                    <span
                      className="nn-card-system__icon mb-1 transition group-hover:scale-105"
                      style={{
                        background: `color-mix(in srgb, ${c.accentColor} 10%, var(--bg-card))`,
                        borderColor: `color-mix(in srgb, ${c.accentColor} 24%, var(--border-subtle))`,
                      }}
                      aria-hidden
                    >
                      <Icon className={`h-5 w-5 ${c.iconColor}`} />
                    </span>

                    {/* Exam label chip */}
                    <span className="nn-card-system__eyebrow">
                      {formatEyebrow(t(c.metaKey), locale)}
                    </span>

                    <span className="nn-card-system__title">{formatTitleCase(t(c.titleKey), locale)}</span>
                    <span className="nn-card-system__description">{formatSentenceCase(t(c.descKey), locale)}</span>

                    <span className="nn-card-system__cta">
                      {formatTitleCase(getPathwayHubCta(c.pathwayLabel), locale)}
                      <ArrowRight className="ml-1.5 h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                    </span>
                  </div>
                </MarketingTrackedLink>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
